import { CountyData } from '../data/illinois-counties';

/**
 * Professional Growing Degree Unit (GDU) Calculator
 * Based on University of Illinois and USDA research
 */

export interface GDUCalculationParams {
  maxTemp: number;
  minTemp: number;
  baseTemp: number;
  capTemp: number;
  method: 'modified' | 'standard';
}

export interface CornGrowthStage {
  stage: string;
  code: string;
  gduRequired: number;
  description: string;
  criticalFactors: string[];
  yieldImpact: number; // 0-1 multiplier
}

export interface YieldFactors {
  soilMoisture: number; // 0-1 (0 = drought, 1 = optimal)
  nitrogen: number; // lbs/acre
  phosphorus: number; // lbs/acre
  potassium: number; // lbs/acre
  plantPopulation: number; // plants per acre
  diseasePress: number; // 0-1 (0 = no disease, 1 = severe)
  insectPress: number; // 0-1 (0 = no insects, 1 = severe)
  weedPress: number; // 0-1 (0 = no weeds, 1 = severe)
}

export class ProfessionalGDUCalculator {
  private readonly BASE_TEMP = 50; // °F
  private readonly CAP_TEMP = 86; // °F for corn
  
  // University of Illinois corn growth stages with accurate GDU requirements
  private readonly GROWTH_STAGES: CornGrowthStage[] = [
    {
      stage: 'Emergence',
      code: 'VE',
      gduRequired: 115,
      description: 'Coleoptile breaks soil surface',
      criticalFactors: ['soil temperature', 'soil moisture', 'planting depth'],
      yieldImpact: 0.85
    },
    {
      stage: '2-Leaf',
      code: 'V2',
      gduRequired: 200,
      description: 'Second leaf collar visible',
      criticalFactors: ['nitrogen availability', 'root development'],
      yieldImpact: 0.90
    },
    {
      stage: '4-Leaf',
      code: 'V4',
      gduRequired: 350,
      description: 'Fourth leaf collar visible',
      criticalFactors: ['moisture stress', 'nitrogen uptake'],
      yieldImpact: 0.92
    },
    {
      stage: '6-Leaf',
      code: 'V6',
      gduRequired: 500,
      description: 'Sixth leaf collar visible, rapid growth begins',
      criticalFactors: ['nutrient availability', 'moisture', 'temperature'],
      yieldImpact: 0.95
    },
    {
      stage: '8-Leaf',
      code: 'V8',
      gduRequired: 650,
      description: 'Eighth leaf collar visible',
      criticalFactors: ['moisture stress sensitivity increases'],
      yieldImpact: 0.95
    },
    {
      stage: '10-Leaf',
      code: 'V10',
      gduRequired: 850,
      description: 'Tenth leaf collar visible',
      criticalFactors: ['ear shoot development', 'moisture critical'],
      yieldImpact: 0.96
    },
    {
      stage: '12-Leaf',
      code: 'V12',
      gduRequired: 1050,
      description: 'Twelfth leaf collar visible',
      criticalFactors: ['ear size determination', 'stress sensitivity peak'],
      yieldImpact: 0.97
    },
    {
      stage: 'Tasseling',
      code: 'VT',
      gduRequired: 1400,
      description: 'Tassel emergence and pollen shed',
      criticalFactors: ['moisture stress critical', 'heat stress', 'pollination'],
      yieldImpact: 0.85
    },
    {
      stage: 'Silking',
      code: 'R1',
      gduRequired: 1450,
      description: 'Silks emerge from ear shoots',
      criticalFactors: ['moisture critical', 'pollination window', 'heat stress'],
      yieldImpact: 0.80
    },
    {
      stage: 'Blister',
      code: 'R2',
      gduRequired: 1650,
      description: 'Kernels resemble blisters, rapid grain fill begins',
      criticalFactors: ['moisture for grain fill', 'nutrient availability'],
      yieldImpact: 0.90
    },
    {
      stage: 'Milk',
      code: 'R3',
      gduRequired: 1850,
      description: 'Kernels contain milky fluid',
      criticalFactors: ['moisture stress affects grain fill', 'disease pressure'],
      yieldImpact: 0.95
    },
    {
      stage: 'Dough',
      code: 'R4',
      gduRequired: 2050,
      description: 'Grain fill continues, kernel moisture ~70%',
      criticalFactors: ['continued moisture needs', 'disease/insect pressure'],
      yieldImpact: 0.98
    },
    {
      stage: 'Dent',
      code: 'R5',
      gduRequired: 2450,
      description: 'Kernels begin to dent, ~55% moisture',
      criticalFactors: ['grain fill completion', 'premature death prevention'],
      yieldImpact: 0.99
    },
    {
      stage: 'Maturity',
      code: 'R6',
      gduRequired: 2700,
      description: 'Black layer formation, physiological maturity',
      criticalFactors: ['harvest timing', 'field drying'],
      yieldImpact: 1.0
    }
  ];

  /**
   * Calculate daily GDU using the modified method (University of Illinois standard)
   */
  calculateDailyGDU(maxTemp: number, minTemp: number): number {
    // Cap temperatures
    const cappedMax = Math.min(maxTemp, this.CAP_TEMP);
    const cappedMin = Math.max(minTemp, this.BASE_TEMP);
    
    // If max temp is below base temp, no GDU accumulation
    if (maxTemp <= this.BASE_TEMP) return 0;
    
    // Modified calculation method
    const avgTemp = (cappedMax + cappedMin) / 2;
    return Math.max(0, avgTemp - this.BASE_TEMP);
  }

