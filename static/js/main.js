(function() {
    // Кнопка прокрутки вверх
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
        window.addEventListener('scroll', function() {
            scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Модальное окно
    const modal = document.getElementById('tagModal');
    const modalClose = document.getElementById('modalClose');
    
    function showModal() {
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    
    // Открытие модального окна для всех кнопок
    document.querySelectorAll('.tag-more, .stat-badge, .preview-stat, .tag').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showModal();
        });
    });
    
    // Фильтрация по тегам (только на страницах с research-card)
    let activeTag = null;
    const researchCards = document.querySelectorAll('.research-card');
    const tagLinks = document.querySelectorAll('.tag-link');
    const container = document.getElementById('researchContainer');
    
    function filterByTag(tag) {
        let visibleCount = 0;
        researchCards.forEach(card => {
            const cardTagsJson = card.getAttribute('data-tags');
            if (!cardTagsJson) {
                if (!tag) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
                return;
            }
            try {
                const tagsArray = JSON.parse(cardTagsJson);
                if (!tag || tagsArray.includes(tag)) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            } catch(e) {
                if (!tag) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            }
        });
        
        // Подсветка активного тега
        tagLinks.forEach(link => {
            const linkTag = link.textContent.trim();
            if (linkTag === tag) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Информация о фильтре
        let filterInfo = document.querySelector('.active-filter-info');
        if (!filterInfo && container && container.parentNode) {
            filterInfo = document.createElement('div');
            filterInfo.className = 'active-filter-info';
            container.parentNode.insertBefore(filterInfo, container);
        }
        if (filterInfo) {
            if (tag) {
                filterInfo.innerHTML = 'Показаны исследования по тегу "' + tag + '" <a href="#" id="clearFilter" style="margin-left: 0.5rem;">(сбросить)</a>';
                const clearLink = document.getElementById('clearFilter');
                if (clearLink) {
                    clearLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        filterByTag(null);
                        activeTag = null;
                    });
                }
            } else {
                filterInfo.innerHTML = '';
            }
        }
        
        // Сообщение "не найдено"
        let noResultsMsg = document.querySelector('.no-results-message');
        if (visibleCount === 0 && researchCards.length > 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.innerHTML = 'Исследований с таким тегом не найдено';
                if (container && container.parentNode) {
                    container.parentNode.insertBefore(noResultsMsg, container.nextSibling);
                }
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
    
    // Навигация по якорям
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const hash = this.getAttribute('href');
            if (hash && hash !== '#') {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    history.pushState(null, null, hash);
                }
            }
        });
    });
    
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(function() {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
    
    // Обработчики для тегов
    if (tagLinks.length > 0) {
        tagLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const tag = this.textContent.trim();
                if (tag) {
                    if (activeTag === tag) {
                        filterByTag(null);
                        activeTag = null;
                    } else {
                        filterByTag(tag);
                        activeTag = tag;
                    }
                }
            });
        });
    }
})();