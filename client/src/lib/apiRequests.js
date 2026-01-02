import axios from "axios";

// const apiRequest = axios.create({
//     baseURL:"https://easycar.onrender.com/api",
//     withCredentials:true,
// })

// const apiRequest = axios.create({
//     baseURL:"http://localhost:8800/api",
//     withCredentials:true,
// })

const apiRequest = axios.create({
    baseURL:"https://easycar-hair.onrender.com/api",
    withCredentials:true,
})

export default apiRequest;
