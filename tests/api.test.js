'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe("POST /rides", () => {
        it("it should return the inserted data on db", (done) => {
            let rideData = {
                start_lat: 80,
                start_long: 130,
                end_lat: 20,
                end_long: 150,
                rider_name: "john",
                driver_name: "jack",
                driver_vehicle: "VH5956231",
            };
        request(app)
            .post("/rides")
            .send(rideData)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res)=>{
                if (err) throw err;
                console.log(res.body);
                done();
            })
        });
    });
    
    describe("GET /rides", () => {
        it("should return rides pagination result ; it should not get without page and perPage field", (done) => {
        request(app)
            .get("/rides?page=1&perPage=2")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                console.log(res.body);
                done();
            });
        });
    });
});