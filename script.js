

/* ==========================================
   NATURALIST — Nature Gallery JS
   ========================================== */

// --- Gallery Data (8 nature + 8 city + 8 animals) ---
const galleryData = [
  { cat: 'nature', title: 'Mist Valley' },
  { cat: 'nature', title: 'River Bend' },
  { cat: 'nature', title: 'Sunset Field' },
  { cat: 'nature', title: 'Forest Canopy' },
  { cat: 'nature', title: 'Golden Hour' },
  { cat: 'nature', title: 'Autumn Path' },
  { cat: 'nature', title: 'Desert Dunes' },
  { cat: 'nature', title: 'Mountain Peak' },
  { cat: 'city', title: 'Downtown' },
  { cat: 'city', title: 'Night Glow' },
  { cat: 'city', title: 'Bridge View' },
  { cat: 'city', title: 'Harbor Line' },
  { cat: 'city', title: 'Cityscape' },
  { cat: 'city', title: 'Urban Life' },
  { cat: 'city', title: 'Skyline' },
  { cat: 'city', title: 'Metropolis' },
  { cat: 'animals', title: 'Wild Stare' },
  { cat: 'animals', title: 'Savanna King' },
  { cat: 'animals', title: 'Graceful Giraffe' },
  { cat: 'animals', title: 'Zebra Plains' },
  { cat: 'animals', title: 'Forest Friend' },
  { cat: 'animals', title: 'Big Cat' },
  { cat: 'animals', title: 'Polar Explorer' },
  { cat: 'animals', title: 'Night Hunter' }
];

// --- DOM References ---
const images = document.querySelectorAll('.gallery-item img');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxCaption = document.getElementById('lightbox-caption');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentIndex = 0;
let isLightboxOpen = false;

// ==========================================
// NATURE BACKGROUND (Canvas 2D)
// ==========================================
const canvas = document.getElementById('nature-canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// --- Mountains ---
const mountains = [];
function initMountains() {
  mountains.length = 0;
  const layers = [
    { count: 6, yBase: 0.55, height: 0.15, color: 'rgba(100,130,100,0.25)', detail: 4 },
    { count: 5, yBase: 0.60, height: 0.12, color: 'rgba(80,110,80,0.3)', detail: 3 },
    { count: 4, yBase: 0.65, height: 0.10, color: 'rgba(60,90,60,0.35)', detail: 2 }
  ];
  layers.forEach(layer => {
    const pts = [];
    const spacing = W / (layer.count - 1);
    for (let i = 0; i < layer.count; i++) {
      const x = i * spacing + (Math.random() - 0.5) * spacing * 0.3;
      const baseY = H * layer.yBase;
      const peakH = H * layer.height * (0.5 + Math.random() * 0.5);
      pts.push({ x, y: baseY - peakH });
    }
    mountains.push({ pts, color: layer.color, detail: layer.detail });
  });
}
initMountains();
window.addEventListener('resize', initMountains);

// --- Clouds ---
const clouds = [];
function initClouds() {
  clouds.length = 0;
  const count = Math.max(4, Math.floor(W / 300));
  for (let i = 0; i < count; i++) {
    clouds.push({
      x: Math.random() * W * 1.5 - W * 0.25,
      y: H * (0.05 + Math.random() * 0.15),
      w: 80 + Math.random() * 160,
      h: 25 + Math.random() * 35,
      speed: 0.15 + Math.random() * 0.2,
      opacity: 0.4 + Math.random() * 0.4,
      segments: 3 + Math.floor(Math.random() * 3)
    });
  }
}
initClouds();
window.addEventListener('resize', initClouds);

// --- Trees (left and right sides) ---
const trees = [];
function initTrees() {
  trees.length = 0;
  const count = Math.max(6, Math.floor(H / 120));
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < count; i++) {
      const xBase = side === -1 ? W * 0.02 : W * 0.98;
      const xOffset = (Math.random() - 0.5) * W * 0.04;
      const yPos = H * (0.35 + Math.random() * 0.45);
      const height = H * (0.12 + Math.random() * 0.15);
      const width = height * (0.22 + Math.random() * 0.08);
      const lean = (Math.random() - 0.5) * 0.04;
      trees.push({
        x: xBase + xOffset, y: yPos, h: height, w: width,
        lean, sway: 0.002 + Math.random() * 0.003,
        swayOffset: Math.random() * Math.PI * 2,
        trunkColor: `hsl(25, 30%, ${25 + Math.random() * 15}%)`,
        leafColor: `hsl(${100 + Math.random() * 30}, ${40 + Math.random() * 20}%, ${25 + Math.random() * 20}%)`,
        leafShade: `hsl(${100 + Math.random() * 30}, 40%, ${15 + Math.random() * 15}%)`
      });
    }
  }
}
initTrees();
window.addEventListener('resize', initTrees);

