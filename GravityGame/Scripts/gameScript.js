var Game = function (canvas) {
    //Game Variables
    this.frame = 1;
    this.frameRate = 100;
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.lastUpdate = 0;
    this.gameObjects = [];

    
    //SpaceShip
    this.spaceShip = new SpaceShip(new Vector(canvas.width / 2 - 100, canvas.height / 2), new Vector(0, 0), 10);
    this.gameObjects.push(this.spaceShip);
    this.spaceShip.angle = Math.PI;
    this.spaceShip.angularVelocity = 0;
    this.spaceShip.rotationalPoint = new Vector(canvas.width / 2, canvas.height / 2);

    //BlackHole
    this.blackHole = new BlackHole(new Vector(canvas.width / 2, canvas.height / 2), new Vector(0, 0), 50);
    this.gameObjects.push(this.blackHole);

    //Asteroids
    this.lastAsteroidSpawn = 0;
    this.asteroidSpawnRate = .8;
    this.asteroidSpeed = .2;

}

Game.prototype.run = function () {
    this.update();
    this.clear();
    this.draw();
}

Game.prototype.update = function () {
    console.log(this.frame);
    var startTime = new Date().getTime();
    this.frame++;

    if (this.lastUpdate == 0) {
        this.lastUpdate = startTime;
        this.lastAsteroidSpawn = startTime;
    }
    else {
        //Calculate DeltaTime
        var deltaTime = startTime - this.lastUpdate;

        //Update Last Update Time
        this.lastUpdate = startTime;
        
        //Update All Objects
        this.gameObjects.forEach(function (aGameObject) {
            aGameObject.update(deltaTime);
        })

        //Determine Asteroid Spawn
        var spawnAsteroid = false;
        if ((startTime - this.lastAsteroidSpawn) >= (this.asteroidSpawnRate * 1000)) {
            spawnAsteroid = true;
            this.lastAsteroidSpawn = startTime;
            //console.log("Asteroid Spawned");
        }

        //Spawn Asteroid
        if (spawnAsteroid) {
            this.spawnAsteroid(this.asteroidSpeed);
        }

        //Collision
        var self = this;
        var newGameObjects = [];
        newGameObjects.push(this.spaceShip);
        newGameObjects.push(this.blackHole);
        this.gameObjects.forEach(function (aGameObject,index) {
            //Skip is object is spaceship or blackhole
            if (aGameObject == this.spaceShip || aGameObject == this.blackHole) {
                console.log("skipped");
                return;
            }

            //console.log("The Index: %d", index);
            
            //Compare collision with blackhole and spaceship
            if (this.collision(this.gameObjects.indexOf(this.spaceShip), index)) {
                alert("Game Over");
            }
            if (this.collision(this.gameObjects.indexOf(this.blackHole), index)) {
                console.log("Asteroid Destroyed");
            }
            else {
                newGameObjects.push(aGameObject);
            }
        }, this);
        this.gameObjects = newGameObjects;
    }
}

Game.prototype.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Game.prototype.draw = function () {
    var context = this.context;
    context.fillStyle = "#191970";
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.gameObjects.forEach(function (aGameObject) { aGameObject.draw(context) })
}

Game.prototype.move = function (direction) {
    if (direction > 0) {
        this.spaceShip.angularVelocity = 2 * Math.PI / 2000;
    }
    else {
        this.spaceShip.angularVelocity = -2 * Math.PI / 2000;
    }
}

