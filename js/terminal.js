/**
 * Terminal Effects
 * Scrolling logs, command hints, ASCII dividers
 */

class TerminalEffects {
  constructor() {
    this.logContainer = null;
    this.hintsContainer = null;
    this.asciiContainer = null;
    this.logTimeout = null;
    
    this.logs = [
      '> checking if anyone is reading this...',
      '[OK] coffee levels: critically low',
      '> deploying vibes...',
      '[WARN] meetings detected, initiating avoidance.exe',
      '$ whoami',
      'just a guy who likes to build stuff',
      '> compiling excuses for technical debt...',
      '[OK] bugs renamed to "features"',
      '> googling error message...',
      '[OK] found stackoverflow answer from 2014',
      '> pushing to production on friday...',
      '[WARN] this is fine. everything is fine.',
      '$ git blame',
      'it was me. it\'s always me.',
      '> running npm install...',
      '[OK] added 847 packages, 12 vulnerabilities',
      '> pretending to understand kubernetes...',
      '[OK] successfully nodded in meeting',
      '> checking if code works...',
      '[OK] works on my machine™',
      '$ sudo make me a sandwich',
      'okay.',
    ];
    
    this.hints = [
      { key: 'j/k', action: 'navigate' },
      { key: '/', action: 'search' },
      { key: 'g h', action: 'go home' },
      { key: 'esc', action: 'close' },
    ];
    
    this.asciiPatterns = [
      '═══════════════════',
      '───────────────────',
      '┌──────────────────┐',
      '└──────────────────┘',
      '╔══════════════════╗',
      '╚══════════════════╝',
      '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
      '░░░░░░░░░░░░░░░░░░░',
      '├──────────────────┤',
    ];
    
    this.init();
  }
  
  // Check if reduce motion is enabled
  isReducedMotion() {
    return document.documentElement.hasAttribute('data-reduce-motion');
  }
  
  init() {
    this.createLogScroller();
    this.createCommandHints();
    this.createAsciiDivider();
  }
  
  // 1. Scrolling log output beneath "Personal hub for projects..." copy
  createLogScroller() {
    // Insert directly after the header description paragraph, inside header__content
    const headerDesc = document.querySelector('.header .header__content > .header__desc');
    if (!headerDesc) return;
    
    this.logContainer = document.createElement('div');
    this.logContainer.className = 'terminal-logs';
    // Insert right after the description text
    headerDesc.insertAdjacentElement('afterend', this.logContainer);
    
    this.scheduleNextLog();
  }
  
  scheduleNextLog() {
    // Check on every schedule - if reduced motion, don't add more logs
    if (this.isReducedMotion()) {
      // Clear existing logs when toggled
      if (this.logContainer) {
        this.logContainer.innerHTML = '';
      }
      // Still schedule next check in case toggle is turned off
      this.logTimeout = setTimeout(() => this.scheduleNextLog(), 2000);
      return;
    }
    
    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    
    this.logTimeout = setTimeout(() => {
      this.addLogLine();
      this.scheduleNextLog();
    }, delay);
  }
  
  addLogLine() {
    if (!this.logContainer) return;
    // Double-check reduced motion
    if (this.isReducedMotion()) return;
    
    const log = this.logs[Math.floor(Math.random() * this.logs.length)];
    const line = document.createElement('div');
    line.className = 'terminal-log-line';
    line.textContent = log;
    
    this.logContainer.appendChild(line);
    
    // Fade out and remove after animation
    setTimeout(() => {
      line.classList.add('fade-out');
      setTimeout(() => line.remove(), 1000);
    }, 4000);
    
    // Keep max 5 lines
    while (this.logContainer.children.length > 5) {
      this.logContainer.firstChild.remove();
    }
  }
  
  // 5. Command hints
  createCommandHints() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    this.hintsContainer = document.createElement('div');
    this.hintsContainer.className = 'command-hints';
    
    this.hints.forEach(hint => {
      const el = document.createElement('span');
      el.className = 'command-hint';
      el.innerHTML = `<kbd>${hint.key}</kbd> ${hint.action}`;
      this.hintsContainer.appendChild(el);
    });
    
    nav.parentElement.appendChild(this.hintsContainer);
  }
  
  // 6. ASCII divider
  createAsciiDivider() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    this.asciiContainer = document.createElement('div');
    this.asciiContainer.className = 'ascii-divider';
    this.asciiContainer.setAttribute('aria-hidden', 'true');
    
    this.updateAsciiPattern();
    header.appendChild(this.asciiContainer);
    
    // Occasionally change pattern
    setInterval(() => this.updateAsciiPattern(), 5000);
  }
  
  updateAsciiPattern() {
    if (!this.asciiContainer) return;
    
    const pattern = this.asciiPatterns[Math.floor(Math.random() * this.asciiPatterns.length)];
    // Repeat pattern to fill width
    this.asciiContainer.textContent = pattern.repeat(10);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new TerminalEffects();
});
