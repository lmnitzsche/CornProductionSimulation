// Illinois County Agricultural Data
// Based on USDA and University of Illinois Extension data

export interface CountyData {
  name: string;
  fips: string;
  region: 'Northern' | 'Central' | 'Southern';
  coordinates: [number, number]; // [lat, lng]
  soilData: {
    primarySoilType: string;
    drainageClass: 'Well-drained' | 'Moderately well-drained' | 'Somewhat poorly drained' | 'Poorly drained';
    organicMatter: number; // percentage
    pH: number;
    cornSuitabilityRating: number; // 1-100
  };
  climate: {
    averageGDD: number; // Growing Degree Days (base 50°F)
    averageRainfall: number; // inches per year
    frostFreeDays: number;
    zone: string; // Climate zone
  };
  production: {
    averageYield: number; // bushels per acre
    totalAcres: number;
    rank: number; // 1-102 ranking in state
  };
  economics: {
    averageRentPerAcre: number;
    averageLandValue: number;
  };
}

export const illinoisCounties: CountyData[] = [
  {
    name: "McLean",
    fips: "17113",
    region: "Central",
    coordinates: [40.4842, -88.9781],
    soilData: {
      primarySoilType: "Drummer silty clay loam",
      drainageClass: "Somewhat poorly drained",
      organicMatter: 4.2,
      pH: 6.8,
      cornSuitabilityRating: 95
    },
    climate: {
      averageGDD: 3100,
      averageRainfall: 37.5,
      frostFreeDays: 175,
      zone: "5b"
    },
    production: {
      averageYield: 195,
      totalAcres: 285000,
      rank: 1
    },
    economics: {
      averageRentPerAcre: 295,
      averageLandValue: 12500
    }
  },
  {
    name: "Champaign",
    fips: "17019",
    region: "Central",
    coordinates: [40.1164, -88.2434],
    soilData: {
      primarySoilType: "Flanagan silt loam",
      drainageClass: "Well-drained",
      organicMatter: 3.8,
      pH: 6.5,
      cornSuitabilityRating: 92
    },
    climate: {
      averageGDD: 3050,
      averageRainfall: 39.2,
      frostFreeDays: 170,
      zone: "5b"
    },
    production: {
      averageYield: 188,
      totalAcres: 195000,
      rank: 3
    },
    economics: {
      averageRentPerAcre: 285,
      averageLandValue: 11800
    }
  },
  {
    name: "Iroquois",
    fips: "17075",
    region: "Central",
    coordinates: [40.7436, -87.5831],
    soilData: {
      primarySoilType: "Chalmers silty clay loam",
      drainageClass: "Poorly drained",
      organicMatter: 4.5,
      pH: 6.9,
      cornSuitabilityRating: 88
    },
    climate: {
      averageGDD: 2950,
      averageRainfall: 36.8,
      frostFreeDays: 165,
      zone: "5a"
    },
    production: {
      averageYield: 182,
      totalAcres: 275000,
      rank: 2
    },
    economics: {
      averageRentPerAcre: 270,
      averageLandValue: 10900
    }
  },
  {
    name: "Ford",
    fips: "17053",
    region: "Central",
    coordinates: [40.4586, -88.1142],
    soilData: {
      primarySoilType: "Elliott silt loam",
      drainageClass: "Moderately well-drained",
      organicMatter: 3.9,
      pH: 6.7,
      cornSuitabilityRating: 90
    },
    climate: {
      averageGDD: 3000,
      averageRainfall: 38.1,
      frostFreeDays: 168,
      zone: "5b"
    },
    production: {
      averageYield: 185,
      totalAcres: 145000,
      rank: 8
    },
    economics: {
      averageRentPerAcre: 275,
      averageLandValue: 11200
    }
  },
  {
    name: "Livingston",
    fips: "17105",
    region: "Central",
    coordinates: [40.8614, -88.5431],
    soilData: {
      primarySoilType: "Saunemin silt loam",
      drainageClass: "Well-drained",
      organicMatter: 3.6,
      pH: 6.6,
      cornSuitabilityRating: 87
    },
    climate: {
      averageGDD: 2980,
      averageRainfall: 36.5,
      frostFreeDays: 162,
      zone: "5a"
    },
    production: {
      averageYield: 178,
      totalAcres: 205000,
      rank: 5
    },
    economics: {
      averageRentPerAcre: 260,
      averageLandValue: 10500
    }
  },
  {
    name: "Macon",
    fips: "17115",
    region: "Central",
    coordinates: [39.8481, -89.0037],
    soilData: {
      primarySoilType: "Denny silt loam",
      drainageClass: "Moderately well-drained",
      organicMatter: 4.1,
      pH: 6.8,
      cornSuitabilityRating: 89
    },
    climate: {
      averageGDD: 3150,
      averageRainfall: 38.7,
      frostFreeDays: 178,
      zone: "6a"
    },
    production: {
      averageYield: 183,
      totalAcres: 175000,
      rank: 6
    },
    economics: {
      averageRentPerAcre: 280,
      averageLandValue: 11000
    }
  },
  {
    name: "Sangamon",
    fips: "17167",
    region: "Central",
    coordinates: [39.6401, -89.6501],
    soilData: {
      primarySoilType: "Ipava silt loam",
      drainageClass: "Somewhat poorly drained",
      organicMatter: 3.7,
      pH: 6.4,
      cornSuitabilityRating: 85
    },
    climate: {
      averageGDD: 3200,
      averageRainfall: 37.9,
      frostFreeDays: 180,
      zone: "6a"
    },
    production: {
      averageYield: 176,
      totalAcres: 165000,
      rank: 9
    },
    economics: {
      averageRentPerAcre: 265,
      averageLandValue: 10200
    }
  },
  {
    name: "Piatt",
    fips: "17147",
    region: "Central",
    coordinates: [39.9781, -88.5431],
    soilData: {
      primarySoilType: "Catlin silt loam",
      drainageClass: "Well-drained",
      organicMatter: 4.0,
      pH: 6.7,
      cornSuitabilityRating: 93
    },
    climate: {
      averageGDD: 3080,
      averageRainfall: 38.9,
      frostFreeDays: 172,
      zone: "5b"
    },
    production: {
      averageYield: 190,
      totalAcres: 135000,
      rank: 4
    },
    economics: {
      averageRentPerAcre: 290,
      averageLandValue: 12000
    }
  },
  {
    name: "DeWitt",
    fips: "17039",
    region: "Central",
    coordinates: [40.1542, -88.7831],
    soilData: {
      primarySoilType: "Drummer silty clay loam",
      drainageClass: "Somewhat poorly drained",
      organicMatter: 4.3,
      pH: 6.9,
      cornSuitabilityRating: 91
    },
    climate: {
      averageGDD: 3020,
      averageRainfall: 37.8,
      frostFreeDays: 168,
      zone: "5b"
    },
    production: {
      averageYield: 186,
      totalAcres: 125000,
      rank: 7
    },
    economics: {
      averageRentPerAcre: 285,
      averageLandValue: 11500
    }
  },
  {
    name: "Logan",
    fips: "17107",
    region: "Central",
    coordinates: [40.1481, -89.4031],
    soilData: {
      primarySoilType: "Hartsburg silty clay loam",
      drainageClass: "Poorly drained",
      organicMatter: 4.4,
      pH: 7.0,
      cornSuitabilityRating: 86
    },
    climate: {
      averageGDD: 3100,
      averageRainfall: 37.2,
      frostFreeDays: 170,
      zone: "5b"
    },
    production: {
      averageYield: 179,
      totalAcres: 155000,
      rank: 10
    },
    economics: {
      averageRentPerAcre: 270,
      averageLandValue: 10800
    }
  }
];

export const getCountyByName = (name: string): CountyData | undefined => {
  return illinoisCounties.find(county => 
    county.name.toLowerCase() === name.toLowerCase()
  );
};

export const getTopCountiesByYield = (count: number = 10): CountyData[] => {
  return [...illinoisCounties]
    .sort((a, b) => b.production.averageYield - a.production.averageYield)
    .slice(0, count);
};

export const getCountiesByRegion = (region: CountyData['region']): CountyData[] => {
  return illinoisCounties.filter(county => county.region === region);
};