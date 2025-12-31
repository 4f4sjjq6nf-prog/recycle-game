
export const BGMManager = {
  bgm: null,
  currentKey: null,

  play(scene, key, config = {}) {
    // 同じBGMが流れていたら何もしない
    if (this.bgm && this.currentKey === key) return;

    // 別のBGMが流れていたら止める
    if (this.bgm) {
      this.bgm.stop();
      this.bgm.destroy();
      this.bgm = null;
    }

    this.bgm = scene.sound.add(key, {
      loop: true,
      volume: 0.4,
      ...config
    });

    this.bgm.play();
    this.currentKey = key;
  },

  stop() {
    if (this.bgm) {
      this.bgm.stop();
      this.bgm.destroy();
      this.bgm = null;
      this.currentKey = null;
    }
  }
};
