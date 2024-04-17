const API_KEY = "xxx";
const BASE_URL = "/discover/tv?api_key=";

export const requests ={
    fetchTrending:`/trending/all/week?api_key=${API_KEY}&language=ja`,
    fetchNetflixOriginals:`${BASE_URL}${API_KEY}&with_networks=213`,
    fetchTopRated:`${BASE_URL}${API_KEY}&language=ja`,
    fetchActionMovies:`${BASE_URL}${API_KEY}&with_genres=10759`,
    fetchNewsMovies:`${BASE_URL}${API_KEY}&with_genres=10763`,
    fetchKidsMovies:`${BASE_URL}${API_KEY}&with_genres=10762`,
    fetchRomanceMovies:`${BASE_URL}${API_KEY}&with_genres=10749`,
    fetchDocumentMovies:`${BASE_URL}${API_KEY}&with_genres=99`,
}
