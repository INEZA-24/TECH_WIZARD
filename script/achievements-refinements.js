(function () {
    'use strict';

    const ICSC_AWARD = {
        title: 'ICSC 2026: Qualification Round Special Honour',
        issuer: 'International Computer Science Competition',
        date: '20 July 2026',
        file: 'ICSC_Qualification_Round_Certificate.pdf'
    };

    const recognitionItems = [
        {
            icon: 'fa-code',
            title: 'ICSC 2026: Special Honour',
            description: 'Received a Special Honour after submitted code was successfully evaluated and passed all test cases in the Qualification Round.',
            organization: 'International Computer Science Competition',
            marker: '2026'
        },
        {
            icon: 'fa-robot',
            title: 'FTC Robotics: Certificate of Recognition',
            description: 'Recognized for contribution and dedication in robotics, including robot design, engineering and strategic gameplay.',
            organization: 'College Saint André / FIRST',
            marker: '2024'
        },
        {
            icon: 'fa-medal',
            title: 'FLL National Finals: Two Finalist Medals at 16',
            description: 'Reached the FLL National Finals with my team and earned two finalist medals at age 16.',
            organization: 'FIRST LEGO League',
            marker: 'Age 16'
        }
    ];

    const competitionItems = [
        {
            icon: 'fa-code',
            title: 'ICSC 2026: Qualification Round',
            description: 'Successfully participated in the 2026 Qualification Round, where my submitted code passed all test cases and earned a Special Honour.',
            organization: 'International Computer Science Competition',
            marker: '2026'
        },
        {
            icon: 'fa-medal',
            title: 'FLL: National Finals',
            description: 'Reached the national finals with my team and earned two finalist medals at age 16.',
            organization: 'FIRST LEGO League',
            marker: 'Age 16'
        },
        {
            icon: 'fa-code-branch',
            title: 'Open Source Hackathon: Repo-Pilot',
            description: 'Built Repo-Pilot during an open-source hackathon focused on practical contribution tooling.',
            organization: 'Elite Coders',
            marker: '2026'
        },
        {
            icon: 'fa-lightbulb',
            title: 'Wavumbuzi Entrepreneurship Challenge',
            description: 'Participated actively in the 5th Edition of the Wavumbuzi Entrepreneurship Challenge.',
            organization: 'Wavumbuzi Rwanda',
            marker: '2025'
        }
    ];

    const leadershipItems = [
        {
            year: '2026',
            title: 'Founder & Leader: TECH INSPIRES',
            description: 'Leading a youth-focused technology initiative built around practical skills, innovation and access to opportunity.'
        },
        {
            year: '2026',
            title: 'President: ICT & Innovation Club',
            description: 'Leading student technology activities, workshops, competitions and innovation initiatives.'
        },
        {
            year: '2026',
            title: 'Robotics: Team Contribution',
            description: 'Contributing across robotics teams, competition preparation and practical engineering experiences.'
        }
    ];

    function injectRefinementStyles() {
        if (document.getElementById('achievements-refinement-styles')) return;

        const style = document.createElement('style');
        style.id = 'achievements-refinement-styles';
        style.textContent = `
            .achievements-hero .page-label {
                color: #f3f7fb !important;
            }

            .achievements-hero .hero-scroll-link {
                color: #f3f7fb !important;
                border-bottom-color: rgba(243, 247, 251, 0.68) !important;
            }

            .achievement-actions {
                margin-top: 22px;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }

            .achievement-document-link {
                min-height: 42px;
                padding: 9px 15px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                border: 1px solid #4194d0;
                background: transparent;
                color: #dceffc;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
            }

            .achievement-document-link:hover,
            .achievement-document-link:focus-visible {
                border-color: #57a6dd;
                background: #122842;
                color: #ffffff;
            }

            .achievement-list-marker {
                color: #7f91a4;
                font-size: 11px;
                white-space: nowrap;
            }

            .achievements-closing-quote .closing-quote-text {
                width: min(100%, 1120px);
                margin-inline: auto;
                text-align: center;
                font-size: clamp(34px, 3.8vw, 48px);
                line-height: 1.18;
                letter-spacing: -0.025em;
            }

            .achievements-closing-quote .quote-pyramid-line {
                display: block;
                width: max-content;
                max-width: 100%;
                margin-inline: auto;
                white-space: nowrap;
            }

            .achievements-closing-quote .closing-quote-author {
                margin-top: 30px;
            }

            @media (max-width: 768px) {
                .achievements-closing-quote .closing-quote-text {
                    width: min(100%, 680px);
                    font-size: clamp(26px, 6.5vw, 34px);
                    line-height: 1.28;
                }

                .achievements-closing-quote .quote-pyramid-line {
                    display: inline;
                    width: auto;
                    white-space: normal;
                }
            }

            @media (max-width: 600px) {
                .achievement-list-marker {
                    grid-column: 2;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function escapeHtml(value = '') {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function renderAchievementItem(item) {
        return `
            <article class="achievement-list-item">
                <span class="achievement-list-icon"><i class="fas ${escapeHtml(item.icon)}" aria-hidden="true"></i></span>
                <div class="achievement-list-copy">
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.description)}</p>
                    <span>${escapeHtml(item.organization)}</span>
                </div>
                <span class="achievement-list-marker">${escapeHtml(item.marker)}</span>
            </article>`;
    }

    function renderLists() {
        const recognitionList = document.getElementById('recognitionList');
        const competitionList = document.getElementById('competitionList');

        if (recognitionList) recognitionList.innerHTML = recognitionItems.map(renderAchievementItem).join('');
        if (competitionList) competitionList.innerHTML = competitionItems.map(renderAchievementItem).join('');

        const totalRecognition = document.getElementById('totalRecognition');
        const totalCompetitions = document.getElementById('totalCompetitions');
        const recognitionCount = document.getElementById('recognitionCountLabel');
        const competitionCount = document.getElementById('competitionCountLabel');

        if (totalRecognition) totalRecognition.textContent = recognitionItems.length;
        if (totalCompetitions) totalCompetitions.textContent = competitionItems.length;
        if (recognitionCount) recognitionCount.textContent = `${recognitionItems.length} items`;
        if (competitionCount) competitionCount.textContent = `${competitionItems.length} items`;
    }

    function renderLeadership() {
        const timeline = document.getElementById('leadershipTimeline');
        if (!timeline) return;

        timeline.innerHTML = leadershipItems.map(item => `
            <article class="leadership-timeline-item">
                <time>${escapeHtml(item.year)}</time>
                <span class="leadership-timeline-node" aria-hidden="true"></span>
                <div>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.description)}</p>
                </div>
            </article>`).join('');

        const total = document.getElementById('totalLeadership');
        if (total) total.textContent = leadershipItems.length;
    }

    function updateFeaturedAchievements() {
        const major = document.querySelector('.featured-achievement-major');

        if (major) {
            const type = major.querySelector('.achievement-type');
            const title = major.querySelector('.featured-achievement-copy h3');
            const description = major.querySelector('.featured-achievement-copy > p');
            const meta = major.querySelector('.achievement-meta');
            const copy = major.querySelector('.featured-achievement-copy');

            if (type) type.textContent = 'Competition & Recognition';
            if (title) title.textContent = 'ICSC 2026: Qualification Round Special Honour';
            if (description) description.textContent = 'Successfully participated in the 2026 Qualification Round and received a Special Honour after my submitted code was successfully evaluated and passed all test cases.';
            if (meta) meta.innerHTML = '<span>International Computer Science Competition</span><span>20 July 2026</span>';

            if (copy && !copy.querySelector('[data-view-icsc-award]')) {
                const actions = document.createElement('div');
                actions.className = 'achievement-actions';
                actions.innerHTML = `
                    <button class="achievement-document-link" type="button" data-view-icsc-award>
                        <i class="fas fa-award" aria-hidden="true"></i>
                        View Award
                    </button>`;
                copy.appendChild(actions);
            }
        }

        const featureGrid = document.querySelector('.featured-achievement-grid');
        if (featureGrid) {
            featureGrid.innerHTML = `
                <article class="featured-achievement-card">
                    <span class="achievement-type">Recognition</span>
                    <h3>FTC Robotics: Certificate of Recognition</h3>
                    <p>Recognized for contribution and dedication in robotics, including robot design, engineering and strategic gameplay.</p>
                    <div class="achievement-meta"><span>College Saint André / FIRST</span><span>2024</span></div>
                </article>
                <article class="featured-achievement-card">
                    <span class="achievement-type">Robotics</span>
                    <h3>FLL National Finals: Two Finalist Medals at 16</h3>
                    <p>Reached the FLL National Finals with my team and earned two finalist medals at age 16, marking an early national-level robotics milestone.</p>
                    <div class="achievement-meta"><span>FIRST LEGO League</span><span>Age 16</span></div>
                </article>`;
        }
    }

    function updateClosingQuote() {
        const quoteText = document.querySelector('.achievements-closing-quote .closing-quote-text');
        const quoteAuthor = document.querySelector('.achievements-closing-quote .closing-quote-author');

        if (quoteText) {
            quoteText.innerHTML = [
                '“A journey is not made in one leap. It is built ',
                'step by step, through lessons learned, ',
                'challenges faced and the courage ',
                'to keep moving forward.”'
            ].map(line => `<span class="quote-pyramid-line">${line}</span>`).join('');
        }

        if (quoteAuthor) quoteAuthor.textContent = 'The journey continues';
    }

    function awardAssetUrl() {
        if (window.PortfolioContentStore && typeof window.PortfolioContentStore.resolveCertificateAsset === 'function') {
            return window.PortfolioContentStore.resolveCertificateAsset(ICSC_AWARD.file);
        }
        return `https://wizadmin.vercel.app/certificates/${encodeURIComponent(ICSC_AWARD.file)}`;
    }

    function openIcscAward() {
        const overlay = document.getElementById('certificatePopup');
        const popup = document.getElementById('popupContent');
        const image = document.getElementById('popupImage');
        const pdf = document.getElementById('popupPdf');
        const fallback = document.getElementById('popupFallback');
        const title = document.getElementById('popupTitle');
        const issuer = document.getElementById('popupIssuer');
        const date = document.getElementById('popupDate');
        const original = document.getElementById('popupOpenOriginal');
        const previous = document.getElementById('prevCert');
        const next = document.getElementById('nextCert');

        if (!overlay || !popup || !pdf) return;

        const url = awardAssetUrl();

        if (image) {
            image.hidden = true;
            image.src = '';
        }
        if (fallback) fallback.hidden = true;

        pdf.src = `${url}#view=FitH&toolbar=1&navpanes=0`;
        pdf.title = `${ICSC_AWARD.title} PDF`;
        pdf.hidden = false;

        if (title) title.textContent = ICSC_AWARD.title;
        if (issuer) issuer.textContent = ICSC_AWARD.issuer;
        if (date) date.textContent = ICSC_AWARD.date;
        if (original) {
            original.href = url;
            original.classList.remove('is-disabled');
            original.setAttribute('aria-disabled', 'false');
        }
        if (previous) previous.disabled = true;
        if (next) next.disabled = true;

        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => popup.classList.add('active'));
        document.body.style.overflow = 'hidden';
        document.getElementById('closePopup')?.focus();
    }

    function bindAwardViewer() {
        document.addEventListener('click', event => {
            const trigger = event.target.closest('[data-view-icsc-award]');
            if (!trigger) return;
            event.preventDefault();
            openIcscAward();
        });
    }

    function apply() {
        if (!document.body.classList.contains('achievements-page-body')) return;

        injectRefinementStyles();
        updateFeaturedAchievements();
        renderLists();
        renderLeadership();
        updateClosingQuote();
        bindAwardViewer();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply, { once: true });
    } else {
        apply();
    }
})();
