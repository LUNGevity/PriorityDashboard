# LUNGevity Project PRIORITY Dashboard

## Overview

**Project PRIORITY** (Patient Reported Initiative On Resistance, Incidence, Treatment studY survey) was an online survey completed in **2019** by people living with EGFR lung cancer. The goal of this study was to understand the treatment experience of EGFR-positive lung cancer patients.

This interactive dashboard visualizes the survey responses from lung cancer patients and caregivers, providing insights into their treatment journeys, clinical experiences, and outcomes. Through intuitive navigation and responsive design, users can explore detailed patient demographics, treatment patterns, side effects, and quality of life metrics.

**Live Dashboard:** [View the dashboard here](https://lungevity.github.io/PriorityDashboard/)

**Tableau Public:** [View the original visualization](https://public.tableau.com/app/profile/chesie.yu/viz/LUNGevityProjectPRIORITYDashboard/Home)

### Dashboard Sections

The dashboard is organized into the following key sections:

1. **Home** - Overview and introduction to the dashboard

2. **Clinical Details** - Overview of the survey participants

3. **Location Where Cancer Has Spread** - Where the cancer has spread in the body (metastasis), the most common locations for spread

4. **Who Was in the Study** - Personal information (demographics) of the patients and caregivers who participated in the study

5. **Diagnostic Story** - How participants were diagnosed, how long people waited for a referral to an oncologist

6. **Biomarker Testing at Diagnosis** - Experiences of patients with biomarker testing

7. **Tobacco Exposure** - Exposure to tobacco for participants, including smoking history and duration

8. **Other Risk Factors and Exposures** - Participants' exposures and risk factors for lung cancer

9. **Treatment for Those Diagnosed with Stage I/II** - First-line treatments reported by participants with stage I/II EGFR-positive lung cancer, changes in the stage of the disease

10. **Treatment for Those Diagnosed with Stage III** - Treatments reported by participants diagnosed with stage III EGFR-positive lung cancer, changes in the stage of the disease

11. **Treatment for Those Diagnosed with Stage IV** - Treatments reported by participants diagnosed with stage IV EGFR-positive lung cancer, changes in the stage of the disease

12. **Side Effects** - Treatment side effects reported by patient participants who were, at the time of completing the survey, taking osimertinib as their first treatment

13. **Experience with Clinical Trial** - Participants' experience with clinical trials

14. **Mental Health & Social Support** - Mental and emotional well-being of patients following their diagnosis of EGFR-positive lung cancer

15. **Care Team Support** - Relationship participants have with the doctor who provides the treatment for their lung cancer

16. **FAQ** - Frequently asked questions

### Key Functionalities
- **Interactive Visualizations**: Click, hover, and filter data points
- **Responsive Design**: Adapts to desktop and mobile devices
- **Smooth Transitions**: Seamless navigation between sections
- **Accessible Navigation**: Clear and intuitive user interface


## User Guide

### Navigation
- **Menu Navigation**: 
  - Click the **menu icon (☰)** in the top-left corner to access all dashboard sections
  - Select any section from the menu to navigate directly
  - Click outside the menu or press ESC to close it

- **Arrow Navigation**:
  - Use the arrow buttons on either side of the screen to move between sections
  - On desktop: arrows appear on the left and right sides
  - On mobile: arrows are positioned at the bottom of the screen
  - Keyboard shortcuts: Use left/right arrow keys to navigate

- **Interactive Features**:
  - Click on data points to see detailed information
  - Hover over elements to view tooltips
  - Use filters to explore specific data subsets
  - Each section provides unique interactive visualizations

### How to Run the App
1. Clone the repository:
   ```bash
   git clone https://github.com/LUNGevity/PriorityDashboard.git
   ```

2. Navigate to the project directory:
   ```bash
   cd PriorityDashboard
   ```

3. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```

4. Open your browser and visit:
   ```
   http://localhost:8000
   ```


## File Structure

```
PriorityDashboard/
├── index.html          # Main HTML file
├── app.js             # Core application logic
├── navigation.js      # Navigation functionality
└── README.md          # This documentation
```

## Recent Updates (5/29/2025)

- Added loading spinner for improved user experience
- Enhanced mobile navigation with bottom-positioned controls
- Optimized dashboard loading sequence
- Improved navigation element visibility timing
- Streamlined code structure and removed unused functions

## License

All rights reserved. This project is proprietary and confidential. 