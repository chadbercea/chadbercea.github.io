/**
 * Settings Panel
 * Handles settings panel toggle, theme switching, and reduce-motion preference
 */

class SettingsPanel {
  constructor() {
    this.settingsBtn = document.querySelector('.site-nav__settings-btn');
    this.panel = document.querySelector('.site-nav__panel');
    this.reduceMotionToggle = document.getElementById('reduce-motion-toggle');
    this.themeToggle = document.getElementById('theme-toggle');

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
      this.loadReduceMotionPreference();
    }

    // Handle theme toggle
    if (this.themeToggle) {
      this.themeToggle.addEventListener('change', () => this.handleThemeToggle());
      this.loadThemePreference();
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
      localStorage.setItem('reduce-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduce-motion');
      localStorage.removeItem('reduce-motion');
    }
  }

  loadReduceMotionPreference() {
    const saved = localStorage.getItem('reduce-motion');
    if (saved === 'true') {
      this.reduceMotionToggle.checked = true;
      document.documentElement.setAttribute('data-reduce-motion', 'true');
    }
  }

  handleThemeToggle() {
    const isLightMode = this.themeToggle.checked;

    if (isLightMode) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    }
  }

  loadThemePreference() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      this.themeToggle.checked = true;
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new SettingsPanel();
});