// --- Grass blades ---
const grass = [];
function initGrass() {
  grass.length = 0;
  const count = Math.floor(W * 0.3);
  for (let i = 0; i < count; i++) {
    grass.push({
      x: Math.random() * W,
      h: 15 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.01,
      color: `hsl(${90 + Math.random() * 30}, ${30 + Math.random() * 30}%, ${25 + Math.random() * 20}%)`,
      sway: 0.3 + Math.random() * 0.4
    });
  }
}
initGrass();
window.addEventListener('resize', initGrass);

// --- Falling leaves ---
const leaves = [];
function spawnLeaf() {
  leaves.push({
    x: Math.random() * W,
    y: -20,
    size: 4 + Math.random() * 8,
    speedY: 0.3 + Math.random() * 0.5,
    speedX: (Math.random() - 0.5) * 0.3,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.03,
    swing: Math.random() * 2,
    swingSpeed: 0.02 + Math.random() * 0.02,
    phase: Math.random() * Math.PI * 2,
    color: `hsl(${30 + Math.random() * 40}, ${50 + Math.random() * 30}%, ${30 + Math.random() * 25}%)`,
    opacity: 0.4 + Math.random() * 0.4
  });
}

// --- Butterflies ---
const butterflies = [];
function spawnButterfly() {
  const side = Math.random() > 0.5 ? -1 : 1;
  butterflies.push({
    x: side === -1 ? -40 : W + 40,
    y: H * (0.15 + Math.random() * 0.4),
    speedX: side * (0.4 + Math.random() * 0.4),
    speedY: 0,
    wobbleAmp: 20 + Math.random() * 30,
    wobbleFreq: 0.02 + Math.random() * 0.02,
    phase: Math.random() * Math.PI * 2,
    wingAngle: 0,
    wingSpeed: 0.08 + Math.random() * 0.06,
    size: 3 + Math.random() * 3,
    color: `hsl(${Math.random() * 60 + 280}, ${60 + Math.random() * 30}%, ${40 + Math.random() * 30}%)`,
    opacity: 0.5 + Math.random() * 0.3
  });
}

// --- Birds ---
const birds = [];
function spawnBird() {
  const side = Math.random() > 0.5 ? -1 : 1;
  birds.push({
    x: side === -1 ? -60 : W + 60,
    y: H * (0.05 + Math.random() * 0.12),
    speedX: side * (0.6 + Math.random() * 0.5),
    speedY: 0,
    wobbleAmp: 5 + Math.random() * 8,
    wobbleFreq: 0.03 + Math.random() * 0.02,
    phase: Math.random() * Math.PI * 2,
    wingPos: 0,
    wingSpeed: 0.05 + Math.random() * 0.03,
    size: 5 + Math.random() * 4
  });
}

// --- Pollen / Dust particles ---
const pollen = [];
function initPollen() {
  pollen.length = 0;
  const count = Math.floor(W * 0.08);
  for (let i = 0; i < count; i++) {
    pollen.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.7,
      size: 1 + Math.random() * 2,
      speedY: -0.1 - Math.random() * 0.15,
      speedX: (Math.random() - 0.5) * 0.15,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.1 + Math.random() * 0.25
    });
  }
}
initPollen();
window.addEventListener('resize', initPollen);

