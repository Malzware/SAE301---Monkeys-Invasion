import Phaser from "phaser";

var player;
var cursors;
var clavier;

// Variables pour le tir
var boutonFeu;
var groupeBullets;
var bullet;

// Variables pour les monstres et les vagues
var nombreMonstresDansVague = 0;
var nombreDeVagues = 1; // Vague à laquelle le jeu débute
var monstresVague = [];
var groupeMonstres;
var groupeMonstresCrystal;
var groupeBoss;
var nouvelleVagueGeneree = false;
var nombreTotalDeVagues = 0; // Compteur de vague
var texteVague;
var bossMort = false;

// Variables pour la vie du joueur et son affichage
var hearth; // premier coeur de vie
var hearth2; // deuxieme coeur de vie
var hearth3; // troisième coeur de vie
var hearth4; // quatrième coeur de vie
var vie = 3;
var gameover;
var scoreText; // affichage de la vie du joueur

// Variables pour la vie de l'objet et son affichage
var hearthObjet;
var hearthObjet2;
var hearthObjet3;
var hearthObjet4;
var hearthObjet5;
var hearthObjet6;
var hearthObjet7;
var hearthObjet8;
var hearthObjet9;
var vieObjet = 8;
var objet_central;
var scoreTextObjet; // affichage de la vie de l'objet

// Variables pour les boosts
var soin;
var vitesse;
var invincibilite;
var estInvincible = false;
var invincibilityTimer;
var ralentissement;
var objetRamasse = false;

// Variables pour l'interface de victoire et l'interface de défaite
var perdu;
var victoire = false;
var bouton_menu;
var bouton_recommencer;

export default class niveau1 extends Phaser.Scene {
  constructor() {
    super({
      key: "niveau1"
    });
  }
  preload() {}

