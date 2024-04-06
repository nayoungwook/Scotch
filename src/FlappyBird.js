import { Scotch , add , render, update, texture, key} from "./lib/scotch.js";

Scotch.initialize();

var birds = [];

add(birds, {
    position: {x: 0, y: 0},
    rotation: 0,
    texture: texture("FlappyBird.png"),
    crop: {x: 0, y: 512 - 20, width:20, height:20},

    timer: 0,
    gv: 0,

    update(){
        this.timer += 0.3;
        this.crop = {
            x: (Math.round(this.timer) % 3) * 28,
            y: 512 - 20,
            width: 20,
            height: 20,
        };

        this.gv += 0.6;
        this.position.y += this.gv;
        this.rotation += this.gv / 10;

        if(key('space')){
            this.gv = -15;
            this.rotation = -10;
        }
    },
});

Scotch.update = () => {
    update(birds);
}

Scotch.render = () => {
    render(birds);
}
