const db = require("../database")

const asyncFunc = (text) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(text);
        }, 1000);
    })
}

const asyncAddRider = (
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
    riderName,
    driverName,
    driverVehicle
) => {
    return new Promise((resolve, reject) => {
        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            resolve(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            }));
            return;
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            resolve(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            }));
            return;
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            resolve(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            }));
            return;
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            resolve(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            }));
            return;
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            resolve(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            }));
            return;
        }

        var values = [startLatitude, startLongitude, endLatitude, endLongitude, riderName, driverName, driverVehicle];

        const result = db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {
                resolve(JSON.stringify({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                }));
                return;
            }

            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                if (err) {
                    resolve(JSON.stringify({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    }));
                    return;
                }

                resolve(rows);
            });
        });
    })
}

/**
 * 
 * @param {*current page number} page 
 * @param {*number of item per page} perPage 
 * @returns 
 */
const asyncGetAllRides = (page, perPage) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM Rides';
        db.all(sql, function (err, rows) {
            if (err) {
                resolve(JSON.stringify({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                }));
                return;
            }

            if (rows.length === 0) {
                resolve(JSON.stringify({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                }));
                return;
            }

            if (rows.length > 0)
            {
                const page_size = parseInt(perPage);
                const curPage = parseInt(page);
                let no = "";
                let totalCollectionCount = rows.length;
                if (totalCollectionCount < 0) {
                    totalCollectionCount = 0;
                }

                const totalPage = Math.ceil(totalCollectionCount / page_size);

                if (curPage < 0) {
                    no = 0;
                } else {
                    no = (curPage - 1) * page_size;
                }

                sql += " LIMIT " + no + "," + page_size + "";
                db.all(sql, [], function (error, rows) {
                    if (err) {
                        throw err;
                    }
                    resolve(JSON.stringify({
                        data: rows,
                        paging: {
                            total: totalCollectionCount,
                            page: curPage,
                            pages: totalPage
                        }
                    }));
                })
            } else {
                resolve(JSON.stringify({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                }))
            }
        
        });
    })
}

const asyncGetRiderById = (id) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Rides WHERE rideID=?', id, function (err, rows) {
            if (err) {
                resolve(JSON.stringify({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                }));
                return;
            }

            if (rows.length === 0) {
                resolve(JSON.stringify({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                }));
                return;
            }

            resolve(rows);
        });
    })
}

const asyncUpdateRider = (
    id,
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
    riderName,
    driverName,
    driverVehicle
) => {
    return new Promise((resolve) => {
        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            resolve(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            }));
            return;
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            resolve(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            }));
            return;
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            resolve(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            }));
            return;
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            resolve(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            }));
            return;
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            resolve(JSON.stringify({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            }));
            return;
        }

        const result = db.run('UPDATE Rides SET startLat=?, startLong=?, endLat=?, endLong=?, riderName=?, driverName=?, driverVehicle=? WHERE rideID=?', [startLatitude, startLongitude, endLatitude, endLongitude, riderName, driverName, driverVehicle, id], (err) => {
            if (err) {
                resolve(JSON.stringify({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                }));
                return;
            }

            db.all('SELECT * FROM Rides WHERE rideID = ?', id, function (err, rows) {
                if (err) {
                    resolve(JSON.stringify({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    }));
                    return;
                }

                resolve(rows);
            })
        })
    })
}

module.exports = {
    asyncFunc,
    asyncAddRider,
    asyncGetAllRides,
    asyncGetRiderById,
    asyncUpdateRider
}