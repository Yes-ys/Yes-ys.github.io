document.addEventListener('DOMContentLoaded', function() {
    function updatePaginationEffects() {
        const containers = document.querySelectorAll('#recent-posts-paginator, #other-paginator, #paginator, .pagination');
        
        containers.forEach(container => {
            // Get only the page-number items (ignore next/prev for the fan effect calculation for now, 
            // or include them. Usually it's better to just fan the numbers)
            // But if we want consistent spacing, we treat them as items.
            // Let's stick to page-number items for the main fan effect to avoid weirdness with "Next" button becoming huge
            
            // Actually, let's include all children so indices match logical visual position
             const items = Array.from(container.children).filter(el => 
                el.classList.contains('page-number') || el.classList.contains('extend')
            );
            
            // Helper to apply classes
            const applyFan = (centerIndex) => {
                 items.forEach((item, index) => {
                    // Clear dist classes
                    item.classList.remove('pagination-dist-0', 'pagination-dist-1', 'pagination-dist-2', 'pagination-dist-3');
                    
                    // Don't apply fan scaling to Prev/Next buttons (they have their own CSS override)
                    // But we still calculate distance so the numbers *near* them fade out correctly?
                    // Actually, let's just calc distance. CSS !important handles prev/next override.
                    
                    const dist = Math.abs(index - centerIndex);
                    
                    if (dist === 0) {
                        item.classList.add('pagination-dist-0');
                    } else if (dist === 1) {
                        item.classList.add('pagination-dist-1');
                    } else if (dist === 2) {
                        item.classList.add('pagination-dist-2');
                    } else if (dist >= 3) {
                        item.classList.add('pagination-dist-3');
                    }
                });
            };

            // Find initial current page
            let initialCurrentIndex = items.findIndex(el => el.classList.contains('current'));
            // If no current page found (e.g. only prev/next?), default to middle or 0
            if (initialCurrentIndex === -1) {
                 // Try to guess or just 0
                 initialCurrentIndex = 0;
            }

            // Initial Apply
            applyFan(initialCurrentIndex);

            // Event Listeners
            items.forEach((item, index) => {
                // When entering an item, make IT the center
                item.addEventListener('mouseenter', () => {
                    applyFan(index);
                });
            });

            // When leaving the container, revert to the actual current page
            container.addEventListener('mouseleave', () => {
                applyFan(initialCurrentIndex);
            });
        });
    }

    updatePaginationEffects();
});