  /**
   * Calculate initial GDU based on county soil and environmental factors
   */
  calculateInitialGDU(countyData: CountyData, plantingFactors: {
    plantingDate: Date;
    plantingDepth: number; // inches
    seedTreatment: boolean;
    soilTemp: number;
  }): number {
    let initialGDU = 0;

    // Soil temperature adjustment
    if (plantingFactors.soilTemp >= 50) {
      initialGDU += 25;
    } else if (plantingFactors.soilTemp >= 45) {
      initialGDU += 15;
    }

    // Planting depth adjustment (USDA research)
    if (plantingFactors.plantingDepth > 2) {
      initialGDU -= (plantingFactors.plantingDepth - 2) * 15;
    }

    // Soil drainage class adjustment
    switch (countyData.soilData.drainageClass) {
      case 'Well-drained':
        initialGDU += 20;
        break;
      case 'Moderately well-drained':
        initialGDU += 10;
        break;
      case 'Somewhat poorly drained':
        initialGDU += 0;
        break;
      case 'Poorly drained':
        initialGDU -= 15;
        break;
    }

    // Seed treatment bonus
    if (plantingFactors.seedTreatment) {
      initialGDU += 10;
    }

    // Optimal planting date (May 1-15 for Illinois)
    const optimalStart = new Date(plantingFactors.plantingDate.getFullYear(), 4, 1); // May 1
    const optimalEnd = new Date(plantingFactors.plantingDate.getFullYear(), 4, 15); // May 15
    
    if (plantingFactors.plantingDate >= optimalStart && plantingFactors.plantingDate <= optimalEnd) {
      initialGDU += 15;
    } else if (plantingFactors.plantingDate < optimalStart) {
      const daysDiff = Math.floor((optimalStart.getTime() - plantingFactors.plantingDate.getTime()) / (1000 * 60 * 60 * 24));
      initialGDU -= daysDiff * 2; // Penalty for early planting
    } else {
      const daysDiff = Math.floor((plantingFactors.plantingDate.getTime() - optimalEnd.getTime()) / (1000 * 60 * 60 * 24));
      initialGDU -= daysDiff * 1.5; // Penalty for late planting
    }

    return Math.max(0, initialGDU);
  }

  /**
   * Calculate potential yield based on University of Illinois yield equations
   */
  calculatePotentialYield(
    countyData: CountyData,
    totalGDU: number,
    yieldFactors: YieldFactors
  ): number {
    // Base potential yield for the county
    let potentialYield = countyData.production.averageYield;

    // GDU-based yield adjustment
    const gduEfficiency = Math.min(1.0, totalGDU / 2700); // Optimal GDU for corn
    potentialYield *= gduEfficiency;

    // Soil quality adjustment
    const soilRating = countyData.soilData.cornSuitabilityRating / 100;
    potentialYield *= (0.7 + 0.3 * soilRating);

    // Moisture stress adjustment (critical factor)
    potentialYield *= (0.4 + 0.6 * yieldFactors.soilMoisture);

    // Plant population adjustment (optimal: 32,000-36,000 plants/acre)
    const popOptimal = 34000;
    const popFactor = Math.min(1.0, yieldFactors.plantPopulation / popOptimal);
    potentialYield *= popFactor;

    // Nutrient adjustments (Liebig's Law of the Minimum)
    const nFactor = Math.min(1.0, yieldFactors.nitrogen / 180); // Optimal N rate
    const pFactor = Math.min(1.0, yieldFactors.phosphorus / 40); // Optimal P rate  
    const kFactor = Math.min(1.0, yieldFactors.potassium / 160); // Optimal K rate
    const nutrientFactor = Math.min(nFactor, pFactor, kFactor);
    potentialYield *= (0.6 + 0.4 * nutrientFactor);

    // Pest pressure adjustments
    potentialYield *= (1 - yieldFactors.diseasePress * 0.3);
    potentialYield *= (1 - yieldFactors.insectPress * 0.25);
    potentialYield *= (1 - yieldFactors.weedPress * 0.4);

    return Math.round(potentialYield * 100) / 100;
  }

  /**
   * Get current growth stage based on accumulated GDU
   */
  getCurrentGrowthStage(totalGDU: number): CornGrowthStage | null {
    for (let i = this.GROWTH_STAGES.length - 1; i >= 0; i--) {
      if (totalGDU >= this.GROWTH_STAGES[i].gduRequired) {
        return this.GROWTH_STAGES[i];
      }
    }
    return null;
  }

  /**
   * Get next growth stage
   */
  getNextGrowthStage(totalGDU: number): CornGrowthStage | null {
    for (const stage of this.GROWTH_STAGES) {
      if (totalGDU < stage.gduRequired) {
        return stage;
      }
    }
    return null;
  }

  /**
   * Calculate days to next growth stage
   */
  getDaysToNextStage(currentGDU: number, averageDailyGDU: number): number {
    const nextStage = this.getNextGrowthStage(currentGDU);
    if (!nextStage) return 0;
    
    const gduNeeded = nextStage.gduRequired - currentGDU;
    return Math.ceil(gduNeeded / averageDailyGDU);
  }

  /**
   * Get all growth stages for reference
   */
  getAllGrowthStages(): CornGrowthStage[] {
    return [...this.GROWTH_STAGES];
  }

  /**
   * Calculate stress impact on yield
   */
  calculateStressImpact(
    stressType: 'drought' | 'heat' | 'flooding' | 'hail' | 'frost',
    severity: number, // 0-1
    growthStage: CornGrowthStage
  ): number {
    const baseImpact = {
      drought: 0.6,
      heat: 0.4,
      flooding: 0.3,
      hail: 0.8,
      frost: 0.9
    };

    // Critical growth stages have higher impact
    const criticalMultiplier = ['VT', 'R1', 'R2'].includes(growthStage.code) ? 1.5 : 1.0;
    
    return baseImpact[stressType] * severity * criticalMultiplier * (1 - growthStage.yieldImpact);
  }
}