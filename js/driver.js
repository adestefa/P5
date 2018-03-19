
// main game model
var DATA = {
    SCORE : 0,
    GENERATION : 0,
    CLICKS : 0,
    ACTIVE : 0,
    INACTIVE : 0,
    TOTAL : 0,
    STARTED : 0,
    GAMEOVER : 0
}

// sound asset list
var sounds = [];

// did we play ovation sound?
var ovation = false;

// size of canvas
var WIDTH = 1400;
var HEIGHT = 900;


function setup() {
    createCanvas(WIDTH, HEIGHT);
    
    // begin game with initial cells
    cells=[];
    cells.push(new Cell());
    cells.push(new Cell());
    cells.push(new Cell());

    
    // load game sound files into memory
    sounds["drop0"] = loadSound('assets/drop_0.mp3');
    //sounds["drop1"] = loadSound('assets/drop_1.mp3');
    sounds["drop2"] = loadSound('assets/drop_1.mp3');
    sounds["ting"] = loadSound('assets/ting.mp3');
    //sounds["ting2"] = loadSound('assets/ting2.mp3');
    //sounds["snap"] = loadSound('assets/snap.mp3');
    //sounds["ting3"] = loadSound('assets/ting3.mp3');
    sounds["ovation"] = loadSound('assets/ovation.mp3');

}



function draw() {
    // clear frame
    background(color(255, 255, 255));
  
    // move and show each cell
    for (var i=0;i<cells.length; i++) {
        cells[i].move();
        cells[i].show();
    }

    /** UI TEXT  */

    fill(50);

    // only show the title when game over or hasen't started
    if (!DATA.STARTED && !DATA.GAMEOVER) {
        textSize(40);
        var s = 'Click all the things!';
        text(s, 240, 170);
    }

    /** SCORE */
    textSize(32);
    text("Score:" + this.formatNumber(DATA.SCORE), 10, 30);
    /** GENERATION */
    textSize(18);
    text("Generation:" + DATA.GENERATION, 10, 63);
    /** CLICKS */
    textSize(13);
    text("Clicks:" + DATA.CLICKS, 10, 90);
    /** CREATED */
    textSize(8);
    text("Created:" + DATA.TOTAL, 10, 110);

    textSize(8);
    text("v:0.1", 10, 130);


    /**
     *  - check if each cell is active.
     *  - An active cell is still within the visible canvas boundries
     *  - any cell that leaves the canvas will switch to inactive
     *  - if there are no active cells left, their are no cells on screen and the game is over
     *  - display message based on score
     */

     // when no more cells are active
    if ( !this.checkActive() ) {

        // game over!
        DATA.GAMEOVER = 1;
        console.log("Game over");
        textSize(42);
        text("GAME OVER!", 240, 170);

        // score below a million
        if (DATA.SCORE > 1000000) {
            console.log("Over a million!");
            textSize(32);
            text("Fantastic!", 240, 220);

            // over a million gets an ovation
            if (!ovation) {
                sounds["ovation"].play();
                ovation = true;
            }
            
        // score less than a hundred thousand
        } else if (DATA.SCORE < 100000) {
            textSize(32);
            text("Try harder", 240, 220);
        
        // lass than 500,000, more than 100,000
        } else if (DATA.SCORE < 500000 && DATA.SCORE > 100000) {
            textSize(32);
            text("Not bad", 240, 220);
        // under a million and more than 500,000    
        } else if (DATA.SCORE < 1000000 && DATA.SCORE > 500000) {
            textSize(32);
            text("You're getting there", 240, 220);
        }    
    }

}


function mousePressed() {

    if (!DATA.GAMEOVER) {
        DATA.CLICKS++;
        DATA.STARTED = 1;
        for(var i = cells.length-1; i >= 0; i--){
            var parent = null;
            if (cells[i].clicked(mouseX, mouseY)) {
                var c1 = cells[i].mitosis();
                var c2 = cells[i].mitosis();
                cells.push(c1);
                cells.push(c2);
                cells.splice(i, 1);
            // if (cells[i].generation > DATA.GENERATION) {
                //    DATA.GENERATION = cells[i].generation;
            }
        }
    } else {
        window.location.href=window.location.href;
    }

    

}

function updateScore(val) {
    DATA.SCORE = int(DATA.SCORE) + int(val);
    console.log("updateScore:" + DATA.SCORE);
}

function formatNumber (x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function checkActive() {
    var active = 0;
    var inactive = 0;
    for (var i = 0; i < cells.length; i++){
        if (cells[i].active) {
            active++;
        } else {
            inactive++;
        }
    }
    DATA.ACTIVE = active;
    DATA.INACTIVE = inactive;
    DATA.TOTAL = cells.length;
    return active;
}