
// 定義データ

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
  "バッテリー類": ["バッテリー"]
};
// 難易度設定（スピード倍率と区分数の上限）
const DIFFICULTY_SETTINGS = {
  easy: { label: "かんたん", speedMultiplier: 1.0, categories: 3, spawnRate: 2500, missPoint: -2 },
  normal: { label: "ふつう", speedMultiplier: 1.0, categories: 4, spawnRate: 2000, missPoint: -3 },
  hard: { label: "むずかしい", speedMultiplier: 1.0, categories: 5, spawnRate: 1700, missPoint: -4 }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 現在の難易度をグローバルに保持
let currentDifficulty = "easy";

let score = 0;

// リサイクルゲージ集計用（GameScene の先頭に追加）
let recycleCounts = {
  pet: 0,      // ペットボトル
  can: 0,      // 缶
  bottle: 0,   // ビン
};
class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene');
  }

  preload() {
    this.load.image('menu_button', 'assets/ui/menu_button.png'); // ハンバーガーメニュー
    this.load.image('menu_bg', 'assets/ui/menu_bg.png'); // 半透明背景
  }

  create() {
    this.add.text(250, 260, "ホーム（生活演出）", {
      fontSize: "32px",
      color: "#333",
      padding: { top: 10, bottom: 0 }
    });


    // 右上のメニューボタン
    const menuBtn = this.add.image(760, 40, 'menu_button')
      .setInteractive({ useHandCursor: true })
      .setScale(0.3);





    // ホバー時：少し大きく
    menuBtn.on("pointerover", () => {
      this.tweens.add({
        targets: menuBtn,
        scale: 0.35,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });

    // ホバー解除：元に戻る
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
  }

  // メニューのポップアップ表示 
  openMenuPopup() {

    // 半透明の背景
    const bg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.4)
      .setInteractive();

    // メニューパネル
    const panel = this.add.rectangle(400, 300, 300, 200, 0xffffff, 1)
      .setStrokeStyle(3, 0x666666)
      .setInteractive();

    // 分別チャレンジ
    const btnChallenge = this.add.text(340, 260, "分別チャレンジ", {
      fontSize: "24px",
      color: "#00796b",
      padding: { top: 10, bottom: 0 }
    }).setInteractive({ useHandCursor: true });

    btnChallenge.on('pointerdown', () => {
      this.scene.start('StartScene');
    });

    // アイテム一覧
    const btnItems = this.add.text(340, 320, "アイテム一覧", {
      fontSize: "24px",
      color: "#444",
      padding: { top: 10, bottom: 0 }
    }).setInteractive({ useHandCursor: true });

    btnItems.on('pointerdown', () => {
      this.scene.start('ItemScene');
    });

    // 背景クリックで閉じる
    bg.on('pointerdown', () => {
      bg.destroy();
      panel.destroy();
      btnChallenge.destroy();
      btnItems.destroy();
    });
  }
}





// スタート画面

