const path = require("path");
const express = require("express");
const hbs = require("hbs");
const weather = require("./utils/weather");
const geocoding = require("./utils/geocoding");

// const raw = require("./utils/raw");

//configurazioni per express
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//express
const port = process.env.PORT ?? 3000;
const app = express();

//configura handlebars
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//gestitsci risorse statiche
app.use(express.static(publicPath));

app.get("/", (req, res) => {
    res.render("index", {
        title: "Weather App",
        author: "Gimmi Tiozzo",
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About",
        author: "Gimmi Tiozzo",
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        author: "Gimmi Tiozzo",
        text: "pagina di aiuto",
    });
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "404 Error",
        author: "Gimmi Tiozzo",
        error: "Help article not found",
        errorType: "404",
    });
});

app.get("/weather", async (req, res) => {
    try {
        const address = req.query.address;

        if (!address) {
            return res.status(400).json({ error: "address parameter must be declare into querystring" });
        }

        const coordinate = await geocoding.getGeocodingPromise(address);
        const info = await weather.getWeatherPromise(coordinate);

        // const coordinate = await raw.getGeocodingPromise(address);
        // const info = await raw.getWeatherPromise(coordinate);

        res.send({ address, location: info.location, forecast: info.description });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get("*", (req, res) => {
    res.render("404", {
        title: "404 Error",
        author: "Gimmi Tiozzo",
        error: "404, Page not found",
        errorType: "404",
    });
});

app.listen(port, () => {
    console.log(`Weather loaded at port: ${port}`);
});
