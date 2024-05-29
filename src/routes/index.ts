import { Request, Response, NextFunction, Router } from 'express';
import log4js from "log4js";

const router = Router();
log4js.configure({
    appenders: { dama: { type: "datefile", filename: "dama_be.log",pattern: "yyyy-MM-dd",compress: true} },
    categories: { default: { appenders: ["dama"], level: "info" } },
});

const timeLog = (req: Request, res: Response, next: NextFunction) => {
    const logger = log4js.getLogger("dama");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    logger.info(`connection from ${ip}`);
    next();
}

router.use(timeLog);
router.get("/", (req, res) => {
    res.send("Access denied. How about trying a Sudoku puzzle instead?");
});

export default router;