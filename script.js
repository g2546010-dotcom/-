/* =================================
   ELEMENTS
================================= */
const tutorial = document.getElementById("tutorial");
const tutorialMessage = document.getElementById("tutorial-message");
const tapGuide = document.getElementById("tap-guide");

const musicScreen = document.getElementById("music-screen");
const oceanScreen = document.getElementById("ocean-screen");

const chooseMusicButton = document.getElementById("choose-music-button");
const musicFile = document.getElementById("music-file");
const musicPlayer = document.getElementById("music-player");

const albumCover = document.getElementById("album-cover");
const songName = document.getElementById("selected-song-name");
const particles = document.getElementById("particles");
const lightOrb = document.getElementById("light-orb");
const creature = document.getElementById("creature");
const birthMessage = document.getElementById("birth-message");
const feedMessage = document.getElementById("feed-message");
const oceanGrowth = document.getElementById("ocean-growth");

const oceanTutorial = document.getElementById("ocean-tutorial");
const oceanTutorialMessage = document.getElementById("ocean-tutorial-message");
const oceanTutorialGuide = document.getElementById("ocean-tutorial-guide");
const oceanIntro = document.getElementById("ocean-intro");
const exploreOceanButton = document.getElementById("explore-ocean-button");

const menuButton = document.getElementById("menu-button");
const menuPanel = document.getElementById("menu-panel");
const feedMusicButton = document.getElementById("feed-music-button");
const closeMenuButton = document.getElementById("close-menu-button");

let tutorialStep = 0;
let oceanTutorialStep = 0;
let currentAudioURL = null;
let currentArtworkURL = null;
let hasFirstLife = false;
let hasShownOceanIntro = false;
let oceanGrowthStage = 0;

/* =================================
   FIRST TUTORIAL
================================= */
const tutorialMessages = [
  "まだ、ここは静かです。",
  "新たな生命を、誕生させましょう。"
];

tutorial.addEventListener("click", () => {
  if (tutorialStep === 0) {
    tutorialStep = 1;
    tutorialMessage.classList.add("fade-out");
    tapGuide.classList.add("fade-out");

    window.setTimeout(() => {
      tutorialMessage.textContent = tutorialMessages[1];
      tutorialMessage.classList.remove("fade-out");
      tapGuide.classList.remove("fade-out");
      tutorialMessage.style.animation = "fadeIn 2s forwards";
      tapGuide.style.animation = "fadeIn 2s 1s both";
    }, 900);
  } else if (tutorialStep === 1) {
    tutorialStep = 2;
    tutorial.classList.add("fade-out");
    window.setTimeout(() => {
      tutorial.classList.add("hidden");
      musicScreen.classList.remove("hidden");
    }, 900);
  }
});

/* =================================
   MUSIC FILE
================================= */
chooseMusicButton.addEventListener("click", () => musicFile.click());

feedMusicButton.addEventListener("click", () => {
  // 餌やりを選んだときは紹介画面を挟まず、そのまま音楽を選べるようにする
  menuPanel.classList.add("hidden");
  menuButton.classList.remove("hidden");
  musicFile.click();
});

musicFile.addEventListener("change", () => {
  const file = musicFile.files && musicFile.files[0];
  if (!file) return;

  // 過去の結晶からも曲を再生できるよう、音声URLは破棄せずに残す
  currentAudioURL = URL.createObjectURL(file);
  musicPlayer.src = currentAudioURL;
  songName.textContent = file.name;

  loadArtwork(file, () => {
    if (!hasFirstLife) {
      startBirthSequence();
    } else {
      feedCreature();
    }
  });
});

