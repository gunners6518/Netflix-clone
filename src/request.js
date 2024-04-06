const API_KEY = "998fbc8cc4dcef8db8fe2fd268686191";

export const requests ={
    fetchTrending:`/trending/all/week?api_key=${API_KEY}&language=ja`,
    fetchNetflixOriginals:`/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchTopRated:`/discover/tv?api_key=${API_KEY}&language=ja`,
    fetchActionMovies:`/discover/tv?api_key=${API_KEY}&with_genres=28`,
    fetchComedyMovies:`/discover/tv?api_key=${API_KEY}&with_genres=35`,
    fetchHorrorMovies:`/discover/tv?api_key=${API_KEY}&with_genres=27`,
    fetchRomanceMovies:`/discover/tv?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentMovies:`/discover/tv?api_key=${API_KEY}&with_genres=99`,
}
