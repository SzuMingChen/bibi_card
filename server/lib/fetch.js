const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

//# FETCH ERROR #//
class HTTPResponseError extends Error {
    constructor(response) {
        super(`HTTP Error Response: ${response.status} ${response.statusText}`);
        this.response = response;
    }
}

const checkStatus = async (response) => {
    if (response.ok) {
        // response.status >= 200 && response.status < 300
        return await response.json();
    } else {
        throw new HTTPResponseError(response);
    }
}

//# FETCH AREA #//
exports.fetchGET = async function ({ targetAddress, params, query } = {}) {
    // console.log("拿到的", params);
    let url = "";

    // console.log(1);
    if (targetAddress !== undefined && typeof targetAddress === 'string') { url += `${targetAddress}` }
    else if (targetAddress !== undefined && typeof targetAddress !== 'string') { throw [false, "targetAddress input err"] };
    // console.log("targetAddress =>", url);

    // console.log(2);
    if (params !== undefined && typeof params === 'string') { url += `/${params}` }
    else if (params !== undefined && typeof params !== 'string') { throw [false, "params input err"] };
    // console.log("Params =>", url);

    // console.log(3);
    if (query !== undefined && typeof query === 'string' && query[0] === "&") { url += `${query}` }
    else if (query !== undefined && typeof query !== 'string' && query[0] !== "&") { throw [false, "query input err"] };
    // console.log("Query =>", url);

    try {
        // console.log(4);
        console.log(`\n ◈◈fetchGET◈◈   ※▶※▶※▶※▶ ${url} ◄※◄※◄※◄※` );
        const response = await fetch(url);

        return checkStatus(response);
    } catch (error) {
        // console.error(error);
        console.log(`\n ✖✖fetchGET✖✖   ※▶※▶※▶※▶ ${error} ◄※◄※◄※◄※` );

        // const errorBody = await error.response.text();
        // console.error(`Error body: ${errorBody}`);
        throw [false];
    }


}

exports.fetchPOST = async function ({ targetAddress, params, query, body = {} } = {}) {
    let url = "";

    // console.log(1);
    if (targetAddress !== undefined && typeof targetAddress === 'string') { url += `${targetAddress}` }
    else if (targetAddress !== undefined && typeof targetAddress !== 'string') { throw [false, "targetAddress input err"] };
    // console.log("targetAddress =>", url);

    // console.log(2);
    if (params !== undefined && typeof params === 'string') { url += `/${params}` }
    else if (params !== undefined && typeof params !== 'string') { throw [false, "params input err"] };
    // console.log("Params =>", url);

    // console.log(3);
    if (query !== undefined && typeof query === 'string' && query[0] === "&") { url += `${query}` }
    else if (query !== undefined && typeof query !== 'string' && query[0] !== "&") { throw [false, "query input err"] };
    // console.log("Query =>", url);


    try {
        // console.log(4);
        console.log(`\n ◈◈fetchPOST◈◈   ※▶※▶※▶※▶ ${url} ◄※◄※◄※◄※` );
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return checkStatus(response);
    } catch (error) {
        // console.error(error);
        console.log(`\n ✖✖fetchPOST✖✖   ※▶※▶※▶※▶ ${error} ◄※◄※◄※◄※` );

        // const errorBody = await error.response.text();
        // console.error(`Error body: ${errorBody}`);
        throw [false];
    }


}

exports.fetchPUT = async function ({ targetAddress, params, query, body = {} } = {}) {
    let url = "";

    // console.log(1);
    if (targetAddress !== undefined && typeof targetAddress === 'string') { url += `${targetAddress}` }
    else if (targetAddress !== undefined && typeof targetAddress !== 'string') { throw [false, "targetAddress input err"] };
    // console.log("targetAddress =>", url);

    // console.log(2);
    if (params !== undefined && typeof params === 'string') { url += `/${params}` }
    else if (params !== undefined && typeof params !== 'string') { throw [false, "params input err"] };
    console.log("Params =>", url);

    // console.log(3);
    if (query !== undefined && typeof query === 'string' && query[0] === "&") { url += `${query}` }
    else if (query !== undefined && typeof query !== 'string' && query[0] !== "&") { throw [false, "query input err"] };
    // console.log("Query =>", url);


    try {
        // console.log(4);
        console.log(`\n ◈◈fetchPUT◈◈   ※▶※▶※▶※▶ ${url} ◄※◄※◄※◄※` );
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return checkStatus(response);
    } catch (error) {
        // console.error(error);
        console.log(`\n ✖✖fetchPUT✖✖   ※▶※▶※▶※▶ ${error} ◄※◄※◄※◄※` );

        // const errorBody = await error.response.text();
        // console.error(`Error body: ${errorBody}`);
        throw [false];
    }


}

exports.fetchDELETE = async function ({ targetAddress, params, query, body = {} } = {}) {
    let url = "";

    // console.log(1);
    if (targetAddress !== undefined && typeof targetAddress === 'string') { url += `${targetAddress}` }
    else if (targetAddress !== undefined && typeof targetAddress !== 'string') { throw [false, "targetAddress input err"] };
    // console.log("targetAddress =>", url);

    // console.log(2);
    if (params !== undefined && typeof params === 'string') { url += `/${params}` }
    else if (params !== undefined && typeof params !== 'string') { throw [false, "params input err"] };
    // console.log("Params =>", url);

    // console.log(3);
    if (query !== undefined && typeof query === 'string' && query[0] === "&") { url += `${query}` }
    else if (query !== undefined && typeof query !== 'string' && query[0] !== "&") { throw [false, "query input err"] };
    // console.log("Query =>", url);


    try {
        // console.log(4);
        console.log(`\n ◈◈fetchDELETE◈◈   ※▶※▶※▶※▶ ${url} ◄※◄※◄※◄※` );
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return checkStatus(response);
    } catch (error) {
        // console.error(error);
        console.log(`\n ✖✖fetchDELETE✖✖   ※▶※▶※▶※▶ ${error} ◄※◄※◄※◄※` );
        // const errorBody = await error.response.text();
        // console.error(`Error body: ${errorBody}`);
        throw [false];
    }


}