function loadArtwork(file, done) {
  currentArtworkURL = null;
  albumCover.style.backgroundImage =
    "radial-gradient(circle, #b9edff, #326d9d, #07182c)";
  albumCover.innerHTML = "<p>YOUR MUSIC</p>";

  if (!window.jsmediatags) {
    done();
    return;
  }

  window.jsmediatags.read(file, {
    onSuccess: (result) => {
      const tags = result.tags || {};
      const picture = tags.picture;

      if (tags.title) {
        songName.textContent = tags.title + (tags.artist ? " / " + tags.artist : "");
      }

      if (picture) {
        const bytes = new Uint8Array(picture.data);
        const blob = new Blob([bytes], { type: picture.format || "image/jpeg" });
        currentArtworkURL = URL.createObjectURL(blob);
        albumCover.style.backgroundImage = `url("${currentArtworkURL}")`;
        albumCover.innerHTML = "";
      }
      done();
    },
    onError: (error) => {
      console.info("ジャケット情報を取得できませんでした。", error);
      done();
    }
  });
}


/* =================================
   BIRTH SEQUENCE
================================= */
function startBirthSequence() {
  hasFirstLife = true;
  musicScreen.classList.add("hidden");
  oceanScreen.classList.remove("hidden");

  playCurrentMusic();
  createParticles();

  lightOrb.classList.remove("is-falling");
  void lightOrb.offsetWidth;
  lightOrb.classList.add("is-falling");

  window.setTimeout(() => {
    lightOrb.style.opacity = "0";
    creature.classList.add("is-born");
  }, 4000);

  window.setTimeout(() => {
    birthMessage.classList.add("is-visible");
    window.setTimeout(() => {
      birthMessage.classList.remove("is-visible");
      startOceanTutorial();
    }, 2500);
  }, 5500);
}

function playCurrentMusic() {
  musicPlayer.play().catch((error) => {
    console.info("自動再生できませんでした。再生ボタンを押してください。", error);
  });
}

function createParticles() {
  particles.innerHTML = "";
  for (let i = 0; i < 35; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.setProperty("--x", `${(Math.random() - 0.5) * 500}px`);
    particle.style.setProperty("--y", `${350 + Math.random() * 350}px`);
    particle.style.setProperty("--size", `${2 + Math.random() * 5}px`);
    particle.style.setProperty("--delay", `${Math.random() * 1.5}s`);
    particle.style.setProperty("--duration", `${2.5 + Math.random() * 2}s`);
    particles.appendChild(particle);
  }
}

/* =================================
   OCEAN TUTORIAL
================================= */
const oceanMessages = [
  "おめでとうございます！<br>深海に新たな生命が誕生しました！",
  "次は、餌を与えてみましょう。",
  "まずは、メニューを開いてみましょう。"
];

function startOceanTutorial() {
  oceanTutorialStep = 0;
  oceanTutorial.classList.remove("hidden");
  oceanTutorial.style.pointerEvents = "auto";
  oceanTutorialGuide.textContent = "TAP ANYWHERE";
  showOceanMessage(oceanMessages[0]);
}

function showOceanMessage(message) {
  oceanTutorialMessage.innerHTML = message;
  oceanTutorialMessage.style.animation = "none";
  void oceanTutorialMessage.offsetHeight;
  oceanTutorialMessage.style.animation = "fadeIn 1.5s forwards";
}

oceanTutorial.addEventListener("click", () => {
  if (oceanTutorialStep === 0) {
    oceanTutorialStep = 1;
    showOceanMessage(oceanMessages[1]);
  } else if (oceanTutorialStep === 1) {
    oceanTutorialStep = 2;
    showOceanMessage(oceanMessages[2]);
    oceanTutorialGuide.textContent = "OPEN THE MENU";
    menuButton.classList.remove("hidden");
    menuButton.classList.add("highlight");

    // ここから先はチュートリアルの透明な領域がクリックを遮らない
    oceanTutorial.style.pointerEvents = "none";
  }
});

/* =================================
   MENU
================================= */
menuButton.addEventListener("click", (event) => {
  event.stopPropagation();
  oceanTutorial.classList.add("hidden");
  menuButton.classList.add("hidden");
  menuButton.classList.remove("highlight");
  menuPanel.classList.remove("hidden");
});

