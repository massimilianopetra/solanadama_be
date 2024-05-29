import express, {Express} from "express";
import Router from "./routes";
const HTTP_PORT = 4000;

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