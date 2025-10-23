import { CountyData } from '../data/illinois-counties';
import { ProfessionalGDUCalculator, YieldFactors } from '../core/gdu-calculator-pro';
import { IllinoisCountyMap } from '../components/illinois-county-map';
import { EducationalContent } from '../components/educational-content';
// import { CornField3D } from '../components/corn-field-3d';

interface SimulationState {
  selectedCounty: CountyData | null;
  currentDay: number;
  totalGDU: number;
  currentGrowthStage: number;
  plantingDate: Date;
  yieldFactors: YieldFactors;
  isRunning: boolean;
  speed: number;
}

export class CornViewApplication {
  private app: HTMLElement;
  private state!: SimulationState;
  private gduCalculator: ProfessionalGDUCalculator;
  private countyMap!: IllinoisCountyMap;
  private educationalContent!: EducationalContent;
  // private cornField3D: CornField3D | null = null;
  private animationId: number | null = null;
  private simulationData: Array<{day: number, gdu: number, stage: string, yield: number}> = [];

  constructor() {
    this.app = document.getElementById('app')!;
    this.gduCalculator = new ProfessionalGDUCalculator();
    this.initializeState();
    this.initializeUI();
  }

  private initializeState(): void {
    const currentYear = new Date().getFullYear();
    this.state = {
      selectedCounty: null,
      currentDay: 1,
      totalGDU: 0,
      currentGrowthStage: 0,
      plantingDate: new Date(currentYear, 4, 10), // May 10th
      yieldFactors: {
        soilMoisture: 1.0, // Optimal moisture conditions
        nitrogen: 180,
        phosphorus: 40,
        potassium: 160,
        plantPopulation: 34000,
        diseasePress: 0.0, // No disease pressure
        insectPress: 0.0,  // No insect pressure
        weedPress: 0.0     // No weed pressure
      },
      isRunning: false,
      speed: 1
    };
  }

