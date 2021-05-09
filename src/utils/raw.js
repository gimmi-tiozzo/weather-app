const https = require("https");
const http = require("http");
const keys = require("./keys");

/**
 * Ottieni le coordinate di una location
 * @param {string} location
 * @param {function} callback
 */
const getGeocoding = function (location, callback) {
    const options = {
        hostname: "api.mapbox.com",
        path: `/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${keys.mapBoxKey}`,
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
    };

    const req = https.request(options, (res) => {
        let data = "";

        res.on("error", (err) => {
            callback(err);
        });

        res.on("data", (chunck) => {
            data += chunck;
        });

        res.on("end", (res) => {
            const dataJSON = JSON.parse(data);

            if (dataJSON.features.length === 0) {
                callback(new Error("Location not found"));
                return;
            }

            const [feature] = dataJSON.features;
            const [longitude, latitude] = feature.center;

            callback(undefined, {
                latitude,
                longitude,
            });
        });
    });

    req.end();
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

/**
 * Ottieni le coordinate di una location
 * @param {string} location
 * @param {function} callback
 */
const getWeather = function ({ latitude, longitude } = {}, callback) {
    const options = {
        hostname: "api.weatherstack.com",
        path: `/current?access_key=${keys.weatherStackkey}&query=${latitude},${longitude}&unit=m`,
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
    };

    const req = http.request(options, (res) => {
        let data = "";

        res.on("error", (err) => {
            callback(err);
        });

        res.on("data", (chunck) => {
            data += chunck;
        });

        res.on("end", (res) => {
            const dataJSON = JSON.parse(data);

            //verifica che non ci siano errori applicativi
            if (dataJSON.success === false) {
                const error = dataJSON.error;
                callback(new Error(`${error.code} - ${error.info}`));
                return;
            }

            //destruttura la risposta è notifica via callback il risultato
            const {
                location,
                current,
                current: {
                    weather_descriptions: [description],
                },
            } = dataJSON;
            callback(undefined, {
                location: `${location.name} ${location.country}, ${location.region}`,
                temperature: current.temperature,
                feelTemperature: current.feelslike,
                weather: description,
                description: `${location.name} ${location.country}, ${location.region}, ${description} ${current.temperature} feel: ${current.feelslike}`,
            });
        });
    });

    req.end();
};

/**
 * Ottieni la condizione metereoligica di una location
 * @param { latitude, langitude } oggetto con le proprieta latitude e langitude
 */
const getWeatherPromise = function ({ latitude, longitude } = {}) {
    return new Promise((resolve, reject) => {
        getWeather({ latitude, longitude }, (error, data) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(data);
        });
    });
};

module.exports = {
    getWeather,
    getWeatherPromise,
    getGeocoding,
    getGeocodingPromise,
};
