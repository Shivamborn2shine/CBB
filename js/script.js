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
});

// Global functions
function openGift() {
    const btnWrapper = document.querySelector(".open-gift-wrapper");
    const cover = document.querySelector(".cover");
    const content = document.getElementById("gift-content");

    // Ensure music plays if it hasn't already (Mobile/Desktop logic)
    const isMobile = window.innerWidth < 768;
    const audioId = isMobile ? "bg-music-mobile" : "bg-music-desktop";
    const audio = document.getElementById(audioId);
    if (audio && audio.paused) {
        audio.play().catch(e => console.log("Audio play failed:", e));
    }

    if (btnWrapper) btnWrapper.style.display = "none";
    if (cover) cover.style.display = "none"; // Hide cover to reveal content
    if (content) {
        content.style.display = "block";
        // Optional: scroll to top if needed, but since we hide button, it should be at top
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
