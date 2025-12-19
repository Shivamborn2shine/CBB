document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.scrapbook-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.querySelector('.lightbox-media-container');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');

    // Add staggered animation on load
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = `translateY(20px) rotate(${item.style.getPropertyValue('--rotation')})`;
        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = `translateY(0) rotate(${item.style.getPropertyValue('--rotation')})`;
        }, index * 100);
    });

    // Lightbox Logic
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const mediaWrapper = item.querySelector('.media-wrapper');
            if (!mediaWrapper) return; // Skip valid note items that don't have media

            const img = mediaWrapper.querySelector('img');
            const video = mediaWrapper.querySelector('video');
            const caption = item.querySelector('.caption .handwriting')?.textContent || '';

            lightboxContent.innerHTML = ''; // Clear previous

            if (img) {
                const newImg = document.createElement('img');
                newImg.src = img.src; // In a real app, use a data-fullres attribute
                newImg.alt = img.alt;
                lightboxContent.appendChild(newImg);
            } else if (video) {
                const newVideo = document.createElement('video');
                newVideo.src = video.querySelector('source').src;
                newVideo.controls = true;
                newVideo.autoplay = true;
                lightboxContent.appendChild(newVideo);
            }

            lightboxCaption.textContent = caption;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        const video = lightboxContent.querySelector('video');
        if (video) video.pause();
    };

    closeBtn.addEventListener('click', closeLightbox);

    // Close on clicking outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
