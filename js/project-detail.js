// Project detail page logic

class ProjectDetail {
  constructor() {
    this.projects = [];
    this.currentProject = null;
    this.currentIndex = -1;
    this.contentEl = document.getElementById('detail-content');
    this.template = document.getElementById('detail-template');
    this.errorTemplate = document.getElementById('error-template');
  }

  async init() {
    this.setupTimestamp();
    
    const projectId = this.getProjectId();
    if (!projectId) {
      this.showError('No project specified');
      return;
    }

    await this.loadProjects();
    
    this.currentIndex = this.projects.findIndex(p => p.id === projectId);
    if (this.currentIndex === -1) {
      this.showError(`Project "${projectId}" not found`);
      return;
    }

    this.currentProject = this.projects[this.currentIndex];
    this.render();
    this.setupKeyboard();
  }

  getProjectId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  async loadProjects() {
    try {
      const response = await fetch('/data/projects.json');
      const data = await response.json();
      this.projects = data.projects;
    } catch (error) {
      console.error('Failed to load projects:', error);
      this.showError('Failed to load project data');
    }
  }

  render() {
    const project = this.currentProject;
    const clone = this.template.content.cloneNode(true);

    // Update page title and meta tags
    document.title = `${project.name} — chadbercea`;
    document.querySelector('meta[name="description"]').content = project.description;
    
    // Update OpenGraph tags
    this.updateMetaTag('og:title', `${project.name} — chadbercea`);
    this.updateMetaTag('og:description', project.description);
    this.updateMetaTag('og:url', `https://chadbercea.github.io/project.html?id=${project.id}`);
    if (project.hero) {
      this.updateMetaTag('og:image', `https://chadbercea.github.io/${project.hero}`);
    }
    
    // Update Twitter tags
    this.updateMetaTag('twitter:title', `${project.name} — chadbercea`, 'name');
    this.updateMetaTag('twitter:description', project.description, 'name');

    // Status
    const statusEl = clone.querySelector('[data-status]');
    statusEl.textContent = `[${project.status.toUpperCase()}]`;
    statusEl.classList.add(`detail__status--${project.status}`);

    // Date
    clone.querySelector('[data-date]').textContent = project.date;

    // Title & tagline
    clone.querySelector('[data-title]').textContent = project.name;
    const taglineEl = clone.querySelector('[data-tagline]');
    if (project.tagline) {
      taglineEl.textContent = project.tagline;
    } else {
      taglineEl.textContent = project.description;
    }

    // Hero image
    const heroWrap = clone.querySelector('[data-hero-wrap]');
    const heroImg = clone.querySelector('[data-hero]');
    if (project.hero) {
      heroImg.src = project.hero;
      heroImg.alt = `${project.name} screenshot`;
    } else {
      heroWrap.style.display = 'none';
    }

    // Overview (markdown)
    const overviewEl = clone.querySelector('[data-overview]');
    const overviewText = project.overview || project.description;
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
      overviewEl.innerHTML = DOMPurify.sanitize(marked.parse(overviewText));
    } else {
      overviewEl.textContent = overviewText;
    }

    // Tags
    const tagsEl = clone.querySelector('[data-tags]');
    tagsEl.innerHTML = project.tags
      .map(tag => `<span class="detail__tag">${tag}</span>`)
      .join('');

    // Links
    const linksEl = clone.querySelector('[data-links]');
    const links = [];
    
    if (project.url) {
      links.push(`
        <a href="${project.url}" class="detail__link" target="_blank" rel="noopener">
          → Live Demo
        </a>
      `);
    }
    
    if (project.repo) {
      links.push(`
        <button class="detail__link detail__link--copy" data-copy="${project.repo}">
          → Repository
          <span class="detail__link-icon">📋</span>
          <span class="detail__link-tooltip">Copied!</span>
        </button>
      `);
    }
    
    if (project.blog) {
      links.push(`
        <a href="${project.blog}" class="detail__link" target="_blank" rel="noopener">
          → Blog Post
        </a>
      `);
    }
    
    linksEl.innerHTML = links.join('');

    // Meta footer
    clone.querySelector('[data-meta-built]').textContent = `Built: ${project.date}`;
    clone.querySelector('[data-meta-status]').textContent = `Status: ${project.status.toUpperCase()}`;
    
    const updatedEl = clone.querySelector('[data-meta-updated]');
    const updatedSep = clone.querySelector('[data-meta-updated-sep]');
    if (project.updated) {
      updatedEl.textContent = `Updated: ${project.updated}`;
    } else {
      updatedEl.style.display = 'none';
      updatedSep.style.display = 'none';
    }

    // Next project navigation
    const nextIndex = (this.currentIndex + 1) % this.projects.length;
    const nextProject = this.projects[nextIndex];
    const nextLink = clone.querySelector('[data-next]');
    const nextName = clone.querySelector('[data-next-name]');
    nextLink.href = `/project.html?id=${nextProject.id}`;
    nextName.textContent = nextProject.name;

    // Clear and append
    this.contentEl.innerHTML = '';
    this.contentEl.appendChild(clone);

    // Setup copy buttons
    this.setupCopyButtons();
    
    // Animate in
    this.contentEl.querySelector('.detail__article').classList.add('animate-in');
  }

  showError(message) {
    const clone = this.errorTemplate.content.cloneNode(true);
    clone.querySelector('[data-error-message]').textContent = message;
    
    this.contentEl.innerHTML = '';
    this.contentEl.appendChild(clone);

    document.title = 'Error — chadbercea';
  }

  setupCopyButtons() {
    const copyBtns = this.contentEl.querySelectorAll('[data-copy]');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = btn.dataset.copy;
        
        try {
          await navigator.clipboard.writeText(url);
          btn.classList.add('copied');
          setTimeout(() => btn.classList.remove('copied'), 2000);
        } catch (err) {
          // Fallback: open in new tab
          window.open(url, '_blank');
        }
      });
    });
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

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.location.href = '/';
      }
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const nextLink = document.querySelector('[data-next]');
        if (nextLink) {
          window.location.href = nextLink.href;
        }
      }
    });
  }

  updateMetaTag(property, content, attr = 'property') {
    const selector = `meta[${attr}="${property}"]`;
    const tag = document.querySelector(selector);
    if (tag) {
      tag.setAttribute('content', content);
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const detail = new ProjectDetail();
  detail.init();
});

