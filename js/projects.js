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
    
    const links = [];
    if (project.url) {
      links.push(`<a href="${project.url}" class="card__link" target="_blank" rel="noopener">View →</a>`);
    }
    if (project.repo) {
      links.push(`<a href="${project.repo}" class="card__link" target="_blank" rel="noopener">Repo</a>`);
    }

    return `
      <article class="card" data-id="${project.id}" data-url="${project.url || project.repo}">
        <div class="card__header">
          <h3 class="card__title">${project.name}</h3>
          <span class="card__status ${statusClass}">[${statusText}]</span>
        </div>
        <p class="card__desc">${project.description}</p>
        <div class="card__meta">
          <div class="card__tags">${tags}</div>
          <span class="card__date">${project.date}</span>
        </div>
        <div class="card__links">${links.join('')}</div>
      </article>
    `;
  }

  attachCardListeners() {
    const cards = this.grid.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't navigate if clicking a link inside the card
        if (e.target.closest('.card__link')) return;
        
        const url = card.dataset.url;
        if (url && url !== 'null') {
          window.open(url, '_blank');
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

