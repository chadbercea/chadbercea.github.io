// Project data management and rendering

class ProjectManager {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.grid = document.getElementById('projects-grid');
    this.countEl = document.getElementById('project-count');
  }

  async init() {
    await this.loadProjects();
    this.render();
    this.setupFilters();
  }

  async loadProjects() {
    try {
      const response = await fetch('/data/projects.json');
      const data = await response.json();
      this.projects = data.projects;
      this.filteredProjects = [...this.projects];
    } catch (error) {
      console.error('Failed to load projects:', error);
      this.grid.innerHTML = '<div class="empty">> Error loading projects. Check console.</div>';
    }
  }

  // Determine card type based on available data
  getCardType(project) {
    const hasDetailContent = project.overview || project.hero;
    
    if (hasDetailContent) return 'project';  // → Detail page
    if (project.repo && !project.url) return 'repo';  // → Repo directly
    return 'external';  // → External URL
  }

  // Get CTA config based on card type
  getCardCTA(project) {
    const type = this.getCardType(project);
    
    switch (type) {
      case 'project':
        return { 
          label: 'View →', 
          href: `/project.html?id=${project.id}`,
          external: false
        };
      case 'repo':
        return { 
          label: 'Repo →', 
          href: project.repo,
          external: true
        };
      case 'external':
      default:
        return { 
          label: 'Link →', 
          href: project.url || project.repo,
          external: true
        };
    }
  }

  render() {
    if (!this.filteredProjects.length) {
      this.grid.innerHTML = '<div class="empty">> No projects match filter.</div>';
      this.updateCount(0);
      return;
    }

    this.grid.innerHTML = this.filteredProjects.map(project => this.renderCard(project)).join('');
    this.updateCount(this.filteredProjects.length);
    this.attachCardListeners();
  }

  renderCard(project) {
    const statusClass = `card__status--${project.status}`;
    const statusText = project.status.toUpperCase();
    const tags = project.tags.map(tag => `<span class="card__tag">${tag}</span>`).join('');
    
    const cta = this.getCardCTA(project);
    const ctaTarget = cta.external ? 'target="_blank" rel="noopener"' : '';
    const ctaLink = `<a href="${cta.href}" class="card__link" ${ctaTarget}>${cta.label}</a>`;

    return `
      <article class="card" data-id="${project.id}" data-href="${cta.href}" data-external="${cta.external}">
        <div class="card__header">
          <h3 class="card__title">${project.name}</h3>
          <span class="card__status ${statusClass}">[${statusText}]</span>
        </div>
        <p class="card__desc">${project.description}</p>
        <div class="card__meta">
          <div class="card__tags">${tags}</div>
          <span class="card__date">${project.date}</span>
        </div>
        <div class="card__links">${ctaLink}</div>
      </article>
    `;
  }

  attachCardListeners() {
    const cards = this.grid.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't double-navigate if clicking the CTA link directly
        if (e.target.closest('.card__link')) return;
        
        const href = card.dataset.href;
        const isExternal = card.dataset.external === 'true';
        
        if (href) {
          if (isExternal) {
            window.open(href, '_blank');
          } else {
            window.location.href = href;
          }
        }
      });
    });
  }

  setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.currentFilter = btn.dataset.filter;
        this.applyFilter();
      });
    });
  }

  applyFilter() {
    if (this.currentFilter === 'all') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(p => p.status === this.currentFilter);
    }
    this.render();
  }

  updateCount(count) {
    const total = this.projects.length;
    if (this.currentFilter === 'all') {
      this.countEl.textContent = `${count} project${count !== 1 ? 's' : ''}`;
    } else {
      this.countEl.textContent = `${count}/${total} projects`;
    }
  }
}

export default ProjectManager;
