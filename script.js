//定義データ
const SORT_TABLE = {//正しい分別先の初期値
  "魚の骨": {
    "ふつうごみ": true,
    "しげんごみ": false,
    "プラスチックしげん": false,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "靴": {
    "ふつうごみ": true,
    "しげんごみ": false,
    "プラスチックしげん": false,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "皿": {
    "ふつうごみ": true,
    "しげんごみ": false,
    "プラスチックしげん": false,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "クッション": {
    "ふつうごみ": true,
    "しげんごみ": false,
    "プラスチックしげん": false,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "メガネ": {
    "ふつうごみ": true,
    "しげんごみ": false,
    "プラスチックしげん": false,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "缶": {
    "ふつうごみ": false,
    "しげんごみ": true,
    "プラスチックしげん": false,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "ビン": {
    "ふつうごみ": false,
    "しげんごみ": true,
    "プラスチックしげん": false,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "ペットボトル": {
    "ふつうごみ": false,
    "しげんごみ": true,
    "プラスチックしげん": false,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "カップ麺の容器": {
    "ふつうごみ": false,
    "しげんごみ": false,
    "プラスチックしげん": true,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "パック": {
    "ふつうごみ": false,
    "しげんごみ": false,
    "プラスチックしげん": true,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "タッパー": {
    "ふつうごみ": false,
    "しげんごみ": false,
    "プラスチックしげん": true,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "ペットボトルのキャップ": {
    "ふつうごみ": false,
    "しげんごみ": false,
    "プラスチックしげん": true,
    "かみ・ふく": false,
    "バッテリーるい": false
  },
  "新聞紙": {
    "ふつうごみ": false,
    "しげんごみ": false,
    "プラスチックしげん": false,
    "かみ・ふく": true,
    "バッテリーるい": false
  },
  "段ボール": {
    "ふつうごみ": false,
    "しげんごみ": false,
    "プラスチックしげん": false,
    "かみ・ふく": true,
    "バッテリーるい": false
  },
  "紙パック": {
    "ふつうごみ": false,
    "しげんごみ": false,
    "プラスチックしげん": false,
    "かみ・ふく": true,
    "バッテリーるい": false
  },
  "衣類": {
    "ふつうごみ": false,
    "しげんごみ": false,
    "プラスチックしげん": false,
    "かみ・ふく": true,
    "バッテリーるい": false
  },
  "バッテリー": {
    "ふつうごみ": false,
    "しげんごみ": false,
    "プラスチックしげん": false,
    "かみ・ふく": false,
    "バッテリーるい": true
  },
  "ハンディファン": {
    "ふつうごみ": false,
    "しげんごみ": false,
    "プラスチックしげん": false,
    "かみ・ふく": false,
    "バッテリーるい": true
  },

};

(() => {
  const savedSortTable = localStorage.getItem("sortTable");
  if (!savedSortTable) return;

  try {
    const parsed = JSON.parse(savedSortTable);
    Object.keys(parsed).forEach(itemName => {
      if (!SORT_TABLE[itemName]) {
        SORT_TABLE[itemName] = {};
      }
      Object.keys(parsed[itemName]).forEach(category => {
        SORT_TABLE[itemName][category] = !!parsed[itemName][category];
      });
    });
    console.log("SORT_TABLE loaded from localStorage:", SORT_TABLE);
  } catch (e) {
    console.warn("Failed to load sortTable from localStorage", e);
  }
})();

const TEXTURE_TO_ITEM_NAME = {
  fishbone: "魚の骨", shoe: "靴", plate: "皿",
  cushion: "クッション", glasses: "メガネ",
  can: "缶", bottle: "ビン", petbottle: "ペットボトル",
  cupramen: "カップ麺の容器", pack: "パック", tupper: "タッパー", cap: "キャップ",
  newspaper: "新聞紙", cardboard: "段ボール", kamipack: "紙パック", cloth: "衣類",
  battery: "バッテリー", handyfan: "ハンディファン"
};

const CATEGORIES = [
  "ふつうごみ",
  "しげんごみ",
  "プラスチックしげん",
  "かみ・ふく",
  "バッテリーるい"
];

const ITEMS = [
  "魚の骨",
  "靴",
  "皿",
  "クッション",
  "メガネ",
  "缶",
  "ビン",
  "ペットボトル",
  "カップ麺の容器",
  "パック",
  "タッパー",
  "ペットボトルのキャップ",
  "新聞紙",
  "段ボール",
  "紙パック",
  "衣類",
  "バッテリー",
  "ハンディファン"
];
// ゴミ名 → テクスチャキーの逆引きテーブル
const ITEM_NAME_TO_TEXTURE_KEY = {};
Object.entries(TEXTURE_TO_ITEM_NAME).forEach(([tex, name]) => {
  ITEM_NAME_TO_TEXTURE_KEY[name] = tex;
});

// 表示用ゴミ名（ユーザーが変更した名前）
// 保存先: localStorage "itemDisplayNames"
let itemDisplayNamesCache = null;

function loadItemDisplayNames() {
  if (itemDisplayNamesCache) return itemDisplayNamesCache;
  const raw = localStorage.getItem("itemDisplayNames");
  if (!raw) {
    itemDisplayNamesCache = {};
    return itemDisplayNamesCache;
  }
  try {
    const parsed = JSON.parse(raw);
    itemDisplayNamesCache = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    itemDisplayNamesCache = {};
  }
  return itemDisplayNamesCache;
}

// 内部の「アイテム名」から表示用の名前を取得
function getItemDisplayName(itemName) {
  const map = loadItemDisplayNames();
  return map[itemName] || itemName;
}

// 表示用の名前を更新して保存
function setItemDisplayName(itemName, newLabel) {
  const map = loadItemDisplayNames();
  map[itemName] = newLabel;
  localStorage.setItem("itemDisplayNames", JSON.stringify(map));
}

// カスタム画像 : 保存先 localStorage "customItemImages"
// キー: テクスチャキー（fishbone など）
let customItemImagesCache = null;

function loadCustomItemImages() {
  if (customItemImagesCache) return customItemImagesCache;
  const raw = localStorage.getItem("customItemImages");
  if (!raw) {
    customItemImagesCache = {};
    return customItemImagesCache;
  }
  try {
    const parsed = JSON.parse(raw);
    customItemImagesCache = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    customItemImagesCache = {};
  }
  return customItemImagesCache;
}

function saveCustomItemImages() {
  if (!customItemImagesCache) return;
  localStorage.setItem("customItemImages", JSON.stringify(customItemImagesCache));
}

// カスタム画像を登録
function setCustomItemImageData(textureKey, dataUrl) {
  const map = loadCustomItemImages();
  map[textureKey] = dataUrl;
  saveCustomItemImages();
}

//登録済みのカスタム画像をテクスチャに反映
function applyCustomItemTexturesToScene(scene) {
  const map = loadCustomItemImages();
  Object.entries(map).forEach(([textureKey, dataUrl]) => {
    if (!dataUrl) return;
    if (scene.textures.exists(textureKey)) {
      scene.textures.remove(textureKey);
    }
    scene.textures.addBase64(textureKey, dataUrl);
  });
}

//難易度設定
const DIFFICULTY_SETTINGS = {
  easy: { label: "かんたん", speedMultiplier: 1.0, categories: 3, spawnRate: 3500, missPoint: -2 },
  normal: { label: "ふつう", speedMultiplier: 1.0, categories: 4, spawnRate: 2000, missPoint: -3 },
  hard: { label: "むずかしい", speedMultiplier: 1.0, categories: 5, spawnRate: 1700, missPoint: -4 }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//現在の難易度をグローバルに保持
let currentDifficulty = "easy";

let score = 0;

//リサイクルゲージ集計
let recycleCounts = {
  pet: 0,
  can: 0,
  bottle: 0,
};
//所持アイテムデータ
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];

// 現在の SORT_TABLE から「カテゴリ → 出現させる画像キー一覧」を作る
function buildItemsByCategoryFromSortTable() {
  const result = {};
  CATEGORIES.forEach(cat => {
    result[cat] = [];
  });

  // TEXTURE_TO_ITEM_NAME で全ゴミ画像を走査
  Object.entries(TEXTURE_TO_ITEM_NAME).forEach(([textureKey, itemName]) => {
    const row = SORT_TABLE[itemName];
    if (!row) return;

    CATEGORIES.forEach(cat => {
      if (row[cat]) {
        result[cat].push(textureKey);
      }
    });
  });

  return result;
}

function exportSortLogsToCsv() {
  // 1) ログを読み込み
  const raw = localStorage.getItem("sortLogs");
  if (!raw) {
    window.alert("まだ分別データがありません。");
    return;
  }

  let logs;
  try {
    logs = JSON.parse(raw);
  } catch (e) {
    console.warn("sortLogs の読み込みに失敗しました", e);
    window.alert("分別データの読み込みに失敗しました。");
    return;
  }
  if (!Array.isArray(logs) || logs.length === 0) {
    window.alert("まだ分別データがありません。");
    return;
  }

  // 2) 表示用の区分名（SetScene の設定を反映）
  let categoryNames = [...CATEGORIES]; // デフォルト
  const savedNames = localStorage.getItem("categoryNames");
  if (savedNames) {
    try {
      const parsed = JSON.parse(savedNames);
      if (Array.isArray(parsed) && parsed.length === CATEGORIES.length) {
        categoryNames = parsed;
      }
    } catch {
      // 壊れていたらデフォルトのまま
    }
  }

  // 3) 集計用オブジェクトを作成
  const counts = {};
  const totalByItem = {};
  const correctByItem = {};

  ITEMS.forEach(item => {
    counts[item] = {};
    CATEGORIES.forEach(cat => {
      counts[item][cat] = 0;
    });
    totalByItem[item] = 0;
    correctByItem[item] = 0;
  });

  // 4) ログから集計
  logs.forEach(entry => {
    const item = entry.item;
    const cat = entry.category;
    const correct = !!entry.correct;

    // 想定外のデータは無視
    if (!counts[item] || !(cat in counts[item])) return;

    counts[item][cat] += 1;
    totalByItem[item] += 1;
    if (correct) correctByItem[item] += 1;
  });

  // 5) CSV 行を作成
  const rows = [];

  // 1行目: 1列目空白 + 区分名 + 正答率列
  const header = [""].concat(categoryNames).concat(["正答率(%)"]);
  rows.push(header);

  // 2行目以降: 1列目に「表示用ゴミ名」 + 各区分の回数 + 正答率
  ITEMS.forEach(item => {
    const displayName = getItemDisplayName(item);
    const row = [displayName];

    CATEGORIES.forEach(cat => {
      const n = counts[item][cat] || 0;
      row.push(String(n));
    });

    const total = totalByItem[item];
    const correct = correctByItem[item];
    let rateStr = "";
    if (total > 0) {
      const rate = Math.round((correct / total) * 100); // 整数パーセント
      rateStr = String(rate);
    }
    row.push(rateStr);

    rows.push(row);
  });


  // 6) CSV 文字列に変換
  const escapeCsv = (value) => {
    if (value == null) return "";
    const s = String(value);
    if (s.includes('"') || s.includes(",") || s.includes("\n")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const csvBody = rows
    .map(row => row.map(escapeCsv).join(","))
    .join("\r\n");


  const csv = "\uFEFF" + csvBody;

  // 7) ダウンロード
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sort_data.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function resetSortLogs() {
  // ログを削除
  localStorage.removeItem("sortLogs");
  // 簡単なフィードバック
  window.alert("これまでの分別データをリセットしました。");
}


class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene');
  }

  preload() {
    this.load.audio("fire_bgm", "assets/bgm/fire_bgm.mp3");

    this.load.image('fishbone', 'assets/trash/fishbone.png');
    this.load.image('shoe', 'assets/trash/shoe.png');
    this.load.image('plate', 'assets/trash/plate.png');
    this.load.image('cushion', 'assets/trash/cushion.png');
    this.load.image('glasses', 'assets/trash/glasses.png');
    this.load.image('cupramen', 'assets/trash/cupramen.png');
    this.load.image('pack', 'assets/trash/pack.png');
    this.load.image('tupper', 'assets/trash/tupper.png');
    this.load.image('cap', 'assets/trash/cap.png');
    this.load.image('newspaper', 'assets/trash/newspaper.png');
    this.load.image('cardboard', 'assets/trash/cardboard.png');
    this.load.image('kamipack', 'assets/trash/kamipack.png');
    this.load.image('cloth', 'assets/trash/cloth.png');
    this.load.image('battery', 'assets/trash/battery.png');
    this.load.image('handyfan', 'assets/trash/handyfan.png');

    this.load.image("howtoset_page2", "assets/ui/howtoset_page2.png");
    this.load.image("howtoset_page1", "assets/ui/howtoset_page1.png");
    this.load.image("char_frame", "assets/ui/char_frame.png");
    this.load.image("item_bg", "assets/backgrounds/item_bg.png");
    this.load.image('can', 'assets/trash/can.png');
    this.load.image('bottle', 'assets/trash/bottle.png');
    this.load.image('petbottle', 'assets/trash/petbottle.png');
    this.load.audio("button_click", "assets/se/button_click.mp3");
    this.load.image("set_button", "assets/ui/set_button.png");
    this.load.image("jersey_home", "assets/ui/jersey_home.png");
    this.load.image("howto_page1", "assets/ui/howto_page1.png");
    this.load.image("howto_page2", "assets/ui/howto_page2.png");
    this.load.image("arrow_left", "assets/ui/arrow_left.png");
    this.load.image("arrow_right", "assets/ui/arrow_right.png");
    this.load.image("howto_button", "assets/ui/howto_button.png");
    this.load.image("char_sad", "assets/char/char_sad.png");
    this.load.image("char_teach", "assets/char/char_teach.png");
    this.load.image("char_normal", "assets/char/char_normal.png");
    this.load.image("char_happy", "assets/char/char_happy.png");
    this.load.image("home_bg", "assets/backgrounds/home_bg.png");
    this.load.image("back_button", "assets/ui/back_button.png");
    this.load.image('menu_button', 'assets/ui/menu_button.png');
    this.load.image("icon_pet", "assets/ui/pet_icon.png");
    this.load.image("icon_can", "assets/ui/can_icon.png");
    this.load.image("icon_bottle", "assets/ui/bottle_icon.png");
    this.load.image("back_button", "assets/ui/back_button.png");
    this.load.image("result_bg", "assets/backgrounds/result_bg.png");
    this.load.image("pet_juice", "assets/ui/pet_juice.png");
    this.load.image("rucksack", "assets/ui/rucksack.png");
    this.load.image("ruler", "assets/ui/ruler.png");
    this.load.image("jersey", "assets/ui/jersey.png");
    this.load.image("bead", "assets/ui/bead.png");
    this.load.image("glass_juice", "assets/ui/glass_juice.png");
    this.load.image("cup", "assets/ui/cup.png");
    this.load.image("fan", "assets/ui/fan.png");
    this.load.image("clock", "assets/ui/clock.png");
    this.load.image("bike", "assets/ui/bike.png");
    this.load.image("bike_home", "assets/ui/bike_home.png");
    this.load.image("help_button", "assets/ui/help_button.png");
    this.load.image("help_panel", "assets/ui/help_panel.png");
    this.load.image("complete", "assets/ui/complete.png");
    this.load.video("battery_fire", "assets/video/battery_fire.mp4", true);
    this.load.image("challenge_button", "assets/ui/challenge_button.png");
  }

  openHowtoPopup(isFirst = false) {

    // 暗幕
    const dim = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.55)
      .setDepth(300)
      .setInteractive();

    // ページ1
    const page1 = this.add.image(400, 300, "howto_page1")
      .setDepth(301)
      .setScale(0.6);

    // 右矢印
    const arrowRight = this.add.image(730, 300, "arrow_right")
      .setDepth(302)
      .setScale(0.3)
      .setInteractive({ useHandCursor: true });

    // ページ2（非表示）
    const page2 = this.add.image(400, 300, "howto_page2")
      .setDepth(301)
      .setScale(0.6)
      .setVisible(false);

    // 左矢印（非表示）
    const arrowLeft = this.add.image(70, 300, "arrow_left")
      .setDepth(302)
      .setScale(0.3)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    // ページ切替
    arrowRight.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      page1.setVisible(false);
      arrowRight.setVisible(false);
      page2.setVisible(true);
      arrowLeft.setVisible(true);
    });

    arrowLeft.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      page2.setVisible(false);
      arrowLeft.setVisible(false);
      page1.setVisible(true);
      arrowRight.setVisible(true);
    });

    // パネル内は閉じない
    page1.on("pointerdown", e => e.stopPropagation());
    page2.on("pointerdown", e => e.stopPropagation());
    arrowLeft.on("pointerdown", e => e.stopPropagation());
    arrowRight.on("pointerdown", e => e.stopPropagation());


    // 暗幕クリックで閉じる
    dim.on("pointerdown", () => {

      dim.destroy();
      page1.destroy();
      page2.destroy();
      arrowLeft.destroy();
      arrowRight.destroy();

      // 初回の場合はローカルストレージに記録する
      if (isFirst) {
        localStorage.setItem("howtoSeen", "true");
      }
    });
  }


  create() {

    // カスタム画像を反映
    applyCustomItemTexturesToScene(this);

    // 初回起動チェック
    const seen = localStorage.getItem("howtoSeen");
    if (!seen) {
      this.time.delayedCall(300, () => {
        this.openHowtoPopup(true); // 初回表示であることを渡す
      });
    }

    //メニューボタン
    const menuBtn = this.add.image(760, 40, 'menu_button')
      .setInteractive({ useHandCursor: true })
      .setScale(0.3)
      .setDepth(20);

    //ホバー
    menuBtn.on("pointerover", () => {
      this.tweens.add({
        targets: menuBtn,
        scale: 0.35,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });
    //ホバー解除
    menuBtn.on("pointerout", () => {
      this.tweens.add({
        targets: menuBtn,
        scale: 0.3,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });
    menuBtn.on('pointerdown', () => {
      this.openMenuPopup();
      this.sound.play("button_click", { volume: 0.6 });
    });





    //ホーム背景

    this.add.image(400, 300, "home_bg").setDisplaySize(800, 600).setDepth(0);


    //所持アイテム読み込み
    const owned = JSON.parse(localStorage.getItem("ownedItems")) || [];

    // キャラの位置と大きさ
    const cx = 300;
    const cy = 500;
    const cScale = 0.25;

    // 通常キャラ
    this.charNormal = this.add.image(cx, cy, "char_normal")
      .setScale(cScale)
      .setDepth(5);

    // 喜び
    this.charHappy = this.add.image(cx, cy, "char_happy")
      .setScale(cScale)
      .setDepth(5)
      .setVisible(false);

    // 全アイテム所持チェック
    const ALL_ITEMS = [
      "pet_juice", "rucksack", "ruler", "jersey",
      "fan", "bike", "clock",
      "glass_juice", "bead", "cup"
    ];

    const allGot = ALL_ITEMS.every(i => owned.includes(i));

    // 全アイテム揃っていたらポーズ切替アニメを開始
    if (allGot) {
      this.add.image(160, 470, "complete")
        .setDepth(190)
        .setScale(0.3)
      this.time.addEvent({
        delay: 600,
        loop: true,
        callback: () => {
          const n = this.charNormal.visible;
          this.charNormal.setVisible(!n);
          this.charHappy.setVisible(n);
        }
      });
    }
    //ホームに表示するアイテム
    const HOME_ITEMS = [
      "fan",
      "bike",
      "clock",
      "cup",
      "glass_juice",
      "pet_juice",
      "rucksack",
      "jersey",
      "ruler",
      "bead"
    ];

    const ITEM_POS = {
      fan: { x: 240, y: 420, scale: 0.22 },
      bike: { x: 58, y: 503, scale: 0.8 },
      clock: { x: 525, y: 330, scale: 0.13 },
      cup: { x: 463, y: 513, scale: 0.11 },
      glass_juice: { x: 500, y: 478, scale: 0.14 },
      pet_juice: { x: 530, y: 489, scale: 0.14 },
      rucksack: { x: 670, y: 500, scale: 0.2 },
      jersey: { x: 360, y: 280, scale: 0.27 },
      ruler: { x: 650, y: 520, scale: 0.12 },
      bead: { x: 290, y: 580, scale: 0.07 }
    };


    for (const key of HOME_ITEMS) {

      // 所持していなければ表示しない
      if (!owned.includes(key)) continue;

      // テクスチャ名の変換
      let texture = key;
      if (key === "bike") {
        texture = "bike_home";
      } else if (key === "jersey") {
        texture = "jersey_home"; // ← スペル注意！
      }
      const p = ITEM_POS[key];

      // depth は必要に応じて統一した数値（3など）で描画
      this.add.image(p.x, p.y, texture)
        .setScale(p.scale)
        .setDepth(3);
    }
  }

  // メニューのポップアップ表示 
  openMenuPopup() {

    // 半透明の背景
    const bg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.4)
      .setInteractive()
      .setDepth(200);
    // メニューパネル
    const panel = this.add.rectangle(400, 300, 300, 200, 0xffffff, 1)
      .setStrokeStyle(3, 0x666666)
      .setInteractive()
      .setDepth(201);
    // 分別チャレンジ
    const btnChallenge = this.add.text(320, 225, "分別チャレンジ", {
      fontSize: "22px",
      color: "#00796b",
      padding: { top: 10, bottom: 0 }
    }).setInteractive({ useHandCursor: true }).setDepth(202);

    btnChallenge.on('pointerdown', () => {
      this.sound.play("button_click", { volume: 0.6 });
      this.scene.start('StartScene');
    });

    // アイテム一覧
    const btnItems = this.add.text(320, 285, "アイテム", {
      fontSize: "22px",
      color: "#444",
      padding: { top: 10, bottom: 0 }
    }).setInteractive({ useHandCursor: true }).setDepth(202);

    btnItems.on('pointerdown', () => {
      this.sound.play("button_click", { volume: 0.6 });
      this.scene.start('ItemScene');
    });

    // あそびかた
    const btnHowTo = this.add.text(320, 345, "あそびかた", {
      fontSize: "22px",
      color: "#444",
      padding: { top: 10, bottom: 0 }
    })
      .setInteractive({ useHandCursor: true })
      .setDepth(202);


    btnHowTo.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      this.openHowtoPopup(false); // false = 初回ではない

    });

    const btnSet = this.add.text(480, 372, "[管理画面]", {
      fontSize: "13px",
      color: "#444",
      padding: { top: 10, bottom: 0 }
    })
      .setInteractive({ useHandCursor: true })
      .setDepth(202);


    btnSet.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      this.scene.start('SetScene');
    });




    // 背景クリックで閉じる
    bg.on('pointerdown', () => {
      bg.destroy();
      panel.destroy();
      btnChallenge.destroy();
      btnItems.destroy();
      btnHowTo.destroy();
      btnSet.destroy();

    });


  }
}


//ミニゲームスタート画面
class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }
  preload() {

    this.load.image('start_bg', 'assets/backgrounds/start_bg.png');
    this.load.image('title_logo', 'assets/ui/title_logo.png');
    this.load.image('start_button', 'assets/ui/start_button.png');
    this.load.image('check_icon', 'assets/ui/check_icon.png');


  }

  openHelpPopup() {
    // 暗幕
    const dim = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.55)
      .setDepth(200)
      .setInteractive();

    // パネル
    const panel = this.add.image(400, 300, "help_panel")
      .setDepth(201)
      .setScale(0.6);

    // 暗幕をクリックで閉じる
    dim.on("pointerdown", () => {
      dim.destroy();
      panel.destroy();
    });
  }



  create() {
    // カスタム画像を反映
    applyCustomItemTexturesToScene(this);


    currentDifficulty = "easy";

    // 難易度選択マーク表示関数
    this.showDifficultyMark = (btn) => {
      // 既存マークがあれば削除
      if (this.selectedMark) this.selectedMark.destroy();

      // 新しいマークを作成
      this.selectedMark = this.add.image(btn.x - 20, btn.y + 13, 'check_icon')
        .setScale(0.45);
    };

    this.add.image(400, 300, 'start_bg').setDisplaySize(800, 600);


    // タイトルロゴ
    const titleLogo = this.add.image(400, 130, 'title_logo')
      .setScale(0.6);
    this.tweens.add({
      targets: titleLogo,
      y: 115,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });


    this.difficultyButtons = [];
    this.selectedMark = null;

    let y = 230;
    for (const [key, value] of Object.entries(DIFFICULTY_SETTINGS)) {
      // 難易度ボタン
      const btn = this.add.text(250, y, value.label, {
        fontSize: "20px",
        fontStyle: "bold",
        color: "#000000",
        padding: { x: 10, y: 5 }
      })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.sound.play("button_click", { volume: 0.6 });
          currentDifficulty = key;
          this.showDifficultyMark(btn);
        });

      this.difficultyButtons.push(btn);
      y += 50;
    }
    // 初期マーク表示
    this.showDifficultyMark(this.difficultyButtons[0]);


    // 戻るボタン
    const backBtn = this.add.image(490, 354, "back_button")
      .setInteractive({ useHandCursor: true })
      .setScale(0.7);

    // ホバー演出
    backBtn.on("pointerover", () => {
      this.tweens.add({
        targets: backBtn,
        scale: 0.8,
        duration: 120
      });
    });

    backBtn.on("pointerout", () => {
      this.tweens.add({
        targets: backBtn,
        scale: 0.7,
        duration: 120
      });
    });

    // クリックでホームへ戻る
    backBtn.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      backBtn.disableInteractive();

      this.tweens.add({
        targets: backBtn,
        scale: 0.6,
        duration: 100,
        yoyo: true
      });

      this.time.delayedCall(150, () => {
        this.scene.start("HomeScene");
      });
    });



    const startBtn = this.add.image(490, 280, 'start_button')
      .setInteractive({ useHandCursor: true })
      .setScale(0.71);

    // ホバー時アニメーション
    startBtn.on("pointerover", () => {
      this.tweens.add({
        targets: startBtn,
        scale: 0.8,
        duration: 120
      });
    });
    startBtn.on("pointerout", () => {
      this.tweens.add({
        targets: startBtn,
        scale: 0.71,
        duration: 120
      });
    });

    // クリック時のズーム演出シーン
    startBtn.on('pointerdown', () => {

      this.sound.play("button_click", { volume: 0.6 });
      // 二重クリック防止
      startBtn.disableInteractive();


      // クリック演出
      this.tweens.add({
        targets: startBtn,
        scale: 0.6,
        duration: 150,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });

      // カメラズーム演出
      const cam = this.cameras.main;
      cam.pan(140, 450, 2300, 'Sine.easeInOut');
      cam.zoomTo(3, 3000, 'Sine.easeInOut', true);




      // ズーム完了後にゲーム開始
      this.time.delayedCall(3000, () => {
        score = 0;
        this.scene.start('GameScene', { difficulty: currentDifficulty });
      });
    });



  }
}

