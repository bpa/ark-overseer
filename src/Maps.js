"use client";

function coord(divisor, offset) {
    return function (location) {
        return location / divisor + offset;
    }
}

function draw(map) {
    var min_x = map.x.min;
    var len_x = map.x.max - map.x.min;
    var min_y = map.y.min;
    var len_y = map.y.max - map.y.min;

    return function (ctx, x, y, width, height) {
        ctx.fillRect(
            (x - min_x) / len_x * width,
            (y - min_y) / len_y * height,
            3, 3
        );
    }
}

function xOffset(map) {
    var min_x = map.x.min;
    var len_x = map.x.max - map.x.min;

    return function (x, mapWidth, imageWidth) {
        return (x - min_x) / len_x * mapWidth - imageWidth / 2;
    }
}

function yOffset(map) {
    var min_y = map.y.min;
    var len_y = map.y.max - map.y.min;

    return function (y, mapHeight, imageHeight) {
        return (y - min_y) / len_y * mapHeight - imageHeight / 2;
    }
}

function Ark(spec) {
    this.name = spec.name;
    this.lat = coord(spec.lat.divisor, spec.lat.offset);
    this.lon = coord(spec.lon.divisor, spec.lon.offset);
    this.inGame = {
        image: 'img/' + spec.name + '_Map.' + spec.inGameMap.extension,
        data: spec.inGameMap,
        draw: draw(spec.inGameMap),
        x: xOffset(spec.inGameMap),
        y: yOffset(spec.inGameMap),
    };
    this.topographical = {
        image: 'img/' + spec.name + '_Topographic_Map.' + spec.topographicalMap.extension,
        data: spec.topographicalMap,
        draw: draw(spec.topographicalMap),
        x: xOffset(spec.topographicalMap),
        y: yOffset(spec.topographicalMap),
    };
}

function calibrate(map, min_x, max_x, min_y, max_y) {
    var data = { x: { min: min_x, max: max_x }, y: { min: min_y, max: max_y } };
    map.draw = draw(data);
    map.x = xOffset(data);
    map.y = yOffset(data);
}

const Arks = [
    {
        name: 'TheIsland',
        lat: { divisor: 8000, offset: 50 },
        lon: { divisor: 8000, offset: 50 },
        topographicalMap: {
            extension: 'jpg',
            x: { min: -342400, max: 342400 },
            y: { min: -342400, max: 342400 },
        },
        inGameMap: {
            extension: 'png',
            x: { min: -342400, max: 342400 },
            y: { min: -342400, max: 342400 },
        }
    },
    {
        name: 'CrystalIsles',
        lat: { divisor: 16000, offset: 48.75 },
        lon: { divisor: 17000, offset: 50 },
        topographicalMap: {
            extension: 'webp',
            x: { min: -610317.4, max: 617676.56 },
            y: { min: -600841.8, max: 606877.44 },
        },
        inGameMap: {
            extension: 'webp',
            x: { min: -699220.6, max: 649618 },
            y: { min: -712477, max: 725784.6 },
        }
    },
    {
        name: 'Fjordur',
        lat: { divisor: 7141, offset: 50 },
        lon: { divisor: 7141, offset: 50 },
        topographicalMap: {
            extension: 'jpg',
            x: { min: -357969.84, max: 361261.56 },
            y: { min: -358702.7, max: 357360.4 },
        },
        inGameMap: {
            extension: 'webp',
            x: { min: -699220.6, max: 649618 },
            y: { min: -712477, max: 357360.4 },
        }
    }
].reduce(function (arks, data) { arks.push(new Ark(data)); return arks; }, []);

function size(mh, mw) {
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
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

export { Arks, calibrate, size };
