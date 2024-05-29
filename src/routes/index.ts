import { Request, Response, NextFunction, Router} from 'express';
import {connectHandler, sendEmailHandler} from "../controller/handler";
import log4js from "log4js";

const router = Router();


const timeLog = (req: Request, res: Response, next: NextFunction) => {
    const logger = log4js.getLogger("dama");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    logger.info(`connection from ${ip}`);
    next();
}

router.use(timeLog); // connection logger

// root
router.get("/", (req, res) => {
    res.send("Access denied. How about trying a Sudoku puzzle instead?");
});

// connect
router.post("/connect", connectHandler);

// sendemail
router.post("/sendemail", sendEmailHandler);

export default router;