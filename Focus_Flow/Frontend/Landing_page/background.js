// Immersive, minimal space-themed animated background for the landing page
// Features: twinkling stars, floating particles, deep gradient, subtle parallax

(function() {
    const STAR_COUNT = 120;
    const PARTICLE_COUNT = 40;
    const LAYERS = 3; // For parallax
    let stars = [], particles = [];
    let canvas, ctx;
    let width, height;
    let mouseX = 0.5, mouseY = 0.5;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createStars();
        createParticles();
    }

    function createStars() {
        stars = [];
        for (let l = 0; l < LAYERS; l++) {
            for (let i = 0; i < STAR_COUNT / LAYERS; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * (1.2 + l * 0.7) + 0.4,
                    opacity: 0.5 + Math.random() * 0.5,
                    twinkle: Math.random() * Math.PI * 2,
                    speed: 0.03 + Math.random() * 0.03 + l * 0.01,
                    layer: l
                });
            }
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.1 + Math.random() * 0.2;
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: 2.8 + Math.random() * 2.2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                opacity: 0.18 + Math.random() * 0.12,
                layer: Math.floor(Math.random() * LAYERS)
            });
        }
    }

    function drawGradient() {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#0a1633');
        grad.addColorStop(0.6, '#10192c');
        grad.addColorStop(1, '#05070e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
    }

    function animate() {
        drawGradient();
        // Parallax offset
        const px = (mouseX - 0.5) * 24, py = (mouseY - 0.5) * 16;
        // Draw stars
        for (const s of stars) {
            s.twinkle += s.speed;
            ctx.save();
            ctx.globalAlpha = s.opacity * (0.7 + 0.3 * Math.sin(s.twinkle));
            ctx.beginPath();
            ctx.arc(s.x + px * (s.layer / LAYERS), s.y + py * (s.layer / LAYERS), s.r, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = s.r * 2.5;
            ctx.fill();
            ctx.restore();
        }
        // Draw particles
        for (const p of particles) {
            p.x += p.vx * (0.6 + p.layer / LAYERS);
            p.y += p.vy * (0.6 + p.layer / LAYERS);
            // Wrap around
            if (p.x < -p.r) p.x = width + p.r;
            if (p.x > width + p.r) p.x = -p.r;
            if (p.y < -p.r) p.y = height + p.r;
            if (p.y > height + p.r) p.y = -p.r;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x + px * (p.layer / LAYERS), p.y + py * (p.layer / LAYERS), p.r, 0, Math.PI * 2);
            ctx.fillStyle = '#a2b2ff';
            ctx.shadowColor = '#8fa9ff';
            ctx.shadowBlur = p.r * 2.8;
            ctx.fill();
            ctx.restore();
        }
        requestAnimationFrame(animate);
    }

    function onMouseMove(e) {
        mouseX = e.clientX / width;
        mouseY = e.clientY / height;
    }

    function init() {
        canvas = document.createElement('canvas');
        canvas.id = 'space-bg';
        canvas.style.position = 'fixed';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '-2';
        canvas.style.pointerEvents = 'none';
        document.body.insertBefore(canvas, document.body.firstChild);
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMouseMove);
        animate();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
