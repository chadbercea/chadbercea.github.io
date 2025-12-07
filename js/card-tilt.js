/**
 * Card Tilt Effect
 * Heavy 3D tilt and parallax on project card hover
 * Includes magnet effect on CTA button - attracts toward mouse cursor
 */

class CardTilt {
  constructor(card) {
    this.card = card;
    
    // Configuration - HEAVY tilt
    this.maxRotation = 25;
    this.perspective = 600;
    this.scale = 1.05;
    
    // Magnet configuration
    this.magnetMaxDistance = 150; // pixels - beyond this, no magnet effect
    this.magnetStrength = 0.4; // how far button moves toward mouse (0-1)
    
    // Parallax layers with depth (dialed back ~30%)
    this.layers = {
      header: { el: card.querySelector('.card__header'), depth: 40 },
      title: { el: card.querySelector('.card__title'), depth: 55 },
      desc: { el: card.querySelector('.card__desc'), depth: 25 },
      meta: { el: card.querySelector('.card__meta'), depth: 20 },
      links: { el: card.querySelector('.card__links'), depth: 70 }
    };
    
    // Button element for magnet effect
    this.button = card.querySelector('.card__link');
    
    // State
    this.isHovering = false;
    this.currentRotation = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.animationFrame = null;
    
    // Magnet state
    this.targetMagnet = { x: 0, y: 0 };
    this.currentMagnet = { x: 0, y: 0 };
    this.mousePos = { x: 0, y: 0 };
    
    this.init();
  }
  
  // Check if reduce motion is enabled
  isReducedMotion() {
    return document.documentElement.hasAttribute('data-reduce-motion');
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
    // Check on every interaction
    if (this.isReducedMotion()) return;
    
    this.isHovering = true;
    this.card.style.zIndex = '10';
    this.animate();
  }
  
  onMouseLeave() {
    this.isHovering = false;
    this.targetRotation = { x: 0, y: 0 };
    this.targetMagnet = { x: 0, y: 0 };
    this.card.style.zIndex = '';
    
    // If reduced motion enabled, ensure styles are cleared
    if (this.isReducedMotion()) {
      this.card.style.transform = '';
      this.resetParallax();
    }
  }
  
  onMouseMove(e) {
    // Check on every interaction
    if (this.isReducedMotion()) return;
    if (!this.isHovering) return;
    
    // Store mouse position for magnet calculation
    this.mousePos = { x: e.clientX, y: e.clientY };
    
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
    
    // Calculate magnet offset for button
    this.calculateMagnet();
  }
  
  calculateMagnet() {
    if (!this.button) return;
    
    // Get button's current center position
    const buttonRect = this.button.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Vector from button center to mouse
    const dx = this.mousePos.x - buttonCenterX;
    const dy = this.mousePos.y - buttonCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Magnet strength increases as distance decreases (inverse relationship)
    // At distance 0, strength is 1. At magnetMaxDistance or beyond, strength is 0.
    const normalizedDistance = Math.min(distance / this.magnetMaxDistance, 1);
    const magnetPull = Math.pow(1 - normalizedDistance, 2); // Quadratic falloff for snappier feel
    
    // Target offset - button moves toward mouse
    this.targetMagnet = {
      x: dx * magnetPull * this.magnetStrength,
      y: dy * magnetPull * this.magnetStrength
    };
  }
  
  animate() {
    // Check on every frame
    if (this.isReducedMotion()) {
      this.card.style.transform = '';
      this.resetParallax();
      return;
    }
    
    // Smooth interpolation for rotation
    const rotationEase = 0.15;
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * rotationEase;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * rotationEase;
    
    // Smooth interpolation for magnet (faster for responsive feel)
    const magnetEase = 0.2;
    this.currentMagnet.x += (this.targetMagnet.x - this.currentMagnet.x) * magnetEase;
    this.currentMagnet.y += (this.targetMagnet.y - this.currentMagnet.y) * magnetEase;
    
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
      Math.abs(this.targetRotation.y - this.currentRotation.y) > 0.01 ||
      Math.abs(this.targetMagnet.x - this.currentMagnet.x) > 0.01 ||
      Math.abs(this.targetMagnet.y - this.currentMagnet.y) > 0.01;
    
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
    
    Object.entries(this.layers).forEach(([name, layer]) => {
      if (!layer.el) return;
      
      // Standard parallax movement
      const moveX = rotationFactorY * layer.depth * -1;
      const moveY = rotationFactorX * layer.depth;
      
      // For the links layer, add magnet offset
      if (name === 'links' && this.button) {
        const totalX = moveX + this.currentMagnet.x;
        const totalY = moveY + this.currentMagnet.y;
        layer.el.style.transform = `translate3d(${totalX}px, ${totalY}px, ${layer.depth}px)`;
      } else {
        layer.el.style.transform = `translate3d(${moveX}px, ${moveY}px, ${layer.depth}px)`;
      }
    });
  }
  
  resetParallax() {
    Object.values(this.layers).forEach(layer => {
      if (!layer.el) return;
      layer.el.style.transform = '';
    });
    
    // Reset magnet state
    this.currentMagnet = { x: 0, y: 0 };
    this.targetMagnet = { x: 0, y: 0 };
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
