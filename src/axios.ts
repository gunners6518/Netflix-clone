import axios from 'axios'

//TMDBからのbaseURLリクエストを作成
const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export default instance;