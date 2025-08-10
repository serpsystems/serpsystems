// ===== INTERACTIVE NETWORK BACKGROUND =====
function initNetworkBackground() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0 };
    let animationId;
    
    // Resize canvas to match about section
    function resizeCanvas() {
        const rect = aboutSection.getBoundingClientRect();
        canvas.width = aboutSection.offsetWidth;
        canvas.height = aboutSection.offsetHeight;
    }
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Keep particles in bounds
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        }
    }
    
    // Initialize particles
    function initParticles() {
        particles = [];
        const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Draw connections
    function drawConnections() {
        const maxDistance = 150;
        
        // Connect particles to each other
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            
            // Connect particles to mouse
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance) * 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        drawConnections();
        
        // Draw mouse point with glow effect
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    
    document.addEventListener('mousemove', (e) => {
        const rect = aboutSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        
        // Only track mouse if it's within the about section
        if (mouse.x < 0 || mouse.x > canvas.width || mouse.y < 0 || mouse.y > canvas.height) {
            mouse.x = -1000; // Move mouse off-canvas when outside section
            mouse.y = -1000;
        }
    });
    
    // Initialize
    resizeCanvas();
    initParticles();
    animate();
    
    // Cleanup function
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNetworkBackground();
});
