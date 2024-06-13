import { Request, Response, NextFunction, Router} from 'express';
import {connectHandler, sendEmailHandler, readEmailHandler} from "../controller/handler";
import {sendTrasaction, sendTrasactionDevnet, confirmTrasaction, confirmTrasactiondDevnet} from "../controller/solanaHandler";
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

// readdemail
router.get("/reademail", readEmailHandler);

// sendtransaction
router.post("/sendtransaction", sendTrasaction);

// sendtransactiondevnet
router.post("/sendtransactiondevnet", sendTrasactionDevnet);

// confirmtransactio
router.post("/confirmtransactio", confirmTrasaction);

// confirmtransactiodevnet
router.post("/confirmtransactiodevnet", confirmTrasactiondDevnet);

export default router;