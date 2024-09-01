// VARIABLES
let player; // variable for player object, handles player's position, mvt and rendering

let score = 0; // variable to track player's score

let gameOver = false; // variable to track if game has ended

let lives = 3; // variable for max number of lives player starts with

let tileSize = 50; // variable for no. of pixels for each tile

let tileImages = {}; // variable to store tilemap image assets

let tileMap = []; // variable for tilemap array

let collisionMap = []; // variable for collision map array

// variable for object for tracking keyboard
let keys = { 
    left: false, // checking for left arrow key
    right: false, // checking for right arrow key
    up: false, // checking for up arrow key 
};

// variables for the start screen's background image and play button logo image
let startScreenBackgroundImage; 
let startScreenLogoImage;

// variable for the cutscene's background image
let cutsceneImage;

// variable for level two's background image
let level2BackgroundImage;

// variables for the end screen's bg, game over and replay logo images
let endScreenBackgroundImage;
let endScreenGameOverImage;
let endScreenRetryImage;

// varibale for the player's image
let playerImage;

// variable tracking how many images are loaded
let imagesLoaded = 0;

// no. of tile image assets
let totalImages = 7; 

// camera on the x-axis, tracking/following the player sprite
let cameraX = 0;

// variable for different game screens
let gameState = "START"; // game states include: START, PLAYING, CUTSCENE, LEVEL2, END

let showDialogue = false; // variable for seaweed collision box
let dialogueDisplayed = false; // making sure it's only shown once

let cutsceneStartTime;
const cutsceneDuration = 20000; // length of cutscene (20000 milliseconds/20 seconds)

let seaweedSound, coralSound, coinSound, treasureChestSound;

// preload function to load all image and audio assets 
function preload() {
    // loading the player image/sprite
    playerImage = loadImage('fish.png');

    // loading tile images and assigning their tilemap numbers
    tileImages[1] = loadImage('sand.png');
    tileImages[2] = loadImage('stonebricks.png');
    tileImages[3] = loadImage('seaweed.png');
    tileImages[4] = loadImage('coral.png');
    tileImages[5] = loadImage('coin.png');
    tileImages[6] = loadImage('treasurechest.png');
    tileImages[7] = loadImage('seasnake.png');
    

    // loading start screen images
    startScreenBackgroundImage = loadImage('tilepage.png');
    startScreenLogoImage = loadImage('play.png');
    
    // loading cut scene image
    cutsceneImage = loadImage('cutscene.png');
    
    // loading level two background image
    level2BackgroundImage = loadImage('temple.png');
    
    // loading end screen images
    endScreenBackgroundImage = loadImage('blackout.png'); 
    endScreenGameOverImage = loadImage('gameover.png');
    endScreenRetryImage = loadImage('replay.png');
    
}

// a setup function to set canvas and the game elements
function setup() {
    // loading level one bg image
    bg = loadImage('oceanbackground.png')

    createCanvas(700, 700); // setting a 700 by 700 pixel canvas
    initializeTileMap(); // initialising the tilemap/collison map

    // player object for player's position 
    player = new Player(50, height - 150, 50, 50);
    
    // console.log for debugging to check if initially missing 'sand.png' is visible
    if (tileImages[1]) {
        console.log('sand image file is loaded on tiles'); // successful
    } else {
        console.log('sand image file is NOT loaded on tiles'); // unsucessful
    }
}

// a draw function to display the game loop/game states
function draw() {
    background(bg);

    // game state conditionals 
    if (gameState === "START") { // if game state is START the startScreen is displayed
        displayStartScreen();
    } else if (gameState === "PLAYING") { // if game state is PLAYING, level 1 is ran
        playGame();
        if (showDialogue) { // if player hit seaweed, dialogue box is displayed
            displayDialogueBox("CAUTION! You've hit your first seaweed and lost a life! BE CAREFUL...");
        }   
    } else if (gameState === "CUTSCENE") { // if game state is CUTSCENE, the timed cutscen is displayed
        displayCutscene();         
    } else if (gameState === "LEVEL2") { // if game state is LEVEL2, level 2 is ran
        playLevel2();
    } else if (gameState === "END") { // if game state  is END, endScreen is displayed
        displayEndScreen();
    }
}

// a function to initialise and create the tilemap for level one and the collision map
// numbers of the tiles correspond with the tile images loaded in preload function
function initializeTileMap() {
    tileMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 3, 0, 6, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 0, 5, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 5, 0, 5, 0, 5, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 0, 5, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    collisionMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 3, 0, 0, 3, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
}

