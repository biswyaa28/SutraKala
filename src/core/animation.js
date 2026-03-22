// js/utils/animation.js
export const initPerformanceMonitor = (fpsNode) => {
    let lastTime = performance.now();
    let frames = 0;
    const isMobile = window.innerWidth <= 768;
    let enabled = true;
    
    const monitor = (time) => {
        frames++;
        if (time >= lastTime + 1000) {
            if (isMobile && frames < 55) enabled = false;
            else if (frames > 58) enabled = true;
            
            if (fpsNode) fpsNode.textContent = `${frames} FPS`;
            frames = 0;
            lastTime = time;
        }
        requestAnimationFrame(monitor);
    };
    requestAnimationFrame(monitor);
    
    // Returns a live closure lookup
    return () => enabled;
};

export const springPhysics = {
    bounce: 'spring(1, 400, 30, 0)',
    gentle: 'spring(1, 300, 20, 0)',
    snap: 'spring(1, 350, 25, 0)'
};
