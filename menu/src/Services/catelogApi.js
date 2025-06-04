import axios from 'axios';
import { CATELOG_BASEURL } from './baseUrl'; // Ensure correct import path

export const catelogAPI = async (httpMethod, url, reqBody, reqHeader) => {
    let reqConfig = {
        method: httpMethod,
        url: `${CATELOG_BASEURL}${url}`, // Prepend BASEURL here
        data: reqBody,
        headers: reqHeader ? reqHeader : { "Content-Type": "application/json" },
    };

    return await axios(reqConfig)
        .then(result => result)
        .catch(err => err);
};
