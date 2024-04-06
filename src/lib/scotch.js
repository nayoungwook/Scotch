;
var pressData = {};
var keyData = {};
addEventListener('keydown', (e) => {
    let key = e.key;
    if (e.key == ' ')
        key = 'space';
    pressData[key] = true;
    keyData[key] = true;
});
addEventListener('keyup', (e) => {
    let key = e.key;
    if (e.key == ' ')
        key = 'space';
    pressData[key] = false;
    keyData[key] = false;
});
export function key(key) {
    let data = keyData[key];
    if (data)
        keyData[key] = false;
    return data;
}
export function press(key) {
    return pressData[key];
}
export function rect(position, w, h) {
    let ctx = Scotch.ctx;
    ctx.fillRect(position.x, position.y, w, h);
}
export function image(image, position, w, h, rotation, dx, dy, dw, dh) {
    let ctx = Scotch.ctx;
    let renderData = calculateScreenPosition(position, w, h);
    if ((renderData === null || renderData === void 0 ? void 0 : renderData.position) != undefined && renderData.width != undefined && renderData.height != undefined && renderData.inScreen != undefined) {
        ctx.save();
        ctx.translate(renderData.position.x, renderData.position.y);
        if (rotation == undefined)
            rotation = 0;
        ctx.rotate((rotation + Camera.rotation) / 180 * Math.PI);
        dx = dx == undefined ? 0 : dx;
        dy = dy == undefined ? 0 : dy;
        dw = dw == undefined ? image.getImageSource().width : dw;
        dh = dh == undefined ? image.getImageSource().height : dh;
        ctx.drawImage(image.getImageSource(), dx, dy, dw, dh, -renderData.width / 2, -renderData.height / 2, renderData.width, renderData.height);
        ctx.restore();
    }
}
export function texture(path) {
    return new Texture(path);
}
export function add(arr, obj) {
    arr.push({});
    arr[arr.length - 1] = obj;
}
export function update(obj) {
    if (obj.length != undefined) {
        for (var i = 0; i < obj.length; i++) {
            update(obj[i]);
        }
        return;
    }
    obj.update();
}
export function render(obj) {
    if (obj.length != undefined) {
        for (var i = 0; i < obj.length; i++) {
            render(obj[i]);
        }
        return;
    }
    let position = obj.position, width = obj.width, height = obj.height, rotation = obj.rotation;
    if (obj.position == undefined)
        position = { x: 0, y: 0 };
    if (obj.width == undefined)
        obj.width = 100;
    if (obj.height == undefined)
        obj.height = 100;
    if (obj.rotation == undefined)
        obj.rotation = 0;
    if (obj.crop != undefined) {
        image(obj.texture, position, width, height, rotation, obj.crop.x, obj.crop.y, obj.crop.width, obj.crop.height);
    }
    else {
        image(obj.texture, position, width, height, rotation);
    }
}
export class Camera {
}
Camera.position = { x: 0, y: 0, z: 1 };
Camera.rotation = 0;
export function getDistance(v1, v2) {
    return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
}
export function calculateScreenPosition(position, w, h) {
    let renderWidth, renderHeight;
    let renderPosition = { x: 0, y: 0, z: 0 };
    let inScreen = false;
    if (Camera.position.z != undefined) {
        renderWidth = w * Camera.position.z;
        renderHeight = h * Camera.position.z;
        let _dist = getDistance({ x: Camera.position.x, y: Camera.position.y }, { x: position.x, y: position.y });
        let _rot = Math.atan2(Camera.position.y - position.y, Camera.position.x - position.x) + Camera.rotation / 180;
        let _zDist = _dist * (Camera.position.z);
        let _zx = (Math.cos(_rot) * _zDist), _zy = (Math.sin(_rot) * _zDist);
        renderPosition.x = -_zx + Scotch.canvas.width / 2;
        renderPosition.y = -_zy + Scotch.canvas.height / 2;
        let outScreenSize = Math.sqrt(renderWidth * renderWidth + renderHeight * renderHeight);
        inScreen = true;
        if (position.x < -outScreenSize || position.x > Scotch.canvas.width + outScreenSize)
            inScreen = false;
        if (position.y < -outScreenSize || position.y > Scotch.canvas.width + outScreenSize)
            inScreen = false;
        return { position: renderPosition, width: renderWidth, height: renderHeight, inScreen: inScreen };
    }
}
export class Texture {
    getImageSource() {
        return this.imageSource;
    }
    constructor(path) {
        this.imageSource = new Image();
        this.imageSource.src = './res/' + path;
    }
}
export class Scotch {
    static initialize() {
        console.log('Sctoch initialized.');
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        let context = this.canvas.getContext('2d');
        this.ctx = context;
        let styleFile = document.createElement('link');
        styleFile.href = 'scotch_style.css';
        document.head.appendChild(styleFile);
        this._run();
    }
    static update() { }
    ;
    static render() { }
    ;
    static _update() {
        if (Scotch.canvas != null) {
            Scotch.canvas.width = window.innerWidth;
            Scotch.canvas.height = window.innerHeight;
        }
        Scotch.update();
        Scotch.ctx.imageSmoothingEnabled = false;
        Scotch.ctx.fillStyle = 'rgb(20, 20, 20)';
        Scotch.ctx.fillRect(0, 0, Scotch.canvas.width, Scotch.canvas.height);
        Scotch.render();
        window.requestAnimationFrame(Scotch._update);
    }
    static _run() {
        window.requestAnimationFrame(Scotch._update);
    }
}
