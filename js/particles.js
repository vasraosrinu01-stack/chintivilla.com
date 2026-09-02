/**
 * FRNDSPACE LUXURY NIGHT VILLA - PARTICLES & STARFIELD CANVAS ENGINE
 * Creates a starry night sky with gentle drifting fireflies/embers reacting smoothly to cursor movements.
 */

(function () {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
  let stars = [];
  let fireflies = [];

  const STAR_COUNT = Math.min(Math.floor((width * height) / 10000), 120);
  const FIREFLY_COUNT = Math.min(Math.floor((width * height) / 25000), 35);

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  class Star {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5 + 0.5;
      this.baseAlpha = Math.random() * 0.7 + 0.2;
      this.alpha = this.baseAlpha;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinklePhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.twinklePhase += this.twinkleSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.twinklePhase) * 0.3;
      if (this.alpha < 0.1) this.alpha = 0.1;
      if (this.alpha > 0.95) this.alpha = 0.95;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  class Firefly {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 1.2;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = -Math.random() * 0.5 - 0.2; // drift upwards
      this.alpha = Math.random() * 0.6 + 0.3;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulse = Math.random() * Math.PI;
      this.hue = Math.random() > 0.3 ? 42 : 160; // gold / turquoise glow
    }

    update() {
      this.pulse += this.pulseSpeed;
      this.alpha = 0.4 + Math.sin(this.pulse) * 0.35;

      // Mouse influence
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.x -= (dx / dist) * 0.8;
        this.y -= (dy / dist) * 0.8;
      }

      this.x += this.vx + Math.sin(this.pulse) * 0.3;
      this.y += this.vy;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
        this.y = height + 10;
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      
      const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3.5);
      if (this.hue === 42) {
        glow.addColorStop(0, `rgba(245, 190, 60, ${this.alpha})`);
        glow.addColorStop(1, `rgba(245, 190, 60, 0)`);
      } else {
        glow.addColorStop(0, `rgba(56, 189, 248, ${this.alpha})`);
        glow.addColorStop(1, `rgba(56, 189, 248, 0)`);
      }

      ctx.fillStyle = glow;
      ctx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    stars = [];
    fireflies = [];
    for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
    for (let i = 0; i < FIREFLY_COUNT; i++) fireflies.push(new Firefly());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Draw stars
    stars.forEach((star) => {
      star.update();
      star.draw();
    });

    // Draw fireflies
    fireflies.forEach((ff) => {
      ff.update();
      ff.draw();
    });

    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
})();
