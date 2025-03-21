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
    
    // ====== ROWING CALCULATOR FUNCTIONS ======
    
    // DOM Elements for rowing calculator
    const durationInput = document.getElementById('duration');
    const distanceInput = document.getElementById('distance');
    const speedInput = document.getElementById('avgSpeed');
    const caloriesInput = document.getElementById('calories');
    const intensityDisplay = document.getElementById('intensityDisplay');
    
    // Initialize rowing calculator
    function initRowingCalculator() {
        // Set up event listeners for all three inputs
        durationInput.addEventListener('input', handleInputChange);
        distanceInput.addEventListener('input', handleInputChange);
        speedInput.addEventListener('input', handleInputChange);
        
        // Add data attributes to track which field was last modified
        durationInput.setAttribute('data-last-modified', 'false');
        distanceInput.setAttribute('data-last-modified', 'false');
        speedInput.setAttribute('data-last-modified', 'false');
        
        // Add auto-calculate indicators
        addAutoCalculateIndicators();
    }
    
    // Handler for input changes
    function handleInputChange(event) {
        // Reset last-modified flags
        resetLastModified();
        
        // Set the current input as the last modified
        event.target.setAttribute('data-last-modified', 'true');
        
        // Calculate missing values
        calculateMissingValues();
        
        // Update indicators
        updateCalculationIndicators();
        
        // Calculate calories if we have speed and duration
        if (speedInput.value && durationInput.value) {
            calculateCalories();
        }
    }
    
    // Function to reset all last-modified flags
    function resetLastModified() {
        durationInput.setAttribute('data-last-modified', 'false');
        distanceInput.setAttribute('data-last-modified', 'false');
        speedInput.setAttribute('data-last-modified', 'false');
    }
    
    // Calculate missing field based on the other two
    function calculateMissingValues() {
        // Get current values (parseFloat returns NaN if not a valid number)
        const duration = parseFloat(durationInput.value);
        const distance = parseFloat(distanceInput.value);
        const speed = parseFloat(speedInput.value);
        
        // Check which field was last modified
        const durationLastModified = durationInput.getAttribute('data-last-modified') === 'true';
        const distanceLastModified = distanceInput.getAttribute('data-last-modified') === 'true';
        const speedLastModified = speedInput.getAttribute('data-last-modified') === 'true';
        
        // Calculate the missing value
        // If distance and speed are valid, calculate duration
        if (!isNaN(distance) && !isNaN(speed) && speed > 0 && (distanceLastModified || speedLastModified)) {
            // duration = distance / speed * 60 (convert to minutes)
            const calculatedDuration = (distance / speed) * 60;
            durationInput.value = calculatedDuration.toFixed(1);
        }
        // If duration and speed are valid, calculate distance
        else if (!isNaN(duration) && !isNaN(speed) && (durationLastModified || speedLastModified)) {
            // distance = duration / 60 * speed (convert minutes to hours)
            const calculatedDistance = (duration / 60) * speed;
            distanceInput.value = calculatedDistance.toFixed(2);
        }
        // If duration and distance are valid, calculate speed
        else if (!isNaN(duration) && !isNaN(distance) && duration > 0 && (durationLastModified || distanceLastModified)) {
            // speed = distance / (duration / 60) (convert minutes to hours)
            const calculatedSpeed = distance / (duration / 60);
            speedInput.value = calculatedSpeed.toFixed(2);
        }
    }
    
    // Add visual indicators showing which field will be auto-calculated
    function addAutoCalculateIndicators() {
        // Create styling for the auto-calculate indicators
        const style = document.createElement('style');
        style.textContent = `
            .auto-calculate-indicator {
                font-size: 0.8rem;
                color: #6c757d;
                margin-top: 0.25rem;
                display: none;
            }
            
            .form-label.auto-calculate-active {
                color: #0d6efd;
                font-weight: bold;
            }
            
            .form-control.auto-calculate-target {
                background-color: rgba(13, 110, 253, 0.05);
                border-color: #0d6efd;
            }
            
            [data-theme="dark"] .form-control.auto-calculate-target {
                background-color: rgba(13, 110, 253, 0.15);
            }
        `;
        document.head.appendChild(style);
        
        // Get labels
        const durationLabel = document.querySelector('label[for="duration"]');
        const distanceLabel = document.querySelector('label[for="distance"]');
        const speedLabel = document.querySelector('label[for="avgSpeed"]');
        
        // Create indicator elements
        const durationIndicator = document.createElement('div');
        durationIndicator.className = 'auto-calculate-indicator';
        durationIndicator.id = 'durationIndicator';
        durationIndicator.textContent = 'Will auto-calculate';
        
        const distanceIndicator = document.createElement('div');
        distanceIndicator.className = 'auto-calculate-indicator';
        distanceIndicator.id = 'distanceIndicator';
        distanceIndicator.textContent = 'Will auto-calculate';
        
        const speedIndicator = document.createElement('div');
        speedIndicator.className = 'auto-calculate-indicator';
        speedIndicator.id = 'speedIndicator';
        speedIndicator.textContent = 'Will auto-calculate';
        
        // Add indicators after inputs
        document.getElementById('duration').parentNode.appendChild(durationIndicator);
        document.getElementById('distance').parentNode.appendChild(distanceIndicator);
        document.getElementById('avgSpeed').parentNode.appendChild(speedIndicator);
        
        // Add event listeners to update indicators
        durationInput.addEventListener('focus', updateCalculationIndicators);
        distanceInput.addEventListener('focus', updateCalculationIndicators);
        speedInput.addEventListener('focus', updateCalculationIndicators);
    }
    
    // Update visual indicators
    function updateCalculationIndicators() {
        // Get indicator elements
        const durationIndicator = document.getElementById('durationIndicator');
        const distanceIndicator = document.getElementById('distanceIndicator');
        const speedIndicator = document.getElementById('speedIndicator');
        
        // Get labels
        const durationLabel = document.querySelector('label[for="duration"]');
        const distanceLabel = document.querySelector('label[for="distance"]');
        const speedLabel = document.querySelector('label[for="avgSpeed"]');
        
        // Reset all indicators and styling
        [durationIndicator, distanceIndicator, speedIndicator].forEach(ind => {
            if (ind) ind.style.display = 'none';
        });
        
        [durationLabel, distanceLabel, speedLabel].forEach(label => {
            if (label) label.classList.remove('auto-calculate-active');
        });
        
        [durationInput, distanceInput, speedInput].forEach(input => {
            if (input) input.classList.remove('auto-calculate-target');
        });
        
        // Get current values
        const duration = parseFloat(durationInput.value);
        const distance = parseFloat(distanceInput.value);
        const speed = parseFloat(speedInput.value);
        
        // Get last modified status
        const durationLastModified = durationInput.getAttribute('data-last-modified') === 'true';
        const distanceLastModified = distanceInput.getAttribute('data-last-modified') === 'true';
        const speedLastModified = speedInput.getAttribute('data-last-modified') === 'true';
        
        // Show indicators based on which fields are filled and last modified
        
        // If distance and speed are filled/modified, show duration will be calculated
        if (!isNaN(distance) && !isNaN(speed) && speed > 0 && (distanceLastModified || speedLastModified)) {
            durationIndicator.style.display = 'block';
            durationLabel.classList.add('auto-calculate-active');
            durationInput.classList.add('auto-calculate-target');
        }
        // If duration and speed are filled/modified, show distance will be calculated
        else if (!isNaN(duration) && !isNaN(speed) && (durationLastModified || speedLastModified)) {
            distanceIndicator.style.display = 'block';
            distanceLabel.classList.add('auto-calculate-active');
            distanceInput.classList.add('auto-calculate-target');
        }
        // If duration and distance are filled/modified, show speed will be calculated
        else if (!isNaN(duration) && !isNaN(distance) && duration > 0 && (durationLastModified || distanceLastModified)) {
            speedIndicator.style.display = 'block';
            speedLabel.classList.add('auto-calculate-active');
            speedInput.classList.add('auto-calculate-target');
        }
    }
    
    // ====== CALORIE CALCULATOR ======
    
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
        const duration = parseFloat(durationInput.value); // in minutes
        const speed = parseFloat(speedInput.value); // in mph
        
        if (weight && duration && speed) {
            // Determine MET value based on speed
            const metValue = getMETValue(speed);
            
            // Update intensity display
            intensityDisplay.value = getIntensityDescription(speed);
            
            // Convert weight from lbs to kg
            const weightKg = weight * 0.45359237;
            
            // Formula: Calories = (MET × weight in kg × 3.5) ÷ 200 × duration in minutes
            const caloriesPerMinute = (metValue * weightKg * 3.5) / 200;
            const totalCalories = Math.round(caloriesPerMinute * duration);
            
            caloriesInput.value = totalCalories;
        }
    }
    
    // ====== DATA LOADING & INITIALIZATION ======
    
    // Set today's date as default for date inputs
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('statsDate').valueAsDate = new Date();
    
    // Try to load data from localStorage
    function tryLoadingData() {
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
        const duration = durationInput.value;
        const distance = distanceInput.value;
        const avgSpeed = speedInput.value;
        const heartRate = document.getElementById('heartRate').value || null; // Optional heart rate
        const calories = caloriesInput.value; // Auto-calculated
        const strokeRate = document.getElementById('strokeRate').value || null;
        const notes = document.getElementById('notes').value;
        
        // Add intensity info to notes
        const intensity = intensityDisplay.value;
        const updatedNotes = notes ? `${notes} [${intensity}]` : `[${intensity}]`;
        
        tracker.addSession(date, duration, distance, avgSpeed, heartRate, calories, strokeRate, updatedNotes);
        saveData();
        refreshUI();
        
        // Reset form
        sessionForm.reset();
        
        // Reset auto-calculation indicators
        document.querySelectorAll('.auto-calculate-indicator').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.form-label').forEach(el => el.classList.remove('auto-calculate-active'));
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('auto-calculate-target'));
        
        // Reset date to today
        document.getElementById('date').valueAsDate = new Date();
        
        showToast('Session added successfully!');
    });

    // Export button click
    exportBtn.addEventListener('click', function() {
        exportBox.value = tracker.exportData();
        exportBox.select();
        document.getElementById('exportBoxContainer').classList.add('show');
        showToast('Data exported. Copy to save it.');
    });

    // Import button click
    importBtn.addEventListener('click', function() {
        document.getElementById('exportBoxContainer').classList.add('show');
        
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
            let progressHtml = `
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
                        </p>`;
                        
            // Only show heart rate change if we have the data
            if (progressStats.heartRateChange) {
                progressHtml += `
                        <p><strong>Heart Rate Change:</strong> 
                            <span class="${progressStats.heartRateChange.value < 0 ? 'text-success' : 'text-danger'}">
                                ${progressStats.heartRateChange.value > 0 ? '+' : ''}${progressStats.heartRateChange.value} BPM
                            </span>
                        </p>`;
            }
            
            progressHtml += `
                    </div>
                </div>
            `;
            
            progressStatsEl.innerHTML = progressHtml;
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
                <p><strong>Average Speed:</strong> ${totalStats.avgSpeed.toFixed(2)} mph</p>`;
                
            // Only show average heart rate if we have data
            if (totalStats.avgHeartRate > 0) {
                statsHTML += `<p><strong>Average Heart Rate:</strong> ${totalStats.avgHeartRate.toFixed(0)} BPM</p>`;
            }
            
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
                        <td>${week.totalDuration.toFixed(0)} min</td>
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
                // Fix for time/date issue, grabbing timezone from local browser
                const [year, month, day] = stat.date.split('-').map(num => parseInt(num, 10));
                const date = new Date(year, month - 1, day); // month is 0-indexed in JS Date
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
            
            sessions.forEach((session) => {
                const date = new Date(session.date);
                const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                
                sessionsHtml += `
                    <div class="card session-card mb-2">
                        <div class="card-body py-2">
                            <h6 class="card-title">${formattedDate}</h6>
                            <div class="row">
                                <div class="col-md-4">
                                    <p class="mb-1"><strong>Duration:</strong> ${session.duration} min</p>
                                    <p class="mb-1"><strong>Distance:</strong> ${session.distance} mi</p>
                                </div>
                                <div class="col-md-4">
                                    <p class="mb-1"><strong>Speed:</strong> ${session.avgSpeed} mph</p>
                                    <p class="mb-1"><strong>HR:</strong> ${session.heartRate ? session.heartRate + ' BPM' : 'N/A'}</p>
                                </div>
                                <div class="col-md-4">
                                    <p class="mb-1"><strong>Calories:</strong> ${session.caloriesBurned}</p>
                                    <p class="mb-1"><strong>SPM:</strong> ${session.strokeRate || 'N/A'}</p>
                                </div>
                            </div>
                            ${session.notes ? `<p class="mb-0 small fst-italic">${session.notes}</p>` : ''}
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
    
    // Set up collapsible elements for import/export box
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(button => {
        button.addEventListener('click', function() {
            const target = document.querySelector(this.getAttribute('data-bs-target'));
            if (target) {
                target.classList.toggle('show');
                
                // Update arrow icon
                const arrow = this.querySelector('.small');
                if (arrow) {
                    arrow.textContent = target.classList.contains('show') ? '⯅' : '⯆';
                }
            }
        });
    });

    // Initialize rowing calculator
    initRowingCalculator();
    
    // Initial UI refresh
    refreshUI();
});
