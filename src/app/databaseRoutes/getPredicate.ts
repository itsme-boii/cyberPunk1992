"use server"

import { prisma } from "@/lib/prisma";
import { PredicateEntryType } from "@/types/PredicateEntry";


export default async function getPredicate(input: PredicateEntryType){
  try {
    console.log("input is ",input)
    const newEntry = await prisma.predicateEntry.create({
      data: {
        sellerId:input.sellerAddress,
        predicateId:input.predicateAddress,
        nftId:input.nftAssetId,
        config:input.config
      },

    });

    console.log(newEntry);
    return newEntry
    
  } catch (error) {
    console.log("Error is ",error)
  }
}



