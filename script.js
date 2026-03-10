let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

function updateDisplay() {
    minutesDisplay.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsDisplay.textContent = seconds < 10 ? '0' + seconds : seconds;
}

function startTimer() {
    if (isRunning) {
        clearInterval(timer);
        startBtn.textContent = 'Start';
        isRunning = false;
    } else {
        isRunning = true;
        startBtn.textContent = 'Pause';
        timer = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timer);
                    isRunning = false;
                    startBtn.textContent = 'Start';
                    notifyUser();
                    return;
                }
                minutes--;
                seconds = 59;
            } else {
                seconds--;
            }
            updateDisplay();
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    minutes = 25;
    seconds = 0;
    startBtn.textContent = 'Start';
    updateDisplay();
}

function notifyUser() {
    // Attempting to play a bell sound if possible, otherwise just alert
    const bellSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    bellSound.play().catch(error => {
        console.log('Audio playback failed or blocked by browser.');
    });
    alert('Time is up! Take a break.');
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
