import express, { Express } from "express";
import log4js from "log4js";
import fs from 'fs';
import path from 'path';
import https from 'https';
import Router from "./routes/index";
import dotenv from 'dotenv';

// read .env file
dotenv.config({ path: "../.env" });
console.log("----------------");
console.log(process.env)
console.log("----------------");

const HTTP_PORT = 13144;

log4js.configure({
    appenders: { dama: { type: "dateFile", filename: "./log/dama_be.log", pattern: "yyyy-MM-dd", compress: true } },
    categories: { default: { appenders: ["dama"], level: "info" } },
});

const startServer = () => {
    const app: Express = express();
    app.use(express.json());
    app.use("/", Router);

    const httpsServer = https.createServer({
        passphrase: "password",
        pfx: fs.readFileSync(path.resolve(__dirname, '../star_fixip_org.p12')),
    }, app);

    httpsServer
        .listen(HTTP_PORT, () => {
            console.log(`HTTPS Server Listening on ${HTTP_PORT}`);
        });

    /*
    app.listen(HTTP_PORT, () => {
        console.log(`HTTP Server Listening on ${HTTP_PORT}`);
    });
    */
};

(() => {
    try {
        console.log("Starting HTTP Server ...");
        startServer();
        console.log("HTTP Server is ready");
    } catch (error) {
        console.log(`Server error ${error}`);
    }
})();