  create() {
    const carteDuNiveau = this.add.tilemap("carte");
    const tileset = carteDuNiveau.addTilesetImage(
      "mes_tuile",
      "Phaser_tuilesdejeu"
    );

    // chargement du calque calque_background
    const calque_background = carteDuNiveau.createLayer(
      "calque_background",
      tileset
    );

    // chargement du calque calque_background_2
    const calque_background_2 = carteDuNiveau.createLayer(
      "calque_background_2",
      tileset
    );

    // chargement du calque calque_background_2
    const calque_background_3 = carteDuNiveau.createLayer(
      "calque_background_3",
      tileset
    );

    // chargement du calque calque_background_2
    const calque_background_4 = carteDuNiveau.createLayer(
      "calque_background_4",
      tileset
    );

    // chargement du calque calque_background_2
    const calque_background_5 = carteDuNiveau.createLayer(
      "calque_background_5",
      tileset
    );

    // chargement du calque calque_background_2
    const calque_background_6 = carteDuNiveau.createLayer(
      "calque_background_6",
      tileset
    );

    // chargement du calque calque_background_2
    const calque_background_7 = carteDuNiveau.createLayer(
      "calque_background_7",
      tileset
    );

    // chargement du calque calque_background_2
    const calque_background_8 = carteDuNiveau.createLayer(
      "calque_background_8",
      tileset
    );

    // chargement du calque calque_plateformes
    const calque_plateformes = carteDuNiveau.createLayer(
      "calque_plateformes",
      tileset
    );

    // Interface d'introduction
    this.physics.pause();
    var introduction = this.add.image(400, 300, "introduction").setDepth(1);
    var bouton_niveau1 = this.add.image(400, 510, "Play").setDepth(2);
    introduction.setScale(0.35);
    bouton_niveau1.setScale(0.1);
    bouton_niveau1.setInteractive();
    bouton_niveau1.on("pointerover", () => {
      bouton_niveau1.setScale(0.12);
    });
    bouton_niveau1.on("pointerout", () => {
      bouton_niveau1.setScale(0.1);
    });
    bouton_niveau1.on("pointerup", () => {
      this.physics.resume();
      bouton_niveau1.setVisible(false);
      introduction.setVisible(false);
    });

    // Collisions Plateformes
    calque_plateformes.setCollisionByProperty({ estSolide: true });

    // Ajout de l'objet central
    hearthObjet = this.add.image(700, 90, "hearthObjet");
    hearthObjet.setVisible(false);
    objet_central = this.physics.add.sprite(400, 370, "objet_central");
    objet_central.setCollideWorldBounds(true);
    objet_central.body.allowGravity = false;

    // Ajout personnage et interactions clavier
    player = this.physics.add.sprite(400, 420, "img_perso");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    clavier = this.input.keyboard.createCursorKeys();

    cursors = this.input.keyboard.createCursorKeys();
    boutonFeu = this.input.keyboard.addKey("A");
    groupeBullets = this.physics.add.group();

    // Physiques et collisions des monstres
    groupeMonstres = this.physics.add.group();
    groupeMonstresCrystal = this.physics.add.group();
    groupeBoss = this.physics.add.group();

    this.physics.add.collider(player, calque_plateformes);
    this.physics.add.collider(groupeMonstres, calque_plateformes);
    this.physics.add.collider(groupeMonstresCrystal, calque_plateformes);
    this.physics.add.collider(groupeBoss, calque_plateformes);
    this.physics.add.collider(player, calque_plateformes);
    this.physics.add.overlap(groupeMonstres, groupeMonstres);
    this.physics.add.overlap(groupeMonstresCrystal, groupeMonstresCrystal);
    this.physics.add.overlap(groupeMonstresCrystal, groupeMonstres);

    // Collision entre le joueur et un monstre
    this.physics.add.overlap(player, groupeMonstres, blessure, null, this);
    this.physics.add.overlap(player, groupeBoss, blessureBoss, null, this);

    // Génération des vagues de monstres
    genererVagueMonstres.call(this);

    // Ajout de l'affichage des vagues
    texteVague = this.add.text(16, 16, "Vague : ", {
      fontSize: "25px",
      fill: "#fff"
    });
    texteVague.setVisible(true);

    /********************************
     * BOOSTS TEMPORAIRES *
     *******************************/

    vitesse = this.physics.add.group(); // Boost de vitesse

    this.physics.add.collider(vitesse, calque_plateformes); // Collision avec les plateformes
    player.vitesseMax = 150; // Vitesse d'origine du personnage

    soin = this.physics.add.group(); // Boost de soin
    invincibilite = this.physics.add.group(); // Boost d'invincibilité
    ralentissement = this.physics.add.group(); // Boost de ralentissement

    // Collisions des boosts
    this.physics.add.collider(ralentissement, calque_plateformes);
    this.physics.add.collider(soin, calque_plateformes);
    this.physics.add.collider(invincibilite, calque_plateformes);

    // Récupération des boosts par le joueur
    this.physics.add.overlap(player, vitesse, ramasservitesse, null, this);
    this.physics.add.overlap(player, soin, ramassersoin, null, this);
    this.physics.add.overlap(
      player,
      invincibilite,
      ramasserinvincibilite,
      null,
      this
    );
    this.physics.add.overlap(
      player,
      ralentissement,
      ramasserralentissement,
      null,
      this
    );

    // Coeurs de la barre de vie du personnage
    hearth = this.add.image(255, 75, "hearth");
    hearth.setScrollFactor(0);
    hearth2 = this.add.image(280, 75, "hearth");
    hearth2.setScrollFactor(0);
    hearth3 = this.add.image(305, 75, "hearth");
    hearth3.setScrollFactor(0);
    hearth4 = this.add.image(330, 75, "hearth");
    hearth4.setScrollFactor(0);

    // Affichage du texte "Vie du joueur"
    this.scoreText = this.add.text(16, 60, "Vie du joueur :", {
      fontSize: "25px",
      fill: "#fff"
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setVisible(true);
    hearth4.setVisible(false);

    // Coeurs de la barre de vie de l'objet
    hearthObjet = this.add.image(365, 250, "hearthObjet");
    hearthObjet2 = this.add.image(390, 250, "hearthObjet");
    hearthObjet3 = this.add.image(415, 250, "hearthObjet");
    hearthObjet4 = this.add.image(440, 250, "hearthObjet");
    hearthObjet5 = this.add.image(365, 275, "hearthObjet");
    hearthObjet6 = this.add.image(390, 275, "hearthObjet");
    hearthObjet7 = this.add.image(415, 275, "hearthObjet");
    hearthObjet8 = this.add.image(440, 275, "hearthObjet");

    // Physique et collision entre le cristal, les monstres et les plateformes
    this.physics.add.collider(objet_central, calque_plateformes);
    this.physics.add.overlap(
      objet_central,
      groupeMonstresCrystal,
      blessureObjetCentral,
      null,
      this
    );
  }

  update() {
    // Clavier
    if (clavier.left.isDown) {
      player.setVelocityX(player.vitesseMax * -1);
      player.anims.play("anim_tourne_gauche", true);
      player.flipX = true;
    } else if (clavier.right.isDown) {
      player.setVelocityX(player.vitesseMax);
      player.anims.play("anim_tourne_droite", true);
      player.flipX = false;
    } else {
      player.setVelocityX(0);
      player.anims.play("anim_face");
    }

    // Vélocité des monstres
    groupeMonstres.children.iterate(function (monstre) {
      const distanceX = player.x - monstre.x;

      if (objetRamasse) {
        monstre.setVelocityX(monstre.body.velocity.x * 0.8);
      } else {
        if (distanceX < -20) {
          monstre.setVelocityX(-70);
          monstre.anims.play("anim_mob_right", true);
        } else if (distanceX > 20) {
          monstre.setVelocityX(70);
          monstre.anims.play("anim_mob_left", true);
        } else {
          monstre.setVelocityX(0);
          monstre.anims.play("anim_mob_face", true);
        }
      }
    });

    // Vélocité du (des) boss
    groupeBoss.children.iterate(function (boss) {
      const distanceX = player.x - boss.x;

      if (objetRamasse) {
        boss.setVelocityX(boss.body.velocity.x * 0.8); // Réduisez la vélocité (0.8 est un exemple, ajustez-le en fonction de votre jeu)
      } else {
        if (distanceX < -20) {
          boss.setVelocityX(-90);
          boss.anims.play("anim_boss_right", true);
        } else if (distanceX > 20) {
          boss.setVelocityX(90);
          boss.anims.play("anim_boss_left", true);
        } else {
          boss.setVelocityX(0);
          boss.anims.play("anim_boss_face", true);
        }
      }
    });

    // Vélocité des monstres cristals
    groupeMonstresCrystal.children.iterate(function (monstrecrystal) {
      const distanceX = objet_central.x - monstrecrystal.x;

      if (objetRamasse) {
        monstrecrystal.setVelocityX(monstrecrystal.body.velocity.x * 0.8); // Réduisez la vélocité (0.8 est un exemple, ajustez-le en fonction de votre jeu)
      } else {
        if (distanceX < -20) {
          monstrecrystal.setVelocityX(-100);
          monstrecrystal.anims.play("anim_mob_crystal_right", true);
        } else if (distanceX > 20) {
          monstrecrystal.setVelocityX(100);
          monstrecrystal.anims.play("anim_mob_crystal_left", true);
        } else {
          monstrecrystal.setVelocityX(0);
          monstrecrystal.anims.play("anim_mob_crystal_face", true);
        }
      }
    });

    if (clavier.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-300);
    }

    // Création de balle
    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      bullet = groupeBullets.create(
        player.x + (player.flipX ? -25 : 25),
        player.y - 4,
        "bullet"
      );
      bullet.setCollideWorldBounds(true);
      bullet.body.onWorldBounds = true;
      bullet.body.allowGravity = false;
      bullet.setVelocity(1000 * (player.flipX ? -1 : 1), 0);
    }

    // Vérifications pour créer une nouvelle vague
    if (nombreMonstresDansVague === 0 && !nouvelleVagueGeneree) {
      genererVagueMonstres.call(this);
      nouvelleVagueGeneree = true;
    }

    if (nombreMonstresDansVague > 0) {
      nouvelleVagueGeneree = false;
    }

    var monstresActifs = groupeMonstres.countActive(true);

    if (monstresActifs === 0 && !nouvelleVagueGeneree) {
      genererVagueMonstres.call(this, 10);
      nouvelleVagueGeneree = true;
    }

    if (monstresActifs > 0) {
      nouvelleVagueGeneree = false;
    }

    // Vérifie que les monstres ne supperposent pas
    this.physics.world.overlap(
      groupeMonstres,
      groupeMonstres,
      function (monstre1, monstre2) {
        var distance = Phaser.Math.Distance.Between(
          monstre1.x,
          monstre1.y,
          monstre2.x,
          monstre2.y
        );
        var minDistance = 20;

        if (distance < minDistance) {
          var angle = Phaser.Math.Angle.Between(
            monstre1.x,
            monstre1.y,
            monstre2.x,
            monstre2.y
          );
          var overlapDistance = minDistance - distance;
          var moveX = (Math.cos(angle) * overlapDistance) / 2;
          var moveY = (Math.sin(angle) * overlapDistance) / 2;
          monstre1.x -= moveX;
          monstre1.y -= moveY;
          monstre2.x += moveX;
          monstre2.y += moveY;
        }
      },
      null,
      this
    );

    // Compteur de vagues
    texteVague.setText("Vague : " + nombreTotalDeVagues);
    texteVague.setScrollFactor(0);

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 920, 600);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 920, 600);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);

    tirer(player);

    if (nombreTotalDeVagues === 11) {
      ecranvictoire.call(this);
      this.physics.pause();
      reinitialisation.call(this);
    }

    if (gameover === true) {
      ecrandefaite.call(this);
      reinitialisation.call(this);
      gameover = false;
    }
  }
}

