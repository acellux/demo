const DEFAULT_TEAM_NAME = "DEFAULT_TEAM_NAME";
let currentTeamName = DEFAULT_TEAM_NAME;

function getTeamName() {
  return currentTeamName;
}

const TEAM_NAME_XSS_PATTERNS = [
  /<script/i,
  /alert\s*\(/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /javascript:/i,
  /<img/i,
  /<svg/i,
  /\beval\s*\(/i,
  /<iframe/i,
];

function showXSSCaughtModal() {
  document.getElementById("modalTitlebar").textContent =
    "🚨 nice_try.exe";
  document.getElementById("modalBody").innerHTML = `
<div class="loot-icon">(｀∀´)Ψ</div>
<div class="loot-name" style="font-size:.95rem;">CAUGHT YOU ♡</div>
<div class="loot-flavor">yeah, we know you tried it. every single CTF, someone tries the alert(1) in the name field. this textbox uses textContent, not innerHTML, so your payload's just... a really weird team name now lol. nice instinct though ☆ go ahead and try a real one on Challenge 4 instead 🗝️</div>
<button class="modal-close-btn" onclick="closeModal()">了解、本当の標的に行く (ok, going for the real target)</button>
`;
  document.getElementById("modalOverlay").classList.add("show");
}

function setTeamName(name) {
  const clean = (name || "").trim().replace(/^@+/, "");
  currentTeamName = clean.length > 0 ? clean : DEFAULT_TEAM_NAME;
  document.querySelectorAll(".team-name").forEach((el) => {
    el.textContent = currentTeamName;
  });
}

function submitTeamName() {
  const input = document.getElementById("teamNameInput");
  const raw = input.value;
  if (TEAM_NAME_XSS_PATTERNS.some((p) => p.test(raw))) {
    showXSSCaughtModal();
    input.value = "";
    return;
  }
  setTeamName(raw);
  document.getElementById("welcomeOverlay").classList.remove("show");
}

document
  .getElementById("teamNameInput")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitTeamName();
  });
document.getElementById("teamNameInput").addEventListener("focus", () => {
  document.querySelector(".team-input-row").classList.add("focused");
});
document.getElementById("teamNameInput").addEventListener("blur", () => {
  document.querySelector(".team-input-row").classList.remove("focused");
});

document.getElementById("welcomeOverlay").classList.add("show");
document.getElementById("teamNameInput").focus();

/* ════════════════════════════════════════════════
BGM PLAYER — plays your own audio files.

▶ HOW TO ADD YOUR MUSIC:
1. Drop your MP3/OGG files in the same folder as this HTML file.
2. List their filenames in the TRACKS array below (just the filename, e.g. "theme1.mp3").
3. Give each one a display name for the player UI.
════════════════════════════════════════════════ */

const TRACKS = [
  { name: "♪ track_1.mp3 ♪", src: "track1.mp3" },
  { name: "♪ track_2.mp3 ♪", src: "track2.mp3" },
  { name: "♪ track_3.mp3 ♪", src: "track3.mp3" },
];

let currentTrackIndex = 0;
let isPlaying = false;
const audioEl = new Audio();
audioEl.loop = true;
audioEl.volume = 0.35;

let vizTimer = null;

function loadTrack(i) {
  audioEl.src = TRACKS[i].src;
  document.getElementById("mpTrackname").textContent = TRACKS[i].name;
}

function animateViz() {
  const bars = document.querySelectorAll(".mp-bar");
  bars.forEach((b) => {
    b.style.height = 4 + Math.random() * 28 + "px";
  });
}

function startMusic() {
  loadTrack(currentTrackIndex);
  audioEl.play().catch(() => {
    document.getElementById("mpTrackname").textContent =
      "⚠ file not found — see comments in <script>";
  });
  isPlaying = true;
  document.getElementById("mpPlayBtn").textContent = "⏸";
  vizTimer = setInterval(animateViz, 140);
}

function stopMusic() {
  audioEl.pause();
  isPlaying = false;
  document.getElementById("mpPlayBtn").textContent = "▶";
  clearInterval(vizTimer);
  document.querySelectorAll(".mp-bar").forEach((b) => {
    b.style.height = "4px";
  });
}

