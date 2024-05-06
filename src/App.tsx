import { requests } from "./request";
import { Row } from "./components/Row";
import { Banner } from "./components/Banner";
import { Header } from "./components/Header";

const App = () => {
    return (
        <>
            <div className="App">
                <Header />
                <Banner />
                <Row title={'NETFLIX ORIGINAL'} fetchUrl={requests.fetchNetflixOriginals} isLargeRow={true} />
                <Row title={'Top Rated'} fetchUrl={requests.fetchTopRated} />
                <Row title={'Action'} fetchUrl={requests.fetchActionMovies} />
                <Row title={'News'} fetchUrl={requests.fetchNewsMovies} />
                <Row title={'Kids'} fetchUrl={requests.fetchKidsMovies} />
                <Row title={'Romance'} fetchUrl={requests.fetchRomanceMovies} />
                <Row title={'Document'} fetchUrl={requests.fetchDocumentMovies} />
            </div>
        </>
    );
}

export default App;