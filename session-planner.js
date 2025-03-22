// session-planner.js - Handles session planning based on beginner workout plan
class SessionPlanner {
  constructor(tracker) {
    this.tracker = tracker;
    this.beginnerPlan = {
      week1: {
        sessions: 3,
        sessionFormat: "3-minute warm-up (14-16 SPM)\n30 seconds rowing (16-18 SPM) / 90 seconds very light rowing or rest (12-14 SPM) × 4-5 rounds",
        duration: "10-15",
        targetHeartRate: "120-140",
        focus: "Form perfection, controlled breathing, lower intensity",
        spm: {
          warmup: "14-16",
          work: "16-18",
          recovery: "12-14"
        }
      },
      week2: {
        sessions: 4,
        sessionFormat: "5-minute warm-up (16-18 SPM)\n1 minute (18-20 SPM) / 1 minute recovery (14-16 SPM) × 8-10 rounds",
        duration: "15-20",
        targetHeartRate: "130-150",
        focus: "Maintaining lower SPM with good technique, controlling heart rate",
        spm: {
          warmup: "16-18",
          work: "18-20",
          recovery: "14-16"
        }
      },
      week3: {
        sessions: 4,
        sessionFormat: "5-minute warm-up (16-18 SPM)\n2 minutes (18-22 SPM) / 1 minute recovery (14-16 SPM) × 8 rounds",
        duration: "20-25",
        targetHeartRate: "140-160",
        focus: "Consistent effort with good breathing control",
        spm: {
          warmup: "16-18",
          work: "18-22",
          recovery: "14-16"
        }
      },
      week4: {
        sessions: 4,
        sessionFormat: "5-minute warm-up (16-18 SPM)\n15-20 minutes steady rowing (18-20 SPM)\n5-minute cool-down (14-16 SPM)",
        duration: "25-30",
        targetHeartRate: "Below 160",
        focus: "Maintaining comfortable pace with good form",
        spm: {
          warmup: "16-18",
          work: "18-20",
          cooldown: "14-16"
        }
      }
    };
  }

  // Determine current week in plan based on session history
  determineCurrentWeek() {
    const sessions = this.tracker.getAllSessions();
    
    if (sessions.length === 0) {
      return "week1"; // New user, start at week 1
    }
    
    const sessionsPerWeek = {
      week1: 3,
      week2: 4,
      week3: 4,
      week4: 4
    };
    
    // Count completed sessions
    const totalSessions = sessions.length;
    
    // Calculate completed weeks and remaining sessions
    let completedSessions = 0;
    let currentWeek = "week1";
    
    for (let week of Object.keys(this.beginnerPlan)) {
      const weekSessions = sessionsPerWeek[week];
      
      if (completedSessions + weekSessions <= totalSessions) {
        // This week is completed
        completedSessions += weekSessions;
        // Move to next week if not already at week 4
        if (week !== "week4") {
          currentWeek = `week${parseInt(week.replace('week', '')) + 1}`;
        }
      } else {
        // This week is in progress
        currentWeek = week;
        break;
      }
    }
    
    return currentWeek;
  }
  
  // Get progression percentage through the entire plan
  getPlanProgressPercentage() {
    const currentWeek = this.determineCurrentWeek();
    const sessions = this.tracker.getAllSessions();
    const totalSessions = 15; // Total sessions across all 4 weeks (3+4+4+4)
    
    // Calculate completed sessions up to current week
    let completedSessions = 0;
    
    if (sessions.length > 0) {
      if (currentWeek === "week1") {
        completedSessions = sessions.length;
      } else if (currentWeek === "week2") {
        completedSessions = 3 + sessions.length - 3; // Week 1 + current progress
      } else if (currentWeek === "week3") {
        completedSessions = 3 + 4 + sessions.length - 7; // Week 1 + Week 2 + current progress
      } else if (currentWeek === "week4") {
        completedSessions = 3 + 4 + 4 + sessions.length - 11; // Week 1 + Week 2 + Week 3 + current progress
      }
    }
    
    return Math.round((completedSessions / totalSessions) * 100);
  }
  
  // Get details for the next session
  getNextSessionDetails() {
    const currentWeek = this.determineCurrentWeek();
    const weekPlan = this.beginnerPlan[currentWeek];
    const sessions = this.tracker.getAllSessions();
    
    // Calculate session number within the week
    let sessionInWeek = 1;
    
    if (sessions.length > 0) {
      if (currentWeek === "week1") {
        sessionInWeek = (sessions.length % 3) + 1;
      } else if (currentWeek === "week2") {
        sessionInWeek = ((sessions.length - 3) % 4) + 1;
      } else if (currentWeek === "week3") {
        sessionInWeek = ((sessions.length - 7) % 4) + 1;
      } else if (currentWeek === "week4") {
        sessionInWeek = ((sessions.length - 11) % 4) + 1;
      }
    }
    
    // Parse duration range
    const durationRange = weekPlan.duration.split('-');
    const minDuration = parseInt(durationRange[0]);
    const maxDuration = parseInt(durationRange[1]);
    
    // Parse heart rate range
    const hrRange = weekPlan.targetHeartRate.split('-');
    const minHR = hrRange.length > 1 ? parseInt(hrRange[0]) : 0;
    const maxHR = hrRange.length > 1 ? parseInt(hrRange[1]) : parseInt(hrRange[0].replace('Below ', ''));
    
    return {
      week: currentWeek.replace('week', ''),
      sessionNumber: sessionInWeek,
      totalSessionsInWeek: weekPlan.sessions,
      format: weekPlan.sessionFormat,
      durationMin: minDuration,
      durationMax: maxDuration,
      heartRateMin: minHR,
      heartRateMax: maxHR,
      focus: weekPlan.focus,
      spm: weekPlan.spm,
      planProgress: this.getPlanProgressPercentage()
    };
  }
  
