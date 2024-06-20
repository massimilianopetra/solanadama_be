import { Request, Response } from 'express';
import log4js from "log4js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { clusterApiUrl, Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import * as fs from 'fs';
import bs58 from 'bs58';

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
    }

    res.json({ outcome: "ERROR" });
}

export async function sendTrasaction(req: Request, res: Response) {
    const logger = log4js.getLogger("dama");
    logger.info("POST /sendtransaction");

    const connection = new Connection(clusterApiUrl("mainnet-beta"));

    const txBS58: string = req.body.params[0];

    // txBS58 is truthy strValue was non-empty string, true, 42, Infinity, [],
    if (txBS58) {
        const txUint8Array = bs58.decode(txBS58);
 
        const txid = await connection.sendRawTransaction(txUint8Array);
        logger.info(`txid = ${txid}`);
        res.json({
            "jsonrpc": "2.0",
            "result": txid,
            "id": 1
        });
    }

    res.json({ outcome: "ERROR" });
}

export async function confirmTrasactiondDevnet(req: Request, res: Response) {
    const logger = log4js.getLogger("dama");
    logger.info("POST /confirmtransactiondevnet");

    const connection = new Connection(clusterApiUrl("devnet"));

    const txid: string = req.body.resut;

    // txid is truthy strValue was non-empty string, true, 42, Infinity, [],
    if (txid) {

        logger.info(`txid = ${txid}`);
        const latestBlockHash = await connection.getLatestBlockhash();

        const result = await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txid,
        });

        logger.info(result);
        
        res.json({ outcome: "OK" });

    }

    res.json({ outcome: "ERROR" });
}

export async function confirmTrasaction(req: Request, res: Response) {
    const logger = log4js.getLogger("dama");
    logger.info("POST /confirmtransaction");

    const connection = new Connection(clusterApiUrl("mainnet-beta"));

    const txid: string = req.body.resut;

    // txid is truthy strValue was non-empty string, true, 42, Infinity, [],
    if (txid) {

        logger.info(`txid = ${txid}`);
        res.json({ outcome: "OK" });

    }

    res.json({ outcome: "ERROR" });
}
