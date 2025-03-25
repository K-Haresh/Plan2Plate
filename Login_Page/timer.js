document.addEventListener('DOMContentLoaded', function() {
    const teamSelect = document.getElementById('teamSelect');
    const addTeamBtn = document.getElementById('addTeamBtn');
    const timersContainer = document.getElementById('timersContainer');

    let teams = [];
    let timers = {};

    // Function to add a new team
    function addTeam(teamName) {
        teams.push(teamName);
        updateTeamSelect();
        createTimer(teamName);
    }

    // Function to update the team select dropdown
    function updateTeamSelect() {
        teamSelect.innerHTML = '';
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamSelect.appendChild(option);
        });
    }

    // Function to create a new timer for a team
    function createTimer(teamName) {
        const timerDiv = document.createElement('div');
        timerDiv.className = 'timer';
        timerDiv.id = teamName + 'Timer';

        // ADD AUDIO SELECT ELEMENT HERE
        const audioSelectId = `${teamName}AudioSelect`;
        const audioSelect = document.createElement('select');
        audioSelect.id = audioSelectId;

        const audioOptions = [
            { value: 'sounds/Alarm_retro.wav', text: 'Alarm' },
            { value: './ding.mp3', text: 'Ding' },
            { value: './chime.mp3', text: 'Chime' }
        ];

        audioOptions.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.textContent = optionData.text;
            audioSelect.appendChild(option);
        });

        const timerHTML = `
            <h3>${teamName} Timer</h3>
            <div id="${teamName}Display">00:00</div>
            <label for="${teamName}Minutes">Minutes:</label>
            <input type="number" id="${teamName}Minutes" placeholder="Minutes" min="0">
            <label for="${teamName}Seconds">Seconds:</label>
            <input type="number" id="${teamName}Seconds" placeholder="Seconds" min="0" max="59">
            <button id="${teamName}Start">Start</button>
            <button id="${teamName}Pause">Pause</button>
            <button id="${teamName}Reset">Reset</button>
            <button id="${teamName}StopAlarm" style="display:none;">Stop Alarm</button>
        `;

        timerDiv.innerHTML = timerHTML;

        // Insert audio select before the timer controls
        timerDiv.insertBefore(audioSelect, timerDiv.firstChild);

        const startBtn = timerDiv.querySelector(`#${teamName}Start`);
        const pauseBtn = timerDiv.querySelector(`#${teamName}Pause`);
        const resetBtn = timerDiv.querySelector(`#${teamName}Reset`);
        const timeDisplay = timerDiv.querySelector(`#${teamName}Display`);
        const stopAlarmBtn = timerDiv.querySelector(`#${teamName}StopAlarm`);
        const timeInputMinutes = timerDiv.querySelector(`#${teamName}Minutes`);
        const timeInputSeconds = timerDiv.querySelector(`#${teamName}Seconds`);

        let timerInterval;
        let timeLeft;
        let audio;

        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        startBtn.addEventListener('click', () => {
            if (timerInterval) { // If a timer is already running, treat it as a resume
                clearInterval(timerInterval); // Clear the existing interval
                timerInterval = null; // Clear the interval ID

                timerInterval = setInterval(() => {
                    timeLeft--;
                    updateDisplay();
                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        timerInterval = null; // Clear the interval ID after timer ends
                        playSound(teamName);
                        stopAlarmBtn.style.display = "inline-block"; // Show the Stop Alarm button
                        startBtn.textContent = 'Start';  // Change button text back to Start
                    }
                }, 1000);

            } else { // If no timer is running, start a new one
                let minutes = parseInt(timeInputMinutes.value) || 0;
                let seconds = parseInt(timeInputSeconds.value) || 0;
                const duration = (minutes * 60) + seconds;

                if (isNaN(duration) || duration <= 0) {
                    alert('Please enter a valid time in minutes and seconds.');
                    return;
                }

                if (timeLeft === undefined || timeLeft <= 0) {
                    timeLeft = duration; // Initialize timeLeft if it's the first start or if it was reset
                }

                updateDisplay();

                timerInterval = setInterval(() => {
                    timeLeft--;
                    updateDisplay();
                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        timerInterval = null; // Clear the interval ID after timer ends
                        playSound(teamName);
                        stopAlarmBtn.style.display = "inline-block"; // Show the Stop Alarm button
                        startBtn.textContent = 'Start';  // Change button text back to Start
                    }
                }, 1000);
            }
        });


        pauseBtn.addEventListener('click', () => {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
                startBtn.textContent = 'Resume'; // Change button text to Resume
            } else {
                alert("Timer is not running");
            }
        });

        resetBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            timerInterval = null;
            timeLeft = undefined; // Reset timeLeft
            updateDisplay();
            startBtn.textContent = 'Start';
            stopAlarmBtn.style.display = 'none'; // Hide the Stop Alarm button
        });

        stopAlarmBtn.addEventListener('click', () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            stopAlarmBtn.style.display = 'none'; // Hide the button

            // Reset the timer automatically
            clearInterval(timerInterval);
            timerInterval = null;
            timeLeft = 0; // Reset timeLeft
            updateDisplay();
            startBtn.textContent = 'Start'; // Change button text back to Start
        });

        function playSound(teamName) {
            // Get the selected audio option
            const audioSelect = document.getElementById(`${teamName}AudioSelect`);
            if (!audioSelect) {
                console.error("Audio select element not found.");
                return;
            }

            // Get the selected audio file path
            const selectedAudioPath = audioSelect.value;

            // Create a new audio object
            audio = new Audio(selectedAudioPath); // Assign to the global audio variable

            // Set the volume to 1 (maximum)
            audio.volume = 1;

            // Ensure the audio is not muted
            audio.muted = false;

            // Play the selected audio
            audio.play().catch(error => {
                console.error("Audio playback failed:", error);
                alert("Please interact with the page to enable sound playback.");
            });
        }

        timersContainer.appendChild(timerDiv);
    }

    // Event listener for adding a new team
    addTeamBtn.addEventListener('click', function() {
        const teamName = prompt("Enter team name:");
        if (teamName) {
            addTeam(teamName);
        }
    });

    // Initial team setup (optional)
    addTeam('TeamA');
    addTeam('TeamB');
});
