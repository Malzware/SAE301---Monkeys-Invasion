import Phaser from "phaser";
import menu from "/src/js/menu.js";
import menu1 from "/src/js/menu1.js";
import niveau1 from "/src/js/niveau1.js";
import niveau2 from "/src/js/niveau2.js";

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 300
      },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [menu, menu1, niveau1, niveau2]
};

// création et lancement du jeu à partir de la configuration config
var game = new Phaser.Game(config);
game.scene.start("menu"); // lancement de la scene selection
