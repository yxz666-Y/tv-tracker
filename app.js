/* ================================================================
   追剧追踪器 - TV Show Tracker
   数据来源: TVMaze API (免费，无需注册，无需 API Key)
   存储: localStorage
   ================================================================ */

// ==================== CONFIG ====================
var API_BASE = 'https://api.tvmaze.com';

// ==================== 中英文剧名对照表 ====================
var CN_MAP = {
  '绝命毒师': 'Breaking Bad',
  '风骚律师': 'Better Call Saul',
  '怪奇物语': 'Stranger Things',
  '权力的游戏': 'Game of Thrones',
  '行尸走肉': 'The Walking Dead',
  '越狱': 'Prison Break',
  '老友记': 'Friends',
  '生活大爆炸': 'The Big Bang Theory',
  '破产姐妹': '2 Broke Girls',
  '纸牌屋': 'House of Cards',
  '黑镜': 'Black Mirror',
  '西部世界': 'Westworld',
  '切尔诺贝利': 'Chernobyl',
  '后翼弃兵': "The Queen's Gambit",
  '女王的棋局': "The Queen's Gambit",
  '曼达洛人': 'The Mandalorian',
  '最后生还者': 'The Last of Us',
  '龙之家族': 'House of the Dragon',
  '继承之战': 'Succession',
  '白莲花度假村': 'The White Lotus',
  '熊家餐馆': 'The Bear',
  '熊': 'The Bear',
  '人生切割术': 'Severance',
  '离职': 'Severance',
  '黑暗物质': 'His Dark Materials',
  '猎魔人': 'The Witcher',
  '巫师': 'The Witcher',
  '看见': 'See',
  '基地': 'Foundation',
  '羊毛战记': 'Silo',
  '末日孤舰': 'The Last Ship',
  '神盾局特工': 'Agents of S.H.I.E.L.D.',
  '绿箭侠': 'Arrow',
  '闪电侠': 'The Flash',
  '哥谭': 'Gotham',
  '传教士': 'Preacher',
  '美国恐怖故事': 'American Horror Story',
  '真探': 'True Detective',
  '毒枭': 'Narcos',
  '王冠': 'The Crown',
  '浴血黑帮': 'Peaky Blinders',
  '杀死伊芙': 'Killing Eve',
  '使女的故事': "The Handmaid's Tale",
  '大小谎言': 'Big Little Lies',
  '摩登家庭': 'Modern Family',
  '无耻之徒': 'Shameless',
  '我们这一天': 'This Is Us',
  '万物生灵': 'All Creatures Great and Small',
  '唐顿庄园': 'Downton Abbey',
  '神探夏洛克': 'Sherlock',
  '黑道家族': 'The Sopranos',
  '火线': 'The Wire',
  '广告狂人': 'Mad Men',
  '绝命律师': 'Better Call Saul',
  '爱死机': 'Love Death Robots',
  '爱死亡和机器人': 'Love Death Robots',
  '黑袍纠察队': 'The Boys',
  '无敌少侠': 'Invincible',
  '瑞克和莫蒂': 'Rick and Morty',
  '马男波杰克': 'BoJack Horseman',
  '英雄': 'Heroes',
  '迷失': 'Lost',
  '24小时': '24',
  '斯巴达克斯': 'Spartacus',
  '罗马': 'Rome',
  '兄弟连': 'Band of Brothers',
  '太平洋战争': 'The Pacific',
  '新闻编辑室': 'The Newsroom',
  '硅谷': 'Silicon Valley',
  '副总统': 'Veep',
  '公园与游憩': 'Parks and Recreation',
  '办公室': 'The Office',
  '废柴联盟': 'Community',
  '发展受阻': 'Arrested Development',
  '我为喜剧狂': '30 Rock',
  '老爸老妈的浪漫史': 'How I Met Your Mother',
  '好汉两个半': 'Two and a Half Men',
  '犯罪心理': 'Criminal Minds',
  '识骨寻踪': 'Bones',
  '灵书妙探': 'Castle',
  '基本演绎法': 'Elementary',
  '疑犯追踪': 'Person of Interest',
  '冰血暴': 'Fargo',
  '汉尼拔': 'Hannibal',
  '双峰': 'Twin Peaks',
  '超感猎杀': 'Sense8',
  '黑钱胜地': 'Ozark',
  '心灵猎人': 'Mindhunter',
  '暗黑': 'Dark',
  '纸钞屋': 'Money Heist',
  '鱿鱼游戏': 'Squid Game',
  '甜蜜家园': 'Sweet Home',
  '弥留之国的爱丽丝': 'Alice in Borderland',
  '和平使者': 'Peacemaker',
  '月光骑士': 'Moon Knight',
  '旺达幻视': 'WandaVision',
  '洛基': 'Loki',
  '鹰眼': 'Hawkeye',
  '猎鹰与冬兵': 'The Falcon and the Winter Soldier',
  '假如': 'What If',
  '安多': 'Andor',
  '欧比旺': 'Obi-Wan Kenobi',
  '波巴费特之书': 'The Book of Boba Fett',
  '伞学院': 'The Umbrella Academy',
  '你': 'You',
  '安眠书店': 'You',
  '怪盗': 'Lupin',
  '亚森罗宾': 'Lupin',
  '睡魔': 'The Sandman',
  '星期三': 'Wednesday',
  '怒呛人生': 'Beef',
  '夜访吸血鬼': 'Interview with the Vampire',
  '流人': 'Slow Horses',
  '足球教练': 'Ted Lasso',
  '早间新闻': 'The Morning Show',
  '为全人类': 'For All Mankind',
  '弹珠游戏': 'Pachinko',
  '边缘世界': 'The Peripheral',
  '辐射': 'Fallout',
  '三个机器人': 'Three Robots',
  '副本': 'Altered Carbon',
  '星际迷航发现号': 'Star Trek Discovery',
  '星际迷航皮卡德': 'Star Trek Picard',
  '曼达洛': 'The Mandalorian',
  '行尸之惧': 'Fear the Walking Dead',
  '血族': 'The Strain',
  '美国众神': 'American Gods',
  '好兆头': 'Good Omens',
  '路西法': 'Lucifer',
  '邪恶力量': 'Supernatural',
  '吸血鬼日记': 'The Vampire Diaries',
  '初代吸血鬼': 'The Originals',
  '真爱如血': 'True Blood',
  '都铎王朝': 'The Tudors',
  '波吉亚家族': 'The Borgias',
  '维京传奇': 'Vikings',
  '孤国春秋': 'The Last Kingdom',
  '权游': 'Game of Thrones',
  '毒师': 'Breaking Bad',
  '律师': 'Better Call Saul',
  '行尸': 'The Walking Dead',
  '黑镜网': 'Black Mirror',
  '西部': 'Westworld',
};

