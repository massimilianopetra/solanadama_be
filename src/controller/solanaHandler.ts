import { Request, Response } from 'express';
import log4js from "log4js";
import mariadb from 'mariadb';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { clusterApiUrl, Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import * as fs from 'fs';
import bs58 from 'bs58';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function mintTokenHandler(req: Request, res: Response) {
    const logger = log4js.getLogger("dama");
    logger.info("POST /minttoken");

    res.json({ outcome: true });
}


export async function sendTrasactionDevnet(req: Request, res: Response) {
    const logger = log4js.getLogger("dama");
    logger.info("POST /sendtransactiondevnet");

    const connection = new Connection(clusterApiUrl("devnet"));

    const txBS58: string = req.body.params[0];

    // txBS58 is truthy strValue was non-empty string, true, 42, Infinity, [],
    if (txBS58) {
        const txUint8Array = bs58.decode(txBS58);
        logger.info(txBS58)
        const txid = await connection.sendRawTransaction(txUint8Array);
        logger.info(`txid = ${txid}`);

        res.json({
            "jsonrpc": "2.0",
            "result": txid,
            "id": 1
        });

        const pool = mariadb.createPool({
            host: process.env.db_host,
            user: process.env.db_username,
            password: process.env.db_password,
            database: process.env.db_database,
            connectionLimit: 5
        });
        pool.getConnection()
            .then(conn => {
                conn.query("INSERT INTO Transaction (transaction,tx_id,status,ts,network,service) VALUES (?, ?, ?, ?, ?, ?)",
                    [txBS58, txid, "sent", Date.now(), "devnet", ""])
                    .then(() => {
                        logger.info("Tx inserted into table TransactionInteraction");
                        conn.end();
                        pool.end();
                    }).catch(err => {
                        logger.error("db query error");
                        logger.error(err);
                    });

            }).catch(err => {
                //not connected
                logger.error("db connection failed");
                logger.error(err);
            });
    } else {
        res.json({ outcome: "ERROR" });
    }
}

export async function sendTrasaction(req: Request, res: Response) {
    const logger = log4js.getLogger("dama");
    logger.info("POST /sendtransaction");

    const connection = new Connection(clusterApiUrl("mainnet-beta"));

    const txBS58: string = req.body.params[0];
    var txid = "0"

    // txBS58 is truthy strValue was non-empty string, true, 42, Infinity, [],
    if (txBS58) {
        const txUint8Array = bs58.decode(txBS58);
        logger.info(txBS58);

        // Try to send raw transaction 10 times
        var run = 10
        while (run > 0) {
            try {
                run--;
                logger.info(`send raw transaction attempt ${10-run}`);
                txid = await connection.sendRawTransaction(txUint8Array);
                if (txid) {
                    logger.info(`txid = ${txid}`);
                    run = 0;
                }
            } catch (error) {
                await sleep(400);
            }
        }

        if (txid != "0") {
            res.json({
                "jsonrpc": "2.0",
                "result": txid,
                "id": 1
            });

            const pool = mariadb.createPool({
                host: process.env.db_host,
                user: process.env.db_username,
                password: process.env.db_password,
                database: process.env.db_database,
                connectionLimit: 5
            });
            pool.getConnection()
                .then(conn => {
                    conn.query("INSERT INTO Transaction (transaction,tx_id,status,ts,network,service) VALUES (?, ?, ?, ?, ?, ?)",
                        [txBS58, txid, "sent", Date.now(), "mainnet-beta", ""])
                        .then(() => {
                            logger.info("Tx inserted into table Transaction");
                            conn.end();
                            pool.end();
                        }).catch(err => {
                            logger.error("db query error");
                            logger.error(err);
                        });

                }).catch(err => {
                    //not connected
                    logger.error("db connection failed");
                    logger.error(err);
                });
        }
        else {
            res.json({ outcome: "ERROR" });
        }

    } else {
        res.json({ outcome: "ERROR" });
    }
}

export async function confirmTrasactiondDevnet(req: Request, res: Response) {
    const logger = log4js.getLogger("dama");
    logger.info("POST /confirmtransactiondevnet");

    const connection = new Connection(clusterApiUrl("devnet"));
    const txid: string = req.body.result;

    if (txid) {

        logger.info(`txid = ${txid}`);
        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txid,
        });


        const result = await connection.getSignatureStatus(txid);
        logger.info(result.value?.confirmationStatus);

        if (result.value?.confirmationStatus) {
            res.json({ outcome: result.value?.confirmationStatus });
        } else {
            res.json({ outcome: "error" });
        }

    } else {
        res.json({ outcome: "error" });
    }
}

export async function confirmTrasaction(req: Request, res: Response) {
    const logger = log4js.getLogger("dama");
    logger.info("POST /confirmtransaction");

    const connection = new Connection(clusterApiUrl("mainnet-beta"));
    const txid: string = req.body.result;

    if (txid) {

        logger.info(`txid = ${txid}`);
        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txid,
        });


        const result = await connection.getSignatureStatus(txid);
        logger.info(result.value?.confirmationStatus);

        if (result.value?.confirmationStatus) {
            res.json({ outcome: result.value?.confirmationStatus });
        } else {
            res.json({ outcome: "error" });
        }

    } else {
        res.json({ outcome: "error" });
    }
}