function genererBoost(x, y) {
  var probabiliteApparition = 10; // probabilité d'apparition d'un boost
  var random = Phaser.Math.RND.between(1, 100); // chiffre créé aléatoirement entre 1 et 100
  if (random <= probabiliteApparition) {
    var boostType = Phaser.Math.RND.pick([
      // Choix aléatoire pour créer un boost
      "vitesse",
      "soin",
      "invincibilite",
      "ralentissement"
    ]);
    var boost; // Création du boost
    if (boostType === "vitesse") {
      boost = vitesse.create(x, y, "vitesse");
    } else if (boostType === "soin") {
      boost = soin.create(x, y, "soin");
    } else if (boostType === "invincibilite") {
      boost = invincibilite.create(x, y, "invincibilite");
    } else if (boostType === "ralentissement") {
      boost = ralentissement.create(x, y, "ralentissement");
    }
    if (boost) {
      boost.setGravityY(300);
    }
  }
}

function tirer(player, un_monstre) {
  groupeBullets.children.iterate(function (bullet) {
    if (bullet && bullet.active) {
      var monstresTouches = [];
      var bossTouches = [];
      var monstrecrystalTouches = [];
      var monstrelanceurTouches = [];

      // Fonction pour vérifier les collisions avec les monstres
      function verifierCollisionsAvecMonstres(monstre) {
        if (
          monstre.active &&
          Phaser.Geom.Intersects.RectangleToRectangle(
            bullet.getBounds(),
            monstre.getBounds()
          )
        ) {
          monstre.nombreDeBallesTouchees =
            (monstre.nombreDeBallesTouchees || 0) + 1;
          bullet.destroy();
          monstresTouches.push(monstre);
        }
      }

      groupeMonstres.children.iterate(verifierCollisionsAvecMonstres);

      monstresTouches.forEach(function (monstre) {
        if (monstre.nombreDeBallesTouchees === 2) {
          // Monstre qui meurt au bout de 2 balles reçus
          monstre.destroy();
          genererBoost.call(this, monstre.x, monstre.y);
        }
      });

      // Fonction pour vérifier les collisions avec le boss
      function verifierCollisionsAvecBoss(boss) {
        if (
          boss.active &&
          Phaser.Geom.Intersects.RectangleToRectangle(
            bullet.getBounds(),
            boss.getBounds()
          )
        ) {
          boss.nombreDeBallesTouchees = (boss.nombreDeBallesTouchees || 0) + 1;
          bullet.destroy();
          bossTouches.push(boss);
        }
      }

      groupeBoss.children.iterate(verifierCollisionsAvecBoss);

      bossTouches.forEach(function (boss) {
        if (boss.nombreDeBallesTouchees === 10) {
          // Boss qui meurt au bout de 10 balles reçus
          boss.destroy();
          bossMort = true;
        }
      });

      // Fonction pour vérifier les collisions avec les monstres cristals
      function verifierCollisionsAvecMonstresCrystal(monstrecrystal) {
        if (
          monstrecrystal.active &&
          Phaser.Geom.Intersects.RectangleToRectangle(
            bullet.getBounds(),
            monstrecrystal.getBounds()
          )
        ) {
          monstrecrystal.nombreDeBallesTouchees =
            (monstrecrystal.nombreDeBallesTouchees || 0) + 1;
          bullet.destroy();
          monstrecrystalTouches.push(monstrecrystal);
        }
      }

      groupeMonstresCrystal.children.iterate(
        verifierCollisionsAvecMonstresCrystal
      );

      monstrecrystalTouches.forEach(function (monstrecrystal) {
        if (monstrecrystal.nombreDeBallesTouchees === 1) {
          // Monstre cristal qui meurt au bout d'1 balle reçu
          monstrecrystal.destroy();
          genererBoost.call(this, monstrecrystal.x, monstrecrystal.y);
        }
      });
    }
  });
}

