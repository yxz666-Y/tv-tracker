/* ================================================================
   影视追踪 — TV + Movie Tracker
   剧集: TVMaze API (免费无注册)
   电影: 手动录入
   存储: localStorage
   ================================================================ */

var API = 'https://api.tvmaze.com';

// ==================== 中英文对照 ====================
var CN = {
  '绝命毒师':'Breaking Bad','风骚律师':'Better Call Saul','绝命律师':'Better Call Saul',
  '怪奇物语':'Stranger Things','权力的游戏':'Game of Thrones','权游':'Game of Thrones',
  '行尸走肉':'The Walking Dead','行尸':'The Walking Dead','越狱':'Prison Break',
  '老友记':'Friends','生活大爆炸':'The Big Bang Theory','破产姐妹':'2 Broke Girls',
  '纸牌屋':'House of Cards','黑镜':'Black Mirror','西部世界':'Westworld',
  '切尔诺贝利':'Chernobyl','后翼弃兵':"The Queen's Gambit",'女王的棋局':"The Queen's Gambit",
  '曼达洛人':'The Mandalorian','曼达洛':'The Mandalorian',
  '最后生还者':'The Last of Us','龙之家族':'House of the Dragon',
  '继承之战':'Succession','白莲花度假村':'The White Lotus',
  '熊家餐馆':'The Bear','熊':'The Bear','人生切割术':'Severance','离职':'Severance',
  '猎魔人':'The Witcher','巫师':'The Witcher','基地':'Foundation','羊毛战记':'Silo',
  '神盾局特工':'Agents of S.H.I.E.L.D.','绿箭侠':'Arrow','闪电侠':'The Flash',
  '哥谭':'Gotham','美国恐怖故事':'American Horror Story','真探':'True Detective',
  '毒枭':'Narcos','王冠':'The Crown','浴血黑帮':'Peaky Blinders',
  '杀死伊芙':'Killing Eve','使女的故事':"The Handmaid's Tale",
  '大小谎言':'Big Little Lies','摩登家庭':'Modern Family','无耻之徒':'Shameless',
  '我们这一天':'This Is Us','万物生灵':'All Creatures Great and Small',
  '唐顿庄园':'Downton Abbey','神探夏洛克':'Sherlock','黑道家族':'The Sopranos',
  '火线':'The Wire','广告狂人':'Mad Men','爱死机':'Love Death Robots',
  '爱死亡和机器人':'Love Death Robots','黑袍纠察队':'The Boys',
  '无敌少侠':'Invincible','瑞克和莫蒂':'Rick and Morty','马男波杰克':'BoJack Horseman',
  '英雄':'Heroes','迷失':'Lost','24小时':'24','斯巴达克斯':'Spartacus','罗马':'Rome',
  '兄弟连':'Band of Brothers','太平洋战争':'The Pacific',
  '新闻编辑室':'The Newsroom','硅谷':'Silicon Valley',
  '办公室':'The Office','废柴联盟':'Community','发展受阻':'Arrested Development',
  '老爸老妈的浪漫史':'How I Met Your Mother','好汉两个半':'Two and a Half Men',
  '犯罪心理':'Criminal Minds','识骨寻踪':'Bones','灵书妙探':'Castle',
  '基本演绎法':'Elementary','疑犯追踪':'Person of Interest','冰血暴':'Fargo',
  '汉尼拔':'Hannibal','双峰':'Twin Peaks','超感猎杀':'Sense8',
  '黑钱胜地':'Ozark','心灵猎人':'Mindhunter','暗黑':'Dark',
  '纸钞屋':'Money Heist','鱿鱼游戏':'Squid Game',
  '弥留之国的爱丽丝':'Alice in Borderland','甜蜜家园':'Sweet Home',
  '进击的巨人':'Attack on Titan','咒术回战':'Jujutsu Kaisen',
  '鬼灭之刃':'Demon Slayer','海贼王':'One Piece','火影忍者':'Naruto',
  '死亡笔记':'Death Note','钢之炼金术师':'Fullmetal Alchemist',
  '一拳超人':'One Punch Man','东京食尸鬼':'Tokyo Ghoul',
  '寄生兽':'Parasyte','命运石之门':'Steins;Gate',
  '名侦探柯南':'Case Closed','排球少年':'Haikyuu','黑子的篮球':'Kuroko Basketball',
  '蓝色监狱':'Blue Lock','间谍过家家':'Spy x Family',
  '国王排名':'Ranking of Kings','葬送的芙莉莲':'Frieren',
  '迷宫饭':'Delicious in Dungeon','药屋少女':'The Apothecary Diaries',
  '无职转生':'Mushoku Tensei','回复术士':'Redo of Healer',
  '关于我转生变成史莱姆这档事':'That Time I Got Reincarnated as a Slime',
  '转生史莱姆':'That Time I Got Reincarnated as a Slime',
  '盾之勇者成名录':'The Rising of the Shield Hero',
  '从零开始的异世界生活':'Re:Zero','Re零':'Re:Zero',
  '为美好的世界献上祝福':'KonoSuba','素晴':'KonoSuba',
  '埃斯加':'Aesga',
};

