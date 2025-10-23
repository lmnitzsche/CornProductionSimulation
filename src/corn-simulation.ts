import { SimulationState, EnvironmentalFactors, GrowthStages, DroughtConditions } from './types';
import { GDUCalculator } from './gdu-calculator';
import { CornField } from './corn-field';
import { FileManager } from './file-manager';

export class CornSimulation {
  private state!: SimulationState;
  private gduCalculator: GDUCalculator;
  private cornField!: CornField;
  private animationId: number | null = null;
  private isRunning = false;

  // UI Elements
  private dayDisplay!: HTMLElement;
  private gduDisplay!: HTMLElement;
  private yieldDisplay!: HTMLElement;
  private playButton!: HTMLButtonElement;
  private pauseButton!: HTMLButtonElement;
  private resetButton!: HTMLButtonElement;
  private speedSlider!: HTMLInputElement;

  constructor() {
    this.gduCalculator = new GDUCalculator();
    this.initializeState();
    this.initializeUI();
    this.setupEventListeners();
  }

  private initializeState(): void {
    const defaultEnvironmentalFactors: EnvironmentalFactors = {
      soilTexture: 'fine',
      seedZone: 'optimum',
      seedBed: 'normal',
      seedingDepth: 'one',
      plantingDate: 'before'
    };

    const defaultGrowthStages: GrowthStages = {
      VE: false, V2: false, V3: false, V6: false, V8: false,
      V10: false, VT: false, R2: false, R4: false, R5: false, R6: false
    };

    const defaultDroughtConditions: DroughtConditions = {
      moderate: false, severe: false, extreme: false
    };

    this.state = {
      day: 1,
      gdu: this.gduCalculator.calculateInitialGDU(defaultEnvironmentalFactors),
      growthLevel: 0,
      estimatedYield: 0,
      temperatureData: [],
      environmentalFactors: defaultEnvironmentalFactors,
      growthStages: defaultGrowthStages,
      droughtConditions: defaultDroughtConditions
    };
  }

  private initializeUI(): void {
    const app = document.getElementById('app');
    if (!app) throw new Error('App container not found');

    app.innerHTML = `
      <div class="app-container">
        <header class="header">
          <h1><b>CornView: Simulation for Corn Growth Monitoring and Yield Projection</b></h1>
          <h4><b>Created by <a href="https://logannitzsche.com" target="_blank">Logan Nitzsche</a></b></h4>
        </header>

        <div class="simulation-stats">
          <div class="stat">
            <label>Day:</label>
            <span id="day-display">1</span>
          </div>
          <div class="stat">
            <label>GDU:</label>
            <span id="gdu-display">calculating...</span>
          </div>
          <div class="stat">
            <label>Estimated Yield:</label>
            <span id="yield-display">calculating...</span>
          </div>
        </div>

        <div class="main-content">
          <div class="controls-panel">
            <div class="simulation-controls">
              <h3>Simulation Controls</h3>
              <div class="control-buttons">
                <button id="play-btn" class="control-btn">▶ Play</button>
                <button id="pause-btn" class="control-btn" disabled>⏸ Pause</button>
                <button id="reset-btn" class="control-btn">🔄 Reset</button>
              </div>
              <div class="speed-control">
                <label for="speed-slider">Speed:</label>
                <input type="range" id="speed-slider" min="1" max="10" value="5">
                <span id="speed-display">5x</span>
              </div>
            </div>

            <div class="environmental-controls">
              <h3>Environmental Factors</h3>
              <div class="form-group">
                <label for="soil-texture">Soil Texture:</label>
                <select id="soil-texture">
                  <option value="fine">Fine (pH < 7)</option>
                  <option value="coarse">Coarse (pH > 7)</option>
                </select>
              </div>
              <div class="form-group">
                <label for="seed-zone">Seed Zone:</label>
                <select id="seed-zone">
                  <option value="optimum">Optimum</option>
                  <option value="suboptimal">Suboptimal</option>
                </select>
              </div>
              <div class="form-group">
                <label for="seed-bed">Seed Bed:</label>
                <select id="seed-bed">
                  <option value="normal">Normal</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div class="form-group">
                <label for="seeding-depth">Seeding Depth:</label>
                <select id="seeding-depth">
                  <option value="one">1 inch</option>
                  <option value="two">2 inches</option>
                  <option value="three">3 inches</option>
                  <option value="four">4 inches</option>
                </select>
              </div>
            </div>

            <div class="file-controls">
              <h3>Data Management</h3>
              <div class="file-group">
                <label for="temp-file">Temperature Data (.txt):</label>
                <input type="file" id="temp-file" accept=".txt,.csv">
                <button id="sample-temp-btn" class="small-btn">Generate Sample</button>
              </div>
              <div class="file-group">
                <label for="env-file">Environmental Data (.txt):</label>
                <input type="file" id="env-file" accept=".txt,.csv">
              </div>
              <button id="export-btn" class="control-btn">📊 Export Data</button>
            </div>
          </div>

          <div id="simulation-area" class="simulation-area">
            <!-- Corn field will be rendered here -->
          </div>
        </div>

        <div id="region-modal" class="modal">
          <div class="modal-content">
            <h2>Select Region:</h2>
            <img src="/images/illinois.png" alt="Illinois" id="illinois-model" class="region-image">
            <p>Click to select Illinois region</p>
          </div>
        </div>
      </div>
    `;

    // Get UI element references
    this.dayDisplay = document.getElementById('day-display')!;
    this.gduDisplay = document.getElementById('gdu-display')!;
    this.yieldDisplay = document.getElementById('yield-display')!;
    this.playButton = document.getElementById('play-btn') as HTMLButtonElement;
    this.pauseButton = document.getElementById('pause-btn') as HTMLButtonElement;
    this.resetButton = document.getElementById('reset-btn') as HTMLButtonElement;
    this.speedSlider = document.getElementById('speed-slider') as HTMLInputElement;

    // Initialize corn field
    const simulationArea = document.getElementById('simulation-area')!;
    this.cornField = new CornField(simulationArea);

    this.updateDisplay();
  }

