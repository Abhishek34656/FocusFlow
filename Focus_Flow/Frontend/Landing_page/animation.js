// Enhanced Particle effect for background
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Slightly smaller particles
        this.speedX = (Math.random() - 0.5) * 0.5; // Slower movement
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.3 + 0.1; // More subtle opacity
        this.targetX = this.x;
        this.targetY = this.y;
        this.angle = Math.random() * Math.PI * 2; // For circular motion
        this.radius = 2 + Math.random() * 3; // Radius of circular motion
        this.speed = 0.001 + Math.random() * 0.001; // Speed of circular motion
    }

    update(mouseX, mouseY) {
        // Save current position for smooth transitions
        const previousX = this.x;
        const previousY = this.y;
        
        // Circular motion
        this.angle += this.speed;
        this.targetX = this.x + Math.cos(this.angle) * this.radius;
        this.targetY = this.y + Math.sin(this.angle) * this.radius;
        
        // Smooth movement towards target
        this.x += (this.targetX - this.x) * 0.05;
        this.y += (this.targetY - this.y) * 0.05;
        
        // Mouse interaction
        if (mouseX && mouseY) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const angle = Math.atan2(dy, dx);
                const force = (1 - distance / 150) * 2;
                this.x -= Math.cos(angle) * force;
                this.y -= Math.sin(angle) * force;
            }
        }
        
        // Keep particles within bounds with wrapping
        if (this.x < -50) this.x = this.canvas.width + 50;
        if (this.x > this.canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = this.canvas.height + 50;
        if (this.y > this.canvas.height + 50) this.y = -50;
    }

    draw() {
        // Dynamic color cycling for mind-blowing effect
        const hue = (Date.now() / 30 + this.x + this.y) % 360;
        this.ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.7)`;
        this.ctx.shadowBlur = 12;
        this.ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${this.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
}

// Initialize canvas and particles with enhanced settings
function initGithubHeroAnimation() {
    const canvas = document.getElementById('github-hero-canvas');
    if (!canvas) return;
    const hero = document.querySelector('.hero');
    const ctx = canvas.getContext('2d');
    // --- Space Theme Parameters ---
    const STAR_COUNT = 120;
    const PLANET_COUNT = 2;
    const SHOOTING_STAR_FREQ = 0.003; // Probability per frame
    let stars = [];
    let planets = [];
    let shootingStars = [];
    let particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 18), 90); // Similar density to GitHub

    // --- Space Objects ---
    class Star {
        constructor(width, height) {
            this.reset(width, height);
        }
        reset(width, height) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.1 + 0.2;
            this.opacity = Math.random() * 0.6 + 0.3;
            this.twinkle = Math.random() * Math.PI * 2;
            this.speed = 0.03 + Math.random() * 0.07;
        }
        update(width, height) {
            this.twinkle += this.speed;
            if (this.twinkle > Math.PI * 2) this.twinkle -= Math.PI * 2;
        }
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity * (0.7 + 0.3 * Math.sin(this.twinkle));
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    class Planet {
        constructor(width, height) {
            // Place planets off-center for depth
            this.x = Math.random() * width * 0.7 + width * 0.1;
            this.y = Math.random() * height * 0.6 + height * 0.2;
            this.radius = Math.random() * 32 + 38;
            this.color = `hsla(${Math.floor(Math.random()*360)}, 60%, 65%, 0.18)`;
            this.blur = Math.random() * 16 + 16;
        }
        draw(ctx) {
            ctx.save();
            ctx.filter = `blur(${this.blur}px)`;
            ctx.globalAlpha = 0.38;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }
    class ShootingStar {
        constructor(width, height) {
            this.x = Math.random() * width;
            this.y = Math.random() * height * 0.5;
            this.length = Math.random() * 80 + 60;
            this.speed = Math.random() * 10 + 7;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
            this.opacity = 1;
        }
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.025;
        }
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = Math.max(this.opacity, 0);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
            ctx.stroke();
            ctx.restore();
        }
        isAlive(width, height) {
            return this.opacity > 0 && this.x < width && this.y < height;
        }
    }

    function resizeCanvas() {
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        // Recreate space objects on resize
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star(canvas.width, canvas.height));
        planets = [];
        for (let i = 0; i < PLANET_COUNT; i++) planets.push(new Planet(canvas.width, canvas.height));
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle class matching GitHub style
    class GithubParticle {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 1.2;
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.18 + Math.random() * 0.18;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            // Bounce off edges
            if (this.x <= 0 || this.x >= this.canvas.width) this.vx *= -1;
            if (this.y <= 0 || this.y >= this.canvas.height) this.vy *= -1;
        }
        draw() {
            this.ctx.save();
            this.ctx.globalAlpha = 0.7;
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new GithubParticle(canvas));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 1. Draw planets (behind everything)
        for (let i = 0; i < planets.length; i++) {
            planets[i].draw(ctx);
        }
        // 2. Draw stars (twinkling)
        for (let i = 0; i < stars.length; i++) {
            stars[i].update(canvas.width, canvas.height);
            stars[i].draw(ctx);
        }
        // 3. Shooting stars
        if (Math.random() < SHOOTING_STAR_FREQ) {
            shootingStars.push(new ShootingStar(canvas.width, canvas.height));
        }
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            shootingStars[i].update();
            shootingStars[i].draw(ctx);
            if (!shootingStars[i].isAlive(canvas.width, canvas.height)) {
                shootingStars.splice(i, 1);
            }
        }
        // 4. Draw constellation lines (GitHub style)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 115) {
                    ctx.save();
                    ctx.globalAlpha = 0.18 * (1 - distance / 115);
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        // 5. Draw constellation nodes (particles)
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }
    animate();
}


// Add hover effect to buttons
document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect for particles
    window.addEventListener('mousemove', e => {
        const parallaxX = (e.clientX / window.innerWidth - 0.5) * 20;
        const parallaxY = (e.clientY / window.innerHeight - 0.5) * 20;
        document.getElementById('particle-canvas').style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
    });

    // Floating animation for hero image
    const heroImg = document.querySelector('.hero-image img');
    if (heroImg) {
        heroImg.style.transition = 'transform 2.5s cubic-bezier(.25,.8,.25,1)';
        setInterval(() => {
            const floatY = Math.sin(Date.now() / 800) * 10;
            const floatX = Math.cos(Date.now() / 1300) * 6;
            heroImg.style.transform = `translateY(${floatY}px) translateX(${floatX}px) scale(1.04)`;
        }, 40);
    }

    // Floating animation for feature cards
    document.querySelectorAll('.feature-card').forEach((card, i) => {
        card.style.transition = 'transform 2.8s cubic-bezier(.25,.8,.25,1)';
        setInterval(() => {
            const floatY = Math.sin(Date.now() / (900 + i * 200)) * 6;
            card.style.transform = `translateY(${floatY}px) scale(1.01)`;
        }, 40);
    });

    // Initialize GitHub-style hero animation
    initGithubHeroAnimation();
    
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });
    });
    
    // Add scroll animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .about-content, .download');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial check on load
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add scroll animations with IntersectionObserver for wow effect
    function animateSectionObserver() {
        const observer = new window.IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        document.querySelectorAll('.features, .about, .download').forEach(section => {
            observer.observe(section);
        });
    }
    animateSectionObserver();
});