function toggleMusic() {
  isPlaying ? stopMusic() : startMusic();
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % TRACKS.length;
  if (isPlaying) startMusic();
  else loadTrack(currentTrackIndex);
}
function prevTrack() {
  currentTrackIndex =
    (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
  if (isPlaying) startMusic();
  else loadTrack(currentTrackIndex);
}
function setVolume(v) {
  audioEl.volume = v / 100;
}
function closeMusicPlayer() {
  stopMusic();
  document.getElementById("musicPlayer").classList.add("hidden");
  document.getElementById("mpLauncher").classList.add("show");
}
function openMusicPlayer() {
  document.getElementById("musicPlayer").classList.remove("hidden");
  document.getElementById("mpLauncher").classList.remove("show");
}
function toggleMinimizePlayer() {
  closeMusicPlayer();
}

function closeUrlWindow() {
  document.getElementById("urlWindow").classList.add("hidden");
  document.getElementById("urlLauncher").classList.add("show");
}
function openUrlWindow() {
  document.getElementById("urlWindow").classList.remove("hidden");
  document.getElementById("urlLauncher").classList.remove("show");
}
function copyUrl() {
  const url = document.getElementById("urlDisplay").textContent.trim();
  const btn = document.querySelector(".url-copy-btn");
  const done = () => {
    const original = btn.textContent;
    btn.textContent = "♡ copied! ♡";
    setTimeout(() => {
      btn.textContent = original;
    }, 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(done).catch(() => {
      fallbackCopy(url, done);
    });
  } else {
    fallbackCopy(url, done);
  }
}
function fallbackCopy(text, cb) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    cb();
  } catch (e) {}
  document.body.removeChild(ta);
}

document.getElementById("mpTrackname").textContent = TRACKS[0].name;

const VALIDATION_TABLE = {
  1: "68801aa3c2a3508c108f573d809a633faae8dcce8da113f4c5985d842cfe902e",
  2: "f537336c28bb5b513c8113e3449582a584a4861830e7a14e42b2c34a3f442657",
  3: "a919c09d6e2c47ab5896d6127ee12c83afd06ce2832ab5ec1b286a83afef897d",
  4: "357a17de803ae9dad8f9509b267bcff036017b23595eb28ad62f2d71329bfa71",
};

async function digestText(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const POINTS = { 1: 100, 2: 200, 3: 300, 4: 500 };
const solved = { 1: false, 2: false, 3: false, 4: false };
let totalScore = 0;
let wrongStreak = { 1: 0, 2: 0, 3: 0, 4: 0 };

const LOOT_DATA = {
  1: {
    rarity: "COMMON",
    rclass: "r-common",
    icon: "🍪",
    name: "COOKIE CRUMBS",
    flavor:
      "a humble drop, but every run's gotta start somewhere ☆ your party's off to a solid start 🌷",
  },
  2: {
    rarity: "UNCOMMON",
    rclass: "r-uncommon",
    icon: "📼",
    name: "DEAD COMMENT TAPE",
    flavor:
      "found buried in plain sight! someone really should've cleaned this up before deploying 🎀",
  },
  3: {
    rarity: "RARE",
    rclass: "r-rare",
    icon: "🔐",
    name: "ENCODED MESSAGE SHARD",
    flavor:
      "decoded straight from the wild! @ネットエンジェル__143 definitely wanted this kept quiet ʚɞ",
  },
  4: {
    rarity: "★ SSR ★",
    rclass: "r-ssr",
    icon: "🗝️",
    name: "THE FINAL KEY",
    flavor:
      "SSR get!! you cracked the WAF before she did! @__TEAM__ wins this round 🏆💗",
  },
};

const WRONG_LINES = [
  "nope!! check the format FLAG{...} ☆",
  "hmm, not quite! try again (｡•́︿•̀｡)",
  "almost! ...maybe. keep looking 👀",
  "that's not it (´；ω；｀) one more try",
  "@ネットエンジェル__143 is somewhere out there acting smug rn 草草草",
];

function showLootModal(n, flagText) {
  const d = LOOT_DATA[n];
  const flavorText = d.flavor.replace("__TEAM__", getTeamName());
  document.getElementById("modalTitlebar").textContent =
    "🎁 loot_get.exe";
  document.getElementById("modalBody").innerHTML = `
<span class="loot-rarity ${d.rclass}">${d.rarity}</span><br>
<div class="loot-icon">${d.icon}</div>
<div class="loot-name">${d.name}</div>
<div class="loot-flagtext">${esc(flagText)}</div>
<div class="loot-flavor">${flavorText}</div>
<div class="loot-pts">+${POINTS[n]} PTS</div>
<button class="modal-close-btn" onclick="closeModal()">よっしゃ! (got it!)</button>
`;
  document.getElementById("modalOverlay").classList.add("show");
}

function showFailModal(n) {
  document.getElementById("modalTitlebar").textContent =
    "💀 access_denied.exe";
  document.getElementById("modalBody").innerHTML = `
<div class="loot-icon">🛑</div>
<div class="loot-name" style="font-size:.95rem;">ACCESS DENIED</div>
<div class="loot-flavor">that flag's not landing. ${WRONG_LINES[Math.floor(Math.random() * WRONG_LINES.length)]}</div>
<button class="modal-close-btn fail-btn" onclick="closeModal()">了解 (got it)</button>
`;
  document.getElementById("modalOverlay").classList.add("show");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("show");
}
document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target.id === "modalOverlay") closeModal();
});