  private setupEventListeners(): void {
    // Simulation controls
    this.playButton.addEventListener('click', () => this.play());
    this.pauseButton.addEventListener('click', () => this.pause());
    this.resetButton.addEventListener('click', () => this.reset());
    
    this.speedSlider.addEventListener('input', () => {
      const speedDisplay = document.getElementById('speed-display')!;
      speedDisplay.textContent = `${this.speedSlider.value}x`;
    });

    // Environmental controls
    const soilTexture = document.getElementById('soil-texture') as HTMLSelectElement;
    const seedZone = document.getElementById('seed-zone') as HTMLSelectElement;
    const seedBed = document.getElementById('seed-bed') as HTMLSelectElement;
    const seedingDepth = document.getElementById('seeding-depth') as HTMLSelectElement;

    [soilTexture, seedZone, seedBed, seedingDepth].forEach(select => {
      select.addEventListener('change', () => this.updateEnvironmentalFactors());
    });

    // File controls
    const tempFile = document.getElementById('temp-file') as HTMLInputElement;
    const envFile = document.getElementById('env-file') as HTMLInputElement;
    const sampleTempBtn = document.getElementById('sample-temp-btn')!;
    const exportBtn = document.getElementById('export-btn')!;

    tempFile.addEventListener('change', (e) => this.handleTemperatureFileLoad(e));
    envFile.addEventListener('change', (e) => this.handleEnvironmentalFileLoad(e));
    sampleTempBtn.addEventListener('click', () => FileManager.createSampleTemperatureFile());
    exportBtn.addEventListener('click', () => FileManager.exportSimulationData(this.state));

    // Region modal
    const illinoisModel = document.getElementById('illinois-model')!;
    const regionModal = document.getElementById('region-modal')!;
    
    illinoisModel.addEventListener('click', () => {
      regionModal.style.display = 'none';
    });
  }

