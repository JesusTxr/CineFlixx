/* ======== CONFIG TMDB ======== */
const API_KEY = '6a481fcf062423ec368c5b6f51400204';
const API     = 'https://api.themoviedb.org/3';
const IMG92   = 'https://image.tmdb.org/t/p/w92';
const IMG185  = 'https://image.tmdb.org/t/p/w185';   // fotos de reparto
const IMG500  = 'https://image.tmdb.org/t/p/w500';
const BACK    = 'https://image.tmdb.org/t/p/original';

/* ======== Autenticación local ======== */
const DEMO = { username:'demo', password:'1234' };
const USERS_KEY   = 'cineflix_users';
const SESSION_KEY = 'cineflix_session';

const loadUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = u => localStorage.setItem(USERS_KEY, JSON.stringify(u));
if (!loadUsers().some(u => u.username === DEMO.username)) saveUsers([...loadUsers(), DEMO]);

const setSession = u => sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
const getSession = () => JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
const logout     = () => { sessionStorage.removeItem(SESSION_KEY); showOverlay(); clearAppContent(); };

/* ======== Elementos DOM ======== */
const overlay   = document.getElementById('auth-overlay');
const loginBox  = document.getElementById('login-box');
const regBox    = document.getElementById('register-box');

const welcomeUser = document.getElementById('welcome-user');
const logoutLink  = document.getElementById('logout-link');
const mainContent = document.getElementById('main-content');
const header      = document.querySelector('.header');

/* NAV */
const navHome   = document.getElementById('nav-home');
const navSeries = document.getElementById('nav-series');
const navMovies = document.getElementById('nav-movies');

/* Helpers TMDB */
const fetchApi = async p => {
  const j = p.includes('?') ? '&' : '?';
  const r = await fetch(`${API}${p}${j}api_key=${API_KEY}&language=es-MX`);
  return r.ok ? r.json() : null;
};
const stars = v => '★★★★★☆☆☆☆☆'.slice(5 - Math.round(v)/2, 10 - Math.round(v)/2);

/* Overlay */
function showOverlay(){
  overlay.classList.remove('hidden');
  mainContent.style.filter = header.style.filter = 'blur(5px)';
  welcomeUser.style.display = logoutLink.style.display = 'none';
}
function hideOverlay(){
  overlay.classList.add('hidden');
  mainContent.style.filter = header.style.filter = 'none';
  welcomeUser.style.display = logoutLink.style.display = 'inline';
}
function clearAppContent(){ welcomeUser.textContent=''; }

/* === Toggle login / registro === */
document.getElementById('show-register').onclick = ()=>{loginBox.classList.add('hidden'); regBox.classList.remove('hidden');};
document.getElementById('show-login'   ).onclick = ()=>{regBox.classList.add('hidden');   loginBox.classList.remove('hidden');};

/* --- Login --- */
document.getElementById('login-form').addEventListener('submit',e=>{
  e.preventDefault();
  const u=document.getElementById('login-user').value.trim();
  const p=document.getElementById('login-pass').value.trim();
  const match=loadUsers().find(x=>x.username===u && x.password===p);
  if(!match) return alert('Credenciales incorrectas');
  setSession(match); initApp(match); hideOverlay();
});

/* --- Registro --- */
document.getElementById('register-form').addEventListener('submit',e=>{
  e.preventDefault();
  const u=document.getElementById('reg-user').value.trim();
  const em=document.getElementById('reg-email').value.trim();
  const p=document.getElementById('reg-pass').value.trim();
  if(loadUsers().some(x=>x.username===u)) return alert('Usuario ya existe');
  saveUsers([...loadUsers(),{username:u,email:em,password:p}]);
  alert('Cuenta creada. Inicia sesión.'); regBox.classList.add('hidden'); loginBox.classList.remove('hidden');
});

/* Sesión previa */
const act = getSession();
if(act){ hideOverlay(); initApp(act); } else showOverlay();

