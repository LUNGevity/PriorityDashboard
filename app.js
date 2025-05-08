console.log('JS loaded');
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
            if (window.setMobileDashboardScale) {
              let sheetName = 'Home';
              if (window.viz && window.viz.getWorkbook) {
                try {
                  const workbook = window.viz.getWorkbook();
                  const currentSheet = workbook.getActiveSheet();
                  sheetName = currentSheet.getName();
                } catch (e) {}
              }
              window.setMobileDashboardScale(sheetName);
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

        // Set iframe height on load
        setTimeout(() => {
            let sheetName = 'Home';
            if (window.viz && window.viz.getWorkbook) {
                try {
                    const workbook = window.viz.getWorkbook();
                    const currentSheet = workbook.getActiveSheet();
                    sheetName = currentSheet.getName();
                } catch (e) {}
            }
            setMobileDashboardScale(sheetName);
            observeIframeForMobile(sheetName);
        }, 100);
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
window.normalizeSheetName = normalize;

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

let lastMobileWidth = null;
let initialMobileWidth = null;
let lastScaledSheetName = null;

function setMobileDashboardScale(sheetName) {
    console.log('[setMobileDashboardScale] called with sheetName:', sheetName);
    const isMobile = window.matchMedia("(max-width: 576px)").matches;
    if (!isMobile) {
        lastMobileWidth = null; // Reset on desktop
        initialMobileWidth = null;
        lastScaledSheetName = null;
        document.documentElement.style.width = '';
        document.body.style.width = '';
        document.documentElement.style.overflowX = '';
        document.body.style.overflowX = '';
        return;
    }
    const deviceWidth = window.innerWidth;
    if (initialMobileWidth === null) {
        initialMobileWidth = deviceWidth;
        console.log('[setMobileDashboardScale] initialMobileWidth set to:', initialMobileWidth);
        document.documentElement.style.width = initialMobileWidth + 'px';
        document.body.style.width = initialMobileWidth + 'px';
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';
    }
    const normalizedSheetName = typeof sheetName === 'string' ? sheetName.trim().toLowerCase() : sheetName;
    const normalizedLastScaledSheetName = typeof lastScaledSheetName === 'string' ? lastScaledSheetName.trim().toLowerCase() : lastScaledSheetName;
    if (deviceWidth === lastMobileWidth && normalizedSheetName === normalizedLastScaledSheetName) {
        console.log('[setMobileDashboardScale] deviceWidth and sheetName unchanged, skipping');
        return;
    }
    lastMobileWidth = deviceWidth;
    lastScaledSheetName = sheetName;
    const nativeWidth = 414;
    const normalizedSheetHeights = {};
    Object.keys(sheetHeights).forEach(key => {
        normalizedSheetHeights[key.trim().toLowerCase()] = sheetHeights[key];
    });
    const nativeHeight = normalizedSheetHeights[normalizedSheetName] || 2640; // fallback height
    const scalingFactor = deviceWidth / nativeWidth;
    const headerHeight = 45;
    const vizDiv = document.getElementById("viz1745364540836");
    if (vizDiv) {
        // Force width/height with !important
        vizDiv.style.setProperty('width', nativeWidth + 'px', 'important');
        vizDiv.style.setProperty('height', nativeHeight + 'px', 'important');
        // Debug log for offsetWidth before scaling
        console.log('[setMobileDashboardScale] vizDiv.offsetWidth before scaling:', vizDiv.offsetWidth);
        vizDiv.style.transform = `scale(${scalingFactor})`;
        vizDiv.style.transformOrigin = "top left";
        vizDiv.style.margin = "0 auto";
        vizDiv.style.marginTop = '';
        const visualWidth = vizDiv.offsetWidth * scalingFactor;
        const visualHeight = vizDiv.offsetHeight * scalingFactor;
        console.log('[setMobileDashboardScale] visual (scaled) width:', visualWidth, 'visual (scaled) height:', visualHeight);
    }
    const iframe = vizDiv ? vizDiv.querySelector("iframe") : null;
    if (iframe) {
        iframe.style.setProperty('width', nativeWidth + 'px', 'important');
        iframe.style.setProperty('height', nativeHeight + 'px', 'important');
        iframe.style.transform = `scale(1)`; // Let the parent div handle scaling
        iframe.style.transformOrigin = "top left";
        iframe.style.margin = "0 auto";
    }
}

// Update all event handlers to call setMobileDashboardScale directly after navigation, tab switch, and on resize/orientation change
window.addEventListener('resize', () => {
    let sheetName = 'Home';
    if (window.viz && window.viz.getWorkbook) {
        try {
            const workbook = window.viz.getWorkbook();
            const currentSheet = workbook.getActiveSheet();
            sheetName = currentSheet.getName();
        } catch (e) {}
    }
    setMobileDashboardScale(sheetName);
});
window.addEventListener('orientationchange', () => {
    initialMobileWidth = null; // Reset on orientation change
    document.documentElement.style.width = '';
    document.body.style.width = '';
    document.documentElement.style.overflowX = '';
    document.body.style.overflowX = '';
    let sheetName = 'Home';
    if (window.viz && window.viz.getWorkbook) {
        try {
            const workbook = window.viz.getWorkbook();
            const currentSheet = workbook.getActiveSheet();
            sheetName = currentSheet.getName();
        } catch (e) {}
    }
    setMobileDashboardScale(sheetName);
});
document.addEventListener('DOMContentLoaded', () => {
    setMobileDashboardScale('Home');
});

// Function to navigate to a specific sheet by name
function navigateToSheet(sheetName) {
    console.log('[navigateToSheet] called with sheetName:', sheetName);
  // Get the sheet info from the mapping
  const normalizedSheetName = normalize(sheetName);
  const sheetInfo = sheetToIndex[normalizedSheetName];
  if (sheetInfo) {
        console.log('[navigateToSheet] sheetInfo:', sheetInfo);
    // Navigate to the sheet in Tableau using the original name
    if (window.viz) {
      const workbook = window.viz.getWorkbook();
      workbook.activateSheetAsync(sheetInfo.originalName).then(() => {
        updateNavigationState(sheetInfo.originalName);
                if (window.setDashboardHeight) {
                    window.setDashboardHeight(sheetInfo.originalName);
                }
                setTimeout(() => {
                    if (window.handleResize) {
                        window.handleResize();
                    }
                }, 100);
      }).catch(error => {
                console.error("Error activating sheet:", error);
      });
    }
  } else {
        console.log('[navigateToSheet] No sheetInfo found for:', sheetName);
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
  'Home': 5000,
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

function observeIframeForMobile(sheetName) {
    const vizDiv = document.getElementById("viz1745364540836");
    if (!vizDiv) return;
    const observer = new MutationObserver(() => {
        console.log('[observeIframeForMobile] MutationObserver triggered for sheet:', sheetName);
        // setMobileDashboardScale(sheetName);
    });
    // observer.observe(vizDiv, { childList: true, subtree: true }); // Disabled for debugging
}

// Add this at the end of your file or after the dashboard is initialized
function addStyleMutationDebugObserver() {
    const vizDiv = document.getElementById("viz1745364540836");
    if (!vizDiv) return;
    const iframe = vizDiv.querySelector("iframe");
    const nativeWidth = 414;
    const logStyleChange = (target, label) => {
        console.log(`[MutationObserver] ${label} style changed:`, target.style.cssText);
    };
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                logStyleChange(mutation.target, mutation.target === vizDiv ? '#vizDiv' : 'iframe');
                // If Tableau sets width to 100vw, immediately set it back to 414px and re-apply scaling
                if (mutation.target.style.width === '100vw') {
                    mutation.target.style.setProperty('width', nativeWidth + 'px', 'important');
                    if (mutation.target === vizDiv && window.setMobileDashboardScale) {
                        // Use the last scaled sheet name or 'Home' as fallback
                        window.setMobileDashboardScale(window.lastScaledSheetName || 'Home');
                    }
                }
            }
        }
    });
    observer.observe(vizDiv, { attributes: true, attributeFilter: ['style'] });
    if (iframe) {
        observer.observe(iframe, { attributes: true, attributeFilter: ['style'] });
    }
    console.log('[MutationObserver] Debug observer attached to #vizDiv and iframe');
}

// Attach the observer after DOMContentLoaded and after Tableau viz is created
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(addStyleMutationDebugObserver, 1000);
} else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(addStyleMutationDebugObserver, 1000));
}