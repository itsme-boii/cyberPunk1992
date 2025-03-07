"use client"
import React, { useState } from 'react';
import { BN, ScriptTransactionRequest, bn, Address, Output, OutputType } from 'fuels';
import { NftFixedPriceSwapPredicate } from './NftFixedPriceSwapPredicate';
import { useWallet } from '@fuels/react';
import getPredicate from "../databaseRoutes/getPredicate"
import { ConfigType, PredicateAddressType, PredicateEntryType } from '@/types/PredicateEntry';
import { predicateEntry } from '@prisma/client';


const BuyPage: React.FC = () => {
    const { wallet } = useWallet();
    const [selectedPredicateId, setSelectedPredicateId] = useState<string | null>(null);

    const handleNFTClick = (predicateId: string) => {
        setSelectedPredicateId(predicateId);
    }

    const BuyerTransaction = async () => {
        if (!wallet) return;
        console.log("inside this")
        if (!selectedPredicateId) {
            alert("No NFT selected!");
            return;
        }
        const input = {
            predicateAddress: selectedPredicateId
        }

        const data = await getPredicate(input);

        if (!data || !data.config) {
            alert("No Valid Predicate Found");
            return;
        }

        console.log("data is", data)

        const fetchedData: ConfigType = data.config as unknown as ConfigType;
        const sellerAddress = data.sellerId as string;
        console.log("FetchedData is ", fetchedData);

        const configurableConstants = {
            FEE_AMOUNT: bn(fetchedData.FEE_AMOUNT),
            FEE_ASSET: { bits: fetchedData.FEE_ASSET },
            TREASURY_ADDRESS: { bits: fetchedData.TREASURY_ADDRESS },
            ASK_AMOUNT: bn(fetchedData.ASK_AMOUNT),
            ASK_ASSET: { bits: fetchedData.ASK_ASSET },
            RECEIVER: { bits: sellerAddress },
            NFT_ASSET_ID: { bits: fetchedData.NFT_ASSET_ID },
        };
        
        console.log("Configurable Constants:", configurableConstants);


        const existingPredicate = new NftFixedPriceSwapPredicate({
            provider: wallet.provider,
            data: [],
            configurableConstants,
        });

        try {
            console.log("Transferring NFT to Buyer");
            console.log("Configurable Constants:", configurableConstants);


            //INPUTS
            let predicateInputs = await existingPredicate.getResourcesToSpend([
                { amount: bn(1), assetId: fetchedData.NFT_ASSET_ID },
            ]);
            console.log("1")

            let takerInputs = await wallet.getResourcesToSpend([
                { amount: bn(fetchedData.ASK_AMOUNT), assetId: fetchedData.ASK_ASSET },
            ]);
            console.log("2")

            const inputPredicate = predicateInputs[0];
            const inputFromTaker = takerInputs[0];

            //OUTPUTS
            const outputToReceiver: Output = {
                type: OutputType.Coin,
                to: sellerAddress,
                amount: bn(fetchedData.ASK_AMOUNT),
                assetId: fetchedData.ASK_ASSET,
            };

            const outputToTreasury: Output = {
                type: OutputType.Coin,
                to: fetchedData.TREASURY_ADDRESS,
                amount: bn(fetchedData.FEE_AMOUNT),
                assetId: fetchedData.ASK_ASSET,
            };

            const outputToTaker: Output = {
                type: OutputType.Coin,
                to: sellerAddress,
                amount: bn(1),
                assetId: fetchedData.NFT_ASSET_ID,
            };

            const transactionRequest = new ScriptTransactionRequest({
                gasLimit: bn(500_000),
                maxFee: bn(100_000),
            });

            transactionRequest.addResources([inputPredicate, inputFromTaker]);
            transactionRequest.outputs.push(outputToReceiver, outputToTreasury, outputToTaker);

            try {
                await transactionRequest.estimateAndFund(existingPredicate);
                console.log("Transaction estimated and funded successfully.");
            } catch (e) {
                console.error("Transaction estimation failed:", e);
            }
            // console.log("Transaction Outputs:", transactionRequest.outputs);
            // console.log("Transaction Inputs:", transactionRequest.inputs);


            const Tx = await wallet.sendTransaction(transactionRequest);
            
            console.log("Predicate Simulation Result:", Tx);
        } catch (error) {
            console.error("Error initializing predicate:", error);
        }
    };

    return (
        <div>
            <h1>Buy NFT via Predicate</h1>

            {/* Dummy NFT List - Replace with real data */}
            <div>
                <h2>Select an NFT:</h2>
                <button onClick={() => handleNFTClick("0xF8E97949ECE391B18019734169A3459973B11274a3DC5071f3A3fcD328b193Eb")}>NFT 1</button>
                <button onClick={() => handleNFTClick("0xF8E97949ECE391B18019734169A3459973B11274a3DC5071f3A3fcD328b193Esb")}>NFT 2</button>
            </div>

            <p>Selected Predicate ID: {selectedPredicateId || "None"}</p>

            <button onClick={BuyerTransaction} disabled={!selectedPredicateId}>
                Buy NFT
            </button>
        </div>
    );
};

export default BuyPage;