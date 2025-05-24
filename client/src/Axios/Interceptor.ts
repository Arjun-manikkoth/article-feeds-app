import axios from "axios";
import { baseUrl } from "../Constants/constant";

const instance = axios.create({
    baseURL: `${baseUrl}`,
    withCredentials: true, // Send cookies with every request
});

export default instance;
