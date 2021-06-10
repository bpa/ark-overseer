import React, { useEffect, useState, useRef } from 'react';
import { ark, calibrate, size } from './Maps';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function CalibrateMap() {
  const canvas = useRef(null);
  const [ver, setVersion] = useState(0);
  const [map, setMap] = useState(ark.topographical)
  const [image, setImage] = useState(new Image());
  const [height, width] = size(image.naturalHeight, image.naturalWidth);
  const [points, setPoints] = useState([
    { x: 146688, y: 240673 },
    { x: 114366, y: -368829 },
    { x: -417875, y: 44029 },
  ]);
  const [minX, setMinX] = useState(map.data.x.min);
  const [minY, setMinY] = useState(map.data.y.min);
  const [maxX, setMaxX] = useState(map.data.x.max);
  const [maxY, setMaxY] = useState(map.data.y.max);
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);

  useEffect(() => {
    var img = new Image();
    img.src = map.image;
    img.onload = () => { setImage(img) };
  }, [map]);

  useEffect(() => {
    calibrate(map, minX, maxX, minY, maxY);
    let ctx = canvas.current.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);
    ctx.fillStyle = 'black  ';
    for (var p of points) {
      map.draw(ctx, p.x, p.y, width, height);
    }
  });

  return (
    <div>
      <canvas style={{ float: 'left' }} ref={canvas} width={width} height={height}></canvas>
      <div>Min X <input value={minX} onChange={(e) => setMinX(e.target.value)} /></div>
      <div>Max X <input value={maxX} onChange={(e) => setMaxX(e.target.value)} /></div>
      <div>Min Y <input value={minY} onChange={(e) => setMinY(e.target.value)} /></div>
      <div>Max Y <input value={maxY} onChange={(e) => setMaxY(e.target.value)} /></div>
      <div>
        X: <input onChange={e => setX(e.target.value)} />
        Y: <input onChange={e => setY(e.target.value)} />
        <AddCircleIcon onClick={e => setPoints([...points, { x: x, y: y }])} />
      </div>
      {points.map((p, i) => (
        <div>({p.x}, {p.y}) <DeleteForeverIcon onClick={function (e) {
          var pts = Array.from(points);
          pts.splice(i, 1);
          setPoints(pts);
        }} /></div>
      ))}
    </div>
  );
}
