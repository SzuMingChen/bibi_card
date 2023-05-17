exports.send = (responseStatus, data) => {
    return {
        ...responseStatus,
        data
    }
}