function translateQuery(q) {
  var trimmed = q.trim();
  // Exact match in CN_MAP
  if (CN_MAP[trimmed]) return CN_MAP[trimmed];
  // Fuzzy match: check if input contains any key
  var keys = Object.keys(CN_MAP).sort(function(a,b) { return b.length - a.length; });
  for (var i = 0; i < keys.length; i++) {
    if (trimmed.indexOf(keys[i]) >= 0) {
      // Replace only the Chinese part
      return CN_MAP[keys[i]];
    }
  }
  // Also try: if it's purely Chinese characters, maybe search anyway
  return trimmed;
}

// ==================== State ====================
var State = {
  currentShow: null,
  currentSeason: 1,
  allEpisodes: [],      // cache all episodes for current show
  watchedData: loadWatched(),
};

// ==================== localStorage ====================
function loadWatched() {
  try {
    return JSON.parse(localStorage.getItem('tv_watched')) || {};
  } catch(e) { return {}; }
}

function saveWatched() {
  localStorage.setItem('tv_watched', JSON.stringify(State.watchedData));
}

function getWatchedEpisodes(showId, seasonNum) {
  var show = State.watchedData[showId];
  if (!show || !show.seasons || !show.seasons[seasonNum]) return [];
  return show.seasons[seasonNum];
}

function isEpisodeWatched(showId, seasonNum, epNum) {
  return getWatchedEpisodes(showId, seasonNum).indexOf(epNum) >= 0;
}

function toggleEpisode(showId, showName, seasonNum, epNum) {
  if (!State.watchedData[showId]) {
    State.watchedData[showId] = { name: showName, seasons: {} };
  }
  if (!State.watchedData[showId].seasons[seasonNum]) {
    State.watchedData[showId].seasons[seasonNum] = [];
  }
  State.watchedData[showId].name = showName;
  var eps = State.watchedData[showId].seasons[seasonNum];
  var idx = eps.indexOf(epNum);
  if (idx >= 0) eps.splice(idx, 1); else eps.push(epNum);

  if (eps.length === 0) delete State.watchedData[showId].seasons[seasonNum];
  if (Object.keys(State.watchedData[showId].seasons).length === 0) delete State.watchedData[showId];
  saveWatched();
}

