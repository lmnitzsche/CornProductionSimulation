import { CountyData, illinoisCounties } from '../data/illinois-counties';

export class IllinoisCountyMap {
  private container: HTMLElement;
  private selectedCounty: CountyData | null = null;
  private onCountySelect: (county: CountyData) => void;

  constructor(container: HTMLElement, onCountySelect: (county: CountyData) => void) {
    this.container = container;
    this.onCountySelect = onCountySelect;
    this.init();
  }

  private init(): void {
    this.container.innerHTML = `
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
    `;

    this.setupEventListeners();
  }

  private createCountyCards(): string {
    return illinoisCounties.map(county => `
      <div class="county-card" data-county="${county.name}" data-region="${county.region}">
        <div class="county-header">
          <h3>${county.name} County</h3>
          <span class="county-rank">#${county.production.rank}</span>
        </div>
        
        <div class="county-stats">
          <div class="stat">
            <span class="stat-label">Avg Yield:</span>
            <span class="stat-value">${county.production.averageYield} bu/ac</span>
          </div>
          <div class="stat">
            <span class="stat-label">Total Acres:</span>
            <span class="stat-value">${county.production.totalAcres.toLocaleString()}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Soil Rating:</span>
            <span class="stat-value">${county.soilData.cornSuitabilityRating}/100</span>
          </div>
          <div class="stat">
            <span class="stat-label">Avg GDD:</span>
            <span class="stat-value">${county.climate.averageGDD}</span>
          </div>
        </div>
        
        <div class="county-details">
          <p><strong>Primary Soil:</strong> ${county.soilData.primarySoilType}</p>
          <p><strong>Climate Zone:</strong> ${county.climate.zone}</p>
          <p><strong>Region:</strong> ${county.region}</p>
        </div>
        
        <button class="select-county-btn" data-county="${county.name}">
          Select County
        </button>
      </div>
    `).join('');
  }



  private setupEventListeners(): void {
    // County selection from cards
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('select-county-btn')) {
        const countyName = target.getAttribute('data-county');
        const county = illinoisCounties.find(c => c.name === countyName);
        if (county) {
          this.selectCounty(county);
        }
      }
    });

    // Sort controls
    const sortSelect = this.container.querySelector('#sort-select') as HTMLSelectElement;
    sortSelect?.addEventListener('change', () => {
      this.sortCounties(sortSelect.value);
    });

    // Search functionality
    const searchInput = this.container.querySelector('#county-search') as HTMLInputElement;
    searchInput?.addEventListener('input', () => {
      this.searchCounties(searchInput.value);
    });

    // Initialize with GDD sorting
    this.sortCounties('gdd');
  }

  private selectCounty(county: CountyData): void {
    this.selectedCounty = county;
    
    // Update UI
    this.container.querySelectorAll('.county-card').forEach(card => 
      card.classList.remove('selected')
    );
    
    const selectedCard = this.container.querySelector(`[data-county="${county.name}"]`);
    selectedCard?.classList.add('selected');
    
    // Call the callback
    this.onCountySelect(county);
    
    // Smooth scroll to show selection
    selectedCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }



  private sortCounties(sortBy: string): void {
    const cardsContainer = this.container.querySelector('#county-cards');
    if (!cardsContainer) return;
    
    const cards = Array.from(cardsContainer.querySelectorAll('.county-card'));
    
    cards.sort((a, b) => {
      const aCounty = illinoisCounties.find(c => c.name === a.getAttribute('data-county'));
      const bCounty = illinoisCounties.find(c => c.name === b.getAttribute('data-county'));
      
      if (!aCounty || !bCounty) return 0;
      
      switch (sortBy) {
        case 'gdd':
          return bCounty.climate.averageGDD - aCounty.climate.averageGDD;
        case 'yield':
          return bCounty.production.averageYield - aCounty.production.averageYield;
        case 'rank':
          return aCounty.production.rank - bCounty.production.rank;
        case 'acres':
          return bCounty.production.totalAcres - aCounty.production.totalAcres;
        case 'name':
        default:
          return aCounty.name.localeCompare(bCounty.name);
      }
    });
    
    // Re-append sorted cards
    cards.forEach(card => cardsContainer.appendChild(card));
  }

  private searchCounties(searchTerm: string): void {
    const cards = this.container.querySelectorAll('.county-card');
    const term = searchTerm.toLowerCase();
    
    cards.forEach(card => {
      const cardElement = card as HTMLElement;
      const countyName = cardElement.getAttribute('data-county')?.toLowerCase();
      
      if (!term || countyName?.includes(term)) {
        cardElement.style.display = 'block';
      } else {
        cardElement.style.display = 'none';
      }
    });
  }

  public getSelectedCounty(): CountyData | null {
    return this.selectedCounty;
  }

  public highlightCounty(countyName: string): void {
    const county = illinoisCounties.find(c => c.name === countyName);
    if (county) {
      this.selectCounty(county);
    }
  }
}