  // Analyze a completed session against target metrics
  analyzeSessionPerformance(sessionData) {
    const currentWeek = this.determineCurrentWeek();
    const weekPlan = this.beginnerPlan[currentWeek];
    
    // Parse duration range
    const durationRange = weekPlan.duration.split('-');
    const minDuration = parseInt(durationRange[0]);
    const maxDuration = parseInt(durationRange[1]);
    
    // Parse heart rate range
    const hrRange = weekPlan.targetHeartRate.split('-');
    const minHR = hrRange.length > 1 ? parseInt(hrRange[0]) : 0;
    const maxHR = hrRange.length > 1 ? parseInt(hrRange[1]) : parseInt(hrRange[0].replace('Below ', ''));
    
    // Analysis results
    const analysis = {
      duration: {
        target: `${minDuration}-${maxDuration} minutes`,
        actual: sessionData.duration,
        status: 'on_target',
        message: ''
      },
      heartRate: {
        target: weekPlan.targetHeartRate + ' BPM',
        actual: sessionData.heartRate,
        status: 'no_data',
        message: ''
      },
      strokeRate: {
        target: `Warm-up: ${weekPlan.spm.warmup} SPM, Work: ${weekPlan.spm.work} SPM`,
        actual: sessionData.strokeRate,
        status: 'no_data',
        message: ''
      },
      overall: {
        status: 'on_target',
        message: 'Great job! Your session metrics were on target.'
      }
    };
    
    // Check duration
    if (sessionData.duration < minDuration) {
      analysis.duration.status = 'below_target';
      analysis.duration.message = `Your session was shorter than the recommended ${minDuration} minutes. Try to extend your workout next time.`;
    } else if (sessionData.duration > maxDuration + 5) {
      analysis.duration.status = 'above_target';
      analysis.duration.message = `Your session was longer than the recommended ${maxDuration} minutes. That's great endurance, but be careful not to overdo it as a beginner.`;
    } else {
      analysis.duration.message = `Your session duration was perfect for your current training week.`;
    }
    
    // Check heart rate if data exists
    if (sessionData.heartRate) {
      analysis.heartRate.status = 'on_target';
      
      if (sessionData.heartRate < minHR) {
        analysis.heartRate.status = 'below_target';
        analysis.heartRate.message = `Your heart rate was below the target zone. Consider increasing intensity slightly next time.`;
      } else if (sessionData.heartRate > maxHR + 10) {
        analysis.heartRate.status = 'above_target';
        analysis.heartRate.message = `Your heart rate was above the recommended zone. Focus on controlled breathing and proper form to manage intensity.`;
      } else {
        analysis.heartRate.message = `Your heart rate was in the perfect training zone.`;
      }
    }
    
    // Check stroke rate if data exists
    if (sessionData.strokeRate) {
      analysis.strokeRate.status = 'on_target';
      
      // Extract work SPM range
      const workSPMRange = weekPlan.spm.work.split('-');
      const minWorkSPM = parseInt(workSPMRange[0]);
      const maxWorkSPM = parseInt(workSPMRange[1]);
      
      if (sessionData.strokeRate < minWorkSPM - 2) {
        analysis.strokeRate.status = 'below_target';
        analysis.strokeRate.message = `Your stroke rate was lower than recommended. Try to increase to at least ${minWorkSPM} SPM during work intervals.`;
      } else if (sessionData.strokeRate > maxWorkSPM + 2) {
        analysis.strokeRate.status = 'above_target';
        analysis.strokeRate.message = `Your stroke rate was higher than recommended. Focus on power per stroke rather than frequency.`;
      } else {
        analysis.strokeRate.message = `Your stroke rate was in the ideal range.`;
      }
    }
    
    // Determine overall status
    const statuses = [
      analysis.duration.status,
      analysis.heartRate.status !== 'no_data' ? analysis.heartRate.status : null,
      analysis.strokeRate.status !== 'no_data' ? analysis.strokeRate.status : null
    ].filter(status => status !== null);
    
    if (statuses.includes('below_target') && statuses.includes('above_target')) {
      analysis.overall.status = 'mixed';
      analysis.overall.message = 'Your session had mixed results. Check the detailed feedback to improve.';
    } else if (statuses.includes('below_target')) {
      analysis.overall.status = 'below_target';
      analysis.overall.message = 'Your session was below target in some areas. See details for ways to improve.';
    } else if (statuses.includes('above_target')) {
      analysis.overall.status = 'above_target';
      analysis.overall.message = 'Your session exceeded targets in some areas. Great effort, but check details for balance.';
    }
    
    return analysis;
  }
  
  // Get a suggested next session date
  suggestNextSessionDate() {
    const sessions = this.tracker.getAllSessions();
    const currentWeek = this.determineCurrentWeek();
    const weekPlan = this.beginnerPlan[currentWeek];
    
    // Default to tomorrow if no sessions
    if (sessions.length === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }
    
    // Get the latest session date
    const latestSession = this.tracker.getLatestSession();
    const latestDate = new Date(latestSession.date);
    
    // Suggested rest period based on week
    let restDays = 2; // Default 2 days between sessions
    
    if (currentWeek === "week1") {
      // Mon/Wed/Fri pattern suggests 2 days between sessions
      restDays = 2;
    } else {
      // For week 2-4, slightly less rest between sessions (3-4 sessions per week)
      restDays = 1;
    }
    
    // Calculate next session date
    const nextDate = new Date(latestDate);
    nextDate.setDate(nextDate.getDate() + restDays);
    
    return nextDate.toISOString().split('T')[0];
  }
}

// Make available for browser
if (typeof window !== 'undefined') {
  window.SessionPlanner = SessionPlanner;
}