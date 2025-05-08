let vizDiv,
  currentWidth,
  scalingFactor,
  mediaQuery,
  maxWidth,
  activeSheet,
  behaviour;

//set a breakpoint to switch between phone and desktop views.
const mediaQueryString = "(max-width: 576px)";

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to set up tab switch event listener
function setupTabSwitchListener() {
    if (!window.viz) {
        console.error("Viz not initialized!");
        return;
    }

    try {
        // Remove any existing listeners first
        window.viz.removeEventListener('tabswitch');
        
        // Add tab switch listener
        window.viz.addEventListener('tabswitch', function(event) {
            try {
                const oldSheetName = event.getOldSheetName();
                const newSheetName = event.getNewSheetName();
                
                // Get the normalized sheet name and info
                const normalizedSheetName = normalize(newSheetName);
                const sheetInfo = sheetToIndex[normalizedSheetName];
                
                if (sheetInfo) {
                    // Update navigation state with the original name
                    updateNavigationState(sheetInfo.originalName);
                    
                    // Trigger resize handling after a short delay
                    setTimeout(() => {
                        if (window.handleResize) {
                            window.handleResize();
                        }
                    }, 100);
                }
            } catch (error) {
                console.error("Error handling tab switch:", error);
            }
        });
    } catch (error) {
        console.error("Error setting up tab switch listener:", error);
    }
}

// Function to initialize sheet mapping
function initializeSheetMapping() {
    try {
        // Build normalized mapping once at startup
        const sheetToIndex = {};
        Object.entries(rawSheetToIndex).forEach(([originalName, info]) => {
            const normalizedName = normalize(originalName);
            sheetToIndex[normalizedName] = {
                ...info,
                originalName
            };
        });

        // Make the mapping available globally
        window.sheetToIndex = sheetToIndex;
        window.normalizeSheetName = normalize;
    } catch (error) {
        console.error("Error initializing sheet mapping:", error);
    }
}

// Function to be called when viz is ready
function ready() {
    if (!window.viz) {
        console.error("Viz not initialized!");
        return;
    }

    try {
        // Initialize sheet mapping if not already done
        if (!window.sheetToIndex) {
            initializeSheetMapping();
        }

        // Get the container
        vizDiv = document.getElementById("viz1745364540836");
        if (!vizDiv) {
            console.error("Viz container not found!");
            return;
        }

        // Get sheet info for scaling
        const workbook = window.viz.getWorkbook();
        activeSheet = workbook.getActiveSheet();

        // Set up media query
        mediaQuery = window.matchMedia(mediaQueryString);
        
        // Initial sizing and scaling
        handleResize();

        // Add resize listener
        window.addEventListener('resize', debounce(handleResize, 250));

        // Set up tab switch listener
        setupTabSwitchListener();

        // Check initial sheet
        checkCurrentSheet();
    } catch (error) {
        console.error("Error in ready function:", error);
    }
}

// Function to normalize sheet names
function normalize(name) {
  return name
    .replace(/\u00A0/g, ' ')  // turn NBSP into normal space
    .replace(/\s+/g, ' ')     // collapse runs of whitespace
    .trim()
    .toLowerCase();          // normalize case
}

// Raw mapping of sheet names to indices and pages
const rawSheetToIndex = {
  'Home': { index: 0, page: 'Home' },
  'Clinical Details': { index: 1, page: 'ClinicalDetails' },
  'Metastatic Locations': { index: 2, page: 'MetastaticLocations' },
  'Demographics': { index: 3, page: 'Demographics' },
  'Diagnostic Story': { index: 4, page: 'DiagnosticStory' },
  'Biomarker Testing': { index: 5, page: 'BiomarkerTesting' },
  'Tobacco Exposure': { index: 6, page: 'TobaccoExposure' },
  'Other Exposures': { index: 7, page: 'OtherExposures' },
  'Treatment 1and2': { index: 8, page: 'Treatment1and2' },
  'Treatment3': { index: 9, page: 'Treatment3' },
  'Treatment4': { index: 10, page: 'Treatment4' },
  'Side Effects': { index: 11, page: 'SideEffects' },
  'Clinical Trial': { index: 12, page: 'ClinicalTrial' },
  'Mental Health': { index: 13, page: 'MentalHealth' },
  'Care Team Support': { index: 14, page: 'CareTeamSupport' },
  'FAQ': { index: 15, page: 'FAQ' }
};

