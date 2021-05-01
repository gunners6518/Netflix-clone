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
      <Row title="Top Rated" requests={requests.NetflixOriginals} />
      <Row title="Anime Movies" requests={requests.AnimeMovies} />
      <Row title="Romance Movies" requests={requests.RomanceMovies} />
    </div>
  );
}

export default App;
