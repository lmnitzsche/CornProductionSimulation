# CornView: Modern Corn Growth Monitoring and Yield Projection Simulation

A modern web application built with **TypeScript** and **JavaScript** for simulating corn growth based on Growing Degree Units (GDU) and environmental factors.

## Modern Tech Stack

- **TypeScript** - Type-safe development with modern ES2020+ features
- **JavaScript** - Compiled output for browser compatibility
- **Vite** - Modern build tool with hot module replacement
- **CSS3** - Modern styling with CSS Grid, Flexbox, and CSS Custom Properties
- **ES Modules** - Modern module system for better code organization
- **ESLint & Prettier** - Code quality and formatting tools
- **GitHub Actions** - Automated deployment to GitHub Pages

## Features

- **Interactive Simulation**: Real-time corn growth visualization based on scientific GDU calculations
- **Environmental Factors**: Configurable soil texture, seed zones, seeding depth, and planting dates
- **Temperature Data Import**: Load custom temperature data from CSV/TXT files
- **Growth Stage Tracking**: Visual indicators for all corn growth stages (VE, V2-V10, VT, R2-R6)
- **Yield Projection**: Dynamic yield calculations based on environmental conditions
- **Export Functionality**: Save simulation data for analysis
- **Responsive Design**: Mobile-friendly interface with modern CSS
- **Real-time Controls**: Play, pause, speed control for simulation

## Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Project Structure
```
src/
├── main.ts           # Application entry point
├── types.ts          # TypeScript type definitions
├── corn-simulation.ts # Main simulation controller
├── gdu-calculator.ts  # GDU calculation logic
├── corn-field.ts     # Visual field component
├── file-manager.ts   # File I/O operations
└── style.css         # Modern CSS styling

public/
└── images/           # Static assets

.github/
└── workflows/
    └── deploy.yml    # GitHub Pages deployment
```

## Scientific Background

The simulation uses Growing Degree Units (GDU) to model corn development:
- **Base Temperature**: 50°F (10°C)
- **Daily GDU**: (Max Temp + Min Temp) / 2 - Base Temp
- **Growth Stages**: VE (115 GDU) → V2 (200 GDU) → ... → R6 (2700 GDU)

Environmental factors affecting growth:
- Soil texture (fine vs coarse)
- Seed zone conditions
- Seeding depth
- Planting date timing

## Deployment

The application automatically deploys to GitHub Pages via GitHub Actions when pushed to the main branch.

**Live Demo**: [https://logannitzsche.com/CornProductionSimulation/](https://logannitzsche.com/CornProductionSimulation/)

## License

MIT License - see [LICENSE](text/LICENSE) file for details.

## Author

Created by [Logan Nitzsche](https://logannitzsche.com)
