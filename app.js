/* ================================================================
   追剧追踪器 - TV Show Tracker
   数据来源: TVMaze API (免费，无需注册，无需 API Key)
   存储: localStorage
   ================================================================ */

// ==================== CONFIG ====================
var API_BASE = 'https://api.tvmaze.com';

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
      dropdown.innerHTML = '<div style="padding:14px;color:var(--text-dim);text-align:center;">🔍 搜索中...</div>';
      dropdown.classList.add('show');

      apiFetch('/search/shows?q=' + encodeURIComponent(q))
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
      '<div class="ms-name">' + escapeHtml(show.name || '未知') + '</div>' +
      '<div class="ms-progress"><div class="ms-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="ms-info">' + progress.watched + '/' + progress.total + ' 集 (' + pct + '%)</div>' +
    '</div>';
  }).join('');

  container.querySelectorAll('.my-show-item').forEach(function(item) {
    item.addEventListener('click', function() {
      loadShowDetail(parseInt(item.dataset.id));
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
      apiFetch('/search/shows?q=' + encodeURIComponent(btn.dataset.query))
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
