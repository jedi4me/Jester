/* Jester frontend JS: menu, reveal, gallery search, testimonials, chat widget (AI mock) */

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* -------------------------
   1) Floating hearts canvas
   ------------------------- */
(function heartsCanvas(){
  const c = $('#bgCanvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w,h,parts=[];
  const resize = ()=>{ w=c.width=window.innerWidth; h=c.height=window.innerHeight; };
  resize(); window.addEventListener('resize', resize);
  function spawn(){
    const x=Math.random()*w, s=0.6+Math.random()*1.2;
    parts.push({x,y:h+20,vy:-(0.3+Math.random()*0.9),vx:(Math.random()-0.5)*0.6,s,a:0.7+Math.random()*0.6,rot:Math.random()*6});
  }
  function draw(x,y,s,a,rot){
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.scale(s,s); ctx.globalAlpha=a;
    ctx.fillStyle='#E10600'; ctx.beginPath();
    ctx.moveTo(0,0); ctx.bezierCurveTo(0,-3,-4,-6,-8,-6); ctx.bezierCurveTo(-16,-6,-16,6,-16,6);
    ctx.bezierCurveTo(-16,14,-6,18,0,24); ctx.bezierCurveTo(6,18,16,14,16,6);
    ctx.bezierCurveTo(16,6,16,-6,8,-6); ctx.bezierCurveTo(4,-6,0,-3,0,0); ctx.fill();
    ctx.restore();
  }
  function tick(){
    ctx.clearRect(0,0,w,h);
    if(parts.length < 50 && Math.random()<0.6) spawn();
    parts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.a-=0.001; p.rot+=0.01; });
    parts = parts.filter(p => p.y > -40 && p.a > 0.02);
    parts.forEach(p => draw(p.x,p.y,p.s,p.a,p.rot));
    requestAnimationFrame(tick);
  }
  tick();
})();

/* -------------------------
   2) Reveal on scroll
   ------------------------- */
(function reveal(){
  const obs = new IntersectionObserver((entries)=> {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('is-visible'); });
  }, {threshold: 0.12});
  $$('.reveal').forEach(el => obs.observe(el));
})();

/* -------------------------
   3) Mobile menu toggle
   ------------------------- */
(function mobileMenu(){
  const burger = $('#burger'), nav = $('#nav');
  burger?.addEventListener('click', ()=>{
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('#nav a').forEach(a => a.addEventListener('click', ()=> nav.classList.remove('open')));
})();

/* -------------------------
   4) Smooth scroll for anchors
   ------------------------- */
(function smooth(){
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e=>{
    const href = a.getAttribute('href'); if(!href || href === '#') return;
    const el = document.querySelector(href); if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
  }));
})();

// Select video items
const videoItems = document.querySelectorAll('.video-item video');
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeBtn = document.querySelector('.video-modal .close');

// Play video on hover
videoItems.forEach(video => {
  video.addEventListener('mouseenter', () => video.play());
  video.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0; // reset
  });

  // Open in fullscreen modal
  video.parentElement.addEventListener('click', () => {
    modal.style.display = 'flex';
    modalVideo.src = video.src;
    modalVideo.play();
  });
});

// Close modal
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  modalVideo.pause();
  modalVideo.src = "";
});

/* -------------------------
   5) Gallery search filter
   ------------------------- */
(function gallerySearch(){
  const input = $('#gallerySearch'); if(!input) return;
  const photos = $$('.photo');
  input.addEventListener('input', ()=>{
    const q = input.value.trim().toLowerCase();
    photos.forEach(p => {
      const tags = (p.dataset.tags || '').toLowerCase();
      if(q === '' || tags.includes(q)) p.classList.remove('hidden'); else p.classList.add('hidden');
    });
  });
})();

/* -------------------------
   6) Testimonials carousel
   ------------------------- */
(function testi(){
  const track = $('#testiTrack'); if(!track) return;
  const cards = Array.from(track.children);
  let idx = 0;
  const show = i => cards.forEach((c,j)=> c.classList.toggle('active', j===i));
  show(0);
  let t = setInterval(()=>{ idx = (idx+1)%cards.length; show(idx); }, 6000);
  $('.tbtn.prev')?.addEventListener('click', ()=>{ idx=(idx-1+cards.length)%cards.length; show(idx); clearInterval(t); t=setInterval(()=>{ idx=(idx+1)%cards.length; show(idx); },6000);});
  $('.tbtn.next')?.addEventListener('click', ()=>{ idx=(idx+1)%cards.length; show(idx); clearInterval(t); t=setInterval(()=>{ idx=(idx+1)%cards.length; show(idx); },6000);});
})();

/* -------------------------
   7) Search overlay behavior
   ------------------------- */
(function globalSearch(){
  const open = $('#openSearch'), overlay = $('#searchOverlay'), close = $('#closeSearch'), form = $('#searchForm');
  if(!open || !overlay) return;
  open.addEventListener('click', ()=> overlay.removeAttribute('hidden'));
  close?.addEventListener('click', ()=> overlay.setAttribute('hidden',''));
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const q = ($('#globalSearch').value || '').trim().toLowerCase();
    const photos = $$('.photo');
    photos.forEach(p => p.classList.toggle('hidden', q !== '' && !(p.dataset.tags || '').includes(q)));
    overlay.setAttribute('hidden','');
    $('#gallery')?.scrollIntoView({behavior:'smooth'});
  });
})();

