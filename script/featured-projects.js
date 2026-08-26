(function () {
    'use strict';

    function installFeaturedProjectStyles() {
        if (document.getElementById('featured-project-layout-styles')) return;

        const style = document.createElement('style');
        style.id = 'featured-project-layout-styles';
        style.textContent = `
            /* Desktop uses the same compact project-card style, with three cards per row. */
            .featured-projects-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                align-items: stretch;
                gap: 28px;
            }

            .featured-project-card {
                display: flex;
                height: 100%;
                min-width: 0;
                flex-direction: column;
                overflow: hidden;
                background: #0d1d2f;
                border: 1px solid #284968;
                border-radius: 0;
                box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
                transform-origin: center;
                transition: transform 280ms ease, border-color 280ms ease;
            }

            .featured-project-card:hover { transform: scale(1.015); border-color: rgba(65, 148, 208, 0.75); }
            .featured-project-media { width: 100%; height: 220px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #091725; border-bottom: 1px solid #203850; }
            .featured-project-media img { display: block; width: 100%; height: 100%; object-fit: contain; object-position: center; }
            .featured-project-content { display: flex; flex: 1; flex-direction: column; padding: 26px; }
            .featured-project-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; margin-bottom: 16px; }
            .featured-project-title { margin: 0; color: var(--text-primary); font-size: 22px; font-weight: 650; line-height: 1.25; }
            .featured-project-icon { flex: 0 0 auto; color: var(--primary); font-size: 18px; line-height: 1.4; }
            .featured-project-tech { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 18px; }
            .featured-project-tech span { padding: 4px 9px; background: #091725; border: 1px solid #284968; color: #57a6dd; font-size: 12px; font-weight: 600; line-height: 1.4; }
            .featured-project-description { display: -webkit-box; flex: 1; overflow: hidden; margin: 0 0 24px; color: var(--text-secondary); font-size: 15px; line-height: 1.65; -webkit-box-orient: vertical; -webkit-line-clamp: 4; }
            .featured-project-actions { display: flex; flex-wrap: wrap; gap: 12px 20px; margin-top: auto; }
            .featured-project-actions a { display: inline-flex; align-items: center; gap: 8px; color: var(--primary-light); font-size: 14px; font-weight: 650; line-height: 1.5; }

            /* Only collapse below a genuinely narrow desktop/tablet width. */
            @media (max-width: 900px) {
                .featured-projects-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            }
            @media (max-width: 768px) {
                .featured-projects-grid { grid-template-columns: 1fr; gap: 22px; }
                .featured-project-media { height: 210px; }
            }
            @media (max-width: 480px) {
                .featured-project-content { padding: 22px 20px; }
                .featured-project-media { height: 190px; }
            }
        `;
        document.head.appendChild(style);
    }

    function createCard(project) {
        const card = document.createElement('article');
        card.className = 'featured-project-card';
        const media = document.createElement('div'); media.className = 'featured-project-media';
        if (project.image) { const image = document.createElement('img'); image.src = project.image; image.alt = `${project.title || 'Project'} preview`; image.loading = 'lazy'; image.decoding = 'async'; media.appendChild(image); }
        const content = document.createElement('div'); content.className = 'featured-project-content';
        const header = document.createElement('div'); header.className = 'featured-project-header';
        const title = document.createElement('h3'); title.className = 'featured-project-title'; title.textContent = project.title || 'Untitled project';
        const icon = document.createElement('i'); icon.className = `fas ${project.icon || 'fa-code'} featured-project-icon`; icon.setAttribute('aria-hidden', 'true'); header.append(title, icon);
        const tags = document.createElement('div'); tags.className = 'featured-project-tech';
        (Array.isArray(project.tags) ? project.tags : []).slice(0, 3).forEach((tag) => { const item = document.createElement('span'); item.textContent = tag; tags.appendChild(item); });
        const description = document.createElement('p'); description.className = 'featured-project-description'; description.textContent = project.description || 'Project details coming soon.';
        const actions = document.createElement('div'); actions.className = 'featured-project-actions';
        const addLink = (href, label, iconClass) => { if (!href) return; const link = document.createElement('a'); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i>${label}`; actions.appendChild(link); };
        addLink(project.github, 'Code', 'fab fa-github'); addLink(project.demo, 'Live Demo', 'fas fa-external-link-alt');
        content.append(header, tags, description, actions); card.append(media, content); return card;
    }

    async function loadFeaturedProjects() {
        const grid = document.getElementById('featuredProjectsGrid'); if (!grid || !window.PortfolioContentStore) return;
        try {
            const projects = await window.PortfolioContentStore.loadProjects();
            const featuredProjects = projects.filter((project) => project.featured === true && project.published !== false);
            grid.replaceChildren();
            if (!featuredProjects.length) { grid.innerHTML = '<p class="featured-projects-empty">Featured projects will appear here soon.</p>'; return; }
            featuredProjects.forEach((project) => grid.appendChild(createCard(project)));
        } catch (error) { console.error('Error loading featured projects:', error); grid.innerHTML = '<p class="featured-projects-empty">Unable to load featured projects right now.</p>'; }
    }

    function initialize() { installFeaturedProjectStyles(); loadFeaturedProjects(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true }); else initialize();
})();
