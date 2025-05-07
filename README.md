# LUNGevity Project PRIORITY Dashboard

## Overview
This dashboard provides an interactive visualization of lung cancer patient data, allowing users to explore various aspects of patient demographics, clinical details, and treatment outcomes.

## Navigation Guide

### Menu Navigation
- Use the menu icon in the top-left corner to access the full navigation menu
- Click on any menu item to navigate directly to that section
- The menu can be closed by clicking the X button or clicking outside the menu

### Arrow Navigation
- Use the left and right arrows on the sides of the screen to move between sections sequentially
- The arrows will show the name of the next/previous section
- Navigation is disabled (arrows hidden) when at the first or last section

### Tab Navigation
- Within each section, you can use the tabs at the top of the visualization to switch between different views
- The navigation state will automatically update to reflect the current tab

### Keyboard Navigation
- Use the left and right arrow keys to navigate between sections
- Press ESC to close the menu if it's open

### Responsive Design
- The dashboard automatically adjusts to different screen sizes
- On mobile devices, the visualization will switch to a mobile-optimized view
- The navigation menu becomes a slide-out panel on mobile devices
- Navigation buttons and text are optimized for both desktop and mobile views

## Sections
1. Home - Overview and introduction
2. Clinical Details - Patient clinical information
3. Metastatic Locations - Details about cancer spread
4. Demographics - Patient demographic data
5. Diagnostic Story - Patient diagnosis journey
6. Biomarker Testing - Results of biomarker tests
7. Tobacco Exposure - Smoking history and exposure
8. Other Risk Factors and Exposures - Additional risk factors
9. Treatment for Those Diagnosed with Stage I/II - Early stage treatment details
10. Treatment for Those Diagnosed with Stage III - Stage III treatment information
11. Treatment for Those Diagnosed with Stage IV - Stage IV treatment details
12. Side Effects - Treatment side effects
13. Experience with Clinical Trial - Clinical trial participation
14. Mental Health - Mental health aspects
15. Care Team Support - Support team information
16. FAQ - Frequently asked questions

## Technical Details
- Built using Tableau for data visualization
- Responsive design optimized for both desktop and mobile viewing
- Modern, clean interface with intuitive navigation
- Optimized for modern web browsers

## Features

- Interactive Tableau dashboard integration
- Responsive design that works across different screen sizes
- Navigation menu with easy access to different sections
- Previous/Next navigation buttons for sequential browsing

## Setup

1. Clone the repository:
```bash
git clone https://github.com/LUNGevity/PriorityDashboard.git
```

2. Open the project directory:
```bash
cd PriorityDashboard
```

3. Serve the files using a local web server. For example, using Python:
```bash
# Python 3
python -m http.server 8000
```

4. Open your browser and navigate to `http://localhost:8000`

## Structure

- `index.html` - Main HTML file containing the dashboard structure and styles
- `navigation.js` - JavaScript file handling navigation and Tableau visualization
- `README.md` - Project documentation
- `.gitignore` - Git ignore file

## Recent Updates

- Optimized dashboard size for maximum visibility
- Improved navigation button and text positioning
- Enhanced mobile responsiveness
- Cleaned up and optimized CSS code
- Improved overall layout and spacing

## License

All rights reserved. This project is proprietary and confidential. 