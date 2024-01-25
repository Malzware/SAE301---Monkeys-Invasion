import Phaser from "phaser";

var cursors;
var clavier;

// Variables pour le tir
var boutonFeu;
var groupeBullets;
var bullet;

// Variables pour les monstres et les vagues
var nombreMonstresDansVague = 0;
var nombreDeVagues = 1; // Vague de départ
var monstresVague = [];
var groupeMonstres;
var groupeBoss;
var nouvelleVagueGeneree = false;
var nombreTotalDeVagues = 0; // Compteur de vague
var texteVague;

// Variables pour la vie du joueur et son affichage
var hearth;
var hearth2;
var hearth3;
var hearth4;
var vie = 3; // nombre de vies
var gameover;

// Variables pour la vie de l'objet et son affichage
var scoreTextObjet; // affichage de la vie de l'objet
var hearthObjet;
var hearthObjet2;
var hearthObjet3;
var hearthObjet4;
var hearthObjet5;
var hearthObjet6;
var hearthObjet7;
var hearthObjet8;
var hearthObjet9;
var vieObjet = 8; // nombre de vies de l'objet
var objet_central;

// Variables pour les boosts
var soin;
var vitesse;
var ralentissement;
var invincibilite;

// Variables pour l'interface de défaite
var perdu;
var bouton_menu;
var bouton_recommencer;

// Variables pour la musique
var mySound = new Audio("/src/assets/cybertruck.mp3");

//

