
//定義データ

const CATEGORIES = [
  "普通ごみ",
  "資源ごみ",
  "プラスチック資源",
  "古紙衣類",
  "バッテリー類"
];

const ITEMS = {
  "普通ごみ": ["魚の骨", "靴", "皿", "グローブ", "メガネ"],
  "資源ごみ": ["缶", "ビン", "ペットボトル"],
  "プラスチック資源": ["カップ麺の容器", "パック", "タッパー", "ペットボトルのキャップ"],
  "古紙衣類": ["新聞紙", "段ボール", "紙パック", "衣類"],
  "バッテリー類": ["バッテリー", "ハンディファン"]
};
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
  pet: 0,      // ペットボトル
  can: 0,      // 缶
  bottle: 0,   // ビン
};
//所持アイテムデータ
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];

class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene');
  }

  preload() {
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
      page1.setVisible(false);
      arrowRight.setVisible(false);
      page2.setVisible(true);
      arrowLeft.setVisible(true);
    });

    arrowLeft.on("pointerdown", () => {
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
      "rucksack"
    ];

    const ITEM_POS = {
      fan: { x: 240, y: 420, scale: 0.22 },
      bike: { x: 58, y: 503, scale: 0.8 },
      clock: { x: 525, y: 330, scale: 0.13 },
      cup: { x: 463, y: 513, scale: 0.11 },
      glass_juice: { x: 500, y: 478, scale: 0.14 },
      pet_juice: { x: 530, y: 489, scale: 0.14 },
      rucksack: { x: 670, y: 500, scale: 0.2 }
    };


    for (const key of HOME_ITEMS) {

      // 所持していなければ表示しない
      if (!owned.includes(key)) continue;

      // テクスチャ名の変換
      const texture = (key === "bike") ? "bike_home" : key;

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
    const btnChallenge = this.add.text(310, 225, "● 分別チャレンジ", {
      fontSize: "22px",
      color: "#00796b",
      padding: { top: 10, bottom: 0 }
    }).setInteractive({ useHandCursor: true }).setDepth(202);

    btnChallenge.on('pointerdown', () => {
      this.scene.start('StartScene');
    });

    // アイテム一覧
    const btnItems = this.add.text(310, 285 ,"● アイテム一覧", {
      fontSize: "22px",
      color: "#444",
      padding: { top: 10, bottom: 0 }
    }).setInteractive({ useHandCursor: true }).setDepth(202);

    btnItems.on('pointerdown', () => {
      this.scene.start('ItemScene');
    });

    // あそびかた（テキスト形式）
    const btnHowTo = this.add.text(310, 345, "● あそびかた", {
      fontSize: "22px",
      color: "#444",
      padding: { top: 10, bottom: 0 }
    })
      .setInteractive({ useHandCursor: true })
      .setDepth(202);

    // クリック → HomeScene の遊び方ポップアップを開く
    btnHowTo.on("pointerdown", () => {
      this.openHowtoPopup(false); // false = 初回じゃない
    });


    // 背景クリックで閉じる
    bg.on('pointerdown', () => {
      bg.destroy();
      panel.destroy();
      btnChallenge.destroy();
      btnItems.destroy();
      btnHowTo.destroy();
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
    this.load.image('fishbone', 'assets/trash/fishbone.png');
    this.load.image('shoe', 'assets/trash/shoe.png');
    this.load.image('plate', 'assets/trash/plate.png');
    this.load.image('glove', 'assets/trash/glove.png');
    this.load.image('glasses', 'assets/trash/glasses.png');
    this.load.image('can', 'assets/trash/can.png');
    this.load.image('bottle', 'assets/trash/bottle.png');
    this.load.image('petbottle', 'assets/trash/petbottle.png');
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

  }



  create() {

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
          currentDifficulty = key;
          this.showDifficultyMark(btn);
        });

      this.difficultyButtons.push(btn);
      y += 50;
    }
    // 初期マーク表示
    this.showDifficultyMark(this.difficultyButtons[0]);


    // 戻るボタン
    const backBtn = this.add.image(490, 280, "back_button")
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



    const startBtn = this.add.image(490, 354, 'start_button')
      .setInteractive({ useHandCursor: true })
      .setScale(0.7);

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
        scale: 0.7,
        duration: 120
      });
    });

    // クリック時のズーム演出シーン
    startBtn.on('pointerdown', () => {
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
    this.load.image("char_frame", "assets/ui/char_frame.png");

  }

  init(data) {
    // StartScene から渡されたデータを受け取る
    this.difficultyKey = data.difficulty || "easy";
    this.settings = DIFFICULTY_SETTINGS[this.difficultyKey];
  }





  create() {
    //上部の帯状エリア
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
    this.bubble = this.add.image(540, 60, "bubble")
      .setDepth(103)
      .setScale(0.38)
      .setVisible(false);

    this.bubbleText = this.add.text(452, 38, "", {
      fontSize: "16px",
      color: "#000",
      fontStyle: "bold",
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

      // 一定時間後に normal へ戻す
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
    this.scoreText = this.add.text(660, 20, "スコア: 0", { fontSize: "24px", color: "#000", padding: { top: 10, bottom: 0 } }).setDepth(102);



    // 分別エリア数を難易度に応じて制限
    const categoryCount = this.settings.categories;
    const selectedCategories = CATEGORIES.slice(0, categoryCount);

    this.trashGroup = this.add.group();
    this.dropZones = [];

    // カテゴリと画像キーの対応表
    const binImages = {
      "普通ごみ": "bin_normal",
      "資源ごみ": "bin_recycle",
      "プラスチック資源": "bin_plastic",
      "古紙衣類": "bin_paper",
      "バッテリー類": "bin_battery"
    };

    for (let i = 0; i < selectedCategories.length; i++) {
      const category = selectedCategories[i];
      const x = 82 + i * 150;
      const y = 510;

      // ゴミ箱画像
      const bin = this.add.image(x, y, binImages[category]).setScale(0.7);
      bin.setData("category", category);

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
      const correct = obj.category === zone.getData("category");
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

          // 火災動画シーンへ遷移
          this.scene.start("FireScene");

          return;
        }
      }

      if (correct) {
        // キャラクターの正解リアクション
        this.showChar("char_happy", 2000);

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

        // 5回以上連続成功で Perfect → +2
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
        this.combo = 0;
        //　不正解リアクション
        if (this.difficultyKey === "easy") {

          const wrongName = obj.texture.key;// 失敗したゴミ
          const categoryCorrectKanji = obj.category;

          // 表示名変換
          const DISPLAY_NAME = {
            fishbone: "魚の骨", shoe: "靴", plate: "皿",
            glove: "グローブ", glasses: "メガネ",
            can: "缶", bottle: "ビン", petbottle: "ペットボトル",
            cupramen: "カップ麺の容器", pack: "パック", tupper: "タッパー", cap: "キャップ",
            newspaper: "新聞紙", cardboard: "段ボール", kamipack: "紙パック", cloth: "衣類",
            battery: "バッテリー", handyfan: "ハンディファン"
          };
          const CATEGORY_HIRAGANA = {
            "普通ごみ": "ふつうゴミ",
            "資源ごみ": "しげんゴミ",
            "プラスチック資源": "プラスチックしげん",
            "古紙衣類": "かみ・ふく",
            "バッテリー類": "バッテリー"
          };
          const showItemName = DISPLAY_NAME[wrongName] || wrongName;
          const categoryHira = CATEGORY_HIRAGANA[categoryCorrectKanji] || categoryCorrectKanji;
          // 吹き出しテキスト
          const message = `${showItemName}は\n${categoryHira}だよ！`;

          // 3秒間 teach 表示
          this.showChar("char_teach", 3000, message);

        } else {

          // normal・hard は sad を2秒表示
          this.showChar("char_sad", 2000);
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
        if (this.timeLimit <= 0) this.scene.start("ResultScene");
      },
      loop: true
    });

    this.selectedCategories = selectedCategories;
  }


  spawnTrash() {
    const category = Phaser.Utils.Array.GetRandom(this.selectedCategories);
    const items = {
      "普通ごみ": ["fishbone", "shoe", "plate", "glove", "glasses"],
      "資源ごみ": ["can", "bottle", "petbottle"],
      "プラスチック資源": ["cupramen", "pack", "tupper", "cap"],
      "古紙衣類": ["newspaper", "cardboard", "kamipack", "cloth"],
      "バッテリー類": ["battery", "handyfan"]
    };
    const key = Phaser.Utils.Array.GetRandom(items[category]);

    const y = Phaser.Math.Between(180, 400);//ゴミが出現する範囲
    const trash = this.add.image(50, y, key).setScale(0.4);
    trash.displayWidth = 120;
    trash.scaleY = trash.scaleX;
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
          fontStyle: "bold"
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

    // 集中線（背面）
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

    // Nice! / Perfect!
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
    this.load.image("recycle_box", "assets/ui/recycle_box.png");
    this.load.image("best_update", "assets/char/best_update.png");
    this.load.image("spark", "assets/effects/spark.png");
    this.load.image("text_get", "assets/ui/text_get.png");
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




  create() {


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

    //  今回スコアがベストスコアを超えたか？
    const isBestUpdate = score > bestScore;

    // 表示するベストスコアは更新前の値
    this.add.text(442, 157, `${bestScore}`, {
      fontSize: '22px',
      color: '#000',
      fontStyle: "bold"
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
    }








  }
}
class ItemScene extends Phaser.Scene {
  constructor() {
    super('ItemScene');
  }

  preload() {
    this.load.image("item_bg", "assets/backgrounds/item_bg.png");
    this.load.image("item_frame", "assets/ui/item_frame.png");
    this.load.image("desc_frame", "assets/ui/desc_frame.png");
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

        // アイテム画像
        const icon = this.add.image(x, y, id)
          .setScale(0.17)
          .setDepth(11);

        // クリックでポップアップ
        frame.on("pointerdown", () => this.showPopup(id));


        index++;
      });
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



    //リンク用データ
    const linkData = {
      pet_juice: "https://www.asahi.com/sdgs/article/14879392",
      rucksack: "https://www.youtube.com/watch?v=MBv-IQ8bpDI",
      jersey: "https://www.youtube.com/watch?v=MBv-IQ8bpDI",
      glass_juice: "https://www.asahi.com/sdgs/article/14879392",
      cup: "https://prtimes.jp/main/html/rd/p/000000001.000117550.html"
    };

    const descriptionData = {
      pet_juice: "回収されたペットボトルから、あたらしい\nペットボトルが作られることもあります。\nこれを「水平リサイクル」と呼びます。",
      rucksack: "ペットボトルからリサイクルされたリュッ\nクサック。\nペットボトルから作られたポリエステル繊\n維は、耐久性が高く、水分を吸いにくいた\nめ、乾きやすいという特徴があります。",
      ruler: "ペットボトルからリサイクルされたものさ\nし。\nプラスチックでできている文房具はペット\nボトルからリサイクルされているものがあ\nります。",
      jersey: "回収されたペットボトルは、洗われて細か\nいフレークにくだかれます。そのフレーク\nをさらに溶かして、細い糸のようにしてい\nきます。できあがった糸をあつめて布にす\nると、ジャージやバッグなど、新しい製品\nとして生まれ変わることができます。",
      fan: "缶からリサイクルされた扇風機。スチール\n缶はモーターの部品にリサイクルされるこ\nともあります。\n扇風機以外にも家電の部品に再生され、生\n活を支えています。",
      bike: "アルミ缶やスチール缶はリサイクルされて\n自転車の部品になることもあります。\nアルミ缶約1000個で１台の自転車が完成し\nます。※12kgの自転車で全部品がアルミで\n作られているとした場合。",
      clock: "缶からリサイクルされた目覚まし時計。\nスチール缶はモーターの部品にリサイクル\nされることもあります。",
      glass_juice: "回収されたビンから、あたらしいビンが作\nられることもあります。\nこれを「水平リサイクル」と呼びます。",
      bead: "ビンからリサイクルされたビー玉。\nビー玉以外にも建物の断熱材などに再生さ\nれています",
      cup: "ビンからリサイクルされたガラスコップ。\nコップ以外にも建物の断熱材などに再生さ\nれています"
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
      baseText.destroy();
      descFrame.destroy();
      if (linkLabel) linkLabel.destroy();
      if (linkText) linkText.destroy();
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


  }


  create() {
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
    video.style.display = "none";
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
      btn.disableInteractive();

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


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '#e0f7fa',
  scene: [HomeScene, StartScene, GameScene, ResultScene, ItemScene, FireScene]
};

new Phaser.Game(config);