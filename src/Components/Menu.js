import React, { useContext, useEffect, useState } from "react";
import { Data } from "../App";
import { ChartType, Mode } from "./ChartComponent";
import { SortParam } from "./ChartComponent";
import {
  Pagination,
  Switch,
  FormControl,
  FormControlLabel,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from "@mui/material";

import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import BarChartIcon from "@mui/icons-material/BarChart";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import TimelineIcon from "@mui/icons-material/Timeline";
import AddchartIcon from "@mui/icons-material/Addchart";
import { InputLabel, MenuItem, Select } from "@mui/material/";
import { Bar, Line, Radar, Doughnut } from "react-chartjs-2";

function Menu(props) {
  const post = useContext(Data);
  const mode = useContext(Mode);
  const param = useContext(SortParam);
  const g = useContext(ChartType);
  const [range, setRange] = useState(5);

  const actions = [
    { icon: <BarChartIcon />, name: "Bar" },
    { icon: <TimelineIcon />, name: "Line" },
    { icon: <AcUnitIcon />, name: "Radar" },
    { icon: <DonutLargeIcon />, name: "Donut" },
  ];

  const handleChange = (e, val) => {
    setRange(val * 5);
  };

  const toggle = () => {
    mode.setmode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const changeGraph = (i) => {
    switch (i) {
      case 0:
        g.setGraphType(Bar);
        break;
      case 1:
        g.setGraphType(Line);
        break;
      case 2:
        g.setGraphType(Radar);
        break;
      case 3:
        g.setGraphType(Doughnut);
        break;
      default:
        g.setGraphType(Bar);
        break;
    }
  };

  const handleSelect = (event) => {
    param.setParam(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    props.fun(range);
  }, [props, range]);

  return (
    <div className="toggles">
      <FormControlLabel
        control={<Switch defaultChecked onClick={() => toggle()} />}
        label="Dark theme"
      />
      <Pagination
        className="btns"
        count={post && Math.ceil(post.length / 5)}
        siblingCount={2}
        shape="rounded"
        onChange={handleChange}
      />
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={param.param}
          label="Sort By"
          onChange={handleSelect}
        >
          <MenuItem value={"country"}>Alphabetical </MenuItem>
          <MenuItem value={"cases"}>Confirmed</MenuItem>
          <MenuItem value={"deaths"}>Deaths</MenuItem>
          <MenuItem value={"recovered"}>Recovered</MenuItem>
          <MenuItem value={"active"}>Active</MenuItem>
        </Select>
      </FormControl>

      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: "absolute", bottom: "3vh", right: "5vw" }}
        icon={<SpeedDialIcon openIcon={<AddchartIcon />} />}
      >
        {actions.map((action, i) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => changeGraph(i)}
          />
        ))}
      </SpeedDial>
    </div>
  );
}

export default Menu;
