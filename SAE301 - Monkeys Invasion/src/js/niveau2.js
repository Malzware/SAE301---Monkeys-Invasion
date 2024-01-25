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
var nombreDeFoisBossGenere = 0;

// Variables pour la vie du joueur et son affichage
var hearth;
var hearth2;
var hearth3;
var hearth4;
var vie = 3; // nombre de vies
var gameover;
var bossMort = false;

// Variables pour les boosts
var soin;
var vitesse;
var invincibilite;
var estInvincible = false;
var invincibiliteChrono;
var ralentissement;
var objetRamasse = false;
var scoreText2; // Affichage de la vie du joueur

export default class niveau2 extends Phaser.Scene {
  constructor() {
    super({
      key: "niveau2"
    });
  }
  preload() {}

  create() {
    const carteDuNiveau = this.add.tilemap("carte2");
    const tileset = carteDuNiveau.addTilesetImage(
      "tuilesJeu",
      "Phaser_tuilesdejeu2"
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

    this.physics.pause();
    var introduction = this.add.image(800, 300, "infini").setDepth(1);
    var bouton_niveau1 = this.add.image(800, 500, "Play").setDepth(2);
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

    calque_plateformes.setCollisionByProperty({ estSolide: true });

    player = this.physics.add.sprite(800, 200, "img_perso");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    clavier = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, calque_plateformes);

    cursors = this.input.keyboard.createCursorKeys();
    boutonFeu = this.input.keyboard.addKey("A");
    groupeBullets = this.physics.add.group();

    groupeMonstres = this.physics.add.group();
    groupeMonstresCrystal = this.physics.add.group();
    groupeBoss = this.physics.add.group();

    this.physics.add.collider(groupeMonstres, calque_plateformes);
    this.physics.add.collider(groupeMonstresCrystal, calque_plateformes);
    this.physics.add.collider(groupeBoss, calque_plateformes);
    this.physics.add.collider(player, calque_plateformes);
    this.physics.add.overlap(groupeMonstres, groupeMonstres);
    this.physics.add.overlap(groupeBoss, groupeMonstres);
    this.physics.add.overlap(groupeBoss, groupeMonstresCrystal);
    this.physics.add.overlap(groupeBoss, groupeBoss);
    this.physics.add.overlap(groupeMonstresCrystal, groupeMonstresCrystal);
    this.physics.add.overlap(groupeMonstresCrystal, groupeMonstres);

    genererVagueMonstres.call(this);

    texteVague = this.add.text(16, 16, "Vague :", {
      fontSize: "25px",
      fill: "#fff"
    });

    /********************************
     * BOOSTS TEMPORAIRES *
     *******************************/

    vitesse = this.physics.add.group(); // Boost de vitesse

    this.physics.add.collider(vitesse, calque_plateformes); // Collision avec les plateformes
    player.vitesseMax = 150; // Paramètre la vitesse d'origine du personnage
    this.physics.add.overlap(player, vitesse, ramasservitesse, null, this); // Permet au personnage de récupérer le boost

    soin = this.physics.add.group(); // Boost de soin
    invincibilite = this.physics.add.group();
    ralentissement = this.physics.add.group();

    this.physics.add.collider(ralentissement, calque_plateformes);
    this.physics.add.collider(soin, calque_plateformes);
    this.physics.add.collider(invincibilite, calque_plateformes); // Collision avec les plateformes
    this.physics.add.overlap(player, groupeMonstres, blessure, null, this);
    this.physics.add.overlap(
      player,
      groupeMonstresCrystal,
      blessureMonstresCrystal,
      null,
      this
    );
    // Collision entre le joueur et un monstre  // Collision entre le joueur et un monstre
    this.physics.add.overlap(player, groupeBoss, blessureBoss, null, this); // Collision entre le joueur et un monstre
    this.physics.add.overlap(player, soin, ramassersoin, null, this); // Permet au personnage de récupérer le boost
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

    // affichage du texte de la barre de vie
    this.scoreText2 = this.add.text(16, 60, "Vie du joueur :", {
      fontSize: "25px",
      fill: "#fff"
    });
    this.scoreText2.setVisible(true);
    this.scoreText2.setScrollFactor(0);
    hearth4.visible = false;
  }