  private initializeUI(): void {
    this.app.innerHTML = `
      <div class="cornview-app">
        <!-- Header -->
        <header class="app-header">
          <div class="header-content">
            <div class="logo-section">
              <h1>CornView Illinois</h1>
              <p>Professional Corn Production Simulation & Analysis</p>
            </div>
            <div class="header-stats">
              <div class="stat-item">
                <span class="stat-label">Selected County</span>
                <span class="stat-value" id="selected-county">None Selected</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Total GDU</span>
                <span class="stat-value" id="total-gdu">0</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Growth Stage</span>
                <span class="stat-value" id="growth-stage">Pre-Emergence</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Predicted Yield</span>
                <span class="stat-value" id="predicted-yield">-- bu/acre</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="app-main">
          <!-- Step 1: County Selection -->
          <section class="step-section ${this.state.selectedCounty ? 'completed' : 'active'}" id="county-selection">
            <div class="step-header">
              <h2><span class="step-number">1</span> Select Illinois County</h2>
              <p>Choose a county to analyze corn production potential and run simulations</p>
            </div>
            <div id="county-map-container"></div>
          </section>

          <!-- Step 2: Simulation Configuration -->
          <section class="step-section ${this.state.selectedCounty ? 'active' : 'disabled'}" id="simulation-config">
            <div class="step-header">
              <h2><span class="step-number">2</span> Configure Simulation</h2>
              <p>Set planting conditions and environmental factors</p>
            </div>
            
            <div class="config-grid">
              <div class="config-panel">
                <h3>Planting Conditions</h3>
                <div class="form-group">
                  <label for="planting-date">Planting Date:</label>
                  <input type="date" id="planting-date" value="${this.formatDate(this.state.plantingDate)}">
                </div>
                <div class="form-group">
                  <label for="planting-depth">Planting Depth (inches):</label>
                  <select id="planting-depth">
                    <option value="1.5">1.5 inches</option>
                    <option value="2" selected>2.0 inches</option>
                    <option value="2.5">2.5 inches</option>
                    <option value="3">3.0 inches</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="plant-population">Plant Population (plants/acre):</label>
                  <input type="range" id="plant-population" min="30000" max="38000" value="34000" step="1000">
                  <span id="population-display">34,000</span>
                </div>
              </div>

              <div class="config-panel">
                <h3>Nutrient Management</h3>
                <div class="form-group">
                  <label for="nitrogen-rate">Nitrogen Rate (lbs/acre):</label>
                  <input type="range" id="nitrogen-rate" min="120" max="220" value="180" step="10">
                  <span id="nitrogen-display">180</span>
                </div>
                <div class="form-group">
                  <label for="phosphorus-rate">Phosphorus Rate (lbs/acre):</label>
                  <input type="range" id="phosphorus-rate" min="20" max="60" value="40" step="5">
                  <span id="phosphorus-display">40</span>
                </div>
                <div class="form-group">
                  <label for="potassium-rate">Potassium Rate (lbs/acre):</label>
                  <input type="range" id="potassium-rate" min="100" max="200" value="160" step="10">
                  <span id="potassium-display">160</span>
                </div>
              </div>

              <div class="config-panel">
                <h3>Environmental Conditions</h3>
                <div class="form-group">
                  <label for="soil-moisture">Soil Moisture Level:</label>
                  <select id="soil-moisture">
                    <option value="0.4">Drought Stress</option>
                    <option value="0.6">Dry Conditions</option>
                    <option value="0.8" selected>Adequate Moisture</option>
                    <option value="1.0">Optimal Moisture</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="disease-pressure">Disease Pressure:</label>
                  <select id="disease-pressure">
                    <option value="none" selected>None</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="insect-pressure">Insect Pressure:</label>
                  <select id="insect-pressure">
                    <option value="none" selected>None</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <!-- Step 3: Simulation Visualization -->
          <section class="step-section ${this.state.selectedCounty ? 'active' : 'disabled'}" id="simulation-viz">
            <div class="step-header">
              <h2><span class="step-number">3</span> Run Simulation</h2>
              <p>Watch corn growth progression and analyze yield predictions</p>
            </div>
            
            <div class="simulation-controls">
              <button id="play-simulation" class="control-btn primary">▶ Start Simulation</button>
              <button id="pause-simulation" class="control-btn" disabled>⏸ Pause</button>
              <button id="reset-simulation" class="control-btn">🔄 Reset</button>
              <div class="speed-control">
                <label for="simulation-speed">Speed:</label>
                <input type="range" id="simulation-speed" min="1" max="10" value="5">
                <span id="speed-display">5x</span>
              </div>
            </div>

            <div class="visualization-container">
              <div class="field-visualization-expanded">
                <h3>Corn Field Visualization</h3>
                <div id="corn-field-display"></div>
              </div>
            </div>

            <div class="current-conditions">
              <div class="condition-card">
                <h4>Current Growth Stage</h4>
                <div id="current-stage-info">
                  <p>Stage: <span id="stage-name">Pre-Emergence</span></p>
                  <p>Description: <span id="stage-description">Waiting for emergence</span></p>
                </div>
              </div>
              
              <div class="condition-card">
                <h4>Weather Conditions</h4>
                <div id="weather-info">
                  <p>Temperature: <span id="current-temp">--°F</span></p>
                  <p>Daily GDU: <span id="daily-gdu">--</span></p>
                </div>
              </div>
              
              <div class="condition-card">
                <h4>Yield Prediction</h4>
                <div id="yield-info">
                  <p>Current: <span id="current-yield">-- bu/acre</span></p>
                  <p>Potential: <span id="potential-yield">-- bu/acre</span></p>
                </div>
              </div>
            </div>
          </section>

          <!-- Step 4: Economic Analysis -->
          <section class="step-section" id="analysis-results">
            <div class="step-header">
              <h2><span class="step-number">4</span> Economic Analysis</h2>
              <p>Comprehensive financial analysis and profitability assessment</p>
            </div>
            
            <div class="economic-grid">
              <div class="economic-card">
                <h3>Revenue Analysis</h3>
                <div class="economic-details">
                  <div class="metric-row">
                    <span class="metric-label">Predicted Yield:</span>
                    <span class="metric-value" id="final-yield">-- bu/acre</span>
                  </div>
                  <div class="metric-row">
                    <span class="metric-label">Corn Price ($/bu):</span>
                    <span class="metric-value" id="corn-price">$4.50</span>
                  </div>
                  <div class="metric-row total">
                    <span class="metric-label">Gross Revenue:</span>
                    <span class="metric-value" id="gross-revenue">$--</span>
                  </div>
                </div>
              </div>
              
              <div class="economic-card">
                <h3>Cost Breakdown</h3>
                <div class="economic-details">
                  <div class="metric-row">
                    <span class="metric-label">Seed Costs:</span>
                    <span class="metric-value" id="seed-costs">$120</span>
                  </div>
                  <div class="metric-row">
                    <span class="metric-label">Fertilizer:</span>
                    <span class="metric-value" id="fertilizer-costs">$280</span>
                  </div>
                  <div class="metric-row">
                    <span class="metric-label">Pesticides:</span>
                    <span class="metric-value" id="pesticide-costs">$85</span>
                  </div>
                  <div class="metric-row">
                    <span class="metric-label">Fuel & Equipment:</span>
                    <span class="metric-value" id="equipment-costs">$165</span>
                  </div>
                  <div class="metric-row total">
                    <span class="metric-label">Total Costs:</span>
                    <span class="metric-value" id="total-costs">$650</span>
                  </div>
                </div>
              </div>
              
              <div class="economic-card">
                <h3>Profitability Analysis</h3>
                <div class="economic-details">
                  <div class="metric-row profit">
                    <span class="metric-label">Net Income/Acre:</span>
                    <span class="metric-value" id="net-income">$--</span>
                  </div>
                  <div class="metric-row">
                    <span class="metric-label">Profit Margin:</span>
                    <span class="metric-value" id="profit-margin">--%</span>
                  </div>
                  <div class="metric-row">
                    <span class="metric-label">Break-even Yield:</span>
                    <span class="metric-value" id="breakeven-yield">144.4 bu/acre</span>
                  </div>
                  <div class="metric-row">
                    <span class="metric-label">ROI:</span>
                    <span class="metric-value" id="roi-percentage">--%</span>
                  </div>
                </div>
              </div>
              
              <div class="economic-card full-width">
                <h3>Market Conditions & Risk Assessment</h3>
                <div class="economic-details">
                  <div class="risk-grid">
                    <div class="risk-factor">
                      <h4>Price Risk</h4>
                      <p>Current corn futures: <span id="futures-price">$4.50/bu</span></p>
                      <p>5-year avg: <span class="historical">$4.25/bu</span></p>
                    </div>
                    <div class="risk-factor">
                      <h4>Yield Risk</h4>
                      <p>County avg: <span id="county-avg-yield">185 bu/acre</span></p>
                      <p>Your predicted: <span id="comparison-yield">-- bu/acre</span></p>
                    </div>
                    <div class="risk-factor">
                      <h4>Cost Risk</h4>
                      <p>Input inflation: <span class="inflation">+3.2% annually</span></p>
                      <p>Fuel volatility: <span class="volatility">High</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Educational Content -->
          <section class="step-section" id="educational-section">
            <div class="step-header">
              <h2><span class="step-number">5</span> Learn More</h2>
              <p>Understand the science behind corn production and yield prediction</p>
            </div>
            <div id="educational-content"></div>
          </section>
        </main>

        <!-- Footer -->
        <footer class="app-footer">
          <div class="footer-content">
            <p>Created by <a href="https://logannitzsche.com" target="_blank">Logan Nitzsche</a> in association with <strong>Southern Illinois University Edwardsville</strong></p>
            <p>Academic Advisor: <strong>Dr. Rubi Quinones</strong></p>
            <p>Data sources: University of Illinois Extension, USDA-NASS, Illinois Corn Growers Association</p>
          </div>
        </footer>
      </div>
    `;

    this.initializeComponents();
    this.setupEventListeners();
  }