// Function to update navigation state based on sheet name
function updateNavigationState(sheetName) {
    // If sheetName is a number, it's already an index
    if (typeof sheetName === 'number') {
        // Update the navigation state in navigation.js
        if (window.updateNavigationIndex) {
            window.updateNavigationIndex(sheetName);
        }
        // At the end of the function, set dashboard height
        if (window.setDashboardHeight) {
            window.setDashboardHeight(sheetName);
            setTimeout(() => window.setDashboardHeight(sheetName), 500);
        }
        return;
    }
    
    // Normalize the incoming sheet name
    const normalizedSheetName = normalize(sheetName);
    
    // Get the index and page from the mapping using normalized name
    const sheetInfo = sheetToIndex[normalizedSheetName];
    
    if (sheetInfo) {
        // Update the navigation state in navigation.js
        if (window.updateNavigationIndex) {
            window.updateNavigationIndex(sheetInfo.index);
        }
        // At the end of the function, set dashboard height
        if (window.setDashboardHeight) {
            window.setDashboardHeight(sheetName);
            setTimeout(() => window.setDashboardHeight(sheetName), 500);
        }
    } else {
        // Default to Home if sheet name is unknown
        if (window.updateNavigationIndex) {
            window.updateNavigationIndex(0);
        }
        // At the end of the function, set dashboard height
        if (window.setDashboardHeight) {
            window.setDashboardHeight(sheetName);
            setTimeout(() => window.setDashboardHeight(sheetName), 500);
        }
    }
}

// Function to check current sheet
function checkCurrentSheet() {
    try {
        // Get the current URL of the viz
        const currentUrl = window.viz.getUrl();

        // Get the workbook and active sheet
        const workbook = window.viz.getWorkbook();
        const currentSheet = workbook.getActiveSheet();
        const sheetName = currentSheet.getName();

        // Update navigation state
        updateNavigationState(sheetName);
    } catch (error) {
        console.error("Error checking sheet:", error);
    }
}

// Handle window resize
function handleResize() {
    if (!window.viz) {
        console.error("Viz not initialized!");
        return;
    }

    try {
        currentWidth = vizDiv.offsetWidth;

        if (mediaQuery.matches) {
            if (window.viz.device === "desktop" || window.viz.device === "default") {
                window.viz.device = "phone";
            }
            scaleViz(currentWidth, "phone");
        } else {
            if (window.viz.device === "phone") {
                window.viz.device = "desktop";
            }
            scaleViz(currentWidth, "desktop");
        }
    } catch (error) {
        console.error("Error in handleResize:", error);
    }
}

// Make handleResize available globally
window.handleResize = handleResize;

// Scale the visualization
function scaleViz(currentWidth, deviceType) {
    try {
        // Use 45px header for mobile, 60px for desktop
        const isMobile = window.matchMedia("(max-width: 576px)").matches;
        const HEADER_HEIGHT = isMobile ? 45 : 60;
        const dashboardWidth = 1440;
        const dashboardHeight = 810;
        
        if (deviceType === "phone") {
            // For mobile: fit width, allow vertical scrolling for tall dashboards, and start below header
            vizDiv.style.width = "100vw";
            vizDiv.style.height = "auto";
            vizDiv.style.minHeight = "0";
            vizDiv.style.position = "static";
            vizDiv.style.top = null;
            vizDiv.style.left = null;
            vizDiv.style.overflow = "visible";
            vizDiv.style.background = "#f8f9fa";
            vizDiv.style.marginTop = "45px";

            // Update tableau-viz elements
            const elems = document.getElementsByTagName("tableau-viz");
            for (let i = 0; i < elems.length; i++) {
                elems[i].style.width = "100vw";
                elems[i].style.height = "auto";
                elems[i].style.minHeight = "0";
                elems[i].style.position = "static";
                elems[i].style.transform = "none";
            }

            // Update iframe if present
            const iframe = vizDiv.querySelector("iframe");
            if (iframe) {
                iframe.style.width = "100vw";
                iframe.style.height = "auto";
                iframe.style.minHeight = "0";
                iframe.style.border = "none";
                iframe.style.position = "static";
                iframe.style.transform = "none";
            }
        } else {
            // For desktop: maintain aspect ratio and scaling
            let scale, scaledWidth, scaledHeight, translateX, translateY;
            const containerWidth = vizDiv.offsetWidth;
            const containerHeight = window.innerHeight * 0.85;
            const scaleX = containerWidth / dashboardWidth;
            const scaleY = containerHeight / dashboardHeight;
            scale = Math.min(scaleX, scaleY);
            scaledWidth = dashboardWidth * scale;
            scaledHeight = dashboardHeight * scale;
            translateX = (containerWidth - scaledWidth) / 2;
            translateY = (containerHeight - scaledHeight) / 2;

            vizDiv.style.width = "100%";
            vizDiv.style.height = "100%";
            vizDiv.style.overflow = "hidden";
            vizDiv.style.position = "relative";
            vizDiv.style.marginTop = "0";

            // Update tableau-viz elements
            const elems = document.getElementsByTagName("tableau-viz");
            for (let i = 0; i < elems.length; i++) {
                elems[i].style.width = `${dashboardWidth}px`;
                elems[i].style.height = `${dashboardHeight}px`;
                elems[i].style.position = "absolute";
                elems[i].style.top = "0";
                elems[i].style.left = "0";
                elems[i].style.transformOrigin = "top left";
                elems[i].style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            }

            // Update iframe if present
            const iframe = vizDiv.querySelector("iframe");
            if (iframe) {
                iframe.style.width = `${dashboardWidth}px`;
                iframe.style.height = `${dashboardHeight}px`;
                iframe.style.border = "none";
                iframe.style.position = "absolute";
                iframe.style.top = "0";
                iframe.style.left = "0";
                iframe.style.transformOrigin = "top left";
                iframe.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            }
        }
    } catch (error) {
        console.error("Error in scaleViz:", error);
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait for viz to be ready
});

