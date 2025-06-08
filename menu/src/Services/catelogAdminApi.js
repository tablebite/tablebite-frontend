// src/Services/catelogAdminApi.js
import axios from 'axios';
import { CATELOG_BASEURL } from './baseUrl';  // same base URL, or point to a different ADMIN_BASEURL if you have one

/**
 * A thin wrapper around axios to hit your catalog-admin endpoints.
 *
 * @param {'GET'|'POST'|'PUT'|'DELETE'} httpMethod
 * @param {string} url            the path *after* CATELOG_BASEURL
 * @param {object} [reqBody]      optional request body
 * @param {object} [reqHeader]    optional headers (defaults to application/json)
 */
export const catelogAdminAPI = async (httpMethod, url, reqBody, reqHeader) => {
  const reqConfig = {
    method:  httpMethod,
    url:     `${CATELOG_BASEURL}${url}`,
    data:    reqBody,
    headers: reqHeader ?? { 'Content-Type': 'application/json' },
  };

  return axios(reqConfig)
    .then(response => response)
    .catch(error => Promise.reject(error));
};