function translateQuery(q) {
  var t = q.trim();
  if (CN[t]) return CN[t];
  var keys = Object.keys(CN).sort(function(a,b){ return b.length - a.length; });
  for (var i = 0; i < keys.length; i++) {
    if (t.indexOf(keys[i]) >= 0) return CN[keys[i]];
  }
  return t;
}

// ==================== State ====================
var State = {
  currentShow: null,
  currentType: null,
  currentSeason: 1,
  allEpisodes: [],
  watchedData: loadWatched(),
  watchlist: loadWatchlist(),
};
var nextMovieId = parseInt(localStorage.getItem('tv_next_movie_id') || '1');

// ==================== localStorage ====================
function loadWatched() {
  try { return JSON.parse(localStorage.getItem('tv_watched')) || {}; }
  catch(e) { return {}; }
}
function saveWatched() { localStorage.setItem('tv_watched', JSON.stringify(State.watchedData)); }

function loadWatchlist() {
  try { return JSON.parse(localStorage.getItem('tv_watchlist')) || {}; }
  catch(e) { return {}; }
}
function saveWatchlist() { localStorage.setItem('tv_watchlist', JSON.stringify(State.watchlist)); }

function getEpWatched(id, sn, en) {
  var s = State.watchedData[id];
  if (!s || !s.seasons || !s.seasons[sn]) return false;
  return s.seasons[sn].indexOf(en) >= 0;
}
function toggleEp(id, name, sn, en) {
  if (!State.watchedData[id]) State.watchedData[id] = { name: name, type: 'tv', seasons: {} };
  State.watchedData[id].name = name;
  if (!State.watchedData[id].seasons[sn]) State.watchedData[id].seasons[sn] = [];
  var eps = State.watchedData[id].seasons[sn];
  var idx = eps.indexOf(en);
  if (idx >= 0) eps.splice(idx, 1); else eps.push(en);
  if (!eps.length) delete State.watchedData[id].seasons[sn];
  if (!Object.keys(State.watchedData[id].seasons).length) delete State.watchedData[id];
  saveWatched();
}
function getTVProgress(id) {
  var s = State.watchedData[id]; if (!s) return { w: 0, t: 0 };
  var w = 0; for (var sn in s.seasons) w += s.seasons[sn].length;
  return { w: w, t: s._totalEps || w };
}

function isInWL(id) { return !!State.watchlist[id]; }
function toggleWL(id, name, type) {
  if (State.watchlist[id]) delete State.watchlist[id];
  else State.watchlist[id] = { name: name, type: type, addedAt: new Date().toISOString().slice(0,10) };
  saveWatchlist(); renderSidebar();
  if (State.currentShow && String(State.currentShow.id) === String(id)) updateWLBtn(id);
}
function updateWLBtn(id) {
  var btn = el('watchlistBtn'); if (!btn) return;
  var inL = isInWL(id);
  btn.textContent = inL ? '📌 移出想看' : '🎬 加入想看';
  btn.className = 'btn-watchlist' + (inL ? ' in-list' : '');
}
function removeShow(id) { delete State.watchedData[id]; saveWatched(); if (State.currentShow && String(State.currentShow.id) === String(id)) goBack(); renderSidebar(); }

// ==================== API ====================
function apiFetch(path) {
  return fetch(API + path).then(function(r) { if (!r.ok) throw new Error('Error '+r.status); return r.json(); });
}

// ==================== DOM ====================
function el(id) { return document.getElementById(id); }
function esc(s) { if (!s) return ''; var d = document.createElement('div'); d.appendChild(document.createTextNode(s)); return d.innerHTML; }

