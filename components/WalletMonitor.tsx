import React, { useState, useRef } from 'react';
import IconWrapper from './IconWrapper';

// 🔥 SUA URL DO RAILWAY
const API_URL = "https://arc-testnet-assistant-production.up.railway.app";

interface WalletMonitorProps {
  connectedAddress: string | null;
}

export default function WalletMonitor({ connectedAddress }: WalletMonitorProps) {
  const [chatId, setChatId] = useState("");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
const currentSessionId = useRef<string | null>(null);

  const handleConnectTelegram = () => {
    const sessionId = Math.random().toString(36).substring(2, 15);
    currentSessionId.current = sessionId;

    const botUsername = 'ArcTestnetMonitorBot';
    window.open(`https://t.me/${botUsername}?start=${sessionId}`, '_blank');};

  async function startMonitoring(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!connectedAddress) {
      alert("Connect wallet first");
      return;
    }

    if (!chatId) {
      alert("Connect Telegram first");
      return;
    }

    setLoading(true);

    try {
      await fetch(`${API_URL}/monitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          walletAddress: connectedAddress,
          telegramChatId: chatId
        })
      });

  setIsMonitoring(true);
    } catch (error) {
      console.error(error);
      alert("Erro ao iniciar");
    } finally {
      setLoading(false);
    }
  }

  async function stopMonitoring() {
    setLoading(true);

    try {
      await fetch(`${API_URL}/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          walletAddress: connectedAddress
        })
      });

      setIsMonitoring(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-slate-950 text-white">
      <div className="max-w-2xl w-full space-y-8">

        {/* TITLE */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            ARC Wallet Monitor
          </h1>
          <p className="text-slate-400">
            Get notified on Telegram for every transaction
          </p>
        </div>

        {/* CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

          {!isMonitoring ? (
            <form onSubmit={startMonitoring} className="space-y-6">

              {/* WALLET */}
              <div>
                <label className="text-xs text-slate-500">Wallet</label>
                <input
                  value={connectedAddress || ""}
                  readOnly
                  className="w-full mt-2 p-4 bg-slate-800 rounded-xl text-slate-400"
                />
              </div>

              {/* TELEGRAM */}
              <div>
                <label className="text-xs text-slate-500">Telegram Chat ID</label>

                <input
                  placeholder="Enter Chat ID"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  className="w-full mt-2 p-4 bg-slate-800 rounded-xl text-white"
                />

                <button
                  type="button"
                  onClick={handleConnectTelegram}
                  className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  Connect Telegram
                </button>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold"
              >
                {loading ? "Loading..." : "Start Monitoring"}
              </button>

            </form>
          ) : (
            <div className="space-y-6 text-center">

              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 font-bold">Monitoring Active 🚀</p>
              </div>

              <button
                onClick={stopMonitoring}
                className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700"
              >
                Stop Monitoring
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}