/* ======== App principal ======== */
function initApp(user){
  welcomeUser.textContent = `Hola, ${user.username}`;
  logoutLink.onclick = e=>{e.preventDefault(); logout();};

  /* Refs DOM */
  const input=document.getElementById('search-input'),
        sug  =document.getElementById('suggestions');
  const form=document.getElementById('search-form'),
        grid=document.getElementById('search-results-container');
  const heroB=document.getElementById('hero-banner'),
        heroT=document.getElementById('hero-title'),
        heroP=document.getElementById('hero-overview');

  /* Navegación */
  const ENDPOINTS={
    movies:{ hero:'/movie/popular',
             a:'/movie/popular', b:'/movie/top_rated', c:'/movie/upcoming' },
    series:{ hero:'/tv/popular',
             a:'/tv/popular',    b:'/tv/top_rated',    c:'/tv/on_the_air' }
  };
  let current='';      // ← vacío para forzar la 1ª carga

  const setActive=id=>{
    [navHome,navSeries,navMovies].forEach(a=>a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  };

  const render=(arr,id)=>{
    const c=document.getElementById(id); c.innerHTML='';
    arr.forEach(m=>{
      if(!m.poster_path) return;
      c.insertAdjacentHTML('beforeend',`<div class="movie-card" data-id="${m.id}"><img src="${IMG500+m.poster_path}"></div>`);
    });
  };

  async function loadSection(type){
    if(type===current) return;
    current=type;
    setActive(type==='movies'?'nav-movies':'nav-series');

    const {hero,a,b,c}=ENDPOINTS[type];
    const [pop,top,up] = await Promise.all([fetchApi(a), fetchApi(b), fetchApi(c)]);

    render(pop.results,'popular-movies');
    render(top.results,'top-rated-movies');
    render(up.results ,'upcoming-movies');

    const h = await fetchApi(hero);
    if(h?.results?.length){
      const m=h.results[0];
      heroB.style.backgroundImage=`url(${BACK+m.backdrop_path})`;
      heroT.textContent = type==='movies' ? m.title : m.name;
      heroP.textContent = m.overview || '';
    }
  }

  navMovies.addEventListener('click',e=>{e.preventDefault();loadSection('movies');});
  navSeries.addEventListener('click',e=>{e.preventDefault();loadSection('series');});
  navHome  .addEventListener('click',e=>{e.preventDefault();loadSection('movies');});

  /* Búsqueda */
  let timer;
  input.oninput=()=>{
    clearTimeout(timer);
    const q=input.value.trim();
    if(q.length<2){sug.style.display='none';return;}
    timer=setTimeout(async()=>{
      const d=await fetchApi(`/search/movie?query=${encodeURIComponent(q)}`);
      if(!d?.results?.length){sug.style.display='none';return;}
      sug.innerHTML=d.results.slice(0,7)
        .map(m=>`<li data-id="${m.id}"><img src="${m.poster_path?IMG92+m.poster_path:''}">${m.title}</li>`).join('');
      sug.style.display='block';
    },300);
  };
  sug.onclick=e=>{
    const li=e.target.closest('li');
    if(li){sug.style.display='none';openModal(li.dataset.id);}
  };

  form.onsubmit=async e=>{
    e.preventDefault(); sug.style.display='none';
    const q=input.value.trim(); if(!q){grid.style.display='none';return;}
    const d=await fetchApi(`/search/movie?query=${encodeURIComponent(q)}`);
    grid.style.display='grid'; grid.innerHTML='';
    d.results.forEach(m=>{
      if(!m.poster_path) return;
      grid.insertAdjacentHTML('beforeend',`<div class="movie-card" data-id="${m.id}"><img src="${IMG500+m.poster_path}"></div>`);
    });
  };

  /* Modal + reparto + tráiler */
  const modal=document.getElementById('movie-details-modal'), mc=document.getElementById('modal-close'),
        mp=document.getElementById('modal-poster'), mt=document.getElementById('modal-title'),
        mtag=document.getElementById('modal-tagline'), my=document.getElementById('modal-year'),
        mr=document.getElementById('modal-runtime'), ms=document.getElementById('modal-stars'),
        mg=document.getElementById('modal-genres'), mo=document.getElementById('modal-overview'),
        tbtn=document.getElementById('show-trailer-btn'),
        castTitle=document.getElementById('cast-title'),
        castList=document.getElementById('modal-cast'),
        tovr=document.getElementById('trailer-overlay'), tctr=document.getElementById('trailer-container'),
        tcl=document.getElementById('trailer-close');

  async function openModal(id){
    const path=current==='movies'?'movie':'tv';
    const [d,v,c]=await Promise.all([
      fetchApi(`/${path}/${id}`),
      fetchApi(`/${path}/${id}/videos`),
      fetchApi(`/${path}/${id}/credits`)
    ]);
    if(!d) return;

    mp.src=IMG500+d.poster_path;
    mt.textContent=current==='movies'?d.title:d.name;
    mtag.textContent=d.tagline||'';
    my.textContent=(d.release_date||d.first_air_date||'').slice(0,4)||'—';
    mr.textContent=d.runtime?`${d.runtime} min`:(d.episode_run_time?.[0]?`${d.episode_run_time[0]} min`:'—');
    ms.textContent=stars(d.vote_average);
    mg.textContent=(d.genres||[]).map(g=>g.name).join(', ')||'—';
    mo.textContent=d.overview||'Sin descripción';

    const tr=v.results.find(x=>x.site==='YouTube'&&x.type==='Trailer');
    if(tr){tbtn.style.display='inline-block';tbtn.dataset.key=tr.key;}else tbtn.style.display='none';

    castList.innerHTML='';
    if(c?.cast?.length){
      castTitle.style.display='block';
      c.cast.slice(0,10).forEach(a=>{
        const img=a.profile_path?IMG185+a.profile_path:'https://placehold.co/90x135?text=?';
        castList.insertAdjacentHTML('beforeend',`<li><img src="${img}" alt="${a.name}"><span>${a.name.split(' ')[0]}</span></li>`);
      });
    }else castTitle.style.display='none';

    modal.style.display='flex'; document.body.style.overflow='hidden';
  }
  mc.onclick=()=>{modal.style.display='none';document.body.style.overflow='';};
  modal.onclick=e=>{if(e.target===modal){modal.style.display='none';document.body.style.overflow='';}};
  tbtn.onclick=()=>{
    tctr.innerHTML=`<iframe src="https://www.youtube.com/embed/${tbtn.dataset.key}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    tovr.style.display='flex';
  };
  const closeTrailer=()=>{tovr.style.display='none';tctr.innerHTML='';};
  tcl.onclick=closeTrailer; tovr.onclick=e=>{if(e.target===tovr) closeTrailer();};

  document.querySelectorAll('.carousel-btn').forEach(btn=>{
    btn.onclick=()=>{const tr=document.getElementById(btn.dataset.carousel);
      tr.scrollBy({left:tr.clientWidth*.8*(btn.classList.contains('next')?1:-1),behavior:'smooth'});};
  });
  document.body.addEventListener('click',e=>{
    const card=e.target.closest('.movie-card'); if(card) openModal(card.dataset.id);
  });

  /* ---------- carga inicial ---------- */
  loadSection('movies');   // ← ahora se ejecuta siempre al iniciar
}