// ==================== Search ====================
var searchTimer;
function setupSearch() {
  var input = el('searchInput'), dd = el('searchDropdown');
  input.addEventListener('input', function() {
    clearTimeout(searchTimer);
    var q = input.value.trim();
    if (q.length < 2) { dd.classList.remove('show'); return; }
    searchTimer = setTimeout(function() {
      var tq = translateQuery(q);
      var hint = tq !== q ? ' ("' + esc(q) + '" → "' + esc(tq) + '")' : '';
      dd.innerHTML = '<div style="padding:14px;color:var(--text-dim);text-align:center;">🔍 搜索剧集...' + hint + '</div>' +
        '<div style="padding:8px 14px;border-top:1px solid var(--border);cursor:pointer;color:var(--accent);text-align:center;" id="addMovieBtn">🎬 手动添加电影 "' + esc(q) + '"</div>';
      dd.classList.add('show');

      apiFetch('/search/shows?q=' + encodeURIComponent(tq)).then(function(results) {
        results = (results || []).slice(0, 8);
        var html = '';
        if (results.length) {
          html += results.map(function(r) {
            var s = r.show, img = s.image ? s.image.medium : '';
            var poster = img ? '<img src="' + img + '" alt="">' : '<div class="sd-placeholder">📺</div>';
            var year = s.premiered ? s.premiered.slice(0,4) : '';
            var rating = s.rating && s.rating.average ? '⭐' + s.rating.average : '';
            var inWL = isInWL(String(s.id));
            return '<div class="sd-item" data-id="' + s.id + '" data-type="tv" style="position:relative">' +
              poster +
              '<div style="flex:1"><div class="sd-name">' + esc(s.name) + ' <span class="type-badge type-tv">剧集</span></div>' +
              '<div class="sd-meta">' + year + ' ' + rating + ' · ' + (s.status||'') + '</div></div>' +
              '<button class="sd-watchlist' + (inWL?' in-list':'') + '" data-wl="' + s.id + '" data-wl-name="' + esc(s.name) + '" data-wl-type="tv">' + (inWL?'📌':'➕') + '</button>' +
            '</div>';
          }).join('');
        } else {
          html += '<div style="padding:14px;color:var(--text-dim);text-align:center;">未找到剧集</div>';
        }
        html += '<div style="padding:10px 14px;border-top:1px solid var(--border);cursor:pointer;color:var(--accent);text-align:center;font-weight:600;" id="addMovieBtn2">🎬 手动添加电影 "' + esc(q) + '"</div>';
        dd.innerHTML = html;

        dd.querySelectorAll('.sd-item').forEach(function(item) {
          item.addEventListener('click', function(e) { if (e.target.closest('.sd-watchlist')) return; loadDetail(parseInt(item.dataset.id), 'tv'); dd.classList.remove('show'); input.value = ''; });
        });
        dd.querySelectorAll('.sd-watchlist').forEach(function(btn) {
          btn.addEventListener('click', function(e) { e.stopPropagation(); toggleWL(btn.dataset.wl, btn.dataset.wlName, btn.dataset.wlType);
            var inWL = isInWL(btn.dataset.wl); btn.className = 'sd-watchlist'+(inWL?' in-list':''); btn.textContent = inWL?'📌':'➕'; });
        });
        var addBtns = [el('addMovieBtn'), el('addMovieBtn2')];
        addBtns.forEach(function(b) { if (b) b.addEventListener('click', function() { addMovie(q); dd.classList.remove('show'); input.value = ''; }); });
      }).catch(function(err) {
        dd.innerHTML = '<div style="padding:14px;color:red;text-align:center;">搜索失败: ' + err.message + '</div>' +
          '<div style="padding:10px 14px;border-top:1px solid var(--border);cursor:pointer;color:var(--accent);text-align:center;" id="addMovieBtn3">🎬 手动添加电影 "' + esc(q) + '"</div>';
        var b = el('addMovieBtn3'); if (b) b.addEventListener('click', function() { addMovie(q); dd.classList.remove('show'); input.value = ''; });
      });
    }, 350);
  });
  document.addEventListener('click', function(e) { if (!e.target.closest('.search-wrapper')) dd.classList.remove('show'); });
}

// ==================== Add Movie ====================
function addMovie(name) {
  var id = 'movie_' + (nextMovieId++);
  localStorage.setItem('tv_next_movie_id', nextMovieId);
  State.currentShow = { id: id, name: name, title: name };
  State.currentType = 'movie';
  renderMovieDetail(name, id);
  renderSidebar();
}

