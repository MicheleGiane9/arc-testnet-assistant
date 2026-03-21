import React, { useState } from 'react';
import IconWrapper from './IconWrapper';

interface WalletMonitorProps {
  connectedAddress: string | null;
}

export default function WalletMonitor({ connectedAddress }: WalletMonitorProps) {
  const [chatId, setChatId] = useState("");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  
  async function startMonitoring(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!connectedAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!chatId) {
      alert("Enter your Telegram Chat ID.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/monitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          walletAddress: connectedAddress,
          telegramChatId: chatId
        })
      });

      const data = await res.json();
      console.log(data);

      alert("Monitoring started!");
      setIsMonitoring(true);

    } catch (error) {
      console.error(error);
      alert("Error starting monitoring");
    } finally {
      setLoading(false);
    }
  }

  async function stopMonitoring() {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/stop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          walletAddress: connectedAddress
        })
      });

      if (res.ok) {
        setIsMonitoring(false);
        alert("Monitoring stopped!");
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-white">
      <div className="max-w-xl w-full space-y-6">

        <h1 className="text-3xl font-bold text-center">
          ARC Wallet Monitor
        </h1>

        {!isMonitoring ? (
          <form onSubmit={startMonitoring} className="space-y-4">

            <input
              value={connectedAddress || ""}
              readOnly
              placeholder="Wallet not connected"
              className="w-full p-3 rounded bg-slate-800"
            />

            <input
              placeholder="Enter Telegram Chat ID"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="w-full p-3 rounded bg-slate-800"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-blue-600 rounded"
            >
              {loading ? "Loading..." : "Start Monitoring"}
            </button>

          </form>
        ) : (
          <div className="space-y-4 text-center">

            <p className="text-green-400">Monitoring Active</p>

            <button
              onClick={stopMonitoring}
              className="w-full p-3 bg-red-600 rounded"
            >
              Stop Monitoring
            </button>

          </div>
        )}

      </div>
    </div>
  );
}