/* 峡谷新手手册 · 前端逻辑 */
(function () {
  'use strict';
  const D = window.HOK_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const app = $('#app');
  const heroImg = (id) => `assets/img/hero/${id}.png`;
  const typeClass = (t) => 't-' + t;

  /* ---------------- 路由 ---------------- */
  const routes = [];
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, '');
    return h.split('/').filter(Boolean);
  }
  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  const NAV_MAP = { heroes: 'heroes', hero: 'heroes', items: 'items', item: 'items', basics: 'basics', terms: 'terms', builds: 'builds', build: 'builds', quiz: 'quiz', macro: 'macro' };

  function setNav(seg) {
    const key = NAV_MAP[seg[0]] || '';
    $$('#nav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === key));
  }

  function render() {
    const seg = parseHash();
    const view = seg[0] || 'home';
    setNav(seg);
    document.body.classList.remove('quick');
    const curHero = view === 'hero' && seg[1] ? D.heroes.find((h) => h.id === String(seg[1])) : null;
    $('#quickToggle').hidden = !(curHero && curHero.tips && curHero.tips.length);
    closeDrawer();
    const fab = $('#fabNav');
    if (fab) fab.hidden = !seg.length;

    let html = '';
    if (view === 'home') html = viewHome();
    else if (view === 'heroes') html = viewHeroes();
    else if (view === 'hero') html = viewHero(seg[1]);
    else if (view === 'builds') html = viewBuilds();
    else if (view === 'build') html = viewBuild(seg[1]);
    else if (view === 'quiz') html = viewQuiz();
    else if (view === 'macro') html = viewMacro();
    else if (view === 'items') html = viewItems();
    else if (view === 'item') html = viewItem(seg[1]);
    else if (view === 'basics' && seg[1]) html = viewArticle(seg[1]);
    else if (view === 'basics') html = viewBasics();
    else if (view === 'terms') html = viewTerms();
    else if (view === 'about') html = viewAbout();
    else html = viewNotFound();

    app.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    afterRender(view, seg);
  }

  /* ---------------- 通用组件 ---------------- */
  function heroCard(h, i) {
    const one = h.one;
    return `<a class="hcard reveal" style="transition-delay:${Math.min(i * 22, 260)}ms" href="#/hero/${h.id}">
      <div class="pic"><img loading="lazy" src="${heroImg(h.id)}" alt="${esc(h.name)}">
        <div class="top">
          <span class="badge type ${typeClass(h.type)}">${esc(h.type)}</span>

        </div>
        <div class="name-wrap">
          <div class="name">${esc(h.name)}</div>
          <div class="sub">${esc(h.title)} · ${h.lanes.map(esc).join(' / ')}</div>
          <div class="one">${esc(one)}</div>
        </div>
      </div>
    </a>`;
  }

  function sectionHead(kicker, title, desc, right, tag) {
    const T = tag || 'h2';
    return `<div class="section-head">
      <div><span class="kicker">${esc(kicker)}</span><${T}>${esc(title)}</${T}>${desc ? `<p>${esc(desc)}</p>` : ''}</div>
      ${right || ''}
    </div>`;
  }

  /* ---------------- 首页 ---------------- */
  function viewHome() {
    const s = D.stats;
    const starters = D.heroes.filter((h) => h.starter);
    const star = D.heroes.find((h) => h.name === '大司命') || starters[0];
    const modules = [
      { href: '#/heroes', n: '01', t: '英雄图鉴', d: '133 位英雄的玩法与应对' },
      { href: '#/items', n: '02', t: '装备图鉴', d: '52 件装备，什么时候出' },
      { href: '#/builds', n: '03', t: '出装路线', d: '开局到六神，含换装' },
      { href: '#/macro', n: '04', t: '意识课', d: '什么时候支援、守线' },
      { href: '#/quiz', n: '05', t: '出装自测', d: '20 道题，答错给解释' },
      { href: '#/basics', n: '06', t: '基础课', d: '8 节课，补上为什么' },
    ];
    return `<div class="view">
      <section class="home-hero compact">
        <div class="wrap inner">
          <div>
            <span class="kicker">HONOR OF KINGS · 新手向</span>
            <h1>别背攻略，<br>先看懂<span class="gold">这局游戏</span>。</h1>
            <div class="hero-search">
              <button id="homeSearch">
                <svg viewBox="0 0 24 24" class="ico"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                搜英雄、装备、术语
              </button>
              <a class="btn primary" href="#/heroes">开始</a>
            </div>
            <div class="stat-row">
              <div class="stat"><b>${s.heroes}</b><span>英雄</span></div>
              <div class="stat"><b>${s.items}</b><span>装备</span></div>
              <div class="stat"><b>${s.chains}</b><span>出装路线</span></div>
              <div class="stat"><b>${s.quiz}</b><span>自测题</span></div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="ring"></div><div class="ring"></div>
            <div class="core"><img src="${heroImg(star.id)}" alt="${esc(star.name)}"></div>
            <div class="tag a"><b>10%</b> 斩杀线</div>
            <div class="tag b">魂链 <b>3 秒</b> 拉断</div>
            <div class="tag c">残血 = <b>已死一半</b></div>
          </div>
        </div>
      </section>

      <section class="hub wrap">
        <div class="nav-grid">
          ${modules.map((m) => `<a class="nav-tile" href="${m.href}">
            <span class="nt-n">${m.n}</span>
            <span class="nt-t">${esc(m.t)}</span>
            <span class="nt-d">${esc(m.d)}</span>
            <span class="nt-go">→</span>
          </a>`).join('')}
        </div>
      </section>

      <section class="section wrap">
        ${sectionHead('START', '先练这 8 个', '', '<a class="btn" href="#/heroes">全部英雄</a>')}
        <div class="hero-grid starter-grid">${starters.map(heroCard).join('')}</div>
      </section>

      <section class="section wrap">
        ${sectionHead('ONE THING', '今天学一课', '', '<a class="btn" href="#/basics">全部课程</a>')}
        <a class="one-lesson" href="#/basics/${D.basics[0].id}">
          <span class="ol-k">LESSON 01</span>
          <span class="ol-t">${esc(D.basics[0].title)}</span>
          <span class="ol-d">${esc(D.basics[0].sub)} · ${D.basics[0].minutes} 分钟</span>
        </a>
      </section>
    </div>`;
  }

  /* ---------------- 英雄列表 ---------------- */
  const heroState = { type: '全部', lane: '全部', q: '', onlyFeatured: false };
  const TYPES = ['全部', '战士', '法师', '坦克', '刺客', '射手', '辅助'];
  const LANES = ['全部', '对抗路', '打野', '中路', '发育路', '游走'];

  function matchHero(h, q) {
    if (!q) return true;
    const s = q.toLowerCase().trim();
    const pool = [h.name, h.title, h.py, h.initials, ...(h.alias || [])].join(' ').toLowerCase();
    return pool.includes(s);
  }

  function filterHeroes() {
    return D.heroes.filter((h) =>
      (heroState.type === '全部' || h.type === heroState.type) &&
      (heroState.lane === '全部' || h.lanes.includes(heroState.lane)) &&
      (!heroState.onlyFeatured || h.featured) &&
      matchHero(h, heroState.q)
    );
  }

  function viewHeroes() {
    return `<div class="view">
      <section class="section wrap" style="padding-top:44px">
        ${sectionHead('HERO INDEX', '英雄图鉴', '133 位英雄，全部有完整解读。', '', 'h1')}
        <details class="picker">
          <summary>不知道练谁？回答两个问题，给你推荐两个 →</summary>
          <div class="quiz" id="quiz">
            <div class="quiz-step" data-step="1">
              <span class="qn">Q1 / 2</span>
              <h3>你想走哪条路？</h3>
              <div class="chips">
                ${['对抗路', '打野', '中路', '发育路', '游走'].map((l) => `<button class="chip" data-lane="${l}">${l}</button>`).join('')}
              </div>
            </div>
            <div class="quiz-step" data-step="2" hidden>
              <span class="qn">Q2 / 2</span>
              <h3>你更喜欢哪种打法？</h3>
              <div class="chips">
                <button class="chip" data-style="melee">贴脸刚正面</button>
                <button class="chip" data-style="ranged">远程输出</button>
                <button class="chip" data-style="support">保人 / 开团</button>
              </div>
            </div>
            <div class="quiz-result" id="quizResult"></div>
          </div>
        </details>
        <div class="filters">
          <div class="frow"><span class="flabel">定位</span><div class="chips">
            ${TYPES.map((t) => `<button class="chip ${heroState.type === t ? 'on' : ''}" data-type="${t}">${t}</button>`).join('')}
          </div></div>
          <div class="frow"><span class="flabel">分路</span><div class="chips">
            ${LANES.map((t) => `<button class="chip ${heroState.lane === t ? 'on' : ''}" data-lane="${t}">${t}</button>`).join('')}
          </div></div>
          <div class="frow frow-end">
            <label class="mini-search">
              <svg viewBox="0 0 24 24" class="ico"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
              <input id="heroQ" placeholder="搜名字 / 别名" value="${esc(heroState.q)}">
            </label>
            <span class="count" id="heroCount"></span>
          </div>
        </div>
        <div class="hero-grid" id="heroGrid"></div>
      </section>
    </div>`;
  }

  function paintHeroes() {
    const grid = $('#heroGrid');
    if (!grid) return;
    const list = filterHeroes();
    grid.innerHTML = list.length ? list.map(heroCard).join('') : '<div class="notice">没有匹配的英雄，换个关键词试试。</div>';
    const c = $('#heroCount');
    if (c) c.textContent = `${list.length} / ${D.heroes.length}`;
    observeReveal();
  }

  /* ---------------- 英雄详情 ---------------- */
  function skillBlock(h) {
    const human = h.skillHuman || null;
    return `<div class="skills">${h.skills.map((s, i) => {
      const hm = human && human[i] ? human[i] : null;
      const idx = i === 0 ? '被动' : ['一', '二', '三', '四'][i - 1] + '技能';
      return `<div class="skill ${i === 0 ? 'open' : ''}">
        <button class="skill-h">
          <span class="idx">${i === 0 ? '被' : i}</span>
          <span class="nm">${esc(s.name)}</span>
          <span class="cd">${s.cd ? 'CD ' + esc(s.cd) : '被动'}</span>
          <svg viewBox="0 0 24 24" class="ico arrow"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="skill-b"><div class="in"><div class="skill-body">
          ${hm ? `
            <div class="skill-line"><span>做什么</span><p>${esc(hm.what)}</p></div>
            <div class="skill-line"><span>何时用</span><p>${esc(hm.when)}</p></div>
            <div class="skill-line watch"><span>注意</span><p>${esc(hm.watch)}</p></div>
            <details class="official"><summary>官方原文</summary><p>${esc(s.desc)}</p></details>`
          : `<div class="skill-line"><span>官方</span><p style="white-space:pre-wrap;color:var(--text-2)">${esc(s.desc)}</p></div>`}
        </div></div></div>
      </div>`;
    }).join('')}</div>`;
  }

  function counterBlock(h) {
    return `<section class="block" id="sec-vs">
      <div class="block-title"><h2>遇到他怎么办</h2><span class="line"></span><span class="n">HOW TO COUNTER</span></div>
      <p class="sec-lead">先记这几条行为习惯，再看该补什么装备。</p>
      <div class="tips-grid">
        ${h.tips.map((t, i) => `<div class="tip"><span class="no">0${i + 1}</span><b>${esc(t.t)}</b><p>${esc(t.d)}</p></div>`).join('')}
      </div>
      <div class="counter-head"><h3>克制出装</h3><span>按优先级排，先出第 1 件</span></div>
      <div class="counter-items">
        ${(h.counterItems || []).map((it, i) => {
          const found = D.items.find((x) => x.name === it.name);
          return `<a class="citem" href="${found ? '#/item/' + found.slug : '#/items'}">
            <div class="citem-top">
              ${found && found.icon ? `<img class="iicon sm" src="${found.icon}" alt="">` : ''}
              <span class="citem-idx">0${i + 1}</span>
              <span class="citem-name">${esc(it.name)}</span>
              ${it.alias && it.alias !== it.name ? `<span class="citem-alias">俗称 ${esc(it.alias)}</span>` : ''}
              <span class="citem-who">${esc(it.who)}</span>
            </div>
            <p>${esc(it.why)}</p>
          </a>`;
        }).join('')}
      </div>
    </section>`;
  }

  function quickPanel(h) {
    return `<div class="quick-panel wrap" id="quickPanel">
      <h2>${esc(h.name)} · 对局速查</h2>
      <p class="sub">只留最关键的几条，一屏看完。</p>
      <div class="quick-tips">
        ${h.tips.map((t) => `<div class="quick-tip"><b>${esc(t.t)}</b><p>${esc(t.d)}</p></div>`).join('')}
      </div>
      <div class="quick-items">
        <h3>该出的装备</h3>
        <ul>${(h.counterItems || []).map((it) => { const f = D.items.find((x) => x.name === it.name); return `<li>${f && f.icon ? `<img class="iicon sm" src="${f.icon}" alt="">` : ''}<b>${esc(it.name)}</b>${it.alias && it.alias !== it.name ? `（${esc(it.alias)}）` : ''} — ${esc(it.why)}</li>`; }).join('')}</ul>
      </div>
      <button class="btn quick-exit" id="quickExit">退出速查</button>
    </div>`;
  }

  function viewHero(id) {
    const h = D.heroes.find((x) => x.id === String(id));
    if (!h) return viewNotFound();

    if (!h.featured) {
      return `<div class="view hero-page">
        <div class="wrap">
          <div class="crumb"><a href="#/heroes">英雄图鉴</a> / <span>${esc(h.name)}</span></div>
          <div class="hero-head">
            <div class="portrait"><img src="${heroImg(h.id)}" alt="${esc(h.name)}"><div class="glow"></div></div>
            <div class="hero-title">
              <h1>${esc(h.name)}<em>${esc(h.title)}</em></h1>
              <div class="hero-badges">
                <span class="badge type ${typeClass(h.type)}">${esc(h.type)}</span>
                ${h.lanes.map((l) => `<span class="badge">${esc(l)}</span>`).join('')}
              </div>
              <div class="notice" style="margin-top:20px">
                <b>“遇到他怎么办”已经写好，完整玩法解读还在整理。</b><br>
                下面的应对技巧和克制出装可以直接用；技能区是官网原文，机制准确。
              </div>
            </div>
          </div>
          ${counterBlock(h)}
          <section class="block"><div class="block-title"><h2>技能原文</h2><span class="line"></span><span class="n">FROM OFFICIAL</span></div>${skillBlock(h)}</section>
        </div>
        ${quickPanel(h)}
      </div>`;
    }

    const b = h.bars;
    return `<div class="view hero-page">
      <div class="wrap">
        <div class="crumb"><a href="#/heroes">英雄图鉴</a> / <a href="#/heroes">${esc(h.type)}</a> / <span>${esc(h.name)}</span></div>

        <div class="hero-head">
          <div class="portrait"><img src="${heroImg(h.id)}" alt="${esc(h.name)}"><div class="glow"></div></div>
          <div class="hero-title">
            <h1>${esc(h.name)}<em>${esc(h.title)}</em></h1>
            <div class="hero-badges">
              <span class="badge type ${typeClass(h.type)}">${esc(h.type)}</span>
              ${h.lanes.map((l) => `<span class="badge">${esc(l)}</span>`).join('')}
              ${h.nick && h.nick.length ? `<span class="badge nick">外号：${h.nick.map(esc).join('、')}</span>` : ''}
              <span class="badge">上手难度 ${'★'.repeat(Math.max(1, Math.round(b.difficulty / 20)))}${'☆'.repeat(5 - Math.max(1, Math.round(b.difficulty / 20)))}</span>
            </div>
            <p class="one-line">${esc(h.one)}</p>
            <div class="bars">
              <div class="bar"><span>生存</span><div class="track"><div class="fill" data-w="${b.survive}"></div></div></div>
              <div class="bar"><span>输出</span><div class="track"><div class="fill" data-w="${b.damage}"></div></div></div>
              <div class="bar"><span>技能</span><div class="track"><div class="fill" data-w="${b.skill}"></div></div></div>
              <div class="bar"><span>难度</span><div class="track"><div class="fill" data-w="${b.difficulty}"></div></div></div>
            </div>
          </div>
        </div>

        <nav class="subnav" id="subnav">
          <a href="#sec-overview" class="on">速览</a>
          <a href="#sec-skills">技能</a>
          <a href="#sec-play">打法</a>
          <a href="#sec-vs">怎么打他</a>
          <a href="#sec-build">出装</a>
          <a href="#sec-counter">克制</a>
        </nav>

        <section class="block" id="sec-overview">
          <div class="block-title"><h2>30 秒速览</h2><span class="line"></span><span class="n">OVERVIEW</span></div>
          <div class="tri">
            <div class="panel strong"><h4>他强在哪</h4><ul>${h.strong.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
            <div class="panel weak"><h4>他怕什么</h4><ul>${h.weak.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
            <div class="panel"><h4>强势期</h4><ul><li>${esc(h.spike)}</li></ul></div>
          </div>
        </section>

        <section class="block" id="sec-skills">
          <div class="block-title"><h2>技能，说人话</h2><span class="line"></span><span class="n">SKILLS</span></div>
          ${skillBlock(h)}
        </section>

        <section class="block" id="sec-play">
          <div class="block-title"><h2>怎么玩</h2><span class="line"></span><span class="n">PLAY</span></div>
          <div class="combos">${h.combos.map((c, i) => `<div class="combo"><span class="k">连招 ${i + 1}</span><span class="seq">${esc(c)}</span></div>`).join('')}</div>
          <div class="two-col" style="margin-top:16px">
            <div class="panel"><h4>对线期</h4><p style="font-size:14px;color:var(--text-2);line-height:1.75">${esc(h.lane)}</p></div>
            <div class="panel"><h4>团战定位</h4><p style="font-size:14px;color:var(--text-2);line-height:1.75">${esc(h.team)}</p></div>
          </div>
        </section>

        ${counterBlock(h)}

        <section class="block" id="sec-build">
          <div class="block-title"><h2>出装思路</h2><span class="line"></span><span class="n">BUILD</span></div>
          ${D.chains.find((cc) => cc.hero === h.name) ? `<p style="margin-bottom:14px"><a class="btn" href="#/build/${D.chains.find((cc) => cc.hero === h.name).id}">看 ${esc(h.name)} 的六神装完整路线 →</a></p>` : ''}
          <div class="builds">
            ${h.builds.map((b2) => `<div class="build">
              <h4><i></i>${esc(b2.name)}</h4>
              <div class="items-row">${b2.items.map((it) => { const found = D.items.find((x) => x.name === it); return `<a class="item-chip" href="${found ? '#/item/' + found.slug : '#/items'}">${found && found.icon ? `<img class="iicon xs" src="${found.icon}" alt="">` : ''}${esc(it)}</a>`; }).join('')}</div>
              <p>${esc(b2.why)}</p>
            </div>`).join('')}
          </div>
          <div class="meta-row">
            <div class="meta-card"><span>铭文</span><b>${esc(h.arcana)}</b><p>${esc(h.arcanaNote)}</p></div>
            <div class="meta-card"><span>召唤师技能</span><b>${esc(h.summoner)}</b><p>${esc(h.summonerNote)}</p></div>
          </div>
        </section>

        <section class="block" id="sec-counter">
          <div class="block-title"><h2>克制关系</h2><span class="line"></span><span class="n">MATCHUP</span></div>
          <div class="vs">
            <div class="col good"><h4>他克谁</h4><ul>${h.good.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
            <div class="col bad"><h4>谁克他</h4><ul>${h.bad.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
          </div>
          <p style="margin-top:20px;font-size:12px;color:var(--muted)">
            技能与数值来自官网；强弱、克制、出装为本站编辑判断，仅供参考。
          </p>
        </section>
      </div>

      ${quickPanel(h)}
    </div>`;
  }

  /* ---------------- 装备 ---------------- */
  const itemState = { cat: '全部' };
  const CATS = ['全部', '鞋子', '攻击', '法术', '防御', '打野', '辅助'];

  function viewItems() {
    return `<div class="view">
      <section class="section wrap" style="padding-top:44px">
        ${sectionHead('ITEM INDEX', '装备图鉴', '52 件装备，讲清什么时候出。', '', 'h1')}

        <div class="decider">
          <h3>出装决策助手</h3>
          <p>点选对面的阵容特点，看看该补哪件装备。</p>
          <div class="dec-row"><label>对面</label>
            ${Object.entries(D.decider).map(([k, v]) => `<button class="chip dec" data-k="${k}">${esc(v.label)}</button>`).join('')}
          </div>
          <div class="dec-notes" id="decNotes"></div>
          <div class="dec-out" id="decOut"><span class="empty">还没有选择——先点一个特点，下面会解释它是什么意思、该出什么。</span></div>
        </div>

        <p style="margin:-6px 0 18px"><a class="btn" href="#/builds">看不出装顺序？看六个英雄的六神装路线 →</a></p>
        <p style="font-size:12px;color:var(--muted);margin:-8px 0 20px">属性只写“给什么”，不写具体数值——版本一调数字就过期，以游戏内为准。</p>
        <div class="cat-tabs">
          ${CATS.map((c) => `<button class="chip ${itemState.cat === c ? 'on' : ''}" data-cat="${c}">${c}</button>`).join('')}
        </div>
        <div class="item-grid" id="itemGrid"></div>
      </section>
    </div>`;
  }

  function paintItems() {
    const grid = $('#itemGrid');
    if (!grid) return;
    const list = D.items.filter((i) => itemState.cat === '全部' || i.cat === itemState.cat);
    grid.innerHTML = list.map((i, n) => `<a class="icard reveal" style="transition-delay:${Math.min(n * 18, 200)}ms" href="#/item/${i.slug}">
      <div class="top">${i.icon ? `<img class="iicon" src="${i.icon}" alt="" loading="lazy">` : `<span class="glyph">${esc(i.name.slice(0, 1))}</span>`}<span class="nm">${esc(i.name)}</span><span class="cat">${esc(i.cat)}</span></div>
      <div class="attrs">${esc(i.attrs)}</div>
      <div class="passive">${esc(i.passive)}</div>
    </a>`).join('');
    observeReveal();
  }

  function viewItem(slug) {
    const it = D.items.find((x) => x.slug === slug);
    if (!it) return viewNotFound();
    const related = D.items.filter((x) => x.name === it.alt).map((x) => x.slug);
    return `<div class="view">
      <div class="wrap item-page">
        <div class="crumb"><a href="#/items">装备图鉴</a> / <span>${esc(it.cat)}</span> / <span>${esc(it.name)}</span></div>
        <div class="item-hero">
          ${it.icon ? `<img class="iicon xl" src="${it.icon}" alt="">` : `<div class="glyph">${esc(it.name.slice(0, 1))}</div>`}
          <div><h1>${esc(it.name)}</h1><p>${esc(it.cat)}装备${it.alias && it.alias.length ? ' · 俗称 ' + it.alias.map(esc).join('、') : ''}</p></div>
        </div>
        <dl class="kv">
          <dt>属性</dt><dd>${esc(it.attrs)}</dd>
          <dt>被动</dt><dd>${esc(it.passive)}</dd>
          <dt>何时出</dt><dd>${esc(it.when)}</dd>
          <dt>适合谁</dt><dd>${esc(it.who)}</dd>
          <dt>别乱出</dt><dd>${esc(it.avoid)}</dd>
          <dt>替代品</dt><dd>${related.length ? related.map((s) => `<a href="#/item/${s}" style="color:var(--gold)">${esc(D.items.find((x) => x.slug === s).name)}</a>`).join('、') : esc(it.alt)}</dd>
        </dl>
        <div class="notice" style="margin-top:22px;font-size:12.5px">
          属性数值会随版本调整，这里只保留机制描述。具体数值以游戏内为准。
        </div>
        ${(() => {
          const same = D.items.filter((x) => x.cat === it.cat && x.slug !== it.slug).slice(0, 4);
          if (!same.length) return '';
          return `<div class="block" style="padding-top:34px">
            <div class="block-title"><h2>同类装备</h2><span class="line"></span><span class="n">SAME CATEGORY</span></div>
            <div class="item-grid">${same.map((x) => `<a class="icard" href="#/item/${x.slug}">
              <div class="top">${x.icon ? `<img class="iicon" src="${x.icon}" alt="" loading="lazy">` : ''}<span class="nm">${esc(x.name)}</span><span class="cat">${esc(x.cat)}</span></div>
              <div class="attrs">${esc(x.attrs)}</div>
            </a>`).join('')}</div>
          </div>`;
        })()}
      </div>
    </div>`;
  }

  const DEC_RULES = {
    heal: ['制裁之刃', '梦魇之牙'],
    phys: ['不祥征兆', '反伤刺甲', '影忍之足'],
    magic: ['魔女斗篷', '永夜守护', '抵抗之靴'],
    tank: ['破晓', '碎星锤', '虚无法杖'],
    control: ['抵抗之靴', '纯净苍穹', '辉月'],
    engage: ['奔狼纹章', '近卫荣耀'],
  };
  const decSelected = new Set();

  function bindDecider() {
    const paint = () => {
      const notes = $('#decNotes');
      const out = $('#decOut');
      if (!notes || !out) return;
      if (!decSelected.size) {
        notes.innerHTML = '';
        out.innerHTML = '<span class="empty">还没有选择——先点一个特点，下面会解释它是什么意思、该出什么。</span>';
        return;
      }
      notes.innerHTML = Array.from(decSelected).map((k) => {
        const t = D.decider[k];
        return `<div class="dec-note"><b>${esc(t.label)}</b><p>${esc(t.desc)}</p>
          <p class="dec-ex">常见英雄：${t.examples.map(esc).join('、')}</p></div>`;
      }).join('');
      const set = new Set();
      decSelected.forEach((k2) => (DEC_RULES[k2] || []).forEach((n) => set.add(n)));
      out.innerHTML = `<span class="dec-out-label">该补的装备：</span>` + Array.from(set).map((n) => {
        const it = D.items.find((x) => x.name === n);
        return `<a class="item-chip" href="${it ? '#/item/' + it.slug : '#/items'}">${it && it.icon ? `<img class="iicon xs" src="${it.icon}" alt="">` : ''}${esc(n)}</a>`;
      }).join('');
    };
    $$('.chip.dec').forEach((btn) => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.k;
        if (decSelected.has(k)) { decSelected.delete(k); btn.classList.remove('on'); }
        else { decSelected.add(k); btn.classList.add('on'); }
        paint();
      });
    });
    paint();
  }

  /* ---------------- 基础课 ---------------- */
  function viewBasics() {
    return `<div class="view">
      <section class="section wrap" style="padding-top:44px">
        ${sectionHead('BASICS', '基础课', `${D.basics.length} 节课，补上“为什么”。`, '', 'h1')}
        <div class="course-grid">
          ${D.basics.map((b, i) => `<a class="course reveal" style="transition-delay:${i * 50}ms" href="#/basics/${b.id}">
            <span class="no">LESSON 0${i + 1}</span><h3>${esc(b.title)}</h3><p>${esc(b.sub)}</p>
            <span class="m">${b.minutes} 分钟阅读</span></a>`).join('')}
        </div>
      </section>
    </div>`;
  }

  function viewArticle(id) {
    const idx = D.basics.findIndex((b) => b.id === id);
    if (idx < 0) return viewNotFound();
    const b = D.basics[idx];
    const next = D.basics[idx + 1];
    return `<div class="view">
      <div class="progress" id="readProgress"></div>
      <article class="article wrap">
        <div class="crumb"><a href="#/basics">基础课</a> / <span>Lesson 0${idx + 1}</span></div>
        <h1>${esc(b.title)}</h1>
        <p class="sub">${esc(b.sub)} · ${b.minutes} 分钟</p>
        ${b.sections.map((s) => `<h2>${esc(s.h)}</h2><p>${esc(s.p)}</p>`).join('')}
        <div style="margin-top:46px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap">
          <a class="btn" href="#/basics">← 回到基础课</a>
          ${next ? `<a class="btn primary" href="#/basics/${next.id}">下一课：${esc(next.title)} →</a>` : `<a class="btn primary" href="#/heroes">去看英雄 →</a>`}
        </div>
      </article>
    </div>`;
  }

  /* ---------------- 术语 ---------------- */
  function viewTerms() {
    return `<div class="view">
      <section class="section wrap" style="padding-top:44px">
        ${sectionHead('GLOSSARY', '术语词典', '队友说的话听不懂？先查这里。', '', 'h1')}
        <label class="mini-search" style="margin-bottom:20px;max-width:320px">
          <svg viewBox="0 0 24 24" class="ico"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
          <input id="termQ" placeholder="搜术语">
        </label>
        <div class="term-grid" id="termGrid">
          ${D.glossary.map((g) => `<div class="term"><b>${esc(g.t)}</b><p>${esc(g.d)}</p></div>`).join('')}
        </div>
      </section>
    </div>`;
  }

  function bindTerms() {
    const input = $('#termQ');
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.trim();
      const list = D.glossary.filter((g) => !q || g.t.includes(q) || g.d.includes(q));
      $('#termGrid').innerHTML = list.length
        ? list.map((g) => `<div class="term"><b>${esc(g.t)}</b><p>${esc(g.d)}</p></div>`).join('')
        : '<div class="notice">没找到这个术语。</div>';
    });
  }

  /* ---------------- 关于 ---------------- */
  function viewAbout() {
    return `<div class="view">
      <article class="article wrap" style="max-width:760px">
        <div class="crumb"><a href="#/">首页</a> / <span>关于</span></div>
        <h1>关于这个站，以及数据从哪来</h1>
        <p class="sub">最后更新：2026-10-28</p>
        <h2>数据来源</h2>
        <p>英雄的技能名称、冷却、消耗与技能描述，来自王者荣耀官网英雄资料页（<code>pvp.qq.com/web201605/herodetail/{id_name}.shtml</code>），共 133 位英雄、542 条技能，脚本抓取后人工整理。</p>
        <p>“一句话”“技能人话版”“怎么打他”“出装思路”等内容为本站编辑撰写，不是官方表述。</p>
        <h2>准确性说明</h2>
        <p>数值会随版本调整，所以本站在解读里尽量只讲机制、少写具体数字；具体数值以游戏内为准。英雄的强弱、克制关系属于编辑判断，会随版本变化。</p>
        <h2>目前完成度</h2>
        <p>133 位英雄全部完成：官方技能原文、一句话定位、技能人话版、连招、对线/团战、两套出装、铭文、召唤师技能，以及「遇到他怎么办」（3-4 条应对习惯 + 3 件克制装备）。</p>
        <p>另外还有意识课：4 条判断原则、5 个位置的节奏表、8 个带地图的情景题。</p>
        <p>这是第一版全量内容，欢迎挑错——错的地方改起来很快。</p>
        <h2>关于装备建议</h2>
        <p>装备只写“给什么”，不写具体数值；俗称（反甲、制裁、魔女、不详、复活甲……）都做了对应，点进去就是完整装备页。搜索俗称也能直接找到装备。</p>
        <h2>反馈</h2>
        <p>发现错误或想补充，直接说就行——这个站是给新手用的，准确比好看重要。</p>
      </article>
    </div>`;
  }

  function viewNotFound() {
    return `<div class="view"><div class="wrap section"><div class="notice">没有找到这个页面。<a href="#/" style="color:var(--gold)">回首页</a></div></div></div>`;
  }


  /* ---------------- 出装路线 ---------------- */
  const itemOf = (n) => D.items.find((x) => x.name === n);
  function chainIcon(n, cls) {
    const it = itemOf(n);
    return it && it.icon
      ? `<img class="iicon ${cls || ''}" src="${it.icon}" alt="${esc(n)}" title="${esc(n)}">`
      : `<span class="glyph">${esc(n.slice(0, 1))}</span>`;
  }

  function viewBuilds() {
    return `<div class="view">
      <section class="section wrap" style="padding-top:44px">
        ${sectionHead('BUILD PATH', '出装路线', '开局到六神，含顺风/逆风与换装。', '', 'h1')}
        <div class="chain-grid">
          ${D.chains.map((c, i) => {
            const h = D.heroes.find((x) => x.name === c.hero);
            return `<a class="chain-card reveal" style="transition-delay:${i * 50}ms" href="#/build/${c.id}">
              ${h ? `<img src="${heroImg(h.id)}" alt="">` : ''}
              <div class="cc-body">
                <div class="cc-role">${esc(c.role)}</div>
                <h3>${esc(c.hero)}</h3>
                <p>${esc(c.intro)}</p>
                <span class="go">看出装链条 →</span>
              </div>
            </a>`;
          }).join('')}
        </div>
      </section>
    </div>`;
  }

  function viewBuild(id) {
    const c = D.chains.find((x) => x.id === id);
    if (!c) return viewNotFound();
    const h = D.heroes.find((x) => x.name === c.hero);
    return `<div class="view">
      <div class="wrap build-wrap" style="padding:34px 0 90px">
        <div class="crumb"><a href="#/builds">出装路线</a> / <span>${esc(c.hero)}</span></div>
        <div class="build-head">
          ${h ? `<img class="bh-img" src="${heroImg(h.id)}" alt="">` : ''}
          <div>
            <span class="kicker">${esc(c.role)}</span>
            <h1>${esc(c.hero)} · 六神装路线</h1>
            <p>${esc(c.intro)}</p>
          </div>
        </div>

        <div class="stage-list">
          ${c.stages.map((st, i) => `<div class="stage">
            <div class="stage-rail"><span class="stage-dot">${i + 1}</span></div>
            <div class="stage-body">
              <div class="stage-head"><b>${esc(st.t)}</b><span>${esc(st.gold)}</span></div>
              <div class="stage-items">${st.items.map((n) => `<span class="stage-item">${chainIcon(n)}<em>${esc(n)}</em></span>`).join('<span class="stage-arrow">+</span>')}</div>
              <p>${esc(st.note)}</p>
            </div>
          </div>`).join('')}
        </div>

        <div class="block"><div class="block-title"><h2>顺风 / 逆风怎么改</h2><span class="line"></span><span class="n">BRANCH</span></div>
          <div class="branch-grid">
            ${c.branches.map((b, i) => `<div class="branch ${i === 0 ? 'up' : 'down'}">
              <h4>${esc(b.name)}</h4>
              <div class="stage-items">${b.items.map((n) => `<span class="stage-item">${chainIcon(n)}<em>${esc(n)}</em></span>`).join('')}</div>
              <p>${esc(b.note)}</p>
            </div>`).join('')}
          </div>
        </div>

        <div class="block"><div class="block-title"><h2>什么时候卖、卖什么</h2><span class="line"></span><span class="n">SWAP</span></div>
          <div class="swap-grid">
            ${(c.swaps || []).map((sw) => {
              const a = itemOf(sw.sell), b = itemOf(sw.buy);
              return `<div class="swap">
                <div class="swap-flow">
                  <span class="s-side">${a && a.icon ? `<img class="iicon xs" src="${a.icon}" alt="">` : ''}卖 ${esc(sw.sell)}</span>
                  <span class="s-ar">→</span>
                  <span class="s-side buy">${b && b.icon ? `<img class="iicon xs" src="${b.icon}" alt="">` : ''}买 ${esc(sw.buy)}</span>
                </div>
                <div class="s-when">${esc(sw.when)}</div>
                <p>${esc(sw.why)}</p>
              </div>`;
            }).join('')}
          </div>
          <p class="swap-note">卖装备只返还约 <b>70%</b> 金币。优先卖：打野刀、后期收益变低的功能装、重复的唯一被动。别卖核心输出装。
            <a href="#/basics/sell-items">换装规则详解 →</a></p>
        </div>

        <div class="block"><div class="block-title"><h2>最终六神装</h2><span class="line"></span><span class="n">FINAL</span></div>
          <div class="final-row">${c.final.map((n) => `<span class="final-item">${chainIcon(n, 'lg')}<em>${esc(n)}</em></span>`).join('')}</div>
        </div>

        <div class="block"><div class="block-title"><h2>新手提醒</h2><span class="line"></span><span class="n">TIPS</span></div>
          <div class="panel"><ul>${c.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
          <p style="margin-top:18px"><a class="btn" href="${h ? '#/hero/' + h.id : '#/heroes'}">看 ${esc(c.hero)} 的完整解读 →</a></p>
        </div>
      </div>
    </div>`;
  }

  function bindBuild() {
    requestAnimationFrame(() => $$('.stage').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 60, 300) + 'ms';
      el.classList.add('in');
    }));
  }

  /* ---------------- 自测 ---------------- */
  const quizRun = { i: 0, score: 0, wrong: [], answered: false, started: false };
  function viewQuiz() {
    return `<div class="view">
      <section class="section wrap" style="padding-top:44px;max-width:820px">
        ${sectionHead('SELF TEST', '出装自测', `${D.quiz.length} 道题，答错给解释。`, '', 'h1')}
        <div id="quizBox"></div>
      </section>
    </div>`;
  }

  function bindQuizPage() {
    quizRun.i = 0; quizRun.score = 0; quizRun.wrong = []; quizRun.answered = false; quizRun.started = false;
    renderQuiz();
  }

  function renderQuiz() {
    const box = $('#quizBox');
    if (!box) return;
    if (!quizRun.started) {
      box.innerHTML = `<div class="quiz-intro">
        <div class="qi-num">${D.quiz.length}</div>
        <div><h3>准备好了吗</h3><p>题目都是对局里真实会遇到的判断：该出什么、什么时候卖、机制怎么算。答错会给出解释，不计时。</p>
        <button class="btn primary" id="quizStart">开始答题</button></div>
      </div>`;
      $('#quizStart').addEventListener('click', () => { quizRun.started = true; renderQuiz(); });
      return;
    }
    if (quizRun.i >= D.quiz.length) {
      const total = D.quiz.length;
      const pct = Math.round((quizRun.score / total) * 100);
      box.innerHTML = `<div class="quiz-result">
        <div class="qr-score">${quizRun.score} <span>/ ${total}</span></div>
        <p class="qr-tip">${pct >= 80 ? '很稳，基本可以上分了。' : pct >= 60 ? '及格，错题再过一遍。' : '建议回去把装备页和基础课再看一遍。'}</p>
        ${quizRun.wrong.length ? `<div class="qr-wrong"><h4>错题回顾</h4>${quizRun.wrong.map((w) => `<div class="qr-item"><b>${esc(w.q)}</b><p>正确答案：${esc(w.options[w.a])}</p><p class="muted">${esc(w.explain)}</p></div>`).join('')}</div>` : ''}
        <div class="qr-actions">
          <button class="btn primary" id="quizRetry">再测一次</button>
          <a class="btn" href="#/builds">去看出装路线</a>
          <a class="btn" href="#/items">回装备图鉴</a>
        </div>
      </div>`;
      $('#quizRetry').addEventListener('click', bindQuizPage);
      return;
    }
    const q = D.quiz[quizRun.i];
    box.innerHTML = `<div class="quiz-card">
      <div class="quiz-bar"><span style="width:${((quizRun.i + 1) / D.quiz.length) * 100}%"></span></div>
      <div class="quiz-meta">第 ${quizRun.i + 1} / ${D.quiz.length} 题 · 已答对 ${quizRun.score}</div>
      <h3 class="quiz-q">${esc(q.q)}</h3>
      <div class="quiz-opts">
        ${q.options.map((o, i) => `<button class="quiz-opt" data-i="${i}"><span class="oi">${'ABCD'[i]}</span>${esc(o)}</button>`).join('')}
      </div>
      <div class="quiz-fb" id="quizFb"></div>
    </div>`;
    $$('.quiz-opt', box).forEach((b) => b.addEventListener('click', () => answerQuiz(Number(b.dataset.i))));
  }

  function answerQuiz(i) {
    if (quizRun.answered) return;
    quizRun.answered = true;
    const q = D.quiz[quizRun.i];
    const opts = $$('.quiz-opt');
    opts.forEach((b, idx) => {
      b.classList.add('done');
      if (idx === q.a) b.classList.add('right');
      if (idx === i && i !== q.a) b.classList.add('wrong');
    });
    if (i === q.a) quizRun.score += 1;
    else quizRun.wrong.push(q);
    const fb = $('#quizFb');
    fb.innerHTML = `<div class="fb-box ${i === q.a ? 'ok' : 'no'}">
      <b>${i === q.a ? '答对了' : '答错了，正确答案是 ' + q.options[q.a]}</b>
      <p>${esc(q.explain)}</p>
      <button class="btn primary" id="quizNext">${quizRun.i + 1 >= D.quiz.length ? '看结果' : '下一题'}</button>
    </div>`;
    $('#quizNext').addEventListener('click', () => { quizRun.i += 1; quizRun.answered = false; renderQuiz(); });
  }


  /* ---------------- 意识课 ---------------- */
  const sceneRun = { i: 0, score: 0, wrong: [], answered: false, started: false };
  let sceneRole = '全部';

  function viewMacro() {
    const m = D.macro;
    return `<div class="view">
      <section class="section wrap" style="padding-top:44px;max-width:1080px">
        ${sectionHead('MACRO', '意识课', '什么时候支援，什么时候守线。', '', 'h1')}
        <div class="macro-fw">
          ${m.framework.map((f) => `<div class="fw-card">
            <span class="fw-n">${esc(f.n)}</span>
            <h3>${esc(f.t)}</h3>
            <p>${esc(f.d)}</p>
            <p class="fw-bad">常见错误：${esc(f.bad)}</p>
          </div>`).join('')}
        </div>

        <div class="block">
          <div class="block-title"><h2>各位置节奏表</h2><span class="line"></span><span class="n">TIMELINE</span></div>
          <div class="role-tabs">
            ${m.timelines.map((t, i) => `<button class="chip role-tab ${i === 0 ? 'on' : ''}" data-role="${i}">${esc(t.role)}</button>`).join('')}
          </div>
          <div id="roleTL"></div>
        </div>

        <div class="block">
          <div class="block-title"><h2>情景训练</h2><span class="line"></span><span class="n">SCENARIO</span></div>
          <div class="scene-filter">
            ${['全部', '中路', '发育路', '打野', '对抗路', '游走'].map((r) => `<button class="chip scene-role ${sceneRole === r ? 'on' : ''}" data-sr="${r}">${r}</button>`).join('')}
          </div>
          <div id="sceneBox"></div>
        </div>

        <div class="sources">
          <b>参考</b>
          ${D.macro.sources.map((x) => `<a href="${x.u}" target="_blank" rel="noopener">${esc(x.t)}</a>`).join('')}
        </div>
      </section>
    </div>`;
  }

  function mapSvg(m) {
    const dot = (x, y, fill, label, cls) => `<g class="${cls || ''}">
      <circle cx="${x}" cy="${y}" r="20" fill="${fill}" stroke="rgba(8,10,14,.85)" stroke-width="2.5"/>
      <circle cx="${x}" cy="${y}" r="20" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="13" fill="#12141a" font-weight="700">${label}</text>
    </g>`;
    return `<svg viewBox="0 0 800 520" class="mmap" role="img" aria-label="战场示意图">
      <defs>
        <linearGradient id="mapbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0d1620"/><stop offset="1" stop-color="#0a0f16"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="rgba(227,181,102,.35)"/><stop offset="1" stop-color="rgba(227,181,102,0)"/>
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="520" rx="22" fill="url(#mapbg)"/>
      <rect x="8" y="8" width="784" height="504" rx="18" fill="none" stroke="rgba(255,255,255,.06)"/>

      <!-- 野区 -->
      <ellipse cx="270" cy="205" rx="130" ry="78" fill="rgba(84,140,104,.10)"/>
      <ellipse cx="540" cy="330" rx="130" ry="78" fill="rgba(84,140,104,.10)"/>
      <text x="228" y="205" font-size="11" fill="rgba(140,190,160,.45)">我方野区</text>
      <text x="520" y="334" font-size="11" fill="rgba(190,150,140,.45)">敌方野区</text>

      <!-- 河道 -->
      <line x1="292" y1="152" x2="508" y2="368" stroke="rgba(70,130,200,.13)" stroke-width="70" stroke-linecap="round"/>
      <line x1="300" y1="160" x2="500" y2="360" stroke="rgba(110,170,230,.22)" stroke-width="2" stroke-dasharray="7 9"/>

      <!-- 三路 -->
      <path d="M100 420 L100 100 L700 100" fill="none" stroke="rgba(255,255,255,.09)" stroke-width="22" stroke-linecap="round"/>
      <path d="M100 420 L700 420 L700 100" fill="none" stroke="rgba(255,255,255,.09)" stroke-width="22" stroke-linecap="round"/>
      <path d="M100 420 L700 100" fill="none" stroke="rgba(255,255,255,.13)" stroke-width="22" stroke-linecap="round"/>

      <!-- 基地 -->
      <circle cx="100" cy="420" r="34" fill="rgba(91,143,214,.16)"/>
      <circle cx="100" cy="420" r="24" fill="rgba(91,143,214,.42)" stroke="#5b8fd6" stroke-width="2"/>
      <circle cx="700" cy="100" r="34" fill="rgba(217,106,106,.14)"/>
      <circle cx="700" cy="100" r="24" fill="rgba(217,106,106,.38)" stroke="#d96a6a" stroke-width="2"/>
      <text x="100" y="476" text-anchor="middle" font-size="12" fill="#7fa9de">我方基地</text>
      <text x="700" y="52" text-anchor="middle" font-size="12" fill="#e08b8b">敌方基地</text>

      <!-- 路名 -->
      <text x="120" y="86" font-size="12" fill="rgba(255,255,255,.42)" letter-spacing="2">对抗路</text>
      <text x="452" y="228" font-size="12" fill="rgba(255,255,255,.5)" letter-spacing="2">中路</text>
      <text x="232" y="410" font-size="12" fill="rgba(255,255,255,.42)" letter-spacing="2">发育路</text>

      ${m.obj ? `<circle cx="${m.obj[0]}" cy="${m.obj[1]}" r="26" fill="url(#glow)"/>
        <rect x="${m.obj[0] - 9}" y="${m.obj[1] - 9}" width="18" height="18" transform="rotate(45 ${m.obj[0]} ${m.obj[1]})" fill="rgba(227,181,102,.55)" stroke="#e3b566" stroke-width="1.5"/>
        <text x="${m.obj[0]}" y="${m.obj[1] + 34}" text-anchor="middle" font-size="11" fill="#e3b566">${esc(m.obj[2])}</text>` : ''}
      ${(m.wave || []).map((w) => `<circle cx="${w[0]}" cy="${w[1]}" r="5.5" fill="rgba(255,255,255,.6)"/><circle cx="${w[0]}" cy="${w[1]}" r="9" fill="none" stroke="rgba(255,255,255,.18)"/>`).join('')}
      ${(m.allies || []).map((a) => dot(a[0], a[1], '#5b8fd6', esc(a[2].slice(0, 1)), 'ally')).join('')}
      ${(m.enemies || []).map((e) => dot(e[0], e[1], '#d96a6a', esc(e[2].slice(0, 1)), 'enemy')).join('')}
      ${dot(m.you[0], m.you[1], '#e3b566', '你', 'me')}
    </svg>`;
  }

  function scenesForRole() {
    return sceneRole === '全部' ? D.macro.scenarios : D.macro.scenarios.filter((x) => x.role.indexOf(sceneRole) === 0);
  }

  function renderScene() {
    const box = $('#sceneBox');
    if (!box) return;
    const list = scenesForRole();
    if (!sceneRun.started) {
      box.innerHTML = `<div class="quiz-intro">
        <div class="qi-num">${list.length}</div>
        <div><h3>情景训练</h3><p>给你一个真实场面：位置、兵线、视野都标在图上。选出你下一步会做的事，系统会告诉你后果。</p>
        <button class="btn primary" id="sceneStart">开始训练</button></div>
      </div>`;
      $('#sceneStart').addEventListener('click', () => { sceneRun.started = true; renderScene(); });
      return;
    }
    if (sceneRun.i >= list.length) {
      const total = list.length;
      box.innerHTML = `<div class="scene-result">
        <div class="qr-score">${sceneRun.score} <span>/ ${total}</span></div>
        <p class="qr-tip">${sceneRun.score >= 6 ? '节奏感不错。' : '建议把上面的判断框架再看一遍。'}</p>
        <div class="qr-wrong"><h4>需要复习的规则</h4>
          ${(sceneRun.wrong.length ? sceneRun.wrong : list.filter((x) => false)).map((w) => `<div class="qr-item"><b>${esc(w.rule)}</b><p>${esc(w.title)}</p></div>`).join('') || '<p class="muted">全部答对，没有需要复习的。</p>'}
        </div>
        <div class="qr-actions">
          <button class="btn primary" id="sceneRetry">再练一次</button>
          <a class="btn" href="#/builds">去看出装路线</a>
        </div>
      </div>`;
      $('#sceneRetry').addEventListener('click', () => { sceneRun.i = 0; sceneRun.score = 0; sceneRun.wrong = []; sceneRun.answered = false; sceneRun.started = false; renderScene(); });
      return;
    }
    const sc = list[sceneRun.i];
    box.innerHTML = `<div class="scene-card">
      <div class="scene-bar"><span style="width:${((sceneRun.i + 1) / list.length) * 100}%"></span></div>
      <div class="scene-meta">第 ${sceneRun.i + 1} / ${list.length} 题 · ${esc(sc.role)}</div>
      <div class="scene-map">${mapSvg(sc.map)}
        <div class="map-legend"><span><i class="lg-me"></i>你</span><span><i class="lg-ally"></i>队友</span><span><i class="lg-enemy"></i>敌人</span><span><i class="lg-wave"></i>兵线</span>${sc.map.obj ? '<span><i class="lg-obj"></i>资源点</span>' : ''}</div>
      </div>
      <h3 class="scene-q">${esc(sc.q)}</h3>
      <div class="scene-opts">
        ${sc.options.map((o, i) => `<button class="scene-opt" data-i="${i}"><span class="oi">${'ABC'[i]}</span>${esc(o.t)}</button>`).join('')}
      </div>
      <div id="sceneFb"></div>
    </div>`;
    $$('.scene-opt', box).forEach((b) => b.addEventListener('click', () => answerScene(Number(b.dataset.i))));
  }

  function answerScene(i) {
    if (sceneRun.answered) return;
    sceneRun.answered = true;
    const sc = D.macro.scenarios[sceneRun.i];
    const ok = !!sc.options[i].ok;
    $$('.scene-opt').forEach((b, idx) => {
      b.classList.add('done');
      if (sc.options[idx].ok) b.classList.add('right');
      if (idx === i && !ok) b.classList.add('wrong');
    });
    if (ok) sceneRun.score += 1; else sceneRun.wrong.push(sc);
    const fb = $('#sceneFb');
    fb.innerHTML = `<div class="fb-box ${ok ? 'ok' : 'no'}">
      <b>${ok ? '判断正确' : '这个选择会亏'}</b>
      <p>${esc(sc.options[i].why)}</p>
      <p class="fb-rule">记住这条：<b>${esc(sc.rule)}</b></p>
      <button class="btn primary" id="sceneNext">${sceneRun.i + 1 >= D.macro.scenarios.length ? '看结果' : '下一题'}</button>
    </div>`;
    $('#sceneNext').addEventListener('click', () => { sceneRun.i += 1; sceneRun.answered = false; renderScene(); });
  }

  function bindMacro() {
    renderTL(0);
    $$('.scene-role').forEach((b) => b.addEventListener('click', () => {
      sceneRole = b.dataset.sr;
      $$('.scene-role').forEach((x) => x.classList.toggle('on', x === b));
      sceneRun.i = 0; sceneRun.score = 0; sceneRun.wrong = []; sceneRun.answered = false; sceneRun.started = false;
      renderScene();
    }));
    $$('.role-tab').forEach((b) => b.addEventListener('click', () => {
      $$('.role-tab').forEach((x) => x.classList.toggle('on', x === b));
      renderTL(Number(b.dataset.role));
    }));
    sceneRun.i = 0; sceneRun.score = 0; sceneRun.wrong = []; sceneRun.answered = false; sceneRun.started = false;
    renderScene();
  }

  function renderTL(idx) {
    const t = D.macro.timelines[idx];
    const g = D.macro.roleGuides[t.role] || null;
    const el = $('#roleTL');
    if (!el) return;
    el.innerHTML = `
      ${g ? `<div class="guide">
        <p class="guide-duty">${esc(g.duty)}</p>
        <div class="guide-cols">
          <div class="gc"><h4>三个关键判断</h4><ul>${g.keys.map((k) => `<li>${esc(k)}</li>`).join('')}</ul></div>
          <div class="gc bad"><h4>常见误区</h4><ul>${g.mistakes.map((k) => `<li>${esc(k)}</li>`).join('')}</ul></div>
        </div>
      </div>` : ''}
      <div class="tl-list">${t.phases.map((p) => `<div class="tl-row">
        <span class="tl-time">${esc(p.t)}</span>
        <div class="tl-body"><b>${esc(p.do)}</b><em>别做：${esc(p.dont)}</em></div>
      </div>`).join('')}</div>`;
  }

  /* ---------------- 搜索 ---------------- */
  const IDX = [];
  D.heroes.forEach((h) => IDX.push({
    group: '英雄', label: h.name, sub: `${h.type} · ${h.lanes.join(' / ')}`, href: `#/hero/${h.id}`,
    img: heroImg(h.id), keys: [h.name, h.title, h.py, h.initials, ...(h.alias || [])].map((x) => String(x).toLowerCase()),
  }));
  D.items.forEach((i) => IDX.push({
    group: '装备', label: i.name, sub: `${i.cat} · ${i.attrs}`, href: `#/item/${i.slug}`, img: i.icon,
    keys: [i.name, i.cat, i.py, ...(i.alias || [])].map((x) => String(x).toLowerCase()),
  }));
  D.macro.scenarios.forEach((sc) => IDX.push({
    group: '意识课', label: sc.title, sub: sc.role, href: '#/macro',
    keys: [sc.title, sc.role, sc.rule].map((x) => String(x).toLowerCase()),
  }));
  D.basics.forEach((b) => IDX.push({
    group: '基础课', label: b.title, sub: b.sub, href: `#/basics/${b.id}`,
    keys: [b.title, b.sub].map((x) => String(x).toLowerCase()),
  }));
  D.glossary.forEach((g) => IDX.push({
    group: '术语', label: g.t, sub: g.d, href: `#/terms`,
    keys: [g.t, g.d].map((x) => String(x).toLowerCase()),
  }));

  const modal = $('#searchModal');
  const input = $('#searchInput');
  let results = [], active = 0;

  function score(item, q) {
    let best = 0;
    for (const k of item.keys) {
      if (!k) continue;
      if (k === q) best = Math.max(best, 100);
      else if (k.startsWith(q)) best = Math.max(best, 80);
      else if (k.includes(q)) best = Math.max(best, 55);
      else if (q.length > 1 && k[0] === q[0]) best = Math.max(best, 10);
    }
    return best;
  }

  function doSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) {
      results = [
        ...D.heroes.filter((h) => h.featured).slice(0, 4).map((h) => ({ group: '英雄', label: h.name, sub: h.one, href: `#/hero/${h.id}`, img: heroImg(h.id) })),
        ...D.items.slice(0, 3).map((i) => ({ group: '装备', label: i.name, sub: i.attrs, href: `#/item/${i.slug}` })),
      ];
      active = 0; paintSearch(); return;
    }
    results = IDX.map((x) => ({ x, s: score(x, q) })).filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s).slice(0, 18).map((r) => r.x);
    active = 0;
    paintSearch();
  }

  function paintSearch() {
    const box = $('#searchResults');
    if (!results.length) { box.innerHTML = '<div class="sr-empty">没搜到。试试英雄名、装备名，或者「越塔」这种术语。</div>'; return; }
    const groups = {};
    results.forEach((r, i) => { (groups[r.group] = groups[r.group] || []).push({ ...r, i }); });
    box.innerHTML = Object.keys(groups).map((g) => `<div class="sr-group"><h5>${g}</h5>${groups[g].map((r) => `
      <div class="sr-item ${r.i === active ? 'on' : ''}" data-i="${r.i}" data-href="${r.href}">
        <span class="av">${r.img ? `<img src="${r.img}" alt="">` : '◆'}</span>
        <span class="tx"><b>${esc(r.label)}</b><span>${esc(r.sub || '')}</span></span>
        <span class="k">↵</span>
      </div>`).join('')}</div>`).join('');
    $$('.sr-item', box).forEach((el) => {
      el.addEventListener('mouseenter', () => { active = +el.dataset.i; highlight(); });
      el.addEventListener('click', () => { closeSearch(); go(el.dataset.href); });
    });
  }

  function highlight() { $$('.sr-item').forEach((el) => el.classList.toggle('on', +el.dataset.i === active)); }

  function openSearch() {
    modal.hidden = false;
    document.body.classList.add('lock');
    input.value = '';
    doSearch('');
    setTimeout(() => input.focus(), 30);
  }
  function closeSearch() {
    modal.hidden = true;
    document.body.classList.remove('lock');
  }

  function bindSearch() {
    $('#searchTrigger').addEventListener('click', openSearch);
    modal.addEventListener('click', (e) => { if (e.target.closest('[data-close-search]')) closeSearch(); });
    input.addEventListener('input', () => doSearch(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, results.length - 1); highlight(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); highlight(); }
      else if (e.key === 'Enter') { const r = results[active]; if (r) { closeSearch(); go(r.href); } }
      else if (e.key === 'Escape') closeSearch();
    });
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); modal.hidden ? openSearch() : closeSearch(); }
      if (e.key === 'Escape' && !modal.hidden) closeSearch();
    });
  }

  /* ---------------- 交互绑定 ---------------- */
  function observeReveal() {
    const els = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '120px 0px -6% 0px', threshold: 0.04 });
    els.forEach((e) => io.observe(e));
    // 兜底：万一观察器没触发（极旧浏览器 / 快速跳转），3 秒后全部显示
    clearTimeout(window.__revealTimer);
    window.__revealTimer = setTimeout(() => els.forEach((e) => e.classList.add('in')), 3000);
  }

  function bindHeroPage() {
    $$('.skill-h').forEach((btn) => btn.addEventListener('click', () => btn.closest('.skill').classList.toggle('open')));

    requestAnimationFrame(() => $$('.bar .fill').forEach((f) => { f.style.width = f.dataset.w + '%'; }));

    // 锚点平滑滚动 + 高亮
    $$('#subnav a').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const t = $(a.getAttribute('href'));
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 108, behavior: 'smooth' });
    }));
    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            $$('#subnav a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
          }
        });
      }, { rootMargin: '-120px 0px -65% 0px' });
      $$('.block').forEach((b) => spy.observe(b));
    }
    const qt = $('#quickToggle');
    if (qt && !qt.dataset.bound) {
      qt.dataset.bound = '1';
      qt.addEventListener('click', () => {
        document.body.classList.add('quick');
        window.scrollTo({ top: 0 });
        const exit = $('#quickExit');
        if (exit) exit.addEventListener('click', () => document.body.classList.remove('quick'));
      });
    }
  }

  function bindBasics() {
    const bar = $('#readProgress');
    if (!bar) return;
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      bar.style.width = Math.min(100, Math.max(0, p * 100)) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const quizState = { lane: '', style: '' };
  function bindQuiz() {
    const root = $('#quiz');
    if (!root) return;
    const step1 = $('.quiz-step[data-step="1"]', root);
    const step2 = $('.quiz-step[data-step="2"]', root);
    const out = $('#quizResult');
    const STYLE_TYPES = { melee: ['战士', '坦克', '刺客'], ranged: ['射手', '法师'], support: ['辅助', '坦克'] };
    function result() {
      let pool = D.heroes.filter((h) => h.featured && h.lanes.includes(quizState.lane));
      const byStyle = pool.filter((h) => STYLE_TYPES[quizState.style].includes(h.type));
      if (byStyle.length) pool = byStyle;
      pool = pool.slice(0, 2);
      if (!pool.length) pool = D.heroes.filter((h) => h.featured).slice(0, 2);
      out.innerHTML = `<div class="quiz-pick">推荐你练这两个：</div><div class="hero-grid quiz-grid">${pool.map(heroCard).join('')}</div>`;
      observeReveal();
    }
    $$('.chip[data-lane]', root).forEach((b) => b.addEventListener('click', () => {
      quizState.lane = b.dataset.lane;
      step1.querySelectorAll('.chip').forEach((x) => x.classList.toggle('on', x === b));
      step2.hidden = false;
      step2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }));
    $$('.chip[data-style]', root).forEach((b) => b.addEventListener('click', () => {
      quizState.style = b.dataset.style;
      step2.querySelectorAll('.chip').forEach((x) => x.classList.toggle('on', x === b));
      result();
    }));
  }

  function afterRender(view, seg) {
    observeReveal();
    if (view === 'heroes') {
      paintHeroes();
      $$('.filters .chip[data-type]').forEach((b) => b.addEventListener('click', () => {
        heroState.type = b.dataset.type; $$('.filters .chip[data-type]').forEach((x) => x.classList.toggle('on', x === b)); paintHeroes();
      }));
      $$('.filters .chip[data-lane]').forEach((b) => b.addEventListener('click', () => {
        heroState.lane = b.dataset.lane; $$('.filters .chip[data-lane]').forEach((x) => x.classList.toggle('on', x === b)); paintHeroes();
      }));
      $$('.filters .chip[data-only]').forEach((b) => b.addEventListener('click', () => {
        heroState.onlyFeatured = !heroState.onlyFeatured; b.classList.toggle('on'); paintHeroes();
      }));
      const q = $('#heroQ');
      if (q) q.addEventListener('input', () => { heroState.q = q.value; paintHeroes(); });
    }
    if (view === 'hero') bindHeroPage();
    if (view === 'items') {
      paintItems();
      $$('.cat-tabs .chip').forEach((b) => b.addEventListener('click', () => {
        itemState.cat = b.dataset.cat; $$('.cat-tabs .chip').forEach((x) => x.classList.toggle('on', x === b)); paintItems();
      }));
      bindDecider();
    }
    if (view === 'terms') bindTerms();
    if (view === 'build') bindBuild();
    if (view === 'quiz') bindQuizPage();
    if (view === 'macro') bindMacro();
    if (view === 'home' || view === 'heroes') bindQuiz();
    if (view === 'basics' && seg[1]) bindBasics();
    const homeSearch = $('#homeSearch');
    if (homeSearch) homeSearch.addEventListener('click', openSearch);
  }

  /* ---------------- 资源版本（排查缓存用） ---------------- */
  try {
    const src = ($('script[src*="app.js"]') || {}).src || '';
    const v = (src.match(/[?&]v=([0-9A-Za-z]+)/) || [])[1];
    const el = document.getElementById('assetVer');
    if (el && v) el.textContent = ' · 资源版本 ' + v;
  } catch (e) {}

  /* ---------------- 悬浮导航抽屉 ---------------- */
  function collectTOC() {
    const nodes = $$('.view h2').filter((h) => !h.closest('.quick-panel'));
    const items = [];
    nodes.forEach((h, i) => {
      if (!h.id) h.id = 'toc-' + i;
      const t = h.innerText.trim();
      if (t) items.push({ id: h.id, t });
    });
    return items;
  }

  function openDrawer() {
    const drawer = $('#drawer');
    if (!drawer) return;
    const toc = collectTOC();
    const cur = parseHash()[0] || 'home';
    const links = [
      ['#/', '首页', 'home'], ['#/heroes', '英雄图鉴', 'heroes'], ['#/items', '装备图鉴', 'items'],
      ['#/builds', '出装路线', 'builds'], ['#/macro', '意识课', 'macro'], ['#/quiz', '出装自测', 'quiz'],
      ['#/basics', '基础课', 'basics'], ['#/terms', '术语词典', 'terms'],
    ];
    $('#drawerBody').innerHTML = `
      <button class="dw-back" id="dwBack">← 返回上一页</button>
      ${toc.length ? `<div class="dw-sec"><h5>本页目录</h5>${toc.map((x) => `<a href="#${x.id}" data-toc="${x.id}">${esc(x.t)}</a>`).join('')}</div>` : ''}
      <div class="dw-sec"><h5>去别的页面</h5>${links.map(([href, t, key]) => `<a href="${href}" class="${cur === key ? 'cur' : ''}">${t}</a>`).join('')}</div>`;
    drawer.hidden = false;
    document.body.classList.add('lock');
    $('#dwBack').addEventListener('click', () => {
      closeDrawer();
      if (history.length > 1) history.back(); else go('#/');
    });
    $$('#drawerBody [data-toc]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      const target = document.getElementById(a.dataset.toc);
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }));
    $$('#drawerBody a[href^="#/"]').forEach((a) => a.addEventListener('click', () => closeDrawer()));
  }

  function closeDrawer() {
    const drawer = $('#drawer');
    if (!drawer) return;
    drawer.hidden = true;
    document.body.classList.remove('lock');
  }

  function bindDrawer() {
    const fab = $('#fabNav');
    if (!fab) return;
    fab.addEventListener('click', openDrawer);
    $('#drawer').addEventListener('click', (e) => { if (e.target.closest('[data-close-drawer]')) closeDrawer(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  }

  /* ---------------- 启动 ---------------- */
  window.addEventListener('hashchange', render);
  bindSearch();
  bindDrawer();
  if (!location.hash) location.hash = '#/';
  render();
})();