function genererVagueMonstres() {
  var tousLesMonstresMorts = monstresVague.every(function (monstre) {
    return !monstre.active;
  });

  if (tousLesMonstresMorts && nombreDeVagues <= 11) {
    var nombreDeMonstresParVague = 8 + 1 * (nombreDeVagues - 2);

    for (var i = 0; i < nombreDeMonstresParVague; i++) {
      var x;
      var y = Phaser.Math.Between(400, 400);

      if (i % 2 === 0) {
        x = Phaser.Math.Between(800, 928);
      } else {
        x = Phaser.Math.Between(32, 160);
      }

      var monstre = groupeMonstres.create(x, y, "img_mob");
      monstre.setCollideWorldBounds(true);
      monstre.nombreDeTirs = 0;
      monstresVague.push(monstre);
    }

    for (var i = 0; i < nombreDeMonstresParVague; i++) {
      var x;
      var y = Phaser.Math.Between(400, 400);

      if (i % 2 === 0) {
        x = Phaser.Math.Between(800, 928);
      } else {
        x = Phaser.Math.Between(32, 160);
      }

      var monstrecrystal = groupeMonstresCrystal.create(x, y, "img_mobcrystal");
      monstrecrystal.setCollideWorldBounds(true);
      monstrecrystal.nombreDeTirs = 0;
      monstresVague.push(monstrecrystal);
    }

    if (
      (nombreDeVagues >= 10 && nombreDeVagues % 10 === 0) || // Boss qui apparait toutes les 10 vagues
      nombreDeVagues === 10
    ) {
      var nombreDeBossAGenerer = Math.floor((nombreDeVagues - 9) / 10) + 1;

      for (var i = 0; i < nombreDeBossAGenerer; i++) {
        var x;
        var y = Phaser.Math.Between(400, 400);

        if (i % 2 === 0) {
          x = Phaser.Math.Between(800, 928);
        } else {
          x = Phaser.Math.Between(32, 160);
        }

        var boss = groupeBoss.create(x, y, "monstre_special");
        boss.setCollideWorldBounds(true);
        boss.nombreDeTirs = 0;
        monstresVague.push(boss);
      }
    }

    nombreMonstresDansVague = monstresVague.length;
    nombreDeVagues++;
    nombreTotalDeVagues++;
  }
}