function getShowProgress(showId) {
  var show = State.watchedData[showId];
  if (!show) return { watched: 0, total: 0 };
  var watched = 0;
  for (var s in show.seasons) { watched += show.seasons[s].length; }
  var total = show._totalEps || 0;
  return { watched: watched, total: total > 0 ? total : watched };
}

// ==================== API ====================
function apiFetch(path) {
  return fetch(API_BASE + path)
    .then(function(res) {
      if (!res.ok) throw new Error('Error ' + res.status);
      return res.json();
    });
}

// ==================== DOM ====================
function el(id) { return document.getElementById(id); }

// ==================== Search ====================
var searchTimer = null;

function setupSearch() {
  var input = el('searchInput');
  var dropdown = el('searchDropdown');

  input.addEventListener('input', function() {
    clearTimeout(searchTimer);
    var q = input.value.trim();
    if (q.length < 2) { dropdown.classList.remove('show'); return; }

    searchTimer = setTimeout(function() {
      var query = translateQuery(q);
      var hint = query !== q ? ' ("' + escapeHtml(q) + '" → "' + escapeHtml(query) + '")' : '';
      dropdown.innerHTML = '<div style="padding:14px;color:var(--text-dim);text-align:center;">🔍 搜索中...' + hint + '</div>';
      dropdown.classList.add('show');

      apiFetch('/search/shows?q=' + encodeURIComponent(query))
        .then(function(results) {
          results = (results || []).slice(0, 8);
          if (results.length === 0) {
            dropdown.innerHTML = '<div style="padding:14px;color:var(--text-dim);text-align:center;">无结果</div>';
            return;
          }
          dropdown.innerHTML = results.map(function(r) {
            var s = r.show;
            var img = s.image ? s.image.medium : '';
            var poster = img
              ? '<img src="' + img + '" alt="">'
              : '<div class="sd-placeholder">📺</div>';
            var year = s.premiered ? s.premiered.slice(0,4) : '';
            var rating = s.rating && s.rating.average ? '⭐' + s.rating.average : '';
            return '<div class="sd-item" data-id="' + s.id + '">' +
              poster +
              '<div><div class="sd-name">' + escapeHtml(s.name) + '</div>' +
              '<div class="sd-meta">' + year + ' ' + rating + ' · ' + (s.status || '') + '</div>' +
              '</div></div>';
          }).join('');

          dropdown.querySelectorAll('.sd-item').forEach(function(item) {
            item.addEventListener('click', function() {
              loadShowDetail(parseInt(item.dataset.id));
              dropdown.classList.remove('show');
              input.value = '';
            });
          });
        }).catch(function(err) {
          dropdown.innerHTML = '<div style="padding:14px;color:red;text-align:center;">搜索失败: ' + err.message + '</div>';
        });
    }, 350);
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-wrapper')) dropdown.classList.remove('show');
  });
}

// ==================== Show Detail ====================
function loadShowDetail(showId) {
  // Fetch show info + all episodes in parallel
  Promise.all([
    apiFetch('/shows/' + showId),
    apiFetch('/shows/' + showId + '/episodes')
  ]).then(function(results) {
    var show = results[0];
    var episodes = results[1] || [];
    State.currentShow = show;
    State.allEpisodes = episodes;
    State.currentSeason = 1;

    // Save total episode count
    if (!State.watchedData[showId]) {
      State.watchedData[showId] = { name: show.name, seasons: {}, _totalEps: episodes.length };
    } else {
      State.watchedData[showId].name = show.name;
      State.watchedData[showId]._totalEps = episodes.length;
    }
    saveWatched();

    // Get season list
    var seasons = {};
    episodes.forEach(function(ep) {
      if (!seasons[ep.season]) seasons[ep.season] = [];
      seasons[ep.season].push(ep);
    });

    renderShowDetail(show, seasons);
    renderSidebar();
  }).catch(function(err) {
    alert('加载失败: ' + err.message);
  });
}

