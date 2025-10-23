import './style.css';
import { CornViewApplication } from './app/corn-view-app';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌽 CornView Illinois Professional Simulation Starting...');
  
  try {
    new CornViewApplication();
    console.log('✅ CornView Illinois Simulation Initialized Successfully');
  } catch (error) {
    console.error('❌ Failed to initialize CornView Simulation:', error);
    
    // Show error to user
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div style="text-align: center; padding: 50px; color: red;">
          <h1>Error Loading CornView Simulation</h1>
          <p>Please refresh the page and try again.</p>
          <p style="font-size: 12px; color: #666;">${error}</p>
        </div>
      `;
    }
  }
});

// Add service worker for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}