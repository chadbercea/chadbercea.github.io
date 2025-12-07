/**
 * Text Scramble Effect
 * Terminal-style decode animation on hover
 */

// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class TextScramble {
  constructor(element) {
    // Skip if user prefers reduced motion
    if (prefersReducedMotion) return;
    
    this.element = element;
    this.chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`01';
    this.originalHTML = element.innerHTML;
    this.isAnimating = false;
    this.frameRequest = null;
    
    this.init();
  }
  
  init() {
    this.element.addEventListener('mouseenter', () => this.scramble());
    this.element.style.cursor = 'default';
  }
  
  scramble() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    // Parse the original HTML to preserve structure (like <br> and <em>)
    const textNodes = this.getTextNodes(this.element);
    const originalTexts = textNodes.map(node => node.textContent);
    const totalChars = originalTexts.reduce((sum, text) => sum + text.length, 0);
    
    let frame = 0;
    const duration = 500; // ms
    const framesPerChar = 3;
    const totalFrames = totalChars * framesPerChar;
    
    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      
      textNodes.forEach((node, nodeIndex) => {
        const original = originalTexts[nodeIndex];
        let result = '';
        
        for (let i = 0; i < original.length; i++) {
          const char = original[i];
          
          // Calculate when this character should resolve
          const charProgress = (nodeIndex * 10 + i) / totalChars;
          
          if (char === ' ' || char === '\n') {
            result += char;
          } else if (progress > charProgress + 0.3) {
            // Resolved
            result += char;
          } else if (progress > charProgress) {
            // Scrambling
            result += this.randomChar();
          } else {
            // Not started yet
            result += this.randomChar();
          }
        }
        
        node.textContent = result;
      });
      
      if (frame < totalFrames) {
        this.frameRequest = requestAnimationFrame(animate);
      } else {
        // Restore original
        textNodes.forEach((node, i) => {
          node.textContent = originalTexts[i];
        });
        this.isAnimating = false;
      }
    };
    
    this.frameRequest = requestAnimationFrame(animate);
  }
  
  getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim()) {
        textNodes.push(node);
      }
    }
    
    return textNodes;
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.header__title');
  if (title) {
    new TextScramble(title);
  }
});

