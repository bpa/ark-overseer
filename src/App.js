"use client";
import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './App.css';
import CreatureTable from './CreatureTable';
import CreatureMap from './CreatureMap';
import NurseryTable from './NurseryTable';
import { Toolbar } from '@mui/material';
// import CalibrateMap from './CalibrateMap';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary" enableColorOnDark>
          <Toolbar>
          <Tabs value={value} onChange={handleChange} aria-label="Views">
            <Tab label="Map" {...a11yProps(0)} />
            <Tab label="Tamed" {...a11yProps(1)} />
            <Tab label="Wild" {...a11yProps(2)} />
            <Tab label="Nursery" {...a11yProps(3)} />
            {/* <Tab label="Calibrate" {...a11yProps(4)} /> */}
          </Tabs>
          </Toolbar>
        </AppBar>
      </Box>
      <TabPanel value={value} index={0}>
        <CreatureMap />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CreatureTable file="tames" title="Tamed Dinos" />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CreatureTable file="wild" title="Wild Dinos" />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <NurseryTable file="nursery" title="Nursery" />
      </TabPanel>
      {/* <TabPanel value={value} index={4}>
        <CalibrateMap title="Calibrate" />
      </TabPanel> */}
    </>
  );
}
