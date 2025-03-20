// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tracker
    let tracker = new RowingTracker();
    let weightChart = null;
    
    // DOM Elements
    const bodyStatsForm = document.getElementById('bodyStatsForm');
    const sessionForm = document.getElementById('sessionForm');
    const exportBox = document.getElementById('exportBox');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const toggleSwitch = document.querySelector('#checkbox');
    const themeIcon = document.querySelector('.theme-icon');

    // ====== THEME FUNCTIONALITY ======
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme on load
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleSwitch.checked = true;
        themeIcon.textContent = '☀️';
    }
    
    // Handle toggle switch changes
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.textContent = '☀️';
            
            // Update chart theme if chart exists
            if (weightChart) {
                updateChartTheme('dark');
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.textContent = '🌙';
            
            // Update chart theme if chart exists
            if (weightChart) {
                updateChartTheme('light');
            }
        }
    }
    
    // Function to update chart colors based on theme
    function updateChartTheme(theme) {
        if (!weightChart) return;
        
        const textColor = theme === 'dark' ? '#f8f9fa' : '#212529';
        const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        // Update chart options
        weightChart.options.scales.x.ticks.color = textColor;
        weightChart.options.scales.x.grid.color = gridColor;
        weightChart.options.scales.x.title.color = textColor;
        
        weightChart.options.scales.y.ticks.color = textColor;
        weightChart.options.scales.y.grid.color = gridColor;
        weightChart.options.scales.y.title.color = textColor;
        
        weightChart.options.scales.y1.ticks.color = textColor;
        weightChart.options.scales.y1.grid.color = gridColor;
        weightChart.options.scales.y1.title.color = textColor;
        
        weightChart.options.plugins.legend.labels.color = textColor;
        
        weightChart.update();
    }
    
    // Add event listener for theme toggle
    toggleSwitch.addEventListener('change', switchTheme);
    
    // ====== CALORIE CALCULATOR ======
    
    // Add event listeners for auto-calculating calories
    document.getElementById('duration').addEventListener('input', calculateCalories);
    document.getElementById('avgSpeed').addEventListener('input', calculateCalories);
    
    // Function to determine MET value based on speed
    function getMETValue(speed) {
        // Using the MET values based on rowing speed
        if (speed < 2.0) {
            return 2.0; // Below the provided range, using minimum
        } else if (speed >= 2.0 && speed < 4.0) {
            return 2.8; // Canoeing, rowing, 2.0-3.9 mph, light effort
        } else if (speed >= 4.0 && speed < 6.0) {
            return 5.8; // Canoeing, rowing, 4.0-5.9 mph, moderate effort
        } else if (speed >= 6.0) {
            return 12.0; // Canoeing, rowing, kayaking, competition, > 6 mph, vigorous effort
        }
        
        // Default value if somehow none of the conditions are met
        return 5.8;
    }
    
    // Function to get intensity level description
    function getIntensityDescription(speed) {
        if (speed < 2.0) {
            return "Very Light Effort (2.0 MET)";
        } else if (speed >= 2.0 && speed < 4.0) {
            return "Light Effort (2.8 MET)";
        } else if (speed >= 4.0 && speed < 6.0) {
            return "Moderate Effort (5.8 MET)";
        } else if (speed >= 6.0) {
            return "Vigorous Effort (12.0 MET)";
        }
        
        return "Calculating...";
    }
    
    // Calculate calories based on formula
    function calculateCalories() {
        // Get the latest body stats for weight
        const latestStats = tracker.getLatestBodyStats();
        if (!latestStats || !latestStats.weight) {
            showToast('Please add body measurements first to calculate calories', 'warning');
            return;
        }
        
        const weight = latestStats.weight; // in lbs
        const duration = parseFloat(document.getElementById('duration').value); // in minutes
        const speed = parseFloat(document.getElementById('avgSpeed').value); // in mph
        
        if (weight && duration && speed) {
            // Determine MET value based on speed
            const metValue = getMETValue(speed);
            
            // Update intensity display
            document.getElementById('intensityDisplay').value = getIntensityDescription(speed);
            
            // Convert weight from lbs to kg
            const weightKg = weight * 0.45359237;
            
            // Formula: Calories = (MET × weight in kg × 3.5) ÷ 200 × duration in minutes
            const caloriesPerMinute = (metValue * weightKg * 3.5) / 200;
            const totalCalories = Math.round(caloriesPerMinute * duration);
            
            document.getElementById('calories').value = totalCalories;
        }
    }
    
    // ====== DATA LOADING & INITIALIZATION ======
    
    // Set today's date as default for date inputs
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('statsDate').valueAsDate = new Date();

    // Try to load data from user's JSON file or localStorage
    function tryLoadingData() {
        // First, try localStorage
        const savedData = localStorage.getItem('rowingTrackerData');
        if (savedData) {
            try {
                tracker.importData(savedData);
                refreshUI();
                console.log('Data loaded from localStorage');
                return true;
            } catch (e) {
                console.error('Error loading data from localStorage:', e);
            }
        }
        
        return false;
    }
    
    // Attempt to load data
    const dataLoaded = tryLoadingData();

    // Fill body stats form if latest data exists
    const latestStats = tracker.getLatestBodyStats();
    if (latestStats) {
        // Pre-fill with latest values
        if (latestStats.weight) document.getElementById('statsWeight').value = latestStats.weight;
        if (latestStats.bmi) document.getElementById('statsBmi').value = latestStats.bmi;
        if (latestStats.bodyFat) document.getElementById('bodyFat').value = latestStats.bodyFat;
        if (latestStats.muscleMass) document.getElementById('muscleMass').value = latestStats.muscleMass;
        if (latestStats.bodyWater) document.getElementById('bodyWater').value = latestStats.bodyWater;
    }

    // ====== EVENT HANDLERS ======
    
    // Body Stats form submission
    bodyStatsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const date = document.getElementById('statsDate').value;
        const weight = document.getElementById('statsWeight').value;
        const bmi = document.getElementById('statsBmi').value;
        const bodyFat = document.getElementById('bodyFat').value;
        const muscleMass = document.getElementById('muscleMass').value;
        const bodyWater = document.getElementById('bodyWater').value;
        const notes = document.getElementById('bodyStatsNotes').value;
        
        tracker.addBodyStats(date, weight, bmi, bodyFat, muscleMass, bodyWater, notes);
        
        // Automatically update profile with the new measurements
        tracker.updateProfile(weight, bmi);
        
        // Recalculate calories if form fields are filled
        const speedInput = document.getElementById('avgSpeed');
        const durationInput = document.getElementById('duration');
        if (speedInput.value && durationInput.value) {
            calculateCalories();
        }
        
        saveData();
        refreshUI();
        bodyStatsForm.reset();
        document.getElementById('statsDate').valueAsDate = new Date();
        showToast('Body measurements added successfully!');
    });

    // Session form submission
    sessionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if we have body stats before allowing session submission
        if (!tracker.getLatestBodyStats()) {
            showToast('Please add body measurements before recording a session', 'warning');
            return;
        }
        
        const date = document.getElementById('date').value;
        const duration = document.getElementById('duration').value;
        const distance = document.getElementById('distance').value;
        const avgSpeed = document.getElementById('avgSpeed').value;
        const hrMin = document.getElementById('hrMin').value;
        const hrMax = document.getElementById('hrMax').value;
        const calories = document.getElementById('calories').value; // Auto-calculated
        const strokeRate = document.getElementById('strokeRate').value || null;
        const notes = document.getElementById('notes').value;
        
        // Add intensity info to notes
        const intensityDisplay = document.getElementById('intensityDisplay').value;
        const updatedNotes = notes ? `${notes} [${intensityDisplay}]` : `[${intensityDisplay}]`;
        
        tracker.addSession(date, duration, distance, avgSpeed, hrMin, hrMax, calories, strokeRate, updatedNotes);
        saveData();
        refreshUI();
        sessionForm.reset();
        document.getElementById('date').valueAsDate = new Date();
        document.getElementById('intensityDisplay').value = '';
        
        showToast('Session added successfully!');
    });

    // Export button click
    exportBtn.addEventListener('click', function() {
        exportBox.value = tracker.exportData();
        exportBox.select();
        showToast('Data exported. Copy to save it.');
    });

    // Import button click
    importBtn.addEventListener('click', function() {
        console.log('Import button clicked');
        
        if (exportBox.value.trim() === '') {
            showToast('Please paste data to import first!', 'warning');
            return;
        }
        
        if (confirm("This will replace all your current data. Are you sure?")) {
            try {
                tracker.importData(exportBox.value);
                saveData();
                refreshUI();
                
                // Prefill form fields with latest data
                const latestStats = tracker.getLatestBodyStats();
                if (latestStats) {
                    if (latestStats.weight) document.getElementById('statsWeight').value = latestStats.weight;
                    if (latestStats.bmi) document.getElementById('statsBmi').value = latestStats.bmi;
                    if (latestStats.bodyFat) document.getElementById('bodyFat').value = latestStats.bodyFat;
                    if (latestStats.muscleMass) document.getElementById('muscleMass').value = latestStats.muscleMass;
                    if (latestStats.bodyWater) document.getElementById('bodyWater').value = latestStats.bodyWater;
                }
                
                showToast('Data imported successfully!');
            } catch (e) {
                console.error('Error importing data:', e);
                showToast('Error importing data! Please check the format.', 'error');
            }
        }
    });

    // ====== UI UPDATE FUNCTIONS ======

    // Create body stats chart
    function updateBodyStatsChart() {
        const bodyStats = tracker.getBodyStats();
        
        if (bodyStats.length < 2) {
            return; // Need at least 2 points for a meaningful chart
        }
        
        // Check current theme
        const currentTheme = localStorage.getItem('theme') || 'light';
        const textColor = currentTheme === 'dark' ? '#f8f9fa' : '#212529';
        const gridColor = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        const chartData = {
            labels: bodyStats.map(stat => {
                const date = new Date(stat.date);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }),
            datasets: []
        };
        
        // Add weight dataset if we have weight data
        if (bodyStats.some(stat => stat.weight !== null)) {
            chartData.datasets.push({
                label: 'Weight (lbs)',
                data: bodyStats.map(stat => stat.weight),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                tension: 0.1,
                yAxisID: 'y'
            });
        }
        
        // Add body fat dataset if we have body fat data
        if (bodyStats.some(stat => stat.bodyFat !== null)) {
            chartData.datasets.push({
                label: 'Body Fat %',
                data: bodyStats.map(stat => stat.bodyFat),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.1,
                yAxisID: 'y1'
            });
        }
        
        // Add muscle mass dataset if we have muscle mass data
        if (bodyStats.some(stat => stat.muscleMass !== null)) {
            chartData.datasets.push({
                label: 'Muscle Mass %',
                data: bodyStats.map(stat => stat.muscleMass),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.1,
                yAxisID: 'y1'
            });
        }
        
        // Add body water dataset if we have body water data
        if (bodyStats.some(stat => stat.bodyWater !== null)) {
            chartData.datasets.push({
                label: 'Body Water %',
                data: bodyStats.map(stat => stat.bodyWater),
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.1)',
                tension: 0.1,
                yAxisID: 'y1'
            });
        }
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        color: textColor
                    },
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Weight (lbs)',
                        color: textColor
                    },
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Percentage (%)',
                        color: textColor
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor,
                        drawOnChartArea: false
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };
        
        const chartContainer = document.getElementById('bodyStatsChart');
        chartContainer.innerHTML = '<canvas id="bodyStatsCanvas"></canvas>';
        const ctx = document.getElementById('bodyStatsCanvas').getContext('2d');
        
        if (weightChart) {
            weightChart.destroy();
        }
        
        weightChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions
        });
    }
    
    // Refresh all UI elements
    function refreshUI() {
        // Display current profile info
        const latestStats = tracker.getLatestBodyStats();
        
        // Update progress stats
        const progressStatsEl = document.getElementById('progressStats');
        const progressStats = tracker.getProgressMetrics();
        
        if (typeof progressStats === 'string') {
            progressStatsEl.innerHTML = `<p>${progressStats}</p>`;
        } else {
            progressStatsEl.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Total Sessions:</strong> ${progressStats.totalSessions}</p>
                        <p><strong>Days Active:</strong> ${progressStats.daysBetween}</p>
                        <p><strong>Total Distance:</strong> ${progressStats.totalDistance} miles</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Speed Change:</strong> 
                            <span class="${progressStats.speedChange.value > 0 ? 'text-success' : 'text-danger'}">
                                ${progressStats.speedChange.value > 0 ? '+' : ''}${progressStats.speedChange.value} mph (${progressStats.speedChange.percent}%)
                            </span>
                        </p>
                        <p><strong>Duration Change:</strong> 
                            <span class="${progressStats.durationChange.value > 0 ? 'text-success' : 'text-danger'}">
                                ${progressStats.durationChange.value > 0 ? '+' : ''}${progressStats.durationChange.value} min (${progressStats.durationChange.percent}%)
                            </span>
                        </p>
                        <p><strong>Heart Rate Change:</strong> 
                            <span class="${progressStats.heartRateChange.value < 0 ? 'text-success' : 'text-danger'}">
                                ${progressStats.heartRateChange.value > 0 ? '+' : ''}${progressStats.heartRateChange.value} BPM
                            </span>
                        </p>
                    </div>
                </div>
            `;
        }
        
        // Update total stats
        const totalStatsEl = document.getElementById('totalStats');
        const totalStats = tracker.getTotalStats();
        
        if (typeof totalStats === 'string') {
            totalStatsEl.innerHTML = `<p>${totalStats}</p>`;
        } else {
            let statsHTML = `
                <p><strong>Total Sessions:</strong> ${totalStats.totalSessions}</p>
                <p><strong>Total Duration:</strong> ${totalStats.totalDuration.toFixed(0)} minutes</p>
                <p><strong>Total Distance:</strong> ${totalStats.totalDistance.toFixed(2)} miles</p>
                <p><strong>Total Calories:</strong> ${totalStats.totalCalories.toFixed(0)}</p>
                <p><strong>Average Speed:</strong> ${totalStats.avgSpeed.toFixed(2)} mph</p>
                <p><strong>Average Heart Rate:</strong> ${totalStats.avgHeartRate.toFixed(0)} BPM</p>
            `;
            
            // Add current stats if available
            if (latestStats) {
                statsHTML += `
                    <hr>
                    <p><strong>Current Weight:</strong> ${latestStats.weight} lbs</p>
                    <p><strong>Current BMI:</strong> ${latestStats.bmi}</p>
                `;
            }
            
            totalStatsEl.innerHTML = statsHTML;
        }
        
        // Update weekly stats
        const weeklyStatsEl = document.getElementById('weeklyStats');
        const weeklyStats = tracker.getWeeklyStats();
        
        if (typeof weeklyStats === 'string') {
            weeklyStatsEl.innerHTML = `<p>${weeklyStats}</p>`;
        } else {
            let weeklyHtml = '<div style="max-height: 300px; overflow-y: auto;">';
            weeklyHtml += '<table class="table table-sm"><thead><tr><th>Week</th><th>Sessions</th><th>Duration</th><th>Distance</th><th>Calories</th></tr></thead><tbody>';
            
            weeklyStats.forEach(week => {
                weeklyHtml += `
                    <tr>
                        <td>${week.week}</td>
                        <td>${week.sessions}</td>
                        <td>${week.totalDuration} min</td>
                        <td>${week.totalDistance} mi</td>
                        <td>${week.totalCalories}</td>
                    </tr>
                `;
            });
            
            weeklyHtml += '</tbody></table></div>';
            weeklyStatsEl.innerHTML = weeklyHtml;
        }

        // Update body stats trends
        updateBodyStatsTrends();
        
        // Display body stats list
        updateBodyStatsList();
        
        // Update sessions list
        updateSessionsList();
    }
    
    // Update body stats trends section
    function updateBodyStatsTrends() {
        const bodyStatsTrendsEl = document.getElementById('bodyStatsTrends');
        const bodyStatsTrends = tracker.getBodyStatsTrends();
        
        if (typeof bodyStatsTrends === 'string') {
            bodyStatsTrendsEl.innerHTML = `<p>${bodyStatsTrends}</p>`;
        } else {
            let trendsHtml = '<h6>Changes Over Time</h6>';
            
            if (bodyStatsTrends.changes.weight) {
                const weightChange = bodyStatsTrends.changes.weight;
                trendsHtml += `
                    <p><strong>Weight:</strong> 
                        <span class="${weightChange.change < 0 ? 'text-success' : 'text-danger'}">
                            ${weightChange.change > 0 ? '+' : ''}${weightChange.change.toFixed(1)} lbs (${weightChange.percentChange}%)
                        </span>
                    </p>`;
            }
            
            if (bodyStatsTrends.changes.bmi) {
                const bmiChange = bodyStatsTrends.changes.bmi;
                trendsHtml += `
                    <p><strong>BMI:</strong> 
                        <span class="${bmiChange.change < 0 ? 'text-success' : 'text-danger'}">
                            ${bmiChange.change > 0 ? '+' : ''}${bmiChange.change.toFixed(1)} (${bmiChange.percentChange}%)
                        </span>
                    </p>`;
            }
            
            if (bodyStatsTrends.changes.bodyFat) {
                const bodyFatChange = bodyStatsTrends.changes.bodyFat;
                trendsHtml += `
                    <p><strong>Body Fat:</strong> 
                        <span class="${bodyFatChange.change < 0 ? 'text-success' : 'text-danger'}">
                            ${bodyFatChange.change > 0 ? '+' : ''}${bodyFatChange.change.toFixed(1)}% (${bodyFatChange.percentChange}%)
                        </span>
                    </p>`;
            }
            
            if (bodyStatsTrends.changes.muscleMass) {
                const muscleMassChange = bodyStatsTrends.changes.muscleMass;
                trendsHtml += `
                    <p><strong>Muscle Mass:</strong> 
                        <span class="${muscleMassChange.change > 0 ? 'text-success' : 'text-danger'}">
                            ${muscleMassChange.change > 0 ? '+' : ''}${muscleMassChange.change.toFixed(1)}% (${muscleMassChange.percentChange}%)
                        </span>
                    </p>`;
            }
            
            if (bodyStatsTrends.changes.bodyWater) {
                const bodyWaterChange = bodyStatsTrends.changes.bodyWater;
                trendsHtml += `
                    <p><strong>Body Water:</strong> 
                        <span class="${bodyWaterChange.change > 0 ? 'text-success' : 'text-danger'}">
                            ${bodyWaterChange.change > 0 ? '+' : ''}${bodyWaterChange.change.toFixed(1)}% (${bodyWaterChange.percentChange}%)
                        </span>
                    </p>`;
            }
            
            trendsHtml += `<p><strong>Measurements:</strong> ${bodyStatsTrends.totalMeasurements} over ${bodyStatsTrends.daysBetween} days</p>`;
            
            bodyStatsTrendsEl.innerHTML = trendsHtml;
            
            // Update the chart
            updateBodyStatsChart();
        }
    }
    
    // Update body stats list section
    function updateBodyStatsList() {
        const bodyStatsList = document.getElementById('bodyStatsList');
        const bodyStats = tracker.getBodyStats();
        
        if (bodyStats.length === 0) {
            bodyStatsList.innerHTML = '<p>No measurements recorded yet.</p>';
        } else {
            let statsHtml = '<div style="max-height: 400px; overflow-y: auto;">';
            
            // Sort by date (newest first)
            const sortedStats = [...bodyStats].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            sortedStats.forEach(stat => {
                const date = new Date(stat.date);
                const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                
                statsHtml += `
                    <div class="card mb-2">
                        <div class="card-body py-2">
                            <h6 class="card-title">${formattedDate}</h6>
                            <div class="row">
                                <div class="col-6">
                                    ${stat.weight ? `<p class="mb-1"><strong>Weight:</strong> ${stat.weight} lbs</p>` : ''}
                                    ${stat.bmi ? `<p class="mb-1"><strong>BMI:</strong> ${stat.bmi}</p>` : ''}
                                </div>
                                <div class="col-6">
                                    ${stat.bodyFat ? `<p class="mb-1"><strong>Body Fat:</strong> ${stat.bodyFat}%</p>` : ''}
                                    ${stat.muscleMass ? `<p class="mb-1"><strong>Muscle Mass:</strong> ${stat.muscleMass}%</p>` : ''}
                                    ${stat.bodyWater ? `<p class="mb-1"><strong>Body Water:</strong> ${stat.bodyWater}%</p>` : ''}
                                </div>
                            </div>
                            ${stat.notes ? `<p class="mb-0 small fst-italic">${stat.notes}</p>` : ''}
                        </div>
                    </div>
                `;
            });
            
            statsHtml += '</div>';
            bodyStatsList.innerHTML = statsHtml;
        }
    }
    
    // Update sessions list section
    function updateSessionsList() {
        const sessionsListEl = document.getElementById('sessionsList');
        const sessions = tracker.getAllSessions();
        
        if (sessions.length === 0) {
            sessionsListEl.innerHTML = '<p>No sessions recorded yet.</p>';
        } else {
            let sessionsHtml = '<div style="max-height: 400px; overflow-y: auto;">';
            
            sessions.forEach((session, index) => {
                const date = new Date(session.date);
                const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const avgHR = Math.round((session.heartRateRange.min + session.heartRateRange.max) / 2);
                
                sessionsHtml += `
                    <div class="card session-card">
                        <div class="card-body">
                            <h5 class="card-title">${formattedDate}</h5>
                            <div class="row">
                                <div class="col-md-3">
                                    <p class="mb-1"><strong>Duration:</strong> ${session.duration} min</p>
                                    <p class="mb-1"><strong>Distance:</strong> ${session.distance} mi</p>
                                </div>
                                <div class="col-md-3">
                                    <p class="mb-1"><strong>Speed:</strong> ${session.avgSpeed} mph</p>
                                    <p class="mb-1"><strong>HR:</strong> ${session.heartRateRange.min}-${session.heartRateRange.max} BPM</p>
                                </div>
                                <div class="col-md-3">
                                    <p class="mb-1"><strong>Calories:</strong> ${session.caloriesBurned}</p>
                                    <p class="mb-1"><strong>SPM:</strong> ${session.strokeRate || 'N/A'}</p>
                                </div>
                                <div class="col-md-3">
                                    ${session.notes ? `<p class="mb-1"><em>${session.notes}</em></p>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            sessionsHtml += '</div>';
            sessionsListEl.innerHTML = sessionsHtml;
        }
    }

    // ====== UTILITY FUNCTIONS ======
    
    // Save data to localStorage
    function saveData() {
        localStorage.setItem('rowingTrackerData', tracker.exportData());
    }

    // Initial UI refresh
    refreshUI();
              });