class GameScene extends Phaser.Scene {



  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("bubble", "assets/ui/bubble.png");
    this.load.image("bin_normal", "assets/bins/bin_normal.png");
    this.load.image("bin_recycle", "assets/bins/bin_recycle.png");
    this.load.image("bin_plastic", "assets/bins/bin_plastic.png");
    this.load.image("bin_paper", "assets/bins/bin_paper.png");
    this.load.image("bin_battery", "assets/bins/bin_battery.png");
    this.load.image("spark", "assets/effects/spark.png");
    this.load.image("focus_lines", "assets/ui/focus_lines.png");
    this.load.image("nice", "assets/ui/nice.png");
    this.load.image("perfect", "assets/ui/perfect.png");

    this.load.audio("game_bgm", "assets/bgm/game_bgm.mp3");
    this.load.audio("correct", "assets/se/correct.mp3");
    this.load.audio("mistake", "assets/se/mistake.mp3");
  }

  init(data) {
    // StartScene から渡されたデータを受け取る
    this.difficultyKey = data.difficulty || "easy";
    this.settings = DIFFICULTY_SETTINGS[this.difficultyKey];
  }





  create() {
    // カスタム画像を反映
    applyCustomItemTexturesToScene(this);


    this.missCounts = {
      "ふつうごみ": 0,
      "しげんごみ": 0,
      "プラスチックしげん": 0,
      "かみ・ふく": 0
    };
    this.bgm = this.sound.add("game_bgm", {
      volume: 0.5,
      loop: true
    });

    this.bgm.play();

    //帯状エリア
    this.header = this.add.rectangle(400, 35, 800, 70, 0xffe0c1)
      .setDepth(100);
    //帯エリアのアウトライン
    this.headerLine = this.add.rectangle(400, 70, 800, 1, 0x333333)
      .setDepth(101);

    //キャラクターの枠線
    this.charframe = this.add.image(390, 60, "char_frame")
      .setDepth(102)
      .setScale(0.5);


    //キャラクター
    this.char = this.add.image(390, 60, "char_normal")
      .setDepth(103)
      .setScale(0.13);

    // 吹き出し
    this.bubble = this.add.image(570, 60, "bubble")
      .setDepth(103)
      .setScale(0.45)
      .setVisible(false);

    this.bubbleText = this.add.text(460, 34, "", {
      fontSize: "20px",
      color: "#000",
      wordWrap: { width: 140 },
      padding: { top: 10, bottom: 0 }
    })
      .setDepth(104)
      .setVisible(false);

    // リアクション中かどうか
    this.charTimer = null;

    // キャラの状態を変更する関数
    this.showChar = (key, duration = 2000, text = "") => {
      // 前のリアクションを中断
      if (this.charTimer) {
        this.time.removeEvent(this.charTimer);
        this.charTimer = null;
      }

      // キャラ画像の差し替え
      this.char.setTexture(key);

      // 吹き出しを使う場合
      if (text) {
        this.bubble.setVisible(true);
        this.bubbleText.setText(text).setVisible(true);
      } else {
        this.bubble.setVisible(false);
        this.bubbleText.setVisible(false);
      }

      // 一定時間後に通常キャラへ戻す
      this.charTimer = this.time.delayedCall(duration, () => {
        this.char.setTexture("char_normal");
        this.bubble.setVisible(false);
        this.bubbleText.setVisible(false);
      });
    };


    //前回までの値を読み込む
    recycleCounts = JSON.parse(localStorage.getItem("recycleCounts")) || {
      pet: 0,
      can: 0,
      bottle: 0,
    };
    //連続成功カウント

    this.combo = 0;



    this.timeLimit = 40;
    this.timerText = this.add.text(20, 20, "時間: 40", { fontSize: "24px", color: "#000", padding: { top: 10, bottom: 0 } }).setDepth(102);
    this.scoreText = this.add.text(160, 20, "スコア: 0", { fontSize: "24px", color: "#000", padding: { top: 10, bottom: 0 } }).setDepth(102);

    const savedNames = localStorage.getItem("categoryNames");
    if (savedNames) {
      try {
        this.categoryNames = JSON.parse(savedNames);
      } catch (e) {
        this.categoryNames = [...CATEGORIES];
      }
    } else {
      this.categoryNames = [...CATEGORIES];
    }

    // 分別エリア数を難易度に応じて制限
    const categoryCount = this.settings.categories;
    const selectedCategories = CATEGORIES.slice(0, categoryCount);
    this.itemsByCategory = buildItemsByCategoryFromSortTable();
    this.trashGroup = this.add.group();
    this.dropZones = [];

    // カテゴリと画像キーの対応表
    const binImages = {
      "ふつうごみ": "bin_normal",
      "しげんごみ": "bin_recycle",
      "プラスチックしげん": "bin_plastic",
      "かみ・ふく": "bin_paper",
      "バッテリーるい": "bin_battery"
    };

    for (let i = 0; i < selectedCategories.length; i++) {
      const category = selectedCategories[i];
      const x = 82 + i * 150;
      const y = 510;

      // ゴミ箱画像
      const bin = this.add.image(x, y, binImages[category]).setScale(0.7);
      bin.setData("category", category);

      // ゴミ箱の「表示用の名前」（SetSceneで編集したもの）
      const label = this.categoryNames[i] || category;

      const maxFontSize = 18;
      const minFontSize = 10;
      const maxLabelWidth = bin.displayWidth * 0.8; // bin 幅の 80% 以内に収める

      const labelText = this.add.text(
        x,
        y - bin.displayHeight * 0.1,
        label,
        {
          fontSize: maxFontSize + "px",
          color: "#000",
          fontStyle: "bold",
          align: "center",
          // 横幅もbinに合わせる
          wordWrap: { width: maxLabelWidth },
          padding: { top: 10, bottom: 0 }
        }
      ).setOrigin(0.5);

      // はみ出している間はフォントサイズを 1 ずつ下げる
      let currentSize = maxFontSize;
      while (currentSize > minFontSize && labelText.width > maxLabelWidth) {
        currentSize -= 1;
        labelText.setFontSize(currentSize);
      }

      // ドロップ判定エリアを設定
      const zone = this.add.zone(x, y, bin.displayWidth, bin.displayHeight)
        .setRectangleDropZone(bin.displayWidth, bin.displayHeight)
        .setData("category", category);
    }




    // ドラッグ設定
    this.input.on("dragstart", (p, obj) => (obj.isDragging = true));
    this.input.on("drag", (p, obj, x, y) => {
      obj.x = x;
      obj.y = y;
    });
    this.input.on("dragend", (p, obj) => (obj.isDragging = false));

    // ドロップ処理
    this.input.on("drop", (pointer, obj, zone) => {
      if (!zone) return;
      // どの区分にドロップしたか
      const selectedCategory = zone.getData("category");
      const correct = obj.category === selectedCategory;
      // 分別ログを localStorage に保存
      try {
        const itemName = TEXTURE_TO_ITEM_NAME[obj.texture.key] || obj.texture.key;

        const newEntry = {
          item: itemName,          // ごみ
          category: selectedCategory, //区分
          correct: !!correct,      // 正誤
          timestamp: Date.now()
        };

        const raw = localStorage.getItem("sortLogs");
        let logs = [];
        if (raw) {
          try {
            logs = JSON.parse(raw);
            if (!Array.isArray(logs)) logs = [];
          } catch {
            logs = [];
          }
        }
        logs.push(newEntry);
        localStorage.setItem("sortLogs", JSON.stringify(logs));
      } catch (e) {
        console.warn("sortLogs の保存に失敗しました", e);
      }


      if (this.difficultyKey === "hard") {

        // 危険物扱いのアイテム
        const dangerItems = ["battery", "handyfan"];

        if (dangerItems.includes(obj.texture.key) && !correct) {

          // このプレイで増えたゲージを破棄
          recycleCounts = JSON.parse(localStorage.getItem("recycleCounts")) || {
            pet: 0, can: 0, bottle: 0
          };

          // タイマー停止
          this.spawnTimer.remove(false);
          this.timerEvent.remove(false);

          // 火災シーンへ遷移
          this.scene.start("FireScene");

          return;
        }
      }

      if (correct) {
        this.sound.play("correct", { volume: 0.6 });
        // キャラクターの正解リアクション
        this.showChar("char_happy", 1500);

        this.combo++;
        // ゴミの種類によってゲージ加算
        const keyName = obj.texture.key;

        // 難易度ごとのゲージ加算量
        let add = 1;
        if (this.difficultyKey === "normal") add = 2;
        if (this.difficultyKey === "hard") add = 4;

        // ゴミの種類によってゲージ加算
        if (keyName === "petbottle") recycleCounts.pet += add;
        if (keyName === "can") recycleCounts.can += add;
        if (keyName === "bottle") recycleCounts.bottle += add;

        // 保存
        localStorage.setItem("recycleCounts", JSON.stringify(recycleCounts));


        // 基本スコア
        let addScore = 5;

        // 5回以上連続成功で Perfect+2
        if (this.combo >= 5) {
          addScore += 2;
        }

        score += addScore;
        this.scoreText.setText("スコア: " + score);

        this.showComboEffect(this.combo);


        // パーティクル
        const bx = zone.x;
        const by = zone.y;

        const particleCount = 8;
        for (let i = 0; i < particleCount; i++) {
          // ランダムに位置をばらす
          const sx = bx + Phaser.Math.Between(-35, 35);
          const sy = by + Phaser.Math.Between(-50, 50);

          // 小さい星
          const sp = this.add.image(sx, sy, 'spark')
            .setScale(0.05)
            .setAlpha(0.9);

          // ふくらむ
          this.tweens.add({
            targets: sp,
            scale: { from: 0.05, to: 0.6 },
            alpha: { from: 0.9, to: 1 },
            duration: 180,
            ease: 'Back.easeOut',
            onComplete: () => {

              // しぼんで消える
              this.tweens.add({
                targets: sp,
                scale: { from: 0.6, to: 0 },
                alpha: { from: 1, to: 0 },
                duration: 250,
                ease: 'Quad.easeIn',
                onComplete: () => sp.destroy()
              });

            }
          });
        }

        // ゴミの消滅演出
        this.tweens.add({
          targets: obj,
          alpha: 0,
          scale: 0.5,
          duration: 200,
          onComplete: () => obj.destroy()
        });
      } else {
        this.sound.play("mistake", { volume: 0.8 });
        this.combo = 0;
        if (obj.category !== "バッテリーるい") {
          if (this.missCounts[obj.category] !== undefined) {
            this.missCounts[obj.category]++;
          }
        }
        //　不正解リアクション
        if (this.difficultyKey === "easy") {

          const wrongName = obj.texture.key;   // 失敗したゴミ
          const categoryId = obj.category;     // 内部的な分別区分

          const baseName = TEXTURE_TO_ITEM_NAME[wrongName] || wrongName;
          const showItemName = getItemDisplayName(baseName);


          // categoryId に対応するインデックスを CATEGORIES から探す
          let categoryLabel = categoryId;
          const idx = CATEGORIES.indexOf(categoryId);
          if (idx !== -1 && this.categoryNames && this.categoryNames[idx]) {
            // SetScene で編集された表示名
            categoryLabel = this.categoryNames[idx];
          }

          // 吹き出しテキスト
          const message = `${showItemName}は\n${categoryLabel}だよ！`;

          // 3秒間 teach 表示
          this.showChar("char_teach", 3000, message);

        } else {


          // normal・hard は sad を2秒表示
          this.showChar("char_sad", 1500);
        }


        this.tweens.add({
          targets: obj,
          x: 50,
          y: Phaser.Math.Between(180, 400),
          duration: 300,
          ease: "Sine.easeInOut"
        });
      }
    });

    this.spawnTimer = this.time.addEvent({
      delay: this.settings.spawnRate,
      callback: this.spawnTrash,
      callbackScope: this,
      loop: true
    });


    // 制限時間
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLimit--;
        this.timerText.setText("時間: " + this.timeLimit);
        if (this.timeLimit <= 0) {
          this.bgm.stop();
          this.scene.start("ResultScene", {
            missCounts: this.missCounts
          });
        }
      },
      loop: true
    });

    this.selectedCategories = selectedCategories;

    //ゲームシーン終了でBGM停止
    this.events.once("shutdown", () => {
      if (this.bgm) {
        this.bgm.stop();
      }
    });

  }


  spawnTrash() {
    // ゴミが1つ以上あるカテゴリだけ抽出
    const validCategories = this.selectedCategories.filter(cat => {
      const list = this.itemsByCategory[cat];
      return list && list.length > 0;
    });

    if (validCategories.length === 0) {
      return; // 出せるゴミが無い
    }

    const category = Phaser.Utils.Array.GetRandom(validCategories);


    // SetScene で決めた対応をもとにしたリスト（SORT_TABLEから生成済み）
    const dynamicItems = (this.itemsByCategory && this.itemsByCategory[category]) || [];

    // カスタム設定を最優先：
    //  この区分に 1つもゴミが割り当てられていないなら、何も出さない
    if (!dynamicItems || dynamicItems.length === 0) {
      return;
    }

    const list = dynamicItems;

    const key = Phaser.Utils.Array.GetRandom(list);

    const y = Phaser.Math.Between(180, 400); // ゴミが出現する範囲
    const trash = this.add.image(50, y, key).setScale(0.4);
    trash.displayWidth = 120;
    trash.scaleY = trash.scaleX;

    // このゴミがどの区分が正解か
    trash.category = category;

    trash.setInteractive({ pixelPerfect: true, draggable: true });
    this.input.setDraggable(trash);
    trash.speed = (50 + Math.random() * 30) * this.settings.speedMultiplier;
    this.trashGroup.add(trash);
  }



  update(time, delta) {
    const dt = delta / 1000;

    this.trashGroup.getChildren().forEach(trash => {
      if (!trash.isDragging) trash.x += trash.speed * dt;

      // 右端判定
      if (trash.x > 800) {

        // 減点処理
        const miss = this.settings.missPoint; // 難易度に応じた値
        score += miss;
        if (score < 0) score = 0;
        this.scoreText.setText("スコア: " + score);

        // 減点エフェクトテキスト
        const text = this.add.text(trash.x, trash.y, `${miss} pt`, {
          fontSize: "30px",
          color: "#ff0000",
          fontStyle: "bold",
          padding: { top: 10, bottom: 0 }

        })
          .setOrigin(0.5)
          .setScale(0.1);



        this.tweens.add({
          targets: text,
          scale: { from: 0.1, to: 1.0 },
          alpha: { from: 1, to: 1 },
          duration: 200,
          ease: "Back.easeOut",
          onComplete: () => {
            // 縮小 フェードアウト
            this.tweens.add({
              targets: text,
              scale: { from: 1.0, to: 0 },
              alpha: { from: 1, to: 0 },
              duration: 400,
              ease: "Quad.easeIn",
              onComplete: () => text.destroy()
            });
          }
        });

        // ゴミを削除
        trash.destroy();
      }
    });
  }
  showComboEffect(combo) {

    const isPerfect = combo >= 5;
    const key = isPerfect ? "perfect" : "nice";

    // 集中線
    const focus = this.add.image(400, 300, "focus_lines")
      .setScale(0)
      .setAlpha(0)
      .setDepth(50);

    this.tweens.add({
      targets: focus,
      scale: { from: 0, to: 0.5 },
      alpha: { from: 0, to: 0.6 },
      duration: 180,
      ease: "Back.easeOut"
    });

    // Nice! /Perfect!
    const txt = this.add.image(400, 300, key)
      .setScale(0)
      .setAlpha(0)
      .setDepth(51);

    this.tweens.add({
      targets: txt,
      scale: { from: 0, to: 0.5 },
      alpha: { from: 0, to: 1 },
      duration: 300,

      onComplete: () => {
        // フェードアウト
        this.tweens.add({
          targets: [txt, focus],
          scale: "+=0.3",
          alpha: 0,
          duration: 300,

          onComplete: () => {
            txt.destroy();
            focus.destroy();
          }
        });
      }
    });
  }



}



