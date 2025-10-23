import { EnvironmentalFactors, GrowthStages, DroughtConditions } from './types';

export class GDUCalculator {
  private baseTemp = 50;

  calculateDailyGDU(maxTemp: number, minTemp: number): number {
    const avgTemp = (maxTemp + minTemp) / 2;
    return Math.max(0, avgTemp - this.baseTemp);
  }

  calculateInitialGDU(environmentalFactors: EnvironmentalFactors): number {
    let initialGDU = 0;

    // Add random base GDU (30-60)
    initialGDU += Math.floor(Math.random() * 30) + 30;

    // Soil texture adjustment
    if (environmentalFactors.soilTexture === 'fine') {
      initialGDU += Math.floor(Math.random() * 30) + 30;
    }

    // Planting date adjustment
    if (environmentalFactors.plantingDate === 'before') {
      initialGDU += 15;
    }

    // Seeding depth adjustment
    const depthMap: Record<string, number> = {
      'one': 0,
      'two': 0,
      'three': 15,
      'four': 30
    };
    initialGDU += depthMap[environmentalFactors.seedingDepth] || 0;

    return initialGDU;
  }

  updateGrowthStages(gdu: number, currentStages: GrowthStages): GrowthStages {
    const newStages = { ...currentStages };

    if (gdu >= 115 && !newStages.VE) newStages.VE = true;
    if (gdu >= 200 && !newStages.V2) newStages.V2 = true;
    if (gdu >= 350 && !newStages.V3) newStages.V3 = true;
    if (gdu >= 600 && !newStages.V6) newStages.V6 = true;
    if (gdu >= 850 && !newStages.V8) newStages.V8 = true;
    if (gdu >= 1100 && !newStages.V10) newStages.V10 = true;
    if (gdu >= 1400 && !newStages.VT) newStages.VT = true;
    if (gdu >= 1700 && !newStages.R2) newStages.R2 = true;
    if (gdu >= 2000 && !newStages.R4) newStages.R4 = true;
    if (gdu >= 2300 && !newStages.R5) newStages.R5 = true;
    if (gdu >= 2700 && !newStages.R6) newStages.R6 = true;

    return newStages;
  }

  calculateYield(gdu: number, environmentalFactors: EnvironmentalFactors, droughtConditions: DroughtConditions): number {
    let baseYield = 180; // Base yield in bushels per acre

    // GDU-based yield calculation
    if (gdu >= 2700) {
      baseYield = 180;
    } else if (gdu >= 2300) {
      baseYield = 160;
    } else if (gdu >= 2000) {
      baseYield = 140;
    } else if (gdu >= 1700) {
      baseYield = 120;
    } else if (gdu >= 1400) {
      baseYield = 100;
    } else if (gdu >= 1100) {
      baseYield = 80;
    } else {
      baseYield = Math.max(20, gdu / 14);
    }

    // Environmental factor adjustments
    if (environmentalFactors.soilTexture === 'coarse') baseYield *= 0.9;
    if (environmentalFactors.seedZone === 'suboptimal') baseYield *= 0.85;
    if (environmentalFactors.seedBed === 'poor') baseYield *= 0.8;

    // Drought adjustments
    if (droughtConditions.extreme) baseYield *= 0.4;
    else if (droughtConditions.severe) baseYield *= 0.6;
    else if (droughtConditions.moderate) baseYield *= 0.8;

    return Math.round(baseYield * 100) / 100;
  }
}