class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }
  preload() {
    // 各カテゴリごとに使用する画像を読み込み
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
  }
  create() {

    currentDifficulty = "easy";

    // 難易度選択マークを表示する関数
    this.showDifficultyMark = (btn) => {
      // 既存マークがあれば削除
      if (this.selectedMark) this.selectedMark.destroy();

      // 新しいマークを作成（ボタン左側に配置）
      this.selectedMark = this.add.image(btn.x - 20, btn.y + 13, 'check_icon')
        .setScale(0.45);
    };

    this.add.image(400, 300, 'start_bg').setDisplaySize(800, 600);


    // 画面中央上あたりに配置
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

    // 難易度ボタン生成
    this.difficultyButtons = []; // ボタン管理用配列
    this.selectedMark = null;    // 現在表示中のマーク

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

    // 初期マーク表示（デフォルト：かんたん）
    this.showDifficultyMark(this.difficultyButtons[0]);


    const startBtn = this.add.image(490, 354, 'start_button')
      .setInteractive({ useHandCursor: true }) 
      .setScale(0.7); // 必要に応じてサイズ調整

    // ホバー時アニメーション
    startBtn.on('pointerover', () => {
      startBtn.setScale(0.8);
    });
    startBtn.on('pointerout', () => {
      startBtn.setScale(0.7);
    });

    // クリック時のズーム演出シーン遷移
    startBtn.on('pointerdown', () => {
      // 二重クリック防止
      startBtn.disableInteractive();


      // クリック演出（少し押し込み）
      this.tweens.add({
        targets: startBtn,
        scale: 0.75,
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

    this.load.image("bin_normal", "assets/bins/bin_normal.png");
    this.load.image("bin_recycle", "assets/bins/bin_recycle.png");
    this.load.image("bin_plastic", "assets/bins/bin_plastic.png");
    this.load.image("bin_paper", "assets/bins/bin_paper.png");
    this.load.image("bin_battery", "assets/bins/bin_battery.png");
    this.load.image("spark", "assets/effects/spark.png");
  }

  init(data) {
    // StartScene から渡されたデータを受け取る
    this.difficultyKey = data.difficulty || "easy";
    this.settings = DIFFICULTY_SETTINGS[this.difficultyKey];
  }



  create() {


    //前回までの値を読み込む
    recycleCounts = JSON.parse(localStorage.getItem("recycleCounts")) || {
      pet: 0,
      can: 0,
      bottle: 0,
    };


    // UI
    this.timeLimit = 30;
    this.timerText = this.add.text(20, 20, "時間: 60", { fontSize: "24px", color: "#000", padding: { top: 10, bottom: 0 } });
    this.scoreText = this.add.text(650, 20, "スコア: 0", { fontSize: "24px", color: "#000", padding: { top: 10, bottom: 0 } });

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

      // 名前表示

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
        if (obj.texture.key === "battery" && !correct) {

          // このプレイで増えたゲージを破棄
          // 直前の localStorage の状態に戻す
          recycleCounts = JSON.parse(localStorage.getItem("recycleCounts")) || {
            pet: 0, can: 0, bottle: 0
          };

          // タイマーなど停止
          this.spawnTimer.remove(false);
          this.timerEvent.remove(false);

          // 火災動画シーンへ遷移
          this.scene.start("FireScene");

          return;
        }
      }
      if (correct) {
        // ゴミの種類によってゲージ加算
        const keyName = obj.texture.key;

        // 難易度ごとのゲージ加算量
        let add = 1; // easy のデフォルト
        if (this.difficultyKey === "normal") add = 2;
        if (this.difficultyKey === "hard") add = 4;

        // ゴミの種類によってゲージ加算
        if (keyName === "petbottle") recycleCounts.pet += add;
        if (keyName === "can") recycleCounts.can += add;
        if (keyName === "bottle") recycleCounts.bottle += add;

        // 保存
        localStorage.setItem("recycleCounts", JSON.stringify(recycleCounts));


        score += 5;
        this.scoreText.setText("スコア: " + score);

        // パーティクル（その場で成長→縮小）
        const bx = zone.x;
        const by = zone.y; // ゴミ箱の少し上

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
        this.tweens.add({
          targets: obj,
          x: 50,
          y: Phaser.Math.Between(100, 400),
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
      "バッテリー類": ["battery"]
    };
    const key = Phaser.Utils.Array.GetRandom(items[category]);

    const y = Phaser.Math.Between(100, 400);
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
          .setScale(0.1);  // 最初は小さく

        // 出現 縮小 消える
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


}



// リザルト画面

class ResultScene extends Phaser.Scene {

  preload() {

    this.load.image("icon_pet", "assets/ui/pet_icon.png");
    this.load.image("icon_can", "assets/ui/can_icon.png");
    this.load.image("icon_bottle", "assets/ui/bottle_icon.png");
    this.load.image("back_button", "assets/ui/back_button.png");
    this.load.image("result_bg", "assets/backgrounds/result_bg.png");
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
    this.add.text(x + width + 12, y - 12, `${value} / ${max}`, {
      fontSize: "20px",
      color: "#333",
      fontStyle: "bold"
    });

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




  create() {
    this.add.image(400, 300, 'result_bg').setDisplaySize(800, 600);



    this.add.text(450, 98, `${score}`, {
      fontSize: '28px', color: '#000000ff', padding: { top: 10, bottom: 0 }, fontStyle: "bold"
    });

    // セーブデータ読み込み
    const counts = JSON.parse(localStorage.getItem("recycleCounts")) || {
      pet: 0, can: 0, bottle: 0, plastic: 0
    };

    // アイコン対応表
    const gaugeIcons = {
      pet: "icon_pet",
      can: "icon_can",
      bottle: "icon_bottle",
    };

    const keys = ["pet", "can", "bottle"];

    let y = 170;

    for (let i = 0; i < 3; i++) {

      // ゲージを描画
      this.drawGauge(260, y, 300, 20, counts[keys[i]]);

      // アイコンを表示
      this.add.image(242, y, gaugeIcons[keys[i]])
        .setScale(0.4)
        .setOrigin(0.5);

      y += 70;
    }

    // タイトルに戻るボタン
    const backBtn = this.add.image(400, 400, "back_button")
      .setInteractive({ useHandCursor: true })
      .setScale(0.6);

    // ホバー時：少し大きく
    backBtn.on("pointerover", () => {
      this.tweens.add({
        targets: backBtn,
        scale: 0.7,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });

    // ホバー解除：元に戻る
    backBtn.on("pointerout", () => {
      this.tweens.add({
        targets: backBtn,
        scale: 0.6,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });

    // 押し込みシーン遷移
    backBtn.on("pointerdown", () => {

      backBtn.disableInteractive();  // 二度押し防止

      // 押し込みアニメーション
      this.tweens.add({
        targets: backBtn,
        scale: 0.6,
        duration: 120,
        yoyo: true,
        ease: "Sine.easeInOut"
      });

      // 少し待ってからシーン遷移
      this.time.delayedCall(250, () => {
        this.scene.start("HomeScene");
      });
    });



  }
}
class ItemScene extends Phaser.Scene {
  constructor() {
    super('ItemScene');
  }

  create() {
    this.add.text(250, 260, "アイテム一覧", {
      fontSize: "32px",
      color: "#333",
      padding: { top: 10, bottom: 0 }
    });

    const back = this.add.text(340, 360, "ホームに戻る", {
      fontSize: "22px",
      color: "#00796b",
      padding: { top: 10, bottom: 0 }
    }).setInteractive({ useHandCursor: true });

    back.on('pointerdown', () => {
      this.scene.start('HomeScene');
    });
  }
}
class FireScene extends Phaser.Scene {
  constructor() {
    super("FireScene");
  }

  preload() {
    this.load.video("battery_fire", "assets/video/battery_fire.mp4", true);
    this.load.image("back_button", "assets/ui/back_button.png");
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
      .setScale(0.6);

    btn.on("pointerover", () => {
      this.tweens.add({ targets: btn, scale: 0.7, duration: 150 });
    });

    btn.on("pointerout", () => {
      this.tweens.add({ targets: btn, scale: 0.6, duration: 150 });
    });

    btn.on("pointerdown", () => {
      btn.disableInteractive();

      this.tweens.add({
        targets: btn,
        scale: 0.5,
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