// リザルト画面

class ResultScene extends Phaser.Scene {

  preload() {
    this.load.audio("box", "assets/se/box.mp3");
    this.load.audio("itempop", "assets/se/itempop.mp3");
    this.load.image("recycle_box", "assets/ui/recycle_box.png");
    this.load.image("best_update", "assets/char/best_update.png");
    this.load.image("spark", "assets/effects/spark.png");
    this.load.image("text_get", "assets/ui/text_get.png");
    this.load.image("reflect_normal", "assets/ui/reflect_normal.png");
    this.load.image("reflect_recycle", "assets/ui/reflect_recycle.png");
    this.load.image("reflect_plastic", "assets/ui/reflect_plastic.png");
    this.load.image("reflect_paper", "assets/ui/reflect_paper.png");
    this.load.image("reflect_perfect", "assets/ui/reflect_perfect.png");
  }

  constructor() {
    super('ResultScene');
  }

  drawGauge(x, y, width, height, value) {
    const max = 7;
    const ratio = Phaser.Math.Clamp(value / max, 0, 1);

    // 背景
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.lineStyle(3, 0x666666, 1);
    bg.fillRoundedRect(x, y - height / 2, width, height, 12);
    bg.strokeRoundedRect(x, y - height / 2, width, height, 12);

    // バックバー
    const back = this.add.graphics();
    back.fillStyle(0xa9a9a9, 1);
    back.fillRoundedRect(x, y - height / 2, width, height, 12);

    // メインバー
    const bar = this.add.graphics();
    bar.fillStyle(0x7ee8c2, 1);
    bar.fillRoundedRect(x, y - height / 2, 0, height, 12);

    // Tweenダミーオブジェクト
    const gauge = { w: 0 };

    this.tweens.add({
      targets: gauge,
      w: width * ratio,
      duration: 700,
      ease: "Back.easeOut",
      onUpdate: () => {
        bar.clear();
        bar.fillStyle(0xffa500, 1);
        bar.fillRoundedRect(x, y - height / 2, gauge.w, height, 12);
      }
    });

    // 数値表示
    //this.add.text(x + width + 12, y - 12, `${value} / ${max}`, {
    //  fontSize: "20px",
    //  color: "#333",
    //  fontStyle: "bold"
    //});

    // 満タン演出
    if (value >= max) {
      const flash = this.add.rectangle(x + width / 2, y, width, height, 0xffffff)
        .setAlpha(0);

      this.tweens.add({
        targets: flash,
        alpha: { from: 0, to: 0.6 },
        duration: 200,
        yoyo: true,
        onComplete: () => flash.destroy()
      });
    }
  }
  openTreasure() {


    // アイテム登場
    this.spawnTreasureItem();
  }