  update() {
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
      if (player.y < monstre.y && monstre.body.blocked.down) {
        monstre.setVelocityY(-350);
      }
    });

    groupeBoss.children.iterate(function (boss) {
      const distanceX = player.x - boss.x;

      if (objetRamasse) {
        boss.setVelocityX(boss.body.velocity.x * 0.8);
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
      if (player.y < boss.y && boss.body.blocked.down) {
        boss.setVelocityY(-350);
      }
    });

    groupeMonstresCrystal.children.iterate(function (monstrecrystal) {
      const distanceX = player.x - monstrecrystal.x;

      if (objetRamasse) {
        monstrecrystal.setVelocityX(monstrecrystal.body.velocity.x * 0.8);
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
      if (player.y < monstrecrystal.y && monstrecrystal.body.blocked.down) {
        monstrecrystal.setVelocityY(-350);
      }
    });

    if (nombreMonstresDansVague === 0 && !nouvelleVagueGeneree) {
      genererVagueMonstres.call(this);
      nouvelleVagueGeneree = true;
    }

    if (nombreMonstresDansVague > 0) {
      nouvelleVagueGeneree = false;
    }

    if (clavier.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-350);
    }
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
    var monstresActifs = groupeMonstres.countActive(true);

    if (monstresActifs === 0 && !nouvelleVagueGeneree) {
      genererVagueMonstres.call(this, 10);
      nouvelleVagueGeneree = true;
    }

    if (monstresActifs > 0) {
      nouvelleVagueGeneree = false;
    }

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

    texteVague.setText("Vague : " + nombreTotalDeVagues);
    texteVague.setScrollFactor(0);

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 1600, 800);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 1600, 800);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);

    tirer(player);

    if (gameover === true) {
      ecrandefaite.call(this);
      reinitialisation.call(this);
      gameover = false;
    }
  }
}

function genererBoost(x, y) {
  var probabiliteApparition = 10;
  var random = Phaser.Math.RND.between(5, 100);
  if (random <= probabiliteApparition) {
    var boostType = Phaser.Math.RND.pick([
      "vitesse",
      "soin",
      "invincibilite",
      "ralentissement"
    ]);
    var boost;
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
          boss.destroy();
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
          monstrecrystal.destroy();
        }
      });
    }
  });
}

