const isMobile = window.innerWidth < 768;

const mobileView = document.getElementById("mobile-view");
const desktopView = document.getElementById("desktop-view");

if (isMobile) {
    mobileView.style.display = "block";
} else {
    desktopView.style.display = "block";
}

function openGift() {
    document
        .getElementById("gift-content")
        .scrollIntoView({ behavior: "smooth" });
}

const copyBtn = document.getElementById("copyLink");

if (copyBtn) {
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied 🎄 Open it on your laptop");
    });
}
