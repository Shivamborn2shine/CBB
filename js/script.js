const isMobile = window.innerWidth < 768;

const mobileView = document.getElementById("mobile-view");
const desktopView = document.getElementById("desktop-view");

if (isMobile) {
    mobileView.style.display = "block";
} else {
    desktopView.style.display = "block";
}

function openGift() {
    const btnWrapper = document.querySelector(".open-gift-wrapper");
    const cover = document.querySelector(".cover");
    const content = document.getElementById("gift-content");

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
