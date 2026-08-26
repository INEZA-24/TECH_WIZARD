(function () {
    'use strict';

    function installFeaturedProjectStyles() {
        if (document.getElementById('featured-project-layout-styles')) return;
        const style = document.createElement('style');
        style.id = 'featured-project-layout-styles';
        style.textContent = `
            /* These selectors intentionally match the homepage CSS specificity. */
            .featured-projects .featured-projects-grid {
                display: grid !important;
                width: 100%;
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                gap: 18px;
                align-items: stretch;
            }

            .featured-projects .featured-project-card {
                min-width: 0;
                height: 100%;
                padding: 0 !important;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                background: #0d1d2f;
                border: 1px solid #284968;
            }

            .featured-projects .featured-project-media {
                width: 100%;
                height: 180px;
                flex: 0 0 auto;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #091725;
                border-bottom: 1px solid #203850;
            }

            .featured-projects .featured-project-media img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: contain;
                object-position: center;
            }

            .featured-projects .featured-project-content {
                display: flex;
                flex: 1;
                flex-direction: column;
                padding: 20px;
            }

            .featured-projects .featured-project-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 12px;
            }

            .featured-projects .featured-project-title {
                margin: 0;
                font-size: 18px;
                line-height: 1.3;
            }

            .featured-projects .featured-project-icon {
                flex: 0 0 auto;
                color: var(--primary);
                font-size: 16px;
            }

            .featured-projects .featured-project-tech {
                display: flex;
                flex-wrap: wrap;
                gap: 7px;
                margin: 0 0 14px;
            }

            .featured-projects .featured-project-description {
                flex: 1;
                margin: 0;
                font-size: 13px;
                line-height: 1.6;
            }

            .featured-projects .featured-project-actions {
                margin-top: 18px;
            }

            @media (max-width: 900px) {
                .featured-projects .featured-projects-grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                }
            }

            @media (max-width: 768px) {
                .featured-projects .featured-projects-grid {
                    grid-template-columns: 1fr !important;
                }
                .featured-projects .featured-project-media {
                    height: 190px;
                }
            }
        `;
        document.head.appendChild(style);
    }

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
        installFeaturedProjectStyles();
        loadFeaturedProjects();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
