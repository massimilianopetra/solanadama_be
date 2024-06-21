import express, { Express } from "express";
import log4js from "log4js";
import fs from 'fs';
import path from 'path';
import https from 'https';
import Router from "./routes/index";
import dotenv from 'dotenv';

// read .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const logfile = path.resolve(__dirname, '../log/dama_be.log')

log4js.configure({
    appenders: { dama: { type: "dateFile", filename: logfile, pattern: "yyyy-MM-dd", compress: true } },
    categories: { default: { appenders: ["dama"], level: "info" } },
});

const startServer = () => {
    const logger = log4js.getLogger("dama");
    const app: Express = express();
    app.use(express.json());
    app.use("/", Router);

    const httpsServer = https.createServer({
        passphrase: "password",
        pfx: fs.readFileSync(path.resolve(__dirname, '../star_fixip_org.p12')),
    }, app);

    httpsServer
        .listen(process.env.solanadama_port || 13144, () => {
            logger.info(`HTTPS Server Listening on ${process.env.solanadama_port || 13144}`);
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