// Rowing Progress Tracker
// Core functionality for tracking rowing sessions and progress

class RowingTracker {
  constructor(initialData = null) {
    if (initialData) {
      this.profile = initialData.profile;
      this.sessions = initialData.sessions;
      this.bodyStats = initialData.bodyStats || [];
    } else {
      this.profile = {
        currentWeight: null,
        currentBMI: null,
        startDate: new Date().toISOString().split('T')[0], // Today's date as start date
      };
      this.sessions = [];
      this.bodyStats = []; // Array to store body measurements over time
    }
  }
  
  // Initialize with user data
  initializeProfile(weight, bmi) {
    this.profile.currentWeight = weight;
    this.profile.currentBMI = bmi;
    return this.profile;
  }
  
  // Add a new rowing session
  addSession(date, duration, distance, avgSpeed, hrMin, hrMax, calories, strokeRate, notes) {
    const sessionData = {
      date: date || new Date().toISOString().split('T')[0],
      duration: parseFloat(duration),
      distance: parseFloat(distance),
      avgSpeed: parseFloat(avgSpeed),
      heartRateRange: { min: parseInt(hrMin), max: parseInt(hrMax) },
      caloriesBurned: parseInt(calories),
      strokeRate: strokeRate ? parseInt(strokeRate) : null,
      notes: notes
    };
    
    this.sessions.push(sessionData);
    return sessionData;
  }
  
  // Update user profile
  updateProfile(weight, bmi) {
    this.profile.currentWeight = weight || this.profile.currentWeight;
    this.profile.currentBMI = bmi || this.profile.currentBMI;
    return this.profile;
  }
  
  // Add body stats measurement
  addBodyStats(date, weight, bmi, bodyFat, muscleMass, bodyWater, notes) {
    const measurement = {
      date: date || new Date().toISOString().split('T')[0],
      weight: weight ? parseFloat(weight) : null,
      bmi: bmi ? parseFloat(bmi) : null,
      bodyFat: bodyFat ? parseFloat(bodyFat) : null,
      muscleMass: muscleMass ? parseFloat(muscleMass) : null, 
      bodyWater: bodyWater ? parseFloat(bodyWater) : null,
      notes: notes || ""
    };
    
    this.bodyStats.push(measurement);
    
    // Also update the current profile with the latest measurements
    if (weight) this.profile.currentWeight = parseFloat(weight);
    if (bmi) this.profile.currentBMI = parseFloat(bmi);
    
    return measurement;
  }
  
  // Calculate total stats across all sessions
  getTotalStats() {
    if (this.sessions.length === 0) return "No sessions recorded yet.";
    
    return {
      totalSessions: this.sessions.length,
      totalDuration: this.sessions.reduce((sum, session) => sum + session.duration, 0),
      totalDistance: this.sessions.reduce((sum, session) => sum + session.distance, 0),
      totalCalories: this.sessions.reduce((sum, session) => sum + session.caloriesBurned, 0),
      avgSpeed: this.sessions.reduce((sum, session) => sum + session.avgSpeed, 0) / this.sessions.length,
      avgHeartRate: this.sessions.reduce((sum, session) => sum + ((session.heartRateRange.min + session.heartRateRange.max) / 2), 0) / this.sessions.length
    };
  }
  
  // Get weekly stats
  getWeeklyStats() {
    if (this.sessions.length === 0) return "No sessions recorded yet.";
    
    // Group sessions by week
    const weekMap = {};
    
    this.sessions.forEach(session => {
      const date = new Date(session.date);
      const weekNumber = this.getWeekNumber(date);
      const weekKey = `${date.getFullYear()}-W${weekNumber}`;
      
      if (!weekMap[weekKey]) {
        weekMap[weekKey] = {
          week: weekKey,
          sessions: 0,
          totalDuration: 0,
          totalDistance: 0,
          totalCalories: 0,
          avgHeartRate: 0,
          heartRateReadings: 0
        };
      }
      
      weekMap[weekKey].sessions += 1;
      weekMap[weekKey].totalDuration += session.duration;
      weekMap[weekKey].totalDistance += session.distance;
      weekMap[weekKey].totalCalories += session.caloriesBurned;
      
      const sessionAvgHR = (session.heartRateRange.min + session.heartRateRange.max) / 2;
      weekMap[weekKey].avgHeartRate += sessionAvgHR;
      weekMap[weekKey].heartRateReadings += 1;
    });
    
    // Calculate averages and format
    const weeklyStats = Object.values(weekMap).map(week => {
      return {
        week: week.week,
        sessions: week.sessions,
        totalDuration: week.totalDuration,
        totalDistance: parseFloat(week.totalDistance.toFixed(2)),
        totalCalories: week.totalCalories,
        avgHeartRate: Math.round(week.avgHeartRate / week.heartRateReadings),
        avgSpeed: parseFloat((week.totalDistance / (week.totalDuration / 60)).toFixed(2))
      };
    });
    
    return weeklyStats.sort((a, b) => b.week.localeCompare(a.week));
  }
  
