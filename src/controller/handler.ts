import { Request, Response } from 'express';
import mariadb from 'mariadb';
import log4js from "log4js";

export function connectHandler(req: Request, res: Response) {
    const logger = log4js.getLogger("dama");
    logger.info("POST /connect");
    logger.info(`Wallet Adapter Name: ${req.body.adapter}`);
    res.json({ outcome: true });
}

export function sendEmailHandler(req: Request, res: Response) {
    const logger = log4js.getLogger("dama");
    logger.info("POST /sendemail");
    logger.info(`Message From: ${req.body.email}`);
    logger.info(`Message Subject: ${req.body.subject}`);
    logger.info(`Message: ${req.body.message}`);

    res.json({ outcome: true });

    const pool = mariadb.createPool({
        host: process.env.db_host,
        user: process.env.db_username,
        password: process.env.db_password,
        database: process.env.db_database,
        connectionLimit: 5
    });
    pool.getConnection()
        .then(conn => {
            conn.query("SELECT * from Mail;")
            .then((rows) => {
                console.log(rows);
            });
        }).catch(err => {
            //not connected
            logger.error("db connection failed");
            logger.error(err);
        });
}
