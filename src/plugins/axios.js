import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: 'a3823122779bf76b11f70cd8ec754d8a',
    language: 'pt-BR'
  }
})

export default api
