(function () {
    'use strict';

    function installFeaturedProjectStyles() {
        if (document.getElementById('featured-project-layout-styles')) return;
        const style = document.createElement('style');
        style.id = 'featured-project-layout-styles';
        style.textContent = `
            /* Match the sizing and responsive grid used on projects.html */
            .featured-projects-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                align-items: stretch;
                gap: 28px;
            }
            .featured-project-card {
                display: flex;
                min-width: 0;
                height: 100%;
                padding: 0 !important;
                overflow: hidden;
                background: #0d1d2f;
                border: 1px solid #284968;
                flex-direction: column;
            }
            .featured-project-media {
                width: 100%;
                height: 220px !important;
                flex: 0 0 auto;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #091725;
                border: 0 !important;
                border-bottom: 1px solid #203850 !important;
            }
            .featured-project-media img {
                display: block;
                width: 100% !important;
                height: 100% !important;
                object-fit: contain !important;
                object-position: center;
            }
            .featured-project-number { margin: 26px 26px 0 !important; }
            .featured-project-title { margin: 12px 26px 0 !important; font-size: 22px; line-height: 1.25; }
            .featured-project-description { margin: 16px 26px 0 !important; line-height: 1.65; }
            .featured-project-tech { margin: 18px 26px 0 !important; }
            .featured-project-actions { margin: 24px 26px 26px !important; }
            @media (min-width: 1200px) {
                .featured-projects-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            }
            @media (max-width: 768px) {
                .featured-projects-grid { grid-template-columns: 1fr; gap: 22px; }
                .featured-project-media { height: 210px !important; }
            }
            @media (max-width: 480px) {
                .featured-project-media { height: 190px !important; }
                .featured-project-number { margin-left: 20px !important; margin-right: 20px !important; }
                .featured-project-title, .featured-project-description, .featured-project-tech, .featured-project-actions { margin-left: 20px !important; margin-right: 20px !important; }
            }
        `;
        document.head.appendChild(style);
    }

    function createCard(project, index) {
        const card = document.createElement('article');
        card.className = 'featured-project-card';
        const media = document.createElement('div');
        media.className = 'featured-project-media';
        const fallback = document.createElement('div');
        fallback.className = 'featured-project-image-fallback';
        fallback.setAttribute('aria-hidden', 'true');
        Object.assign(fallback.style,{display:'none',alignItems:'center',justifyContent:'center',width:'100%',height:'100%'});
        const fallbackIcon=document.createElement('i'); fallbackIcon.className=`fas ${project.icon||'fa-code'}`; fallback.appendChild(fallbackIcon);
        if(project.image){const image=document.createElement('img');image.src=project.image;image.alt=`${project.title||'Project'} preview`;image.loading='lazy';image.decoding='async';image.addEventListener('error',()=>{image.remove();fallback.style.display='flex';media.classList.add('is-fallback')},{once:true});media.append(image,fallback)}else{fallback.style.display='flex';media.classList.add('is-fallback');media.appendChild(fallback)}
        const number=document.createElement('p');number.className='featured-project-number';number.textContent=String(index+1).padStart(2,'0');
        const title=document.createElement('h3');title.className='featured-project-title';title.textContent=project.title||'Untitled project';
        const description=document.createElement('p');description.className='featured-project-description';description.textContent=project.description||'Project details coming soon.';
        const tags=document.createElement('div');tags.className='featured-project-tech';(Array.isArray(project.tags)?project.tags:[]).slice(0,3).forEach(tag=>{const item=document.createElement('span');item.textContent=tag;tags.appendChild(item)});
        const actions=document.createElement('div');actions.className='featured-project-actions';
        const addProjectLink=(href,label,iconClass)=>{if(!href)return;const link=document.createElement('a');link.href=href;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${label}: ${project.title||'project'}`);link.innerHTML=`<i class="${iconClass}" aria-hidden="true"></i>${label}`;actions.appendChild(link)};
        addProjectLink(project.github,'GitHub','fab fa-github');addProjectLink(project.demo,'Live Demo','fas fa-arrow-up-right-from-square');
        card.append(media,number,title,description,tags,actions);return card;
    }

    async function loadFeaturedProjects(){const grid=document.getElementById('featuredProjectsGrid');if(!grid||!window.PortfolioContentStore)return;try{const projects=await window.PortfolioContentStore.loadProjects();const featuredProjects=projects.filter(project=>project.featured===true&&project.published!==false);grid.replaceChildren();if(!featuredProjects.length){grid.innerHTML='<p class="featured-projects-empty">Featured projects will appear here soon.</p>';return}featuredProjects.forEach((project,index)=>grid.appendChild(createCard(project,index)))}catch(error){console.error('Error loading featured projects:',error);grid.innerHTML='<p class="featured-projects-empty">Unable to load featured projects right now.</p>'}}
    function initialize(){installFeaturedProjectStyles();loadFeaturedProjects()}
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initialize,{once:true})}else{initialize()}
})();
