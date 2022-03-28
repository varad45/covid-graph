import "./App.css";
import ChartComponent from "./Components/ChartComponent";
import axios from "axios";
import { useState, useEffect, createContext } from "react";

export const Data = createContext();
function App() {
  const [post, setPost] = useState();
  useEffect(() => {
    axios
      .get(`https://disease.sh/v3/covid-19/countries`)
      .then((res) => setPost(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <Data.Provider value={post}>
      <ChartComponent />
    </Data.Provider>
  );
}

export default App;