  // 宝箱を開いて光を出す
  showTreasureAnimation() {

    this.dimLayer.setVisible(true);
    this.dimLayer.setDepth(20);
    this.dimLayer.setAlpha(0);
    this.dimLayer.setInteractive();

    this.tweens.add({
      targets: this.dimLayer,
      alpha: 0.55,
      duration: 200
    });

    // 毎回フェードインする
    this.dimLayer.setAlpha(0);
    this.tweens.add({
      targets: this.dimLayer,
      alpha: 0.55,
      duration: 200
    });
    this.sound.play("box", { volume: 0.6 });


    // 宝箱表示
    this.box = this.add.image(400, 330, "recycle_box")
      .setScale(0.3)
      .setAlpha(0)
      .setDepth(30);

    this.tweens.add({
      targets: this.box,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.3, to: 0.6 },
      duration: 600,
      ease: "Back.easeOut",
      onComplete: () => {
        this.tweens.add({
          targets: this.box,
          angle: { from: -3, to: 3 },
          duration: 120,
          yoyo: true,
          repeat: 5,
          ease: "Sine.easeInOut",
          onComplete: () => this.openTreasure()
        });
      }
    });
  }



  spawnTreasureItem() {
    this.sound.play("itempop", { volume: 0.6 });

    // 宝箱削除
    if (this.box && !this.box.destroyed) {
      this.box.destroy();
      this.box = null;
    }

    // 集中線
    const focus = this.add.image(400, 300, "focus_lines")
      .setScale(0)
      .setAlpha(0)
      .setDepth(28);

    this.tweens.add({
      targets: focus,
      alpha: { from: 3, to: 5 },
      scale: { from: 0, to: 0.8 },
      duration: 400,
      ease: "Back.easeOut"
    });


    const GAUGE_ITEMS = {
      pet: ["pet_juice", "rucksack", "ruler", "jersey"],
      can: ["fan", "bike", "clock"],
      bottle: ["glass_juice", "bead", "cup"]
    };

    const gaugeType = this.fullGauges[this.currentIndex];
    const list = GAUGE_ITEMS[gaugeType] || [];
    const candidates = list.filter(i => !ownedItems.includes(i));

    //候補が無ければこのゲージをスキップ
    if (candidates.length === 0) {
      console.warn("このゲージのアイテムは全て所持済み");




      this.currentIndex++;

      if (this.currentIndex < this.fullGauges.length) {
        this.time.delayedCall(300, () => this.showTreasureAnimation());
      } else {
        this.time.delayedCall(300, () => {
          this.tweens.add({
            targets: this.dimLayer,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              this.dimLayer.setVisible(false);
              this.dimLayer.disableInteractive();

            }
          });
        });
      }
      return;
    }



    const selected = Phaser.Utils.Array.GetRandom(candidates);

    // 所持リスト保存
    ownedItems.push(selected);
    localStorage.setItem("ownedItems", JSON.stringify(ownedItems));

    // アイテム登場
    this.item = this.add.image(400, 300, selected)
      .setScale(0)
      .setAlpha(0)
      .setDepth(31);

    this.tweens.add({
      targets: this.item,
      alpha: 1,
      scale: { from: 0, to: 0.8 },
      duration: 600,
      ease: "Back.easeOut",
      onStart: () => {
        this.tweens.add({
          targets: focus,
          alpha: 0,
          scale: 1.2,
          duration: 300,
          ease: "Quad.easeIn",
          onComplete: () => focus.destroy()
        });
      }
    });

    // 星エフェクト
    for (let i = 0; i < 15; i++) {
      const sp = this.add.image(400, 300, "spark")
        .setScale(0.05)
        .setAlpha(1)
        .setDepth(32);

      this.tweens.add({
        targets: sp,
        x: 400 + Phaser.Math.Between(-150, 150),
        y: 300 + Phaser.Math.Between(-150, 150),
        scale: { from: 0, to: 1.5 },
        alpha: { from: 1, to: 0 },
        duration: 450,
        ease: "Quad.easeOut",
        onComplete: () => sp.destroy()
      });
    }

    // 「アイテム獲得」
    this.textGet = this.add.image(400, 430, "text_get")
      .setOrigin(0.5)
      .setDepth(33)
      .setScale(0);


    this.tweens.add({
      targets: this.textGet,
      scale: { from: 0, to: 0.7 },
      duration: 300,
      ease: "Back.easeOut"
    });

    // ゲージ減算
    const MAX = 7;
    recycleCounts[gaugeType] = Math.max(0, recycleCounts[gaugeType] - MAX);
    localStorage.setItem("recycleCounts", JSON.stringify(recycleCounts));

    this.input.removeAllListeners("pointerdown");

    this.dimLayer.once("pointerdown", () => {
      this.closeTreasure();
      this.currentIndex++;

      if (this.currentIndex < this.fullGauges.length) {
        this.time.delayedCall(300, () => this.showTreasureAnimation());
      } else {
        this.time.delayedCall(300, () => {
          this.tweens.add({
            targets: this.dimLayer,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              this.dimLayer.setVisible(false);
              this.dimLayer.disableInteractive();
              //「ふりかえり」の演出
              this.showReflectionPopup();
            }
          });
        });
      }
    });

  }



  closeTreasure() {

    //宝箱削除
    if (this.box) {
      this.box.destroy();
      this.box = null;
    }

    // アイテムとテキストのフェードアウト
    const objs = [this.item, this.textGet];

    objs.forEach(obj => {
      if (!obj) return;

      this.tweens.add({
        targets: obj,
        alpha: 0,
        scale: 0.2,
        duration: 300,
        onComplete: () => obj.destroy()
      });
    });
    if (this.dimLayer) {
      this.dimLayer.setVisible(false);
      this.dimLayer.disableInteractive();
      this.dimLayer.removeAllListeners();
    }
  }



  openHelpPopup() {
    // 暗幕
    const dim = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.55)
      .setDepth(200)
      .setInteractive();

    // パネル
    const panel = this.add.image(400, 300, "help_panel")
      .setDepth(201)
      .setScale(0.6);

    // 暗幕をクリックで閉じる
    dim.on("pointerdown", () => {
      dim.destroy();
      panel.destroy();
    });
  }

  init(data) {
    this.missCounts = data.missCounts || {
      "ふつうごみ": 0,
      "しげんごみ": 0,
      "プラスチックしげん": 0,
      "かみ・ふく": 0
    };
    this.REFLECT_IMAGES = {
      "ふつうごみ": "reflect_normal",
      "しげんごみ": "reflect_recycle",
      "プラスチックしげん": "reflect_plastic",
      "かみ・ふく": "reflect_paper",
      "none": "reflect_perfect"
    };
  }

  showReflectionPopup() {
    const category = this.getMostMissCategory();
    const key = category
      ? this.REFLECT_IMAGES[category]
      : this.REFLECT_IMAGES.none;

    const dim = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.55)
      .setDepth(300)
      .setInteractive();

    const img = this.add.image(400, 300, key)
      .setDepth(301)
      .setScale(0.7);

    dim.on("pointerdown", () => {
      dim.destroy();
      img.destroy();
    });
  }

  getMostMissCategory() {
    let max = 0;
    let result = null;

    for (const key of [
      "ふつうごみ",
      "しげんごみ",
      "プラスチックしげん",
      "かみ・ふく"
    ]) {
      const v = this.missCounts[key];
      if (v > max) {
        max = v;
        result = key;
      }
    }

    return max === 0 ? null : result;
  }


  create() {
    const MISS_PRIORITY = [
      "ふつうごみ",
      "しげんごみ",
      "プラスチックしげん",
      "かみ・ふく"
    ];




    this.add.image(400, 300, 'result_bg').setDisplaySize(800, 600);

    // 背景の暗幕
    this.dimLayer = this.add.rectangle(400, 300, 800, 600, 0x000000)
      .setDepth(20)
      .setVisible(false)
      .setAlpha(0)
      .setInteractive();





    this.add.text(450, 98, `${score}`, {
      fontSize: '28px', color: '#000000ff', padding: { top: 10, bottom: 0 }, fontStyle: "bold"
    });
    //  ベストスコアの読み込み
    let bestScore = Number(localStorage.getItem("bestScore")) || 0;

    //  今回スコアがベストスコアを超えたか
    const isBestUpdate = score > bestScore;

    // 表示するベストスコアは更新前の値
    this.add.text(442, 147, `${bestScore}`, {
      fontSize: '22px',
      color: '#000',
      fontStyle: "bold",
      padding: { top: 10, bottom: 0 }
    });

    // 更新していたら演出
    if (isBestUpdate) {
      const img = this.add.image(650, 150, "best_update")

        .setScale(0.3);



    }


    // セーブデータ読み込み
    const counts = JSON.parse(localStorage.getItem("recycleCounts")) || {
      pet: 0, can: 0, bottle: 0
    };

    // アイコン対応表
    const gaugeIcons = {
      pet: "icon_pet",
      can: "icon_can",
      bottle: "icon_bottle",
    };

    const keys = ["pet", "can", "bottle"];

    let y = 220;


    for (let i = 0; i < 3; i++) {

      // ゲージを描画
      this.drawGauge(270, y, 300, 20, counts[keys[i]]);

      // アイコンを表示
      this.add.image(252, y, gaugeIcons[keys[i]])
        .setScale(0.4)
        .setOrigin(0.5);

      y += 70;
    }
    //正しい分別表
    this.helpBtn = this.add.image(760, 35, "help_button")

      .setScale(0.15)
      .setInteractive({ useHandCursor: true });

    // ホバー演出
    this.helpBtn.on("pointerover", () => {
      this.tweens.add({ targets: this.helpBtn, scale: 0.17, duration: 120 });
    });
    this.helpBtn.on("pointerout", () => {
      this.tweens.add({ targets: this.helpBtn, scale: 0.15, duration: 120 });
    });

    //クリックでヘルプポップアップ
    this.helpBtn.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      this.openHelpPopup();
    });

    // タイトルに戻るボタン
    const backBtn = this.add.image(400, 450, "back_button")
      .setInteractive({ useHandCursor: true })
      .setScale(0.8);

    // ホバー時
    backBtn.on("pointerover", () => {
      this.tweens.add({
        targets: backBtn,
        scale: 0.9,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });

    // ホバー解除
    backBtn.on("pointerout", () => {
      this.tweens.add({
        targets: backBtn,
        scale: 0.8,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });

    // 押し込みシーン遷移
    backBtn.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });

      backBtn.disableInteractive();
      // ベストスコア更新保存
      if (score > bestScore) {
        localStorage.setItem("bestScore", String(score));
      }
      // 押し込みアニメーション
      this.tweens.add({
        targets: backBtn,
        scale: 0.7,
        duration: 120,
        yoyo: true,
        ease: "Sine.easeInOut"
      });

      // 少し待ってからシーン遷移
      this.time.delayedCall(250, () => {
        this.scene.start("HomeScene");
      });
    });
    // 満タンだったゲージをチェックして配列に入れる
    const MAX = 7;
    this.fullGauges = [];




    const GAUGE_ITEMS = {
      pet: ["pet_juice", "rucksack", "ruler", "jersey"],
      can: ["fan", "bike", "clock"],
      bottle: ["glass_juice", "bead", "cup"]
    };

    this.fullGauges = [];

    for (const type of ["pet", "can", "bottle"]) {
      if (counts[type] >= MAX) {

        const remains = GAUGE_ITEMS[type].filter(i => !ownedItems.includes(i));

        if (remains.length > 0) {

          this.fullGauges.push(type);
        }
      }
    }


    //アイテムを全所持していたら宝箱演出をスキップ
    const allItems = [
      "pet_juice", "rucksack", "ruler", "jersey",
      "fan", "bike", "clock",
      "glass_juice", "bead", "cup"
    ];

    // セーブされている所持アイテム
    ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];

    // 未所持アイテムの確認
    const remainingItems = allItems.filter(i => !ownedItems.includes(i));


    if (remainingItems.length === 0) {
      console.log("全アイテム所持済みのため宝箱スキップ");
      return;
    }

    // fullGaugesを残りアイテムの数に制限
    const remainingItemsCount = remainingItems.length;


    if (this.fullGauges.length > remainingItemsCount) {
      this.fullGauges = this.fullGauges.slice(0, remainingItemsCount);
    }


    // ゲージ満タンで未所持アイテムがある時だけ宝箱へ
    if (this.fullGauges.length > 0) {
      this.currentIndex = 0;
      this.showTreasureAnimation();
    } else {

      this.time.delayedCall(1500, () => {
        this.showReflectionPopup();
      });
    }






  }
}
class ItemScene extends Phaser.Scene {
  constructor() {
    super('ItemScene');
  }

