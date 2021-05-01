import React from "react";
import "./App.css";
import { Row } from "./compornents/Row";
import { Banner } from "./compornents/Banner";
import { Nav } from "./compornents/Nav";
import { requests } from "./request";

function App() {
  return (
    <div className="App">
      <Nav />
      <Banner />
      {/* <Row title="NETFLIX ORIGUINALS" fetchUrl={} isLargeRow /> */}
      <Row title="Top Rated" requests={requests.TopRate} />
      <Row title="Anime Movies" requests={requests.AnimeMovies} />
      <Row title="Horror Movies" requests={requests.HorrorMovies} />
      <Row title="Comdedy Movies" requests={requests.ComdedyMovies} />
      <Row title="Documentary Movies" requests={requests.DocumentaryMovies} />
      <Row title="Romance Movies" requests={requests.RomanceMovies} />
    </div>
  );
}

export default App;
