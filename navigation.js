// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Get all the necessary elements
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('.nav-menu');
    const closeButton = document.querySelector('.close-button');
    const menuItems = document.querySelectorAll('.nav-menu-item');
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const prevButtonText = document.querySelector('.nav-button-text.prev');
    const nextButtonText = document.querySelector('.nav-button-text.next');
    
    let viz; // Variable to store the Tableau viz object

    // Initialize the Tableau visualization
    function initializeViz(page = 'Home') {
        const containerDiv = document.getElementById("viz1745364540836");
        const url = "https://public.tableau.com/views/LUNGevityProjectPRIORITYDashboard/" + encodeURIComponent(page);
        const options = {
            hideTabs: false,
            hideToolbar: false,
            device: window.innerWidth <= 576 ? 'phone' : 'desktop',
            height: '100%',
            width: '100%'
        };
        
        if (viz) {
            viz.dispose();
        }
        
        viz = new tableau.Viz(containerDiv, url, options);
    }

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
        if (currentIndex > 0) {
            prevButtonText.textContent = items[currentIndex - 1].textContent;
        } else {
            prevButtonText.textContent = '';
        }
        
        // Update next button text
        if (currentIndex < items.length - 1) {
            nextButtonText.textContent = items[currentIndex + 1].textContent;
        } else {
            nextButtonText.textContent = '';
        }
    }

    // Navigate to a specific page index
    function navigateToPage(index) {
        const items = Array.from(menuItems);
        if (index >= 0 && index < items.length) {
            items.forEach(i => i.classList.remove('active'));
            items[index].classList.add('active');
            const page = items[index].getAttribute('data-page');
            initializeViz(page);
            updateNavigationButtonTexts();
        }
    }

    // Handle previous button click
    prevButton.addEventListener('click', function() {
        const currentIndex = getCurrentPageIndex();
        navigateToPage(currentIndex - 1);
        updateNavigationButtons();
    });

    // Handle next button click
    nextButton.addEventListener('click', function() {
        const currentIndex = getCurrentPageIndex();
        navigateToPage(currentIndex + 1);
        updateNavigationButtons();
    });

    // Update navigation buttons visibility
    function updateNavigationButtons() {
        const currentIndex = getCurrentPageIndex();
        if (currentIndex <= 0) {
            prevButton.style.visibility = 'hidden';
            prevButtonText.style.visibility = 'hidden';
        } else {
            prevButton.style.visibility = 'visible';
            prevButtonText.style.visibility = 'visible';
        }
        
        if (currentIndex >= menuItems.length - 1) {
            nextButton.style.visibility = 'hidden';
            nextButtonText.style.visibility = 'hidden';
        } else {
            nextButton.style.visibility = 'visible';
            nextButtonText.style.visibility = 'visible';
        }
        updateNavigationButtonTexts();
    }

    // Initialize the visualization when the page loads
    initializeViz();
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
            const page = this.getAttribute('data-page');
            initializeViz(page);
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
                navigateToPage(currentIndex - 1);
            } else {
                navigateToPage(currentIndex + 1);
            }
            updateNavigationButtons();
        }
    });
}); 