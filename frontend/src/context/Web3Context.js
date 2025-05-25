import React, { createContext, useState } from 'react';
import { ethers } from 'ethers';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [account, setAcount] = useState(' ');
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);


}