var mainState = {

    preload: function () {

        // Load the image
        game.load.image('logo', 'logo.png');
        game.load.image('player', 'assets/player.png');
        game.load.image('wallV', 'assets/wallVertical.png');
        game.load.image('coin', 'assets/coin.png');
        game.load.image('wallH', 'assets/wallHorizontal.png');
        game.load.image('enemy', 'assets/enemy.png');
    },

    create: function () {
        game.stage.backgroundColor = '#3498db';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;
        this.cursor = game.input.keyboard.createCursorKeys();
        this.createWorld();
        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin);
        this.coin.anchor.setTo(0.5, 0.5);
        // Create an enemy group with Arcade physics

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        game.time.events.loop(2200, this.addEnemy, this);
        this.scoreLabel = game.add.text(30, 30, 'score: 0', {
            font: '18px Arial',
            fill: '#ffffff'
        });
        this.score = 0;
    },
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
        if (this.cursor.left.isDown) {
            // Move the player to the left
            this.player.body.velocity.x = -200;
        }
        // If the right arrow key is pressed
        else if (this.cursor.right.isDown) {
            // Move the player to the right
            this.player.body.velocity.x = 200;
        }
        // If neither the right or left arrow key is pressed
        else {
            // Stop the player
            this.player.body.velocity.x = 0;
        }
        // If the up arrow key is pressed and the player is touching the ground
        if (this.cursor.up.isDown && this.player.body.touching.down) {
            // Move the player upward (jump)
            this.player.body.velocity.y = -320;
        }
    },
    playerDie: function () {
        game.state.start('main');
    },
    takeCoin: function (player, coin) {
        this.score += 5;
        this.scoreLabel.text = 'score: ' + this.score;
        this.updateCoinPosition();
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
};
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');
