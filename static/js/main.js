(function() {
    // ===== МОДАЛЬНОЕ ОКНО =====
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
    
    // Открытие модалки при клике на бейджи статистики и теги
    document.querySelectorAll('.stat-badge, .preview-stat, .tag-more').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showModal();
        });
    });
    
    // ===== ФИЛЬТРАЦИЯ ПО ТЕГАМ =====
    const researchCards = document.querySelectorAll('.research-card');
    const tagLinks = document.querySelectorAll('.tag-link');
    const container = document.getElementById('researchContainer');
    let activeTag = null;
    
    function filterByTag(tag) {
        let visibleCount = 0;
        
        researchCards.forEach(card => {
            const cardTagsJson = card.getAttribute('data-tags');
            if (!cardTagsJson) {
                card.classList.toggle('hidden', tag !== null);
                if (!tag) visibleCount++;
                return;
            }
            
            try {
                const tagsArray = JSON.parse(cardTagsJson);
                const shouldHide = tag !== null && !tagsArray.includes(tag);
                card.classList.toggle('hidden', shouldHide);
                if (!shouldHide) visibleCount++;
            } catch(e) {
                card.classList.toggle('hidden', tag !== null);
                if (!tag) visibleCount++;
            }
        });
        
        // Подсветка активного тега
        tagLinks.forEach(link => {
            const linkTag = link.textContent.trim();
            link.classList.toggle('active', linkTag === tag);
        });
        
        // Показываем/скрываем сообщение "не найдено"
        let noResultsMsg = document.querySelector('.no-results-message');
        if (visibleCount === 0 && researchCards.length > 0 && tag) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.innerHTML = '📭 Исследований с таким тегом не найдено';
                if (container && container.parentNode) {
                    container.parentNode.insertBefore(noResultsMsg, container.nextSibling);
                }
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
    
    // Вешаем обработчики на теги
    tagLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tag = this.textContent.trim();
            
            if (activeTag === tag) {
                // Сброс фильтра
                filterByTag(null);
                activeTag = null;
            } else {
                // Применяем фильтр
                filterByTag(tag);
                activeTag = tag;
            }
        });
    });
    
    console.log('✅ Фильтрация тегов работает');
})();