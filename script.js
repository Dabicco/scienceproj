// Global variables
let currentSlide = 1;
const totalSlides = 14; // Updated to match the total number of slides

// Loading screen functionality
window.addEventListener('load', function() {
    // Hide loading screen when everything is fully loaded
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        
        // Remove from DOM after transition completes
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500); // Show loading screen for at least 1.5 seconds for visual effect
});

// Drawing Canvas Functionality
let canvas, ctx, isDrawing = false;
let currentColor = '#1a73e8';
let currentSize = 10;
let currentTool = 'brush';

function initDrawingCanvas() {
    // Canvas and context setup
    canvas = document.getElementById('drawing-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    // Event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support for smartboards
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Tool buttons
    document.getElementById('brush-tool').addEventListener('click', () => {
        setActiveTool('brush');
    });
    
    document.getElementById('eraser-tool').addEventListener('click', () => {
        setActiveTool('eraser');
    });
    
    document.getElementById('clear-canvas').addEventListener('click', clearCanvas);
    
    // Color picker
    document.getElementById('color-picker').addEventListener('input', (e) => {
        currentColor = e.target.value;
        if (currentTool === 'eraser') {
            setActiveTool('brush');
        }
    });
    
    // Color presets
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', () => {
            currentColor = preset.dataset.color;
            document.getElementById('color-picker').value = currentColor;
            if (currentTool === 'eraser') {
                setActiveTool('brush');
            }
        });
    });
    
    // Brush size
    const brushSize = document.getElementById('brush-size');
    const sizeDisplay = document.getElementById('size-display');
    
    brushSize.addEventListener('input', () => {
        currentSize = brushSize.value;
        sizeDisplay.textContent = `${currentSize}px`;
    });
    
    // Close button
    document.getElementById('close-canvas').addEventListener('click', closeDrawingCanvas);
    
    // Window resize event
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function startDrawing(e) {
    isDrawing = true;
    draw(e); // Draw a single dot on click
}

function draw(e) {
    if (!isDrawing) return;
    
    // Get correct mouse position
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (currentTool === 'brush') {
        ctx.strokeStyle = currentColor;
        ctx.globalCompositeOperation = 'source-over';
    } else if (currentTool === 'eraser') {
        ctx.strokeStyle = 'white';
        ctx.globalCompositeOperation = 'destination-out';
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); // Start a new path for next drawing action
}

// Touch support for smartboards
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchEnd(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
}

function setActiveTool(tool) {
    currentTool = tool;
    
    // Update active class for tool buttons
    document.querySelectorAll('.tool-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (tool === 'brush') {
        document.getElementById('brush-tool').classList.add('active');
    } else if (tool === 'eraser') {
        document.getElementById('eraser-tool').classList.add('active');
    }
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function openDrawingCanvas() {
    const canvasContainer = document.getElementById('drawing-canvas-container');
    canvasContainer.classList.remove('hidden');
    // Initialize canvas only when opened
    if (!canvas) {
        initDrawingCanvas();
    } else {
        // Resize if already initialized
        resizeCanvas();
    }
}

function closeDrawingCanvas() {
    const canvasContainer = document.getElementById('drawing-canvas-container');
    canvasContainer.classList.add('hidden');
}

// Initialize the slideshow
document.addEventListener('DOMContentLoaded', function() {
    // Set up drawing canvas launcher
    const launchDrawingBtn = document.getElementById('launch-drawing');
    if (launchDrawingBtn) {
        launchDrawingBtn.addEventListener('click', openDrawingCanvas);
    }
    
    // Set up the first slide
    document.getElementById('slide1').classList.add('active');
    
    // Add event listeners for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });
    
    // Set up quiz functionality
    setupQuizzes();
});

// Navigate to the next slide
function nextSlide() {
    if (currentSlide < totalSlides) {
        document.getElementById('slide' + currentSlide).classList.remove('active');
        currentSlide++;
        document.getElementById('slide' + currentSlide).classList.add('active');
        animateSlideContent();
    }
}

// Go to a specific slide
function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        document.getElementById('slide' + currentSlide).classList.remove('active');
        currentSlide = slideNumber;
        document.getElementById('slide' + currentSlide).classList.add('active');
        animateSlideContent();
    }
}

// Navigate to the previous slide
function prevSlide() {
    if (currentSlide > 1) {
        document.getElementById('slide' + currentSlide).classList.remove('active');
        currentSlide--;
        document.getElementById('slide' + currentSlide).classList.add('active');
        animateSlideContent();
    }
}

// Animate the content of the current slide
function animateSlideContent() {
    const slideContent = document.querySelector(`#slide${currentSlide} .slide-content`);
    slideContent.classList.add('animate__animated', 'animate__fadeIn');
    
    setTimeout(() => {
        slideContent.classList.remove('animate__animated', 'animate__fadeIn');
    }, 1000);
}

// Set up quiz functionality
function setupQuizzes() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    const resetButton = document.getElementById('reset-quiz');
    let score = 0;
    const scoreDisplay = document.getElementById('quiz-score');
    const answeredQuestions = new Set();
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const questionNum = this.dataset.question;
            const options = document.querySelectorAll(`.quiz-option[data-question="${questionNum}"`);
            const feedback = document.getElementById(`feedback${questionNum}`);
            
            // Skip if this question is already answered
            if (answeredQuestions.has(questionNum)) return;
            
            // Mark this question as answered
            answeredQuestions.add(questionNum);
            
            // Remove previous selections for this question
            options.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selection class
            this.classList.add('selected');
            
            // Check if the answer is correct
            if (this.dataset.correct === 'true') {
                this.classList.add('correct');
                feedback.textContent = '✓ Correct! Well done!';
                feedback.style.color = '#2ecc71';
                score++;
            } else {
                this.classList.add('incorrect');
                feedback.textContent = '✗ Not quite right!';
                feedback.style.color = '#e74c3c';
                
                // Show the correct answer
                options.forEach(opt => {
                    if (opt.dataset.correct === 'true') {
                        opt.classList.add('correct');
                    }
                });
            }
            
            // Update score display
            scoreDisplay.textContent = score;
        });
    });
    
    // Reset quiz when button is clicked
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            quizOptions.forEach(option => {
                option.classList.remove('selected', 'correct', 'incorrect');
            });
            
            document.querySelectorAll('.quiz-feedback').forEach(feedback => {
                feedback.textContent = '';
            });
            
            score = 0;
            scoreDisplay.textContent = '0';
            answeredQuestions.clear();
        });
    }
}

// No cat game setup function needed anymore

// Function to handle drag and drop matching game
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropTarget = ev.target.closest('.droppable');
    
    if (dropTarget) {
        // Check if correct match
        if (draggedElement.dataset.match === dropTarget.dataset.match) {
            dropTarget.appendChild(draggedElement);
            dropTarget.classList.add('correct-match');
            draggedElement.classList.add('matched');
            draggedElement.draggable = false;
            
            // Check if all matches are complete
            const totalMatches = document.querySelectorAll('.draggable').length;
            const completedMatches = document.querySelectorAll('.matched').length;
            
            if (totalMatches === completedMatches) {
                document.querySelector('.match-feedback').textContent = 'Great job! All matches complete!';
            }
        } else {
            // Animate incorrect match
            dropTarget.classList.add('incorrect-match');
            setTimeout(() => {
                dropTarget.classList.remove('incorrect-match');
            }, 800);
        }
    }
}