function genererVagueMonstres() {
  var tousLesMonstresMorts = monstresVague.every(function (monstre) {
    return !monstre.active;
  });

  if (tousLesMonstresMorts) {
    var nombreDeMonstresParVague = 8 + 1 * (nombreDeVagues - 2);

    for (var i = 0; i < nombreDeMonstresParVague; i++) {
      var x;
      var y = Phaser.Math.Between(250, 250);

      if (i % 2 === 0) {
        x = Phaser.Math.Between(10, 180);
      } else {
        x = Phaser.Math.Between(1410, 1590);
      }

      var monstre = groupeMonstres.create(x, y, "img_mob");
      monstre.setCollideWorldBounds(true);
      monstre.nombreDeTirs = 0;
      monstresVague.push(monstre);
    }

    for (var i = 0; i < nombreDeMonstresParVague; i++) {
      var x;
      var y = Phaser.Math.Between(250, 250);

      if (i % 2 === 0) {
        x = Phaser.Math.Between(10, 180);
      } else {
        x = Phaser.Math.Between(1410, 1590);
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
        var y = Phaser.Math.Between(250, 250);

        if (i % 2 === 0) {
          x = Phaser.Math.Between(10, 180);
        } else {
          x = Phaser.Math.Between(1410, 1590);
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

// Fonction qui permet de récupérer de la vie
function ramassersoin(un_player, un_soin) {
  if (vie < 4) {
    vie++;
    un_soin.destroy();
  }
  if (vie == 4) {
    hearth4.visible = true;
  }
  if (vie == 3) hearth3.visible = true;
  if (vie == 2) hearth2.visible = true;
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

  var dureeInvincibilite = 5000;

  un_player.scene.time.delayedCall(dureeInvincibilite, function () {
    un_player.clearTint();
    estInvincible = false;
  });

  un_boost.destroy();
}

function blessureBoss(un_player, un_monstre) {
  if (!estInvincible) {
    vie--;
    if (vie === 0) {
      this.physics.pause();
      player.setTint(0xff0000);
      gameover = true;
    } else {
      if (vie == 3) {
        hearth4.setVisible(false);
        hearth3.visible = false;
      }
      if (vie == 2) {
        hearth3.setVisible(false);
        hearth2.visible = false;
      }
      if (vie == 1) {
        hearth2.setVisible(false);
      }
      estInvincible = true;
      invincibiliteChrono = this.time.addEvent({
        delay: 1500,
        callback: function () {
          estInvincible = false;
        },
        callbackScope: this,
        loop: false
      });
    }
  }
}

function blessureMonstresCrystal(un_player, un_monstre) {
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
      invincibiliteChrono = this.time.addEvent({
        delay: 1500,
        callback: function () {
          estInvincible = false;
        },
        callbackScope: this,
        loop: false
      });
    }
  }
}

function ramasserralentissement(player, ralentissement) {
  objetRamasse = true;

  groupeMonstres.children.iterate(function (monstre) {
    if (monstre.active) {
      monstre.setVelocityX(monstre.body.velocity.x * 0.8);
    }
  });

  groupeMonstresCrystal.children.iterate(function (monstrecrystal) {
    if (monstrecrystal.active) {
      monstrecrystal.setVelocityX(monstrecrystal.body.velocity.x * 0.8);
    }
  });

  groupeBoss.children.iterate(function (boss) {
    if (boss.active) {
      boss.setVelocityX(boss.body.velocity.x * 0.8);
    }
  });

  setTimeout(function () {
    objetRamasse = false;

    groupeMonstres.children.iterate(function (monstre) {
      if (monstre.active) {
        monstre.setVelocityX(monstre.body.velocity.x / 0.8);
      }
    });

    groupeMonstresCrystal.children.iterate(function (monstrecrystal) {
      if (monstrecrystal.active) {
        monstrecrystal.setVelocityX(monstrecrystal.body.velocity.x / 0.8);
      }
    });

    groupeBoss.children.iterate(function (boss) {
      if (boss.active) {
        boss.setVelocityX(boss.body.velocity.x / 0.8);
      }
    });
  }, 2000);
  ralentissement.destroy();
}

function blessure(un_player, un_monstre) {
  if (!estInvincible) {
    vie--;
    if (vie === 0) {
      this.physics.pause();
      player.setTint(0xff0000);
      gameover = true;
    } else {
      if (vie == 3) {
        hearth4.visible = false;
      }
      if (vie == 2) {
        hearth3.visible = false;
      }
      if (vie == 1) {
        hearth2.visible = false;
      }
      estInvincible = true;
      invincibiliteChrono = this.time.addEvent({
        delay: 1500,
        callback: function () {
          estInvincible = false;
        },
        callbackScope: this,
        loop: false
      });
    }
  }
}

function ecrandefaite() {
  texteVague.setVisible(false);
  this.scoreText2.setVisible(false);

  var perdu = this.add
    .image(400, 300, "defaite-infini")
    .setDepth(1)
    .setScale(0.3)
    .setScrollFactor(0);

  var bouton_menu = this.add
    .image(400, 445, "bouton_menu")
    .setDepth(2)
    .setScale(0.1)
    .setScrollFactor(0);

  var bouton_recommencer = this.add
    .image(400, 337, "bouton_recommencer")
    .setDepth(2)
    .setScale(0.1)
    .setScrollFactor(0);

  var texteVagueFin = this.add.text(
    190,
    505,
    "Vague terminée : " + nombreTotalDeVagues,
    {
      fontSize: "25px",
      fill: "#fff",
      fontFamily: "Origin Tech Demo, sans-serif"
    }
  );
  texteVagueFin.setDepth(2);

  texteVagueFin.setText("Vous avez atteint la vague " + nombreTotalDeVagues);
  texteVagueFin.setScrollFactor(0);

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

  bouton_recommencer.setInteractive();
  bouton_recommencer.on("pointerover", () => {
    bouton_recommencer.setScale(0.12);
  });
  bouton_recommencer.on("pointerout", () => {
    bouton_recommencer.setScale(0.1);
  });
  bouton_recommencer.on("pointerup", () => {
    reinitialisation();
    this.scene.start("niveau2");
  });
}

function reinitialisation() {
  nombreTotalDeVagues = 0;
  nombreDeVagues = 1;
  vie = 3;
  hearth.visible = true;
  hearth2.visible = true;
  hearth3.visible = true;
  hearth4.visible = false;
}
