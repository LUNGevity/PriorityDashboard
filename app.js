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
    // console.log("Setting up tab switch listener");
    if (!window.viz) {
        console.error("Viz not initialized!");
        return;
    }

    try {
        // Remove any existing listeners first
        window.viz.removeEventListener('tabswitch');
        
        // Add tab switch listener
        window.viz.addEventListener('tabswitch', function(event) {
            // console.log("Tab switch event:", event);
            try {
                const oldSheetName = event.getOldSheetName();
                const newSheetName = event.getNewSheetName();
                // console.log("Switched from sheet:", oldSheetName, "to sheet:", newSheetName);
                
                // Get the normalized sheet name and info
                const normalizedSheetName = normalize(newSheetName);
                const sheetInfo = sheetToIndex[normalizedSheetName];
                
                if (sheetInfo) {
                    // console.log("DEBUG: Found sheet info for tab switch:", sheetInfo);
                    // Update navigation state with the original sheet name
                    updateNavigationState(sheetInfo.originalName);
                    
                    // Trigger resize handling after a short delay
                    setTimeout(() => {
                        if (window.handleResize) {
                            window.handleResize();
                        }
                    }, 100);
                } else {
                    // console.warn("DEBUG: Unknown sheet name in tab switch:", newSheetName);
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
    // console.log("DEBUG: Initializing sheet mapping");
    try {
        // Build normalized mapping once at startup
        const sheetToIndex = {};
        Object.entries(rawSheetToIndex).forEach(([originalName, info]) => {
            const normalizedName = normalize(originalName);
            sheetToIndex[normalizedName] = {
                ...info,
                originalName // Store the original name for Tableau navigation
            };
        });

        // Make the mapping available globally
        window.sheetToIndex = sheetToIndex;
        window.normalizeSheetName = normalize;
        
        // console.log("DEBUG: Sheet mapping initialized:", sheetToIndex);
    } catch (error) {
        console.error("Error initializing sheet mapping:", error);
    }
}

// Function to be called when viz is ready
function ready() {
    // console.log("Viz is ready, checking sheet type");
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
        // console.log("Active sheet:", activeSheet.getName());
        // console.log("Sheet type:", activeSheet.getSheetType());

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

        // Log initial state
        // console.log("Initial state:", {
        //     vizUrl: window.viz.getUrl(),
        //     workbook: workbook.getName(),
        //     activeSheet: activeSheet.getName(),
        //     container: vizDiv.id
        // });

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

// Function to find the best matching sheet name
function findBestMatch(sheetName, sheetNames) {
    // Convert to lowercase for case-insensitive matching
    const normalizedInput = sheetName.toLowerCase();
    
    // Try exact match first
    if (sheetNames[normalizedInput] !== undefined) {
        return normalizedInput;
    }
    
    // Try partial match
    for (const key in sheetNames) {
        // Check if either string contains the other
        if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
            // console.log("DEBUG: Found partial match:", key);
            return key;
        }
    }
    
    // Try fuzzy match using Levenshtein distance
    let bestMatch = null;
    let bestScore = 0;
    
    for (const key in sheetNames) {
        const score = calculateSimilarity(normalizedInput, key);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = key;
        }
    }
    
    // Only use fuzzy match if the similarity is high enough
    if (bestScore > 0.8) {
        // console.log("DEBUG: Found fuzzy match:", bestMatch, "with score:", bestScore);
        return bestMatch;
    }
    
    return null;
}

// Function to calculate string similarity using Levenshtein distance
function calculateSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
  
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  return 1 - matrix[len1][len2] / Math.max(len1, len2);
}

// Function to get the standardized sheet name
function getStandardizedSheetName(sheetName) {
  // Map of variations to standardized names
  const sheetNameMap = {
    'Treatment4': 'Treatment for Those Diagnosed with Stage IV',
    'Treatment3': 'Treatment for Those Diagnosed with Stage III',
    'Treatment1and2': 'Treatment for Those Diagnosed with Stage I/II',
    'Biomarker Testing': 'Biomarker Testing at Diagnosis',
    'Clinical Trial': 'Experience with Clinical Trial'
  };
  
  return sheetNameMap[sheetName] || sheetName;
}

// Function to update navigation state based on sheet name
function updateNavigationState(sheetName) {
  console.log("DEBUG: Starting updateNavigationState with sheet name:", sheetName);
  console.log("DEBUG: Source of navigation:", new Error().stack);
  
  // If sheetName is a number, it's already an index
  if (typeof sheetName === 'number') {
    console.log("DEBUG: Updating navigation state to index:", sheetName);
    // Update the navigation state in navigation.js
    if (window.updateNavigationIndex) {
      console.log("DEBUG: Calling window.updateNavigationIndex");
      window.updateNavigationIndex(sheetName);
    } else {
      console.error("DEBUG: window.updateNavigationIndex is not defined!");
    }
    return;
  }
  
  // Normalize the incoming sheet name
  const normalizedSheetName = normalize(sheetName);
  console.log("DEBUG: Normalized sheet name:", normalizedSheetName);
  
  // Get the index and page from the mapping using normalized name
  const sheetInfo = sheetToIndex[normalizedSheetName];
  console.log("DEBUG: Mapped sheet info:", sheetInfo);
  
  if (sheetInfo) {
    console.log("DEBUG: Updating navigation state to index:", sheetInfo.index);
    // Update the navigation state in navigation.js
    if (window.updateNavigationIndex) {
      console.log("DEBUG: Calling window.updateNavigationIndex");
      window.updateNavigationIndex(sheetInfo.index);
    } else {
      console.error("DEBUG: window.updateNavigationIndex is not defined!");
    }
  } else {
    console.warn("DEBUG: Unknown sheet name:", sheetName, "(normalized:", normalizedSheetName, ") - Defaulting to Home (index 0)");
    // Default to Home if sheet name is unknown
    if (window.updateNavigationIndex) {
      window.updateNavigationIndex(0);
    }
  }
}

// Function to check current sheet
function checkCurrentSheet() {
  try {
    // Get the current URL of the viz
    const currentUrl = window.viz.getUrl();
    console.log("Current viz URL:", currentUrl);

    // Get the workbook and active sheet
    const workbook = window.viz.getWorkbook();
    const currentSheet = workbook.getActiveSheet();
    const sheetName = currentSheet.getName();
    console.log("Current sheet check:", sheetName);

    // Map sheet names to their corresponding indices
    const sheetToIndex = {
      'Home': 0,
      'Clinical Details': 1,
      'Metastatic Locations': 2,
      'Demographics': 3,
      'Diagnostic Story': 4,
      'Biomarker Testing': 5,
      'Tobacco Exposure': 6,
      'Other Exposures': 7,
      'Treatment 1and2': 8,
      'Treatment3': 9,
      'Treatment4': 10,
      'Side Effects': 11,
      'Clinical Trial': 12,
      'Mental Health': 13,
      'Care Team Support': 14,
      'FAQ': 15
    };

    // Map Tableau sheet names to navigation data-page values
    const sheetToPageMap = {
      'Home': 'Home',
      'Clinical Details': 'ClinicalDetails',
      'Metastatic Locations': 'MetastaticLocations',
      'Demographics': 'Demographics',
      'Diagnostic Story': 'DiagnosticStory',
      'Biomarker Testing': 'BiomarkerTesting',
      'Tobacco Exposure': 'TobaccoExposure',
      'Other Exposures': 'OtherExposures',
      'Treatment 1and2': 'Treatment1and2',
      'Treatment3': 'Treatment3',
      'Treatment4': 'Treatment4',
      'Side Effects': 'SideEffects',
      'Clinical Trial': 'ClinicalTrial',
      'Mental Health': 'MentalHealth',
      'Care Team Support': 'CareTeamSupport',
      'FAQ': 'FAQ'
    };

    const currentIndex = sheetToIndex[sheetName];
    const pageName = sheetToPageMap[sheetName];
    console.log("Initial sheet mapping - index:", currentIndex, "page:", pageName);

    // Update navigation state
    updateNavigationState(sheetName);
  } catch (error) {
    console.error("Error checking sheet:", error);
  }
}

// Handle window resize
function handleResize() {
  console.log("Handling resize");
  if (!window.viz) {
    console.error("Viz not initialized!");
    return;
  }

  try {
    currentWidth = vizDiv.offsetWidth;
    console.log("Resize - Current width:", currentWidth);

    if (mediaQuery.matches) {
      console.log("Resizing for phone");
      if (window.viz.device === "desktop" || window.viz.device === "default") {
        window.viz.device = "phone";
      }
      scaleViz(currentWidth, "phone");
    } else {
      console.log("Resizing for desktop");
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
    console.log("Scaling viz", { currentWidth, deviceType });
    
    try {
        // Get all relevant dimensions
        const containerWidth = vizDiv.offsetWidth;
        const containerHeight = window.innerHeight * 0.85;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const dashboardWidth = 1440;
        const dashboardHeight = 810;
        
        console.log("Dimensions:", {
            window: {
                width: windowWidth,
                height: windowHeight
            },
            container: {
                width: containerWidth,
                height: containerHeight
            },
            dashboard: {
                width: dashboardWidth,
                height: dashboardHeight
            }
        });

        // Calculate scaling factor based on the fixed dashboard size (1366:795 - 16:9 aspect ratio)
        const scaleX = containerWidth / dashboardWidth;
        const scaleY = containerHeight / dashboardHeight;
        const scale = Math.min(scaleX, scaleY);

        console.log("Scaling calculations:", {
            scaleX,
            scaleY,
            finalScale: scale
        });

        // Calculate the scaled dimensions
        const scaledWidth = dashboardWidth * scale;
        const scaledHeight = dashboardHeight * scale;

        // Center the scaled dashboard in the container
        const translateX = (containerWidth - scaledWidth) / 2;
        const translateY = (containerHeight - scaledHeight) / 2;

        console.log("Final dimensions:", {
            scaled: {
                width: scaledWidth,
                height: scaledHeight
            },
            translation: {
                x: translateX,
                y: translateY
            }
        });

        // Set container to full size
        vizDiv.style.width = "100%";
        vizDiv.style.height = "100%";
        vizDiv.style.overflow = "hidden";
        vizDiv.style.position = "relative";

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
    } catch (error) {
        console.error("Error in scaleViz:", error);
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log("Page loaded, waiting for viz to be ready");
});

// Function to navigate to a specific sheet by name
function navigateToSheet(sheetName) {
  console.log("DEBUG: Navigating to sheet:", sheetName);
  
  // Get the sheet info from the mapping
  const normalizedSheetName = normalize(sheetName);
  const sheetInfo = sheetToIndex[normalizedSheetName];
  
  if (sheetInfo) {
    console.log("DEBUG: Found sheet info:", sheetInfo);
    // Navigate to the sheet in Tableau using the original name
    if (window.viz) {
      const workbook = window.viz.getWorkbook();
      workbook.activateSheetAsync(sheetInfo.originalName).then(() => {
        console.log("DEBUG: Successfully activated sheet:", sheetInfo.originalName);
        // Update the navigation state
        updateNavigationState(sheetInfo.originalName);
      }).catch(error => {
        console.error("DEBUG: Error activating sheet:", error);
      });
      } else {
      console.error("DEBUG: Viz not initialized!");
    }
  } else {
    console.warn("DEBUG: Unknown sheet name:", sheetName);
  }
}

// Make the navigation functions available globally
window.navigateToSheet = navigateToSheet;

// Make setupTabSwitchListener available globally
window.setupTabSwitchListener = setupTabSwitchListener;

// Make initializeSheetMapping available globally
window.initializeSheetMapping = initializeSheetMapping;


