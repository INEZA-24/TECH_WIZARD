(function () {
    'use strict';

    function createCard(project, index) {
        const card = document.createElement('article');
        card.className = 'featured-project-card';
        card.style.padding = '0';
        card.style.overflow = 'hidden';

        const media = document.createElement('div');
        media.className = 'featured-project-media';
        Object.assign(media.style, {
            width: '100%',
            height: 'auto',
            aspectRatio: '16 / 9',
            margin: '0',
            padding: '0',
            border: '0',
            borderBottom: '1px solid var(--border)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface)'
        });

        const fallback = document.createElement('div');
        fallback.className = 'featured-project-image-fallback';
        fallback.setAttribute('aria-hidden', 'true');
        Object.assign(fallback.style, {
            width: '100%',
            height: '100%',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
        });
        const fallbackIcon = document.createElement('i');
        fallbackIcon.className = `fas ${project.icon || 'fa-code'}`;
        fallback.appendChild(fallbackIcon);

        if (project.image) {
            const image = document.createElement('img');
            image.src = project.image;
            image.alt = `${project.title || 'Project'} preview`;
            image.loading = 'lazy';
            image.decoding = 'async';
            Object.assign(image.style, {
                display: 'block',
                width: '100%',
                height: '100%',
                maxWidth: 'none',
                maxHeight: 'none',
                margin: '0',
                padding: '0',
                border: '0',
                objectFit: 'contain'
            });
            image.addEventListener('error', () => {
                image.remove();
                fallback.style.display = 'flex';
                media.classList.add('is-fallback');
            }, { once: true });
            media.append(image, fallback);
        } else {
            fallback.style.display = 'flex';
            media.classList.add('is-fallback');
            media.appendChild(fallback);
        }

        const number = document.createElement('p');
        number.className = 'featured-project-number';
        number.textContent = String(index + 1).padStart(2, '0');
        number.style.margin = '20px 24px 0';

        const title = document.createElement('h3');
        title.className = 'featured-project-title';
        title.textContent = project.title || 'Untitled project';
        title.style.margin = '14px 24px 0';

        const description = document.createElement('p');
        description.className = 'featured-project-description';
        description.textContent = project.description || 'Project details coming soon.';
        description.style.margin = '10px 24px 0';

        const tags = document.createElement('div');
        tags.className = 'featured-project-tech';
        tags.style.margin = '18px 24px 0';
        (Array.isArray(project.tags) ? project.tags : []).slice(0, 3).forEach((tag) => {
            const item = document.createElement('span');
            item.textContent = tag;
            tags.appendChild(item);
        });

        const actions = document.createElement('div');
        actions.className = 'featured-project-actions';
        actions.style.margin = '20px 24px 24px';
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
