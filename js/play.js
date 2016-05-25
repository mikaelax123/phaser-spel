// New name for the state

var playState = {

    // Removed the preload function
    createWorld: function () {
        this.walls = game.add.group();
        this.walls.enableBody = true;
        game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left
        game.add.sprite(480, 0, 'wallV', 0, this.walls); // Right
        game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
        game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right
        game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left
        game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
        game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);
        this.walls.setAll('body.immovable', true);
    },
    create: function () {

        // Removed background color and physics system
        //this.music = game.add.audio('music'); // Add the music

        //this.music.loop = true; // Make it loop

        //this.music.play(); // Start the music



        // Create the 'left' animation by looping the frames 3 and 4



        this.cursor = game.input.keyboard.createCursorKeys();

        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

        this.jumpSound = game.add.audio('jump');

        this.coinSound = game.add.audio('coin');

        this.deadSound = game.add.audio('dead');

        this.player.anchor.setTo(0.5, 0.5);

        game.physics.arcade.enable(this.player);

        this.player.body.gravity.y = 500;
        this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3, 4], 8, true);

        this.enemies = game.add.group();

        this.enemies.enableBody = true;

        this.enemies.createMultiple(10, 'enemy');

        this.coin = game.add.sprite(60, 140, 'coin');

        game.physics.arcade.enable(this.coin);

        this.coin.anchor.setTo(0.5, 0.5);

        this.scoreLabel = game.add.text(30, 30, 'score: 0', {
            font: '18px Arial',
            fill: '#ffffff'
        });
        game.global.score = 0;

        this.createWorld();
        game.time.events.loop(2200, this.addEnemy, this);

    },

    update: function () {
        game.physics.arcade.collide(this.player, this.walls);
        this.movePlayer();
        game.physics.arcade.collide(this.enemies, this.walls);
        // Call the 'playerDie' function when the player and an enemy overlap
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        if (!this.player.inWorld) {
            this.playerDie();
        }
    },
    addEnemy: function () {

        // Get the first dead enemy of the group

        var enemy = this.enemies.getFirstDead();

        // If there isn't any dead enemy, do nothing

        if (!enemy) {
            return;
        }
        // Initialise the enemy
        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },
    movePlayer: function () {

        // Move the player to the left

        if (this.cursor.left.isDown) {

            this.player.body.velocity.x = -200;

            this.player.animations.play('left'); // Start the left animation

        }

        // Move the player to the right
        else if (this.cursor.right.isDown) {

            this.player.body.velocity.x = 200;

            this.player.animations.play('right'); // Start the right animation

        }

        // Stop the player
        else {

            this.player.body.velocity.x = 0;

            this.player.animations.stop(); // Stop the animation

            this.player.frame = 0; // Set the player frame to 0 (stand still)

        }

        // Make the player jump

        if (this.cursor.up.isDown && this.player.body.touching.down) {

            this.player.body.velocity.y = -320;

            this.jumpSound.play();
        }
    },
    updateCoinPosition: function () {
        var coinPosition = [
            {
                x: 140,
                y: 60
                }, {
                x: 360,
                y: 60
                },
            {
                x: 60,
                y: 140
                }, {
                x: 440,
                y: 140
                },
            {
                x: 130,
                y: 300
                }, {
                x: 370,
                y: 300
                }
            ];
        for (var i = 0; i < coinPosition.length; i++) {
            if (coinPosition[i].x === this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }
        var newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length - 1)];
        this.coin.reset(newPosition.x, newPosition.y);
    },

    takeCoin: function (player, coin) {

        // New score variable

        game.global.score += 5;
        this.coinSound.play();

        this.scoreLabel.text = 'score: ' + game.global.score;

        this.updateCoinPosition();

    },

    // No changes

    playerDie: function () {

        // When the player dies, we go to the menu
        this.deadSound.play();
        game.state.start('menu');

    },

};

// Removed Phaser and states initialisation