  preload() {
    this.load.image("item_help", "assets/ui/item_help.png");

    this.load.image("item_frame", "assets/ui/item_frame.png");
    this.load.image("desc_frame", "assets/ui/desc_frame.png");
    this.load.image("recycling_arrow", "assets/ui/recycling_arrow.png");
  }
  // チュートリアル画像を表示
  showItemHelpOverlay() {
    this.itemHelpActive = true;

    this.itemHelpImg = this.add.image(480, 300, "item_help")
      .setDepth(61)
      .setScale(0.5);
  }

  // チュートリアル画像を消す
  hideItemHelpOverlay() {
    if (!this.itemHelpActive) return;
    this.itemHelpActive = false;

    if (this.itemHelpImg) {
      this.itemHelpImg.destroy();
      this.itemHelpImg = null;
    }

    // もう見たことを保存
    localStorage.setItem("itemHelpShown", "true");
  }


  create() {
    this.add.image(400, 300, "item_bg").setDisplaySize(800, 600).setDepth(0);
    this.add.text(290, 20, "アイテム一覧", {
      fontSize: "34px",
      color: "#333",
      fontStyle: "bold",
      padding: { top: 10, bottom: 0 }

    });
    //アイテム一覧取得
    ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];

    if (ownedItems.length === 0) {
      this.add.text(200, 300, "まだアイテムを持っていない！", {
        fontSize: "28px",
        color: "#444",
        padding: { top: 10, bottom: 0 }
      });
    } else {

      const startX = 190;
      const startY = 140;
      const gapX = 140;
      const gapY = 140;
      let index = 0;

      // アイテム一覧のフレームをまとめて持っておく
      this.itemFrames = [];

      ownedItems.forEach(id => {
        const col = index % 4;
        const row = Math.floor(index / 4);

        const x = startX + col * gapX;
        const y = startY + row * gapY;

        // アイテム枠画像
        const frame = this.add.image(x, y, "item_frame")
          .setScale(0.38)
          .setDepth(10)
          .setInteractive({ useHandCursor: true });

        frame.itemId = id;
        this.itemFrames.push(frame);

        // アイテム画像
        const icon = this.add.image(x, y, id)
          .setScale(0.17)
          .setDepth(11);

        // クリックでポップアップ
        frame.on("pointerdown", () => {
          if (this.itemHelpActive) {
            this.hideItemHelpOverlay();
          }
          this.showPopup(id);
        });

        index++;
      });

      // 条件を満たしていればチュートリアル表示
      const helpShown = localStorage.getItem("itemHelpShown") === "true";
      if (!helpShown && ownedItems.length > 0) {
        this.showItemHelpOverlay();
      }
    }