function closeMenu() {
  menuPanel.classList.add("hidden");

  // チュートリアル後、最初にメニューを閉じたときだけ紹介画面を表示
  if (hasFirstLife && !hasShownOceanIntro) {
    showOceanIntro();
  } else {
    menuButton.classList.remove("hidden");
  }
}

function showOceanIntro() {
  hasShownOceanIntro = true;
  menuButton.classList.add("hidden");
  oceanIntro.classList.remove("hidden");
}

exploreOceanButton.addEventListener("click", () => {
  oceanIntro.classList.add("hidden");
  menuButton.classList.remove("hidden");
});

closeMenuButton.addEventListener("click", closeMenu);

/* =================================
   FEED THE CREATURE
================================= */
function feedCreature() {
  playCurrentMusic();
  createParticles();
  awakenOcean();
  evolveCreature();

  feedMessage.textContent = "A NEW SONG HAS REACHED THE DEEP";
  feedMessage.classList.remove("is-visible");
  void feedMessage.offsetWidth;
  feedMessage.classList.add("is-visible");

  creature.classList.remove("is-born");
  void creature.offsetWidth;
  creature.classList.add("is-born");
}


/* =================================
   OCEAN EVOLUTION
   音楽を餌として与えるたび、深海そのものが育つ
================================= */
function awakenOcean() {
  oceanGrowthStage += 1;
  oceanScreen.classList.add("ocean-awakened");
  oceanGrowth.classList.add("is-growing");

  // 最初の餌やりで海の色が変わり、サンゴが生まれる
  if (oceanGrowthStage === 1) {
    oceanScreen.classList.add("ocean-stage-1");
    growCoral();
  } else if (oceanGrowthStage === 2) {
    oceanScreen.classList.add("ocean-stage-2");
    growSeaPlants();
  } else {
    oceanScreen.classList.add("ocean-stage-3");
    growSeaPlants();
    addGlowMotes();
  }
}

// 餌として音楽を受け取るたび、生き物自身も少しずつ姿を変える
function evolveCreature() {
  creature.classList.remove("creature-evolved-1", "creature-evolved-2", "creature-evolved-3");
  const evolution = Math.min(oceanGrowthStage, 3);
  if (evolution > 0) {
    creature.classList.add(`creature-evolved-${evolution}`);
  }
}

function growCoral() {
  const positions = [
    { x: "13%", h: 115, delay: 0.1, hue: 0 },
    { x: "29%", h: 78, delay: 0.45, hue: 28 },
    { x: "72%", h: 95, delay: 0.25, hue: 185 },
    { x: "88%", h: 125, delay: 0.6, hue: 315 }
  ];
  positions.forEach((item) => {
    const coral = document.createElement("div");
    coral.className = "deep-coral";
    coral.style.setProperty("--coral-x", item.x);
    coral.style.setProperty("--coral-height", `${item.h}px`);
    coral.style.setProperty("--coral-delay", `${item.delay}s`);
    coral.style.setProperty("--coral-hue", item.hue);
    oceanGrowth.appendChild(coral);
  });
}

function growSeaPlants() {
  ["20%", "43%", "63%", "81%"].forEach((x, index) => {
    const plant = document.createElement("div");
    plant.className = "deep-plant";
    plant.style.setProperty("--plant-x", x);
    plant.style.setProperty("--plant-delay", `${index * 0.18}s`);
    oceanGrowth.appendChild(plant);
  });
}

function addGlowMotes() {
  for (let i = 0; i < 24; i++) {
    const mote = document.createElement("span");
    mote.className = "glow-mote";
    mote.style.setProperty("--mote-x", `${Math.random() * 100}%`);
    mote.style.setProperty("--mote-y", `${35 + Math.random() * 60}%`);
    mote.style.setProperty("--mote-delay", `${Math.random() * 3}s`);
    oceanGrowth.appendChild(mote);
  }
}
