document.addEventListener('DOMContentLoaded', () => {

    // Hero slide images
    const heroImages = [
        { url: '../assets/Hero/Image01.webp', position: 'center center' },
        { url: '../assets/Hero/Image02.webp', position: 'center center' },
        { url: '../assets/Hero/Image03.webp', position: 'center center' }
    ];
    document.querySelectorAll('.hero-slide').forEach((slide, index) => {
        if (heroImages[index]) {
            slide.style.backgroundImage = `url('${heroImages[index].url}')`;
            slide.style.backgroundPosition = heroImages[index].position;
        }
    });

    // Navbar scroll handler
    const navbar = document.getElementById('mainNavbar');
    const subHeader = document.getElementById('subHeader');
    const SCROLL_THRESHOLD = 100;
    let lastScrollY = 0;

    function handleScroll() {
        const currentScrollY = window.scrollY;
        navbar.classList.toggle('scrolled', currentScrollY >= SCROLL_THRESHOLD);
        if (currentScrollY > lastScrollY && currentScrollY > 60) {
            subHeader.classList.add('hidden');
            navbar.style.top = '0px';
        } else {
            subHeader.classList.remove('hidden');
            navbar.style.top = '42px';
        }
        lastScrollY = currentScrollY;
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Hero carousel slide text sync
    const heroCarousel = document.getElementById('heroCarousel');
    const slideTexts = document.querySelectorAll('.hero-slide-text');
    if (heroCarousel && slideTexts.length) {
        heroCarousel.addEventListener('slide.bs.carousel', (event) => {
            slideTexts.forEach(el => el.classList.remove('active'));
            const target = document.querySelector(`.hero-slide-text[data-slide="${event.to}"]`);
            if (target) {
                target.style.animation = 'none';
                target.offsetHeight;
                target.style.animation = '';
                target.classList.add('active');
            }
        });
    }

    // Mobile drawer
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
    const navbarCollapse = document.getElementById('navbarNav');
    const navToggler = document.querySelector('.navbar-toggler');

    function closeDrawer() {
        if (!navbarCollapse) return;
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
    }

    if (navbarCollapse) {
        navbarCollapse.addEventListener('show.bs.collapse', () => {
            document.body.style.overflow = 'hidden';
            if (navToggler) {
                navToggler.setAttribute('aria-expanded', 'true');
                navToggler.querySelector('i').classList.replace('ri-menu-line', 'ri-close-line');
            }
        });
        navbarCollapse.addEventListener('hide.bs.collapse', () => {
            document.body.style.overflow = '';
            if (navToggler) {
                navToggler.setAttribute('aria-expanded', 'false');
                navToggler.querySelector('i').classList.replace('ri-close-line', 'ri-menu-line');
            }
        });
        navLinks.forEach(link => link.addEventListener('click', closeDrawer));
        navbarCollapse.addEventListener('click', e => { if (e.target === navbarCollapse) closeDrawer(); });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
                const subH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--subheader-height')) || 40;
                window.scrollTo({ top: target.offsetTop - navH - subH, behavior: 'smooth' });
            }
        });
    });

    // Counter animation
    function animateCounter(el, target, suffix, duration) {
        let start = 0;
        const step = target / (duration / 16);
        function tick() {
            start += step;
            if (start >= target) { el.textContent = target + suffix; return; }
            el.textContent = Math.floor(start) + suffix;
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // About stats strip counter
    const statsStrip = document.querySelector('.about-stats-strip');
    if (statsStrip) {
        let countersStarted = false;
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    statsStrip.querySelectorAll('.astat-item').forEach((item, i) => {
                        setTimeout(() => animateCounter(
                            item.querySelector('.astat-num'),
                            parseInt(item.dataset.count, 10),
                            item.dataset.suffix || '',
                            1600
                        ), i * 180);
                    });
                }
            });
        }, { threshold: 0.3 }).observe(statsStrip);
    }

    // Why cards staggered entrance
    const whyCards = document.querySelectorAll('.why-card');
    if (whyCards.length) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.index, 10) || 0;
                    setTimeout(() => entry.target.classList.add('revealed'), index * 100);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        whyCards.forEach((card, i) => { card.dataset.index = i; cardObserver.observe(card); });
    }

    // Value items slide-in
    const valueItems = document.querySelectorAll('.value-item');
    if (valueItems.length) {
        valueItems.forEach(item => {
            item.style.cssText += 'opacity:0;transform:translateX(-20px);transition:opacity 0.5s ease,transform 0.5s ease';
        });
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.parentElement?.querySelectorAll('.value-item').forEach((item, i) => {
                        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateX(0)'; }, i * 130);
                    });
                }
            });
        }, { threshold: 0.2 }).observe(valueItems[0]);
    }

    // About visual mouse parallax
    const aboutVisual = document.querySelector('.about-visual');
    if (aboutVisual && window.matchMedia('(min-width: 992px)').matches) {
        const avMain = aboutVisual.querySelector('.av-img--main img');
        const avFloat = aboutVisual.querySelector('.av-float-card');
        aboutVisual.addEventListener('mousemove', (e) => {
            const rect = aboutVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            if (avMain) avMain.style.transform = `scale(1.04) translate(${x * 6}px, ${y * 4}px)`;
            if (avFloat) avFloat.style.transform = `translate(${x * -8}px, ${y * -5}px)`;
        });
        aboutVisual.addEventListener('mouseleave', () => {
            if (avMain) avMain.style.transform = '';
            if (avFloat) avFloat.style.transform = '';
        });
    }

    // Services tabs
    const srvTabs = document.querySelectorAll('.srv-tab');
    const srvPanels = document.querySelectorAll('.srv-panel');
    if (srvTabs.length && srvPanels.length) {
        srvTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                srvTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                srvPanels.forEach(p => p.classList.remove('active'));
                document.querySelector(`.srv-panel[data-panel="${tab.dataset.tab}"]`)?.classList.add('active');
            });
        });
    }

    // Section headers fade-up
    const revealEls = document.querySelectorAll('.srv-header, .team-header, .about-header, .why-header, .srv-cta-strip');
    if (revealEls.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealEls.forEach(el => {
            el.style.cssText += 'opacity:0;transform:translateY(24px);transition:opacity 0.65s ease,transform 0.65s ease';
            revealObserver.observe(el);
        });
    }

    // Technologies section
    const TS_CATS = [
        { id: 'all', label: 'All Technologies', icon: 'ri-apps-line' },
        { id: 'frontend', label: 'Frontend', icon: 'ri-layout-3-line' },
        { id: 'backend', label: 'Backend', icon: 'ri-server-line' },
        { id: 'mobile', label: 'Mobile', icon: 'ri-smartphone-line' },
        { id: 'database', label: 'Database', icon: 'ri-database-2-line' },
        { id: 'cloud', label: 'Cloud & DevOps', icon: 'ri-cloud-line' },
        { id: 'ai', label: 'AI & ML', icon: 'ri-brain-line' },
        { id: 'cms', label: 'CMS & E-commerce', icon: 'ri-shopping-cart-line' },
    ];

    const TS_TECHS = [
        { name: 'HTML5', cat: 'frontend', logo: 'https://cdn.simpleicons.org/html5/E34F26', color: '#E34F26', bg: 'rgba(227,79,38,0.13)', level: 'expert' },
        { name: 'CSS3', cat: 'frontend', logo: 'https://img.icons8.com/color/96/css3.png', color: '#264DE4', bg: 'rgba(38,77,228,0.13)', level: 'expert' },
        { name: 'JavaScript', cat: 'frontend', logo: 'https://cdn.simpleicons.org/javascript/F7DF1E', color: '#F7DF1E', bg: 'rgba(247,223,30,0.12)', level: 'expert' },
        { name: 'React', cat: 'frontend', logo: 'https://cdn.simpleicons.org/react/61DAFB', color: '#61DAFB', bg: 'rgba(97,218,251,0.12)', level: 'expert' },
        { name: 'Vue.js', cat: 'frontend', logo: 'https://cdn.simpleicons.org/vuedotjs/42B883', color: '#42B883', bg: 'rgba(66,184,131,0.12)', level: 'advanced' },
        { name: 'Angular', cat: 'frontend', logo: 'https://cdn.simpleicons.org/angular/DD0031', color: '#DD0031', bg: 'rgba(221,0,49,0.11)', level: 'advanced' },
        { name: 'Tailwind CSS', cat: 'frontend', logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4', color: '#06B6D4', bg: 'rgba(6,182,212,0.12)', level: 'expert' },
        { name: 'Next.js', cat: 'frontend', logo: 'https://cdn.simpleicons.org/nextdotjs/ffffff', color: '#dddddd', bg: 'rgba(255,255,255,0.07)', level: 'expert' },
        { name: 'Node.js', cat: 'backend', logo: 'https://cdn.simpleicons.org/nodedotjs/339933', color: '#339933', bg: 'rgba(51,153,51,0.12)', level: 'expert' },
        { name: 'PHP', cat: 'backend', logo: 'https://cdn.simpleicons.org/php/777BB4', color: '#8892BE', bg: 'rgba(136,146,190,0.12)', level: 'advanced' },
        { name: 'Laravel', cat: 'backend', logo: 'https://cdn.simpleicons.org/laravel/FF2D20', color: '#FF2D20', bg: 'rgba(255,45,32,0.11)', level: 'advanced' },
        { name: 'Python', cat: 'backend', logo: 'https://cdn.simpleicons.org/python/3776AB', color: '#3776AB', bg: 'rgba(55,118,171,0.12)', level: 'expert' },
        { name: 'Django', cat: 'backend', logo: 'https://cdn.simpleicons.org/django/092E20', color: '#44B78B', bg: 'rgba(68,183,139,0.12)', level: 'advanced' },
        { name: 'Express.js', cat: 'backend', logo: 'https://cdn.simpleicons.org/express/000000', color: '#aaaaaa', bg: 'rgba(170,170,170,0.1)', level: 'advanced' },
        { name: 'Flutter', cat: 'mobile', logo: 'https://cdn.simpleicons.org/flutter/02569B', color: '#54C5F8', bg: 'rgba(84,197,248,0.12)', level: 'expert' },
        { name: 'React Native', cat: 'mobile', logo: 'https://cdn.simpleicons.org/react/61DAFB', color: '#61DAFB', bg: 'rgba(97,218,251,0.1)', level: 'expert' },
        { name: 'Android', cat: 'mobile', logo: 'https://cdn.simpleicons.org/android/3DDC84', color: '#3DDC84', bg: 'rgba(61,220,132,0.12)', level: 'advanced' },
        { name: 'iOS / Swift', cat: 'mobile', logo: 'https://cdn.simpleicons.org/swift/FA7343', color: '#A2AAAD', bg: 'rgba(162,170,173,0.1)', level: 'advanced' },
        { name: 'MySQL', cat: 'database', logo: 'https://cdn.simpleicons.org/mysql/4479A1', color: '#4479A1', bg: 'rgba(68,121,161,0.12)', level: 'expert' },
        { name: 'PostgreSQL', cat: 'database', logo: 'https://cdn.simpleicons.org/postgresql/336791', color: '#336791', bg: 'rgba(51,103,145,0.12)', level: 'expert' },
        { name: 'MongoDB', cat: 'database', logo: 'https://cdn.simpleicons.org/mongodb/47A248', color: '#47A248', bg: 'rgba(71,162,72,0.12)', level: 'advanced' },
        { name: 'Firebase', cat: 'database', logo: 'https://cdn.simpleicons.org/firebase/FFCA28', color: '#FFCA28', bg: 'rgba(255,202,40,0.12)', level: 'expert' },
        { name: 'Redis', cat: 'database', logo: 'https://cdn.simpleicons.org/redis/DC382D', color: '#DC382D', bg: 'rgba(220,56,45,0.11)', level: 'advanced' },
        { name: 'AWS', cat: 'cloud', logo: 'https://img.icons8.com/color/96/amazon-web-services.png', color: '#FF9900', bg: 'rgba(255,153,0,0.12)', level: 'expert' },
        { name: 'Azure', cat: 'cloud', logo: 'https://img.icons8.com/color/96/azure-1.png', color: '#0078D4', bg: 'rgba(0,120,212,0.12)', level: 'advanced' },
        { name: 'Google Cloud', cat: 'cloud', logo: 'https://cdn.simpleicons.org/googlecloud/4285F4', color: '#4285F4', bg: 'rgba(66,133,244,0.12)', level: 'advanced' },
        { name: 'Docker', cat: 'cloud', logo: 'https://cdn.simpleicons.org/docker/2496ED', color: '#0DB7ED', bg: 'rgba(13,183,237,0.12)', level: 'expert' },
        { name: 'Kubernetes', cat: 'cloud', logo: 'https://cdn.simpleicons.org/kubernetes/326CE5', color: '#326CE5', bg: 'rgba(50,108,229,0.12)', level: 'advanced' },
        { name: 'GitHub Actions', cat: 'cloud', logo: 'https://cdn.simpleicons.org/githubactions/2088FF', color: '#dddddd', bg: 'rgba(255,255,255,0.06)', level: 'expert' },
        { name: 'OpenAI', cat: 'ai', logo: 'https://img.icons8.com/color/96/chatgpt.png', color: '#10A37F', bg: 'rgba(16,163,127,0.12)', level: 'expert' },
        { name: 'Gemini AI', cat: 'ai', logo: 'https://cdn.simpleicons.org/googlegemini/4285F4', color: '#4285F4', bg: 'rgba(66,133,244,0.12)', level: 'advanced' },
        { name: 'Claude AI', cat: 'ai', logo: 'https://cdn.simpleicons.org/anthropic/191919', color: '#C77DFF', bg: 'rgba(199,125,255,0.12)', level: 'advanced' },
        { name: 'LangChain', cat: 'ai', logo: 'https://cdn.simpleicons.org/langchain/1C3C3C', color: '#64B4FF', bg: 'rgba(100,180,255,0.1)', level: 'advanced' },
        { name: 'TensorFlow', cat: 'ai', logo: 'https://cdn.simpleicons.org/tensorflow/FF6F00', color: '#FF6E00', bg: 'rgba(255,110,0,0.12)', level: 'expert' },
        { name: 'PyTorch', cat: 'ai', logo: 'https://cdn.simpleicons.org/pytorch/EE4C2C', color: '#EE4C2C', bg: 'rgba(238,76,44,0.11)', level: 'advanced' },
        { name: 'WordPress', cat: 'cms', logo: 'https://cdn.simpleicons.org/wordpress/21759B', color: '#21759B', bg: 'rgba(33,117,155,0.12)', level: 'expert' },
        { name: 'Shopify', cat: 'cms', logo: 'https://cdn.simpleicons.org/shopify/7AB55C', color: '#96BF48', bg: 'rgba(150,191,72,0.12)', level: 'expert' },
        { name: 'WooCommerce', cat: 'cms', logo: 'https://cdn.simpleicons.org/woocommerce/96588A', color: '#96588A', bg: 'rgba(150,88,138,0.12)', level: 'advanced' },
        { name: 'Webflow', cat: 'cms', logo: 'https://cdn.simpleicons.org/webflow/4353FF', color: '#4353FF', bg: 'rgba(67,83,255,0.12)', level: 'advanced' }
    ];

    let tsActiveTab = 'all';

    function tsSpawnParticles() {
        const wrap = document.getElementById('tsParticles');
        if (!wrap) return;
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'ts-particle';
            const size = Math.random() * 4 + 2;
            p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;animation-duration:${Math.random() * 18 + 14}s;animation-delay:${Math.random() * -22}s;opacity:${Math.random() * 0.5 + 0.1}`;
            wrap.appendChild(p);
        }
    }

    function tsRenderTabs() {
        const el = document.getElementById('tsTabs');
        if (!el) return;
        el.innerHTML = TS_CATS.map(c => `
            <button class="ts-tab${c.id === tsActiveTab ? ' active' : ''}" data-ts="${c.id}">
                <i class="${c.icon}"></i>${c.label}
            </button>
        `).join('');
        el.querySelectorAll('.ts-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                tsActiveTab = btn.dataset.ts;
                tsRenderTabs();
                tsRenderGrid();
            });
        });
    }

    function tsRenderGrid() {
        const el = document.getElementById('tsGrid');
        if (!el) return;
        const list = tsActiveTab === 'all' ? TS_TECHS : TS_TECHS.filter(t => t.cat === tsActiveTab);
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = '';
        el.innerHTML = list.map(t => `
            <div class="ts-card">
                <div class="ts-card-icon" style="background:${t.bg}">
                    <img src="${t.logo}" alt="${t.name}" class="tech-logo">
                </div>
                <span class="ts-card-name">${t.name}</span>
                <span class="ts-level ${t.level}">${t.level.charAt(0).toUpperCase() + t.level.slice(1)}</span>
            </div>
        `).join('');
    }

    tsSpawnParticles();
    tsRenderTabs();
    tsRenderGrid();

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.navbar-nav .nav-link');

    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + section.offsetHeight) {
                allNavLinks.forEach(link => link.classList.remove('active'));
                document.querySelector(`.navbar-nav .nav-link[href="#${id}"]`)?.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();

    // Footer year
    const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // Footer newsletter form
    const footerNlForm = document.getElementById('footerNlForm');
    const footerNlBtn = document.getElementById('footerNlBtn');
    if (footerNlForm) {
        footerNlForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!document.getElementById('footer-nl-email').value.trim()) return;
            footerNlBtn.disabled = true;
            footerNlBtn.innerHTML = `<i class="ri-loader-4-line"></i> Subscribing...`;
            setTimeout(() => {
                footerNlForm.reset();
                footerNlBtn.disabled = false;
                footerNlBtn.innerHTML = `<i class="ri-check-line"></i> Subscribed!`;
                setTimeout(() => {
                    footerNlBtn.innerHTML = `Subscribe <i class="ri-arrow-right-line icon-sm"></i>`;
                }, 3000);
            }, 1400);
        });
    }

    // Team carousel
    (function initTeamCarousel() {
        const track = document.getElementById('teamCarouselTrack');
        const dotsWrap = document.getElementById('tmDots');
        const btnPrev = document.getElementById('tmPrev');
        const btnNext = document.getElementById('tmNext');

        if (!track || !dotsWrap || !btnPrev || !btnNext) return;

        const cards = Array.from(track.querySelectorAll('.tm-card'));
        const totalCards = cards.length;

        function getVisible() {
            const w = window.innerWidth;
            if (w <= 575) return 1;
            if (w <= 991) return 2;
            if (w <= 1199) return 3;
            return 4;
        }

        let currentIndex = 0;
        let isDragging = false;
        let startX = 0;
        let dragDelta = 0;

        function buildDots() {
            dotsWrap.innerHTML = '';
            const visible = getVisible();
            const totalPages = Math.ceil(totalCards / visible);
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('button');
                dot.className = 'tm-dot' + (i === Math.floor(currentIndex / visible) ? ' active' : '');
                dot.setAttribute('aria-label', `Go to page ${i + 1}`);
                dot.addEventListener('click', () => goToPage(i));
                dotsWrap.appendChild(dot);
            }
        }

        function updateDots() {
            const visible = getVisible();
            const activePage = Math.floor(currentIndex / visible);
            dotsWrap.querySelectorAll('.tm-dot').forEach((d, i) => {
                d.classList.toggle('active', i === activePage);
            });
        }

        function getCardWidth() {
            if (!cards[0]) return 0;
            const rect = cards[0].getBoundingClientRect();
            const gap = parseFloat(getComputedStyle(track).gap) || 0;
            return rect.width + gap;
        }

        function applyTransform(extraPx = 0) {
            const offset = currentIndex * getCardWidth();
            track.style.transform = `translateX(${-(offset - extraPx)}px)`;
        }

        function clampIndex() {
            const visible = getVisible();
            const maxIndex = Math.max(0, totalCards - visible);
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        }

        function goTo(index) {
            currentIndex = index;
            clampIndex();
            applyTransform();
            updateDots();
            updateButtons();
        }

        function goToPage(page) {
            goTo(page * getVisible());
        }

        function updateButtons() {
            const visible = getVisible();
            const maxIndex = Math.max(0, totalCards - visible);
            btnPrev.disabled = currentIndex <= 0;
            btnNext.disabled = currentIndex >= maxIndex;
        }

        btnPrev.addEventListener('click', () => goTo(currentIndex - getVisible()));
        btnNext.addEventListener('click', () => goTo(currentIndex + getVisible()));

        function onDragStart(x) {
            isDragging = true;
            startX = x;
            dragDelta = 0;
            track.classList.add('is-dragging');
        }

        function onDragMove(x) {
            if (!isDragging) return;
            dragDelta = x - startX;
            applyTransform(dragDelta);
        }

        function onDragEnd() {
            if (!isDragging) return;
            isDragging = false;
            track.classList.remove('is-dragging');
            const threshold = getCardWidth() * 0.3;
            if (dragDelta < -threshold) goTo(currentIndex + 1);
            else if (dragDelta > threshold) goTo(currentIndex - 1);
            else goTo(currentIndex);
        }

        track.addEventListener('mousedown', e => onDragStart(e.clientX));
        window.addEventListener('mousemove', e => onDragMove(e.clientX));
        window.addEventListener('mouseup', onDragEnd);

        track.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchmove', e => onDragMove(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchend', onDragEnd);

        track.addEventListener('click', e => {
            if (Math.abs(dragDelta) > 5) e.preventDefault();
        });

        document.addEventListener('keydown', e => {
            const section = document.getElementById('Our_Team');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;
            if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
            if (e.key === 'ArrowRight') goTo(currentIndex + 1);
        });

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = parseInt(entry.target.dataset.tm, 10) || 0;
                    setTimeout(() => entry.target.classList.add('tm-visible'), idx * 90);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        cards.forEach(card => cardObserver.observe(card));

        const teamCtaCard = document.querySelector('.team-cta-card');
        if (teamCtaCard) {
            teamCtaCard.style.cssText += 'opacity:0;transform:translateY(28px);transition:opacity 0.65s ease,transform 0.65s ease';
            new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.2 }).observe(teamCtaCard);
        }

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                clampIndex();
                applyTransform();
                buildDots();
                updateButtons();
            }, 120);
        });

        buildDots();
        updateButtons();
        applyTransform();
    })();

    // Footer fade-in
    const footerEl = document.getElementById('mainFooter');
    if (footerEl) {
        footerEl.style.cssText += 'opacity:0;transform:translateY(20px);transition:opacity 0.7s ease,transform 0.7s ease';
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.05 }).observe(footerEl);
    }

    // Who We Are scroll reveal
    const wwaTargets = ['.wwa-visual', '.wwa-content', '.wwa-stats-row', '.wwa-cta-group']
        .map(s => document.querySelector(s)).filter(Boolean);
    if (wwaTargets.length) {
        const wwaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('wwa-revealed');
                    wwaObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        wwaTargets.forEach(el => wwaObserver.observe(el));
    }

    // WWA feature checklist staggered reveal
    const wwaFeats = document.querySelectorAll('.wwa-feat');
    if (wwaFeats.length) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    wwaFeats.forEach((feat, i) => setTimeout(() => feat.classList.add('revealed'), i * 120));
                }
            });
        }, { threshold: 0.2 }).observe(wwaFeats[0]);
    }

    // WWA stats counter
    const wwaStatNums = document.querySelectorAll('.wwa-stat-num');
    if (wwaStatNums.length) {
        const wwaCounterTargets = [200, 150, 15];
        let wwaCounterStarted = false;
        const wwaStatsRowEl = document.querySelector('.wwa-stats-row');
        if (wwaStatsRowEl) {
            new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !wwaCounterStarted) {
                        wwaCounterStarted = true;
                        wwaStatNums.forEach((el, i) => {
                            const target = wwaCounterTargets[i];
                            const textNode = el.firstChild;
                            let start = 0;
                            const step = target / (1400 / 16);
                            function tick() {
                                start += step;
                                if (start >= target) { if (textNode?.nodeType === Node.TEXT_NODE) textNode.textContent = target; return; }
                                if (textNode?.nodeType === Node.TEXT_NODE) textNode.textContent = Math.floor(start);
                                requestAnimationFrame(tick);
                            }
                            setTimeout(() => requestAnimationFrame(tick), i * 150);
                        });
                    }
                });
            }, { threshold: 0.3 }).observe(wwaStatsRowEl);
        }
    }

    // Achievements counter
    const counterNumbers = document.querySelectorAll('.counter-number');
    if (counterNumbers.length) {
        let achieveStarted = false;
        const achievementsSection = document.querySelector('.achievements');
        if (achievementsSection) {
            new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !achieveStarted) {
                        achieveStarted = true;
                        counterNumbers.forEach((el, i) => {
                            setTimeout(() => animateCounter(el, parseInt(el.dataset.target, 10), '', 1600), i * 150);
                        });
                    }
                });
            }, { threshold: 0.3 }).observe(achievementsSection);
        }
    }

    // Core values reveal
    const cvItems = document.querySelectorAll('.cv-item');
    if (cvItems.length) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cvItems.forEach((item, i) => setTimeout(() => item.classList.add('revealed'), i * 100));
                }
            });
        }, { threshold: 0.15 }).observe(cvItems[0]);
    }

    // Mission/Vision cards reveal
    const mvCards = document.querySelectorAll('.mv-card');
    if (mvCards.length) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mvCards.forEach((card, i) => setTimeout(() => card.classList.add('revealed'), i * 150));
                }
            });
        }, { threshold: 0.15 }).observe(mvCards[0]);
    }

    // Counter cards reveal
    const counterCards = document.querySelectorAll('.counter-card');
    if (counterCards.length) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counterCards.forEach((card, i) => setTimeout(() => card.classList.add('revealed'), i * 100));
                }
            });
        }, { threshold: 0.2 }).observe(counterCards[0]);
    }

    // EmailJS init
    emailjs.init({ publicKey: "M5DZ7OJElb66ZDa2Q" });

    // Contact form
    const contactForm = document.getElementById('contactForm');
    const sendBtn = document.getElementById('sendBtn') || document.getElementById('contactSubmitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('cont-name')?.value.trim();
            const email = document.getElementById('cont-email')?.value.trim();
            const service = document.getElementById('cont-service')?.value;
            const message = document.getElementById('cont-message')?.value.trim();
            const agree = document.getElementById('cont-agree')?.checked;

            if (!name || !email || !message) {
                showToast('Please fill in all required fields.', true);
                return;
            }
            if (agree === false) {
                showToast('Please accept the Privacy Policy to continue.', true);
                return;
            }

            sendBtn.disabled = true;
            sendBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Sending...';

            emailjs.sendForm('service_i9fkb7r', 'template_dkxoasr', contactForm)
                .then(() => {
                    contactForm.reset();
                    showToast('Message sent successfully! We\'ll be in touch within 24 hours.');
                    sendBtn.innerHTML = '<i class="ri-check-line"></i> Message Sent';
                    setTimeout(() => {
                        sendBtn.disabled = false;
                        sendBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Send Message';
                    }, 2500);
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    sendBtn.disabled = false;
                    sendBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Send Message';
                    showToast('Failed to send message. Please try again.', true);
                });
        });
    }

    // FAQ toggle
    window.toggleFaq = function (btn) {
        const item = btn.closest('.cont-faq-item');
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.cont-faq-item.active').forEach(el => el.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    };

    // ── Careers ──────────────────────────────────────────────────────────────

    // Perk cards reveal
    const perkCards = document.querySelectorAll('.perk-card');
    if (perkCards.length) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    perkCards.forEach((card, i) => setTimeout(() => card.classList.add('revealed'), i * 90));
                }
            });
        }, { threshold: 0.15 }).observe(perkCards[0]);
    }

    // Course cards reveal
    const jobCards = document.querySelectorAll('.job-card');
    if (jobCards.length) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    jobCards.forEach((card, i) => setTimeout(() => card.classList.add('revealed'), i * 80));
                }
            });
        }, { threshold: 0.1 }).observe(jobCards[0]);
    }

    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    if (filterTabs.length) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.dataset.filter;
                document.querySelectorAll('.job-card').forEach(card => {
                    card.style.display =
                        (filter === 'all' || (card.dataset.category || '').includes(filter)) ? '' : 'none';
                });
            });
        });
    }

    // Enroll modal
    const enrollModal = document.getElementById('enrollModal');
    if (enrollModal) {
        enrollModal.addEventListener('show.bs.modal', (e) => {
            const trigger = e.relatedTarget;
            const course = trigger?.dataset.course || 'Course';
            const price = trigger?.dataset.price || '—';
            const duration = trigger?.dataset.duration || '—';

            const nameEl = document.getElementById('enrollCourseName');
            if (nameEl) nameEl.textContent = course;

            const bannerName = document.getElementById('enrollBannerName');
            const bannerDur = document.getElementById('enrollBannerDuration');
            const bannerPrc = document.getElementById('enrollBannerPrice');
            if (bannerName) bannerName.textContent = course;
            if (bannerDur) bannerDur.textContent = duration;
            if (bannerPrc) bannerPrc.textContent = price;

            const inputCourse = document.getElementById('enrollCourseInput');
            const inputPrice = document.getElementById('enrollPriceInput');
            const inputDuration = document.getElementById('enrollDurationInput');
            if (inputCourse) inputCourse.value = course;
            if (inputPrice) inputPrice.value = price;
            if (inputDuration) inputDuration.value = duration;
        });
    }

    // Enroll form submit
    const enrollForm = document.getElementById('enrollForm');
    const enrollSubmitBtn = document.getElementById('enrollSubmitBtn');

    if (enrollForm) {
        enrollForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const firstName = enrollForm.querySelector('[name="first_name"]')?.value.trim();
            const email = enrollForm.querySelector('[name="email"]')?.value.trim();
            const phone = enrollForm.querySelector('[name="phone"]')?.value.trim();

            if (!firstName || !email || !phone) {
                if (typeof showToast === 'function') showToast('Please fill in your name, email and phone number.', true);
                return;
            }

            enrollSubmitBtn.disabled = true;
            enrollSubmitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Submitting...';

            const params = {
                first_name: enrollForm.querySelector('[name="first_name"]').value,
                last_name: enrollForm.querySelector('[name="last_name"]')?.value || '',
                email: enrollForm.querySelector('[name="email"]').value,
                phone: enrollForm.querySelector('[name="phone"]').value,
                course_name: enrollForm.querySelector('[name="course_name"]')?.value || '',
                course_price: enrollForm.querySelector('[name="course_price"]')?.value || '',
                course_duration: enrollForm.querySelector('[name="course_duration"]')?.value || '',
                education: enrollForm.querySelector('[name="education"]')?.value || '',
                experience_level: enrollForm.querySelector('[name="experience_level"]')?.value || '',
                message: enrollForm.querySelector('[name="message"]')?.value || ''
            };

            emailjs.send('service_i9fkb7r', 'template_enroll01', params)
                .then(() => {
                    enrollForm.reset();
                    enrollSubmitBtn.innerHTML = '<i class="ri-check-line"></i> Enrolled!';
                    if (typeof showToast === 'function') showToast('Enrollment successful! We will contact you shortly.');
                    setTimeout(() => {
                        enrollSubmitBtn.disabled = false;
                        enrollSubmitBtn.innerHTML = '<i class="ri-shopping-cart-line"></i> Enroll Now';
                        const modal = bootstrap.Modal.getInstance(document.getElementById('enrollModal'));
                        if (modal) modal.hide();
                    }, 2200);
                })
                .catch((error) => {
                    console.error('Enroll Form Error:', error);
                    enrollSubmitBtn.disabled = false;
                    enrollSubmitBtn.innerHTML = '<i class="ri-shopping-cart-line"></i> Enroll Now';
                    if (typeof showToast === 'function') showToast('Enrollment failed. Please try again.', true);
                });
        });
    }
});
