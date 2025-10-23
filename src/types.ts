// Temperature data structure
export interface TemperatureData {
  maxTemp: number;
  minTemp: number;
}

// Environmental factors
export interface EnvironmentalFactors {
  soilTexture: 'fine' | 'coarse';
  seedZone: 'optimum' | 'suboptimal';
  seedBed: 'normal' | 'poor';
  seedingDepth: 'one' | 'two' | 'three' | 'four';
  plantingDate: 'before' | 'optimal' | 'after';
}

// Growth stages
export interface GrowthStages {
  VE: boolean;   // Emergence
  V2: boolean;   // V2 Stage
  V3: boolean;   // V3 Stage
  V6: boolean;   // V6 Stage
  V8: boolean;   // V8 Stage
  V10: boolean;  // V10 Stage
  VT: boolean;   // Tasseling
  R2: boolean;   // Blister
  R4: boolean;   // Dough
  R5: boolean;   // Dent
  R6: boolean;   // Maturity
}

// Drought conditions
export interface DroughtConditions {
  moderate: boolean;
  severe: boolean;
  extreme: boolean;
}

// Simulation state
export interface SimulationState {
  day: number;
  gdu: number;
  growthLevel: number;
  estimatedYield: number;
  temperatureData: TemperatureData[];
  environmentalFactors: EnvironmentalFactors;
  growthStages: GrowthStages;
  droughtConditions: DroughtConditions;
}