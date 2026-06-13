import React, { useState, useEffect } from "react";

import {
  createPublicClient,
  http,
  parseUnits,
  formatUnits,
  encodeFunctionData,
} from "viem";

import { arcTestnet } from "./chain";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// =========================
// USDC CONTRACT
// =========================
const USDC_CONTRACT =
  "0x3910B7cbb3341f1F4bF4cEB66e4A2C8f204FE2b8";

// =========================
// FIXED GAS
// =========================
const FIXED_GAS = 100000n;

const FIXED_GAS_PRICE = 1000000000n;

// =========================
// ERC20 ABI
// =========================
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "bool",
      },
    ],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
];

export default function SendToken() {

  const [account, setAccount] =
    useState<string | null>(null);

  const [amount, setAmount] =
    useState("");

  const [recipient, setRecipient] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [txHash, setTxHash] =
    useState<string | null>(null);

  const [balance, setBalance] =
    useState(0);

  // =========================
  // CONNECT WALLET
  // =========================
  async function connectWallet() {

    if (!window.ethereum) {
      alert("Install MetaMask / OKX / Rabby");
      return;
    }

    try {

      const accounts =
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });

      setAccount(accounts[0]);

    } catch (err) {

      console.log(err);
    }
  }

  // =========================
  // FETCH USDC BALANCE
  // =========================
  async function fetchBalance(address: string) {

    try {

      const publicClient =
        createPublicClient({
          chain: arcTestnet,

          transport: http(
            "https://rpc.testnet.arc.network"
          ),
        });

      const balance =
        await publicClient.readContract({
          address: USDC_CONTRACT as `0x${string}`,

          abi: ERC20_ABI,

          functionName: "balanceOf",

          args: [
            address as `0x${string}`,
          ],
          authorizationList: undefined
        });

      return Number(
        formatUnits(
          balance as bigint,
          6
        )
      );

    } catch (err) {

      console.log(err);

      return 0;
    }
  }

  // =========================
  // WALLET SYNC
  // =========================
  useEffect(() => {

    if (!window.ethereum) return;

    window.ethereum
      .request({
        method: "eth_accounts",
      })
      .then((accounts: string[]) => {

        if (accounts.length) {
          setAccount(accounts[0]);
        }
      });

    // ACCOUNT CHANGED
    window.ethereum.on(
      "accountsChanged",
      (accounts: string[]) => {
        setAccount(accounts[0] || null);
      }
    );

  }, []);

  // =========================
  // AUTO REFRESH BALANCE
  // =========================
  useEffect(() => {

    if (!account) return;

    fetchBalance(account)
      .then(setBalance);

    const interval = setInterval(() => {

      fetchBalance(account)
        .then(setBalance);

    }, 10000);

    return () => clearInterval(interval);

  }, [account]);

  // =========================
  // SEND USDC
  // =========================
  async function handleSend(
    e?: React.FormEvent
  ) {

    if (e) e.preventDefault();

    if (!window.ethereum) {
      alert("Install wallet");
      return;
    }

    if (!account) {
      alert("Connect wallet");
      return;
    }

    if (!recipient) {
      alert("Enter recipient address");
      return;
    }

    if (!amount ||
      Number(amount) <= 0) {
      alert("Invalid amount");
      return;
    }

    if (Number(amount) > balance) {
      alert("Insufficient balance");
      return;
    }

    try {

      setLoading(true);

      setTxHash(null);

      // =========================
      // SWITCH TO ARC TESTNET
      // =========================
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4CEF52" }],
        });
      } catch (switchErr: any) {
        if (switchErr.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x4CEF52",
                chainName: "Arc Testnet",
                nativeCurrency: {
                  name: "USDC",
                  symbol: "USDC",
                  decimals: 18,
                },
                rpcUrls: [
                  "https://rpc.testnet.arc.network",
                ],
                blockExplorerUrls: [
                  "https://testnet.arcscan.app",
                ],
              },
            ],
          });
        } else {
          throw switchErr;
        }
      }

      // =========================
      // ENCODE TRANSFER
      // =========================
      const data =
        encodeFunctionData({
          abi: ERC20_ABI,

          functionName: "transfer",

          args: [
            recipient as `0x${string}`,

            parseUnits(amount, 6),
          ],
        });

      // =========================
      // ESTIMATE GAS
      // =========================
      let gasHex: string;
      try {
        const estimated = await window.ethereum.request({
          method: "eth_estimateGas",
          params: [
            {
              from: account,
              to: USDC_CONTRACT,
              data,
              value: "0x0",
            },
          ],
        });
        const estimated_n = BigInt(estimated);
        gasHex = "0x" + ((estimated_n * 130n) / 100n).toString(16);
      } catch {
        gasHex = "0x" + FIXED_GAS.toString(16);
      }

      // =========================
      // SEND TX
      // =========================
      const hash =
        await window.ethereum.request({
          method: "eth_sendTransaction",

          params: [
            {
              from: account,
              to: USDC_CONTRACT,
              data,
              value: "0x0",
              gas: gasHex,
            },
          ],
        });

      console.log("TX HASH:", hash);

      setTxHash(hash);

      // =========================
      // WAIT RECEIPT
      // =========================
      const publicClient =
        createPublicClient({
          chain: arcTestnet,

          transport: http(
            "https://rpc.testnet.arc.network"
          ),
        });

      await publicClient
        .waitForTransactionReceipt({
          hash,
        });

      // =========================
      // UPDATE BALANCE
      // =========================
      const updatedBalance =
        await fetchBalance(account);

      setBalance(updatedBalance);

    } catch (err) {

      console.error(err);

      alert("Transaction failed");

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-6">

      <div className="w-full max-w-2xl space-y-8">

        {/* TITLE */}
        <h1 className="text-4xl font-black text-center">
          Send USDC
        </h1>

        {/* BALANCE */}
        <div className="text-right text-sm text-slate-400">
          Balance: {balance.toFixed(4)} USDC
        </div>

        {/* CONNECT */}
        {!account && (
          <button
            onClick={connectWallet}
            className="w-full py-4 bg-yellow-500 rounded-xl font-bold text-black"
          >
            Connect Wallet
          </button>
        )}

        {/* AMOUNT */}
        <div className="space-y-4">

          <input
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            placeholder="Amount"
            className="w-full p-4 bg-slate-800 rounded-xl outline-none"
          />

          <input
            value={recipient}
            onChange={(e) =>
              setRecipient(e.target.value)
            }
            placeholder="Recipient Address"
            className="w-full p-4 bg-slate-800 rounded-xl outline-none"
          />

        </div>

        {/* FROM */}
        <div className="text-xs text-slate-500 break-all">
          From: {account || "Not connected"}
        </div>

        {/* SEND */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-xl disabled:opacity-50"
        >
          {loading
            ? "Confirm in wallet..."
            : "Send USDC"}
        </button>

        {/* SUCCESS */}
        {txHash && (
          <div className="mt-6 flex flex-col items-center">

            <div className="text-6xl mb-4">
              🚀
            </div>

            <p className="text-green-400 text-2xl font-bold">
              USDC Sent Successfully
            </p>

            <a
              href={`https://testnet.arcscan.app/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-indigo-400 underline"
            >
              View on Explorer
            </a>

          </div>
        )}

      </div>
    </div>
  );
}