async function checkFlag(n) {
  if (solved[n]) return;
  const input = document.getElementById("flag" + n);
  const msg = document.getElementById("msg" + n);
  const val = input.value.trim();
  const hash = await digestText(val.toUpperCase());
  if (hash === VALIDATION_TABLE[n]) {
    solved[n] = true;
    input.classList.add("correct");
    input.classList.remove("wrong");
    msg.textContent = "✓ correct!! +" + POINTS[n] + " pts ☆";
    msg.className = "flag-msg ok";
    const win = document.getElementById("ch" + n);
    win.classList.add("solved");
    win.querySelector(".win-titlebar").classList.add("solved");
    totalScore += POINTS[n];
    const count = Object.values(solved).filter(Boolean).length;
    document.getElementById("taskbarStatus").textContent =
      "🎀 flags found: " + count + "/4, score: " + totalScore;
    const heroLoot = document.getElementById("heroLootCount");
    if (heroLoot) heroLoot.textContent = count;
    showLootModal(n, val.toUpperCase());
    if (count === 4)
      setTimeout(() => {
        const c = document.getElementById("completionMsg");
        c.style.display = "block";
        c.scrollIntoView({ behavior: "smooth" });
      }, 700);
  } else {
    input.classList.add("wrong");
    input.classList.remove("correct");
    msg.textContent =
      "✗ " + WRONG_LINES[wrongStreak[n] % WRONG_LINES.length];
    msg.className = "flag-msg err";
    wrongStreak[n]++;
    setTimeout(() => input.classList.remove("wrong"), 400);
    if (wrongStreak[n] > 0 && wrongStreak[n] % 3 === 0) showFailModal(n);
  }
}

for (let i = 1; i <= 4; i++) {
  const el = document.getElementById("flag" + i);
  if (el)
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkFlag(i);
    });
}

function toggleHint(id) {
  document.getElementById(id).classList.toggle("open");
}

