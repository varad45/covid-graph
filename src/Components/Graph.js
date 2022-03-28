import React from "react";
import { useState, useEffect } from "react";
import {
  Pagination,
  Switch,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material/";
import { InputLabel, MenuItem, Select } from "@mui/material/";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

function Graph() {
  const [post, setPost] = useState();
  const [chartObj, setChartObj] = useState([]);
  const [data, setData] = useState([]);
  const [range, setRange] = useState(5);
  const [mode, setmode] = useState("dark");
  const [param, setParam] = React.useState("country");

  Chart.register(...registerables);

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });
  Chart.defaults.color = theme.palette.text.primary;
  Chart.defaults.scale.grid.color = theme.palette.divider;

  useEffect(() => {
    axios
      .get(`https://disease.sh/v3/covid-19/countries`)
      .then((res) => setPost(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    post && setData(post.slice(range - 5, range));
  }, [post, range]);
  useEffect(() => {
    data.sort((a, b) =>
      a[param] > b[param] ? 1 : b[param] > a[param] ? -1 : 0
    );

    setChartObj({
      labels: data.map((d) => d.country),
      datasets: [
        {
          label: "Total Deaths",
          data: data.map((d) => d.deaths),
          backgroundColor: "rgba(255, 87, 51, 0.7)",
        },
        {
          label: "Active",
          data: data.map((d) => d.active),
          backgroundColor: "rgba(84, 50, 211, 0.7)",
        },

        {
          label: "Total Recovered",
          data: data.map((d) => d.recovered),

          backgroundColor: "rgba(78, 204, 163, 0.7)",
        },
        {
          label: "Total Confirmed",
          data: data.map((d) => d.cases),
          backgroundColor: "rgba(221, 16, 94, 0.7)",
        },
      ],
    });
  }, [data, param]);

  const handleChange = (e, val) => {
    setRange(val * 5);
  };

  const toggle = () => {
    setmode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleSelect = (event) => {
    setParam(event.target.value);
    console.log(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <div className="graph">
          {chartObj.labels && (
            <Bar
              data={chartObj}
              options={{
                fill: true,
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Covid Stats",
                  },
                },
                scales: {
                  y: {
                    grid: {
                      color: theme.palette.divider,
                    },
                  },
                  x: {
                    grid: {
                      color: theme.palette.divider,
                    },
                  },
                },
              }}
            />
          )}
        </div>
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
              value={param}
              label="Sort By"
              onChange={handleSelect}
            >
              <MenuItem value={"country"}>Country </MenuItem>
              <MenuItem value={"cases"}>Confirmed</MenuItem>
              <MenuItem value={"deaths"}>Deaths</MenuItem>
              <MenuItem value={"recovered"}>Recovered</MenuItem>
              <MenuItem value={"active"}>Active</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Graph;