// Fonction pour récupérer de la vie
function ramassersoin(un_player, un_soin) {
  if (vie < 4) {
    vie++;
    un_soin.destroy();
  }
  if (vie == 4) {
    hearth4.setVisible(true);
  }
  if (vie == 3) hearth3.setVisible(true);
  if (vie == 2) hearth2.setVisible(true);
}

// Fonction pour le boost de vitesse
function ramasservitesse(un_player, une_vitesse) {
  un_player.vitesseMax = 400;
  var vitesseX = un_player.body.velocity.x;
  une_vitesse.destroy();
  console.log(vitesseX);
  var timer = un_player.scene.time.delayedCall(
    5000,
    function () {
      un_player.vitesseMax = 150;
    },
    [],
    un_player.scene
  );
}

// Function pour être invincible
function ramasserinvincibilite(un_player, un_boost) {
  un_player.setTint(0x00ff00);
  estInvincible = true;

  var dureeInvincibilite = 5000; // 5000 millisecondes (5 secondes)

  un_player.scene.time.delayedCall(dureeInvincibilite, function () {
    un_player.clearTint();
    estInvincible = false;
  });

  un_boost.destroy();
}

// Fonction pour les coups du boss sur le joueur
function blessureBoss(un_player, un_monstre) {
  if (vie > 0) {
    vie = 0;

    if (vie == 0) {
      hearth4.setVisible(false);
      hearth3.setVisible(false);
      hearth2.setVisible(false);
      hearth.setVisible(false);
      this.physics.pause();
      player.setTint(0xff0000);
      gameover = true;
    }
  }
}

