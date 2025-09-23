"use client";
import React, { forwardRef, useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ark } from './Maps';

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

function tamedStat(field) {
  var { title, ind } = STATS[field];
  return {
    field: field,
    headerName: title,
    valueGetter: (v, data) => `${data.baseStats[ind] + data.tamedStats[ind]}/${data.baseStats[ind]}`,
    customSort: (a, b) => a.baseStats[ind] - b.baseStats[ind],
    defaultSort: 'asc',
  }
}

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
  if (ark.name == 'Fjordur') {
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


export default function CreatureTable(props) {
  const { file, title } = props;
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dinoTypes, setTypes] = useState({});

  const COLUMNS = {
    wild: [
      { headerName: 'Type', field: 'className', valueGetter: (v, data) => dinoTypes[data.className] },
      { headerName: '👫', field: 'isFemale', valueFormatter: b => b ? '♀️' : '♂️' },
      { headerName: 'LVL', field: 'baseLevel', filtering: false },
      wildStat('health'),
      wildStat('stamina'),
      wildStat('oxygen'),
      wildStat('food'),
      wildStat('weight'),
      wildStat('melee'),
      wildStat('speed'),
      lat(),
      lon(),
      realm(),
    ],
    tames: [
      { headerName: 'Name', field: 'name' },
      { headerName: 'Type', field: 'className', valueGetter: (v, data) => dinoTypes[data.className] },
      { headerName: '👫', field: 'isFemale', valueFormatter: b => b ? '♀️' : '♂️' },
      { headerName: 'LVL', field: 'baseLevel', filtering: false },
      tamedStat('health'),
      tamedStat('stamina'),
      tamedStat('oxygen'),
      tamedStat('food'),
      tamedStat('weight'),
      tamedStat('melee'),
      tamedStat('speed'),
      lat(),
      lon(),
      realm(),
    ]
  };

  useEffect(() => {
    fetch(`${ark.name}/${file}.json`).then(r => r.json()).then(d => {
      let types = new Set();
      let id = 0;
      for (var dino of d) {
        dino.id = id++;
        types.add(dino.className);
      }
      let typeMap = {};
      for (var name of types) {
        typeMap[name] = name.replace('_Character_BP_C', '');
      }
      setTypes(typeMap);
      setData(d);
    });
  }, [file]);

  return <DataGrid
    title={title}
    columns={COLUMNS[file]}
    rows={data}
    detailPanel={data => {
      return <div style={{
        backgroundImage: `url('${ark.inGame.image}')`,
        height: '300px',
        width: '300px',
        backgroundSize: 'contain',
      }}>
        <img src="x.png" alt="X"
          style={{
            position: 'relative',
            display: 'block',
            height: '10px',
            left: `${ark.inGame.x(data.x, 300, 10)}px`,
            top: `${ark.inGame.y(data.y, 300, 10)}px`,
          }}
        />
      </div>
    }}
  />
}
