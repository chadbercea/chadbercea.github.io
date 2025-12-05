// Visual effects and interactions

class Effects {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNav();
    this.setupTimestamp();
  }

  setupKeyboardNav() {
    let currentIndex = -1;
    const getCards = () => document.querySelectorAll('.card');

    document.addEventListener('keydown', (e) => {
      const cards = getCards();
      if (!cards.length) return;

      // Only handle if not in an input
      if (e.target.tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          currentIndex = Math.min(currentIndex + 1, cards.length - 1);
          this.focusCard(cards, currentIndex);
          break;
        
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          currentIndex = Math.max(currentIndex - 1, 0);
          this.focusCard(cards, currentIndex);
          break;
        
        case 'Enter':
          if (currentIndex >= 0 && cards[currentIndex]) {
            const url = cards[currentIndex].dataset.url;
            if (url && url !== 'null') {
              window.open(url, '_blank');
            }
          }
          break;
        
        case 'Escape':
          currentIndex = -1;
          cards.forEach(c => c.classList.remove('focused'));
          break;
      }
    });
  }

  focusCard(cards, index) {
    cards.forEach(c => c.classList.remove('focused'));
    if (cards[index]) {
      cards[index].classList.add('focused');
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  setupTimestamp() {
    const timestampEl = document.getElementById('timestamp');
    if (!timestampEl) return;

    const updateTime = () => {
      const now = new Date();
      const formatted = now.toISOString().slice(0, 19).replace('T', ' ');
      timestampEl.textContent = formatted + ' UTC';
    };

    updateTime();
    setInterval(updateTime, 1000);
  }
}

export default Effects;

