
const { asyncFunc, asyncAddRider, asyncGetAllRides, asyncGetRiderById, asyncUpdateRider } = require('../controller')
const express = require('express');
var router = express.Router();

const asyncHandler = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next))
        .catch(next)
}

// Root endpoint
router.route('/').get(asyncHandler(async (req, res) => {
    res.json({"message": "Ok"})
}))

router.route('/health').get(asyncHandler(async (req, res) => {
    const result = await asyncFunc('Healthy')
    return res.send(result);
}))

router.route('/rides').post(asyncHandler(async (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;
    
    const result = await asyncAddRider(
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude,
        riderName,
        driverName,
        driverVehicle
    );

    return res.send(result);
}))

router.route('/rides').get(asyncHandler(async (req, res) => {
    const page = req.query.page;
    const perPage = req.query.perPage;

    const result = await asyncGetAllRides(page, perPage);
    return res.send(result);
}))

router.route('/rides/:id').get(asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await asyncGetRiderById(id);
    return res.send(result);
}))

router.route('/rides/:id').post(asyncHandler(async (req, res) => {
    const id = req.params.id;
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    const result = await asyncUpdateRider(
        id,
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude,
        riderName,
        driverName,
        driverVehicle
    );

    return res.send(result);
}))

module.exports = router