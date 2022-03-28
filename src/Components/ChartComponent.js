import React, { useState, useEffect, useContext, createContext } from "react";
import { Data } from "../App";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material/";
import Menu from "./Menu";

export const Mode = createContext();
export const SortParam = createContext();
export const ChartType = createContext();
function ChartComponent() {
  const post = useContext(Data);
  const [chartObj, setChartObj] = useState([]);
  const [data, setData] = useState([]);
  const [range, setRange] = useState(5);
  const [mode, setmode] = useState("dark");
  const [param, setParam] = useState("country");
  const [GraphType, setGraphType] = useState(Bar);

  Chart.register(...registerables);
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });
  Chart.defaults.color = theme.palette.text.primary;
  Chart.defaults.scale.grid.color = theme.palette.divider;

  const handleclick = (rng) => {
    setRange(rng);
  };

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        {chartObj.labels && (
          <GraphType
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
            }}
          />
        )}
        <Mode.Provider value={{ mode, setmode }}>
          <SortParam.Provider value={{ param, setParam }}>
            <ChartType.Provider value={{ GraphType, setGraphType }}>
              <Menu fun={handleclick} />
            </ChartType.Provider>
          </SortParam.Provider>
        </Mode.Provider>
      </div>
    </ThemeProvider>
  );
}

export default ChartComponent;
