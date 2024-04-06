import { Scotch, texture, render } from "./lib/scotch.js";
Scotch.initialize();
var bird = {
    position: { x: 0, y: 0 },
    rotation: 0,
    texture: texture("FlappyBird.png"),
    crop: { x: 0, y: 512 - 20, width: 20, height: 20 },
    timer: 0,
    gv: 0,
    update: function () {
        this.timer += 0.3;
        this.crop = {
            x: (Math.round(this.timer) % 3) * 28,
            y: 512 - 20,
            width: 20,
            height: 20,
        };
        this.gv += 0.6;
        this.position.y += this.gv;
    },
};
Scotch.update = () => {
};
Scotch.render = () => {
    render(bird);
};
