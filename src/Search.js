"use client";
import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import { ark } from './Maps';
import { type } from '@testing-library/user-event/dist/type';

const STATS = {
  health: { title: '❤️', ind: 0 },
  stamina: { title: '⚡', ind: 1 },
  torpor: { title: '💫', ind: 2 },
  oxygen: { title: 'O2', ind: 3 },
  food: { title: '🍗', ind: 4 },
  water: { title: '🥛', ind: 5 },
  temperature: { title: '🌡️', ind: 6 },
  weight: { title: '🥌', ind: 7 },
  melee: { title: '⛏️', ind: 8 },
  speed: { title: '🦶', ind: 9 },
};
const USEFUL_STATS = [0, 1, 3, 4, 7, 8];

function wildStat(field) {
  var { title, ind } = STATS[field];
  return {
    field: field,
    headerName: title,
    valueGetter: (v, data) => data.baseStats[ind],
    customSort: (a, b) => a.baseStats[ind] - b.baseStats[ind],
    defaultSort: 'desc',
  }
}

function lat(data) {
  return {
    field: 'lat',
    headerName: 'Lat',
    valueGetter: (v, data) => ark.lat(data.y).toFixed(1),
    customSort: (a, b) => a.y - b.y,
    defaultSort: 'desc',
  }
}

function lon(data) {
  return {
    field: 'lon',
    headerName: 'Lon',
    valueGetter: (v, data) => ark.lon(data.x).toFixed(1),
    customSort: (a, b) => a.x - b.x,
  }
}

function realm(data) {
  if (ark.name === 'Fjordur') {
    return {
      field: 'realm',
      headerName: 'Realm',
      valueGetter: (v, data) => {
        if (data.z > -100000) return 'Midgard';
        if (data.z < -200000) return 'Asgard';
        if (data.x < 75000) return 'Jotunheim';
        return 'Vanaheim';
      },
      customSort: (a, b) => a.x - b.x,
    }
  } else {
    return {};
  }
}

export default function Search() {
  const [data, setData] = useState({});
  const [dinos, setDinos] = useState([]);
  const [types, setTypes] = useState([]);
  const [typeLookup, setTypeLookup] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetch(ark.name + '/wild.json').then(r => r.json()).then(d => {
      let id = 0;
      let best = {};
      for (var dino of d) {
        dino.id = id++;
        if (dino.tameable) {
          if (!(dino.className in best)) {
            best[dino.className] = { stats: Array.from({ length: 12 }, () => [0, 0]), };
          }
          let candidate = best[dino.className];
          let bonus = dino.baseLevel / 5;
          for (var i of USEFUL_STATS) {
            let stat = dino.baseStats[i] + bonus;
            if (stat > candidate.stats[i][0]) {
              candidate.stats[i][0] = stat;
              candidate.stats[i][1] = dino.id
            }
          }
        }
      }
      let bestDinos = {};
      let typeMap = {};
      for (const [name, winners] of Object.entries(best)) {
        let dinos = new Set();
        for (const i of USEFUL_STATS) {
          dinos.add(winners.stats[i][1]);
        }
        let dinoList = Array.from(dinos);
        let shortName = name.replace('_Character_BP_C', '');
        bestDinos[shortName] = dinoList.map(id => d[id]);
        typeMap[name] = shortName;
      }
      let typeNames = Array.from(Object.keys(bestDinos));
      typeNames.sort((a, b) => a.localeCompare(b));
      setTypeLookup(typeMap)
      setTypes(typeNames)
      setData(bestDinos);
    });
  }, []);

  function getClassName(v, data) {
    const baseName = typeLookup[data.className];
    if (data.resource) {
      return `${baseName} (${data.resource})`;
    }
    return baseName;
  }

  const COLUMNS = [
    { headerName: 'Type', field: 'className', valueGetter: getClassName },
    { headerName: '👫', field: 'isFemale', valueFormatter: b => b ? '♀️' : '♂️' },
    { headerName: 'LVL', field: 'baseLevel', filtering: false },
    wildStat('health'),
    wildStat('stamina'),
    wildStat('oxygen'),
    wildStat('food'),
    wildStat('weight'),
    wildStat('melee'),
    lat(),
    lon(),
    realm(),
  ];

  return <>
    <Container maxWidth="sm">
      <Autocomplete
        // getOptionLabel={(o) => o[1]}
        options={types}
        renderInput={(params) => <TextField {...params} label="Dino Type" variant="outlined" />}
        value={selectedType}
        onChange={(e, v) => {
          console.log(v);
          setDinos(data[v]);
          setSelectedType(v);
        }}
      />
    </Container>
    <DataGrid
      title="Search"
      columns={COLUMNS}
      rows={dinos}
    />
  </>
}
