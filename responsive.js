// Configuration
const CONFIG = {
    DEFAULT_WIDTH: 1366,
    DEFAULT_HEIGHT: 818, // Updated to match the height in the embed code
    MAX_WIDTH: 1920, // Maximum width for desktop
    MIN_WIDTH: 800,  // Minimum width before switching to mobile
    ASPECT_RATIO: 1366/818, // Using the actual aspect ratio from the embed code
    MOBILE_BREAKPOINT: 768,
    WINDOW_PERCENTAGE: 0.90, // Use 90% of window width
    HEIGHT_PERCENTAGE: 0.90  // Use 90% of window height
};

// Get DOM elements
let vizContainer;
let vizObject;

// Initialize DOM elements
function initElements() {
    vizContainer = document.getElementById('viz1745364540836');
    if (!vizContainer) {
        console.error('Visualization container not found');
        return false;
    }
    
    vizObject = vizContainer.getElementsByTagName('object')[0];
    if (!vizObject) {
        console.error('Visualization object not found');
        return false;
    }
    
    return true;
}

// Calculate dimensions while maintaining aspect ratio
function calculateDimensions(width) {
    const height = Math.round(width / CONFIG.ASPECT_RATIO);
    return { width, height };
}

// Check if device is mobile
function isMobile() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
}

// Handle resize for desktop
function handleDesktopResize() {
    // Calculate available width (90% of window width)
    const availableWidth = Math.floor(window.innerWidth * CONFIG.WINDOW_PERCENTAGE);
    
    // Calculate available height (90% of window height)
    const availableHeight = Math.floor(window.innerHeight * CONFIG.HEIGHT_PERCENTAGE);
    
    let dimensions;

    if (availableWidth >= CONFIG.MAX_WIDTH) {
        // Use maximum allowed size
        dimensions = calculateDimensions(CONFIG.MAX_WIDTH);
    } else if (availableWidth >= CONFIG.DEFAULT_WIDTH) {
        // Scale up from default size
        dimensions = calculateDimensions(availableWidth);
    } else if (availableWidth >= CONFIG.MIN_WIDTH) {
        // Scale down from default size
        dimensions = calculateDimensions(availableWidth);
    } else {
        // Switch to mobile view
        handleMobileResize();
        return;
    }
    
    // Adjust height if needed to fit within available height
    if (dimensions.height > availableHeight) {
        dimensions.height = availableHeight;
        dimensions.width = Math.round(dimensions.height * CONFIG.ASPECT_RATIO);
    }

    applyDimensions(dimensions);
}

// Handle resize for mobile
function handleMobileResize() {
    // For mobile, use 90% of window width
    const mobileWidth = Math.floor(window.innerWidth * CONFIG.WINDOW_PERCENTAGE);
    
    // For mobile, use 90% of window height
    const mobileHeight = Math.floor(window.innerHeight * CONFIG.HEIGHT_PERCENTAGE);
    
    vizObject.style.width = `${mobileWidth}px`;
    vizObject.style.height = `${mobileHeight}px`;
}

// Apply dimensions to the visualization
function applyDimensions(dimensions) {
    vizObject.style.width = `${dimensions.width}px`;
    vizObject.style.height = `${dimensions.height}px`;
    
    // Force Tableau to resize the visualization
    if (window.viz && typeof window.viz.resize === 'function') {
        window.viz.resize();
    }
}

// Main resize handler
function handleResize() {
    if (!vizObject) {
        if (!initElements()) return;
    }
    
    if (isMobile()) {
        handleMobileResize();
    } else {
        handleDesktopResize();
    }
}

// Initialize Tableau Viz
function initTableauViz() {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    vizObject.parentNode.insertBefore(scriptElement, vizObject);
    
    // Add a listener for when the Tableau API is loaded
    scriptElement.onload = function() {
        // Wait a bit for Tableau to initialize
        setTimeout(() => {
            // Try to get the viz object from the global scope
            if (window.viz) {
                console.log('Tableau viz object found');
            } else {
                console.log('Tableau viz object not found in global scope');
            }
        }, 1000);
    };
}

// Initialize
function init() {
    // Initialize DOM elements
    if (!initElements()) return;
    
    // Initial resize
    handleResize();

    // Add resize listener with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

    // Initialize Tableau
    initTableauViz();
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 