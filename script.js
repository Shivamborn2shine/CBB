document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('camera-feed');
    const overlayImage = document.getElementById('sketch-overlay');
    const opacitySlider = document.getElementById('opacity-slider');
    const scaleSlider = document.getElementById('scale-slider');
    const rotationSlider = document.getElementById('rotation-slider');
    const uploadInput = document.getElementById('upload-sketch');
    const freezeBtn = document.getElementById('freeze-btn');
    const statusIndicator = document.getElementById('camera-status');
    const overlayContainer = document.getElementById('overlay-container');

    // State
    let isFrozen = false;
    let currentStream = null;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let isDragging = false;

    // Scale tracking
    let currentScale = 1;
    let currentRotation = 0;

    // --- Camera Setup ---
    async function startCamera() {
        try {
            const constraints = {
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            };

            currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            videoElement.srcObject = currentStream;
            statusIndicator.textContent = 'Camera Active';
            statusIndicator.classList.add('active');
        } catch (err) {
            console.error('Error accessing camera:', err);
            statusIndicator.textContent = 'Camera Blocked/Error';
            statusIndicator.classList.add('error');
            alert('Could not access camera. Please allow camera permissions.');
        }
    }

    startCamera();

    // --- Controls Implementation ---

    // Opacity
    opacitySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        overlayImage.style.opacity = value / 100;
    });

    // Scale (Slider)
    scaleSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        currentScale = value / 100;
        updateTransform();
    });

    // Rotation
    rotationSlider.addEventListener('input', (e) => {
        currentRotation = e.target.value;
        updateTransform();
    });

    function updateTransform() {
        overlayImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale}) rotate(${currentRotation}deg)`;
    }

    // Upload Sketch
    uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                overlayImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Freeze Camera
    freezeBtn.addEventListener('click', () => {
        if (isFrozen) {
            videoElement.play();
            freezeBtn.textContent = 'Freeze Camera';
            isFrozen = false;
        } else {
            videoElement.pause();
            freezeBtn.textContent = 'Unfreeze';
            isFrozen = true;
        }
    });

    // --- Gestures (Drag & Drop) ---
    // We attach listeners to the overlay container or image directly

    // Mouse Events
    overlayImage.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch Events
    overlayImage.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - currentX;
            initialY = e.touches[0].clientY - currentY;
        } else {
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
            e.preventDefault(); // Prevent default image dragging behavior
        }

        // Check if we are interacting with the controls
        if (e.target.closest('.controls-panel')) return;

        isDragging = true;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            updateTransform();
        }
    }

    function dragEnd(e) {
        isDragging = false;
    }

    // --- Pinch to Zoom (Touch Only) ---
    // A simple implementation for pinch zoom
    let initialDistance = 0;
    let initialScale = 1;

    overlayContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialDistance = getDistance(e.touches[0], e.touches[1]);
            initialScale = currentScale;
            e.preventDefault();
        }
    }, { passive: false });

    overlayContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const scaleFactor = currentDistance / initialDistance;

            // Limit zoom speed/range if needed
            const newScale = initialScale * scaleFactor;

            // Update slider to match
            scaleSlider.value = Math.min(Math.max(newScale * 100, 10), 300);
            currentScale = scaleSlider.value / 100;

            updateTransform();
            e.preventDefault();
        }
    }, { passive: false });

    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
});
