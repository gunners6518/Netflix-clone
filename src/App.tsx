import { requests } from "./request";
import { Row } from "./components/Row";

const App = () => {
    return (
        <>
            <div className="App">
                <Row title={'NETFLIX ORIGINAL'} fetchUrl={requests.fetchNetflixOriginals} isLargeRow={true} />
                <Row title={'Top Rated'} fetchUrl={requests.fetchTopRated} isLargeRow={false} />
                <Row title={'Action'} fetchUrl={requests.fetchActionMovies} isLargeRow={false} />
                <Row title={'News'} fetchUrl={requests.fetchNewsMovies} isLargeRow={false} />
                <Row title={'Kids'} fetchUrl={requests.fetchKidsMovies} isLargeRow={false} />
                <Row title={'Romance'} fetchUrl={requests.fetchRomanceMovies} isLargeRow={false} />
                <Row title={'Document'} fetchUrl={requests.fetchDocumentMovies} isLargeRow={false} />
            </div>
        </>
    );
}

export default App;