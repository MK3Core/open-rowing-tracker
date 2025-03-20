# Rowing Progress Tracker

A simple web application to track and visualize your rowing workouts and progress over time.

## Features

- Track rowing sessions with detailed metrics:
  - Duration
  - Distance
  - Speed
  - Heart rate
  - Calories burned
  - Stroke rate
  - Notes
- View progress statistics:
  - Session-to-session improvements
  - Weekly summaries
  - Total stats (distance, duration, calories)
- Export and import your data
- Simple web interface that works offline
- Data stored locally in your browser

## How to Use

### Quick Start

1. Simply open `index.html` in your web browser
2. Enter your profile information (weight and BMI)
3. Add your rowing sessions after each workout
4. View your progress statistics

### Data Storage

Your data is automatically saved in your browser's local storage. However, it's recommended to:

1. Periodically export your data using the "Export Data" button
2. Copy the exported JSON and save it somewhere safe (like a text file)
3. If you clear your browser data or switch devices, you can import your saved data

## Setup

This application requires no installation or server setup:

1. Download this repository
2. Open `index.html` in any modern web browser
3. Start tracking your progress!

## Initial Data

If you have existing rowing data you'd like to import, use the following format in the Import/Export box:

```json
{
  "profile": {
    "currentWeight": 250,
    "currentBMI": 31,
    "startDate": "2025-03-20"
  },
  "sessions": [
    {
      "date": "2025-03-20",
      "duration": 20,
      "distance": 2,
      "avgSpeed": 6,
      "heartRateRange": {
        "min": 150,
        "max": 170
      },
      "caloriesBurned": 325,
      "strokeRate": null,
      "notes": "First few days of rowing. Completed 20 min session."
    }
  ]
}
```

## Technical Details

- Built with vanilla JavaScript, HTML, and CSS
- Uses Bootstrap 5 for styling
- All data stored in browser localStorage
- No server or internet connection required after initial download

## Future Enhancements

- Data visualization with charts
- Goal setting and tracking
- Workout plan suggestions
- Data export to CSV format
- PWA features for mobile installation

## License

MIT License - Feel free to use, modify, and distribute as needed.