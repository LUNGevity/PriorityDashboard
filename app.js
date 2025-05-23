let vizDiv,
  mediaQuery,
  activeSheet;

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
        window.viz.addEventListener('tabswitch', function(event) {
            try {
                const newSheetName = event.getNewSheetName();
                const normalizedSheetName = normalize(newSheetName);
                const sheetInfo = sheetToIndex[normalizedSheetName];
                
                if (sheetInfo) {
                    updateNavigationState(sheetInfo.originalName);
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
        const sheetToIndex = {};
        Object.entries(rawSheetToIndex).forEach(([originalName, info]) => {
            const normalizedName = normalize(originalName);
            sheetToIndex[normalizedName] = {
                ...info,
                originalName
            };
        });

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
        if (!window.sheetToIndex) {
            initializeSheetMapping();
        }

        vizDiv = document.getElementById("viz1745364540836");
        if (!vizDiv) {
            console.error("Viz container not found!");
            return;
        }

        const workbook = window.viz.getWorkbook();
        activeSheet = workbook.getActiveSheet();
        mediaQuery = window.matchMedia(mediaQueryString);
        
        handleResize();
        window.addEventListener('resize', debounce(handleResize, 250));
        setupTabSwitchListener();
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
  if (!window.updateNavigationIndex) {
    console.error("window.updateNavigationIndex is not defined!");
    return;
  }

  if (typeof sheetName === 'number') {
    window.updateNavigationIndex(sheetName);
    return;
  }
  
  const normalizedSheetName = normalize(sheetName);
  const sheetInfo = sheetToIndex[normalizedSheetName];
  
  if (sheetInfo) {
    window.updateNavigationIndex(sheetInfo.index);
  } else {
    window.updateNavigationIndex(0); // Default to Home
  }
}

// Function to check current sheet
function checkCurrentSheet() {
  try {
    const workbook = window.viz.getWorkbook();
    const currentSheet = workbook.getActiveSheet();
    updateNavigationState(currentSheet.getName());
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
    const currentWidth = vizDiv.offsetWidth;
    const deviceType = mediaQuery.matches ? "phone" : "desktop";
    
    if (window.viz.device !== deviceType) {
      window.viz.device = deviceType;
    }
    
    scaleViz(currentWidth, deviceType);
  } catch (error) {
    console.error("Error in handleResize:", error);
  }
}

// Scale the visualization
function scaleViz(currentWidth, deviceType) {
  try {
    const containerWidth = vizDiv.offsetWidth;
    const containerHeight = window.innerHeight * 0.85;
    const dashboardWidth = 1440;
    const dashboardHeight = 810;

    const scaleX = containerWidth / dashboardWidth;
    const scaleY = containerHeight / dashboardHeight;
    const scale = Math.min(scaleX, scaleY);

    const scaledWidth = dashboardWidth * scale;
    const scaledHeight = dashboardHeight * scale;
    const translateX = (containerWidth - scaledWidth) / 2;
    const translateY = (containerHeight - scaledHeight) / 2;

    vizDiv.style.cssText = `
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    `;

    const transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    const commonStyles = `
      width: ${dashboardWidth}px;
      height: ${dashboardHeight}px;
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: top left;
      transform: ${transform};
    `;

    // Update tableau-viz elements
    document.querySelectorAll("tableau-viz").forEach(elem => {
      elem.style.cssText = commonStyles;
    });

    // Update iframe if present
    const iframe = vizDiv.querySelector("iframe");
    if (iframe) {
      iframe.style.cssText = commonStyles + 'border: none;';
    }
  } catch (error) {
    console.error("Error in scaleViz:", error);
  }
}

// Function to navigate to a specific sheet
function navigateToSheet(sheetName) {
  if (!window.viz) {
    console.error("Viz not initialized!");
    return;
  }

  const normalizedSheetName = normalize(sheetName);
  const sheetInfo = sheetToIndex[normalizedSheetName];
  
  if (sheetInfo) {
    window.viz.getWorkbook()
      .activateSheetAsync(sheetInfo.originalName)
      .then(() => {
        updateNavigationState(sheetInfo.originalName);
      })
      .catch(error => {
        console.error("Error activating sheet:", error);
      });
  }
}

// Make functions available globally
window.handleResize = handleResize;
window.navigateToSheet = navigateToSheet;
window.updateNavigationState = updateNavigationState;


