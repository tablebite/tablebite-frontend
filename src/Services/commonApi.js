import axios from 'axios';
import { BASEURL } from './baseUrl'; // Ensure correct import path

export const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {
    let reqConfig = {
        method: httpMethod,
        url: `${BASEURL}${url}`, // Prepend BASEURL here
        data: reqBody,
        headers: reqHeader ? reqHeader : { "Content-Type": "application/json" },
    };

    return await axios(reqConfig)
        .then(result => result)
        .catch(err => err);
};