    // 戻るボタン
    const backBtn = this.add.image(400, 540, "back_button")
      .setInteractive({ useHandCursor: true })
      .setScale(0.8);

    // ホバー演出
    backBtn.on("pointerover", () => {
      this.tweens.add({
        targets: backBtn,
        scale: 0.9,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });
    backBtn.on("pointerout", () => {
      this.tweens.add({
        targets: backBtn,
        scale: 0.8,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });

    // クリックでホームへ戻る
    backBtn.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      backBtn.disableInteractive();

      this.tweens.add({
        targets: backBtn,
        scale: 0.7,
        duration: 120,
        yoyo: true
      });

      this.time.delayedCall(200, () => {
        this.scene.start("HomeScene");
      });
    });

  }

  showPopup(id) {
    const RECYCLE_SOURCE_TEXTURE = {
      // ペットボトルからリサイクルされたアイテム
      pet_juice: "petbottle",
      rucksack: "petbottle",
      ruler: "petbottle",
      jersey: "petbottle",

      // 缶からリサイクルされたアイテム
      fan: "can",
      bike: "can",
      clock: "can",

      // ビンからリサイクルされたアイテム
      glass_juice: "bottle",
      bead: "bottle",
      cup: "bottle"
    };

    //暗幕
    const dim = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.55)
      .setDepth(50)
      .setInteractive();

    //パネル
    const panel = this.add.rectangle(400, 300, 500, 380, 0xffffff)
      .setDepth(51)
      .setStrokeStyle(4, 0x666666)
      .setInteractive();

    //アイテム画像
    const img = this.add.image(400, 220, id)
      .setDepth(52)
      .setScale(0.35);
    // リサイクル元の資源ごみ画像
    const srcKey = RECYCLE_SOURCE_TEXTURE[id];
    let srcImg = null;


    if (srcKey) {
      // アイテム画像の左側に配置
      srcImg = this.add.image(240, 150, srcKey)
        .setDepth(52)
        .setScale(0.13);



    }
    let reImg = null;
    reImg = this.add.image(265, 220, "recycling_arrow").setDisplaySize(800, 600).setDepth(52).setScale(0.28);






    //リンク用データ
    const linkData = {
      pet_juice: "https://www.asahi.com/sdgs/article/14879392",
      rucksack: "https://www.youtube.com/watch?v=MBv-IQ8bpDI",
      jersey: "https://www.youtube.com/watch?v=MBv-IQ8bpDI",
      glass_juice: "https://www.asahi.com/sdgs/article/14879392",
      cup: "https://prtimes.jp/main/html/rd/p/000000001.000117550.html"
    };

    const descriptionData = {
      pet_juice: "あつめられたペットボトルから、あたらし\nいペットボトルが作られることもあるよ。\nこれを「水平リサイクル」とよぶよ。",
      rucksack: "ペットボトルからリサイクルされたリュッ\nクサック。\nペットボトルから作られたポリエステルの\n糸は、じょうぶで、水分をすいにくいの\nで、かわきやすいよ！",
      ruler: "ペットボトルからリサイクルされたものさ\nし。\nプラスチックでできているぶんぼうぐはペ\nットボトルからリサイクルされているもの\nもあるよ。",
      jersey: "あつめられたペットボトルは、あらってこ\nまかいフレークにくだかれるよ。そのフレ\nークをさらにとかして、ほそい糸のように\nするよ。できあがった糸をあつめて布にす\nると、ジャージやバッグなど、新しい「も\nの」としてうまれかわることができるよ。",
      fan: "缶からリサイクルされたせんぷうき。スチ\nール缶はモーターのぶひんにリサイクルさ\nれることもあるよ。\nせんぷうきのほかも、かでんの部品になっ\nて、生活をささえているよ。",
      bike: "アルミ缶やスチール缶はリサイクルされて\nじてんしゃの部品になることもありるよ。\nアルミ缶1000個で１台のじてんしゃがかん\nせいするよ。\n※12kgの自転車で全部品がアルミで作られ\nているとした場合。",
      clock: "缶からリサイクルされた目ざましどけい。\nスチール缶はモーターの部品にリサイクル\nされることもあるよ。",
      glass_juice: "あつめられたビンから、あたらしいビンが\n作られることもあるよ。\nこれを「水平リサイクル」とよぶよ。",
      bead: "ビンからリサイクルされたビー玉。\nビー玉い外にもたてものの、だんねつざい\nなどにリサイクルされているよ",
      cup: "ビンからリサイクルされたガラスコップ。\nコップ以外にもたてものの、だんねつざい\nなどにリサイクルされているよ"
    };
    const descFrame = this.add.image(400, 380, "desc_frame")
      .setDepth(51)
      .setScale(0.6);


    //説明テキスト
    const baseText = this.add.text(230, 375, descriptionData[id] || "", {
      fontSize: "18px",
      color: "#333",
      wordWrap: { width: 380 },
      padding: { top: 10, bottom: 0 }
    }).setDepth(52).setOrigin(0, 0.5);

    // URLが存在するアイテムだけURLリンクを表示する
    const url = linkData[id];

    let linkLabel = null;
    let linkText = null;

    if (url) {

      linkLabel = this.add.text(
        235,
        443,
        "くわしくはこちら↓",
        {
          fontSize: "15px",
          color: "#333",
          padding: { top: 10, bottom: 0 }
        }
      )
        .setDepth(52)
        .setOrigin(0, 0.5);

      linkText = this.add.text(
        235,
        460,
        url,
        {
          fontSize: "18px",
          color: "#00aaff",
          fontStyle: "underline"
        }
      )
        .setInteractive({ useHandCursor: true })
        .setDepth(52)
        .setOrigin(0, 0.5);

      // クリックでサイトを開く
      linkText.on("pointerdown", () => window.open(url, "_blank"));
      linkText.on("pointerover", () => linkText.setColor("#55ccff"));
      linkText.on("pointerout", () => linkText.setColor("#00aaff"));
    }


    if (linkText) {

      linkText.on("pointerdown", () => {
        const url = linkData[id];
        if (url) window.open(url, "_blank");
      });

      linkText.on("pointerover", () => linkText.setColor("#55ccff"));
      linkText.on("pointerout", () => linkText.setColor("#00aaff"));
    }


    //ポップアップを解除するとき削除する
    dim.once("pointerdown", () => {
      dim.destroy();
      panel.destroy();
      img.destroy();
      reImg.destroy();

      baseText.destroy();
      descFrame.destroy();
      if (linkLabel) linkLabel.destroy();
      if (linkText) linkText.destroy();
      if (srcImg) srcImg.destroy();
    });


    // パネル内クリックは反応させず閉じない
    panel.on("pointerdown", (e) => {
      e.stopPropagation();
    });
  }

}

