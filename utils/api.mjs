import dotenv from 'dotenv'
dotenv.config()

import fetch from 'node-fetch';
import queryString from 'query-string';
import { checkDates } from './utils.mjs';

const apiKey = process.env.BUNGIE_API_KEY;
const baseURL = 'https://www.bungie.net';
const apiURL = baseURL+'/Platform';

export let getProfile = (type, id, components) => new Promise((resolve, reject) => {

    let queryParams = queryString.stringify({components: components});

    fetch(`${apiURL}/Destiny2/${type}/Profile/${id}/?${queryParams}`, {
        method: 'GET',
        headers: {
            "X-API-Key": apiKey
        }
    })
    .then((response) => {
        if (response.status !== 200) {
            console.log('Error Performing GET Profile. Status Code: ' + response.status);
            reject('Error Performing GET Profile.');
        } else {
            response.json().then((data) => {
                // console.log(data);
                resolve(data.Response);
            });
        }
    })
    .catch((err) => {
        console.log('Fetch Error : getProfile : ', id, ' : ', err);
        reject('Fetch Error : getProfile');
    });
})

export let getActivities = (character, count, mode, page, date=null, rest=[]) => new Promise((resolve, reject) => {

    let queryParams = queryString.stringify({count: count, mode: mode, page: page});

    fetch(` ${apiURL}/Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/?${queryParams}`, {
        method: 'GET',
        headers: {
            "X-API-Key": apiKey
        }
    })
    .then((response) => {
        if (response.status !== 200) {
            // console.log('Error Performing GET Activities. Status Code: ' + response.status);
            // reject('Error Performing GET Activities.');
            // If a profile is private it will 500, so just resolve for now.
            resolve(rest)
        } else {
            response.json().then((data) => {
                if (data.Response && data.Response.activities && data.Response.activities.length > 0) {
                    const lastDate = new Date(data.Response.activities[data.Response.activities.length-1].period)
                    if (date && checkDates(date, lastDate)) {
                        resolve(getActivities(character, count, mode, page+1, date, rest.concat(data.Response.activities)))
                    } else if (date && 
                                lastDate.getYear() > date.getYear() || 
                                (lastDate.getYear() === date.getYear() && lastDate.getMonth() > date.getMonth())) {
                        resolve(getActivities(character, count, mode, page+1, date))
                    } else {
                        resolve(rest.concat(data.Response.activities))
                    }
                } else {
                    resolve(data.Response)
                }
            });
        }
    })
    .catch((err) => {
        console.log('Fetch Error : getActivities : ', err);
        reject('Fetch Error : getActivities');
        // Instead of reject. Try again. Sometimes a request will randomly timeout. TODO: Add back-off.
        // resolve(getActivities(character, count, mode, page, date, rest))
    });
})

export let searchClans = (name) => new Promise((resolve, reject) => {

    let params = {
        groupName: name, 
        groupType: 1
    }

    fetch(` ${apiURL}/GroupV2/NameV2/`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            "X-API-Key": apiKey
        }
    })
    .then((response) => {
        if (response.status !== 200) {
            console.log('Error Performing POST GroupSearch. Status Code: ' + response.status);
            reject('Error Performing POST GroupSearch.');
        } else {
            response.json().then((data) => {
                // console.log(data);
                resolve(data.Response);
            });
        }
    })
    .catch((err) => {
        console.log('Fetch Error : searchClans : ', err);
        reject('Fetch Error : searchClans');
    });
})

export let getClan = (groupId) => new Promise((resolve, reject) => {

    fetch(`${apiURL}/GroupV2/${groupId}/`, {
        method: 'GET',
        headers: {
            "X-API-Key": apiKey
        }
    })
    .then((response) => {
        if (response.status !== 200) {
            console.log('Error Performing GET Clan. Status Code: ' + response.status);
            reject('Error Performing GET Clan.');
        } else {
            response.json().then((data) => {
                // console.log(data);
                resolve(data.Response);
            });
        }
    })
    .catch((err) => {
        console.log('Fetch Error : getClan : ', err);
        reject('Fetch Error : getClan');
    });
})

export let getClanMembers = (groupId) => new Promise((resolve, reject) => {

    let queryParams = queryString.stringify({currentPage: 1});

    fetch(`${apiURL}/GroupV2/${groupId}/Members/?${queryParams}`, {
        method: 'GET',
        headers: {
            "X-API-Key": apiKey
        }
    })
    .then((response) => {
        if (response.status !== 200) {
            console.log('Error Performing GET Clan Members. Status Code: ' + response.status);
            reject('Error Performing GET Clan Members.');
        } else {
            response.json().then((data) => {
                // console.log(data);
                resolve(data.Response);
            });
        }
    })
    .catch((err) => {
        console.log('Fetch Error : getClanMembers : ', err);
        reject('Fetch Error : getClanMembers');
    });
})