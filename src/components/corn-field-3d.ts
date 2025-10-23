import * as THREE from 'three';

export class CornField3D {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cornPlants: THREE.Group[] = [];
  private field: THREE.Group;
  private container: HTMLElement;
  private animationId: number | null = null;

  // Field configuration
  private readonly FIELD_SIZE = 50;
  private readonly PLANT_COUNT = 400; // 20x20 grid
  private readonly PLANT_SPACING = 2.5;

  constructor(container: HTMLElement) {
    this.container = container;
    this.field = new THREE.Group();
    this.initializeScene();
    this.createField();
    this.setupLighting();
    this.startAnimation();
  }

  private initializeScene(): void {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(30, 25, 30);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
  }

  private createField(): void {
    // Create soil base
    const soilGeometry = new THREE.PlaneGeometry(this.FIELD_SIZE, this.FIELD_SIZE);
    const soilMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    soil.rotation.x = -Math.PI / 2;
    soil.receiveShadow = true;
    this.field.add(soil);

    // Create corn plants in a grid
    const plantsPerRow = Math.sqrt(this.PLANT_COUNT);
    const startX = -this.FIELD_SIZE / 2 + this.PLANT_SPACING;
    const startZ = -this.FIELD_SIZE / 2 + this.PLANT_SPACING;

    for (let row = 0; row < plantsPerRow; row++) {
      for (let col = 0; col < plantsPerRow; col++) {
        const x = startX + col * this.PLANT_SPACING;
        const z = startZ + row * this.PLANT_SPACING;
        
        // Add some randomness to position
        const randomX = x + (Math.random() - 0.5) * 0.5;
        const randomZ = z + (Math.random() - 0.5) * 0.5;
        
        const plant = this.createCornPlant();
        plant.position.set(randomX, 0, randomZ);
        
        // Add slight random rotation
        plant.rotation.y = Math.random() * Math.PI * 2;
        
        this.cornPlants.push(plant);
        this.field.add(plant);
      }
    }

    this.scene.add(this.field);
  }

  private createCornPlant(growthStage: number = 0): THREE.Group {
    const plant = new THREE.Group();

    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.1, 8);
    const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.05;
    stem.castShadow = true;
    plant.add(stem);

    // Store growth stage for later updates
    (plant as any).growthStage = growthStage;
    (plant as any).targetHeight = 0.1;
    (plant as any).currentHeight = 0.1;

