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

// Function to be called when viz is ready
function ready() {
  console.log("Viz is ready, checking sheet type");
  if (!window.viz) {
    console.error("Viz not initialized!");
    return;
  }

  try {
    // Get the container
    vizDiv = document.getElementById("viz1745364540836");
    if (!vizDiv) {
      console.error("Viz container not found!");
      return;
    }

    // Get sheet info for scaling
    const workbook = window.viz.getWorkbook();
    activeSheet = workbook.getActiveSheet();
    console.log("Active sheet:", activeSheet.getName());
    console.log("Sheet type:", activeSheet.getSheetType());

    // Set up media query
    mediaQuery = window.matchMedia(mediaQueryString);
    
    // Initial sizing and scaling
    handleResize();

    // Add resize listener
    window.addEventListener('resize', debounce(handleResize, 250));

    // Set up MutationObserver to detect sheet changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          console.log("Detected viz change, reapplying scale");
          // Small delay to ensure the new sheet is fully loaded
          setTimeout(handleResize, 100);
        }
      }
    });

    // Start observing the viz container
    observer.observe(vizDiv, {
      childList: true,
      subtree: true,
      attributes: true
    });

  } catch (error) {
    console.error("Error in ready function:", error);
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

// Scale the visualization
function scaleViz(currentWidth, deviceType) {
    console.log("Scaling viz", { currentWidth, deviceType });
    
    try {
        // Get all relevant dimensions
        const containerWidth = vizDiv.offsetWidth;
        const containerHeight = window.innerHeight * 0.85;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const dashboardWidth = 1366;
        const dashboardHeight = 795;
        
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