class FireScene extends Phaser.Scene {
  constructor() {
    super("FireScene");
  }

  preload() {
    this.load.audio("fire_bgm", "assets/bgm/fire_bgm.mp3"); // ← 追加
  }

  create() {
    // ★ FireSceneに移った瞬間からBGM再生
    this.fireBgm = this.sound.add("fire_bgm", {
      volume: 0.5,
      loop: true
    });
    this.fireBgm.play();

    // ★ シーン終了時に必ずBGM停止
    this.events.once("shutdown", () => {
      if (this.fireBgm) {
        this.fireBgm.stop();
        this.fireBgm.destroy();
        this.fireBgm = null;
      }
    });

    this.cameras.main.setBackgroundColor("#000");

    const video = this.add.video(400, 300, "battery_fire");
    video.setScale(0.56);
    video.play();

    video.on("complete", () => {
      this.showBackButton();
    });
  }

  shutdown() {
    const video = document.getElementById("fireVideo");
    if (video) video.style.display = "none";
  }

  showBackButton() {
    const btn = this.add.image(400, 500, "back_button")
      .setInteractive({ useHandCursor: true })
      .setScale(0.8);

    btn.on("pointerover", () => {
      this.tweens.add({ targets: btn, scale: 0.9, duration: 150 });
    });

    btn.on("pointerout", () => {
      this.tweens.add({ targets: btn, scale: 0.8, duration: 150 });
    });

    btn.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      btn.disableInteractive();

      // ★ 戻るボタン押下でBGM停止
      if (this.fireBgm) {
        this.fireBgm.stop();
        this.fireBgm.destroy();
        this.fireBgm = null;
      }

      this.tweens.add({
        targets: btn,
        scale: 0.7,
        duration: 100,
        yoyo: true,
      });

      this.time.delayedCall(200, () => {
        this.scene.start("HomeScene");
      });
    });
  }
}

class SetScene extends Phaser.Scene {
  constructor() {
    super("SetScene");
  }
  saveSortTableToLocalStorage() {
    try {
      // SORT_TABLE 全体をそのまま JSON 化して保存
      localStorage.setItem("sortTable", JSON.stringify(SORT_TABLE));
      console.log("sortTable saved:", SORT_TABLE);
    } catch (e) {
      console.warn("Failed to save sortTable", e);
    }
  }

  preload() {
    this.load.image("logreset_button", "assets/ui/logreset_button.png");
    this.load.image("output_button", "assets/ui/output_button.png");
    this.load.image("set_bg", "assets/backgrounds/set_bg.png");
    this.load.image("back_button", "assets/ui/back_button.png");
    this.load.image("save_button", "assets/ui/save_button.png");
    this.load.image("howtoset_button", "assets/ui/howtoset_button.png");
  }

  //  「◯」切り替え
  toggleCell(item, category) {
    if (!SORT_TABLE[item]) SORT_TABLE[item] = {};
    if (!this.circleTexts[item]) this.circleTexts[item] = {};

    CATEGORIES.forEach(cat => {
      const isSelected = (cat === category);
      // データ更新
      SORT_TABLE[item][cat] = isSelected;
      // 表示更新
      const textObj = this.circleTexts[item][cat];
      if (textObj) {
        textObj.setText(isSelected ? "◯" : "");
      }
    });
  }