    return plant;
  }

  private updatePlantGrowth(plant: THREE.Group, growthStage: number): void {
    const currentStage = (plant as any).growthStage || 0;
    if (currentStage === growthStage) return;

    (plant as any).growthStage = growthStage;

    // Clear existing plant parts except stem
    while (plant.children.length > 1) {
      plant.remove(plant.children[1]);
    }

    const stem = plant.children[0] as THREE.Mesh;
    
    // Calculate height based on growth stage
    let height = 0.1;
    let leafCount = 0;
    let hasEars = false;
    let hasTassel = false;
    let leafColor = 0x228B22;

    switch (growthStage) {
      case 0: // Emergence
        height = 0.3;
        leafCount = 1;
        break;
      case 1: // V2
        height = 0.6;
        leafCount = 2;
        break;
      case 2: // V4
        height = 1.2;
        leafCount = 4;
        break;
      case 3: // V6
        height = 2.0;
        leafCount = 6;
        break;
      case 4: // V8
        height = 2.8;
        leafCount = 8;
        break;
      case 5: // V10
        height = 3.5;
        leafCount = 10;
        break;
      case 6: // V12
        height = 4.2;
        leafCount = 12;
        break;
      case 7: // VT (Tasseling)
        height = 5.0;
        leafCount = 14;
        hasTassel = true;
        break;
      case 8: // R1 (Silking)
        height = 5.2;
        leafCount = 16;
        hasTassel = true;
        hasEars = true;
        break;
      case 9: // R2 (Blister)
        height = 5.5;
        leafCount = 16;
        hasTassel = true;
        hasEars = true;
        break;
      case 10: // R3-R4 (Milk/Dough)
        height = 6.0;
        leafCount = 16;
        hasTassel = true;
        hasEars = true;
        leafColor = 0x32CD32;
        break;
      case 11: // R5 (Dent)
        height = 6.0;
        leafCount = 16;
        hasTassel = true;
        hasEars = true;
        leafColor = 0xFFD700;
        break;
      case 12: // R6 (Maturity)
        height = 6.0;
        leafCount = 16;
        hasTassel = true;
        hasEars = true;
        leafColor = 0xDAA520;
        break;
    }

    // Update stem height
    const newStemGeometry = new THREE.CylinderGeometry(0.05, 0.08, height, 8);
    stem.geometry.dispose();
    stem.geometry = newStemGeometry;
    stem.position.y = height / 2;
    
    // Update stem color
    (stem.material as THREE.MeshLambertMaterial).color.setHex(leafColor);

    // Add leaves
    for (let i = 0; i < leafCount; i++) {
      const leaf = this.createLeaf(leafColor);
      const leafHeight = (height / leafCount) * (i + 1);
      leaf.position.y = leafHeight;
      leaf.rotation.y = (i * Math.PI * 2) / leafCount;
      plant.add(leaf);
    }

    // Add tassel
    if (hasTassel) {
      const tassel = this.createTassel();
      tassel.position.y = height + 0.3;
      plant.add(tassel);
    }

    // Add ears
    if (hasEars) {
      const ear1 = this.createEar();
      ear1.position.y = height * 0.7;
      ear1.position.x = 0.2;
      ear1.rotation.z = Math.PI / 6;
      plant.add(ear1);

      const ear2 = this.createEar();
      ear2.position.y = height * 0.6;
      ear2.position.x = -0.2;
      ear2.rotation.z = -Math.PI / 6;
      plant.add(ear2);
    }

    (plant as any).targetHeight = height;
  }

  private createLeaf(color: number): THREE.Mesh {
    const leafGeometry = new THREE.PlaneGeometry(0.8, 0.1);
    const leafMaterial = new THREE.MeshLambertMaterial({ 
      color: color,
      side: THREE.DoubleSide 
    });
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf.rotation.x = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    leaf.castShadow = true;
    return leaf;
  }

  private createTassel(): THREE.Group {
    const tassel = new THREE.Group();
    
    // Main tassel stem
    const stemGeometry = new THREE.CylinderGeometry(0.02, 0.03, 0.4, 6);
    const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    tassel.add(stem);

    // Tassel branches
    for (let i = 0; i < 8; i++) {
      const branchGeometry = new THREE.CylinderGeometry(0.01, 0.015, 0.2, 4);
      const branchMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
      const branch = new THREE.Mesh(branchGeometry, branchMaterial);
      
      const angle = (i / 8) * Math.PI * 2;
      branch.position.x = Math.cos(angle) * 0.1;
      branch.position.z = Math.sin(angle) * 0.1;
      branch.position.y = 0.1;
      branch.rotation.z = (Math.random() - 0.5) * 0.5;
      
      tassel.add(branch);
    }

    tassel.castShadow = true;
    return tassel;
  }

  private createEar(): THREE.Mesh {
    const earGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.4, 8);
    const earMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    const ear = new THREE.Mesh(earGeometry, earMaterial);
    ear.castShadow = true;
    return ear;
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    this.scene.add(directionalLight);
  }

  private startAnimation(): void {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      
      // Rotate camera around the field
      const time = Date.now() * 0.0005;
      this.camera.position.x = Math.cos(time) * 40;
      this.camera.position.z = Math.sin(time) * 40;
      this.camera.lookAt(0, 0, 0);
      
      // Add gentle wind effect to plants
      this.cornPlants.forEach((plant, index) => {
        const windStrength = 0.02;
        const windSpeed = time * 2 + index * 0.1;
        plant.rotation.z = Math.sin(windSpeed) * windStrength;
      });
      
      this.renderer.render(this.scene, this.camera);
    };
    
    animate();
  }

  private handleResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public updateGrowthStage(growthStage: number): void {
    // Update a random subset of plants for realistic variation
    const plantsToUpdate = Math.floor(this.cornPlants.length * 0.8);
    const shuffledPlants = [...this.cornPlants].sort(() => Math.random() - 0.5);
    
    shuffledPlants.slice(0, plantsToUpdate).forEach(plant => {
      this.updatePlantGrowth(plant, growthStage);
    });
  }

  public setSoilCondition(condition: 'normal' | 'dry' | 'drought'): void {
    const soil = this.field.children[0] as THREE.Mesh;
    const material = soil.material as THREE.MeshLambertMaterial;
    
    switch (condition) {
      case 'normal':
        material.color.setHex(0x8B4513);
        break;
      case 'dry':
        material.color.setHex(0xA0522D);
        break;
      case 'drought':
        material.color.setHex(0xD2691E);
        break;
    }
  }

  public showWeatherEffect(effect: 'rain' | 'sun' | 'clouds'): void {
    switch (effect) {
      case 'rain':
        this.scene.background = new THREE.Color(0x696969);
        break;
      case 'sun':
        this.scene.background = new THREE.Color(0x87CEEB);
        break;
      case 'clouds':
        this.scene.background = new THREE.Color(0xB0C4DE);
        break;
    }
  }

  public dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Clean up Three.js resources
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        }
      }
    });
    
    this.renderer.dispose();
    
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}