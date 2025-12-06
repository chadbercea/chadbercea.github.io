/**
 * Tilt Effect for Browser Window
 * Adds mouse-tracking 3D tilt and parallax depth
 */

class TiltEffect {
  constructor(element) {
    this.element = element;
    this.browserWindow = element.querySelector('.browser-window');
    this.layers = {
      nav: element.querySelector('.preview__nav'),
      left: element.querySelector('.preview__left'),
      right: element.querySelector('.preview__right'),
      carousel: element.querySelector('.preview__carousel')
    };
    
    // Configuration
    this.maxRotation = 15; // degrees
    this.parallaxMultiplier = {
      nav: 45,
      left: 30,
      right: 70,
      carousel: 15
    };
    
    // State
    this.isHovering = false;
    this.currentRotation = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
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
    this.animate();
  }
  
  onMouseLeave() {
    this.isHovering = false;
    this.targetRotation = { x: 0, y: 0 };
    // Continue animation to smoothly reset
  }
  
  onMouseMove(e) {
    if (!this.isHovering) return;
    
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate offset from center (-1 to 1)
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);
    
    // Invert Y for natural feel (mouse up = tilt back)
    this.targetRotation = {
      x: -offsetY * this.maxRotation,
      y: offsetX * this.maxRotation
    };
  }
  
  animate() {
    // Smooth interpolation
    const ease = 0.1;
    
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * ease;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * ease;
    
    // Apply rotation to browser window
    this.browserWindow.style.transform = `
      rotateX(${this.currentRotation.x}deg) 
      rotateY(${this.currentRotation.y}deg)
    `;
    
    // Apply parallax to layers
    this.applyParallax();
    
    // Continue animation if hovering or still moving
    const isMoving = 
      Math.abs(this.targetRotation.x - this.currentRotation.x) > 0.01 ||
      Math.abs(this.targetRotation.y - this.currentRotation.y) > 0.01;
    
    if (this.isHovering || isMoving) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    } else {
      // Reset transforms when animation completes
      this.browserWindow.style.transform = '';
      this.resetParallax();
    }
  }
  
  applyParallax() {
    const rotationFactor = this.currentRotation.y / this.maxRotation;
    
    Object.entries(this.layers).forEach(([name, layer]) => {
      if (!layer) return;
      
      const multiplier = this.parallaxMultiplier[name];
      const offsetX = rotationFactor * multiplier;
      const baseZ = this.getBaseZ(name);
      
      layer.style.transform = `translateZ(${baseZ}px) translateX(${offsetX}px)`;
    });
  }
  
  getBaseZ(name) {
    const depths = { nav: 50, left: 30, right: 80, carousel: 15 };
    return depths[name] || 0;
  }
  
  resetParallax() {
    Object.entries(this.layers).forEach(([name, layer]) => {
      if (!layer) return;
      const baseZ = this.getBaseZ(name);
      layer.style.transform = `translateZ(${baseZ}px)`;
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