  //  区分名編集
  startEditCategory(colIndex, textObj) {
    // 既に別の入力欄があれば消す
    if (this.editInput) {
      this.editInput.remove();
      this.editInput = null;
    }

    const oldLabel =
      (this.categoryNames && this.categoryNames[colIndex]) ||
      CATEGORIES[colIndex];

    const canvas = this.game.canvas;
    const canvasRect = canvas.getBoundingClientRect();
    const bounds = textObj.getBounds(); // ゲーム座標上の矩形

    const input = document.createElement("input");
    input.type = "text";
    input.value = oldLabel;
    input.maxLength = 20;
    Object.assign(input.style, {
      position: "absolute",
      left: canvasRect.left + bounds.x + "px",
      top: canvasRect.top + bounds.y + "px",
      width: bounds.width + 20 + "px",
      height: bounds.height + "px",
      fontSize: "14px",
      fontFamily: "sans-serif",
      padding: "2px 6px",
      border: "1px solid #333",
      boxSizing: "border-box",
      zIndex: 9999,
    });

    document.body.appendChild(input);
    this.editInput = input;

    input.focus();
    input.select();

    const finish = (apply) => {
      if (!this.editInput) return; // 既に削除済みなら何もしない

      if (apply) {
        const newLabel =
          input.value.trim().length > 0 ? input.value.trim() : oldLabel;

        // 表示用の区分名を更新
        this.categoryNames[colIndex] = newLabel;
        textObj.setText(newLabel);

        // ローカルストレージに保存
        try {
          localStorage.setItem(
            "categoryNames",
            JSON.stringify(this.categoryNames)
          );
        } catch (e) {
          console.warn("Failed to save categoryNames", e);
        }
      }

      input.remove();
      this.editInput = null;
    };


    input.addEventListener("blur", () => finish(true));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        finish(true);
      } else if (e.key === "Escape") {
        finish(false);
      }
    });
  }

  // ゴミ名＋画像編集
  startEditItem(itemName, nameTextObj) {
    // 既に別の編集ポップアップが出ていたら閉じる
    if (this.itemEditInput) {
      this.itemEditInput.remove();
      this.itemEditInput = null;
    }
    if (this.itemEditDrop) {
      this.itemEditDrop.remove();
      this.itemEditDrop = null;
    }

    const canvas = this.game.canvas;
    const canvasRect = canvas.getBoundingClientRect();

    const displayName = getItemDisplayName(itemName);
    const textureKey = ITEM_NAME_TO_TEXTURE_KEY[itemName];

    const dim = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.55)
      .setDepth(400)
      .setInteractive();

    const panel = this.add.rectangle(400, 300, 520, 260, 0xffffff, 1)
      .setStrokeStyle(3, 0x666666)
      .setDepth(401)
      .setInteractive();

    // ラベル
    const title = this.add.text(400, 180, "ごみの名称と画像の設定", {
      fontSize: "20px",
      color: "#333",
      fontStyle: "bold",
      padding: { top: 10, bottom: 0 }
    }).setOrigin(0.5).setDepth(402);

    const nameLabel = this.add.text(280, 240, "現在の名前：", {
      fontSize: "16px",
      color: "#333",
      padding: { top: 10, bottom: 0 }
    }).setOrigin(1, 0.5).setDepth(402);

    const currentNameText = this.add.text(285, 240, displayName, {
      fontSize: "16px",
      color: "#000",
      padding: { top: 10, bottom: 0 }
    }).setOrigin(0, 0.5).setDepth(402);

    const imgLabel = this.add.text(280, 315, "現在の画像：", {
      fontSize: "16px",
      color: "#333",
      padding: { top: 10, bottom: 0 }
    }).setOrigin(1, 0.5).setDepth(402);

    // const frame = this.add.image(180, 320, "char_frame")
    //   .setDepth(402)
    //   .setScale(0.4)
    //   .setOrigin(0, 0.5);

    const preview = this.add.image(280, 320, textureKey)
      .setDepth(402)
      .setScale(0.18)
      .setOrigin(0, 0.5);

    // 保存ボタン
    const saveBtn = this.add.image(400, 400, "save_button")
      .setDepth(402)
      .setScale(0.6)
      .setInteractive({ useHandCursor: true });

    // パネル内のクリックは暗幕に伝播させない
    panel.on("pointerdown", (e) => e.stopPropagation());

    // DOM 側名前入力ボックス＋画像ドロップエリア

    // 名前入力
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = displayName;
    nameInput.maxLength = 20;

    Object.assign(nameInput.style, {
      position: "absolute",
      left: (canvasRect.left + 425) + "px",
      top: (canvasRect.top + 232) + "px",
      width: "180px",
      height: "28px",
      fontSize: "14px",
      fontFamily: "sans-serif",
      padding: "2px 6px",
      border: "1px solid #333",
      boxSizing: "border-box",
      zIndex: 9999,
    });

    document.body.appendChild(nameInput);
    this.itemEditInput = nameInput;
    nameInput.focus();
    nameInput.select();

    // 画像ドロップエリア
    const drop = document.createElement("div");
    drop.textContent = "ここに画像ファイルを\nドラッグ＆ドロップ";
    Object.assign(drop.style, {
      position: "absolute",
      left: (canvasRect.left + 425) + "px",
      top: (canvasRect.top + 280) + "px",
      width: "180px",
      height: "80px",
      fontSize: "13px",
      fontFamily: "sans-serif",
      whiteSpace: "pre",
      textAlign: "center",
      lineHeight: "1.4",
      border: "2px dashed #666",
      borderRadius: "8px",
      padding: "8px",
      boxSizing: "border-box",
      backgroundColor: "#fafafa",
      zIndex: 9999,
    });

    document.body.appendChild(drop);
    this.itemEditDrop = drop;

    // ドロップで読み込んだ画像データ
    let pendingImageDataUrl = null;

    drop.addEventListener("dragover", (e) => {
      e.preventDefault();
      drop.style.backgroundColor = "#eef";
    });

    drop.addEventListener("dragleave", (e) => {
      e.preventDefault();
      drop.style.backgroundColor = "#fafafa";
    });

    drop.addEventListener("drop", (e) => {
      e.preventDefault();
      drop.style.backgroundColor = "#fafafa";

      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert("画像ファイルをドロップしてください。");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        pendingImageDataUrl = reader.result; // Base64
        drop.textContent = "画像を読み込みました";
      };
      reader.readAsDataURL(file);
    });

    // ポップアップを閉じる共通処理
    const closePopup = () => {
      dim.destroy();
      panel.destroy();
      title.destroy();
      nameLabel.destroy();
      currentNameText.destroy();
      imgLabel.destroy();
      preview.destroy();
      saveBtn.destroy();
      //frame.destroy();

      if (this.itemEditInput) {
        this.itemEditInput.remove();
        this.itemEditInput = null;
      }
      if (this.itemEditDrop) {
        this.itemEditDrop.remove();
        this.itemEditDrop = null;
      }
    };

    // 暗幕クリック → キャンセル
    dim.on("pointerdown", () => {
      closePopup();
    });

    // 保存ボタン押下
    saveBtn.on("pointerdown", () => {
      // 1) 名前を保存
      const newLabel = nameInput.value.trim() || itemName;
      setItemDisplayName(itemName, newLabel);
      nameTextObj.setText(newLabel); // 表にも即反映

      // 2) 画像がドロップされていればテクスチャ差し替え
      if (pendingImageDataUrl && textureKey) {
        setCustomItemImageData(textureKey, pendingImageDataUrl);
        // このシーン内のテクスチャを差し替え
        applyCustomItemTexturesToScene(this);
        // プレビューも更新
        preview.setTexture(textureKey);
      }

      closePopup();
    });
  }



  drawTable() {
    const startX = 180;   // 表の左上(X)
    const startY = 110;   // 表の左上(Y)
    const cellW = 110;
    const cellH = 36;

    // ◯テキストの入れ物
    this.circleTexts = {};
    this.tableContainer = this.add.container(0, 0);

    //ヘッダ Text と背景を保持
    this.categoryTexts = [];
    this.categoryBg = [];

    // 列ヘッダ
    CATEGORIES.forEach((category, col) => {
      const label =
        (this.categoryNames && this.categoryNames[col]) || category;

      const x = startX + col * cellW;
      const y = startY - 30;

      // 背景用
      const bg = this.add.graphics();

      const headerText = this.add.text(
        x,
        y,
        label,
        {
          fontSize: "14px",
          color: "#000",
          align: "center",
          wordWrap: { width: cellW },
          padding: { top: 10, bottom: 0 }
        }
      )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
      //テキストのサイズに合わせて角丸の背景を描く
      const paddingX = 12;
      const paddingY = 3;
      const bounds = headerText.getBounds();

      bg.fillStyle(0xc0c0c0, 1);
      bg.fillRoundedRect(
        bounds.x - paddingX / 2,
        bounds.y - paddingY / 2,
        bounds.width + paddingX,
        bounds.height + paddingY,
        8
      );

      // ダブルクリック検出
      headerText.colIndex = col;
      headerText.lastClickTime = 0;

      headerText.on("pointerdown", () => {
        const now = this.time.now;
        if (now - headerText.lastClickTime < 300) {
          this.startEditCategory(headerText.colIndex, headerText);
        }
        headerText.lastClickTime = now;
      });

      this.categoryTexts[col] = headerText;
      this.categoryBg[col] = bg;
    });


    //ごみ名
    ITEMS.forEach((item, row) => {
      const y = startY + row * cellH;

      // ◯テキスト用の行を初期化
      this.circleTexts[item] = this.circleTexts[item] || {};

      // ユーザーが変更した名前を反映
      const displayName = getItemDisplayName(item);

      const nameBg = this.add.graphics();

      // ゴミ名テキスト
      const nameText = this.add.text(20, y, displayName, {
        fontSize: "14px",
        color: "#000",
        padding: { top: 10, bottom: 0 }
      }).setOrigin(0, 0.5);

      // テキストサイズに合わせて丸角背景を描く
      const paddingX = 8;
      const paddingY = 3;
      const nameBounds = nameText.getBounds();

      nameBg.fillStyle(0xc0c0c0, 1);
      nameBg.fillRoundedRect(
        nameBounds.x - paddingX / 2,
        nameBounds.y - paddingY / 2,
        nameBounds.width + paddingX,
        nameBounds.height + paddingY,
        8
      );
      this.tableContainer.add(nameBg);
      this.tableContainer.add(nameText);

      // 缶・ビン・ペットボトルは編集できない
      const uneditableItems = ["缶", "ビン", "ペットボトル"];

      if (!uneditableItems.includes(item)) {
        nameText.setInteractive({ useHandCursor: true });
        nameText.lastClickTime = 0;

        // ダブルクリックでゴミ編集ポップアップを開く
        nameText.on("pointerdown", () => {
          const now = this.time.now;
          if (now - nameText.lastClickTime < 300) {
            this.startEditItem(item, nameText);
          }
          nameText.lastClickTime = now;
        });
      }

      CATEGORIES.forEach((category, col) => {
        const x = startX + col * cellW;

        const rect = this.add.rectangle(
          x, y,
          cellW - 4, cellH - 4,
          0xffffff
        )
          .setStrokeStyle(1, 0x999999)
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true });

        rect.itemName = item;
        rect.categoryName = category;

        rect.on("pointerdown", () => {
          this.toggleCell(rect.itemName, rect.categoryName);
        });

        this.tableContainer.add(rect);

        const hasCircle = !!(SORT_TABLE[item] && SORT_TABLE[item][category]);
        const circleText = this.add.text(x, y, hasCircle ? "◯" : "", {
          fontSize: "20px",
          color: "#d32f2f",

          padding: { top: 10, bottom: 0 }
        }).setOrigin(0.5);

        this.tableContainer.add(circleText);
        this.circleTexts[item][category] = circleText;
      });
    });


  }


  openHowtoSetPopup() {

    // 暗幕
    const dim = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.55)
      .setDepth(300)
      .setInteractive();

    // 1ページ目
    const page1 = this.add.image(400, 300, "howtoset_page1")
      .setDepth(301)
      .setScale(0.6);

    // 右矢印
    const arrowRight = this.add.image(730, 300, "arrow_right")
      .setDepth(302)
      .setScale(0.3)
      .setInteractive({ useHandCursor: true });

    // 2ページ目（最初は非表示）
    const page2 = this.add.image(400, 300, "howtoset_page2")
      .setDepth(301)
      .setScale(0.6)
      .setVisible(false);

    // 左矢印（最初は非表示）
    const arrowLeft = this.add.image(70, 300, "arrow_left")
      .setDepth(302)
      .setScale(0.3)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    // ページ切り替え
    arrowRight.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      page1.setVisible(false);
      arrowRight.setVisible(false);
      page2.setVisible(true);
      arrowLeft.setVisible(true);
    });

    arrowLeft.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      page2.setVisible(false);
      arrowLeft.setVisible(false);
      page1.setVisible(true);
      arrowRight.setVisible(true);
    });

    // 画像・矢印クリックでは閉じない
    page1.on("pointerdown", e => e.stopPropagation());
    page2.on("pointerdown", e => e.stopPropagation());
    arrowLeft.on("pointerdown", e => e.stopPropagation());
    arrowRight.on("pointerdown", e => e.stopPropagation());

    // 暗幕クリックで閉じる
    dim.on("pointerdown", () => {
      dim.destroy();
      page1.destroy();
      page2.destroy();
      arrowLeft.destroy();
      arrowRight.destroy();
    });
  }


  create() {



    const btnOutput = this.add.image(670, 25, "output_button")
      .setScale(0.3)
      .setDepth(202)
      .setInteractive({ useHandCursor: true });

    btnOutput.on("pointerover", () => {
      this.tweens.add({
        targets: btnOutput,
        scale: 0.35,
        duration: 120
      });
    });

    btnOutput.on("pointerout", () => {
      this.tweens.add({
        targets: btnOutput,
        scale: 0.3,
        duration: 120
      });
    });

    btnOutput.on("pointerdown", () => {

      this.sound.play("button_click", { volume: 0.6 });
      exportSortLogsToCsv();

    });


    const BtnReset = this.add.image(55, 25, "logreset_button")
      .setScale(0.37)
      .setDepth(202)
      .setInteractive({ useHandCursor: true });

    BtnReset.on("pointerover", () => {
      this.tweens.add({
        targets: BtnReset,
        scale: 0.4,
        duration: 120
      });
    });

    BtnReset.on("pointerout", () => {
      this.tweens.add({
        targets: BtnReset,
        scale: 0.36,
        duration: 120
      });
    });

    BtnReset.on("pointerdown", () => {

      this.sound.play("button_click", { volume: 0.6 });
      resetSortLogs();
    });






    //表示する区分名をロード
    const saved = localStorage.getItem("categoryNames");
    if (saved) {
      try {
        this.categoryNames = JSON.parse(saved);
      } catch (e) {
        this.categoryNames = [...CATEGORIES];
      }
    } else {
      this.categoryNames = [...CATEGORIES];
    }

    // スクロールボタン
    this.scrollTop = 0;
    this.viewHeight = 300;
    this.contentHeight = ITEMS.length * 36;
    this.minScrollY = Math.min(0, this.viewHeight - this.contentHeight);

    const upBtn = this.add.text(680, 200, "▲", {
      fontSize: "50px",
      color: "#333",
      padding: { top: 10, bottom: 0 }
    }).setInteractive({ useHandCursor: true }).setDepth(20);

    const downBtn = this.add.text(680, 260, "▼", {
      fontSize: "50px",
      color: "#333"
    }).setInteractive({ useHandCursor: true }).setDepth(20);

    const SCROLL_STEP = 40;
    upBtn.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      this.scrollTop = Math.min(this.scrollTop + SCROLL_STEP, 0);
      this.tableContainer.y = this.scrollTop;
    });
    downBtn.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      this.scrollTop = Math.max(this.scrollTop - SCROLL_STEP, this.minScrollY);
      this.tableContainer.y = this.scrollTop;
    });

    // 背景
    this.add.image(400, 300, "set_bg")
      .setDisplaySize(800, 600);

    // タイトル
    this.add.text(400, 40, "管理画面", {
      fontSize: "32px",
      color: "#333",
      fontStyle: "bold",
      padding: { top: 10, bottom: 0 }
    }).setOrigin(0.5);

    const howtoBtn = this.add.image(745, 25, "howtoset_button")
      .setScale(0.4)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    // ホバー演出
    howtoBtn.on("pointerover", () => {
      this.tweens.add({
        targets: howtoBtn,
        scale: 0.45,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });
    howtoBtn.on("pointerout", () => {
      this.tweens.add({
        targets: howtoBtn,
        scale: 0.4,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });

    howtoBtn.on("pointerdown", () => {
      this.sound.play("button_click", { volume: 0.6 });
      this.openHowtoSetPopup();
    });



    // 表描画
    this.drawTable();

    // 戻るボタン
    const backBtn = this.add.image(400, 540, "back_button")
      .setScale(0.8)
      .setInteractive({ useHandCursor: true });

    backBtn.on("pointerover", () => {
      this.tweens.add({
        targets: backBtn,
        scale: 0.9,
        duration: 120
      });
    });

    backBtn.on("pointerout", () => {
      this.tweens.add({
        targets: backBtn,
        scale: 0.8,
        duration: 120
      });
    });

    backBtn.on("pointerdown", () => {
      backBtn.disableInteractive();
      this.saveSortTableToLocalStorage();
      this.tweens.add({
        targets: backBtn,
        scale: 0.7,
        duration: 120,
        yoyo: true
      });
      this.time.delayedCall(200, () => {
        this.scene.start("HomeScene");
      });
    });
  }
}




const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',

  backgroundColor: '#e0f7fa',
  scene: [HomeScene, StartScene, GameScene, ResultScene, ItemScene, FireScene, SetScene]
};

new Phaser.Game(config);