  private initializeComponents(): void {
    // Initialize county map
    const countyMapContainer = document.getElementById('county-map-container')!;
    this.countyMap = new IllinoisCountyMap(countyMapContainer, (county) => {
      this.selectCounty(county);
    });

    // Initialize educational content
    const educationalContainer = document.getElementById('educational-content')!;
    this.educationalContent = new EducationalContent(educationalContainer);

    // Initialize corn field visualization
    this.initializeCornField();
    
    // Initialize charts
    this.initializeCharts();
    
    console.log('Components initialized:', {
      countyMap: !!this.countyMap,
      educationalContent: !!this.educationalContent,
      chartsInitialized: true
    });
  }

  private initializeCornField(): void {
    const fieldContainer = document.getElementById('corn-field-display');
    if (!fieldContainer) return;

    // Create a realistic corn field visualization
    fieldContainer.innerHTML = `
      <div class="realistic-corn-field">
        <div class="field-rows" id="field-rows">
          ${this.generateCornRows()}
        </div>
        <div class="field-stats">
          <div class="stat-row">
            <span>Growth Stage: <strong id="field-growth-stage">Pre-Emergence</strong></span>
            <span>Plant Height: <strong id="plant-height">0"</strong></span>
          </div>
          <div class="stat-row">
            <span>Population: <strong id="field-population">34,000</strong> plants/acre</span>
            <span>Days Since Planting: <strong id="days-planted">0</strong></span>
          </div>
        </div>
      </div>
    `;
  }

