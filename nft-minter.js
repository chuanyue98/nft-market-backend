import {ethers,JsonRpcProvider} from "ethers";
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config("./.env");

export async function mint(to,uri){
    const provider = new JsonRpcProvider(process.env.RPC_URL);
    const signer = await provider.getSigner();
    const abi = JSON.parse(fs.readFileSync('./abis/MyNFT.json').toString());
    const contract = new ethers.Contract(process.env.NFT, abi, signer);
    const result = await contract.saftMint(to,uri);
    console.log(result.hash);
 
}