function ramasserralentissement(player, ralentissement) {
  objetRamasse = true;

  // Réduction vitesse monstres normaux
  groupeMonstres.children.iterate(function (monstre) {
    if (monstre.active) {
      monstre.setVelocityX(monstre.body.velocity.x * 0.8);
    }
  });

  // Réduction vitesse monstres cristals
  groupeMonstresCrystal.children.iterate(function (monstrecrystal) {
    if (monstrecrystal.active) {
      monstrecrystal.setVelocityX(monstrecrystal.body.velocity.x * 0.8);
    }
  });

  // Réduction vitesse du (des) boss
  groupeBoss.children.iterate(function (boss) {
    if (boss.active) {
      boss.setVelocityX(boss.body.velocity.x * 0.8);
    }
  });

  // Reset des vitesses
  setTimeout(function () {
    objetRamasse = false;

    // Reset vitesse des monstres
    groupeMonstres.children.iterate(function (monstre) {
      if (monstre.active) {
        monstre.setVelocityX(monstre.body.velocity.x / 0.8);
      }
    });

    // Reset vitesse des monstres cristals
    groupeMonstresCrystal.children.iterate(function (monstrecrystal) {
      if (monstrecrystal.active) {
        monstrecrystal.setVelocityX(monstrecrystal.body.velocity.x / 0.8);
      }
    });

    // Rétablir la vitesse du (des) boss
    groupeBoss.children.iterate(function (boss) {
      if (boss.active) {
        boss.setVelocityX(boss.body.velocity.x / 0.8);
      }
    });
  }, 2000); // 2 secondes
  ralentissement.destroy();
}

// Fonction pour les coups des monstres sur le cristal / objet
function blessureObjetCentral(objet_central, un_monstre) {
  console.log(vieObjet);
  if (vieObjet > 0) {
    vieObjet--;
    un_monstre.destroy();

    if (vieObjet == 8) {
      hearthObjet9.setVisible(false);
    }
    if (vieObjet == 7) {
      hearthObjet8.setVisible(false);
    }
    if (vieObjet == 6) {
      hearthObjet7.setVisible(false);
    }
    if (vieObjet == 5) {
      hearthObjet6.setVisible(false);
    }
    if (vieObjet == 4) {
      hearthObjet5.setVisible(false);
    }
    if (vieObjet == 3) {
      hearthObjet4.setVisible(false);
    }
    if (vieObjet == 2) {
      hearthObjet3.setVisible(false);
    }
    if (vieObjet == 1) {
      hearthObjet2.setVisible(false);
    }

    if (vieObjet == 0) {
      hearthObjet.setVisible(false);
      this.physics.pause();
      objet_central.setTint(0xff0000);
      gameover = true;
    }
    console.log(vieObjet);
  }
}

