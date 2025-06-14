document.addEventListener('DOMContentLoaded', () => {
    // Динамическая загрузка Particles.js
    const particlesScript = document.createElement('script');
    particlesScript.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
    particlesScript.onload = () => {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 1000 } },
                color: { value: ['#ff6f91', '#a1c4fd', '#fff3b0'] },
                shape: { type: ['circle', 'star'] },
                opacity: { value: 0.4, random: true },
                size: { value: 2, random: true },
                line_linked: { enable: false },
                move: { enable: true, speed: 1.5, direction: 'none', random: true }
            },
            interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false } } }
        });
    };
    document.body.appendChild(particlesScript);

    // Инициализация заголовка
    const h1 = document.querySelector('h1');
    const h1Text = h1.textContent;
    h1.innerHTML = '';
    h1Text.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        h1.appendChild(span);
    });
    gsap.to(h1.querySelectorAll('span'), {
        y: -15,
        stagger: 0.05,
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
    });

    // Инициализация текста поздравления
    const h2 = document.querySelector('#message h2');
    const text = h2.textContent;
    h2.innerHTML = '';
    text.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        h2.appendChild(span);
    });

    const button = document.getElementById('show-message');
    const message = document.getElementById('message');

    // Фейерверк на канвасе
    const canvas = document.getElementById('firework-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.5;
            this.speed = Math.random() * 4 + 4;
            this.color = ['#ff6f91', '#a1c4fd', '#fff3b0'][Math.floor(Math.random() * 3)];
            this.particles = [];
            this.exploded = false;
        }
        update() {
            if (!this.exploded) {
                this.y -= this.speed;
                if (this.y <= this.targetY) {
                    this.exploded = true;
                    for (let i = 0; i < 15; i++) {
                        this.particles.push(new FireworkParticle(this.x, this.y, this.color));
                    }
                }
            } else {
                this.particles.forEach(p => p.update());
                this.particles = this.particles.filter(p => p.alpha > 0);
            }
        }
        draw() {
            if (!this.exploded) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            } else {
                this.particles.forEach(p => p.draw());
            }
        }
    }

    class FireworkParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 6;
            this.vy = (Math.random() - 0.5) * 6;
            this.alpha = 1;
            this.color = color;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.03;
            this.vy += 0.08;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${this.alpha})`;
            ctx.fill();
        }
    }

    let fireworks = [];
    function animateFireworks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.03 && fireworks.length < 3) {
            fireworks.push(new Firework());
        }
        fireworks.forEach(f => f.update());
        fireworks.forEach(f => f.draw());
        fireworks = fireworks.filter(f => f.particles.length > 0 || !f.exploded);
        requestAnimationFrame(animateFireworks);
    }

    // Анимация при клике
    button.addEventListener('click', () => {
        // Анимация кнопки
        gsap.to(button, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                button.style.display = 'none';
                animateFireworks();
            }
        });

        // Волна света
        const wave = document.createElement('div');
        wave.style.position = 'absolute';
        wave.style.top = '50%';
        wave.style.left = '50%';
        wave.style.width = '0';
        wave.style.height = '0';
        wave.style.background = 'radial-gradient(circle, rgba(161, 196, 253, 0.6), transparent)';
        wave.style.borderRadius = '50%';
        wave.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(wave);
        gsap.to(wave, {
            width: '1500px',
            height: '1500px',
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out',
            onComplete: () => wave.remove()
        });

        message.style.display = 'block';
        const spans = h2.querySelectorAll('span');

        // Анимация букв
        spans.forEach((span, index) => {
            gsap.fromTo(span, {
                opacity: 0,
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
                scale: 0,
                rotation: Math.random() * 360,
            }, {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                duration: 1.2,
                delay: index * 0.1,
                ease: 'power2.out',
                onStart: () => {
                    span.style.textShadow = `0 0 10px #${Math.floor(Math.random() * 16777215).toString(16)}`;
                }
            });
        });

        // Парящие звёзды
        for (let i = 0; i < 8; i++) {
            const star = document.createElement('div');
            star.className = 'floating-star';
            star.style.left = `${Math.random() * 80 + 10}%`;
            star.style.top = `${Math.random() * 60 + 20}%`;
            star.style.animationDelay = `${Math.random() * 4}s`;
            message.appendChild(star);
        });

        // Частицы (волшебная пыль)
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 120,
                origin: { y: 0.5 },
                colors: ['#ff6f91', '#a1c4fd', '#fff3b0', '#c2e9fb'],
                shapes: ['star', 'circle'],
                scalar: 0.7,
                ticks: 300,
            });
        }, spans.length * 100 + 1000);
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
