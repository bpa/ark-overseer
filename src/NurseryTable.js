"use client";
import React, { forwardRef, useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const egg_name = /Egg_(.*)_Fertilized/;
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

export default function NurseryTable(props) {
  const { ark } = props;
  const { file, title } = props;
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dinoTypes, setTypes] = useState({});

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

  const COLUMNS = [
    { headerName: 'Type', field: 'className', valueGetter: (v, data) => dinoTypes[data.className] },
    { headerName: '👫', field: 'isFemale', valueFormatter: b => b ? '♀️' : '♂️' },
    { headerName: 'Parent', field: 'parent' },
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
  ];

  useEffect(() => {
    fetch(`${ark.name}/nursery.json`).then(r => r.json()).then(d => {
      let types = new Set();
      let id = 0;
      for (var dino of d) {
        dino.id = id++;
        types.add(dino.className);
      }
      let typeMap = {};
      for (var name of types) {
        if (name.startsWith('Primal')) {
          var match = egg_name.exec(name);
          typeMap[name] = match[1];
        } else {
          typeMap[name] = name.replace('_Character_BP_C', '').replace();
        }
      }
      setTypes(typeMap);
      setData(d);
    });
  }, [ark, file]);

  return <DataGrid
    title={title}
    columns={COLUMNS}
    rows={data}
  />
}
