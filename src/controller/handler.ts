import { Request, Response} from 'express';
import log4js from "log4js";

export function connectHandler(req: Request, res: Response){
    const logger = log4js.getLogger("dama");
    logger.info("POST /connect");
    console.log(req.body);
    logger.info(`Wallet Adapter Name: ${req.body.adapter}`);
    res.json({outcome:true});
}