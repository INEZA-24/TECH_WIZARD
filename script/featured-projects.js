(function () {
    'use strict';


    function createCard(project) {
        const card = document.createElement('article');
        card.className = 'featured-project-card';

        const media = document.createElement('div');
        media.className = 'featured-project-media';
        if (project.image) {
            const image = document.createElement('img');
            image.src = project.image;
            image.alt = `${project.title || 'Project'} preview`;
            image.loading = 'lazy';
            image.decoding = 'async';
            media.appendChild(image);
        }

        const content = document.createElement('div');
        content.className = 'featured-project-content';
        const header = document.createElement('div');
        header.className = 'featured-project-header';

        const title = document.createElement('h3');
        title.className = 'featured-project-title';
        title.textContent = project.title || 'Untitled project';

        const icon = document.createElement('i');
        icon.className = `fas ${project.icon || 'fa-code'} featured-project-icon`;
        icon.setAttribute('aria-hidden', 'true');
        header.append(title, icon);

        const tags = document.createElement('div');
        tags.className = 'featured-project-tech';
        (Array.isArray(project.tags) ? project.tags : []).slice(0, 3).forEach((tag) => {
            const item = document.createElement('span');
            item.textContent = tag;
            tags.appendChild(item);
        });

        const description = document.createElement('p');
        description.className = 'featured-project-description';
        description.textContent = project.description || 'Project details coming soon.';

        const actions = document.createElement('div');
        actions.className = 'featured-project-actions';
        const addLink = (href, label, iconClass) => {
            if (!href) return;
            const link = document.createElement('a');
            link.href = href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i>${label}`;
            actions.appendChild(link);
        };
        addLink(project.github, 'Code', 'fab fa-github');
        addLink(project.demo, 'Live Demo', 'fas fa-external-link-alt');

        content.append(header, tags, description, actions);
        card.append(media, content);
        return card;
    }

    async function loadFeaturedProjects() {
        const grid = document.getElementById('featuredProjectsGrid');
        if (!grid || !window.PortfolioContentStore) return;
        try {
            const projects = await window.PortfolioContentStore.loadProjects();
            const featuredProjects = projects.filter((project) => project.featured === true && project.published !== false);
            grid.replaceChildren();
            if (!featuredProjects.length) {
                grid.innerHTML = '<p class="featured-projects-empty">Featured projects will appear here soon.</p>';
                return;
            }
            featuredProjects.forEach((project) => grid.appendChild(createCard(project)));
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
