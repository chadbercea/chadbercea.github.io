// Main entry point

import ProjectManager from './projects.js';
import Effects from './effects.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize effects
  const effects = new Effects();

  // Initialize project manager
  const projectManager = new ProjectManager();
  await projectManager.init();

  // Copy email functionality
  const copyBtn = document.querySelector('[data-copy]');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.dataset.copy;
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.classList.add('copied');
        const textEl = copyBtn.querySelector('.connect__btn-text');
        const originalText = textEl.textContent;
        textEl.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          textEl.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  }

  console.log('> System initialized');
  console.log('> Use arrow keys to navigate, Enter to open');
});

