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
        soilMoisture: 0.8,
        nitrogen: 180,
        phosphorus: 40,
        potassium: 160,
        plantPopulation: 34000,
        diseasePress: 0.1,
        insectPress: 0.05,
        weedPress: 0.1
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
              <h1>🌽 CornView Illinois</h1>
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
                <h3>🌱 Planting Conditions</h3>
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
                <h3>🧪 Nutrient Management</h3>
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
                <h3>🌧️ Environmental Conditions</h3>
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
                    <option value="0.05" selected>Low</option>
                    <option value="0.15">Moderate</option>
                    <option value="0.3">High</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="pest-pressure">Insect Pressure:</label>
                  <select id="pest-pressure">
                    <option value="0.05" selected>Low</option>
                    <option value="0.1">Moderate</option>
                    <option value="0.25">High</option>
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
              <div class="field-visualization">
                <h3>Corn Field Visualization</h3>
                <div id="corn-field-3d"></div>
              </div>
              
              <div class="growth-chart">
                <h3>Growth Progress</h3>
                <canvas id="growth-chart" width="400" height="300"></canvas>
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

          <!-- Step 4: Analysis & Results -->
          <section class="step-section" id="analysis-results">
            <div class="step-header">
              <h2><span class="step-number">4</span> Analysis & Results</h2>
              <p>Detailed analysis of simulation results and recommendations</p>
            </div>
            
            <div class="results-grid">
              <div class="result-card">
                <h3>📊 Yield Analysis</h3>
                <canvas id="yield-chart" width="300" height="200"></canvas>
              </div>
              
              <div class="result-card">
                <h3>🌡️ GDU Accumulation</h3>
                <canvas id="gdu-accumulation-chart" width="300" height="200"></canvas>
              </div>
              
              <div class="result-card">
                <h3>💰 Economic Analysis</h3>
                <div id="economic-summary">
                  <p>Revenue: <span id="gross-revenue">$--</span></p>
                  <p>Costs: <span id="total-costs">$--</span></p>
                  <p>Net Income: <span id="net-income">$--</span></p>
                </div>
              </div>
            </div>
          </section>

          <!-- Educational Content -->
          <section class="step-section" id="educational-section">
            <div class="step-header">
              <h2><span class="step-number">📚</span> Learn More</h2>
              <p>Understand the science behind corn production and yield prediction</p>
            </div>
            <div id="educational-content"></div>
          </section>
        </main>

        <!-- Footer -->
        <footer class="app-footer">
          <div class="footer-content">
            <p>Created by <a href="https://logannitzsche.com" target="_blank">Logan Nitzsche</a> in association with <strong>Southern Illinois University Edwardsville</strong></p>
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

    // Initialize 3D field (commented out for now to avoid Three.js import issues)
    // const fieldContainer = document.getElementById('corn-field-3d')!;
    // this.cornField3D = new CornField3D(fieldContainer);
    
    // Prevent unused variable warnings
    console.log('Components initialized:', {
      countyMap: !!this.countyMap,
      educationalContent: !!this.educationalContent
    });
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
    if (!this.state.selectedCounty) return;

    this.state.isRunning = true;
    
    // Update button states
    const playBtn = document.getElementById('play-simulation') as HTMLButtonElement;
    const pauseBtn = document.getElementById('pause-simulation') as HTMLButtonElement;
    
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    
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
    this.calculateInitialGDU();
    this.state.currentGrowthStage = 0;
    this.updateDisplay();
  }

  private runSimulationLoop(): void {
    if (!this.state.isRunning || !this.state.selectedCounty) return;

    // Simulate a day
    this.simulateDay();
    
    // Schedule next iteration
    const delay = Math.max(100, 1000 / this.state.speed);
    setTimeout(() => {
      this.animationId = requestAnimationFrame(() => this.runSimulationLoop());
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

    // Update displays
    this.updateDisplay();
    document.getElementById('current-temp')!.textContent = `${Math.round(maxTemp)}°F`;
    document.getElementById('daily-gdu')!.textContent = Math.round(dailyGDU).toString();

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

    document.getElementById('current-yield')!.textContent = `${currentYield} bu/acre`;
    document.getElementById('potential-yield')!.textContent = `${this.state.selectedCounty.production.averageYield} bu/acre`;
  }

  private updateDisplay(): void {
    // Update header stats
    document.getElementById('current-day')!.textContent = this.state.currentDay.toString();
    document.getElementById('total-gdu')!.textContent = Math.round(this.state.totalGDU).toString();

    // Update growth stage
    const currentStage = this.gduCalculator.getCurrentGrowthStage(this.state.totalGDU);
    if (currentStage) {
      document.getElementById('growth-stage')!.textContent = currentStage.stage;
      document.getElementById('stage-name')!.textContent = currentStage.stage;
      document.getElementById('stage-description')!.textContent = currentStage.description;
    }

    // Update yield prediction
    if (this.state.selectedCounty) {
      const predictedYield = this.gduCalculator.calculatePotentialYield(
        this.state.selectedCounty,
        this.state.totalGDU,
        this.state.yieldFactors
      );
      document.getElementById('predicted-yield')!.textContent = `${predictedYield} bu/acre`;
    }

    this.updateSimulation();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}