// ==================== Detail ====================
function loadDetail(id, type) {
  State.currentSeason = 1; State.allEpisodes = [];
  if (type === 'movie') {
    State.currentShow = { id: 'movie_'+id, name: id, title: id };
    State.currentType = 'movie';
    renderMovieDetail(id, 'movie_'+id);
    renderSidebar();
  } else {
    apiFetch('/shows/' + id).then(function(show) {
      return apiFetch('/shows/' + id + '/episodes').then(function(eps) {
        State.currentShow = show; State.currentType = 'tv'; State.allEpisodes = eps || [];
        var sid = String(id);
        if (!State.watchedData[sid]) State.watchedData[sid] = { name: show.name, type: 'tv', seasons: {}, _totalEps: State.allEpisodes.length };
        else { State.watchedData[sid].name = show.name; State.watchedData[sid]._totalEps = State.allEpisodes.length; }
        saveWatched();
        var seasons = {};
        State.allEpisodes.forEach(function(e) { if (!seasons[e.season]) seasons[e.season] = []; seasons[e.season].push(e); });
        renderTVDetail(show, seasons);
        renderSidebar();
      });
    }).catch(function(err) { alert('加载失败: ' + err.message); });
  }
}

function renderMovieDetail(name, id) {
  el('welcome').style.display = 'none'; el('showDetail').style.display = 'block';
  var sid = String(id), watched = !!(State.watchedData[sid] && State.watchedData[sid].watched);
  el('detailContent').innerHTML =
    '<div class="detail-header">' +
      '<div class="dh-placeholder">🎬</div>' +
      '<div class="dh-info">' +
        '<h1>' + esc(name) + ' <span class="type-badge type-movie">电影</span></h1>' +
        '<button class="btn-watchlist' + (isInWL(sid)?' in-list':'') + '" id="watchlistBtn">' + (isInWL(sid)?'📌 移出想看':'🎬 加入想看') + '</button>' +
        '<div class="movie-toggle' + (watched?' watched':'') + '" id="movieToggle">' + (watched?'✅ 已看':'👁️ 标记已看') + '</div>' +
        (State.watchedData[sid] ? '<button class="btn-sm" id="removeBtn" style="margin-top:6px;color:#f85149;border-color:#f85149;">🗑️ 删除记录</button>' : '') +
      '</div>' +
    '</div>';
  el('movieToggle').addEventListener('click', function() {
    if (State.watchedData[sid] && State.watchedData[sid].watched) delete State.watchedData[sid];
    else State.watchedData[sid] = { name: name, type: 'movie', watched: true };
    saveWatched(); renderMovieDetail(name, id); renderSidebar();
  });
  el('watchlistBtn').addEventListener('click', function() { toggleWL(sid, name, 'movie'); });
  var rb = el('removeBtn'); if (rb) rb.addEventListener('click', function() { if (confirm('删除？')) removeShow(sid); });
  el('backBtn').onclick = goBack;
}

