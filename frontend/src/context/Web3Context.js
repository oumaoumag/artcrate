import React, { createContext, useState } from 'react';
import { ethers } from 'ethers';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [account, setAcount] = useState(' ');
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);

    const connectWallet = async() => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();
            const address = await getAddress();
            setProvider(provider);
            setAcount(account);

            const contract = new ethers.Contract(
                'contract_address',
                [
                    'function mint(string memory tokenU'
                ]
            )
        }
    }

}