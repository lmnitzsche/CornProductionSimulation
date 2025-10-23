import { SimulationState, EnvironmentalFactors, TemperatureData } from './types';

export class FileManager {
  static async loadTemperatureData(file: File): Promise<TemperatureData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const fileText = event.target?.result as string;
          const values = fileText.split(',');
          const temperatureData: TemperatureData[] = [];

          for (let i = 0; i < values.length; i += 2) {
            const maxTemp = parseInt(values[i]?.trim() || '0');
            const minTemp = parseInt(values[i + 1]?.trim() || '0');
            
            if (!isNaN(maxTemp) && !isNaN(minTemp)) {
              temperatureData.push({ maxTemp, minTemp });
            }
          }
          
          resolve(temperatureData);
        } catch (error) {
          reject(new Error('Failed to parse temperature data'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  static async loadEnvironmentalData(file: File): Promise<Partial<EnvironmentalFactors>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const fileText = event.target?.result as string;
          const values = fileText.split(',').map(v => v.trim());

          const environmentalData: Partial<EnvironmentalFactors> = {};

          if (values[0]) environmentalData.soilTexture = values[0] as 'fine' | 'coarse';
          if (values[1]) environmentalData.seedZone = values[1] as 'optimum' | 'suboptimal';
          if (values[2]) environmentalData.seedBed = values[2] as 'normal' | 'poor';
          if (values[3]) environmentalData.seedingDepth = values[3] as 'one' | 'two' | 'three' | 'four';
          if (values[4]) environmentalData.plantingDate = values[4] as 'before' | 'optimal' | 'after';

          resolve(environmentalData);
        } catch (error) {
          reject(new Error('Failed to parse environmental data'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  static exportSimulationData(state: SimulationState): void {
    const data = {
      day: state.day,
      gdu: state.gdu,
      estimatedYield: state.estimatedYield,
      growthStages: state.growthStages,
      environmentalFactors: state.environmentalFactors,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cornview-simulation-day-${state.day}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static createSampleTemperatureFile(): void {
    // Create a sample temperature file for testing
    const sampleData = Array.from({ length: 30 }, () => {
      const maxTemp = Math.floor(Math.random() * 20) + 75; // 75-95°F
      const minTemp = maxTemp - Math.floor(Math.random() * 15) - 10; // 10-25°F lower
      return `${maxTemp},${minTemp}`;
    }).join(',');

    const blob = new Blob([sampleData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-temperature-data.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}