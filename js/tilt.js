/**
 * Tilt Effect for Browser Window
 * Adds mouse-tracking 3D tilt and parallax depth (matching card behavior)
 */

class TiltEffect {
  constructor(element) {
    this.element = element;
    this.browserWindow = element.querySelector('.browser-window');
    
    // All parallax layers with their depth multipliers
    this.layers = {
      chrome: element.querySelector('.browser-window__chrome'),
      nav: element.querySelector('.preview__nav'),
      badge: element.querySelector('.preview__badge'),
      headline: element.querySelector('.preview__headline'),
      desc: element.querySelector('.preview__desc'),
      metrics: element.querySelector('.preview__metrics'),
      left: element.querySelector('.preview__left'),
      right: element.querySelector('.preview__right'),
      carousel: element.querySelector('.preview__carousel'),
      cards: element.querySelectorAll('.preview__card')
    };
    
    // Configuration - matching the card tilt intensity
    this.maxRotation = 12; // degrees
    this.scale = 1.02;
    
    // Parallax depths (higher = more movement, like card behavior)
    this.parallaxDepth = {
      chrome: 15,
      nav: 25,
      badge: 35,
      headline: 50,
      desc: 30,
      metrics: 40,
      left: 35,
      right: 60,
      carousel: 20,
      cards: 45
    };
    
    // State
    this.rect = null;
    this.isHovering = false;
    this.currentX = 0;
    this.currentY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.animationFrame = null;
    
    this.init();
  }
  
  init() {
    this.element.addEventListener('mouseenter', () => this.onMouseEnter());
    this.element.addEventListener('mouseleave', () => this.onMouseLeave());
    this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }
  
  onMouseEnter() {
    this.isHovering = true;
    this.rect = this.element.getBoundingClientRect();
    this.animate();
  }
  
  onMouseLeave() {
    this.isHovering = false;
    this.targetX = 0;
    this.targetY = 0;
  }
  
  onMouseMove(e) {
    if (!this.isHovering || !this.rect) return;
    
    // Calculate position relative to center (-1 to 1)
    const x = e.clientX - (this.rect.left + this.rect.width / 2);
    const y = e.clientY - (this.rect.top + this.rect.height / 2);
    
    this.targetX = x / (this.rect.width / 2);
    this.targetY = y / (this.rect.height / 2);
  }
  
  animate() {
    // Smooth interpolation (matching card easing)
    const ease = 0.08;
    
    this.currentX += (this.targetX - this.currentX) * ease;
    this.currentY += (this.targetY - this.currentY) * ease;
    
    // Calculate rotation (tilt toward mouse, like cards)
    const rotateX = -this.currentY * this.maxRotation;
    const rotateY = this.currentX * this.maxRotation;
    
    // Apply rotation and scale to browser window
    const currentScale = this.isHovering ? this.scale : 1;
    this.browserWindow.style.transform = `
      scale(${currentScale})
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `;
    
    // Apply parallax to all layers (elements follow mouse)
    this.applyParallax();
    
    // Continue animation if hovering or still moving
    const isMoving = 
      Math.abs(this.targetX - this.currentX) > 0.001 ||
      Math.abs(this.targetY - this.currentY) > 0.001;
    
    if (this.isHovering || isMoving) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    } else {
      this.browserWindow.style.transform = '';
      this.resetParallax();
    }
  }
  
  applyParallax() {
    Object.entries(this.layers).forEach(([name, layer]) => {
      if (!layer) return;
      
      const depth = this.parallaxDepth[name] || 20;
      
      // Handle NodeList (multiple elements like cards)
      if (layer instanceof NodeList) {
        layer.forEach((el, i) => {
          // Stagger depth for multiple elements
          const staggerDepth = depth + (i * 10);
          const offsetX = this.currentX * staggerDepth;
          const offsetY = this.currentY * staggerDepth;
          el.style.transform = `translate3d(${offsetX}px, ${offsetY}px, ${staggerDepth}px)`;
        });
      } else {
        const offsetX = this.currentX * depth;
        const offsetY = this.currentY * depth;
        layer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, ${depth}px)`;
      }
    });
  }
  
  resetParallax() {
    Object.entries(this.layers).forEach(([name, layer]) => {
      if (!layer) return;
      
      if (layer instanceof NodeList) {
        layer.forEach(el => {
          el.style.transform = '';
        });
      } else {
        layer.style.transform = '';
      }
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const featuredElement = document.querySelector('.header__featured');
  if (featuredElement) {
    new TiltEffect(featuredElement);
  }
});