function renderTVDetail(show, seasons) {
  el('welcome').style.display = 'none'; el('showDetail').style.display = 'block';
  var id = String(show.id), img = show.image ? (show.image.original || show.image.medium) : '';
  var poster = img ? '<img src="' + img + '" alt="">' : '<div class="dh-placeholder">📺</div>';
  var year = show.premiered ? show.premiered.slice(0,4) : '';
  var rating = show.rating && show.rating.average ? '⭐' + show.rating.average.toFixed(1) : '';
  var genres = (show.genres||[]).map(function(g) { return '<span class="dh-genre">'+g+'</span>'; }).join('');
  var sKeys = Object.keys(seasons).sort(function(a,b){return a-b;});
  var totalEps = State.allEpisodes.length;
  var prog = getTVProgress(id), pct = prog.t > 0 ? Math.round(prog.w/prog.t*100) : 0;
  var pClass = pct===0 ? '' : (pct<50?'dh-progress-low':(pct<100?'dh-progress-mid':'dh-progress-high'));
  var summary = show.summary ? show.summary.replace(/<[^>]+>/g,'') : '';
  var statusTxt = show.status==='Ended'?'✅ 已完结':(show.status==='Running'?'🔄 连载中':show.status||'');

  el('detailContent').innerHTML =
    '<div class="detail-header">'+poster+
      '<div class="dh-info">'+
        '<h1>'+esc(show.name)+' <span class="type-badge type-tv">剧集</span></h1>'+
        '<div class="dh-meta">'+
          (year?'<span>📅 '+year+'</span>':'')+
          (rating?'<span class="dh-rating">'+rating+'</span>':'')+
          '<span>📺 '+sKeys.length+' 季</span><span>🎬 '+totalEps+' 集</span>'+
          (statusTxt?'<span>'+statusTxt+'</span>':'')+
          (show.network?'<span>📡 '+show.network.name+'</span>':'')+
        '</div>'+
        (genres?'<div class="dh-genres">'+genres+'</div>':'')+
        (summary?'<div class="dh-overview">'+esc(summary).slice(0,300)+'</div>':'')+
        '<button class="btn-watchlist'+(isInWL(id)?' in-list':'')+'" id="watchlistBtn">'+(isInWL(id)?'📌 移出想看':'🎬 加入想看')+'</button>'+
        '<div class="dh-progress '+pClass+'">'+
          '<div class="dh-progress-bar"><div class="dh-progress-fill" style="width:'+pct+'%"></div></div>'+
          '<div class="dh-progress-text">追剧进度: '+prog.w+'/'+prog.t+' 集 ('+pct+'%)</div>'+
        '</div>'+
        (State.watchedData[id]?'<button class="btn-sm" id="removeBtn" style="margin-top:6px;color:#f85149;border-color:#f85149;">🗑️ 删除记录</button>':'')+
      '</div>'+
    '</div>'+
    '<div class="season-tabs" id="seasonTabs">'+sKeys.map(function(sn){return '<button class="season-tab'+(parseInt(sn)===State.currentSeason?' active':'')+'" data-s="'+sn+'">S'+sn+'</button>';}).join('')+'</div>'+
    '<div class="episode-header"><span style="font-weight:600">分集列表 ('+(seasons[State.currentSeason]||[]).length+' 集)</span><span class="select-all" id="selectAllToggle">全选/取消</span></div>'+
    '<div class="episode-list" id="episodeList"></div>';

  renderEpisodes(show.id, show.name, seasons[State.currentSeason]||[]);
  el('seasonTabs').addEventListener('click', function(e) { var t=e.target.closest('.season-tab'); if(!t)return; State.currentSeason=parseInt(t.dataset.s); renderTVDetail(show,seasons); });
  el('selectAllToggle').addEventListener('click', function() { toggleAll(show.id,show.name,State.currentSeason,seasons[State.currentSeason]||[]); });
  el('watchlistBtn').addEventListener('click', function() { toggleWL(id,show.name,'tv'); });
  var rb=el('removeBtn'); if(rb) rb.addEventListener('click', function() { if(confirm('删除？')) removeShow(id); });
  el('backBtn').onclick = goBack;
}

function renderEpisodes(sid, sname, eps) {
  var list = el('episodeList'); if (!list) return;
  list.innerHTML = eps.map(function(e) {
    var w = getEpWatched(String(sid), e.season, e.number);
    return '<div class="episode-item'+(w?' watched':'')+'" data-ep="'+e.number+'">'+
      '<div class="ep-checkbox">✓</div>'+
      '<span class="ep-num">E'+String(e.number).padStart(2,'0')+'</span>'+
      '<span class="ep-title">'+esc(e.name||'Episode '+e.number)+'</span>'+
      (e.airdate?'<span class="ep-date">'+e.airdate+'</span>':'')+
    '</div>';
  }).join('');
  list.querySelectorAll('.episode-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var en = parseInt(item.dataset.ep);
      toggleEp(String(sid), sname, State.currentSeason, en);
      item.classList.toggle('watched');
      var seasons = {};
      State.allEpisodes.forEach(function(e) { if(!seasons[e.season]) seasons[e.season]=[]; seasons[e.season].push(e); });
      renderTVDetail(State.currentShow, seasons);
      renderSidebar();
    });
  });
}

function toggleAll(sid, sname, sn, eps) {
  var items = el('episodeList').querySelectorAll('.episode-item');
  var allW = true;
  items.forEach(function(i) { if(!i.classList.contains('watched')) allW=false; });
  eps.forEach(function(e) {
    var cw = getEpWatched(String(sid), sn, e.number);
    if (allW) { if(cw) toggleEp(String(sid),sname,sn,e.number); }
    else { if(!cw) toggleEp(String(sid),sname,sn,e.number); }
  });
  var seasons = {};
  State.allEpisodes.forEach(function(e) { if(!seasons[e.season]) seasons[e.season]=[]; seasons[e.season].push(e); });
  renderTVDetail(State.currentShow, seasons);
  renderSidebar();
}

