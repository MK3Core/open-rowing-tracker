# Rowing Progress Tracker

A simple web application to track your rowing workouts and body measurements over time.

## Features

- **Beginner Rowing Plan Integration**:
  - Structured workout recommendations following a 4-week progression
  - Visual session planning with SPM and heart rate targets
  - Session analysis comparing your performance to targets
  - Automatic progression through the training plan
  - Week-specific training tips and guidance
  - Performance feedback with personalized recommendations
- Track rowing sessions with detailed metrics:
  - Duration, distance, speed
  - Heart rate (min/max)
  - Automatically calculated calories burned based on speed
  - Stroke rate
  - Notes
- Track body measurements over time:
  - Weight
  - BMI
  - Body fat percentage
  - Muscle mass percentage
  - Body water percentage
- View progress statistics:
  - Performance changes between sessions
  - Weekly summaries
  - Total rowing stats
  - Body composition trends
- Data visualization with interactive charts
- Dark/light mode toggle for comfortable viewing
- Automatic workout calculations (enter any two of: duration, distance, speed)
- Import/export all data in JSON format
- Works offline with local storage

## Calorie Calculation

The application automatically calculates calories burned based on your weight and rowing speed using the following formula:

```
Calories = (MET × weight in kg × 3.5) ÷ 200 × duration in minutes
```

MET values vary by rowing speed:
- 2.0-3.9 mph: Light effort (2.8 MET)
- 4.0-5.9 mph: Moderate effort (5.8 MET)
- 6.0+ mph: Vigorous effort (12.0 MET)

## Beginner Rowing Plan

The application includes a structured 4-week beginner rowing plan that gradually increases workout duration and intensity. The plan focuses on developing proper form and building cardiovascular endurance safely.

For the complete workout plan with detailed information about each week's format, SPM ranges, heart rate targets, and safety tips, see [your beginner rowing plan](docs/beginner-plan.md).

## Session Feedback System

After each completed session, the application provides personalized feedback by:
- Analyzing your performance against target metrics
- Highlighting areas where you met or exceeded goals
- Providing suggestions for improvement
- Recommending your next workout based on your progress

## Setup Instructions

You can use the Rowing Progress Tracker in two ways:

### Option 1: Use the Online Version
- Simply visit [https://mk3core.github.io/open-rowing-tracker/](https://mk3core.github.io/open-rowing-tracker/)
- The application will run directly in your browser
- Your data will be stored in your browser's local storage

### Option 2: Download for Offline Use
1. **Download the Files**
   - Download all files to a folder on your computer
   - You need the following files:
     - `index.html`
     - `styles.css`
     - `tracker.js`
     - `app.js`
     - `toast.js`
     - `session-planner.js`
     - `BEGINNER-ROWING-PLAN.md` (documentation only)

2. **Open the Application**
   - Simply open the `index.html` file in your web browser
   - No server or internet connection required

### Getting Started
- The first step is to add your body measurements (weight, BMI, etc.)
- Once body measurements are added, you can see your recommended workouts
- Follow the structured plan or create custom sessions

## Using the Tracker

### Adding Body Measurements

1. Use the "Body Measurements" form to record your body stats
2. Fill in the required fields (weight, BMI) and any optional fields
3. Click "Add Measurement" to save

### Using the Beginner Plan

1. View your next recommended session in the "Your Next Session" card
2. Click "View Session Form" to automatically set up the recommended workout
3. After completing your workout, record the actual metrics
4. Review the session analysis to see how you performed against targets
5. The app will guide you through the 4-week progression automatically

### Recording Rowing Sessions

1. Use the "Add New Rowing Session" form
2. Enter the date, duration, distance, and other metrics
3. The intensity level and calories burned will be automatically calculated based on your speed
4. Click "Add Session" to save
5. Review the feedback on your performance

### Smart Workout Calculator

1. Enter any two of the three main metrics (duration, distance, speed)
2. The third metric will be automatically calculated
3. Visual indicators show which field is being auto-calculated
4. Calories are automatically calculated based on your speed and latest weight

### Viewing Your Progress

- **Progress Overview**: See changes between your first and most recent sessions
- **Total Stats**: View aggregate statistics across all your sessions
- **Weekly Summary**: See your rowing data organized by week
- **Body Measurement Trends**: Track changes in your body composition
- **Recent Body Measurements**: View your recorded body stats chronologically
- **Recent Rowing Sessions**: View your individual rowing sessions

### Managing Your Data

- **Export Data**: Click "Export Data" to get a JSON representation of all your data
- **Import Data**: Paste a previously exported JSON and click "Import Data"

## Data Storage

Your data is stored in your browser's local storage, which means:
- It persists between sessions on the same device/browser
- It will be lost if you clear your browser data
- It's not synced between devices

To keep your data safe, regularly export it using the Export button.

## Technical Details

- Built with vanilla JavaScript, HTML, and CSS
- Uses Chart.js for data visualization
- Bootstrap 5 for styling
- No server-side components or database required
- All data stored locally in the browser

## License

This software is licensed for personal, non-commercial use only. 

Copyright © 2025 R. Alexander Core

Permission is granted to use and modify this software for personal purposes only. 
Commercial use, redistribution, or use for profit is expressly prohibited without prior written permission from the author.
