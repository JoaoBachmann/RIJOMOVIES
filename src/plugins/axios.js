import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDM5MTI0MDYwODUyYzZkYjY4NzkwNmE5M2RiMzk0ZCIsIm5iZiI6MTc1OTI1MjUxOS43OTEwMDAxLCJzdWIiOiI2OGRjMTAyNzk1MGE1MTExMGFjNzZmOWMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.90MkSbAAUQ4nnfiTTH098DGw89glRem6reBCPiiwhMs`,
  },
});

export default api;