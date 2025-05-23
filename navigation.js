// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all the necessary elements
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('.nav-menu');
    const closeButton = document.querySelector('.close-button');
    const menuItems = document.querySelectorAll('.nav-menu-item');
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const prevButtonText = document.querySelector('.nav-button-text.prev');
    const nextButtonText = document.querySelector('.nav-button-text.next');
    
    // Get the current page index
    function getCurrentPageIndex() {
        const activeItem = document.querySelector('.nav-menu-item.active');
        const items = Array.from(menuItems);
        return items.indexOf(activeItem);
    }

    // Update navigation button texts
    function updateNavigationButtonTexts() {
        const currentIndex = getCurrentPageIndex();
        const items = Array.from(menuItems);
        
        // Update previous button text
        prevButtonText.textContent = currentIndex > 0 ? items[currentIndex - 1].textContent : '';
        
        // Update next button text
        nextButtonText.textContent = currentIndex < items.length - 1 ? items[currentIndex + 1].textContent : '';
    }

    // Navigate to a specific page index
    function navigateToPageIndex(index) {
        const items = Array.from(menuItems);
        if (index >= 0 && index < items.length) {
            const sheetInfo = Object.values(window.sheetToIndex).find(info => info.index === index);
            if (sheetInfo) {
                window.navigateToSheet(sheetInfo.originalName);
            }
        }
    }

    // Handle previous button click
    prevButton.addEventListener('click', function() {
        const currentIndex = getCurrentPageIndex();
        navigateToPageIndex(currentIndex - 1);
        updateNavigationButtons();
    });

    // Handle next button click
    nextButton.addEventListener('click', function() {
        const currentIndex = getCurrentPageIndex();
        navigateToPageIndex(currentIndex + 1);
        updateNavigationButtons();
    });

    // Update navigation buttons visibility
    function updateNavigationButtons() {
        const currentIndex = getCurrentPageIndex();
        
        // Update previous button visibility
        const prevVisible = currentIndex > 0;
        prevButton.style.visibility = prevVisible ? 'visible' : 'hidden';
        prevButtonText.style.visibility = prevVisible ? 'visible' : 'hidden';
        
        // Update next button visibility
        const nextVisible = currentIndex < menuItems.length - 1;
        nextButton.style.visibility = nextVisible ? 'visible' : 'hidden';
        nextButtonText.style.visibility = nextVisible ? 'visible' : 'hidden';
        
        updateNavigationButtonTexts();
    }

    // Initialize navigation buttons
    updateNavigationButtons();

    // Toggle menu
    menuIcon.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Close menu
    closeButton.addEventListener('click', function() {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !menuIcon.contains(event.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const index = Array.from(menuItems).indexOf(this);
            navigateToPageIndex(index);
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            updateNavigationButtons();
        });
    });

    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const currentIndex = getCurrentPageIndex();
            if (e.key === 'ArrowLeft') {
                navigateToPageIndex(currentIndex - 1);
            } else {
                navigateToPageIndex(currentIndex + 1);
            }
            updateNavigationButtons();
        }
    });

    // Function to update navigation state based on sheet name
    function updateNavigationState(sheetName) {
        const normalizedName = window.normalizeSheetName(sheetName);
        const sheetInfo = window.sheetToIndex[normalizedName];
        
        if (sheetInfo) {
            const menuItem = Array.from(menuItems).find(item => 
                item.getAttribute('data-page') === sheetInfo.page
            );
            
            if (menuItem) {
                menuItems.forEach(item => item.classList.remove('active'));
                menuItem.classList.add('active');
                updateNavigationButtons();
            }
        }
    }

    // Make functions available globally
    window.updateNavigationState = updateNavigationState;
}); 