  private async handleTemperatureFileLoad(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      try {
        const temperatureData = await FileManager.loadTemperatureData(file);
        this.state.temperatureData = temperatureData;
        console.log(`Loaded ${temperatureData.length} temperature data points`);
      } catch (error) {
        console.error('Error loading temperature data:', error);
        alert('Error loading temperature data. Please check the file format.');
      }
    }
  }

  private async handleEnvironmentalFileLoad(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      try {
        const envData = await FileManager.loadEnvironmentalData(file);
        this.state.environmentalFactors = { ...this.state.environmentalFactors, ...envData };
        this.updateEnvironmentalUI();
        console.log('Loaded environmental data:', envData);
      } catch (error) {
        console.error('Error loading environmental data:', error);
        alert('Error loading environmental data. Please check the file format.');
      }
    }
  }

  private updateEnvironmentalFactors(): void {
    const soilTexture = (document.getElementById('soil-texture') as HTMLSelectElement).value as 'fine' | 'coarse';
    const seedZone = (document.getElementById('seed-zone') as HTMLSelectElement).value as 'optimum' | 'suboptimal';
    const seedBed = (document.getElementById('seed-bed') as HTMLSelectElement).value as 'normal' | 'poor';
    const seedingDepth = (document.getElementById('seeding-depth') as HTMLSelectElement).value as 'one' | 'two' | 'three' | 'four';

    this.state.environmentalFactors = {
      ...this.state.environmentalFactors,
      soilTexture,
      seedZone,
      seedBed,
      seedingDepth
    };

    // Recalculate yield with new factors
    this.state.estimatedYield = this.gduCalculator.calculateYield(
      this.state.gdu,
      this.state.environmentalFactors,
      this.state.droughtConditions
    );

    this.updateDisplay();
  }

  private updateEnvironmentalUI(): void {
    (document.getElementById('soil-texture') as HTMLSelectElement).value = this.state.environmentalFactors.soilTexture;
    (document.getElementById('seed-zone') as HTMLSelectElement).value = this.state.environmentalFactors.seedZone;
    (document.getElementById('seed-bed') as HTMLSelectElement).value = this.state.environmentalFactors.seedBed;
    (document.getElementById('seeding-depth') as HTMLSelectElement).value = this.state.environmentalFactors.seedingDepth;
  }

  private play(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.playButton.disabled = true;
    this.pauseButton.disabled = false;
    
    this.runSimulation();
  }

  private pause(): void {
    this.isRunning = false;
    this.playButton.disabled = false;
    this.pauseButton.disabled = true;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private reset(): void {
    this.pause();
    this.initializeState();
    this.updateDisplay();
    this.updateEnvironmentalUI();
    this.cornField.updatePlantGrowth(0);
  }

  private runSimulation(): void {
    if (!this.isRunning) return;

    this.simulateDay();
    
    const speed = parseInt(this.speedSlider.value);
    const delay = Math.max(100, 1000 / speed); // Faster speeds = shorter delays
    
    setTimeout(() => {
      this.animationId = requestAnimationFrame(() => this.runSimulation());
    }, delay);
  }

  private simulateDay(): void {
    // Use temperature data if available, otherwise generate random data
    let maxTemp: number, minTemp: number;
    
    if (this.state.temperatureData.length > 0) {
      const dataIndex = (this.state.day - 1) % this.state.temperatureData.length;
      const tempData = this.state.temperatureData[dataIndex];
      maxTemp = tempData.maxTemp;
      minTemp = tempData.minTemp;
    } else {
      // Generate random temperature data
      maxTemp = Math.floor(Math.random() * 20) + 75; // 75-95°F
      minTemp = maxTemp - Math.floor(Math.random() * 15) - 10; // 10-25°F lower
    }

    // Calculate daily GDU
    const dailyGDU = this.gduCalculator.calculateDailyGDU(maxTemp, minTemp);
    this.state.gdu += dailyGDU;

    // Update growth stages
    const newGrowthStages = this.gduCalculator.updateGrowthStages(this.state.gdu, this.state.growthStages);
    
    // Check for new growth stage reached
    const stageKeys = Object.keys(newGrowthStages) as Array<keyof GrowthStages>;
    for (const stage of stageKeys) {
      if (newGrowthStages[stage] && !this.state.growthStages[stage]) {
        this.cornField.highlightGrowthStage(stage);
      }
    }
    
    this.state.growthStages = newGrowthStages;

    // Update growth level for visualization
    this.state.growthLevel = this.calculateGrowthLevel();

    // Calculate yield
    this.state.estimatedYield = this.gduCalculator.calculateYield(
      this.state.gdu,
      this.state.environmentalFactors,
      this.state.droughtConditions
    );

    // Update day
    this.state.day++;

    // Update displays
    this.updateDisplay();
    this.cornField.updatePlantGrowth(this.state.growthLevel);

    // Stop simulation at maturity
    if (this.state.growthStages.R6) {
      this.pause();
      this.cornField.highlightGrowthStage('MATURITY REACHED!');
    }
  }

  private calculateGrowthLevel(): number {
    const { gdu } = this.state;
    
    if (gdu >= 2700) return 11; // Full maturity
    if (gdu >= 2300) return 10; // R5
    if (gdu >= 2000) return 9;  // R4
    if (gdu >= 1700) return 8;  // R2
    if (gdu >= 1400) return 7;  // VT
    if (gdu >= 1100) return 6;  // V10
    if (gdu >= 850) return 5;   // V8
    if (gdu >= 600) return 4;   // V6
    if (gdu >= 350) return 3;   // V3
    if (gdu >= 200) return 2;   // V2
    if (gdu >= 115) return 1;   // VE
    
    return 0; // Pre-emergence
  }

  private updateDisplay(): void {
    this.dayDisplay.textContent = this.state.day.toString();
    this.gduDisplay.textContent = Math.round(this.state.gdu).toString();
    this.yieldDisplay.textContent = `${this.state.estimatedYield} bu/acre`;
  }
}