  // Helper: Get ISO week number from date
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  }
  
  // Get progress metrics
  getProgressMetrics() {
    if (this.sessions.length < 2) return "Need at least 2 sessions to track progress.";
    
    const firstSession = this.sessions[0];
    const lastSession = this.sessions[this.sessions.length - 1];
    
    return {
      durationChange: {
        value: lastSession.duration - firstSession.duration,
        percent: ((lastSession.duration - firstSession.duration) / firstSession.duration * 100).toFixed(1)
      },
      speedChange: {
        value: (lastSession.avgSpeed - firstSession.avgSpeed).toFixed(2),
        percent: ((lastSession.avgSpeed - firstSession.avgSpeed) / firstSession.avgSpeed * 100).toFixed(1)
      },
      distanceChange: {
        value: (lastSession.distance - firstSession.distance).toFixed(2),
        percent: ((lastSession.distance - firstSession.distance) / firstSession.distance * 100).toFixed(1)
      },
      heartRateChange: {
        value: (((lastSession.heartRateRange.min + lastSession.heartRateRange.max) / 2) - 
                ((firstSession.heartRateRange.min + firstSession.heartRateRange.max) / 2)).toFixed(0)
      },
      totalSessions: this.sessions.length,
      daysBetween: this.daysBetween(new Date(firstSession.date), new Date(lastSession.date)),
      totalDistance: this.sessions.reduce((sum, session) => sum + session.distance, 0).toFixed(2)
    };
  }
  
  // Helper: Calculate days between two dates
  daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((date1 - date2) / oneDay));
  }
  
  // Get most recent session
  getLatestSession() {
    if (this.sessions.length === 0) return null;
    return this.sessions[this.sessions.length - 1];
  }
  
  // Get all sessions
  getAllSessions() {
    return this.sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  // Get body stats data
  getBodyStats() {
    return this.bodyStats.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  
  // Get latest body stats measurement
  getLatestBodyStats() {
    if (this.bodyStats.length === 0) return null;
    const sortedStats = this.bodyStats.sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedStats[0];
  }
  
  // Get body stats trends
  getBodyStatsTrends() {
    if (this.bodyStats.length < 2) return "Need at least 2 measurements to show trends.";
    
    const sortedStats = this.getBodyStats();
    const first = sortedStats[0];
    const last = sortedStats[sortedStats.length - 1];
    const daysBetween = this.daysBetween(new Date(first.date), new Date(last.date));
    
    const trends = {
      totalMeasurements: sortedStats.length,
      daysBetween: daysBetween,
      changes: {}
    };
    
    // Calculate changes for each metric
    if (first.weight && last.weight) {
      trends.changes.weight = {
        start: first.weight,
        current: last.weight,
        change: last.weight - first.weight,
        percentChange: ((last.weight - first.weight) / first.weight * 100).toFixed(1)
      };
    }
    
    if (first.bmi && last.bmi) {
      trends.changes.bmi = {
        start: first.bmi,
        current: last.bmi,
        change: last.bmi - first.bmi,
        percentChange: ((last.bmi - first.bmi) / first.bmi * 100).toFixed(1)
      };
    }
    
    if (first.bodyFat && last.bodyFat) {
      trends.changes.bodyFat = {
        start: first.bodyFat,
        current: last.bodyFat,
        change: last.bodyFat - first.bodyFat,
        percentChange: ((last.bodyFat - first.bodyFat) / first.bodyFat * 100).toFixed(1)
      };
    }
    
    if (first.muscleMass && last.muscleMass) {
      trends.changes.muscleMass = {
        start: first.muscleMass,
        current: last.muscleMass,
        change: last.muscleMass - first.muscleMass,
        percentChange: ((last.muscleMass - first.muscleMass) / first.muscleMass * 100).toFixed(1)
      };
    }
    
    if (first.bodyWater && last.bodyWater) {
      trends.changes.bodyWater = {
        start: first.bodyWater,
        current: last.bodyWater,
        change: last.bodyWater - first.bodyWater,
        percentChange: ((last.bodyWater - first.bodyWater) / first.bodyWater * 100).toFixed(1)
      };
    }
    
    return trends;
  }
  
  // Export data as JSON string for saving
  exportData() {
    return JSON.stringify({
      profile: this.profile,
      sessions: this.sessions,
      bodyStats: this.bodyStats
    }, null, 2);
  }
  
  // Import data from JSON string
  importData(jsonString) {
    const data = JSON.parse(jsonString);
    this.profile = data.profile;
    this.sessions = data.sessions;
    this.bodyStats = data.bodyStats || [];
    return this;
  }
}

// Make available for browser or Node.js
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = RowingTracker;
} else {
  window.RowingTracker = RowingTracker;
}
