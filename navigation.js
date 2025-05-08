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
    
    // Initialize the Tableau visualization
    function navigateToPage(page) {
        const url = "https://public.tableau.com/views/LUNGevityProjectPRIORITYDashboard/" + encodeURIComponent(page);
        
        if (window.viz) {
            window.viz.dispose();
        }
        
        const vizDiv = document.getElementById("viz1745364540836");
        const options = {
            hideTabs: false,
            hideToolbar: false,
            width: '100%',
            height: '100%',
            onFirstInteractive: function() {
                if (window.viz) {
                    const workbook = window.viz.getWorkbook();
                    const currentSheet = workbook.getActiveSheet();
                    const sheetName = currentSheet.getName();
                    
                    // Get the normalized sheet name and info
                    const normalizedSheetName = window.normalizeSheetName(sheetName);
                    const sheetInfo = window.sheetToIndex[normalizedSheetName];
                    
                    if (sheetInfo) {
                        // Update navigation state with the original sheet name
                        updateNavigationState(sheetInfo.originalName);
                        
                        // Set dashboard height for the new sheet
                        if (window.setDashboardHeight) {
                            window.setDashboardHeight(sheetInfo.originalName);
                            setTimeout(() => window.setDashboardHeight(sheetInfo.originalName), 500);
                        }
                    } else {
                        updateNavigationState(sheetName);
                    }
                    
                    // Set up tab switch listener after menu navigation
                    if (window.setupTabSwitchListener) {
                        window.setupTabSwitchListener();
                    }
                    
                    // Trigger resize handling after a short delay
                    setTimeout(() => {
                        if (window.handleResize) {
                            window.handleResize();
                        }
                    }, 100);
                }
            }
        };
        
        window.viz = new tableau.Viz(vizDiv, url, options);
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
        
        try {
            // Get sheet info for the current index
            const currentSheetInfo = Object.values(window.sheetToIndex).find(info => info.index === currentIndex);
            
            // Update previous button text
            if (currentIndex > 0) {
                const prevSheetInfo = Object.values(window.sheetToIndex).find(info => info.index === currentIndex - 1);
                if (prevSheetInfo) {
                    prevButtonText.textContent = items[currentIndex - 1].textContent;
                } else {
                    prevButtonText.textContent = items[currentIndex - 1].textContent;
                }
            } else {
                prevButtonText.textContent = '';
            }
            
            // Update next button text
            if (currentIndex < items.length - 1) {
                const nextSheetInfo = Object.values(window.sheetToIndex).find(info => info.index === currentIndex + 1);
                if (nextSheetInfo) {
                    nextButtonText.textContent = items[currentIndex + 1].textContent;
                } else {
                    nextButtonText.textContent = items[currentIndex + 1].textContent;
                }
            } else {
                nextButtonText.textContent = '';
            }
        } catch (error) {
            console.error("Error updating navigation button texts:", error);
            // Fallback to using menu item texts
            if (currentIndex > 0) {
                prevButtonText.textContent = items[currentIndex - 1].textContent;
            } else {
                prevButtonText.textContent = '';
            }
            
            if (currentIndex < items.length - 1) {
                nextButtonText.textContent = items[currentIndex + 1].textContent;
            } else {
                nextButtonText.textContent = '';
            }
        }
    }

    // Navigate to a specific page index
    function navigateToPageIndex(index) {
        const items = Array.from(menuItems);
        if (index >= 0 && index < items.length) {
            // Get the sheet name from the mapping
            const sheetInfo = Object.values(window.sheetToIndex).find(info => info.index === index);
            if (sheetInfo) {
                // Use the global navigation function with the original sheet name
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
            const page = this.getAttribute('data-page');
            navigateToPage(page);
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
        // Use the global mapping and normalization function
        const normalizedSheetName = window.normalizeSheetName(sheetName);
        const sheetInfo = window.sheetToIndex[normalizedSheetName];
        
        if (sheetInfo) {
            // Update the navigation state
            updateNavigationIndex(sheetInfo.index);
        } else {
            // Default to Home if sheet name is unknown
            updateNavigationIndex(0);
        }
    }

    // Function to update navigation state based on index
    function updateNavigationIndex(index) {
        try {
            // Update the active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            menuItems[index].classList.add('active');
            
            // Update navigation buttons
            updateNavigationButtons();
            
            // Update button texts
            updateNavigationButtonTexts();
        } catch (error) {
            console.error("Error updating navigation index:", error);
        }
    }

    // Make updateNavigationIndex available globally
    window.updateNavigationIndex = updateNavigationIndex;

    // Function to navigate to a specific sheet by name
    function navigateToSheet(sheetName) {
        // Get the sheet info from the mapping
        const normalizedSheetName = window.normalizeSheetName(sheetName);
        const sheetInfo = window.sheetToIndex[normalizedSheetName];
        
        if (sheetInfo) {
            // Navigate to the sheet in Tableau using the original name
            if (window.viz) {
                const workbook = window.viz.getWorkbook();
                workbook.activateSheetAsync(sheetInfo.originalName).then(() => {
                    // Update the navigation state
                    updateNavigationState(sheetInfo.originalName);
                    // Set dashboard height for the new sheet
                    if (window.setDashboardHeight) {
                        window.setDashboardHeight(sheetInfo.originalName);
                    }
                    
                    // Trigger resize handling after a short delay to ensure viz is fully rendered
                    setTimeout(() => {
                        if (window.handleResize) {
                            window.handleResize();
                        }
                    }, 100);
                }).catch(error => {
                    console.error("Error activating sheet:", error);
                });
            }
        }
    }

    function onNavigationMenuClick(sheetName) {
        if (window.viz) {
            const workbook = window.viz.getWorkbook();
            workbook.activateSheetAsync(sheetName).then(() => {
                // Only after the sheet is switched, update navigation state and height
                updateNavigationState(sheetName);
                if (window.setDashboardHeight) {
                    window.setDashboardHeight(sheetName);
                    setTimeout(() => window.setDashboardHeight(sheetName), 500);
                }
            });
        }
    }
}); 