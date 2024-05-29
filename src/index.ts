import express, {Express} from "express";
import log4js from "log4js";
import Router from "./routes/index";

const HTTP_PORT = 4000;

log4js.configure({
    appenders: { dama: { type: "datefile", filename: "dama_be.log",pattern: "yyyy-MM-dd",compress: true} },
    categories: { default: { appenders: ["dama"], level: "info" } },
});

const startServer = () => {
    const app: Express = express();
    app.use(express.json());
    app.use("/", Router);
    app.listen(HTTP_PORT, () => {
        console.log(`HTTP Server Listening on ${HTTP_PORT}`);
    });

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