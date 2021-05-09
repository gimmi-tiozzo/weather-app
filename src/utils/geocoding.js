const request = require("request");
const keys = require("./keys");

/**
 * Ottieni le coordinate di una location
 * @param {string} location
 * @param {function} callback
 */
const getGeocoding = (location, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${keys.mapBoxKey}`;

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback(error);
            return;
        }

        if (response.body.features.length === 0) {
            callback(new Error("Location not found"));
            return;
        }

        const [feature] = response.body.features;
        const [longitude, latitude] = feature.center;

        callback(undefined, {
            latitude,
            longitude,
        });
    });
};

/**
 * Ottieni le coordinate di una location
 * @param {string} location
 */
const getGeocodingPromise = (location) => {
    return new Promise((resolve, reject) => {
        getGeocoding(location, (error, data) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(data);
        });
    });
};

module.exports = {
    getGeocoding,
    getGeocodingPromise,
};
