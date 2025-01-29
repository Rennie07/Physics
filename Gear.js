class Gear {
    constructor(game, imageId, teeth, x, y) {
        this.game = game;
        this.image = document.getElementById(imageId);
        this.teeth = teeth;
        this.diameter = teeth * 5; // Assume each tooth is 5px wide
        this.x = x;
        this.y = y;
        this.angularVelocity = 0; // in rad/s
    }

    setAngularVelocity(velocity) {
        this.angularVelocity = velocity;
    }

    getTorque(force) {
        return force * (this.diameter / 2);
    }

    getForce(torque) {
        return torque / (this.diameter / 2);
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.diameter, this.diameter);
    }
}

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.gears = [];
    }

    addGear(imageId, teeth, x, y) {
        let gear = new Gear(this, imageId, teeth, x, y);
        this.gears.push(gear);
    }

    calculateGearRatio() {
        if (this.gears.length < 2) return 1;
        return this.gears[0].teeth / this.gears[1].teeth;
    }

    update() {
        let gearRatio = this.calculateGearRatio();
        if (this.gears.length > 1) {
            this.gears[1].setAngularVelocity(this.gears[0].angularVelocity / gearRatio);
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gears.forEach(gear => gear.draw(this.context));
    }

    startSimulation(forceInput) {
        if (this.gears.length === 0) return;
        let torque = this.gears[0].getTorque(forceInput);
        let forceOnNextGear = this.gears.length > 1 ? this.gears[1].getForce(torque) : 0;
        console.log("Torque on first gear:", torque, "N*m");
        console.log("Force transferred to second gear:", forceOnNextGear, "N");
    }
}

// Initialize the game
const game = new Game("canvas1");
game.addGear("gear10", 10, 200, 300);
game.addGear("gear12", 12, 300, 300);

document.getElementById("startBtn").addEventListener("click", () => {
    let forceInput = parseFloat(document.getElementById("forceInput").value);
    game.startSimulation(forceInput);
});

function animate() {
    game.update();
    game.draw();
    requestAnimationFrame(animate);
}
animate();
