// ===========================
// POMODORO TIMER APPLICATION
// ===========================

// Timer Variables
let timerInterval = null;
let timeRemaining = 25 * 60; // 25 minutes in seconds
const TOTAL_TIME = 25 * 60; // 25 minutes
let isRunning = false;

// DOM Elements
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMessage = document.getElementById('statusMessage');
const progressCircle = document.getElementById('progressCircle');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    updateProgressBar();
    setupEventListeners();
    setupNavigation();
    setupIdeaBoardListeners();
});

// ===========================
// EVENT LISTENERS
// ===========================
function setupEventListeners() {
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get the target section
            const target = link.getAttribute('href');
            const timerSection = document.querySelector('.timer-section');
            const calculatorSection = document.querySelector('.calculator-section');
            const ideaBoardSection = document.querySelector('.idea-board-section');
            
            // Hide all sections
            timerSection.style.display = 'none';
            calculatorSection.style.display = 'none';
            ideaBoardSection.style.display = 'none';
            
            // Show the selected section
            if (target === '#study-timer') {
                timerSection.style.display = 'block';
            } else if (target === '#gpa-calculator') {
                calculatorSection.style.display = 'block';
            } else if (target === '#idea-board') {
                ideaBoardSection.style.display = 'block';
            }
        });
    });
}

// ===========================
// TIMER FUNCTIONS
// ===========================
function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    statusMessage.textContent = '⏱️ Timer is running...';
    statusMessage.classList.remove('completed', 'warning');
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateDisplay();
        updateProgressBar();
        
        // Check if time is up
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerCompleted();
        }
        
        // Warning at 1 minute remaining
        if (timeRemaining === 60) {
            statusMessage.textContent = '⚠️ 1 minute remaining!';
            statusMessage.classList.add('warning');
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    statusMessage.textContent = '⏸️ Timer paused';
    statusMessage.classList.remove('completed', 'warning');
}

function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    timeRemaining = TOTAL_TIME;
    updateDisplay();
    updateProgressBar();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    statusMessage.textContent = '';
    statusMessage.classList.remove('completed', 'warning');
}

function timerCompleted() {
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    statusMessage.textContent = '✅ Time\'s up! Take a break!';
    statusMessage.classList.add('completed');
    
    // Play notification sound
    playNotificationSound();
    
    // Show browser notification
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', {
                body: 'Your 25-minute focus session is complete! Time for a break.',
                icon: '🍅'
            });
        }
    }
}

// ===========================
// DISPLAY UPDATES
// ===========================
function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateProgressBar() {
    const circumference = 2 * Math.PI * 90; // radius is 90
    const progress = (TOTAL_TIME - timeRemaining) / TOTAL_TIME;
    const offset = circumference - (progress * circumference);
    progressCircle.style.strokeDashoffset = offset;
}

// ===========================
// NOTIFICATION SOUND
// ===========================
function playNotificationSound() {
    // Create audio context for bell sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create multiple sine waves for a pleasant bell-like sound
    const now = audioContext.currentTime;
    const duration = 0.5;
    
    // Create nodes
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    
    // Play three different frequencies for a chord effect
    const frequencies = [800, 1200, 1600];
    
    frequencies.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc.connect(gain);
        gain.connect(gainNode);
        
        osc.start(now);
        osc.stop(now + duration);
    });
    
    // Add main bell frequency
    const bellOsc = audioContext.createOscillator();
    const bellGain = audioContext.createGain();
    
    bellOsc.frequency.value = 528; // Healing frequency
    bellOsc.type = 'sine';
    
    bellGain.gain.setValueAtTime(0.5, now);
    bellGain.gain.exponentialRampToValueAtTime(0.01, now + duration * 2);
    
    bellOsc.connect(bellGain);
    bellGain.connect(gainNode);
    
    bellOsc.start(now);
    bellOsc.stop(now + duration * 2);
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// ===========================
// GROUP IDEA BOARD FUNCTIONALITY
// ===========================

// Idea Board Variables
let totalIdeas = 0;

// Idea Board DOM Elements
const nameSelect = document.getElementById('name-select');
const newNameInput = document.getElementById('new-name-input');
const addNameBtn = document.getElementById('add-name-btn');
const removeNameBtn = document.getElementById('remove-name-btn');
const ideaInput = document.getElementById('idea-input');
const addIdeaBtn = document.getElementById('add-idea-btn');
const ideaResetBtn = document.getElementById('idea-reset-btn');
const ideaList = document.getElementById('idea-list');
const ideaCounterBadge = document.getElementById('idea-counter');

function setupIdeaBoardListeners() {
    addNameBtn.addEventListener('click', addNewMember);
    removeNameBtn.addEventListener('click', removeMember);
    addIdeaBtn.addEventListener('click', addIdea);
    ideaResetBtn.addEventListener('click', resetIdeaForm);
    
    newNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNameBtn.click();
    });
    
    ideaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addIdeaBtn.click();
    });
}

function addNewMember() {
    const newName = newNameInput.value.trim();
    
    if (!newName) {
        alert('Please enter a name to register.');
        return;
    }

    const existingOptions = Array.from(nameSelect.options).map(opt => opt.value.toLowerCase());
    if (existingOptions.includes(newName.toLowerCase())) {
        alert('This member is already registered!');
        return;
    }

    const option = document.createElement('option');
    option.value = newName;
    option.textContent = newName;
    nameSelect.appendChild(option);
    
    nameSelect.value = newName;
    newNameInput.value = '';
}

function removeMember() {
    const selectedValue = nameSelect.value;
    
    if (!selectedValue) {
        alert('Please select a member to remove.');
        return;
    }

    if (confirm(`Are you sure you want to remove "${selectedValue}" from the team?`)) {
        const selectedIndex = nameSelect.selectedIndex;
        nameSelect.remove(selectedIndex);
        nameSelect.value = "";
    }
}

function addIdea() {
    const name = nameSelect.value;
    const idea = ideaInput.value.trim();

    if (!name) {
        alert('Who are you? Please select a name!');
        return;
    }

    if (!idea) {
        alert('An idea needs some words! Please enter something.');
        return;
    }

    const emptyState = ideaList.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    totalIdeas++;
    updateIdeaCounter();

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div class="idea-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </div>
        <div class="idea-content">
            ${idea}
            <span class="suggested-by">suggested by <strong>${name}</strong></span>
        </div>
    `;
    
    ideaList.prepend(listItem);
    ideaInput.value = '';
    ideaInput.focus();
}

function resetIdeaForm() {
    nameSelect.value = '';
    ideaInput.value = '';
    newNameInput.value = '';
    ideaInput.focus();
}

function updateIdeaCounter() {
    ideaCounterBadge.textContent = `${totalIdeas} ${totalIdeas === 1 ? 'Idea' : 'Ideas'}`;
}
