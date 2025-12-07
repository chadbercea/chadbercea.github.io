/**
 * Settings Panel
 * Handles settings panel toggle and reduce-motion preference
 */

class SettingsPanel {
  constructor() {
    this.settingsBtn = document.querySelector('.site-nav__settings-btn');
    this.panel = document.querySelector('.site-nav__panel');
    this.reduceMotionToggle = document.getElementById('reduce-motion-toggle');
    
    if (!this.settingsBtn || !this.panel) return;
    
    this.init();
  }
  
  init() {
    // Toggle panel on button click
    this.settingsBtn.addEventListener('click', () => this.togglePanel());
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.panel.contains(e.target) && !this.settingsBtn.contains(e.target)) {
        this.closePanel();
      }
    });
    
    // Close panel on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closePanel();
      }
    });
    
    // Handle reduce motion toggle
    if (this.reduceMotionToggle) {
      this.reduceMotionToggle.addEventListener('change', () => this.handleReduceMotion());
    }
  }
  
  togglePanel() {
    const isOpen = this.panel.getAttribute('aria-hidden') === 'false';
    
    if (isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }
  
  openPanel() {
    this.panel.setAttribute('aria-hidden', 'false');
    this.settingsBtn.setAttribute('aria-expanded', 'true');
  }
  
  closePanel() {
    this.panel.setAttribute('aria-hidden', 'true');
    this.settingsBtn.setAttribute('aria-expanded', 'false');
  }
  
  handleReduceMotion() {
    const isEnabled = this.reduceMotionToggle.checked;
    
    if (isEnabled) {
      document.documentElement.setAttribute('data-reduce-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduce-motion');
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new SettingsPanel();
});

