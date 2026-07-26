const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

const STAR_COUNT = 120;
const STAR_COLOR = 'rgba(255,255,255,0.85)';
const STAR_SIZE = [0.5, 1.2];
const STAR_SPEED = [0.05, 0.25]; // Background star speed

let stars = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: randomBetween(STAR_SIZE[0], STAR_SIZE[1]),
            speed: randomBetween(STAR_SPEED[0], STAR_SPEED[1])
        });
    }
}
createStars();

// --- Shooting Star Logic ---
class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.len = Math.random() * 80 + 10;
        this.speed = Math.random() * 10 + 6;
        this.size = Math.random() * 1 + 0.1;                // Wait time determines how often they appear
        this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
        this.active = false;
    }

    update() {
        if (this.active) {
            this.x -= this.speed;
            this.y += this.speed;                    // If it goes off screen, reset it
            if (this.x < 0 || this.y > canvas.height) {
                this.active = false;
                this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
            }
        } else {
            if (this.waitTime < new Date().getTime()) {
                this.active = true;
                this.x = Math.random() * (canvas.width + 200); // Start slightly offscreen right
                this.y = -50;
            }
        }
    }

    draw() {
        if (!this.active) return;
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + Math.random() + ')'; // Slight flicker
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);                // Draws a tail going up and to the right
        ctx.lineTo(this.x + this.len, this.y - this.len);
        ctx.stroke();
    }
}

const shootingStar = new ShootingStar();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = STAR_COLOR;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.x = Math.random() * canvas.width;
            star.y = 0;
        }
    }

    shootingStar.update();
    shootingStar.draw();

    requestAnimationFrame(animate);
}
animate();

// --- Scroll Detection Logic ---
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    const miniNav = document.querySelector('.mini-nav');
    const threshold = window.innerHeight / 4;

    if (window.scrollY > threshold) {
        if (navbar) navbar.classList.remove('hide-on-top');
        if (miniNav) miniNav.classList.remove('hide-on-top');
    } else {
        if (navbar) navbar.classList.add('hide-on-top');
        if (miniNav) miniNav.classList.add('hide-on-top');
    }
});

// --- Mobile Hamburger Menu Logic ---
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// --- Cursor White Trail Logic ---
window.addEventListener('mousemove', function (e) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = (e.clientX - 4) + 'px'; // Center the dot
    trail.style.top = (e.clientY - 4) + 'px';
    document.body.appendChild(trail);

    // Trigger animation to shrink and fade
    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0.1)';
    }, 10);

    // Clean up DOM element
    setTimeout(() => {
        trail.remove();
    }, 400);
});