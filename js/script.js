// Preloading & Audio Logic
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    const mobileView = document.getElementById("mobile-view");
    const desktopView = document.getElementById("desktop-view");
    const isMobile = window.innerWidth < 768;

    // Fade out preloader
    if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => {
            preloader.style.display = "none";
        }, 800);
    }

    // Show appropriate view & Select Music
    let audio;
    if (isMobile) {
        if (mobileView) {
            mobileView.style.display = "block";
            // Small delay to allow display:block to apply before opacity transition
            setTimeout(() => {
                mobileView.style.opacity = "1";
            }, 50);
        }
        audio = document.getElementById("bg-music-mobile");
    } else {
        if (desktopView) desktopView.style.display = "block";
        audio = document.getElementById("bg-music-desktop");
    }

    // Attempt autoplay (usually blocked, but we try)
    if (audio) {
        audio.volume = 0.5;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay blocked. Waiting for interaction.");
                // Fallback: Play on first touch/click
                document.body.addEventListener('click', () => {
                    audio.play();
                }, { once: true });
            });
        }
    }

    // Desktop Trigger Logic
    const musicTrigger = document.getElementById("music-trigger");
    if (musicTrigger) {
        musicTrigger.addEventListener("click", () => {
            if (audio) audio.play();
            musicTrigger.style.display = "none";
        });

        // Also hide it if audio is already playing? 
        // Better simplicity: just let the user click it.
        if (audio && !audio.paused) {
            musicTrigger.style.display = "none";
        }
    }

    // Welcome Overlay Logic (Shared)
    const continueBtn = document.getElementById("continue-btn");
    const welcomeOverlay = document.getElementById("welcome-overlay");

    if (continueBtn && welcomeOverlay) {
        continueBtn.addEventListener("click", () => {
            // 1. Play Audio (User interaction!)
            if (audio) {
                audio.play().catch(e => console.log("Continue play error:", e));
            }

            // 2. Hide Overlay
            welcomeOverlay.style.opacity = "0";
            setTimeout(() => {
                welcomeOverlay.style.display = "none";
            }, 500);
        });
    }
});

// Global functions
function colourSketch() {
    const sketchImg = document.getElementById("sketch-img");
    const colourBtn = document.getElementById("colour-btn");

    // 1. Colour the sketch
    if (sketchImg) {
        sketchImg.style.filter = "grayscale(0%)";
    }

    // 2. Hide colour button
    if (colourBtn) {
        colourBtn.style.display = "none";
    }

    // Play music if forced interaction needed on 'Colour' tap as well
    const isMobile = window.innerWidth < 768;
    const audioId = isMobile ? "bg-music-mobile" : "bg-music-desktop";
    const audio = document.getElementById(audioId);
    if (audio && audio.paused) {
        audio.play().catch(e => console.log("Audio play failed on colour:", e));
    }
}

function openGift() {
    const btnWrapper = document.querySelector(".open-gift-wrapper");
    const cover = document.querySelector(".cover");
    const content = document.getElementById("gift-content");

    // Ensure music plays if it hasn't already (final fallback)
    const isMobile = window.innerWidth < 768;
    const audioId = isMobile ? "bg-music-mobile" : "bg-music-desktop";
    const audio = document.getElementById(audioId);
    if (audio && audio.paused) {
        audio.play().catch(e => console.log("Audio play failed on open:", e));
    }

    // Hide everything and show content
    if (btnWrapper) btnWrapper.style.display = "none";
    if (cover) cover.style.display = "none";
    if (content) {
        content.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

const copyBtn = document.getElementById("copyLink");

if (copyBtn) {
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied 🎄 Open it on your laptop");
    });
}
