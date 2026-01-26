// Particle Effect for Menu Items
document.querySelectorAll('.particle-effect-btn').forEach(btn => {
    const canvas = document.createElement('canvas');
    btn.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;
    let isHovered = false;
    let mouseX = 0;
    let mouseY = 0;

    // Resize canvas
    function resize() {
        canvas.width = btn.offsetWidth;
        canvas.height = btn.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.size = Math.random() * 2 + 1;
            this.color = `rgba(0, 0, 0, ${Math.random() * 0.5})`;
        }

        update() {
            // Target is mouse position or center
             const targetX = isHovered ? mouseX : canvas.width / 2;
             const targetY = isHovered ? mouseY : canvas.height / 2;

            if (isHovered) {
                // Move towards mouse
                const dx = targetX - this.x;
                const dy = targetY - this.y;
                this.vx += dx * 0.005;
                this.vy += dy * 0.005;
                
                // Friction
                this.vx *= 0.9;
                this.vy *= 0.9;
            } else {
                 // Float randomly
                 if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                 if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            this.x += this.vx;
            this.y += this.vy;
            
            // Boundary
            if(this.x < 0) this.x = canvas.width;
            if(this.x > canvas.width) this.x = 0;
            if(this.y < 0) this.y = canvas.height;
            if(this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationFrame = requestAnimationFrame(animate);
    }
    animate();

    btn.addEventListener('mousemove', (e) => {
        isHovered = true;
        const rect = btn.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    btn.addEventListener('mouseleave', () => {
        isHovered = false;
         // Scatter a bit on leave
         particles.forEach(p => {
             p.vx = (Math.random() - 0.5) * 2;
             p.vy = (Math.random() - 0.5) * 2;
         });
    });
});