// ==================== Sidebar ====================
function renderSidebar() {
  // 已追
  var w = el('myShowsList'), wIds = Object.keys(State.watchedData);
  if (!wIds.length) { w.innerHTML = '<p class="empty-hint">标记已看后<br>自动出现在这里</p>'; }
  else {
    w.innerHTML = wIds.map(function(id) {
      var s = State.watchedData[id], isMovie = s.type === 'movie';
      var isActive = State.currentShow && String(State.currentShow.id) === String(id);
      var line2 = '';
      if (isMovie) line2 = s.watched ? '✅ 已看' : '';
      else { var p = getTVProgress(id); var pct = p.t>0?Math.round(p.w/p.t*100):0;
        line2 = '<div class="ms-progress"><div class="ms-progress-fill" style="width:'+pct+'%"></div></div><div class="ms-info">'+p.w+'/'+p.t+' 集 ('+pct+'%)</div>'; }
      return '<div class="my-show-item'+(isActive?' active':'')+'" data-id="'+id+'">'+
        '<button class="ms-delete" data-del="'+id+'" title="删除">×</button>'+
        '<div class="ms-name">'+(isMovie?'🎬 ':'📺 ')+esc(s.name||'')+'</div>'+line2+
      '</div>';
    }).join('');
    w.querySelectorAll('.my-show-item').forEach(function(item) {
      item.addEventListener('click', function(e) { if(e.target.closest('.ms-delete'))return; loadDetail(parseInt(item.dataset.id), State.watchedData[item.dataset.id].type); });
    });
    w.querySelectorAll('.ms-delete').forEach(function(btn) {
      btn.addEventListener('click', function(e) { e.stopPropagation(); if(confirm('删除？')) removeShow(btn.dataset.del); });
    });
  }
  // 想看
  var wl = el('watchlistList'), wlIds = Object.keys(State.watchlist);
  if (!wlIds.length) { wl.innerHTML = '<p class="empty-hint">搜索→加入想看<br>随时翻出来</p>'; }
  else {
    wl.innerHTML = wlIds.map(function(id) {
      var s = State.watchlist[id], isActive = State.currentShow && String(State.currentShow.id) === String(id);
      return '<div class="my-show-item'+(isActive?' active':'')+'" data-id="'+id+'">'+
        '<button class="ms-delete" data-del-wl="'+id+'" title="移出">×</button>'+
        '<div class="ms-name">'+(s.type==='movie'?'🎬 ':'📺 ')+esc(s.name||'')+'</div>'+
        '<div class="ms-info">📅 '+(s.addedAt||'')+'</div>'+
      '</div>';
    }).join('');
    wl.querySelectorAll('.my-show-item').forEach(function(item) {
      item.addEventListener('click', function(e) { if(e.target.closest('.ms-delete'))return; loadDetail(parseInt(item.dataset.id), State.watchlist[item.dataset.id].type); });
    });
    wl.querySelectorAll('.ms-delete').forEach(function(btn) {
      btn.addEventListener('click', function(e) { e.stopPropagation(); toggleWL(btn.dataset.delWl,'',''); });
    });
  }
}

function goBack() { el('showDetail').style.display='none'; el('welcome').style.display='block'; State.currentShow=null; renderSidebar(); }

// ==================== IO ====================
function setupIO() {
  el('exportBtn').addEventListener('click', function() {
    var blob = new Blob([JSON.stringify({ watched: State.watchedData, watchlist: State.watchlist })], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'movies-tv-'+new Date().toISOString().slice(0,10)+'.json'; a.click();
  });
  el('importBtn').addEventListener('click', function() { el('importFile').click(); });
  el('importFile').addEventListener('change', function(e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function(ev) {
      try {
        var data = JSON.parse(ev.target.result);
        if (data.watched) { State.watchedData = data.watched; saveWatched(); }
        if (data.watchlist) { State.watchlist = data.watchlist; saveWatchlist(); }
        renderSidebar(); alert('导入成功！');
      } catch(err) { alert('格式错误'); }
    }; r.readAsText(f);
  });
}

// ==================== Quick Buttons ====================
function setupQuickButtons() {
  document.querySelectorAll('.quick-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var q = btn.dataset.query, tq = translateQuery(q);
      apiFetch('/search/shows?q=' + encodeURIComponent(tq)).then(function(results) {
        if (results && results.length > 0) loadDetail(results[0].show.id, 'tv');
        else addMovie(q);
      }).catch(function() { addMovie(q); });
    });
  });
}

// ==================== Init ====================
function init() {
  setupSearch(); setupQuickButtons(); setupIO(); renderSidebar();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
