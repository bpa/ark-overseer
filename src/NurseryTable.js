"use client";
import React, { forwardRef, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
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

function wildStat(field) {
  var { title, ind } = STATS[field];
  return {
    title: title,
    render: data => data.baseStats[ind],
    customSort: (a, b) => a.baseStats[ind] - b.baseStats[ind],
    defaultSort: 'desc',
  }
}

const egg_name = /Egg_(.*)_Fertilized/;

export default function NurseryTable(props) {
  const { file, title } = props;
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dinoTypes, setTypes] = useState({});

  const COLUMNS = [
    { title: 'Type', field: 'className', lookup: dinoTypes },
    { title: 'Parent', field: 'parent', filtering: true },
    wildStat('health'),
    wildStat('stamina'),
    wildStat('oxygen'),
    wildStat('food'),
    wildStat('weight'),
    wildStat('melee'),
    wildStat('speed'),
  ];

  useEffect(() => {
    fetch(`${ark.name}/nursery.json`).then(r => r.json()).then(d => {
      let types = new Set();
      for (var dino of d) {
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
  }, [file]);

  return <Table
    title={title}
    columns={COLUMNS}
    data={data}
    options={{
      pageSize: 50,
      pageSizeOptions: [10, 25, 50],
      sorting: true,
      filtering: true,
      padding: 'dense',
      rowStyle: rowData => ({
        backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
      })
    }}
  />
}
