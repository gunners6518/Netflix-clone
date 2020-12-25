import React from "react";
import "./App.css";
import { Row } from "./compornents/Row";
import { requests } from "./request";

function App() {
  return (
    <div className="App">
      <h1>Netlix clone</h1>
      <Row
        title="NETFLIX ORIGUINALS"
        fetchUrl={requests.feachNetflixOriginals}
      />
      <Row title="Trending Now" fetchUrl={requests.feachTrending} />
    </div>
  );
}

export default App;
