export interface PredicateEntryType {
    sellerAddress: string,
    predicateAddress: string,
    nftAssetId: string,
    config: 
    {
        FEE_AMOUNT: string,
        FEE_ASSET: string,
        TREASURY_ADDRESS: string,
        ASK_AMOUNT: string,
        ASK_ASSET: string,
        NFT_ASSET_ID: string,

    }
}

export interface PredicateAddressType {
    predicateAddress:string
}

export interface ConfigType {
    FEE_AMOUNT: string;
    FEE_ASSET: string;
    TREASURY_ADDRESS: string;
    ASK_AMOUNT: string;
    ASK_ASSET: string;
    NFT_ASSET_ID: string;
}
