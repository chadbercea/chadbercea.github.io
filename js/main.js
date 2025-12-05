// Main entry point

import ProjectManager from './projects.js';
import Effects from './effects.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize effects
  const effects = new Effects();
  
  // Initialize project manager
  const projectManager = new ProjectManager();
  await projectManager.init();
  
  console.log('> System initialized');
  console.log('> Use arrow keys to navigate, Enter to open');
});

