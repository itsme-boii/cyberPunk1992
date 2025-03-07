import React, { useState } from 'react';
import { BN, ScriptTransactionRequest, bn, Address, Output, OutputType, Wallet, Predicate } from 'fuels';
import { NftFixedPriceSwapPredicate } from "../app/sellNFT/NftFixedPriceSwapPredicate"
import { useWallet } from '@fuels/react';

interface Config {
    FEE_AMOUNT: string;
    FEE_ASSET: string;
    TREASURY_ADDRESS: string;
    ASK_AMOUNT: string;
    ASK_ASSET: string;
    RECEIVER: string;
    NFT_ASSET_ID: string;
}


export function usePredicate(config: Config) {
    const {wallet} = useWallet();
    const [predicate, setPredicate] = useState<NftFixedPriceSwapPredicate | null>(null);

    const intialisePredicate = async () => {
        if(!wallet) return ;
       

        const configurableConstants = {
            FEE_AMOUNT: bn(config.FEE_AMOUNT),
            FEE_ASSET: { bits: config.FEE_ASSET },
            TREASURY_ADDRESS: { bits: config.TREASURY_ADDRESS },
            ASK_AMOUNT: bn(config.ASK_AMOUNT),
            ASK_ASSET: { bits: config.ASK_ASSET },
            RECEIVER: { bits: config.RECEIVER },
            NFT_ASSET_ID: {bits: config.NFT_ASSET_ID },
        };

        const newPredicate = new NftFixedPriceSwapPredicate({
            provider: wallet.provider,
            data: [],
            configurableConstants,
        });
        setPredicate(newPredicate);

    }
    return {predicate, intialisePredicate};
    
}




