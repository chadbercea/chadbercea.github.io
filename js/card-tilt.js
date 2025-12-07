/**
 * Card Tilt Effect
 * Heavy 3D tilt and parallax on project card hover
 */

class CardTilt {
  constructor(card) {
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    this.card = card;
    
    // Configuration - HEAVY tilt
    this.maxRotation = 25;
    this.perspective = 600;
    this.scale = 1.05;
    
    // Parallax layers with depth (dialed back ~30%)
    this.layers = {
      header: { el: card.querySelector('.card__header'), depth: 40 },
      title: { el: card.querySelector('.card__title'), depth: 55 },
      desc: { el: card.querySelector('.card__desc'), depth: 25 },
      meta: { el: card.querySelector('.card__meta'), depth: 20 },
      links: { el: card.querySelector('.card__links'), depth: 70 }
    };
    
    // State
    this.isHovering = false;
    this.currentRotation = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.animationFrame = null;
    
    this.init();
  }
  
  init() {
    // Clear animation so transform works
    this.card.style.animation = 'none';
    this.card.style.opacity = '1';
    
    // Set up 3D transform
    this.card.style.perspective = `${this.perspective}px`;
    this.card.style.transformStyle = 'preserve-3d';
    
    this.card.addEventListener('mouseenter', () => this.onMouseEnter());
    this.card.addEventListener('mouseleave', () => this.onMouseLeave());
    this.card.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }
  
  onMouseEnter() {
    this.isHovering = true;
    this.card.style.zIndex = '10';
    this.animate();
  }
  
  onMouseLeave() {
    this.isHovering = false;
    this.targetRotation = { x: 0, y: 0 };
    this.card.style.zIndex = '';
  }
  
  onMouseMove(e) {
    if (!this.isHovering) return;
    
    const rect = this.card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate offset from center (-1 to 1)
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);
    
    // Card faces toward the mouse
    this.targetRotation = {
      x: offsetY * this.maxRotation,
      y: -offsetX * this.maxRotation
    };
  }
  
  animate() {
    // Smooth interpolation
    const ease = 0.15;
    
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * ease;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * ease;
    
    // Calculate scale based on hover
    const currentScale = this.isHovering ? this.scale : 1;
    
    // Apply transform
    this.card.style.transform = `
      rotateX(${this.currentRotation.x}deg) 
      rotateY(${this.currentRotation.y}deg)
      scale(${currentScale})
    `;
    
    // Add shine effect based on rotation
    this.applyShine();
    
    // Apply parallax to inner elements
    this.applyParallax();
    
    // Continue animation if hovering or still moving
    const isMoving = 
      Math.abs(this.targetRotation.x - this.currentRotation.x) > 0.01 ||
      Math.abs(this.targetRotation.y - this.currentRotation.y) > 0.01;
    
    if (this.isHovering || isMoving) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    } else {
      // Reset transforms
      this.card.style.transform = '';
      this.resetParallax();
    }
  }
  
  applyShine() {
    // Create a subtle light reflection based on tilt
    const shineX = 50 + this.currentRotation.y * 3;
    const shineY = 50 + this.currentRotation.x * 3;
    const opacity = this.isHovering ? 0.15 : 0;
    
    this.card.style.setProperty('--shine-x', `${shineX}%`);
    this.card.style.setProperty('--shine-y', `${shineY}%`);
    this.card.style.setProperty('--shine-opacity', opacity);
  }
  
  applyParallax() {
    const rotationFactorX = this.currentRotation.x / this.maxRotation;
    const rotationFactorY = this.currentRotation.y / this.maxRotation;
    
    Object.values(this.layers).forEach(layer => {
      if (!layer.el) return;
      
      const moveX = rotationFactorY * layer.depth * -1;
      const moveY = rotationFactorX * layer.depth;
      
      layer.el.style.transform = `translate3d(${moveX}px, ${moveY}px, ${layer.depth}px)`;
    });
  }
  
  resetParallax() {
    Object.values(this.layers).forEach(layer => {
      if (!layer.el) return;
      layer.el.style.transform = '';
    });
  }
}

// Initialize on DOM ready and watch for dynamically added cards
document.addEventListener('DOMContentLoaded', () => {
  // Initialize existing cards
  const initCards = () => {
    document.querySelectorAll('.card:not([data-tilt-init])').forEach(card => {
      card.setAttribute('data-tilt-init', 'true');
      new CardTilt(card);
    });
  };
  
  // Initial run
  initCards();
  
  // Watch for new cards added dynamically
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        initCards();
      }
    });
  });
  
  const grid = document.querySelector('.grid');
  if (grid) {
    observer.observe(grid, { childList: true, subtree: true });
  }
  
  // Also run after a short delay to catch async renders
  setTimeout(initCards, 500);
});

