// Load navbar
fetch('navbar.html') 
    .then(response => response.text()) 
    .then(data => { 
        document.getElementById('navbar').innerHTML = data; 
    }) 
    .catch(error => console.error('Error loading navbar:', error));

window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    class Gear {
        constructor(game, imageId, teeth, x, y) {
            this.game = game;
            this.image = document.getElementById(imageId);
            this.teeth = teeth;
            this.diameter = teeth * 5; // Assume each tooth is 5px wide
            this.x = x;
            this.y = y;
            this.angularVelocity = 0; // Rotation speed in rad/s
            this.rotation = 0; // Current rotation in radians
            this.loaded = false;

            // Ensure the image is loaded before drawing
            if (this.image.complete) {
                this.loaded = true;
            } else {
                this.image.onload = () => {
                    this.loaded = true;
                };
            }
        }

        updateTeeth(newTeeth) {
            this.teeth = newTeeth;
            this.diameter = newTeeth * 5;
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

        update() {
            this.rotation += this.angularVelocity; // Rotate the gear
        }

        draw(context) {
            if (this.loaded) {
                context.save();
                context.translate(this.x + this.diameter / 2, this.y + this.diameter / 2); // Move to gear center
                context.rotate(this.rotation); // Rotate around center
                context.drawImage(this.image, -this.diameter / 2, -this.diameter / 2, this.diameter, this.diameter);
                context.restore();
            }
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

        updateGears(newTeeth1, newTeeth2) {
            if (this.gears.length >= 2) {
                this.gears[0].updateTeeth(newTeeth1);
                this.gears[1].updateTeeth(newTeeth2);
            }
        }

        calculateGearRatio() {
            if (this.gears.length < 2) return 1;
            return this.gears[0].teeth / this.gears[1].teeth;
        }

        update() {
            if (this.gears.length > 1) {
                let gearRatio = this.calculateGearRatio();
                if (!isNaN(gearRatio) && gearRatio > 0) {
                    // Opposite rotation directions due to meshing
                    this.gears[1].setAngularVelocity(-this.gears[0].angularVelocity / gearRatio);
                }
            }

            this.gears.forEach(gear => gear.update());
        }

        draw() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.gears.forEach(gear => gear.draw(this.context));
        }

        startSimulation(forceInput) {
            if (this.gears.length === 0) return;

            let torque = this.gears[0].getTorque(forceInput);
            let forceOnNextGear = this.gears.length > 1 ? this.gears[1].getForce(torque) : 0;
            let gearRatio = this.calculateGearRatio();

            // Set rotation speed based on input force
            this.gears[0].setAngularVelocity(forceInput / 50); // Adjust the 50 for proper scaling

            // Update HTML values
            document.getElementById("torqueValue").textContent = torque.toFixed(2);
            document.getElementById("forceValue").textContent = forceOnNextGear.toFixed(2);
            document.getElementById("gearRatio").textContent = gearRatio.toFixed(2);
        }
    }

    // Initialize the game
    const game = new Game("canvas1");
    game.addGear("gear10", 10, 200, 300);
    game.addGear("gear12", 12, 300, 300);

    // Event listener for start simulation
    document.getElementById("startBtn").addEventListener("click", () => {
        let forceInput = parseFloat(document.getElementById("forceInput").value);
        if (!isNaN(forceInput)) {
            game.startSimulation(forceInput);
        } else {
            alert("Please enter a valid number for force.");
        }
    });

    // Event listener for updating gears dynamically
    document.getElementById("updateGearsBtn").addEventListener("click", () => {
        let gear1Teeth = parseInt(document.getElementById("gear1Teeth").value);
        let gear2Teeth = parseInt(document.getElementById("gear2Teeth").value);

        if (!isNaN(gear1Teeth) && gear1Teeth > 0 && !isNaN(gear2Teeth) && gear2Teeth > 0) {
            game.updateGears(gear1Teeth, gear2Teeth);
        } else {
            alert("Please enter valid positive numbers for gear teeth.");
        }
    });

    function animate() {
        game.update();
        game.draw();
        requestAnimationFrame(animate);
    }

    animate();
});