// --- Mist particles ---
const mist = [];
function initMist() {
  mist.length = 0;
  const count = Math.max(8, Math.floor(W / 150));
  for (let i = 0; i < count; i++) {
    mist.push({
      x: Math.random() * W * 1.3 - W * 0.15,
      y: H * (0.4 + Math.random() * 0.4),
      w: 100 + Math.random() * 200,
      h: 30 + Math.random() * 40,
      speed: 0.1 + Math.random() * 0.15,
      opacity: 0.03 + Math.random() * 0.05
    });
  }
}
initMist();
window.addEventListener('resize', initMist);

// --- Timers for spawning ---
let leafTimer = 0;
let butterflyTimer = 0;
let birdTimer = 0;
let time = 0;

// ==========================================
// DRAW THE NATURE SCENE
// ==========================================
function drawNature(time) {
  ctx.clearRect(0, 0, W, H);

  // 1. Sky (already handled by CSS gradient, but draw atmospheric gradient)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, 'rgba(135, 206, 235, 0.3)');
  skyGrad.addColorStop(0.5, 'rgba(184, 228, 240, 0.1)');
  skyGrad.addColorStop(1, 'rgba(200, 230, 201, 0)');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Distant mountains with fog
  mountains.forEach(layer => {
    ctx.beginPath();
    ctx.moveTo(0, H);
    const pts = layer.pts;
    for (let i = 0; i < pts.length; i++) {
      const x = pts[i].x;
      const y = pts[i].y + Math.sin(time * 0.0003 + i) * 2;
      if (i === 0) ctx.lineTo(x, y);
      else {
        const prev = pts[i - 1];
        const cpx = (prev.x + x) / 2;
        const cpy = (prev.y + y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
      }
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = layer.color;
    ctx.fill();
  });

  // 3. Draw trees (behind content)
  trees.forEach(tree => {
    const sway = Math.sin(time * tree.sway + tree.swayOffset) * tree.w * 0.04;
    const x = tree.x + sway;

    // Trunk
    ctx.fillStyle = tree.trunkColor;
    ctx.fillRect(x - tree.w * 0.06, tree.y - tree.h * 0.6, tree.w * 0.12, tree.h * 0.6);

    // Foliage - multiple circles
    const leafColor = tree.leafColor;
    const leafShade = tree.leafShade;
    const leafSway = Math.sin(time * tree.sway + tree.swayOffset + 1) * tree.w * 0.02;

    // Draw layered canopy
    for (let layer = 0; layer < 5; layer++) {
      const cx = x + leafSway * (1 - layer * 0.2);
      const cy = tree.y - tree.h * 0.6 - layer * tree.h * 0.12;
      const r = tree.w * (0.5 - layer * 0.07);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = layer % 2 === 0 ? leafColor : leafShade;
      ctx.fill();
    }
  });

  // 4. Grass at bottom
  grass.forEach(g => {
    const sway = Math.sin(time * g.speed + g.phase) * g.sway * 3;
    ctx.beginPath();
    ctx.moveTo(g.x, H);
    ctx.quadraticCurveTo(g.x + sway, H - g.h * 0.8, g.x + sway * 1.3, H - g.h);
    ctx.strokeStyle = g.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // 5. Clouds
  clouds.forEach(c => {
    c.x += c.speed;
    if (c.x > W + c.w) c.x = -c.w;
    ctx.globalAlpha = c.opacity;
    ctx.fillStyle = '#fff';
    const segW = c.w / c.segments;
    for (let i = 0; i < c.segments; i++) {
      const cx = c.x + i * segW + segW / 2 + Math.sin(i * 2) * segW * 0.15;
      const cy = c.y + Math.sin(i * 1.5) * c.h * 0.2;
      const r = c.h * (0.5 + Math.sin(i * 0.8) * 0.3);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });

  // 6. Pollen / dust floating
  pollen.forEach(p => {
    p.x += p.speedX + Math.sin(time * 0.001 + p.phase) * 0.05;
    p.y += p.speedY + Math.sin(time * 0.002 + p.phase) * 0.03;
    if (p.y < -10) { p.y = H * 0.7; p.x = Math.random() * W; }
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 200, ${p.opacity})`;
    ctx.fill();
  });

  // 7. Mist
  mist.forEach(m => {
    m.x += m.speed;
    if (m.x > W + m.w) m.x = -m.w;
    const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.w);
    grad.addColorStop(0, `rgba(220, 240, 220, ${m.opacity})`);
    grad.addColorStop(0.5, `rgba(220, 240, 220, ${m.opacity * 0.5})`);
    grad.addColorStop(1, 'rgba(220, 240, 220, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(m.x - m.w, m.y - m.h, m.w * 2, m.h * 2);
  });

  // 8. Birds
  birds.forEach((b, idx) => {
    b.x += b.speedX;
    b.y += Math.sin(time * b.wobbleFreq + b.phase) * b.wobbleAmp * 0.02;
    b.wingPos = Math.sin(time * b.wingSpeed) * 0.4;

    if (b.x < -80 || b.x > W + 80) {
      birds.splice(idx, 1);
      return;
    }

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(b.speedX > 0 ? 1 : -1, 1);
    ctx.strokeStyle = '#2d2d2d';
    ctx.lineWidth = 1.5;

    // Simple V-shaped bird
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-b.size, -b.size * (0.3 + b.wingPos), -b.size * 1.5, -b.size * 0.1);
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-b.size, b.size * (0.3 + b.wingPos), -b.size * 1.5, b.size * 0.1);
    ctx.stroke();
    ctx.restore();
  });

  // 9. Butterflies
  butterflies.forEach((bf, idx) => {
    bf.x += bf.speedX;
    bf.y += Math.sin(time * bf.wobbleFreq + bf.phase) * bf.wobbleAmp * 0.01;
    bf.wingAngle += bf.wingSpeed;

    if (bf.x < -50 || bf.x > W + 50) {
      butterflies.splice(idx, 1);
      return;
    }

    ctx.save();
    ctx.translate(bf.x, bf.y);
    const wingFlap = Math.abs(Math.sin(bf.wingAngle));
    const wingSize = bf.size * 3;

    // Left wing
    ctx.beginPath();
    ctx.ellipse(-wingSize * 0.3, 0, wingSize * (0.3 + wingFlap * 0.3), wingSize * 0.3, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = bf.color;
    ctx.globalAlpha = bf.opacity;
    ctx.fill();

    // Right wing
    ctx.beginPath();
    ctx.ellipse(wingSize * 0.3, 0, wingSize * (0.3 + wingFlap * 0.3), wingSize * 0.3, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.restore();
  });

  // 10. Falling leaves
  leaves.forEach((leaf, idx) => {
    leaf.x += leaf.speedX + Math.sin(time * leaf.swingSpeed + leaf.phase) * leaf.swing * 0.5;
    leaf.y += leaf.speedY;
    leaf.rot += leaf.rotSpeed;

    if (leaf.y > H + 20) {
      leaves.splice(idx, 1);
      return;
    }

    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.rot);
    ctx.globalAlpha = leaf.opacity;
    ctx.fillStyle = leaf.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, leaf.size, leaf.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  });
}

// ==========================================
// ANIMATION LOOP
// ==========================================
function animate(timestamp) {
  time = timestamp || 0;

  // Spawn leaves periodically
  leafTimer++;
  if (leafTimer > 120 + Math.random() * 80) {
    leafTimer = 0;
    spawnLeaf();
  }

  // Spawn butterflies periodically
  butterflyTimer++;
  if (butterflyTimer > 300 + Math.random() * 200 && butterflies.length < 3) {
    butterflyTimer = 0;
    spawnButterfly();
  }

  // Spawn birds periodically
  birdTimer++;
  if (birdTimer > 500 + Math.random() * 300 && birds.length < 3) {
    birdTimer = 0;
    spawnBird();
  }

  drawNature(time);
  requestAnimationFrame(animate);
}

// ==========================================
// COUNTS & FILTER BUTTON UPDATES
// ==========================================
function updateCounts() {
  const counts = { all: 0, nature: 0, city: 0, animals: 0 };
  galleryItems.forEach(item => {
    const cat = item.classList.contains('nature') ? 'nature'
               : item.classList.contains('city') ? 'city'
               : 'animals';
    counts[cat]++;
    counts.all++;
  });
  document.getElementById('count-all').textContent = counts.all;
  document.getElementById('count-nature').textContent = counts.nature;
  document.getElementById('count-city').textContent = counts.city;
  document.getElementById('count-animals').textContent = counts.animals;
}

// ==========================================
// SCROLL REVEAL ANIMATION
// ==========================================
function initScrollReveal() {
  galleryItems.forEach((item, index) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => item.classList.add('visible'), index * 50);
          observer.unobserve(item);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    observer.observe(item);
  });
}

// ==========================================
// LIGHTBOX
// ==========================================
function openLightbox(index) {
  if (isLightboxOpen) return;
  currentIndex = index;
  isLightboxOpen = true;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateLightboxContent();
}

function closeLightbox() {
  if (!isLightboxOpen) return;
  isLightboxOpen = false;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightboxContent() {
  const img = images[currentIndex];
  const data = galleryData[currentIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
  lightboxCaption.textContent = data.title;
  lightboxImg.style.animation = 'none';
  lightboxImg.offsetHeight;
  lightboxImg.style.animation = '';
}

function changeImage(step) {
  let newIndex = currentIndex + step;
  let attempts = 0;
  while (attempts < images.length) {
    if (newIndex < 0) newIndex = images.length - 1;
    else if (newIndex >= images.length) newIndex = 0;
    const parentItem = images[newIndex].closest('.gallery-item');
    if (parentItem && parentItem.style.display !== 'none') {
      currentIndex = newIndex;
      updateLightboxContent();
      return;
    }
    newIndex += step;
    attempts++;
  }
}

// ==========================================
// FILTER SELECTION
// ==========================================
function filterSelection(category) {
  filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === category));
  galleryItems.forEach((item, index) => {
    const matches = category === 'all' || item.classList.contains(category);
    item.classList.remove('filter-enter', 'filter-exit');
    if (matches) {
      item.style.display = '';
      setTimeout(() => {
        item.classList.add('filter-enter');
        item.classList.add('visible');
      }, index * 30);
    } else {
      item.classList.remove('visible');
      item.classList.add('filter-exit');
      setTimeout(() => { item.style.display = 'none'; item.classList.remove('filter-exit'); }, 300);
    }
  });
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================
document.addEventListener('keydown', (e) => {
  if (!isLightboxOpen) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeImage(-1);
  if (e.key === 'ArrowRight') changeImage(1);
});

// ==========================================
// TOUCH SUPPORT
// ==========================================
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) changeImage(diff > 0 ? 1 : -1);
}, { passive: true });

// ==========================================
// CLICK OUTSIDE TO CLOSE LIGHTBOX
// ==========================================
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) closeLightbox();
});

// ==========================================
// TITLE TEXT ANIMATION
// ==========================================
function initTitleGlow() {
  const title = document.querySelector('.site-title');
  if (!title) return;
  const text = title.textContent;
  title.innerHTML = '';
  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(20px)';
    span.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.08}s`;
    title.appendChild(span);
  });
  requestAnimationFrame(() => {
    title.querySelectorAll('span').forEach(span => {
      span.style.opacity = '1';
      span.style.transform = 'translateY(0)';
    });
  });
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateCounts();
  initScrollReveal();
  initTitleGlow();

  // First 6 items visible immediately
  setTimeout(() => {
    galleryItems.forEach((item, index) => { if (index < 6) item.classList.add('visible'); });
  }, 100);

  // Start nature animation
  requestAnimationFrame(animate);
});
