"use client";
import React, { useEffect, useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Autocomplete from '@mui/material/Autocomplete';
import { size } from './Maps';

export default function CreatureMap(props) {
  const { ark } = props;
  const canvas = useRef(null);
  const [image, setImage] = useState(new Image());
  const [dinos, setDinos] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, chooseType] = useState(null);
  const [height, width] = size(image.naturalHeight, image.naturalWidth);

  useEffect(() => {
    var img = new Image();
    img.src = ark.topographical.image;
    img.onload = () => { setImage(img) };
  }, [ark]);

  useEffect(() => {
    fetch(ark.name + '/wild.json').then(r => r.json()).then(d => {
      let types = new Set();
      for (var dino of d) {
        types.add(dino.className);
      }
      let typeList = Array.from(types);
      typeList = typeList.map(d => [d, d.replace('_Character_BP_C', '')]);
      typeList.sort((a, b) => a[1].localeCompare(b[1]));
      setTypes(typeList);
      setDinos(d);
    });
  }, [ark]);

  useEffect(() => {
    let ctx = canvas.current.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);
    if (selectedType === null) {
      for (var d of dinos) {
        ctx.fillStyle = d.isFemale ? 'deeppink' : 'blue';
        ark.topographical.draw(ctx, d.x, d.y, width, height);
      }
    } else {
      for (var d of dinos) {
        if (d.className === selectedType[0]) {
          ctx.fillStyle = d.isFemale ? 'deeppink' : 'blue';
          ark.topographical.draw(ctx, d.x, d.y, width, height);
        }
      }
    }
  });

  return (
    <div>
      <canvas ref={canvas} style={{ float: 'left' }} width={width} height={height}></canvas>
      <Container maxWidth="sm">
        <Autocomplete
          getOptionLabel={(o) => o[1]}
          options={types}
          renderInput={(params) => <TextField {...params} label="Dino Type" variant="outlined" />}
          value={selectedType}
          onChange={(e, v) => { chooseType(v) }}
        />
      </Container>
    </div>
  );
}

