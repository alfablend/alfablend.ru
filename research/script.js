
(function() {
    // Кнопка наверх
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });
        scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    
    // Модальное окно
    const modal = document.getElementById('tagModal');
    const modalClose = document.getElementById('modalClose');
    
    function showModal() {
        if (modal) modal.style.display = 'flex';
    }
    
    function closeModal() {
        if (modal) modal.style.display = 'none';
    }
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Обработчики для кнопок "+N еще"
    document.querySelectorAll('.tag-more').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
    });
    
    // Фильтрация по тегам
    let activeTag = null;
    const researchCards = document.querySelectorAll('.research-card:not(.callout-card)');
    const calloutCard = document.querySelector('.callout-card');
    const tagLinks = document.querySelectorAll('.tag-link');
    const container = document.getElementById('researchContainer');
    
    function filterByTag(tag) {
        researchCards.forEach(card => {
            const cardTagsJson = card.getAttribute('data-tags');
            if (!cardTagsJson) {
                if (!tag) card.classList.remove('hidden');
                else card.classList.add('hidden');
                return;
            }
            
            try {
                const tagsArray = JSON.parse(cardTagsJson);
                if (!tag || tagsArray.includes(tag)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            } catch(e) {
                console.error('Ошибка парсинга тегов:', e);
                if (!tag) card.classList.remove('hidden');
                else card.classList.add('hidden');
            }
        });
        
        tagLinks.forEach(link => {
            const linkTag = link.getAttribute('data-tag');
            if (linkTag === tag) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        let filterInfo = document.querySelector('.active-filter-info');
        if (!filterInfo) {
            filterInfo = document.createElement('div');
            filterInfo.className = 'active-filter-info';
            container.parentNode.insertBefore(filterInfo, container);
        }
        
        if (tag) {
            filterInfo.innerHTML = `🔍 Показаны исследования по тегу «${tag}» <a href="#" id="clearFilter" style="margin-left: 0.5rem;">(сбросить)</a>`;
            const clearLink = document.getElementById('clearFilter');
            if (clearLink) {
                clearLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    filterByTag(null);
                });
            }
        } else {
            filterInfo.innerHTML = '';
        }
        
        if (calloutCard && container.contains(calloutCard)) {
            container.appendChild(calloutCard);
        }
        
        document.querySelectorAll('.nav-list a').forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            const targetCard = document.getElementById(targetId);
            if (targetCard && targetCard.classList.contains('hidden')) {
                link.classList.add('hidden-link');
            } else if (targetCard) {
                link.classList.remove('hidden-link');
            }
        });
    }
    
    tagLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tag = link.getAttribute('data-tag');
            if (tag && activeTag === tag) {
                filterByTag(null);
                activeTag = null;
            } else {
                filterByTag(tag);
                activeTag = tag;
            }
        });
    });
    
    document.querySelectorAll('.nav-list a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target && !target.classList.contains('hidden')) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
})();
