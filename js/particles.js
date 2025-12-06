/**
 * Floating Particles Effect
 * Subtle dust motes drifting in the hero area
 */

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 25;
    this.accentColor = { r: 0, g: 255, b: 65 }; // --accent green
    
    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    const hero = this.canvas.parentElement;
    this.canvas.width = hero.offsetWidth;
    this.canvas.height = hero.offsetHeight;
  }
  
  init() {
    this.particles = [];
    
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }
  
  createParticle(atEdge = false) {
    const size = Math.random() * 2 + 1; // 1-3px
    
    return {
      x: atEdge ? (Math.random() < 0.5 ? 0 : this.canvas.width) : Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: size,
      speedX: (Math.random() - 0.5) * 0.3, // Very slow
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.2 + 0.05, // 0.05-0.25
      targetOpacity: Math.random() * 0.2 + 0.05,
      pulseSpeed: Math.random() * 0.01 + 0.005,
      pulsePhase: Math.random() * Math.PI * 2
    };
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((p, index) => {
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Pulse opacity
      p.pulsePhase += p.pulseSpeed;
      const pulseFactor = Math.sin(p.pulsePhase) * 0.5 + 0.5;
      const currentOpacity = p.opacity * (0.5 + pulseFactor * 0.5);
      
      // Wrap around edges with fade
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;
      
      // Draw particle with glow
      this.ctx.save();
      
      // Outer glow
      const gradient = this.ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size * 4
      );
      gradient.addColorStop(0, `rgba(${this.accentColor.r}, ${this.accentColor.g}, ${this.accentColor.b}, ${currentOpacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Core
      this.ctx.fillStyle = `rgba(${this.accentColor.r}, ${this.accentColor.g}, ${this.accentColor.b}, ${currentOpacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    new ParticleSystem(canvas);
  }
});

