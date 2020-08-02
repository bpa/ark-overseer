import React, {useEffect, useState, useRef} from 'react';
import { TheIsland, size } from './Maps';

export default function CalibrateMap() {
    const canvas = useRef(null);
    const [ver, setVersion] = useState(0);
    const [image, setImage] = useState(new Image());
    const [dinos, setDinos] = useState([]);
    const [height, width] = size(image.naturalHeight, image.naturalWidth);

    useEffect(() => {
        var img = new Image();
        img.src = TheIsland.image;
        img.onload = () => { setImage(img) };
    }, []);

    useEffect(() => {
        let ctx = canvas.current.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        ctx.fillStyle = 'green';
        TheIsland.draw(ctx, 10, 10, width, height);
        TheIsland.draw(ctx, 86.1, 70.6, width, height);
        TheIsland.draw(ctx, 80, 80, width, height);
        for (var d of dinos) {
          ctx.fillStyle = d.Gender === 'Male' ? 'blue' : 'deeppink';
          TheIsland.draw(ctx, d.Location.Longitude, d.Location.Latitude, width, height);
        }
    });

    useEffect(() => {
        fetch('tames.json').then(r => r.json()).then(d => {
          setDinos(d);
        });
    }, []);

    return (
      <div>
        <canvas style={{float: 'left'}} ref={canvas} width={width} height={height}></canvas>
        <div>X0 <input value={TheIsland.x0} onChange={(e) => { TheIsland.x0 = e.target.value; setVersion(ver + 1); }}/></div>
        <div>X1 <input value={TheIsland.x1} onChange={(e) => { TheIsland.x1 = e.target.value; setVersion(ver + 1); }}/></div>
        <div>Y0 <input value={TheIsland.y0} onChange={(e) => { TheIsland.y0 = e.target.value; setVersion(ver + 1); }}/></div>
        <div>Y1 <input value={TheIsland.y1} onChange={(e) => { TheIsland.y1 = e.target.value; setVersion(ver + 1); }}/></div>
      </div>
    );
}
