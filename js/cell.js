
/**
 * @description Game Cell
 * @param {*} pos Object defining this cell's position (x,y)
 * @param {*} r Radius of cell
 * @param {*} c Color of cell
 * @param {*} id Unique ID of cell
 * @param {*} gen Generation index
 * @param {*} value Score value of this cell
 */
function Cell(pos, r, c, id, gen, value) {
    this.id = id || 0;
    this.r = r || 60;
    //this.c = c || color(0, 0, 0 , 100);
    this.c = c || color(66, 134, 244 , 100);
    this.generation = gen || 1;
    this.value = value || 1;
    
    // copy pos when provided, or create a new random one
    if(pos) {
        this.pos = pos.copy();
    } else {
        this.pos = createVector(random(width), random(height));
    }
   
    this.max_x = 300;
    this.max_y = 300;
    this.tog = 0;
    this.active = true;
    this.direction = [];
    // up
    this.direction[0]  = [-0.1, -0.5, 0.0];
    // left
    this.direction[1]  = [0.1, 0.5, 0.0];
    // right
    this.direction[2]  = [-0.7091097, -0.22805278, 0.0];
    // down
    this.direction[3]  = [0.6091097, -0.02805278, 0.0];

    // this.c = c || color(random(100, 255), 0, random(100, 255), 100);

    this.randomDirection = function () {
        var r = Math.floor(Math.random() * 4);
        var d = this.direction[r];
        //console.log("D:" + d + " index:"+ r);
        return d;
    }

    // calculate and return if a given pos (click) is in this cell
    this.clicked = function (x, y) {
        var d = dist(this.pos.x, this.pos.y, x, y);
        if (d < this.r) {
            this.report();
            updateScore(this.score());
            return true;
        } else {
            return false;
        }
    }

    // provide a young copy of this cell with same settings
    this.mitosis = function () {
        this.pos.x += random(-50, 50);
        this.pos.y += 10;
        this.generation += 1;
        var cell = new Cell(this.pos, this.r*0.8, this.c, this.id++, this.generation, this.value*2);
        // console.log("Mitosis!");
        console.log("G:"+ this.generation);
        /**
        if (this.generation <= 4) {
             sounds["snap"].play();
        } else if (this.generation == 5 || this.generation == 6) {
            sounds["drop2"].play();
        } else if (this.generation == 7 || this.generation == 8 || this.generation == 9) {
            sounds["ting"].play();
        } else if (this.generation == 10 || this.generation > 10) {
            sounds["ting3"].play();
        }
         */
          this.generation = this.generation - 1;
          if (this.generation > DATA.GENERATION) {
              DATA.GENERATION = this.generation;
          }

        // Volume must be between 0.0 and 1.0
        if (this.generation <= 4) {
            //sounds["snap"].volume(0.1);
            sounds["drop0"].play();
       } else if (this.generation == 5 || this.generation == 6) {
           sounds["drop2"].play();
       } else if (this.generation == 7 || this.generation == 8 || this.generation > 9 ) {
           sounds["ting"].play();
       } else {
        sounds["ting"].play();
       }


         
        return cell;
    }
   
    // toggle between jiggle and moving up
    this.move = function () {
        //var vel = p5.Vector.random2D();
        // var vel = [-0.7091097, -0.22805278, 0.0];
         
        if (this.tog) {
            var vel = this.randomDirection();
            this.pos.add(vel);
            this.tog = 0;
        } else {
            this.pos.add(this.direction[0]);
            //console.log("POS:" + this.pos.y);
            if (this.pos.y < 1) {
                this.active = false;
            }
            this.tog =1;
        }
    }

    this.show = function () {
        noStroke();
        fill(this.c);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }

    this.score = function () {
        var s = int(this.generation * this.value);
        console.log("this score:" + s);
        return s;
    }

    this.report = function () {
        console.log("Cell:" + this.id + " Gen:" + this.generation + " Value:" + this.value);
        console.log(DATA);
    }
}