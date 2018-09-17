import fetch from 'dva/fetch';
import setting from '@/defaultSettings'
import {stringify} from 'qs'

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
    url = setting.port + url
    const defaultOptions = {};
    const newOptions = { ...defaultOptions, ...options };
    if (
        newOptions.method === 'POST' ||
        newOptions.method === 'PUT' ||
        newOptions.method === 'DELETE'
    ) {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                ...newOptions.headers,
            };
            newOptions.body = stringify(options.body);
        } else {
            newOptions.headers = {
                Accept: 'application/json',
                ...newOptions.headers,
            };
        }
    }
    return fetch(url, newOptions)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => {
            return data
        })
        .catch(err => {
            console.log(err)
            return null
        });
}

