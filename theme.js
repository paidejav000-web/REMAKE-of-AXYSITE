
// theme.js - particles, theme system, persistence across pages
(() => {
  // Canvas and rendering
  const canvas = document.getElementById('bg');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if(!canvas || !ctx){
    console.warn('Canvas not found; theme.js requires <canvas id="bg"> in HTML.');
    return;
  }

  // sizing
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  // mouse smoothing
  const mouse = { x: innerWidth/2, y: innerHeight/2, radius: 120 };
  const smoothed = { x: mouse.x, y: mouse.y };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  // particles/trails/ambient
  let particles = [], trails = [], ambient = [];
  function initParticles(){
    particles = []; trails = []; ambient = [];
    for(let i=0;i<80;i++){
      particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*2+1, dx: (Math.random()-0.5)*0.7, dy: (Math.random()-0.5)*0.7 });
    }
    for(let i=0;i<50;i++){
      ambient.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*1.5+0.5, dx: (Math.random()-0.5)*0.2, dy: (Math.random()-0.5)*0.2 });
    }
  }
  initParticles();

  function addTrail(x,y){ trails.push({ x, y, alpha: 0.5, radius: Math.random()*3+1 }); if(trails.length>300) trails.shift(); }

  // theme definitions
  const themeColors = {
    red:   { main:[255,30,30], glow:[255,60,60], trail:[255,50,50], ambient:[255,50,50], bg:[25,0,0], heroBg:[25,0,0], footerBg:[10,0,0] },
    navy:  { main:[0,51,204], glow:[51,102,255], trail:[0,50,200], ambient:[0,50,200], bg:[0,0,25], heroBg:[0,0,25], footerBg:[0,0,25] },
    green: { main:[0,255,102], glow:[51,255,153], trail:[0,255,100], ambient:[0,255,100], bg:[0,25,0], heroBg:[0,25,0], footerBg:[0,10,0] },
    purple:{ main:[204,0,255], glow:[255,51,255], trail:[204,0,255], ambient:[204,0,255], bg:[25,0,25], heroBg:[25,0,25], footerBg:[10,0,10] }
  };

  // state
  let targetColors = JSON.parse(JSON.stringify(themeColors.red));
  let currentColors = JSON.parse(JSON.stringify(themeColors.red));

  // helpers
  function lerp(a,b,t){ return a + (b-a)*t; }
  function lerpColor(a,b,t){ return [ lerp(a[0],b[0],t), lerp(a[1],b[1],t), lerp(a[2],b[2],t) ]; }
  function rgb(c){ return `rgb(${Math.floor(c[0])},${Math.floor(c[1])},${Math.floor(c[2])})`; }
  function hexToRGB(hex){ let n = parseInt(hex.slice(1),16); return [n>>16 &255, n>>8 &255, n &255]; }
  function rgbToHex(arr){ return '#'+arr.map(v=>v.toString(16).padStart(2,'0')).join(''); }

  // UI elements
  const themeSelect = document.getElementById('themeSelect');
  const customPanel = document.getElementById('customPanel');
  const customInputs = {
    main: document.getElementById('mainColor'),
    glow: document.getElementById('glowColor'),
    trail: document.getElementById('trailColor'),
    ambient: document.getElementById('ambientColor'),
    bg: document.getElementById('bgColor'),
    heroBg: document.getElementById('heroBgColor'),
    footerBg: document.getElementById('footerBgColor')
  };
  const saveBtn = document.getElementById('saveCustom');
  const resetBtn = document.getElementById('resetTheme');

  // load saved theme from localStorage
  const STORAGE_KEY = 'AXYTheme';
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    try{
      const parsed = JSON.parse(saved);
      targetColors = parsed;
      currentColors = parsed;
      if(themeSelect) themeSelect.value = 'custom';
      if(customPanel) customPanel.style.display = 'block';
      if(customInputs.main) customInputs.main.value = rgbToHex(parsed.main);
      if(customInputs.glow) customInputs.glow.value = rgbToHex(parsed.glow);
      if(customInputs.trail) customInputs.trail.value = rgbToHex(parsed.trail);
      if(customInputs.ambient) customInputs.ambient.value = rgbToHex(parsed.ambient);
      if(customInputs.bg) customInputs.bg.value = rgbToHex(parsed.bg);
      if(customInputs.heroBg) customInputs.heroBg.value = rgbToHex(parsed.heroBg);
      if(customInputs.footerBg) customInputs.footerBg.value = rgbToHex(parsed.footerBg);
    }catch(e){ console.warn('Failed to parse saved theme', e); }
  }

  // theme UI interactions (guard if elements missing)
  if(themeSelect){
    themeSelect.addEventListener('change', e=>{
      const v = e.target.value;
      if(v === 'custom'){
        if(customPanel) customPanel.style.display = 'block';
      } else {
        if(customPanel) customPanel.style.display = 'none';
        if(themeColors[v]) targetColors = JSON.parse(JSON.stringify(themeColors[v]));
        // remove custom storage to allow default behavior across pages
        localStorage.removeItem(STORAGE_KEY);
      }
    });
  }

  Object.values(customInputs).forEach(inp=>{
    if(!inp) return;
    inp.addEventListener('input', ()=>{
      targetColors = {
        main: hexToRGB(customInputs.main.value),
        glow: hexToRGB(customInputs.glow.value),
        trail: hexToRGB(customInputs.trail.value),
        ambient: hexToRGB(customInputs.ambient.value),
        bg: hexToRGB(customInputs.bg.value),
        heroBg: hexToRGB(customInputs.heroBg.value),
        footerBg: hexToRGB(customInputs.footerBg.value)
      };
    });
  });

  if(saveBtn){
    saveBtn.addEventListener('click', ()=>{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(targetColors));
      alert('Custom theme saved!');
    });
  }

  if(resetBtn){
    resetBtn.addEventListener('click', ()=>{
      localStorage.removeItem(STORAGE_KEY);
      targetColors = JSON.parse(JSON.stringify(themeColors.red));
      currentColors = JSON.parse(JSON.stringify(themeColors.red));
      if(themeSelect) themeSelect.value = 'red';
      if(customPanel) customPanel.style.display = 'none';
      // immediately apply
      applyImmediate();
    });
  }

  function applyImmediate(){
    // set UI colors immediately based on currentColors
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    const footer = document.querySelector('footer');
    const notice = document.querySelector('.notice');
    const links = document.querySelectorAll('nav a');
    if(header) header.style.background = `rgba(${currentColors.bg[0]},${currentColors.bg[1]},${currentColors.bg[2]},0.9)`;
    if(header && header.querySelector('h1')) header.querySelector('h1').style.color = rgb(currentColors.main);
    if(hero) hero.style.background = `rgba(${currentColors.heroBg[0]},${currentColors.heroBg[1]},${currentColors.heroBg[2]},0.7)`;
    if(hero && hero.querySelector('h2')) hero.querySelector('h2').style.color = rgb(currentColors.glow);
    if(notice) notice.style.borderColor = rgb(currentColors.main);
    if(footer) footer.style.background = `rgba(${currentColors.footerBg[0]},${currentColors.footerBg[1]},${currentColors.footerBg[2]},0.9)`;
    if(links) links.forEach(a=>{ a.style.borderColor = rgb(currentColors.main); a.style.color = rgb(currentColors.main); });
  }

  // animation loop
  function draw(){
    if(!ctx) return;
    // background wash
    ctx.fillStyle = `rgba(${currentColors.bg[0]},${currentColors.bg[1]},${currentColors.bg[2]},0.12)`;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // smooth mouse
    smoothed.x += (mouse.x - smoothed.x) * 0.12;
    smoothed.y += (mouse.y - smoothed.y) * 0.12;

    // lerp colors
    for(const key in currentColors){
      currentColors[key] = lerpColor(currentColors[key], targetColors[key], 0.08);
    }

    // update UI colors
    applyImmediate();

    // ambient
    ambient.forEach(a=>{
      a.x += a.dx; a.y += a.dy;
      if(a.x < 0 || a.x > canvas.width) a.dx *= -1;
      if(a.y < 0 || a.y > canvas.height) a.dy *= -1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${Math.floor(currentColors.ambient[0])},${Math.floor(currentColors.ambient[1])},${Math.floor(currentColors.ambient[2])},0.12)`;
      ctx.arc(a.x,a.y,a.r,0,Math.PI*2); ctx.fill();
    });

    // particles + connections
    particles.forEach((p,i)=>{
      const dx = p.x - smoothed.x, dy = p.y - smoothed.y;
      const dist = Math.hypot(dx,dy);
      if(dist < mouse.radius){
        const angle = Math.atan2(dy,dx);
        const force = (mouse.radius - dist) / mouse.radius;
        p.dx += Math.cos(angle)*-0.3*force; p.dy += Math.sin(angle)*-0.3*force;
        addTrail(smoothed.x, smoothed.y);
      }
      p.x += p.dx; p.y += p.dy;
      if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if(p.y < 0 || p.y > canvas.height) p.dy *= -1;
      const glow = Math.max(0, 1 - dist/300);
      ctx.beginPath();
      ctx.fillStyle = `rgba(${Math.floor(currentColors.trail[0])},${Math.floor(currentColors.trail[1])},${Math.floor(currentColors.trail[2])},${0.8 - glow/2})`;
      ctx.arc(p.x, p.y, p.r + glow*2, 0, Math.PI*2); ctx.fill();

      for(let j=i+1;j<particles.length;j++){
        const p2 = particles[j];
        const d = Math.hypot(p.x - p2.x, p.y - p2.y);
        if(d < 120){
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${Math.floor(currentColors.trail[0])},${Math.floor(currentColors.trail[1])},${Math.floor(currentColors.trail[2])},${1 - d/120})`;
          ctx.lineWidth = 1; ctx.moveTo(p.x,p.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
        }
      }
    });

    // trails
    for(let i = trails.length-1; i >= 0; i--){
      const t = trails[i];
      ctx.beginPath();
      ctx.fillStyle = `rgba(${Math.floor(currentColors.trail[0])},${Math.floor(currentColors.trail[1])},${Math.floor(currentColors.trail[2])},${t.alpha})`;
      ctx.arc(t.x,t.y,t.radius,0,Math.PI*2); ctx.fill();
      t.alpha -= 0.015;
      if(t.alpha <= 0) trails.splice(i,1);
    }

    requestAnimationFrame(draw);
  }
  draw();

  // expose small API in case pages want to interact
  window.AXYTheme = {
    setTheme(name){
      if(themeColors[name]) targetColors = JSON.parse(JSON.stringify(themeColors[name]));
      localStorage.removeItem(STORAGE_KEY);
      if(themeSelect) themeSelect.value = name;
    },
    getCurrentColors(){ return currentColors; },
    reset(){ localStorage.removeItem(STORAGE_KEY); targetColors = JSON.parse(JSON.stringify(themeColors.red)); currentColors = JSON.parse(JSON.stringify(themeColors.red)); if(themeSelect) themeSelect.value='red'; if(customPanel) customPanel.style.display='none'; }
  };
})();
