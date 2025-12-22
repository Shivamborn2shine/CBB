document.addEventListener('DOMContentLoaded', () => {
    const overlayEntity = document.querySelector('#overlay-entity');
    const opacitySlider = document.getElementById('opacity-slider');
    const scaleSlider = document.getElementById('scale-slider');
    const rotationSlider = document.getElementById('rotation-slider');

    // Controls Handling
    // A-Frame entities are modified by setting attributes

    if (opacitySlider && overlayEntity) {
        opacitySlider.addEventListener('input', (e) => {
            const val = e.target.value;
            overlayEntity.setAttribute('opacity', val);
        });
    }

    if (scaleSlider && overlayEntity) {
        scaleSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            // Scale X and Y uniformly, keep Z as 1
            overlayEntity.setAttribute('scale', `${val} ${val} 1`);
        });
    }

    if (rotationSlider && overlayEntity) {
        rotationSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            // Rotate around Y axis (which is "up" in the marker's local space)
            // But since we rotated -90 on X to lay flat, the local axes are different.
            // A-Frame rotation order is YXZ.
            // We want to rotate around the axis perpendicular to the paper.
            // Initial is -90 0 0.
            // We likely want to modify the Z axis rotation in the local frame? 
            // Or just set the rotation attribute directly.

            // Let's try rotating around Z which is 'up' relative to the image plane
            // Actually, if we look at the standard orientation:
            // X is right, Y is up, Z is towards camera.
            // We rotated X by -90 deg. Now Y is pointing 'away' and Z is 'up' relative to the marker?
            // Trial and error suggests rotating Y in world space is Z in local?

            // Let's just set the rotation string fully each time to be safe
            // We keep X as -90 to stay flat.
            // We change Y?
            overlayEntity.setAttribute('rotation', `-90 ${val} 0`);
        });
    }

    console.log('AR Controls Initialized');
});
