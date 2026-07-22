// --- Navigation Scroll Effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Mobile Menu Toggle ---
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// --- Smooth Scrolling for Navigation ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// --- Active Link on Scroll ---
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    });
});

// --- Scroll Reveal Animations (Intersection Observer) ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-scroll');
            observer.unobserve(entry.target); // Run once
        }
    });
}, observerOptions);

document.querySelectorAll('.hidden-scroll').forEach(el => {
    scrollObserver.observe(el);
});

// --- Mouse Parallax Effect ---
document.addEventListener('mousemove', (e) => {
    const mockup = document.querySelector('.phone-mockup');
    if (!mockup) return;
    
    const x = (window.innerWidth / 2 - e.pageX) / 50;
    const y = (window.innerHeight / 2 - e.pageY) / 50;
    
    mockup.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

// --- Flutter Dash Mini-Game ---
const canvas = document.getElementById('hero-game');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let dashY = 50;
    let dashVelocity = 0;
    let gravity = 0.5;
    let isJumping = false;
    let obstacles = [];
    let frame = 0;
    let score = 0;
    let gameActive = true;

    function resetGame() {
        dashY = 50;
        dashVelocity = 0;
        obstacles = [];
        score = 0;
        frame = 0;
        gameActive = true;
    }

    function drawDash() {
        ctx.fillStyle = '#45D1FD'; // Flutter blue light
        ctx.beginPath();
        ctx.arc(30, dashY, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(34, dashY - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(35, dashY - 3, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawObstacles() {
        ctx.fillStyle = '#FFC107'; // Accent color
        obstacles.forEach(obs => {
            ctx.fillRect(obs.x, 100 - obs.height, 20, obs.height);
            obs.x -= 3; // Move left
        });
        
        // Remove off-screen obstacles
        if (obstacles.length > 0 && obstacles[0].x < -20) {
            obstacles.shift();
            score++;
        }
    }

    function jump() {
        if (!gameActive) {
            resetGame();
        } else {
            dashVelocity = -7;
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (gameActive) {
            // Apply gravity
            dashVelocity += gravity;
            dashY += dashVelocity;
            
            // Ground collision
            if (dashY >= 90) {
                dashY = 90;
                dashVelocity = 0;
            }
            
            // Ceiling collision
            if (dashY <= 10) {
                dashY = 10;
                dashVelocity = 0;
            }

            // Spawn obstacles
            if (frame % 100 === 0) {
                let height = Math.random() * 40 + 20;
                obstacles.push({ x: canvas.width, height: height });
            }

            drawObstacles();
            drawDash();
            
            // Collision detection
            obstacles.forEach(obs => {
                if (30 + 10 > obs.x && 30 - 10 < obs.x + 20) {
                    if (dashY + 10 > 100 - obs.height) {
                        gameActive = false;
                    }
                }
            });
            
            // Draw score
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '16px "Space Grotesk"';
            ctx.fillText(`Score: ${score}`, 10, 20);
            
            frame++;
        } else {
            // Game Over State
            ctx.fillStyle = 'white';
            ctx.font = '20px "Space Grotesk"';
            ctx.fillText('Game Over', 100, 40);
            ctx.font = '12px "Outfit"';
            ctx.fillText('Click to restart', 110, 60);
        }
        
        requestAnimationFrame(gameLoop);
    }

    // Controls
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if(window.scrollY < 200) e.preventDefault();
            jump();
        }
    });
    
    canvas.addEventListener('click', jump);
    
    // Start game
    gameLoop();
}