  private generateCornRows(): string {
    let rows = '';
    for (let row = 0; row < 12; row++) {
      rows += '<div class="corn-row">';
      for (let plant = 0; plant < 20; plant++) {
        const plantId = `plant-${row}-${plant}`;
        rows += `<div class="corn-stalk" id="${plantId}" data-row="${row}" data-plant="${plant}">
          <div class="stalk-base"></div>
          <div class="stalk-middle"></div>
          <div class="stalk-top"></div>
          <div class="corn-leaves"></div>
          <div class="corn-ear"></div>
        </div>`;
      }
      rows += '</div>';
    }
    return rows;
  }

  private initializeCharts(): void {
    this.updateEconomicAnalysis();
  }

  private updateEconomicAnalysis(): void {
    if (!this.state.selectedCounty) return;

    // Calculate current yield
    const currentYield = this.gduCalculator.calculatePotentialYield(
      this.state.selectedCounty,
      this.state.totalGDU,
      this.state.yieldFactors
    );

    // Economic parameters
    const cornPrice = 4.50; // $/bushel
    const seedCosts = 120; // $/acre
    const fertilizerCosts = 280; // $/acre
    const pesticideCosts = 85; // $/acre
    const equipmentCosts = 165; // $/acre
    const totalCosts = seedCosts + fertilizerCosts + pesticideCosts + equipmentCosts;

    // Calculate financials
    const grossRevenue = currentYield * cornPrice;
    const netIncome = grossRevenue - totalCosts;
    const profitMargin = grossRevenue > 0 ? (netIncome / grossRevenue) * 100 : 0;
    const breakevenYield = totalCosts / cornPrice;
    const roi = totalCosts > 0 ? (netIncome / totalCosts) * 100 : 0;

    // Update UI elements
    this.updateEconomicDisplay({
      finalYield: currentYield,
      cornPrice: cornPrice,
      seedCosts: seedCosts,
      fertilizerCosts: fertilizerCosts,
      pesticideCosts: pesticideCosts,
      equipmentCosts: equipmentCosts,
      grossRevenue: grossRevenue,
      totalCosts: totalCosts,
      netIncome: netIncome,
      profitMargin: profitMargin,
      breakevenYield: breakevenYield,
      roi: roi,
      countyAvgYield: this.state.selectedCounty.production.averageYield
    });
  }

