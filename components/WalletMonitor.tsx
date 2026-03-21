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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const currentSessionId = useRef<string | null>(null);

  const handleConnectTelegram = () => {  const sessionId = Math.random().toString(36).substring(2, 15);
    currentSessionId.current = sessionId;

    const botUsername = 'ArcTestnetMonitorBot';
    window.open(`https://t.me/${botUsername}?start=${sessionId}`, '_blank');

    setMessage({ type: 'success', text: 'Click "Start" no bot do Telegram.' });
  };

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
      const res = await fetch(`${API_URL}/monitor`, { // ✅ CORRIGIDO
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

      alert("Monitoring started 🚀");
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
      const res = await fetch(`${API_URL}/stop`, { // ✅ CORRIGIDO
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          walletAddress: connectedAddress // 🔥 IMPORTANTE
        })
      });

      if (res.ok) {
        setIsMonitoring(false);
        alert("Monitoring stopped");
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {!isMonitoring ? (
        <form onSubmit={startMonitoring}>
          <input value={connectedAddress || ""} readOnly />
          <input
            placeholder="Telegram Chat ID"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
          />

          <button type="button" onClick={handleConnectTelegram}>
            Connect Telegram
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Start Monitoring"}
          </button>
        </form>
      ) : (
        <div>
          <p>Monitoring ativo 🚀</p>
          <button onClick={stopMonitoring}>Stop</button>
        </div>
      )}
    </div>
  );
}