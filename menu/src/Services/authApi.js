import axios from 'axios';
import { IAM_URL } from './baseUrl';

export const authApiGenerateToken = async (httpMethod, url, reqBody) => {
    // build the axios config
    const config = {
        method: httpMethod,
        url: `${IAM_URL}${url}`,
        data: reqBody
    };

    // log the full config before sending
    console.log('[authApi] → Request config:', {
        method: config.method,
        url:   config.url,
        body:  config.data
    });

    try {
        const response = await axios(config);
        // log status & a snippet of data on success
        console.log('[authApi] ← Response:', {
            status: response.status,
            data:   response.data,
        });
        return response;
    } catch (err) {
        // if it's an HTTP error, log status + body, otherwise log message
        if (err.response) {
            console.error('[authApi] × HTTP Error:', {
                status: err.response.status,
                data:   err.response.data,
            });
        } else {
            console.error('[authApi] × Network/Error:', err.message);
        }
        // re-throw so callers can handle it
        throw err;
    }
};




export const authApiGenerateRefreshToken = async (httpMethod, url, reqBody) => {
    // build the axios config
    const config = {
        method: httpMethod,
        url: `${IAM_URL}${url}`,
        data: reqBody
    };

    // log the full config before sending
    console.log('[authApi] → Request config:', {
        method: config.method,
        url:   config.url,
        body:  config.data
    });

    try {
        const response = await axios(config);
        // log status & a snippet of data on success
        console.log('[authApi] ← Response:', {
            status: response.status,
            data:   response.data,
        });
        return response;
    } catch (err) {
        // if it's an HTTP error, log status + body, otherwise log message
        if (err.response) {
            console.error('[authApi] × HTTP Error:', {
                status: err.response.status,
                data:   err.response.data,
            });
        } else {
            console.error('[authApi] × Network/Error:', err.message);
        }
        // re-throw so callers can handle it
        throw err;
    }
};