  private updateEconomicDisplay(economics: {
    finalYield: number;
    cornPrice: number;
    seedCosts: number;
    fertilizerCosts: number;
    pesticideCosts: number;
    equipmentCosts: number;
    grossRevenue: number;
    totalCosts: number;
    netIncome: number;
    profitMargin: number;
    breakevenYield: number;
    roi: number;
    countyAvgYield: number;
  }): void {
    // Revenue section
    const finalYieldEl = document.getElementById('final-yield');
    const cornPriceEl = document.getElementById('corn-price');
    const grossRevenueEl = document.getElementById('gross-revenue');

    if (finalYieldEl) finalYieldEl.textContent = `${economics.finalYield.toFixed(1)} bu/acre`;
    if (cornPriceEl) cornPriceEl.textContent = `$${economics.cornPrice.toFixed(2)}`;
    if (grossRevenueEl) grossRevenueEl.textContent = `$${economics.grossRevenue.toFixed(2)}`;

    // Cost section
    const seedCostsEl = document.getElementById('seed-costs');
    const fertilizerCostsEl = document.getElementById('fertilizer-costs');
    const pesticideCostsEl = document.getElementById('pesticide-costs');
    const equipmentCostsEl = document.getElementById('equipment-costs');
    const totalCostsEl = document.getElementById('total-costs');

    if (seedCostsEl) seedCostsEl.textContent = `$${economics.seedCosts}`;
    if (fertilizerCostsEl) fertilizerCostsEl.textContent = `$${economics.fertilizerCosts}`;
    if (pesticideCostsEl) pesticideCostsEl.textContent = `$${economics.pesticideCosts}`;
    if (equipmentCostsEl) equipmentCostsEl.textContent = `$${economics.equipmentCosts}`;
    if (totalCostsEl) totalCostsEl.textContent = `$${economics.totalCosts}`;

    // Profitability section
    const netIncomeEl = document.getElementById('net-income');
    const profitMarginEl = document.getElementById('profit-margin');
    const breakevenYieldEl = document.getElementById('breakeven-yield');
    const roiEl = document.getElementById('roi-percentage');

    if (netIncomeEl) {
      netIncomeEl.textContent = `$${economics.netIncome.toFixed(2)}`;
      netIncomeEl.style.color = economics.netIncome >= 0 ? '#28a745' : '#dc3545';
    }
    if (profitMarginEl) {
      profitMarginEl.textContent = `${economics.profitMargin.toFixed(1)}%`;
      profitMarginEl.style.color = economics.profitMargin >= 0 ? '#28a745' : '#dc3545';
    }
    if (breakevenYieldEl) breakevenYieldEl.textContent = `${economics.breakevenYield.toFixed(1)} bu/acre`;
    if (roiEl) {
      roiEl.textContent = `${economics.roi.toFixed(1)}%`;
      roiEl.style.color = economics.roi >= 0 ? '#28a745' : '#dc3545';
    }

    // Market conditions section
    const countyAvgYieldEl = document.getElementById('county-avg-yield');
    const comparisonYieldEl = document.getElementById('comparison-yield');
    const futuresPriceEl = document.getElementById('futures-price');

    if (countyAvgYieldEl) countyAvgYieldEl.textContent = `${economics.countyAvgYield} bu/acre`;
    if (comparisonYieldEl) {
      comparisonYieldEl.textContent = `${economics.finalYield.toFixed(1)} bu/acre`;
      comparisonYieldEl.style.color = economics.finalYield >= economics.countyAvgYield ? '#28a745' : '#ffc107';
    }
    if (futuresPriceEl) futuresPriceEl.textContent = `$${economics.cornPrice.toFixed(2)}/bu`;
  }

  private updateCornField(): void {
    const fieldGrowthStage = document.getElementById('field-growth-stage');
    const plantHeight = document.getElementById('plant-height');
    const fieldPopulation = document.getElementById('field-population');
    const daysPlanted = document.getElementById('days-planted');
    
    if (this.state.selectedCounty && fieldGrowthStage) {
      const currentStage = this.gduCalculator.getCurrentGrowthStage(this.state.totalGDU);
      fieldGrowthStage.textContent = currentStage?.stage || 'Pre-Emergence';
    }
    
    if (plantHeight) {
      // Estimate plant height based on GDU
      const estimatedHeight = Math.min(Math.floor(this.state.totalGDU / 30), 120);
      plantHeight.textContent = `${estimatedHeight}"`;
    }
    
    if (fieldPopulation) {
      fieldPopulation.textContent = this.state.yieldFactors.plantPopulation.toLocaleString();
    }
    
    if (daysPlanted) {
      daysPlanted.textContent = (this.state.currentDay - 1).toString();
    }

    // Update visual corn stalks based on growth stage
    const stalks = document.querySelectorAll('.corn-stalk');
    const growthPercent = Math.min(this.state.totalGDU / 2700, 1); // 2700 is maturity
    
    stalks.forEach((stalk, index) => {
      const element = stalk as HTMLElement;
      const delay = (index % 240) * 0.005; // Reduced delay for all 240 plants
      
      // Reset ALL stalks when totalGDU is 0, otherwise use normal growth logic
      if (this.state.totalGDU === 0) {
        element.style.setProperty('--growth-progress', '0');
        element.classList.remove('growing');
      } else if (growthPercent > delay) {
        const adjustedGrowth = Math.min((growthPercent - delay) * 2, 1);
        element.style.setProperty('--growth-progress', adjustedGrowth.toString());
        element.classList.add('growing');
      }
    });
  }