Game.prototype.spawnAsteroid = function (speed) {

    console.log("Asteroid Created");
    var side = Math.floor((Math.random() * 4) + 1);
    var calculateVelocity = function (p1, p2) {
        //Create the Vector
        v = new Vector(p2.x - p1.x, p2.y - p1.y);

        //Normalize the Vector
        v.normalize();

        //Apply New Magnitude
        v.x *= speed;
        v.y *= speed;

        //Return Value
        return v;
    }
    var asteroidPosition;

    //Calculate Asteroid Spawn Position
    if (side == 1) {    
        asteroidPosition = new Vector(Math.floor(Math.random() * this.canvas.width), this.canvas.height);
    }
    else if (side == 2) {
        asteroidPosition = new Vector(this.canvas.width, Math.floor(Math.random() * this.canvas.height));
    }
    else if (side == 3) {
        asteroidPosition = new Vector(Math.floor(Math.random() * this.canvas.width), 0);
    }
    else {
        asteroidPosition = new Vector(0, Math.floor(Math.random() * this.canvas.height));
    }

    //Calculate Asteroid Velcoity
    var oppositePosition = new Vector(this.canvas.width - asteroidPosition.x, this.canvas.height - asteroidPosition.y);
    var asteroidVelocity = calculateVelocity(asteroidPosition, oppositePosition);

    //Place Asteroid
    var asteroid = new Asteroid(asteroidPosition, asteroidVelocity, 30);
    this.gameObjects.push(asteroid);
}

Game.prototype.collision = function (index1, index2) {

    var gameObject1 = this.gameObjects[index1];
    var gameObject2 = this.gameObjects[index2];

    //console.log("Colliding Indexes: %d and %d", index1, index2);

    var calculateDistance = function (p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    var collisionDistance = gameObject1.radius + gameObject2.radius
    var objectDistance = calculateDistance(gameObject1.position, gameObject2.position);

    if (collisionDistance >= objectDistance) {
        return true;
    }
    else
        return false;

   
    
}

var Vector = function (x,y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.normalize = function () {
    var norm = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2))
    this.x = this.x / norm;
    this.y = this.y / norm;
}

var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
}

var GameObject = function (position, velocity, radius) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
}

GameObject.prototype.update = function (deltaTime) {

}

GameObject.prototype.draw = function (context) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = 'black';
    context.fill();
    context.stroke();
    context.closePath();
}

var SpaceShip = function (position,velocity,radius) {

    GameObject.call(this, position, velocity, radius);

    this.angle = Math.PI;
    this.angularVelocity = 0;
    this.rotationalPoint = new Vector(0, 0);
}

SpaceShip.prototype = Object.create(GameObject.prototype);

SpaceShip.prototype.update = function (deltaTime) {

    //Calculate Radius
    var radius = Math.pow(this.position.x - this.rotationalPoint.x, 2)
        + Math.pow(this.position.y - this.rotationalPoint.y, 2);
    var radius = Math.sqrt(radius);
    //console.log("Space ship radius: %f", radius);

    //Calculate New Angle
    this.angle = this.angularVelocity * deltaTime + this.angle;
    //console.log("Space ship angle: %f", this.spaceShipAngle);

    //Update Space Ship position
    this.position.x = radius * Math.cos(this.angle) + (this.rotationalPoint.x);
    this.position.y = radius * Math.sin(this.angle) + (this.rotationalPoint.y);
    //console.log("Space ship position: (%f,%f)", this.spaceShip.position.x,this.spaceShip.y);

}

SpaceShip.prototype.draw = function (context) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = 'red';
    context.fill();
    context.stroke();
    context.closePath();
}


var BlackHole = function (position, velocity, radius) {
    GameObject.call(this, position, velocity, radius);
}

BlackHole.prototype = Object.create(GameObject.prototype);

var Asteroid = function (position, velocity, radius) {
    GameObject.call(this, position, velocity, radius);
}

Asteroid.prototype = Object.create(GameObject.prototype);

Asteroid.prototype.update = function (deltaTime) {
    //Update Asteroid Position
    this.position.x = this.velocity.x * deltaTime + this.position.x;
    this.position.y = this.velocity.y * deltaTime + this.position.y;
    
}

Asteroid.prototype.draw = function (context) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = 'brown';
    context.fill();
    context.stroke();
    context.closePath();
}

function main() {
    var myCanvas = document.getElementById("myCanvas");
    var myGame = new Game(myCanvas);
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 37) {
            myGame.move(-1);
        }
        else if (event.keyCode == 39) {
            myGame.move(1);
        }
    });

    window.setInterval(myGame.run.bind(myGame), 1000 / myGame.frameRate);
}

main();