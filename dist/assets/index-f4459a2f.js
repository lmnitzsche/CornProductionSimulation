var m=Object.defineProperty;var v=(r,e,t)=>e in r?m(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var l=(r,e,t)=>(v(r,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();class y{constructor(){l(this,"BASE_TEMP",50);l(this,"CAP_TEMP",86);l(this,"GROWTH_STAGES",[{stage:"Emergence",code:"VE",gduRequired:115,description:"Coleoptile breaks soil surface",criticalFactors:["soil temperature","soil moisture","planting depth"],yieldImpact:.85},{stage:"2-Leaf",code:"V2",gduRequired:200,description:"Second leaf collar visible",criticalFactors:["nitrogen availability","root development"],yieldImpact:.9},{stage:"4-Leaf",code:"V4",gduRequired:350,description:"Fourth leaf collar visible",criticalFactors:["moisture stress","nitrogen uptake"],yieldImpact:.92},{stage:"6-Leaf",code:"V6",gduRequired:500,description:"Sixth leaf collar visible, rapid growth begins",criticalFactors:["nutrient availability","moisture","temperature"],yieldImpact:.95},{stage:"8-Leaf",code:"V8",gduRequired:650,description:"Eighth leaf collar visible",criticalFactors:["moisture stress sensitivity increases"],yieldImpact:.95},{stage:"10-Leaf",code:"V10",gduRequired:850,description:"Tenth leaf collar visible",criticalFactors:["ear shoot development","moisture critical"],yieldImpact:.96},{stage:"12-Leaf",code:"V12",gduRequired:1050,description:"Twelfth leaf collar visible",criticalFactors:["ear size determination","stress sensitivity peak"],yieldImpact:.97},{stage:"Tasseling",code:"VT",gduRequired:1400,description:"Tassel emergence and pollen shed",criticalFactors:["moisture stress critical","heat stress","pollination"],yieldImpact:.85},{stage:"Silking",code:"R1",gduRequired:1450,description:"Silks emerge from ear shoots",criticalFactors:["moisture critical","pollination window","heat stress"],yieldImpact:.8},{stage:"Blister",code:"R2",gduRequired:1650,description:"Kernels resemble blisters, rapid grain fill begins",criticalFactors:["moisture for grain fill","nutrient availability"],yieldImpact:.9},{stage:"Milk",code:"R3",gduRequired:1850,description:"Kernels contain milky fluid",criticalFactors:["moisture stress affects grain fill","disease pressure"],yieldImpact:.95},{stage:"Dough",code:"R4",gduRequired:2050,description:"Grain fill continues, kernel moisture ~70%",criticalFactors:["continued moisture needs","disease/insect pressure"],yieldImpact:.98},{stage:"Dent",code:"R5",gduRequired:2450,description:"Kernels begin to dent, ~55% moisture",criticalFactors:["grain fill completion","premature death prevention"],yieldImpact:.99},{stage:"Maturity",code:"R6",gduRequired:2700,description:"Black layer formation, physiological maturity",criticalFactors:["harvest timing","field drying"],yieldImpact:1}])}calculateDailyGDU(e,t){const a=Math.min(e,this.CAP_TEMP),i=Math.max(t,this.BASE_TEMP);if(e<=this.BASE_TEMP)return 0;const s=(a+i)/2;return Math.max(0,s-this.BASE_TEMP)}calculateInitialGDU(e,t){let a=0;switch(t.soilTemp>=50?a+=25:t.soilTemp>=45&&(a+=15),t.plantingDepth>2&&(a-=(t.plantingDepth-2)*15),e.soilData.drainageClass){case"Well-drained":a+=20;break;case"Moderately well-drained":a+=10;break;case"Somewhat poorly drained":a+=0;break;case"Poorly drained":a-=15;break}t.seedTreatment&&(a+=10);const i=new Date(t.plantingDate.getFullYear(),4,1),s=new Date(t.plantingDate.getFullYear(),4,15);if(t.plantingDate>=i&&t.plantingDate<=s)a+=15;else if(t.plantingDate<i){const n=Math.floor((i.getTime()-t.plantingDate.getTime())/864e5);a-=n*2}else{const n=Math.floor((t.plantingDate.getTime()-s.getTime())/864e5);a-=n*1.5}return Math.max(0,a)}calculatePotentialYield(e,t,a){let i=e.production.averageYield;const s=Math.min(1,t/2700);i*=s;const n=e.soilData.cornSuitabilityRating/100;i*=.7+.3*n,i*=.4+.6*a.soilMoisture;const o=34e3,c=Math.min(1,a.plantPopulation/o);i*=c;const p=Math.min(1,a.nitrogen/180),u=Math.min(1,a.phosphorus/40),g=Math.min(1,a.potassium/160),h=Math.min(p,u,g);return i*=.6+.4*h,i*=1-a.diseasePress*.3,i*=1-a.insectPress*.25,i*=1-a.weedPress*.4,Math.round(i*100)/100}getCurrentGrowthStage(e){for(let t=this.GROWTH_STAGES.length-1;t>=0;t--)if(e>=this.GROWTH_STAGES[t].gduRequired)return this.GROWTH_STAGES[t];return null}getNextGrowthStage(e){for(const t of this.GROWTH_STAGES)if(e<t.gduRequired)return t;return null}getDaysToNextStage(e,t){const a=this.getNextGrowthStage(e);if(!a)return 0;const i=a.gduRequired-e;return Math.ceil(i/t)}getAllGrowthStages(){return[...this.GROWTH_STAGES]}calculateStressImpact(e,t,a){const i={drought:.6,heat:.4,flooding:.3,hail:.8,frost:.9},s=["VT","R1","R2"].includes(a.code)?1.5:1;return i[e]*t*s*(1-a.yieldImpact)}}const d=[{name:"McLean",fips:"17113",region:"Central",coordinates:[40.4842,-88.9781],soilData:{primarySoilType:"Drummer silty clay loam",drainageClass:"Somewhat poorly drained",organicMatter:4.2,pH:6.8,cornSuitabilityRating:95},climate:{averageGDD:3100,averageRainfall:37.5,frostFreeDays:175,zone:"5b"},production:{averageYield:195,totalAcres:285e3,rank:1},economics:{averageRentPerAcre:295,averageLandValue:12500}},{name:"Champaign",fips:"17019",region:"Central",coordinates:[40.1164,-88.2434],soilData:{primarySoilType:"Flanagan silt loam",drainageClass:"Well-drained",organicMatter:3.8,pH:6.5,cornSuitabilityRating:92},climate:{averageGDD:3050,averageRainfall:39.2,frostFreeDays:170,zone:"5b"},production:{averageYield:188,totalAcres:195e3,rank:3},economics:{averageRentPerAcre:285,averageLandValue:11800}},{name:"Iroquois",fips:"17075",region:"Central",coordinates:[40.7436,-87.5831],soilData:{primarySoilType:"Chalmers silty clay loam",drainageClass:"Poorly drained",organicMatter:4.5,pH:6.9,cornSuitabilityRating:88},climate:{averageGDD:2950,averageRainfall:36.8,frostFreeDays:165,zone:"5a"},production:{averageYield:182,totalAcres:275e3,rank:2},economics:{averageRentPerAcre:270,averageLandValue:10900}},{name:"Ford",fips:"17053",region:"Central",coordinates:[40.4586,-88.1142],soilData:{primarySoilType:"Elliott silt loam",drainageClass:"Moderately well-drained",organicMatter:3.9,pH:6.7,cornSuitabilityRating:90},climate:{averageGDD:3e3,averageRainfall:38.1,frostFreeDays:168,zone:"5b"},production:{averageYield:185,totalAcres:145e3,rank:8},economics:{averageRentPerAcre:275,averageLandValue:11200}},{name:"Livingston",fips:"17105",region:"Central",coordinates:[40.8614,-88.5431],soilData:{primarySoilType:"Saunemin silt loam",drainageClass:"Well-drained",organicMatter:3.6,pH:6.6,cornSuitabilityRating:87},climate:{averageGDD:2980,averageRainfall:36.5,frostFreeDays:162,zone:"5a"},production:{averageYield:178,totalAcres:205e3,rank:5},economics:{averageRentPerAcre:260,averageLandValue:10500}},{name:"Macon",fips:"17115",region:"Central",coordinates:[39.8481,-89.0037],soilData:{primarySoilType:"Denny silt loam",drainageClass:"Moderately well-drained",organicMatter:4.1,pH:6.8,cornSuitabilityRating:89},climate:{averageGDD:3150,averageRainfall:38.7,frostFreeDays:178,zone:"6a"},production:{averageYield:183,totalAcres:175e3,rank:6},economics:{averageRentPerAcre:280,averageLandValue:11e3}},{name:"Sangamon",fips:"17167",region:"Central",coordinates:[39.6401,-89.6501],soilData:{primarySoilType:"Ipava silt loam",drainageClass:"Somewhat poorly drained",organicMatter:3.7,pH:6.4,cornSuitabilityRating:85},climate:{averageGDD:3200,averageRainfall:37.9,frostFreeDays:180,zone:"6a"},production:{averageYield:176,totalAcres:165e3,rank:9},economics:{averageRentPerAcre:265,averageLandValue:10200}},{name:"Piatt",fips:"17147",region:"Central",coordinates:[39.9781,-88.5431],soilData:{primarySoilType:"Catlin silt loam",drainageClass:"Well-drained",organicMatter:4,pH:6.7,cornSuitabilityRating:93},climate:{averageGDD:3080,averageRainfall:38.9,frostFreeDays:172,zone:"5b"},production:{averageYield:190,totalAcres:135e3,rank:4},economics:{averageRentPerAcre:290,averageLandValue:12e3}},{name:"DeWitt",fips:"17039",region:"Central",coordinates:[40.1542,-88.7831],soilData:{primarySoilType:"Drummer silty clay loam",drainageClass:"Somewhat poorly drained",organicMatter:4.3,pH:6.9,cornSuitabilityRating:91},climate:{averageGDD:3020,averageRainfall:37.8,frostFreeDays:168,zone:"5b"},production:{averageYield:186,totalAcres:125e3,rank:7},economics:{averageRentPerAcre:285,averageLandValue:11500}},{name:"Logan",fips:"17107",region:"Central",coordinates:[40.1481,-89.4031],soilData:{primarySoilType:"Hartsburg silty clay loam",drainageClass:"Poorly drained",organicMatter:4.4,pH:7,cornSuitabilityRating:86},climate:{averageGDD:3100,averageRainfall:37.2,frostFreeDays:170,zone:"5b"},production:{averageYield:179,totalAcres:155e3,rank:10},economics:{averageRentPerAcre:270,averageLandValue:10800}}];class f{constructor(e,t){l(this,"container");l(this,"selectedCounty",null);l(this,"onCountySelect");this.container=e,this.onCountySelect=t,this.init()}init(){this.container.innerHTML=`
      <div class="county-selector-container">
        <div class="selector-header">
          <h2>Select an Illinois County</h2>
          <p>Choose a county to view detailed corn production data and run simulations</p>
        </div>
        
        <div class="county-search">
          <input type="text" id="county-search" placeholder="Search counties by name...">
        </div>
        
        <div class="sort-controls">
          <label for="sort-select">Sort by:</label>
          <select id="sort-select">
            <option value="gdd" selected>Growing Degree Days (Default)</option>
            <option value="name">County Name</option>
            <option value="yield">Average Yield</option>
            <option value="rank">State Ranking</option>
            <option value="acres">Total Acres</option>
          </select>
        </div>

        <div class="county-cards" id="county-cards">
          ${this.createCountyCards()}
        </div>
      </div>
    `,this.setupEventListeners()}createCountyCards(){return d.map(e=>`
      <div class="county-card" data-county="${e.name}" data-region="${e.region}">
        <div class="county-header">
          <h3>${e.name} County</h3>
          <span class="county-rank">#${e.production.rank}</span>
        </div>
        
        <div class="county-stats">
          <div class="stat">
            <span class="stat-label">Avg Yield:</span>
            <span class="stat-value">${e.production.averageYield} bu/ac</span>
          </div>
          <div class="stat">
            <span class="stat-label">Total Acres:</span>
            <span class="stat-value">${e.production.totalAcres.toLocaleString()}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Soil Rating:</span>
            <span class="stat-value">${e.soilData.cornSuitabilityRating}/100</span>
          </div>
          <div class="stat">
            <span class="stat-label">Avg GDD:</span>
            <span class="stat-value">${e.climate.averageGDD}</span>
          </div>
        </div>
        
        <div class="county-details">
          <p><strong>Primary Soil:</strong> ${e.soilData.primarySoilType}</p>
          <p><strong>Climate Zone:</strong> ${e.climate.zone}</p>
          <p><strong>Region:</strong> ${e.region}</p>
        </div>
        
        <button class="select-county-btn" data-county="${e.name}">
          Select County
        </button>
      </div>
    `).join("")}setupEventListeners(){this.container.addEventListener("click",a=>{const i=a.target;if(i.classList.contains("select-county-btn")){const s=i.getAttribute("data-county"),n=d.find(o=>o.name===s);n&&this.selectCounty(n)}});const e=this.container.querySelector("#sort-select");e==null||e.addEventListener("change",()=>{this.sortCounties(e.value)});const t=this.container.querySelector("#county-search");t==null||t.addEventListener("input",()=>{this.searchCounties(t.value)}),this.sortCounties("gdd")}selectCounty(e){this.selectedCounty=e,this.container.querySelectorAll(".county-card").forEach(a=>a.classList.remove("selected"));const t=this.container.querySelector(`[data-county="${e.name}"]`);t==null||t.classList.add("selected"),this.onCountySelect(e),t==null||t.scrollIntoView({behavior:"smooth",block:"nearest"})}sortCounties(e){const t=this.container.querySelector("#county-cards");if(!t)return;const a=Array.from(t.querySelectorAll(".county-card"));a.sort((i,s)=>{const n=d.find(c=>c.name===i.getAttribute("data-county")),o=d.find(c=>c.name===s.getAttribute("data-county"));if(!n||!o)return 0;switch(e){case"gdd":return o.climate.averageGDD-n.climate.averageGDD;case"yield":return o.production.averageYield-n.production.averageYield;case"rank":return n.production.rank-o.production.rank;case"acres":return o.production.totalAcres-n.production.totalAcres;case"name":default:return n.name.localeCompare(o.name)}}),a.forEach(i=>t.appendChild(i))}searchCounties(e){const t=this.container.querySelectorAll(".county-card"),a=e.toLowerCase();t.forEach(i=>{var o;const s=i,n=(o=s.getAttribute("data-county"))==null?void 0:o.toLowerCase();!a||n!=null&&n.includes(a)?s.style.display="block":s.style.display="none"})}getSelectedCounty(){return this.selectedCounty}highlightCounty(e){const t=d.find(a=>a.name===e);t&&this.selectCounty(t)}}class b{constructor(e){l(this,"container");this.container=e,this.init()}init(){this.container.innerHTML=`
      <div class="education-panel">
        <div class="education-header">
          <h2>🌽 Learn About Corn Production</h2>
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
    `,this.setupEventListeners()}createGDUContent(){return`
      <div class="tab-content active" id="gdu-content">
        <h3>Growing Degree Units (GDU) 🌡️</h3>
        
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

        <div class="gdu-chart">
          <h4>Typical Illinois GDU Accumulation</h4>
          <canvas id="gdu-chart" width="400" height="200"></canvas>
        </div>
      </div>
    `}createGrowthStagesContent(){return`
      <div class="tab-content" id="growth-content">
        <h3>Corn Growth Stages 🌱</h3>
        
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
            <h5>🔴 VT to R2 (Tasseling to Blister)</h5>
            <p>Most critical period for yield determination. Moisture stress during this 2-3 week period can reduce yields by 3-7% per day of stress.</p>
          </div>
          <div class="critical-period">
            <h5>🟡 V6 to V10 (6th to 10th Leaf)</h5>
            <p>Ear size determination period. Stress can reduce kernel rows and ear length.</p>
          </div>
        </div>
      </div>
    `}createSoilScienceContent(){return`
      <div class="tab-content" id="soil-content">
        <h3>Soil Science for Corn Production 🏞️</h3>
        
        <div class="soil-types">
          <h4>Illinois Soil Types</h4>
          
          <div class="soil-type-card">
            <h5>Drummer Silty Clay Loam</h5>
            <div class="soil-properties">
              <span class="property">🏆 Corn Suitability: 95/100</span>
              <span class="property">💧 Drainage: Somewhat Poorly Drained</span>
              <span class="property">🍃 Organic Matter: 4.2%</span>
            </div>
            <p>Illinois' premier corn soil. Dark, rich, and fertile. Found in McLean County and other top producing areas.</p>
          </div>

          <div class="soil-type-card">
            <h5>Flanagan Silt Loam</h5>
            <div class="soil-properties">
              <span class="property">🏆 Corn Suitability: 92/100</span>
              <span class="property">💧 Drainage: Well Drained</span>
              <span class="property">🍃 Organic Matter: 3.8%</span>
            </div>
            <p>Excellent corn soil with good drainage. Common in east-central Illinois.</p>
          </div>
        </div>

        <div class="soil-factors">
          <h4>Key Soil Factors for Corn</h4>
          
          <div class="factor-grid">
            <div class="factor-card">
              <h5>🌡️ Soil Temperature</h5>
              <p>Corn germinates best when soil temperature is consistently above 50°F at 2-inch depth. Cold soils delay emergence and increase disease risk.</p>
            </div>

            <div class="factor-card">
              <h5>💧 Soil Moisture</h5>
              <p>Adequate moisture is critical for germination and early growth. Overly wet soils can cause compaction and poor root development.</p>
            </div>

            <div class="factor-card">
              <h5>🧪 pH Level</h5>
              <p>Optimal pH range: 6.0-6.8. Low pH reduces nutrient availability, while high pH can cause iron deficiency.</p>
            </div>

            <div class="factor-card">
              <h5>🍃 Organic Matter</h5>
              <p>Higher organic matter improves water holding capacity, nutrient retention, and soil structure. Illinois soils average 3-5%.</p>
            </div>

            <div class="factor-card">
              <h5>🏗️ Soil Structure</h5>
              <p>Good soil structure allows root penetration and water infiltration. Compaction can reduce yields significantly.</p>
            </div>

            <div class="factor-card">
              <h5>💨 Drainage</h5>
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
    `}createClimateContent(){return`
      <div class="tab-content" id="climate-content">
        <h3>Climate Factors 🌤️</h3>
        
        <div class="climate-overview">
          <h4>Illinois Climate Zones</h4>
          <div class="zone-grid">
            <div class="zone-card">
              <h5>Northern Illinois (Zone 5a-5b)</h5>
              <p><strong>GDD:</strong> 2,800-3,000</p>
              <p><strong>Frost-Free Days:</strong> 160-170</p>
              <p>Cooler temperatures, shorter growing season. Requires earlier maturing corn varieties.</p>
            </div>
            <div class="zone-card">
              <h5>Central Illinois (Zone 5b-6a)</h5>
              <p><strong>GDD:</strong> 3,000-3,200</p>
              <p><strong>Frost-Free Days:</strong> 170-180</p>
              <p>Optimal corn growing conditions. Highest yields in the state.</p>
            </div>
            <div class="zone-card">
              <h5>Southern Illinois (Zone 6a-6b)</h5>
              <p><strong>GDD:</strong> 3,200-3,400</p>
              <p><strong>Frost-Free Days:</strong> 180-190</p>
              <p>Warmer temperatures, longer season. Heat stress can be a concern.</p>
            </div>
          </div>
        </div>

        <div class="weather-factors">
          <h4>Critical Weather Factors</h4>
          
          <div class="weather-impact">
            <h5>☀️ Temperature</h5>
            <ul>
              <li><strong>Optimal Growing Range:</strong> 77-91°F (25-33°C)</li>
              <li><strong>Heat Stress:</strong> Above 95°F during pollination can reduce kernel set</li>
              <li><strong>Cool Weather:</strong> Below 50°F stops growth completely</li>
            </ul>
          </div>

          <div class="weather-impact">
            <h5>💧 Precipitation</h5>
            <ul>
              <li><strong>Annual Needs:</strong> 20-30 inches during growing season</li>
              <li><strong>Critical Periods:</strong> VT to R2 needs 1-1.5 inches per week</li>
              <li><strong>Timing:</strong> Distribution more important than total amount</li>
            </ul>
          </div>

          <div class="weather-impact">
            <h5>🌬️ Wind</h5>
            <ul>
              <li><strong>Pollination:</strong> Light winds aid pollen dispersal</li>
              <li><strong>Strong Winds:</strong> Can cause root lodging and stalk breakage</li>
              <li><strong>Green Snap:</strong> Rapid growth + wind can break stalks</li>
            </ul>
          </div>

          <div class="weather-impact">
            <h5>☁️ Solar Radiation</h5>
            <ul>
              <li><strong>Photosynthesis:</strong> More sunlight = more grain fill</li>
              <li><strong>Cloudy Weather:</strong> During grain fill reduces yield</li>
              <li><strong>Day Length:</strong> Corn is not sensitive to photoperiod</li>
            </ul>
          </div>
        </div>

        <div class="drought-stress">
          <h4>🔥 Drought Stress Impact</h4>
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
    `}createYieldFactorsContent(){return`
      <div class="tab-content" id="yield-content">
        <h3>Yield Factors & Optimization 📈</h3>
        
        <div class="yield-equation">
          <h4>Corn Yield Components</h4>
          <div class="equation-box">
            <p><strong>Yield = Plants/Acre × Ears/Plant × Kernels/Ear × Kernel Weight</strong></p>
          </div>
        </div>

        <div class="yield-factors-grid">
          <div class="yield-factor">
            <h5>🌱 Plant Population</h5>
            <div class="factor-details">
              <p><strong>Optimal:</strong> 32,000-36,000 plants/acre</p>
              <p><strong>Row Spacing:</strong> 30-inch rows standard</p>
              <p><strong>Impact:</strong> Too low = fewer plants, too high = competition</p>
            </div>
          </div>

          <div class="yield-factor">
            <h5>🌽 Ear Number</h5>
            <div class="factor-details">
              <p><strong>Typical:</strong> 1.0-1.05 ears per plant</p>
              <p><strong>Barren Plants:</strong> Stress can prevent ear development</p>
              <p><strong>Management:</strong> Balanced nutrition and moisture</p>
            </div>
          </div>

          <div class="yield-factor">
            <h5>🔢 Kernels per Ear</h5>
            <div class="factor-details">
              <p><strong>Range:</strong> 600-1,000 kernels per ear</p>
              <p><strong>Determined:</strong> V6 to V18 growth stages</p>
              <p><strong>Factors:</strong> Stress, nutrition, genetics</p>
            </div>
          </div>

          <div class="yield-factor">
            <h5>⚖️ Kernel Weight</h5>
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
            <h5>🌾 Variety Selection</h5>
            <ul>
              <li>Choose varieties adapted to your area's GDD</li>
              <li>Consider disease resistance packages</li>
              <li>Match maturity to field and market needs</li>
            </ul>
          </div>

          <div class="practice-category">
            <h5>🚜 Planting</h5>
            <ul>
              <li>Plant when soil temperature is consistently above 50°F</li>
              <li>Optimal planting date: May 1-15 in Illinois</li>
              <li>Plant depth: 1.5-2.5 inches depending on conditions</li>
            </ul>
          </div>

          <div class="practice-category">
            <h5>🧪 Nutrition</h5>
            <ul>
              <li>Soil test to determine nutrient needs</li>
              <li>Split nitrogen applications for efficiency</li>
              <li>Consider variable rate application</li>
            </ul>
          </div>

          <div class="practice-category">
            <h5>🐛 Pest Management</h5>
            <ul>
              <li>Scout regularly for insects and diseases</li>
              <li>Use economic thresholds for treatment decisions</li>
              <li>Integrate multiple control methods</li>
            </ul>
          </div>
        </div>

        <div class="economic-analysis">
          <h4>💰 Economic Considerations</h4>
          <div class="cost-breakdown">
            <div class="cost-item">
              <span>Seed</span>
              <span>$120-150/acre</span>
            </div>
            <div class="cost-item">
              <span>Fertilizer</span>
              <span>$200-300/acre</span>
            </div>
            <div class="cost-item">
              <span>Chemicals</span>
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
    `}setupEventListeners(){this.container.addEventListener("click",e=>{const t=e.target;if(t.classList.contains("tab-btn")){const a=t.getAttribute("data-tab");this.container.querySelectorAll(".tab-btn").forEach(s=>s.classList.remove("active")),t.classList.add("active"),this.container.querySelectorAll(".tab-content").forEach(s=>s.classList.remove("active"));const i=this.container.querySelector(`#${a}-content`);i==null||i.classList.add("active")}})}showTab(e){const t=this.container.querySelector(`[data-tab="${e}"]`);t&&t.click()}}class C{constructor(){l(this,"app");l(this,"state");l(this,"gduCalculator");l(this,"countyMap");l(this,"educationalContent");l(this,"animationId",null);this.app=document.getElementById("app"),this.gduCalculator=new y,this.initializeState(),this.initializeUI()}initializeState(){const e=new Date().getFullYear();this.state={selectedCounty:null,currentDay:1,totalGDU:0,currentGrowthStage:0,plantingDate:new Date(e,4,10),yieldFactors:{soilMoisture:.8,nitrogen:180,phosphorus:40,potassium:160,plantPopulation:34e3,diseasePress:.1,insectPress:.05,weedPress:.1},isRunning:!1,speed:1}}initializeUI(){this.app.innerHTML=`
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
          <section class="step-section ${this.state.selectedCounty?"completed":"active"}" id="county-selection">
            <div class="step-header">
              <h2><span class="step-number">1</span> Select Illinois County</h2>
              <p>Choose a county to analyze corn production potential and run simulations</p>
            </div>
            <div id="county-map-container"></div>
          </section>

          <!-- Step 2: Simulation Configuration -->
          <section class="step-section ${this.state.selectedCounty?"active":"disabled"}" id="simulation-config">
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
          <section class="step-section ${this.state.selectedCounty?"active":"disabled"}" id="simulation-viz">
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
    `,this.initializeComponents(),this.setupEventListeners()}initializeComponents(){const e=document.getElementById("county-map-container");this.countyMap=new f(e,a=>{this.selectCounty(a)});const t=document.getElementById("educational-content");this.educationalContent=new b(t),console.log("Components initialized:",{countyMap:!!this.countyMap,educationalContent:!!this.educationalContent})}setupEventListeners(){var e,t,a,i;(e=document.getElementById("play-simulation"))==null||e.addEventListener("click",()=>this.startSimulation()),(t=document.getElementById("pause-simulation"))==null||t.addEventListener("click",()=>this.pauseSimulation()),(a=document.getElementById("reset-simulation"))==null||a.addEventListener("click",()=>this.resetSimulation()),(i=document.getElementById("planting-date"))==null||i.addEventListener("change",s=>{const n=s.target;this.state.plantingDate=new Date(n.value),this.updateSimulation()}),this.setupRangeInputs()}setupRangeInputs(){[{id:"plant-population",display:"population-display",format:t=>`${t.toLocaleString()}`},{id:"nitrogen-rate",display:"nitrogen-display",format:t=>`${t}`},{id:"phosphorus-rate",display:"phosphorus-display",format:t=>`${t}`},{id:"potassium-rate",display:"potassium-display",format:t=>`${t}`},{id:"simulation-speed",display:"speed-display",format:t=>`${t}x`}].forEach(({id:t,display:a,format:i})=>{const s=document.getElementById(t),n=document.getElementById(a);s&&n&&s.addEventListener("input",()=>{const o=parseInt(s.value);switch(n.textContent=i(o),t){case"plant-population":this.state.yieldFactors.plantPopulation=o;break;case"nitrogen-rate":this.state.yieldFactors.nitrogen=o;break;case"phosphorus-rate":this.state.yieldFactors.phosphorus=o;break;case"potassium-rate":this.state.yieldFactors.potassium=o;break;case"simulation-speed":this.state.speed=o;break}this.updateSimulation()})})}selectCounty(e){var t,a,i,s;this.state.selectedCounty=e,document.getElementById("selected-county").textContent=`${e.name} County`,(t=document.getElementById("simulation-config"))==null||t.classList.remove("disabled"),(a=document.getElementById("simulation-viz"))==null||a.classList.remove("disabled"),(i=document.getElementById("county-selection"))==null||i.classList.remove("active"),(s=document.getElementById("county-selection"))==null||s.classList.add("completed"),this.calculateInitialGDU(),this.updateDisplay()}calculateInitialGDU(){if(!this.state.selectedCounty)return;const e=document.getElementById("planting-depth"),t=parseFloat((e==null?void 0:e.value)||"2");this.state.totalGDU=this.gduCalculator.calculateInitialGDU(this.state.selectedCounty,{plantingDate:this.state.plantingDate,plantingDepth:t,seedTreatment:!0,soilTemp:55})}startSimulation(){if(!this.state.selectedCounty)return;this.state.isRunning=!0;const e=document.getElementById("play-simulation"),t=document.getElementById("pause-simulation");e.disabled=!0,t.disabled=!1,this.runSimulationLoop()}pauseSimulation(){this.state.isRunning=!1;const e=document.getElementById("play-simulation"),t=document.getElementById("pause-simulation");e.disabled=!1,t.disabled=!0,this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}resetSimulation(){this.pauseSimulation(),this.state.currentDay=1,this.calculateInitialGDU(),this.state.currentGrowthStage=0,this.updateDisplay()}runSimulationLoop(){if(!this.state.isRunning||!this.state.selectedCounty)return;this.simulateDay();const e=Math.max(100,1e3/this.state.speed);setTimeout(()=>{this.animationId=requestAnimationFrame(()=>this.runSimulationLoop())},e)}simulateDay(){if(!this.state.selectedCounty)return;const e=75+Math.random()*20,t=e-15-Math.random()*10,a=this.gduCalculator.calculateDailyGDU(e,t);this.state.totalGDU+=a;const i=this.gduCalculator.getCurrentGrowthStage(this.state.totalGDU);if(i){const s=this.gduCalculator.getAllGrowthStages().findIndex(n=>n.code===i.code);this.state.currentGrowthStage=s}this.state.currentDay++,this.updateDisplay(),document.getElementById("current-temp").textContent=`${Math.round(e)}°F`,document.getElementById("daily-gdu").textContent=Math.round(a).toString(),this.state.totalGDU>=2700&&this.pauseSimulation()}updateSimulation(){if(!this.state.selectedCounty)return;const e=this.gduCalculator.calculatePotentialYield(this.state.selectedCounty,this.state.totalGDU,this.state.yieldFactors);document.getElementById("current-yield").textContent=`${e} bu/acre`,document.getElementById("potential-yield").textContent=`${this.state.selectedCounty.production.averageYield} bu/acre`}updateDisplay(){document.getElementById("current-day").textContent=this.state.currentDay.toString(),document.getElementById("total-gdu").textContent=Math.round(this.state.totalGDU).toString();const e=this.gduCalculator.getCurrentGrowthStage(this.state.totalGDU);if(e&&(document.getElementById("growth-stage").textContent=e.stage,document.getElementById("stage-name").textContent=e.stage,document.getElementById("stage-description").textContent=e.description),this.state.selectedCounty){const t=this.gduCalculator.calculatePotentialYield(this.state.selectedCounty,this.state.totalGDU,this.state.yieldFactors);document.getElementById("predicted-yield").textContent=`${t} bu/acre`}this.updateSimulation()}formatDate(e){return e.toISOString().split("T")[0]}}document.addEventListener("DOMContentLoaded",()=>{console.log("🌽 CornView Illinois Professional Simulation Starting...");try{new C,console.log("✅ CornView Illinois Simulation Initialized Successfully")}catch(r){console.error("❌ Failed to initialize CornView Simulation:",r);const e=document.getElementById("app");e&&(e.innerHTML=`
        <div style="text-align: center; padding: 50px; color: red;">
          <h1>Error Loading CornView Simulation</h1>
          <p>Please refresh the page and try again.</p>
          <p style="font-size: 12px; color: #666;">${r}</p>
        </div>
      `)}});"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(r=>{console.log("SW registered: ",r)}).catch(r=>{console.log("SW registration failed: ",r)})});
//# sourceMappingURL=index-f4459a2f.js.map
