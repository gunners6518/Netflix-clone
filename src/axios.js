import axios from 'axios'


//movie databaseからのbaseURLリクエストを作成
export const instance = axios.create({
    baseURL:"https://api.themoviedb.org/3",
});

//使い方
// instance.get('/foo-bar')
// https://api.themoviedb.org/3/foo-bar