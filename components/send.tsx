import React, { useState, useEffect } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  parseUnits,
  formatUnits,
  ByteArray,
} from "viem";
import { arcTestnet } from "./chain";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function SendToken() {
  const [account, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  // 🔥 conectar wallet
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install a Web3 wallet");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  }

  // 🔥 garantir rede ARC
  async function switchToArc() {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4CE6F2" }],
    });
  } catch (error: any) {
    console.log("Erro ao trocar rede:", error);
    alert("Please switch to Arc Testnet in your wallet");
  }
}

  // 🔥 pegar saldo (nativo)
  async function fetchBalance(address: string) {
    const publicClient = createPublicClient({
      chain: arcTestnet,
      transport: custom(window.ethereum),
    });

    const balance = await publicClient.getBalance({
      address: address as `0x${string}`,
    });

    return Number(formatUnits(balance, 18)); // 🔥 ajuste aqui
  }

  // 🔥 sync wallet
  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts.length) setAccount(accounts[0]);
    });

    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      setAccount(accounts[0] || null);
    });
  }, []);

  // 🔥 atualizar saldo
// auto refresh a cada 10s
useEffect(() => {
  if (!account) return;

  const interval = setInterval(() => {
    fetchBalance(account).then(setBalance);
  }, 10000);

  return () => clearInterval(interval);
}, [account]);
  // 🚀 enviar
  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!account) {
      alert("Connect wallet");
      return;
    }

    if (!recipient) {
      alert("Enter recipient address");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Invalid amount");
      return;
    }

    // ✅ valida saldo
    if (Number(amount) > balance) {
      alert("Insufficient balance");
      return;
    }

    try {
      setLoading(true);
      setTxHash(null);

      await switchToArc();

      const walletClient = createWalletClient({
        chain: arcTestnet,
        transport: custom(window.ethereum),
      });

      const publicClient = createPublicClient({
        chain: arcTestnet,
        transport: custom(window.ethereum),
      });

      const hash = await walletClient.sendTransaction({
        account: account as `0x${string}`,
        to: recipient as `0x${string}`,
        value: parseUnits(amount, 18),
        kzg: {
          blobToKzgCommitment: function (blob: ByteArray): ByteArray {
            throw new Error("Function not implemented.");
          },
          computeBlobKzgProof: function (blob: ByteArray, commitment: ByteArray): ByteArray {
            throw new Error("Function not implemented.");
          }
        },
        chain: undefined
      });

      // 🔥 feedback instantâneo
      setTxHash(hash);

      // 🔄 atualiza saldo depois
      publicClient.waitForTransactionReceipt({ hash }).then(() => {
        fetchBalance(account).then(setBalance);
      });

    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen overflow-y-auto bg-slate-950 text-white flex flex-col items-center p-6">

      <div className="w-full max-w-2xl space-y-8">

        <h1 className="text-4xl font-black text-center">
          Send USDC
        </h1>

        {/* BALANCE */}
        <div className="text-right text-sm text-slate-400">
          Balance: {balance.toFixed(4)} USDC
        </div>

        {!account && (
          <button
            onClick={connectWallet}
            className="w-full py-4 bg-yellow-500 rounded-xl font-bold text-lg"
          >
            Connect Wallet
          </button>
        )}

        {/* SELECT AMOUNT */}
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">Select amount</p>

          <div className="grid grid-cols-3 gap-4">
            {["1", "5", "10"].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`py-5 rounded-2xl text-lg font-bold transition ${
                  amount === val
                    ? "bg-blue-600 scale-105"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                {val} USDC
              </button>
            ))}
          </div>

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Custom amount"
            className="w-full p-4 bg-slate-800 rounded-xl text-white text-lg"
          />
        </div>

        {/* RECIPIENT */}
        <div className="space-y-2">
          <p className="text-slate-400 text-sm">Recipient Address</p>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full p-4 bg-slate-800 rounded-xl text-white"
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
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-xl"
        >
          {loading ? "Confirm in wallet..." : "Send"}
        </button>

        {/* SUCCESS */}
        {txHash && (
          <div className="mt-6 flex flex-col items-center justify-center animate-fadeIn">
            <div className="text-6xl mb-4 animate-bounce">🚀</div>

            <p className="text-green-400 text-2xl font-bold">
              Token Sent Successfully
            </p>

            <a
              href={`https://testnet.arcscan.app/tx/${txHash}`}
              target="_blank"
              className="mt-3 text-indigo-400 underline"
            >
              View on Explorer
            </a>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in;
        }
      `}</style>

    </div>
  );
}