// Fonction pour les coups des monstres sur le joueur
function blessure(un_player, un_monstre) {
  if (!estInvincible) {
    vie--;
    if (vie === 0) {
      this.physics.pause();
      player.setTint(0xff0000);
      gameover = true;
    } else {
      if (vie == 3) {
        hearth4.setVisible(false);
      }
      if (vie == 2) {
        hearth3.setVisible(false);
      }
      if (vie == 1) {
        hearth2.setVisible(false);
      }
      estInvincible = true;
      invincibilityTimer = this.time.addEvent({
        delay: 1500, // 1 second invincibility
        callback: function () {
          estInvincible = false;
        },
        callbackScope: this,
        loop: false
      });
    }
  }
}

// Affichage écran de victoire
function ecranvictoire() {
  texteVague.setVisible(false);
  this.scoreText.setVisible(false);

  var victoire = this.add
    .image(400, 300, "victoire")
    .setDepth(1)
    .setScale(0.3)
    .setScrollFactor(0);

  var bouton_menu = this.add
    .image(400, 460, "bouton_menu")
    .setDepth(2)
    .setScale(0.1)
    .setScrollFactor(0);

  bouton_menu.setInteractive();
  bouton_menu.on("pointerover", () => {
    bouton_menu.setScale(0.12);
  });
  bouton_menu.on("pointerout", () => {
    bouton_menu.setScale(0.1);
  });
  bouton_menu.on("pointerup", () => {
    reinitialisation();
    this.scene.start("menu1");
  });
}

// Affichage écran de défaite
function ecrandefaite() {
  texteVague.setVisible(false);
  this.scoreText.setVisible(false);

  var perdu = this.add
    .image(400, 300, "perdu")
    .setDepth(1)
    .setScale(0.3)
    .setScrollFactor(0);

  var bouton_menu = this.add
    .image(400, 460, "bouton_menu")
    .setDepth(2)
    .setScale(0.1)
    .setScrollFactor(0);

  var bouton_recommencer = this.add
    .image(400, 350, "bouton_recommencer")
    .setDepth(2)
    .setScale(0.1)
    .setScrollFactor(0);

  bouton_menu.setInteractive();
  bouton_menu.on("pointerover", () => {
    bouton_menu.setScale(0.12);
  });
  bouton_menu.on("pointerout", () => {
    bouton_menu.setScale(0.1);
  });
  bouton_menu.on("pointerup", () => {
    reinitialisation();
    this.scene.start("menu1");
  });

  // Bouton recommencer
  bouton_recommencer.setInteractive();
  bouton_recommencer.on("pointerover", () => {
    bouton_recommencer.setScale(0.12);
  });
  bouton_recommencer.on("pointerout", () => {
    bouton_recommencer.setScale(0.1);
  });
  bouton_recommencer.on("pointerup", () => {
    reinitialisation();
    this.scene.start("niveau1");
  });
}

// Permet de réinitialiser les valeurs lorsqu'un niveau est fini / quand on recommence un niveau
function reinitialisation() {
  nombreTotalDeVagues = 0;
  nombreDeVagues = 1;
  vie = 3;
  vieObjet = 8;
  bossMort = false;

  hearth.setVisible(true);
  hearth2.setVisible(true);
  hearth3.setVisible(true);
  hearth4.setVisible(false);

  hearthObjet.setVisible(true);
  hearthObjet2.setVisible(true);
  hearthObjet3.setVisible(true);
  hearthObjet4.setVisible(true);
  hearthObjet5.setVisible(true);
  hearthObjet6.setVisible(true);
  hearthObjet7.setVisible(true);
  hearthObjet8.setVisible(true);
}
