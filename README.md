# Rowing Progress Tracker

A simple web application to track your rowing workouts and body measurements over time.

## Features

- Track rowing sessions with detailed metrics:
  - Duration, distance, speed
  - Heart rate (min/max)
  - Calories burned
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

3. **Import Your Data (Optional)**
   - Use the provided sample data or paste your own JSON data in the import/export box
   - Click "Import Data" to load your data

## Using the Tracker

### Tracking Body Measurements

1. Use the "Body Measurements" form to record your body stats
2. Fill in the data fields (weight, BMI, body fat %, etc.)
3. Click "Add Measurement" to save

### Adding Rowing Sessions

1. Use the "Add New Rowing Session" form
2. Enter the date, duration, distance, and other metrics
3. Click "Add Session" to save

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

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - CSS styles including dark/light mode
- `tracker.js` - Core functionality for tracking and calculations
- `app.js` - UI interactivity and event handling
- `toast.js` - Simple notification system

## License

MIT License - Feel free to use, modify, and distribute as needed.