  private updateCharts(): void {
    this.updateEconomicAnalysis();
  }

  private setupEventListeners(): void {
    // Simulation controls
    document.getElementById('play-simulation')?.addEventListener('click', () => this.startSimulation());
    document.getElementById('pause-simulation')?.addEventListener('click', () => this.pauseSimulation());
    document.getElementById('reset-simulation')?.addEventListener('click', () => this.resetSimulation());

    // Configuration inputs
    document.getElementById('planting-date')?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.state.plantingDate = new Date(target.value);
      this.updateSimulation();
    });

    // Range input updates
    this.setupRangeInputs();
    
    // Environmental control listeners
    this.setupEnvironmentalControls();
  }

  private setupRangeInputs(): void {
    const rangeInputs = [
      { id: 'plant-population', display: 'population-display', format: (v: number) => `${v.toLocaleString()}` },
      { id: 'nitrogen-rate', display: 'nitrogen-display', format: (v: number) => `${v}` },
      { id: 'phosphorus-rate', display: 'phosphorus-display', format: (v: number) => `${v}` },
      { id: 'potassium-rate', display: 'potassium-display', format: (v: number) => `${v}` },
      { id: 'simulation-speed', display: 'speed-display', format: (v: number) => `${v}x` }
    ];

    rangeInputs.forEach(({ id, display, format }) => {
      const input = document.getElementById(id) as HTMLInputElement;
      const displayElement = document.getElementById(display);
      
      if (input && displayElement) {
        input.addEventListener('input', () => {
          const value = parseInt(input.value);
          displayElement.textContent = format(value);
          
          // Update state
          switch (id) {
            case 'plant-population':
              this.state.yieldFactors.plantPopulation = value;
              break;
            case 'nitrogen-rate':
              this.state.yieldFactors.nitrogen = value;
              break;
            case 'phosphorus-rate':
              this.state.yieldFactors.phosphorus = value;
              break;
            case 'potassium-rate':
              this.state.yieldFactors.potassium = value;
              break;
            case 'simulation-speed':
              this.state.speed = value;
              break;
          }
          
          this.updateSimulation();
        });
      }
    });
  }

  private setupEnvironmentalControls(): void {
    // Soil moisture control
    const soilMoistureSelect = document.getElementById('soil-moisture') as HTMLSelectElement;
    if (soilMoistureSelect) {
      soilMoistureSelect.addEventListener('change', () => {
        const value = soilMoistureSelect.value;
        switch (value) {
          case 'drought':
            this.state.yieldFactors.soilMoisture = 0.3;
            break;
          case 'dry':
            this.state.yieldFactors.soilMoisture = 0.6;
            break;
          case 'adequate':
            this.state.yieldFactors.soilMoisture = 0.8;
            break;
          case 'optimal':
            this.state.yieldFactors.soilMoisture = 1.0;
            break;
          default:
            this.state.yieldFactors.soilMoisture = 0.8;
        }
        this.updateSimulation();
      });
    }

    // Disease pressure control
    const diseasePressureSelect = document.getElementById('disease-pressure') as HTMLSelectElement;
    if (diseasePressureSelect) {
      diseasePressureSelect.addEventListener('change', () => {
        const value = diseasePressureSelect.value;
        switch (value) {
          case 'none':
            this.state.yieldFactors.diseasePress = 0.0;
            break;
          case 'low':
            this.state.yieldFactors.diseasePress = 0.05;
            break;
          case 'moderate':
            this.state.yieldFactors.diseasePress = 0.15;
            break;
          case 'high':
            this.state.yieldFactors.diseasePress = 0.3;
            break;
          default:
            this.state.yieldFactors.diseasePress = 0.0;
        }
        this.updateSimulation();
      });
    }

    // Insect pressure control
    const insectPressureSelect = document.getElementById('insect-pressure') as HTMLSelectElement;
    if (insectPressureSelect) {
      insectPressureSelect.addEventListener('change', () => {
        const value = insectPressureSelect.value;
        switch (value) {
          case 'none':
            this.state.yieldFactors.insectPress = 0.0;
            break;
          case 'low':
            this.state.yieldFactors.insectPress = 0.03;
            break;
          case 'moderate':
            this.state.yieldFactors.insectPress = 0.1;
            break;
          case 'high':
            this.state.yieldFactors.insectPress = 0.25;
            break;
          default:
            this.state.yieldFactors.insectPress = 0.0;
        }
        this.updateSimulation();
      });
    }

    // Set initial values to optimal
    if (soilMoistureSelect) soilMoistureSelect.value = 'optimal';
    if (diseasePressureSelect) diseasePressureSelect.value = 'none';
    if (insectPressureSelect) insectPressureSelect.value = 'none';
  }

  private selectCounty(county: CountyData): void {
    this.state.selectedCounty = county;
    
    // Update UI
    document.getElementById('selected-county')!.textContent = `${county.name} County`;
    
    // Enable next sections
    document.getElementById('simulation-config')?.classList.remove('disabled');
    document.getElementById('simulation-viz')?.classList.remove('disabled');
    
    // Mark county selection as completed
    document.getElementById('county-selection')?.classList.remove('active');
    document.getElementById('county-selection')?.classList.add('completed');
    
    // Calculate initial GDU
    this.calculateInitialGDU();
    this.updateDisplay();
  }

  private calculateInitialGDU(): void {
    if (!this.state.selectedCounty) return;

    const plantingDepthInput = document.getElementById('planting-depth') as HTMLSelectElement;
    const plantingDepth = parseFloat(plantingDepthInput?.value || '2');

    this.state.totalGDU = this.gduCalculator.calculateInitialGDU(
      this.state.selectedCounty,
      {
        plantingDate: this.state.plantingDate,
        plantingDepth: plantingDepth,
        seedTreatment: true,
        soilTemp: 55
      }
    );
  }

  private startSimulation(): void {
    console.log('Start simulation called', {
      hasSelectedCounty: !!this.state.selectedCounty,
      currentDay: this.state.currentDay,
      totalGDU: this.state.totalGDU
    });
    
    if (!this.state.selectedCounty) {
      console.warn('No county selected for simulation');
      return;
    }

    this.state.isRunning = true;
    
    // Update button states
    const playBtn = document.getElementById('play-simulation') as HTMLButtonElement;
    const pauseBtn = document.getElementById('pause-simulation') as HTMLButtonElement;
    
    if (playBtn) playBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = false;
    
    this.runSimulationLoop();
  }

  private pauseSimulation(): void {
    this.state.isRunning = false;
    
    // Update button states
    const playBtn = document.getElementById('play-simulation') as HTMLButtonElement;
    const pauseBtn = document.getElementById('pause-simulation') as HTMLButtonElement;
    
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private resetSimulation(): void {
    this.pauseSimulation();
    this.state.currentDay = 1;
    this.state.totalGDU = 0; // Reset GDU to 0 instead of calculating initial value
    this.state.currentGrowthStage = 0;
    this.simulationData = []; // Clear simulation data
    
    // Reset yield factors to optimal conditions
    this.state.yieldFactors = {
      soilMoisture: 1.0, // Optimal moisture
      nitrogen: 180,
      phosphorus: 40,
      potassium: 160,
      plantPopulation: 34000,
      diseasePress: 0.0, // No stress
      insectPress: 0.0,
      weedPress: 0.0
    };
    
    this.updateDisplay();
    this.updateCornField();
    this.updateCharts();
  }

  private runSimulationLoop(): void {
    if (!this.state.isRunning || !this.state.selectedCounty) {
      console.log('Simulation loop stopped', {
        isRunning: this.state.isRunning,
        hasCounty: !!this.state.selectedCounty
      });
      return;
    }

    // Simulate a day
    this.simulateDay();
    
    // Schedule next iteration
    const delay = Math.max(100, 1000 / this.state.speed);
    setTimeout(() => {
      if (this.state.isRunning) {
        this.animationId = requestAnimationFrame(() => this.runSimulationLoop());
      }
    }, delay);
  }

  private simulateDay(): void {
    if (!this.state.selectedCounty) return;

    // Generate weather data (simplified)
    const maxTemp = 75 + Math.random() * 20; // 75-95°F
    const minTemp = maxTemp - 15 - Math.random() * 10; // 10-25°F lower

    // Calculate daily GDU
    const dailyGDU = this.gduCalculator.calculateDailyGDU(maxTemp, minTemp);
    this.state.totalGDU += dailyGDU;

    // Update growth stage
    const currentStage = this.gduCalculator.getCurrentGrowthStage(this.state.totalGDU);
    if (currentStage) {
      const stageIndex = this.gduCalculator.getAllGrowthStages().findIndex(s => s.code === currentStage.code);
      this.state.currentGrowthStage = stageIndex;
    }

    // Increment day
    this.state.currentDay++;

    // Collect simulation data for charts
    const currentYield = this.gduCalculator.calculatePotentialYield(
      this.state.selectedCounty,
      this.state.totalGDU,
      this.state.yieldFactors
    );

    this.simulationData.push({
      day: this.state.currentDay,
      gdu: this.state.totalGDU,
      stage: currentStage?.stage || 'Pre-Emergence',
      yield: currentYield
    });

    // Update displays
    this.updateDisplay();
    
    const currentTempElement = document.getElementById('current-temp');
    const dailyGduElement = document.getElementById('daily-gdu');
    
    if (currentTempElement) {
      currentTempElement.textContent = `${Math.round(maxTemp)}°F`;
    }
    if (dailyGduElement) {
      dailyGduElement.textContent = Math.round(dailyGDU).toString();
    }

    // Update visualizations
    this.updateCornField();
    this.updateCharts();

    // Stop at maturity
    if (this.state.totalGDU >= 2700) {
      this.pauseSimulation();
    }
  }

  private updateSimulation(): void {
    if (!this.state.selectedCounty) return;

    const currentYield = this.gduCalculator.calculatePotentialYield(
      this.state.selectedCounty,
      this.state.totalGDU,
      this.state.yieldFactors
    );

    const currentYieldElement = document.getElementById('current-yield');
    const potentialYieldElement = document.getElementById('potential-yield');
    
    if (currentYieldElement) {
      currentYieldElement.textContent = `${currentYield} bu/acre`;
    }
    if (potentialYieldElement) {
      potentialYieldElement.textContent = `${this.state.selectedCounty.production.averageYield} bu/acre`;
    }
  }

  private updateDisplay(): void {
    // Update header stats
    const totalGduElement = document.getElementById('total-gdu');
    if (totalGduElement) {
      totalGduElement.textContent = Math.round(this.state.totalGDU).toString();
    }

    // Update growth stage
    const currentStage = this.gduCalculator.getCurrentGrowthStage(this.state.totalGDU);
    if (currentStage) {
      const growthStageElement = document.getElementById('growth-stage');
      const stageNameElement = document.getElementById('stage-name');
      const stageDescElement = document.getElementById('stage-description');
      
      if (growthStageElement) growthStageElement.textContent = currentStage.stage;
      if (stageNameElement) stageNameElement.textContent = currentStage.stage;
      if (stageDescElement) stageDescElement.textContent = currentStage.description;
    }

    // Update yield prediction
    if (this.state.selectedCounty) {
      const predictedYield = this.gduCalculator.calculatePotentialYield(
        this.state.selectedCounty,
        this.state.totalGDU,
        this.state.yieldFactors
      );
      const predictedYieldElement = document.getElementById('predicted-yield');
      if (predictedYieldElement) {
        predictedYieldElement.textContent = `${predictedYield} bu/acre`;
      }
    }

    this.updateSimulation();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}