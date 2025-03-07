"use server"

import { prisma } from "@/lib/prisma";
import { PredicateAddressType } from "@/types/PredicateEntry";


export default async function getPredicate(input: PredicateAddressType ){
  try {
    console.log("input is ",input)
    const data = await prisma.predicateEntry.findUnique({
      where:{predicateId: input.predicateAddress}

    });

    console.log(data);
    return data
    
  } catch (error) {
    console.log("Error is ",error)
  }
}



