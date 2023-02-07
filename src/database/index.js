
var sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    }
    else {
        console.log('Connected to the SQLite database.')

        const createRideTableSchema = `
            CREATE TABLE Rides
            (
            rideID INTEGER PRIMARY KEY AUTOINCREMENT,
            startLat DECIMAL NOT NULL,
            startLong DECIMAL NOT NULL,
            endLat DECIMAL NOT NULL,
            endLong DECIMAL NOT NULL,
            riderName TEXT NOT NULL,
            driverName TEXT NOT NULL,
            driverVehicle TEXT NOT NULL,
            created DATETIME default CURRENT_TIMESTAMP
            )
        `;

        db.run(createRideTableSchema, (err) => {
            if (err) {
                // Table already created
            } else {
                // Table just created
            }
        });
    }
});

module.exports = db