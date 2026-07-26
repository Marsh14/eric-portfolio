const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

const STAR_COUNT = 120;
const STAR_COLOR = 'rgba(255,255,255,0.85)';
const STAR_SIZE = [0.5, 1.2];
const STAR_SPEED = [0.05, 0.25]; // Background star speed

let stars = [];

function resize() {
    // Resize the canvas to fill the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function randomBetween(a, b) {
    // Returns a random number between a and b
    return a + Math.random() * (b - a);
}

function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            // Creates the stars with random positions and sizes
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
        // Initializes
        this.reset();
    }

    reset() {
        // Resets the shooting star's position and speed
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.len = Math.random() * 80 + 10;
        this.speed = Math.random() * 10 + 6;
        this.size = Math.random() * 1 + 0.1;
        this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
        this.active = false;
    }

    update() {
        // Updates the shooting star's position if it's active, otherwise checks if it's time to activate it
        if (this.active) {
            this.x -= this.speed;
            this.y += this.speed;                    
            if (this.x < 0 || this.y > canvas.height) {
                this.active = false;
                this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
            }
        } else {
            // Checks if it's time to activate the shooting star
            if (this.waitTime < new Date().getTime()) {
                this.active = true;
                this.x = Math.random() * (canvas.width + 200);
                this.y = -50;
            }
        }
    }

    draw() {
        // Draws the shooting star if it's active
        if (!this.active) return;
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + Math.random() + ')'; 
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);                
        ctx.lineTo(this.x + this.len, this.y - this.len);
        ctx.stroke();
    }
}

const shootingStar = new ShootingStar();

function animate() {
    // Clears the canvas and draws the stars and shooting star
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

// Hides the navbar when the user is in the intro section and shows it when they scroll down
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

// Mobile hamburger menu toggle
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Cursor tail
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