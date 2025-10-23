export class CornField {
  private container: HTMLElement;
  private cornPlants: HTMLElement[] = [];
  private soil!: HTMLElement;
  private readonly PLANT_COUNT = 20;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init(): void {
    this.container.innerHTML = `
      <div class="corn-field">
        ${Array.from({ length: this.PLANT_COUNT }, (_, i) => 
          `<div class="corn-plant" data-plant="${i + 1}"></div>`
        ).join('')}
      </div>
      <div class="soil"></div>
    `;

    this.cornPlants = Array.from(this.container.querySelectorAll('.corn-plant'));
    this.soil = this.container.querySelector('.soil') as HTMLElement;
  }

  updatePlantGrowth(growthLevel: number): void {
    this.cornPlants.forEach((plant, index) => {
      // Stagger growth slightly between plants for realism
      const plantGrowthLevel = Math.max(0, growthLevel - (index % 3));
      plant.className = `corn-plant growth-${Math.min(plantGrowthLevel, 11)}`;
    });
  }

  updateSoilCondition(condition: 'normal' | 'dry' | 'drought'): void {
    this.soil.className = `soil soil-${condition}`;
  }

  highlightGrowthStage(stage: string): void {
    // Add visual indicators for growth stages
    const indicator = document.createElement('div');
    indicator.className = 'growth-stage-indicator';
    indicator.textContent = stage;
    indicator.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 100;
    `;

    // Remove previous indicator
    const existing = this.container.querySelector('.growth-stage-indicator');
    if (existing) existing.remove();

    this.container.style.position = 'relative';
    this.container.appendChild(indicator);

    // Auto-remove after 3 seconds
    setTimeout(() => indicator.remove(), 3000);
  }
}