function renderShowDetail(show, seasons) {
  el('welcome').style.display = 'none';
  el('searchResults').style.display = 'none';
  el('showDetail').style.display = 'block';

  var img = show.image ? show.image.original || show.image.medium : '';
  var poster = img
    ? '<img src="' + img + '" alt="' + escapeHtml(show.name) + '">'
    : '<div class="dh-placeholder">📺</div>';

  var year = show.premiered ? show.premiered.slice(0,4) : '';
  var rating = show.rating && show.rating.average ? '⭐' + show.rating.average.toFixed(1) : '';
  var genres = (show.genres || []).map(function(g) { return '<span class="dh-genre">' + g + '</span>'; }).join('');
  var statusText = show.status === 'Ended' ? '✅ 已完结' : (show.status === 'Running' ? '🔄 连载中' : show.status || '');

  var sKeys = Object.keys(seasons).sort(function(a,b) { return a-b; });
  var totalEpisodes = State.allEpisodes.length;

  var progress = getShowProgress(show.id);
  var pct = progress.total > 0 ? Math.round(progress.watched / progress.total * 100) : 0;
  var progClass = pct === 0 ? '' : (pct < 50 ? 'dh-progress-low' : (pct < 100 ? 'dh-progress-mid' : 'dh-progress-high'));

  var summary = show.summary ? show.summary.replace(/<[^>]+>/g, '') : '';

  el('detailContent').innerHTML =
    '<div class="detail-header">' +
      poster +
      '<div class="dh-info">' +
        '<h1>' + escapeHtml(show.name) + '</h1>' +
        '<div class="dh-meta">' +
          (year ? '<span>📅 ' + year + '</span>' : '') +
          (rating ? '<span class="dh-rating">' + rating + '</span>' : '') +
          '<span>📺 ' + sKeys.length + ' 季</span>' +
          '<span>🎬 ' + totalEpisodes + ' 集</span>' +
          (statusText ? '<span>' + statusText + '</span>' : '') +
          (show.network ? '<span>📡 ' + show.network.name + '</span>' : '') +
        '</div>' +
        (genres ? '<div class="dh-genres">' + genres + '</div>' : '') +
        (summary ? '<div class="dh-overview">' + escapeHtml(summary).slice(0, 300) + '</div>' : '') +
        '<div class="dh-progress ' + progClass + '">' +
          '<div class="dh-progress-bar"><div class="dh-progress-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="dh-progress-text">追剧进度: ' + progress.watched + '/' + progress.total + ' 集 (' + pct + '%)</div>' +
        '</div>' +
        (State.watchedData[show.id] ? '<button class="btn-sm" id="removeShowBtn" style="margin-top:8px;color:#f85149;border-color:#f85149;">🗑️ 删除追剧记录</button>' : '') +
      '</div>' +
    '</div>' +
    '<div class="season-tabs" id="seasonTabs">' +
      sKeys.map(function(sn) {
        return '<button class="season-tab' + (parseInt(sn) === State.currentSeason ? ' active' : '') + '" data-season="' + sn + '">S' + sn + '</button>';
      }).join('') +
    '</div>' +
    '<div class="episode-header">' +
      '<span style="font-weight:600">分集列表 (' + (seasons[State.currentSeason] || []).length + ' 集)</span>' +
      '<span class="select-all" id="selectAllToggle">全选/取消</span>' +
    '</div>' +
    '<div class="episode-list" id="episodeList"></div>';

  // Render episodes for current season
  renderEpisodes(show.id, show.name, seasons[State.currentSeason] || []);

  // Bind season tabs
  el('seasonTabs').addEventListener('click', function(e) {
    var tab = e.target.closest('.season-tab');
    if (!tab) return;
    State.currentSeason = parseInt(tab.dataset.season);
    renderShowDetail(show, seasons);
  });

  // Bind remove show button
  var removeBtn = el('removeShowBtn');
  if (removeBtn) {
    removeBtn.addEventListener('click', function() {
      if (confirm('确定要删除 ' + show.name + ' 的追剧记录吗？')) {
        removeShow(show.id);
      }
    });
  }

  // Bind select all
  el('selectAllToggle').addEventListener('click', function() {
    toggleAllEpisodes(show.id, show.name, State.currentSeason, seasons[State.currentSeason] || []);
  });

  // Back button
  el('backBtn').onclick = function() { goBack(); };
}

function renderEpisodes(showId, showName, episodes) {
  var list = el('episodeList');
  if (!list) return;

  list.innerHTML = episodes.map(function(ep) {
    var watched = isEpisodeWatched(showId, ep.season, ep.number);
    var date = ep.airdate || '';
    return '<div class="episode-item' + (watched ? ' watched' : '') + '" data-ep="' + ep.number + '">' +
      '<div class="ep-checkbox">✓</div>' +
      '<span class="ep-num">E' + String(ep.number).padStart(2,'0') + '</span>' +
      '<span class="ep-title">' + escapeHtml(ep.name || 'Episode ' + ep.number) + '</span>' +
      (date ? '<span class="ep-date">' + date + '</span>' : '') +
    '</div>';
  }).join('');

  // Bind click to toggle
  list.querySelectorAll('.episode-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var epNum = parseInt(item.dataset.ep);
      toggleEpisode(showId, showName, State.currentSeason, epNum);
      item.classList.toggle('watched');

      // Need to re-render detail to update progress bar and season tabs
      var seasons = {};
      State.allEpisodes.forEach(function(ep) {
        if (!seasons[ep.season]) seasons[ep.season] = [];
        seasons[ep.season].push(ep);
      });
      renderShowDetail(State.currentShow, seasons);
      renderSidebar();
    });
  });
}

