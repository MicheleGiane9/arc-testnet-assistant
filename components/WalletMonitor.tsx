import React, { useState, useEffect, useRef } from 'react';
import IconWrapper from './IconWrapper';

interface WalletMonitorProps {
  connectedAddress: string | null;
}

export default function WalletMonitor({ connectedAddress }: WalletMonitorProps) {
  const [chatId, setChatId] = useState("");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const currentSessionId = useRef<string | null>(null);

  const handleConnectTelegram = () => {
    setLoading(true);
    setMessage(null);
    
    // 1. Generate a unique session ID
    const sessionId = Math.random().toString(36).substring(2, 15);
    currentSessionId.current = sessionId;
    
    // 2. Open Telegram Bot with the session ID
    const botUsername = 'ArcTestnetMonitorBot';
    const telegramUrl = `https://t.me/${botUsername}?start=${sessionId}`;
    window.open(telegramUrl, '_blank');
    
    setMessage({ type: 'success', text: 'Please click "Start" in the Telegram bot to link your account.' });

    // 3. Start polling the backend for the Chat ID
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/telegram-status/${sessionId}`);
        const data = await response.json();
        
        if (data.status === 'linked') {
          setChatId(data.chatId);
          clearInterval(pollInterval);
          setLoading(false);
          setMessage({ type: 'success', text: 'Telegram connected successfully!' });
          currentSessionId.current = null;
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);

    // Stop polling after 2 minutes to avoid infinite loop
    setTimeout(() => {
      clearInterval(pollInterval);
      if (loading) setLoading(false);
    }, 120000);
  };

  // For demo/testing: Simulate the bot response
  const simulateBotResponse = async () => {
    if (!currentSessionId.current) return;
    
    try {
      await fetch('/telegram-webhook-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSessionId.current,
          chatId: Math.floor(Math.random() * 1000000000).toString()
        })
      });
    } catch (error) {
      console.error("Simulation error:", error);
    }
  };

  async function startMonitoring(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    if (!connectedAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!chatId) {
      alert("Please connect your Telegram or enter Chat ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/monitor", {
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
      const res = await fetch("/stop", { method: "POST" });
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
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-slate-950 text-white overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            ARC Wallet Monitor
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
            Get notified on Telegram for every transaction — incoming or outgoing.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
            {!isMonitoring ? (
              <form onSubmit={startMonitoring} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Wallet Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <IconWrapper name="wallet" size={18} />
                    </div>
                    <input
                      placeholder="Please connect your wallet"
                      value={connectedAddress || ""}
                      readOnly
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-400 placeholder-slate-700 cursor-not-allowed font-mono text-sm"
                    />
                  </div>
                  {!connectedAddress && (
                    <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest ml-1 animate-pulse">
                      Wallet not connected. Please connect your wallet in the header.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Telegram Chat ID</label>
                    <button 
                      type="button"
                      onClick={handleConnectTelegram}
                      disabled={loading}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      <IconWrapper name="telegram" size={12} />
                      Connect Telegram
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <IconWrapper name="send" size={18} />
                    </div>
                    <input
                      placeholder="Connect Telegram or enter ID manually"
                      value={chatId}
                      onChange={(e) => setChatId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none font-mono text-sm"
                    />
                  </div>
                  {message && (
                    <div className={`mt-4 p-4 rounded-xl text-center text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300 ${
                      message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {message.text}
                      {loading && currentSessionId.current && (
                        <button 
                          onClick={simulateBotResponse}
                          className="mt-3 block w-full py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/30"
                        >
                          [Demo Only] Simulate Bot Response
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !connectedAddress || !chatId}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <IconWrapper name="bell" size={20} />
                      Start Monitoring
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center justify-center space-y-3 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-md bg-emerald-500 animate-pulse opacity-50"></div>
                    <div className="relative w-4 h-4 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-sm">Monitoring Active</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-col space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Wallet being monitored</span>
                    <span className="text-indigo-400 font-mono break-all text-sm">{connectedAddress}</span>
                  </div>
                </div>

                <button
                  onClick={stopMonitoring}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] border border-slate-700 disabled:opacity-50"
                >
                  Stop Monitoring
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-slate-600">
          <div className="flex items-center gap-2">
            <IconWrapper name="globe" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Arc Testnet</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <IconWrapper name="telegram" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Telegram Bot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