// function to render the tilemap with the loaded image assets
function renderTilemap() {
    for (let row = 0; row < tileMap.length; row++) {
        for (let col = 0; col < tileMap[row].length; col++) {
            const tile = tileMap[row][col];
            if (tileImages[tile]) {

                // rendering tiles in accordance with the camera's x axis position
                let x = col * tileSize - cameraX;
                let y = row * tileSize;
                if (x + tileSize > 0 && x < width) {
                    image(tileImages[tile], x, y, tileSize, tileSize);
                }
            }
        }
    }
}

// player class handles the rendering and the movement of the player
class Player {
    // player position and mvt physics bounds 
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 6;
        this.gravity = 0.5;
        this.jumpStrength = 10;
        this.grounded = false;
    }

    // updating the player's position according to the keys pressed and movement physics
    update() {
        // conditions for horizontal/x-axis movement
        if (keys.right) {
            this.velocityX = this.speed;
        } else if (keys.left) {
            this.velocityX = -this.speed;
        } else {
            this.velocityX = 0;
        }

        // conditions for vertical/y-axis movement
        if (!this.grounded) {
            this.velocityY += this.gravity; // gravity
        } else {
            this.velocityY = 0;
        }
        if (keys.up && this.grounded) {
            this.velocityY = -this.jumpStrength; // jumping
            this.grounded = false;
        }

        // updating player's position according to movements above
        this.x += this.velocityX;
        this.y += this.velocityY;

        // detecting collision on the canvas' base
        if (this.y + this.height >= height) {
            this.y = height - this.height;
            this.grounded = true;
        } else {
            this.grounded = false;
        }

        // updating the camera's condition in accordance with the player's position (like a tracking shot)
        cameraX = this.x - width / 2 + this.width / 2;

        // stopping the camera from showing any areas out of the canvas' bounds
        cameraX = constrain(cameraX, 0, tileMap[0].length * tileSize - width);
    }

    // rendering the player onto the canvas with the camera on x-position
    render() {
        image(playerImage, this.x - cameraX, this.y, this.width, this.height);
    }
}

// handling the collisions between the player and tiles
function checkCollision() {
    for (let row = 0; row < tileMap.length; row++) {
        for (let col = 0; col < tileMap[row].length; col++) {
            let tile = tileMap[row][col];
            let tileX = col * tileSize;
            let tileY = row * tileSize;

            if (player.x < tileX + tileSize &&
                player.x + player.width > tileX &&
                player.y < tileY + tileSize &&
                player.y + player.height > tileY) {

                // Handling collisions for each tile image
                if (tile === 1) {
                    player.y = tileY - player.height;
                    player.grounded = true; // sand tile = solid block
                } else if (tile === 2) {
                    player.y = tileY - player.height;
                    player.grounded = true; // stone brick tile = solid block
                } else if (tile === 3) {
                    lives--; // 1 life is lost with seaweed collision
                    tileMap[row][col] = 0; // removing seaweed after the player collides

                    // displaying the dialogue box when player first collides with seweed
                    if (!dialogueDisplayed) {
                        showDialogue = true;
                        dialogueDisplayed = true;
                    }

                    if (lives <= 0) {
                        gameOver = true; // 0 lives from seaweed collison = gameover
                    }
                } else if (tile === 4) {
                    lives++; // 1 live is gained with coral collision
                    tileMap[row][col] = 0; // removing coral after player collides
                } else if (tile === 5) {
                    score += 10; // 10 points gained with coin collision 
                    tileMap[row][col] = 0; // removing coin after player collides
                } else if (tile === 6) {
                    score += 50; // 50 points gained with treasure chest collision
                    tileMap[row][col] = 0; // removing treasure chest after player collides
                } else if (tile === 7) {
                    gameOver = true; // snake collision = gameover 
                }
            }
        }
    }
}

// a function for the dialogue box's display
function displayDialogueBox(message) {
    fill(0, 100);
    rect(100, 200, width - 200, 200, 10); // box shape and bg
    fill(255);
    textSize(15);
    textAlign(CENTER, CENTER);
    text(message, width / 2, 300); // displaying text inside box

    // displaying directional text inside box
    textSize(10);
    fill(255, 0, 0);
    text("PRESS ENTER TO CLOSE", width / 2, 350);

    // conditional for box to be closed if ENTER key is pressed
    if (keyIsDown(ENTER)) {
        showDialogue = false;
    }
}

// a head-up display fuction to display live coin and live count on the screen
function displayHUD() {
    fill(255);
    textSize(24);
    text("COINS - " + score, 100, 50);
    text("LIVES - " + lives, 400, 50);
}

