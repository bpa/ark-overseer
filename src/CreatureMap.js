import React, {useEffect, useState, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TheIsland, size } from './Maps';

export default function CreatureMap() {
    const canvas = useRef(null);
    const [image, setImage] = useState(new Image());
    const [dinos, setDinos] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedType, chooseType] = useState(null);
    const [height, width] = size(image.naturalHeight, image.naturalWidth);

    useEffect(() => {
      var img = new Image();
      img.src = TheIsland.image;
      img.onload = () => { setImage(img) };
    }, []);

    useEffect(() => {
      fetch('wild.json').then(r => r.json()).then(d => {
        let types = new Set();
        for (var dino of d) {
          types.add(dino.ClassName);
        }
        let typeList = Array.from(types);
        typeList = typeList.map(d => [d, d.replace('_Character_BP_C', '')]);
        typeList.sort((a, b) => a[0].localeCompare(b[1]));
        setTypes(typeList);
        setDinos(d);
      });
    }, []);

    useEffect(() => {
      let ctx = canvas.current.getContext('2d');
      ctx.drawImage(image, 0, 0, width, height);
      if (selectedType === null) {
        for (var d of dinos) {
          ctx.fillStyle = d.Gender === 'Male' ? 'blue' : 'deeppink';
          TheIsland.draw(ctx, d.Location.Longitude, d.Location.Latitude, width, height);
        }
      } else {
        for (var d of dinos) {
          if (d.ClassName === selectedType[0]) {
            ctx.fillStyle = d.Gender === 'Male' ? 'blue' : 'deeppink';
            TheIsland.draw(ctx, d.Location.Longitude, d.Location.Latitude, width, height);
          }
        }
      }
    });

    return (
      <div>
        <canvas ref={canvas} style={{float: 'left'}} width={width} height={height}></canvas>
        <Container maxWidth="sm">
          <Autocomplete
            getOptionLabel={(o) => o[1]}
            options={types}
            renderInput={(params) => <TextField {...params} label="Dino Type" variant="outlined" />}
            value={selectedType}
            onChange={(e, v) => { console.log(v); chooseType(v) }}
          />
        </Container>
      </div>
    );
}

