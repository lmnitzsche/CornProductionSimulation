export class EducationalContent {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init(): void {
    this.container.innerHTML = `
      <div class="education-panel">
        <div class="education-header">
          <h2>Learn About Corn Production</h2>
          <p>Understanding the science behind corn growth and yield prediction</p>
        </div>

        <div class="education-tabs">
          <button class="tab-btn active" data-tab="gdu">Growing Degree Units</button>
          <button class="tab-btn" data-tab="growth">Growth Stages</button>
          <button class="tab-btn" data-tab="soil">Soil Science</button>
          <button class="tab-btn" data-tab="climate">Climate Factors</button>
          <button class="tab-btn" data-tab="yield">Yield Factors</button>
        </div>

        <div class="education-content">
          ${this.createGDUContent()}
          ${this.createGrowthStagesContent()}
          ${this.createSoilScienceContent()}
          ${this.createClimateContent()}
          ${this.createYieldFactorsContent()}
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  private createGDUContent(): string {
    return `
      <div class="tab-content active" id="gdu-content">
        <h3>Growing Degree Units (GDU)</h3>
        
        <div class="content-section">
          <h4>What are Growing Degree Units?</h4>
          <p>Growing Degree Units (GDU) are a measure of heat accumulation used to predict plant development. For corn, we use a base temperature of 50°F (10°C), meaning corn doesn't grow when temperatures are below this threshold.</p>
          
          <div class="formula-box">
            <h5>GDU Calculation Formula:</h5>
            <code>Daily GDU = (Max Temp + Min Temp) ÷ 2 - Base Temp (50°F)</code>
            <p><em>Note: Maximum temperature is capped at 86°F for corn calculations</em></p>
          </div>

          <div class="example-box">
            <h5>Example Calculation:</h5>
            <p><strong>Day 1:</strong> High 85°F, Low 65°F</p>
            <p>GDU = (85 + 65) ÷ 2 - 50 = 75 - 50 = <strong>25 GDU</strong></p>
          </div>
        </div>

        <div class="content-section">
          <h4>Why GDU Matters</h4>
          <ul>
            <li><strong>Predictable Development:</strong> Corn development is more closely related to heat accumulation than calendar days</li>
            <li><strong>Variety Selection:</strong> Different corn varieties require different total GDU to reach maturity</li>
            <li><strong>Management Timing:</strong> Farmers use GDU to time fertilizer applications, pest management, and harvest</li>
            <li><strong>Risk Assessment:</strong> Helps predict if corn will mature before first frost</li>
          </ul>
        </div>
      </div>
    `;
  }

  private createGrowthStagesContent(): string {
    return `
      <div class="tab-content" id="growth-content">
        <h3>Corn Growth Stages</h3>
        
        <div class="growth-stages-grid">
          <div class="stage-card">
            <div class="stage-icon">🌱</div>
            <h4>VE - Emergence</h4>
            <p><strong>115 GDU</strong></p>
            <p>Coleoptile breaks soil surface. Critical factors: soil temperature, moisture, planting depth.</p>
          </div>

          <div class="stage-card">
            <div class="stage-icon">🌿</div>
            <h4>V2 - 2nd Leaf</h4>
            <p><strong>200 GDU</strong></p>
            <p>Second leaf collar visible. Root system developing rapidly.</p>
          </div>

          <div class="stage-card">
            <div class="stage-icon">🍃</div>
            <h4>V6 - 6th Leaf</h4>
            <p><strong>500 GDU</strong></p>
            <p>Rapid growth begins. Growing point above soil surface. Critical for yield potential.</p>
          </div>

          <div class="stage-card">
            <div class="stage-icon">🌾</div>
            <h4>V10 - 10th Leaf</h4>
            <p><strong>850 GDU</strong></p>
            <p>Ear shoots developing. Plant height increasing rapidly. Moisture stress sensitivity increases.</p>
          </div>

          <div class="stage-card">
            <div class="stage-icon">🌾</div>
            <h4>VT - Tasseling</h4>
            <p><strong>1400 GDU</strong></p>
            <p>Tassel emergence and pollen shed. CRITICAL STAGE - moisture stress can severely impact yield.</p>
          </div>

          <div class="stage-card">
            <div class="stage-icon">🌽</div>
            <h4>R1 - Silking</h4>
            <p><strong>1450 GDU</strong></p>
            <p>Silks emerge from ear shoots. Pollination window. Heat and drought stress critical.</p>
          </div>

          <div class="stage-card">
            <div class="stage-icon">🌽</div>
            <h4>R2 - Blister</h4>
            <p><strong>1650 GDU</strong></p>
            <p>Kernels resemble blisters. Rapid grain fill begins. Kernel number determined.</p>
          </div>

          <div class="stage-card">
            <div class="stage-icon">🌽</div>
            <h4>R6 - Maturity</h4>
            <p><strong>2700 GDU</strong></p>
            <p>Black layer formation. Physiological maturity reached. Grain fill complete.</p>
          </div>
        </div>

        <div class="critical-periods">
          <h4>Critical Growth Periods</h4>
          <div class="critical-period">
            <h5>VT to R2 (Tasseling to Blister)</h5>
            <p>Most critical period for yield determination. Moisture stress during this 2-3 week period can reduce yields by 3-7% per day of stress.</p>
          </div>
          <div class="critical-period">
            <h5>V6 to V10 (6th to 10th Leaf)</h5>
            <p>Ear size determination period. Stress can reduce kernel rows and ear length.</p>
          </div>
        </div>
      </div>
    `;
  }

  private createSoilScienceContent(): string {
    return `
      <div class="tab-content" id="soil-content">
        <h3>Soil Science for Corn Production</h3>
        
        <div class="soil-types">
          <h4>Illinois Soil Types</h4>
          
          <div class="soil-type-card">
            <h5>Drummer Silty Clay Loam</h5>
            <div class="soil-properties">
              <span class="property">Corn Suitability: 95/100</span>
              <span class="property">Drainage: Somewhat Poorly Drained</span>
              <span class="property">Organic Matter: 4.2%</span>
            </div>
            <p>Illinois' premier corn soil. Dark, rich, and fertile. Found in McLean County and other top producing areas.</p>
          </div>

          <div class="soil-type-card">
            <h5>Flanagan Silt Loam</h5>
            <div class="soil-properties">
              <span class="property">Corn Suitability: 92/100</span>
              <span class="property">Drainage: Well Drained</span>
              <span class="property">Organic Matter: 3.8%</span>
            </div>
            <p>Excellent corn soil with good drainage. Common in east-central Illinois.</p>
          </div>
        </div>

        <div class="soil-factors">
          <h4>Key Soil Factors for Corn</h4>
          
          <div class="factor-grid">
            <div class="factor-card">
              <h5>Soil Temperature</h5>
              <p>Corn germinates best when soil temperature is consistently above 50°F at 2-inch depth. Cold soils delay emergence and increase disease risk.</p>
            </div>

            <div class="factor-card">
              <h5>Soil Moisture</h5>
              <p>Adequate moisture is critical for germination and early growth. Overly wet soils can cause compaction and poor root development.</p>
            </div>

            <div class="factor-card">
              <h5>pH Level</h5>
              <p>Optimal pH range: 6.0-6.8. Low pH reduces nutrient availability, while high pH can cause iron deficiency.</p>
            </div>

            <div class="factor-card">
              <h5>Organic Matter</h5>
              <p>Higher organic matter improves water holding capacity, nutrient retention, and soil structure. Illinois soils average 3-5%.</p>
            </div>

            <div class="factor-card">
              <h5>Soil Structure</h5>
              <p>Good soil structure allows root penetration and water infiltration. Compaction can reduce yields significantly.</p>
            </div>

            <div class="factor-card">
              <h5>Drainage</h5>
              <p>Proper drainage prevents waterlogging while maintaining adequate moisture. Tile drainage is common in Illinois.</p>
            </div>
          </div>
        </div>

        <div class="nutrient-section">
          <h4>Essential Nutrients</h4>
          <div class="nutrient-bars">
            <div class="nutrient-bar">
              <label>Nitrogen (N) - 180 lbs/acre optimal</label>
              <div class="bar"><div class="fill" style="width: 100%"></div></div>
            </div>
            <div class="nutrient-bar">
              <label>Phosphorus (P₂O₅) - 40 lbs/acre optimal</label>
              <div class="bar"><div class="fill" style="width: 80%"></div></div>
            </div>
            <div class="nutrient-bar">
              <label>Potassium (K₂O) - 160 lbs/acre optimal</label>
              <div class="bar"><div class="fill" style="width: 90%"></div></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private createClimateContent(): string {
    return `
      <div class="tab-content" id="climate-content">
        <h3>Climate Factors</h3>
        
        <div class="climate-overview">
          <h4>Illinois Climate Zones</h4>
          <div class="zone-grid">
            <div class="zone-card">
              <h5>Northern Illinois (Zone 5a-5b)</h5>
              <p><strong>Growing Degree Days:</strong> 2,800-3,000</p>
              <p><strong>Frost-Free Days:</strong> 160-170</p>
              <p>Cooler temperatures, shorter growing season. Requires earlier maturing corn varieties.</p>
            </div>
            <div class="zone-card">
              <h5>Central Illinois (Zone 5b-6a)</h5>
              <p><strong>Growing Degree Days:</strong> 3,000-3,200</p>
              <p><strong>Frost-Free Days:</strong> 170-180</p>
              <p>Optimal corn growing conditions. Highest yields in the state.</p>
            </div>
            <div class="zone-card">
              <h5>Southern Illinois (Zone 6a-6b)</h5>
              <p><strong>Growing Degree Days:</strong> 3,200-3,400</p>
              <p><strong>Frost-Free Days:</strong> 180-190</p>
              <p>Warmer temperatures, longer season. Heat stress can be a concern.</p>
            </div>
          </div>
        </div>

        <div class="weather-factors">
          <h4>Critical Weather Factors</h4>
          
          <div class="weather-impact">
            <h5>Temperature</h5>
            <ul>
              <li><strong>Optimal Growing Range:</strong> 77-91°F (25-33°C)</li>
              <li><strong>Heat Stress:</strong> Above 95°F during pollination can reduce kernel set</li>
              <li><strong>Cool Weather:</strong> Below 50°F stops growth completely</li>
            </ul>
          </div>

          <div class="weather-impact">
            <h5>Precipitation</h5>
            <ul>
              <li><strong>Annual Needs:</strong> 20-30 inches during growing season</li>
              <li><strong>Critical Periods:</strong> VT to R2 needs 1-1.5 inches per week</li>
              <li><strong>Timing:</strong> Distribution more important than total amount</li>
            </ul>
          </div>

          <div class="weather-impact">
            <h5>Wind</h5>
            <ul>
              <li><strong>Pollination:</strong> Light winds aid pollen dispersal</li>
              <li><strong>Strong Winds:</strong> Can cause root lodging and stalk breakage</li>
              <li><strong>Green Snap:</strong> Rapid growth + wind can break stalks</li>
            </ul>
          </div>

          <div class="weather-impact">
            <h5>Solar Radiation</h5>
            <ul>
              <li><strong>Photosynthesis:</strong> More sunlight = more grain fill</li>
              <li><strong>Cloudy Weather:</strong> During grain fill reduces yield</li>
              <li><strong>Day Length:</strong> Corn is not sensitive to photoperiod</li>
            </ul>
          </div>
        </div>

        <div class="drought-stress">
          <h4>Drought Stress Impact</h4>
          <div class="stress-timeline">
            <div class="stress-period">
              <h5>Early Season (V6-V10)</h5>
              <p><strong>Impact:</strong> Reduced ear size, fewer kernel rows</p>
              <p><strong>Yield Loss:</strong> 2-4% per day of stress</p>
            </div>
            <div class="stress-period critical">
              <h5>Pollination (VT-R2)</h5>
              <p><strong>Impact:</strong> Poor kernel set, silk clipping</p>
              <p><strong>Yield Loss:</strong> 3-7% per day of stress</p>
            </div>
            <div class="stress-period">
              <h5>Grain Fill (R3-R5)</h5>
              <p><strong>Impact:</strong> Reduced kernel weight</p>
              <p><strong>Yield Loss:</strong> 2-5% per day of stress</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private createYieldFactorsContent(): string {
    return `
      <div class="tab-content" id="yield-content">
        <h3>Yield Factors & Optimization</h3>
        
        <div class="yield-equation">
          <h4>Corn Yield Components</h4>
          <div class="equation-box">
            <p><strong>Yield = Plants/Acre × Ears/Plant × Kernels/Ear × Kernel Weight</strong></p>
          </div>
        </div>

        <div class="yield-factors-grid">
          <div class="yield-factor">
            <h5>Plant Population</h5>
            <div class="factor-details">
              <p><strong>Optimal Range:</strong> 32,000-36,000 plants/acre</p>
              <p><strong>Row Spacing:</strong> 30-inch rows standard</p>
              <p><strong>Impact:</strong> Too low = fewer plants, too high = competition</p>
            </div>
          </div>

          <div class="yield-factor">
            <h5>Ear Development</h5>
            <div class="factor-details">
              <p><strong>Typical:</strong> 1.0-1.05 ears per plant</p>
              <p><strong>Barren Plants:</strong> Stress can prevent ear development</p>
              <p><strong>Management:</strong> Balanced nutrition and moisture</p>
            </div>
          </div>

          <div class="yield-factor">
            <h5>Kernels per Ear</h5>
            <div class="factor-details">
              <p><strong>Range:</strong> 600-1,000 kernels per ear</p>
              <p><strong>Determined:</strong> V6 to V18 growth stages</p>
              <p><strong>Factors:</strong> Stress, nutrition, genetics</p>
            </div>
          </div>

          <div class="yield-factor">
            <h5>Kernel Weight</h5>
            <div class="factor-details">
              <p><strong>Range:</strong> 250-400 mg per kernel</p>
              <p><strong>Determined:</strong> During grain fill (R2-R6)</p>
              <p><strong>Critical:</strong> Weather during grain fill period</p>
            </div>
          </div>
        </div>

        <div class="management-practices">
          <h4>Best Management Practices</h4>
          
          <div class="practice-category">
            <h5>Variety Selection</h5>
            <ul>
              <li>Choose varieties adapted to your area's Growing Degree Days</li>
              <li>Consider disease resistance packages</li>
              <li>Match maturity to field conditions and market needs</li>
            </ul>
          </div>

          <div class="practice-category">
            <h5>Planting Management</h5>
            <ul>
              <li>Plant when soil temperature is consistently above 50°F</li>
              <li>Optimal planting date: May 1-15 in Illinois</li>
              <li>Plant depth: 1.5-2.5 inches depending on conditions</li>
            </ul>
          </div>

          <div class="practice-category">
            <h5>Nutrient Management</h5>
            <ul>
              <li>Soil test to determine nutrient needs</li>
              <li>Split nitrogen applications for efficiency</li>
              <li>Consider variable rate application technology</li>
            </ul>
          </div>

          <div class="practice-category">
            <h5>Pest Management</h5>
            <ul>
              <li>Scout regularly for insects and diseases</li>
              <li>Use economic thresholds for treatment decisions</li>
              <li>Integrate multiple control methods (IPM)</li>
            </ul>
          </div>
        </div>

        <div class="economic-analysis">
          <h4>Economic Considerations</h4>
          <div class="cost-breakdown">
            <div class="cost-item">
              <span>Seed Costs</span>
              <span>$120-150/acre</span>
            </div>
            <div class="cost-item">
              <span>Fertilizer</span>
              <span>$200-300/acre</span>
            </div>
            <div class="cost-item">
              <span>Pesticides</span>
              <span>$80-120/acre</span>
            </div>
            <div class="cost-item">
              <span>Field Operations</span>
              <span>$150-200/acre</span>
            </div>
            <div class="cost-item total">
              <span><strong>Total Variable Costs</strong></span>
              <span><strong>$550-770/acre</strong></span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('tab-btn')) {
        // Handle tab switching
        const tabName = target.getAttribute('data-tab');
        
        // Update active tab button
        this.container.querySelectorAll('.tab-btn').forEach(btn => 
          btn.classList.remove('active')
        );
        target.classList.add('active');
        
        // Update active content
        this.container.querySelectorAll('.tab-content').forEach(content => 
          content.classList.remove('active')
        );
        
        const activeContent = this.container.querySelector(`#${tabName}-content`);
        activeContent?.classList.add('active');
      }
    });
  }

  public showTab(tabName: string): void {
    const tabButton = this.container.querySelector(`[data-tab="${tabName}"]`);
    if (tabButton) {
      (tabButton as HTMLElement).click();
    }
  }
}