const request = require("request");
const keys = require("./keys");

/**
 * Ottieni la condizione metereoligica di una location
 * @param { latitude, langitude } oggetto con le proprieta latitude e langitude
 * @param {function} callback functione di rtorno
 */
const getWeather = function ({ latitude, longitude } = {}, callback) {
    //url webapi
    const url = `http://api.weatherstack.com/current?access_key=${keys.weatherStackkey}&query=${latitude},${longitude}&unit=m`;

    //eseguia la chiamata alla webapi weatherstack
    request({ url, json: true }, (error, response) => {
        //se c'è un lowlevel error notiticalo con la callback
        if (error) {
            callback(error);
            return;
        }

        //verifica che non ci siano errori applicativi
        if (response.body.success === false) {
            const error = response.body.error;
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
        } = response.body;
        callback(undefined, {
            location: `${location.name} ${location.country}, ${location.region}`,
            temperature: current.temperature,
            feelTemperature: current.feelslike,
            weather: description,
            description: `${location.name} ${location.country}, ${location.region}, ${description} ${current.temperature} feel: ${current.feelslike}`,
        });
    });
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
};