export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: "menu" });
  }

  preload() {
    this.load.audio;
    this.load.image("menu_fond", "/src/assets/start_background.png");
    this.load.image("Play", "/src/assets/play.png");
    this.load.image("Commandes", "/src/assets/commandes.png");
    this.load.image("menuCommandes", "/src/assets/commande.png");
    this.load.image("bouton_croix", "/src/assets/croix.png");
    this.load.image("perdu", "/src/assets/defaite-crystal.png");
    this.load.image("defaite-infini", "/src/assets/defaite-infini.png");
    this.load.image("victoire", "/src/assets/victoire.png");
    this.load.image("introduction", "/src/assets/histoire.png");
    this.load.image("infini", "/src/assets/histoire_infini.png");
    this.load.image("suivant", "/src/assets/suivant.png");
    this.load.image("bouton_menu", "/src/assets/menu.png");
    this.load.image("bouton_recommencer", "/src/assets/reco.png");
    this.load.image("PlayNiveau1", "/src/assets/campagne.png"); // Chargez l'image du bouton play
    this.load.image("PlayNiveau2", "/src/assets/infini.png"); // Chargez l'image du bouton play
    this.load.image("bullet", "src/assets/bullet.png");
    this.load.image("hearth", "src/assets/soin.png");
    this.load.image("hearthObjet", "src/assets/soin.png");
    this.load.image("vitesse", "src/assets/vitesse.png");
    this.load.image("soin", "src/assets/soin.png");
    this.load.image("ralentissement", "src/assets/ralentissement.png");
    this.load.image("invincibilite", "src/assets/invincibilite.png");
    this.load.spritesheet("objet_central", "src/assets/crystal.png", {
      frameWidth: 48,
      frameHeight: 135
    });
    this.load.spritesheet("img_perso", "src/assets/dude.png", {
      frameWidth: 30,
      frameHeight: 35
    });
    this.load.spritesheet("img_mob", "src/assets/gorilla.png", {
      frameWidth: 48,
      frameHeight: 48
    });
    // chargement tuiles de jeu
    this.load.image("Phaser_tuilesdejeu", "src/assets/tuilesJeu.png");
    this.load.image("Phaser_tuilesdejeu2", "src/assets/tuilesJeu2.png");
    // chargement de la carte
    this.load.tilemapTiledJSON("carte", "src/assets/map.json");
    this.load.tilemapTiledJSON("carte2", "src/assets/map2.json");
    this.load.spritesheet("monstre_special", "src/assets/yeti2.png", {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("img_mobcrystal", "src/assets/gorilla.png", {
      frameWidth: 48,
      frameHeight: 48
    });
  }

  create() {
    // Animations du personnage et des monstres
    this.anims.create({
      key: "anim_tourne_gauche",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 0,
        end: 5
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 3 }],
      frameRate: 20
    });

    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 0,
        end: 5
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_mob_left",
      frames: this.anims.generateFrameNumbers("img_mob", {
        start: 24,
        end: 26
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_mob_face",
      frames: [{ key: "img_mob", frame: 1 }],
      frameRate: 20
    });

    this.anims.create({
      key: "anim_mob_right",
      frames: this.anims.generateFrameNumbers("img_mob", {
        start: 12,
        end: 14
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_boss_left",
      frames: this.anims.generateFrameNumbers("monstre_special", {
        start: 6,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_boss_face",
      frames: [{ key: "monstre_special", frame: 1 }],
      frameRate: 20
    });

    this.anims.create({
      key: "anim_boss_right",
      frames: this.anims.generateFrameNumbers("monstre_special", {
        start: 3,
        end: 5
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_mob_crystal_left",
      frames: this.anims.generateFrameNumbers("img_mobcrystal", {
        start: 27,
        end: 29
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_mob_crystal_face",
      frames: [{ key: "img_mobcrystal", frame: 5 }],
      frameRate: 20
    });

    this.anims.create({
      key: "anim_mob_crystal_right",
      frames: this.anims.generateFrameNumbers("img_mobcrystal", {
        start: 15,
        end: 17
      }),
      frameRate: 10,
      repeat: -1
    });

    // Image de fond du menu
    var background = this.add.image(0, 0, "menu_fond");
    background.setOrigin(0, 0);

    // Bouton "Play"
    var bouton_play = this.add.image(400, 350, "Play").setDepth(1); // Positionnement
    bouton_play.setScale(0.1); // Taille
    bouton_play.setInteractive(); // Interactif
    bouton_play.on("pointerover", () => {
      // Survol du bouton
      bouton_play.setScale(0.12); // Agrandissement du bouton au survol
    });
    bouton_play.on("pointerout", () => {
      // Arrêt du survol du bouton
      bouton_play.setScale(0.1); // Retour à sa taille d'origine
    });
    bouton_play.on("pointerup", () => {
      // Clic sur le bouton
      this.scene.start("menu1"); // Redirection sur le menu1
      mySound.play(); // Lecture de l'audio
      mySound.volume = 0.05; // Volume de l'audio
    });

    // Menu Commande
    var bouton_commande = this.add.image(400, 450, "Commandes").setDepth(1); // Positionnement

    // Image des commandes
    var menuCommandes = this.add
      .image(160, 150, "menuCommandes")
      .setOrigin(0)
      .setDepth(4)
      .setScale(0.2)
      .setVisible(false);

    // Image du bouton croix
    var bouton_croix = this.add
      .image(485, 115, "bouton_croix")
      .setOrigin(0)
      .setDepth(5)
      .setScale(0.1)
      .setVisible(false);

    // Bouton Commande
    bouton_commande.setScale(0.1);
    bouton_commande.setInteractive();
    bouton_commande.on("pointerover", () => {
      bouton_commande.setScale(0.12);
    });
    bouton_commande.on("pointerout", () => {
      bouton_commande.setScale(0.1);
    });
    bouton_commande.on("pointerup", () => {
      menuCommandes.setVisible(true);
      bouton_croix.setVisible(true);
    });

    // Bouton Croix
    bouton_croix.setInteractive();
    bouton_croix.on("pointerup", () => {
      menuCommandes.setVisible(false);
      bouton_croix.setVisible(false);
    });

    // Appel la fonction qui fait que le son fait une boucle
    mySound.addEventListener("ended", replayAudio);
  }
}

// Function pour que le son redémarre en boucle
function replayAudio() {
  mySound.currentTime = 0; // Réinitialiser la position de lecture à 0
  mySound.play();
}
