function Ark(img, x0, x1, y0, y1) {
  this.image = img;
  this.x0 = x0;
  this.x1 = x1;
  this.y0 = y0;
  this.y1 = y1;

  this.draw = function(ctx, lon, lat, width, height) {
    ctx.fillRect(
        (lon - this.x0) / this.x1 * width,
        (lat - this.y0) / this.y1 * height,
        3, 3
    );
  }
}

//const TheIsland = new Ark('TheIsland.jpg', 1, 97, 6.5, 91); //Cyan on black
//const TheIsland = new Ark('TheIsland.png', -1.7, 104, -1, 101.3); //Standard
const TheIsland = new Ark('The_Island_Topographic_Map.jpg', 7, 86, 7, 86);

function size(mh, mw) {
    let h = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
    let w  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    h = h - 80;

    if (mh === 0) {
        return [h, w];
    }
    let ratio = h > w ? w / mw : h / mh;
    let width = mw * ratio;
    let height = mh * ratio;
    if (width > w) {
        ratio = w / mw;
        return [mh * ratio, w];
    }
    if (height > h) {
        ratio = h / mh;
        return [h, mw * ratio];
    }
    return [height, width];
}

export { TheIsland, size };
