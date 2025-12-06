/**
 * Terminal Effects
 * Scrolling logs, command hints, ASCII dividers
 */

class TerminalEffects {
  constructor() {
    this.logContainer = null;
    this.hintsContainer = null;
    this.asciiContainer = null;
    
    this.logs = [
      '> initializing design_system.css',
      '> loading projects.json',
      '[OK] fonts loaded: Instrument Serif, JetBrains Mono',
      '> compiling editorial_hacker.theme',
      '[OK] accent: #00FF41',
      '> mounting components...',
      '[OK] header rendered',
      '[OK] project cards: 3 loaded',
      '> listening on localhost:8080',
      '$ git status',
      'On branch main',
      'nothing to commit, working tree clean',
      '> checking for updates...',
      '[OK] system ready',
      '$ whoami',
      'chadbercea',
      '> idle...',
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
  
  init() {
    this.createLogScroller();
    this.createCommandHints();
    this.createAsciiDivider();
  }
  
  // 1. Scrolling log output in hero background
  createLogScroller() {
    const hero = document.querySelector('.header__hero');
    if (!hero) return;
    
    this.logContainer = document.createElement('div');
    this.logContainer.className = 'terminal-logs';
    hero.appendChild(this.logContainer);
    
    this.scheduleNextLog();
  }
  
  scheduleNextLog() {
    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    
    setTimeout(() => {
      this.addLogLine();
      this.scheduleNextLog();
    }, delay);
  }
  
  addLogLine() {
    if (!this.logContainer) return;
    
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

