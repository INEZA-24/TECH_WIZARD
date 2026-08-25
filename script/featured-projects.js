(function () {
    'use strict';

    function createCard(project, index) {
        const card = document.createElement('article');
        card.className = 'featured-project-card';

        const media = document.createElement('div');
        media.className = 'featured-project-media';
        const fallback = document.createElement('div');
        fallback.className = 'featured-project-image-fallback';
        fallback.setAttribute('aria-hidden', 'true');
        const fallbackIcon = document.createElement('i');
        fallbackIcon.className = `fas ${project.icon || 'fa-code'}`;
        fallback.appendChild(fallbackIcon);

        if (project.image) {
            const image = document.createElement('img');
            image.src = project.image;
            image.alt = `${project.title || 'Project'} preview`;
            image.loading = 'lazy';
            image.decoding = 'async';
            image.addEventListener('error', () => {
                image.remove();
                media.classList.add('is-fallback');
            }, { once: true });
            media.append(image, fallback);
        } else {
            media.classList.add('is-fallback');
            media.appendChild(fallback);
        }

        const number = document.createElement('p');
        number.className = 'featured-project-number';
        number.textContent = String(index + 1).padStart(2, '0');

        const title = document.createElement('h3');
        title.className = 'featured-project-title';
        title.textContent = project.title || 'Untitled project';

        const description = document.createElement('p');
        description.className = 'featured-project-description';
        description.textContent = project.description || 'Project details coming soon.';

        const tags = document.createElement('div');
        tags.className = 'featured-project-tech';
        (Array.isArray(project.tags) ? project.tags : []).slice(0, 3).forEach((tag) => {
            const item = document.createElement('span');
            item.textContent = tag;
            tags.appendChild(item);
        });

        const actions = document.createElement('div');
        actions.className = 'featured-project-actions';
        const addProjectLink = (href, label, iconClass) => {
            if (!href) return;
            const link = document.createElement('a');
            link.href = href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', `${label}: ${project.title || 'project'}`);
            link.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i>${label}`;
            actions.appendChild(link);
        };

        addProjectLink(project.github, 'GitHub', 'fab fa-github');
        addProjectLink(project.demo, 'Live Demo', 'fas fa-arrow-up-right-from-square');
        card.append(media, number, title, description, tags, actions);
        return card;
    }

    async function loadFeaturedProjects() {
        const grid = document.getElementById('featuredProjectsGrid');
        if (!grid || !window.PortfolioContentStore) return;

        try {
            const projects = await window.PortfolioContentStore.loadProjects();
            const featuredProjects = projects
                .filter((project) => project.featured === true && project.published !== false)
                .slice(0, 2);

            grid.replaceChildren();
            if (!featuredProjects.length) {
                grid.innerHTML = '<p class="featured-projects-empty">Featured projects will appear here soon.</p>';
                return;
            }

            featuredProjects.forEach((project, index) => grid.appendChild(createCard(project, index)));
        } catch (error) {
            console.error('Error loading featured projects:', error);
            grid.innerHTML = '<p class="featured-projects-empty">Unable to load featured projects right now.</p>';
        }
    }

    function initialize() {
        loadFeaturedProjects();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
