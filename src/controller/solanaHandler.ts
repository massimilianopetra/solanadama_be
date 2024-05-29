import { Request, Response} from 'express';
import log4js from "log4js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { clusterApiUrl, Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import * as fs from 'fs';

export function mintTokenHandler(req: Request, res: Response){
    const logger = log4js.getLogger("dama");
    logger.info("POST /minttoken");

    res.json({outcome:true});
}