function toggleAllEpisodes(showId, showName, seasonNum, episodes) {
  var items = el('episodeList').querySelectorAll('.episode-item');
  var allWatched = true;
  items.forEach(function(item) {
    if (!item.classList.contains('watched')) allWatched = false;
  });

  episodes.forEach(function(ep) {
    var isCurrentlyWatched = isEpisodeWatched(showId, seasonNum, ep.number);
    if (allWatched) {
      // Uncheck all currently watched
      if (isCurrentlyWatched) toggleEpisode(showId, showName, seasonNum, ep.number);
    } else {
      // Check all not yet watched
      if (!isCurrentlyWatched) toggleEpisode(showId, showName, seasonNum, ep.number);
    }
  });

  // Re-render
  var seasons = {};
  State.allEpisodes.forEach(function(ep) {
    if (!seasons[ep.season]) seasons[ep.season] = [];
    seasons[ep.season].push(ep);
  });
  renderShowDetail(State.currentShow, seasons);
  renderSidebar();
}

// ==================== Sidebar ====================
function removeShow(showId) {
  delete State.watchedData[showId];
  saveWatched();
  if (State.currentShow && State.currentShow.id === parseInt(showId)) {
    goBack();
  }
  renderSidebar();
}

function renderSidebar() {
  var container = el('myShowsList');
  var entries = Object.keys(State.watchedData).filter(function(k) { return k.charAt(0) !== '_'; });

  if (entries.length === 0) {
    container.innerHTML = '<p class="empty-hint">搜索并点开一部剧，<br>标记已看后自动出现在这里</p>';
    return;
  }

  container.innerHTML = entries.map(function(showId) {
    var show = State.watchedData[showId];
    var progress = getShowProgress(showId);
    var pct = progress.total > 0 ? Math.round(progress.watched / progress.total * 100) : 0;
    var isActive = State.currentShow && State.currentShow.id === parseInt(showId);
    return '<div class="my-show-item' + (isActive ? ' active' : '') + '" data-id="' + showId + '">' +
      '<button class="ms-delete" data-del="' + showId + '" title="删除">×</button>' +
      '<div class="ms-name">' + escapeHtml(show.name || '未知') + '</div>' +
      '<div class="ms-progress"><div class="ms-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="ms-info">' + progress.watched + '/' + progress.total + ' 集 (' + pct + '%)</div>' +
    '</div>';
  }).join('');

  // Click on show item → open detail
  container.querySelectorAll('.my-show-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
      if (e.target.closest('.ms-delete')) return;
      loadShowDetail(parseInt(item.dataset.id));
    });
  });

  // Click delete button → remove show
  container.querySelectorAll('.ms-delete').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (confirm('确定要删除这部剧的追剧记录吗？')) {
        removeShow(btn.dataset.del);
      }
    });
  });
}

// ==================== Navigation ====================
function goBack() {
  el('showDetail').style.display = 'none';
  el('welcome').style.display = 'block';
  State.currentShow = null;
  renderSidebar();
}

// ==================== Export / Import ====================
function setupIO() {
  el('exportBtn').addEventListener('click', function() {
    var blob = new Blob([JSON.stringify(State.watchedData, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tv-tracker-backup-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
  });

  el('importBtn').addEventListener('click', function() { el('importFile').click(); });

  el('importFile').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        State.watchedData = JSON.parse(ev.target.result);
        saveWatched();
        renderSidebar();
        alert('导入成功！');
      } catch(err) { alert('导入失败：格式错误'); }
    };
    reader.readAsText(file);
  });
}

// ==================== Quick Buttons ====================
function setupQuickButtons() {
  document.querySelectorAll('.quick-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var query = translateQuery(btn.dataset.query);
      apiFetch('/search/shows?q=' + encodeURIComponent(query))
        .then(function(results) {
          if (results && results.length > 0) {
            loadShowDetail(results[0].show.id);
          }
        }).catch(function(err) { alert('搜索失败: ' + err.message); });
    });
  });
}

// ==================== Utils ====================
function escapeHtml(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ==================== Init ====================
function init() {
  setupSearch();
  setupQuickButtons();
  setupIO();
  renderSidebar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