const DDL_PATTERNS = [
  /\bdrop\b/i,
  /\btruncate\b/i,
  /\bdelete\b\s+from/i,
  /\balter\b/i,
  /\bcreate\b/i,
  /\binsert\b\s+into/i,
];
const WAF_PATTERNS = [
  {
    re: /\bor\s+1\s*=\s*1/i,
    rule: "SQLI_TAUTOLOGY_001",
    msg: "classic wwww every scanner on earth tries this first. blocked.",
  },
  {
    re: /'\s*or\s*'1'\s*=\s*'1/i,
    rule: "SQLI_TAUTOLOGY_002",
    msg: "classic LOL every scanner on earth tries this first. blocked.",
  },
  {
    re: /\bor\b\s+['"\d]/i,
    rule: "SQLI_OR_CONDITION_001",
    msg: "OR-based condition detected. blocked ☆",
  },
  {
    re: /'\s+or\s+'/i,
    rule: "SQLI_OR_CONDITION_002",
    msg: "OR-based condition detected. blocked ☆",
  },
  {
    re: /\bunion\b.*\bselect\b/i,
    rule: "SQLI_UNION_001",
    msg: "UNION-based attempt. the WAF has seen this one before lol",
  },
  {
    re: /1\s*=\s*1/i,
    rule: "SQLI_TAUTOLOGY_003",
    msg: "tautology detected. try thinking less boolean.",
  },
  {
    re: /\bsleep\s*\(/i,
    rule: "SQLI_TIMING_001",
    msg: "time-based blind injection attempt. nope lol",
  },
  {
    re: /\bwaitfor\b/i,
    rule: "SQLI_TIMING_002",
    msg: "WAITFOR DELAY... wrong db engine, this is MySQL.",
  },
  {
    re: /\bbenchmark\s*\(/i,
    rule: "SQLI_TIMING_003",
    msg: "BENCHMARK timing attack detected. blocked.",
  },
  {
    re: /xp_/i,
    rule: "SQLI_EXEC_001",
    msg: "xp_ extended procedure, wrong database engine entirely lol",
  },
  {
    re: /\bexec\s*\(/i,
    rule: "SQLI_EXEC_002",
    msg: "EXEC attempt detected. blocked.",
  },
  {
    re: /\binto\s+outfile\b/i,
    rule: "SQLI_EXFIL_001",
    msg: "INTO OUTFILE... bold move tbh. blocked.",
  },
  {
    re: /\bload_file\s*\(/i,
    rule: "SQLI_EXFIL_002",
    msg: "LOAD_FILE detected. blocked.",
  },
  {
    re: /information_schema/i,
    rule: "SQLI_ENUM_001",
    msg: "schema enumeration attempt. blocked.",
  },
];
const XSS_PATTERNS = [
  /alert\s*\(/i,
  /<script/i,
  /javascript:/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /\beval\s*\(/i,
  /<img/i,
  /<svg/i,
];
const WEAK_PASSWORDS = [
  "password",
  "password1",
  "admin",
  "admin123",
  "123456",
  "letmein",
  "welcome",
  "qwerty",
  "abc123",
  "sora",
  "sorasaki",
  "143143",
  "kawaii",
];

const PORTAL_PAYLOAD = "RkxBR3sxNDNfU1NSX0dFVH0=";

function attemptLogin() {
  const user = document.getElementById("sqli_user").value;
  const pass = document.getElementById("sqli_pass").value;
  const result = document.getElementById("dbResult");
  const combined = user + " " + pass;
  result.style.display = "block";
  if (!user && !pass) {
    result.className = "db-result fail";
    result.innerHTML = "✗ fields required nano!";
    return;
  }
  if (DDL_PATTERNS.some((p) => p.test(combined))) {
    result.className = "db-result fail";
    result.innerHTML = "ナイス、けど残念！(nice try, but no)";
    return;
  }
  if (XSS_PATTERNS.some((p) => p.test(combined))) {
    result.className = "db-result waf";
    result.innerHTML = `<span class="waf-badge">WAF BLOCK</span><br>this isn't a browser vuln. no DOM for you to play with here lol<br><span style="font-size:.62rem;opacity:.7">rule: XSS_REFLECTION_001 · id: ${rid()}</span>`;
    return;
  }
  for (const { re, rule, msg } of WAF_PATTERNS) {
    if (re.test(user) || re.test(pass)) {
      result.className = "db-result waf";
      result.innerHTML = `<span class="waf-badge">WAF BLOCK</span><br>${msg}<br><span style="font-size:.62rem;opacity:.7">rule: ${rule} · id: ${rid()}</span>`;
      return;
    }
  }
  if (/'\s*--/.test(user)) {
    const q = `SELECT * FROM users WHERE username='${user}' AND password='${pass}'`;
    result.className = "db-result success";
    result.innerHTML = `<strong>⚠ authentication bypass successful!! ✧</strong><br><br><span style="font-size:.66rem;opacity:.75">executed: <code>${esc(q)}</code></span><br><br>✓ session granted, clearance level 5<br>✓ ledger access: unrestricted<br>✓ recovered credential: <strong>${atob(PORTAL_PAYLOAD)}</strong><br><br><span style="opacity:.6;font-size:.66rem">the password check got commented out of the query entirely. the WAF let it through because none of its banned keywords showed up. comment-based bypass is genuinely one of the oldest WAF evasion tricks there is LOL 💀</span>`;
    return;
  }
  if (
    /^(root|sa|postgres|dba|oracle|mysql|admin)$/i.test(user.trim()) &&
    !pass
  ) {
    result.className = "db-result fail";
    result.innerHTML =
      "✗ authentication failed: account not found in this system";
    return;
  }
  if (
    /^admin$/i.test(user.trim()) &&
    WEAK_PASSWORDS.includes(pass.toLowerCase())
  ) {
    result.className = "db-result fail";
    result.innerHTML =
      '✗ authentication failed: incorrect password<br><span style="font-size:.62rem;opacity:.6">[ account exists. that\'s not the password though lol ]</span>';
    return;
  }
  if (user.includes("'") || pass.includes("'")) {
    result.className = "db-result fail";
    result.innerHTML =
      '✗ authentication failed<br><span style="font-size:.62rem;opacity:.6">[ interesting input. keep thinking ☆ ]</span>';
    return;
  }
  result.className = "db-result fail";
  result.innerHTML = "✗ authentication failed: invalid credentials";
}

function rid() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
document.getElementById("sqli_pass").addEventListener("keydown", (e) => {
  if (e.key === "Enter") attemptLogin();
});
function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function updateClock() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  document.getElementById("taskbarClock").textContent =
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds());
}
updateClock();
setInterval(updateClock, 1000);