// Function to navigate to a specific sheet by name
function navigateToSheet(sheetName) {
    // Get the sheet info from the mapping
    const normalizedSheetName = normalize(sheetName);
    const sheetInfo = sheetToIndex[normalizedSheetName];
    
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

// Make the navigation functions available globally
window.navigateToSheet = navigateToSheet;

// Make setupTabSwitchListener available globally
window.setupTabSwitchListener = setupTabSwitchListener;

// Make initializeSheetMapping available globally
window.initializeSheetMapping = initializeSheetMapping;

// Mapping of sheet names to their required heights (in px)
const sheetHeights = {
  'Home': 1500,
  'Clinical Details': 2500,
  'Metastatic Locations': 2640,
  'Demographics': 2640,
  'Diagnostic Story': 2640,
  'Biomarker Testing': 2640,
  'Tobacco Exposure': 2640,
  'Other Exposures': 2640,
  'Treatment 1and2': 2640,
  'Treatment3': 2640,
  'Treatment4': 2640,
  'Side Effects': 2640,
  'Clinical Trial': 2640,
  'Mental Health': 2640,
  'Care Team Support': 2640,
  'FAQ': 2640
};

// Helper to set style with !important
function setImportantStyle(element, style, value) {
    if (element) {
        element.style.setProperty(style, value, 'important');
    }
}

// MutationObserver to enforce height
let heightObserver = null;

function enforceDashboardHeight(sheetName) {
    const isMobile = window.matchMedia("(max-width: 576px)").matches;
    if (!isMobile) return;
    const height = sheetHeights[sheetName] || 2640;
    const minHeight = `calc(100vh - 45px)`;
    const vizDiv = document.getElementById("viz1745364540836");
    setImportantStyle(vizDiv, 'height', height + 'px');
    setImportantStyle(vizDiv, 'min-height', minHeight);
    let parent = vizDiv ? vizDiv.parentElement : null;
    while (parent && parent !== document.body) {
        setImportantStyle(parent, 'height', height + 'px');
        parent = parent.parentElement;
    }
    // Set height on all iframes inside vizDiv
    if (vizDiv) {
        const iframes = vizDiv.querySelectorAll("iframe");
        iframes.forEach((iframe) => {
            setImportantStyle(iframe, 'height', height + 'px');
            setImportantStyle(iframe, 'min-height', minHeight);
        });
    }
}

function setDashboardHeight(sheetName) {
    // Normalize the sheet name for lookup
    const normalizedSheetName = typeof sheetName === 'string' ? sheetName.trim().toLowerCase() : sheetName;
    // Build a normalized mapping
    const normalizedSheetHeights = {};
    Object.keys(sheetHeights).forEach(key => {
        normalizedSheetHeights[key.trim().toLowerCase()] = sheetHeights[key];
    });
    const height = normalizedSheetHeights[normalizedSheetName] || 2640;
    enforceDashboardHeight(sheetName);
    // Disconnect previous observer if any
    if (heightObserver) heightObserver.disconnect();
    // Observe changes to the vizDiv and its children
    const vizDiv = document.getElementById("viz1745364540836");
    if (vizDiv) {
        heightObserver = new MutationObserver(() => {
            enforceDashboardHeight(sheetName);
        });
        heightObserver.observe(vizDiv, { childList: true, subtree: true });
    }
}

window.setDashboardHeight = setDashboardHeight;


