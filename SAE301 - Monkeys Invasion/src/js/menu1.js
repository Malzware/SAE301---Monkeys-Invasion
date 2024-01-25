import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: "menu1" });
  }

  preload() {}

  create() {
    // Fond du menu1
    var background = this.add.image(0, 0, "menu_fond");
    background.setOrigin(0, 0);

    // Bouton Mode Campagne
    var bouton_niveau1 = this.add.image(400, 350, "PlayNiveau1").setDepth(1);
    bouton_niveau1.setScale(0.1);
    bouton_niveau1.setInteractive();
    bouton_niveau1.on("pointerover", () => {
      bouton_niveau1.setScale(0.12);
    });
    bouton_niveau1.on("pointerout", () => {
      bouton_niveau1.setScale(0.1);
    });
    bouton_niveau1.on("pointerup", () => {
      this.scene.start("niveau1");
    });

    // Bouton Mode Infini
    var bouton_niveau2 = this.add.image(400, 450, "PlayNiveau2").setDepth(1);
    bouton_niveau2.setScale(0.1);
    bouton_niveau2.setInteractive();
    bouton_niveau2.on("pointerover", () => {
      bouton_niveau2.setScale(0.12);
    });
    bouton_niveau2.on("pointerout", () => {
      bouton_niveau2.setScale(0.1);
    });
    bouton_niveau2.on("pointerup", () => {
      this.scene.start("niveau2");
    });
  }
}