// a function to run the start screen 
function displayStartScreen() {
        // dislaying the start screen bg image and play button logo
        image(startScreenBackgroundImage, 0, 0, width, height); // Full canvas background

        // displaying the start screen logo
        let logoWidth = 600; 
        let logoHeight = 500; 
        let logoX = (width - logoWidth) / 2; 
        let logoY = (height - logoHeight) / 1 - 0; 
        image(startScreenLogoImage, logoX, logoY, logoWidth, logoHeight);
    
    // displaying directional text on the start screen
    fill(0);
    textSize(30);
    textAlign(CENTER);
    text("PRESS ENTER TO BEGIN", width / 2, height / 1);
}

// a function for the keys pressed conditions to correspond with and switch between game states
function keyPressed() {
    if (keyCode === LEFT_ARROW) keys.left = true;
    if (keyCode === RIGHT_ARROW) keys.right = true;
    if (keyCode === UP_ARROW) keys.up = true;
    if (keyCode === ENTER && gameState === "START") {
        gameState = "PLAYING";
    } else if (keyCode === ENTER && gameState === "END") {
        resetGame();
        gameState = "START";
    }
}

// a function to handling of key release events
function keyReleased() {
    if (keyCode === LEFT_ARROW) keys.left = false;
    if (keyCode === RIGHT_ARROW) keys.right = false;
    if (keyCode === UP_ARROW) keys.up = false;
}

// a function to handle level one's game logic 
function playGame() {
    renderTilemap(); // displaying the tilemao
    if (!gameOver) {
        player.update();
        player.render();
        checkCollision();
    } else {
        gameState = "END";
    }
    displayHUD();

    // moving from level one to the cutscene
    if (player.x > tileMap[0].length * tileSize - player.width) {
        gameState = "CUTSCENE";
        cutsceneStartTime = millis(); // starting the 20s timer for the cutscene
    }
}

// a function to display the cutscene
function displayCutscene() {
    // displaying the cutscene bg image 
    background(cutsceneImage);

    // conditions for the cutscene
    if (millis() - cutsceneStartTime > cutsceneDuration) {
        gameState = "LEVEL2";
        initializeLevel2(); // if cutscene timer is over game state changes to level two
    }
}

// a function to run level two's game logic
function playLevel2() {
    // displaying the level two bg image 
    background(0);
    image(level2BackgroundImage, 0, 0, width, height); 
    
    // conditions for rendering level two's tilemap 
    renderTilemap();
    if (!gameOver) {
        player.update(); // updating the player's position
        player.render(); // rendering the player 
        checkCollision(); // checking for hazardous collisions 
    } else {
        gameState = "END" // changing game state based on any hazardous collisions
    }
    displayHUD(); // displaying lives and coin count over level two's screen
    
    // game over based on lives condition 
    if (lives>= 3) {
        gameState = "END";
    }
}

// a function to initialize level two's tilemap
function initializeLevel2() {
    tileMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 6, 6, 6, 0, 7, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 0, 3, 0, 0, 0, 0, 5, 4, 5, 5, 5, 5, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 4, 2, 2, 2, 2, 2, 0, 7, 0, 0],
        [0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 3, 0, 5, 5, 0, 6, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 7, 7],
        [0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 5, 5, 5, 6, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 5, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 6, 5, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];

    // player's position on level 2
    player.x = 50;
    player.y = height - 150;

    // camera's position on level 2
    cameraX = 0;
}

// a function to display the end screen 
function displayEndScreen() {
    // displaying a solid black background for the end screen 
    background(0); 
    
    // displaying the GAME OVER iMAGE one the end screen
    let gameOverWidth = 600; 
    let gameOverHeight = 500; 
    let gameOverX = (width - gameOverWidth) / 1;
    let gameOverY = (height - gameOverHeight) / 2 - 100; 
    image(endScreenGameOverImage, gameOverX, gameOverY, gameOverWidth, gameOverHeight);

    // displaying the replay button logo on the end screen
    let retryWidth = 500; 
    let retryHeight = 400; 
    let retryX = (width - retryWidth) / 2; 
    let retryY = (height - retryHeight) / 2 + 150; 
    image(endScreenRetryImage, retryX, retryY, retryWidth, retryHeight);

    // displaying directional text on the end screen
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("PRESS ENTER TO TRY AGAIN", width / 2, height / 2 + 400);

}

// a function to reset the game logic after GAMEOVER is called 
function resetGame() {
    // resetting player position
    player.x = 50;
    player.y = height - 150;

    // resetting the score/coin count
    score = 0;

    // resetting the lives
    lives = 3;
    gameOver = false;

    // recallimg the tilemap 
    initializeTileMap();
}