/* -------------------------
   8) Contact form demo
   ------------------------- */
(function contactDemo(){
  const form = $('#contactForm'); if(!form) return;
  const status = $('#contactStatus');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n=form.name.value.trim(), em=form.email.value.trim(), msg=form.message.value.trim();
    if(!n||!em||!msg){ status.textContent='Please fill all fields.'; status.style.color='salmon'; return; }
    status.textContent='Sending…'; status.style.color='#fff';
    setTimeout(()=>{ status.textContent='Message sent! (demo)'; status.style.color='lightgreen'; form.reset(); }, 900);
  });
})();

/* -------------------------
   9) Back to top
   ------------------------- */
$('#toTop')?.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

/* -------------------------
   10) AI Mock: Jester Bot
   ------------------------- */
/* This section implements a client-side mock AI personality.
   Replace callRealAI() with a server call for real AI.
*/
(function jesterBot(){
  const toggle = $('#chatToggle'), panel = $('#chatPanel'), close = $('#closeChat'), minimize = $('#minimizeChat');
  const form = $('#chatForm'), input = $('#chatInput'), messages = $('#messagesArea'), badge = $('#chatBadge');

  // small initial badge
  badge.textContent = '!';

  const cannedReplies = [
    "Love is in the air ❤️ How are you feeling today?",
    "That's beautiful — tell me more! 😍",
    "I can help you craft a sweet message. Want a romantic line for today?",
    "Across the world, hearts stay connected 🌍❤️ Would you like to share a photo?",
    "If you say 'gallery', I'll show photo suggestions!",
    "A wedding message idea: 'Our hearts beat together, even miles apart.'",
    "I'm Jester Bot — think of me as your cute, helpful assistant 😊"
  ];

  // simple context-aware mini-responses
  function smartReply(userText){
    const t = userText.toLowerCase();
    if(t.includes('hello') || t.includes('hi')) return "Hello! 😊 What would you like to do — chat, browse photos, or get a sweet message?";
    if(t.includes('wedding') || t.includes('marriage')) return "Congrats! 🎉 Want a wedding caption or photo suggestions for the big day?";
    if(t.includes('photo') || t.includes('gallery')) return "Try searching the gallery with tags like 'wedding', 'smile', or 'family' — I've highlighted some for you.";
    if(t.includes('love') || t.includes('romance')) return "Here's a little line: 'Even across distances, our heartbeat finds yours.' ❤️";
    if(t.includes('help')) return "I can suggest messages, photo ideas, or playful replies. What do you need?";
    // fallback random canned reply
    return cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
  }

  // show typing indicator
  function showTyping(){
    const m = document.createElement('div'); m.className='msg from typing';
    const b = document.createElement('div'); b.className='bubble';
    const dots = document.createElement('div'); dots.className='typing';
    dots.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    b.appendChild(dots); m.appendChild(b); messages.appendChild(m);
    messages.scrollTop = messages.scrollHeight;
    return m;
  }

  // add message bubble
  function appendMessage(side, text, raw=false){
    const wrap = document.createElement('div'); wrap.className = 'msg ' + (side==='to' ? 'to' : 'from');
    const b = document.createElement('div'); b.className='bubble';
    b.innerHTML = raw ? text : escapeHtml(text).replace(/\n/g,'<br>');
    wrap.appendChild(b); messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // open/close behavior
  function openPanel(){
    panel.classList.add('open'); panel.removeAttribute('aria-hidden'); badge.style.display='none';
    setTimeout(()=> input.focus(), 220);
  }
  function closePanel(){
    panel.classList.remove('open'); panel.setAttribute('aria-hidden','true'); badge.style.display='';
  }

  toggle?.addEventListener('click', ()=> {
    if(panel.classList.contains('open')) closePanel(); else openPanel();
  });
  close?.addEventListener('click', closePanel);
  minimize?.addEventListener('click', ()=> panel.classList.toggle('open'));

  // demo: when the user types and submits, bot replies after a delay
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    appendMessage('to', text);
    input.value = '';
    // OPTIONAL hook: send to server instead of local mock
    // window.sendMessageToServer({to: SOME_ID, text});
    // show typing and then reply
    const typingNode = showTyping();
    const delay = 700 + Math.random()*900; // 0.7s - 1.6s
    setTimeout(()=> {
      typingNode.remove();
      // If you want to hook to a real AI, replace following with callRealAI(text).then(...)
      const reply = smartReply(text);
      appendMessage('from', reply);
    }, delay);
  });

  // small helper for testing quick replies via keyboard arrow up (recall last)
  let lastOutgoing = '';
  messages.addEventListener('click', ()=> input.focus());

  // expose placeholder for real backend integration
  window.sendMessageToServer = function(payload){
    // Replace with AJAX / WebSocket call that posts to your server
    // Example: fetch('/send_message.php', {method:'POST', body: JSON.stringify(payload)})
    console.log("sendMessageToServer() placeholder", payload);
  };

  // Placeholder for how to wire real AI (server)
  window.callRealAI = async function(userText){
    // Example (pseudo):
    // const res = await fetch('/ai_reply.php', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({text:userText})});
    // const data = await res.json();
    // return data.reply;
    throw new Error("callRealAI not implemented — replace this with server call to your AI backend.");
  };
})();
