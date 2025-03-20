# Rowing Progress Tracker

A simple web application to track your rowing workouts and body measurements over time.

## Features

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

## Setup Instructions

1. **Download the Files**
   - Download all files to a folder on your computer
   - You need the following files:
     - `index.html`
     - `styles.css`
     - `tracker.js`
     - `app.js`
     - `toast.js`

2. **Open the Application**
   - Simply open the `index.html` file in your web browser
   - No server or internet connection required

3. **Getting Started**
   - The first step is to add your body measurements (weight, BMI, etc.)
   - Once body measurements are added, you can record rowing sessions

## Using the Tracker

### Adding Body Measurements

1. Use the "Body Measurements" form to record your body stats
2. Fill in the required fields (weight, BMI) and any optional fields
3. Click "Add Measurement" to save

### Recording Rowing Sessions

1. Use the "Add New Rowing Session" form
2. Enter the date, duration, distance, and other metrics
3. The intensity level and calories burned will be automatically calculated based on your speed
4. Click "Add Session" to save

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
