"use client"
import React, { useState } from 'react';
import { BN, ScriptTransactionRequest, bn, Address, Output, OutputType } from 'fuels';
import { NftFixedPriceSwapPredicate } from './NftFixedPriceSwapPredicate';
import { useWallet } from '@fuels/react';
import  createPredicateEntry  from "../databaseRoutes/predicateEntry"

const SellPage: React.FC = () => {
    const { wallet } = useWallet();
    const [predicate, setPredicate] = useState<NftFixedPriceSwapPredicate | null>(null);
    const [config, setConfig] = useState<{ [key: string]: string }>({
        FEE_AMOUNT: '',
        FEE_ASSET: '',
        TREASURY_ADDRESS: '',
        ASK_AMOUNT: '',
        ASK_ASSET: '',
        NFT_ASSET_ID: '',
    });
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({
            ...config,
            [e.target.name]: e.target.value
        })
    }

    const initializeSellerPredicate = async () => {
        if (!wallet) return;

        const missingFields = Object.entries(config)
            .filter(([key,value]) => !value.trim())
            .map(([key,value]) => key);

        if (missingFields.length>0){
            console.log("Missing Fields", missingFields);
            alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
            return;
        }

        const configurableConstants = {
            FEE_AMOUNT: bn(config.FEE_AMOUNT),
            FEE_ASSET: { bits: config.FEE_ASSET },
            TREASURY_ADDRESS: { bits: config.TREASURY_ADDRESS },
            ASK_AMOUNT: bn(config.ASK_AMOUNT),
            ASK_ASSET: { bits: config.ASK_ASSET },
            RECEIVER: { bits: wallet.address.toString() },
            NFT_ASSET_ID: { bits: config.NFT_ASSET_ID },
        };

        const newPredicate = new NftFixedPriceSwapPredicate({
            provider: wallet.provider,
            data: [],
            configurableConstants,
        });
       
        try {
            console.log("Transferring NFT to Predicate Address...");

            const transferTx = await wallet.transfer(
                newPredicate.address,
                bn(1),
                config.NFT_ASSET_ID,
                { gasLimit: 100_000 }
            );

            await transferTx.waitForResult();
            console.log("NFT successfully transferred to Predicate.");

            const entry = {
                sellerAddress: wallet.address.toString(),
                predicateAddress: newPredicate.address.toString(),
                nftAssetId: (config.NFT_ASSET_ID).toString(),
                config:config as {
                    FEE_AMOUNT: string;
                    FEE_ASSET: string;
                    TREASURY_ADDRESS: string;
                    ASK_AMOUNT: string;
                    ASK_ASSET: string;
                    NFT_ASSET_ID: string;
                }
            }

            await createPredicateEntry(entry);
            console.log("Predicate Initialized:", newPredicate);
        } catch (error) {
            console.error("Error initializing predicate:", error);
        }
    };

    return (
        <div>
            <h1>Fuel Predicate Setup</h1>
            {Object.entries(config).map(([key, value]) => (
                <div key={key}>
                    <label>{key}:</label>
                    <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleChange}
                    />
                </div>
            ))}
            <button onClick={initializeSellerPredicate}>Initialize Predicate</button>


        </div>
    );
};

export default SellPage;