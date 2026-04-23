
// Fix: Import React to resolve namespace errors for React.FC and other namespaced types
import React, { useState, useRef, useEffect } from 'react';
import { Message, Tutorial } from './types';
import { TUTORIALS } from './constants';
import { generateAssistantResponse } from './services/gemini';
import IconWrapper from './components/IconWrapper';
import WalletMonitor from './components/WalletMonitor';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ARC_LOGO_URL = "https://lh3.googleusercontent.com/d/1QI9bopnO2RatqOMuExfqmdSJCDygP09r";
const DOCS_URL = "https://docs.arc.network/arc/";
const EXPLORER_URL = "https://testnet.arcscan.app";
// Link de visualização direta otimizado para preview
const WELCOME_VIDEO_URL = "https://drive.google.com/file/d/1qJUvu-WEHP7rDp0MeKPLsegdiIT9HAlI/preview";

const SWAP_DETAILS = {
  curve: `1. Curve (ARC)
Link: https://www.curve.finance/dex/arc/swap

1. Access and Select Currency
After entering the platform, locate and click on Swap. Choose the currency you want to swap.
![Select Currency](https://lh3.googleusercontent.com/d/1xlDUgr_W_JbL-P7rrRDOlHLW4WXwwjkA)

2. Enter the amount
Type the desired amount and then click Swap.
![Enter Amount](https://lh3.googleusercontent.com/d/1PFRE1LWG2Nwf7WgGMPMICBlYcv7nm39o)

3. Confirm in your wallet
Confirm the transaction directly in your digital wallet.

Final Notes: The message Swap Complete will appear, indicating the operation was successful.`,
  
  defi: `2. DeFi on ARC
Visit: https://defi-on-arc.vercel.app/swap

1. Access and Select Currency
Locate and click on Swap. Choose the currency you want to swap.
![Select Currency](https://lh3.googleusercontent.com/d/1X6frvKlsH_Lto7wcRqVWtQa6Kxsq7OW2)

2. Enter the amount
Type the amount and click Swap USDC for EURC. Minimum swap amount is $5 USD.
![Enter Amount](https://lh3.googleusercontent.com/d/1mR94cR3RCbK_s84LUfOold0-VJnj9Ttx)

3. Confirm Swap
Review the transaction and confirm.
![Confirm Swap](https://lh3.googleusercontent.com/d/1qPKJkogD7KdWhSI3P3LK_qPJY4kyHKqM)

4. Finalize in Wallet
Confirm the transaction in your wallet. The message Transaction completed! will appear.
![Success](https://lh3.googleusercontent.com/d/1_FobJUJ9vVirWBBG2njB7NK7SCrxs01U)

Final Notes: Ensure your wallet is connected to the correct ARC Testnet network.`,

  axpha: `3. Axpha Testnet
Visit: https://testnet.axpha.io/#/swap

1. Access and Select Currency
Click on Swap. Choose the currency you want to swap.
![Select Currency](https://lh3.googleusercontent.com/d/1u0AkDmfA_CvchyUUoz4P2jvPH_Szfh3V)

2. Enter the amount
Type the desired amount and then click Swap.
![Enter Amount](https://lh3.googleusercontent.com/d/1z8RMcsQZJfmjOuMIMcbbP3AqHh8_ldQV)

3. Confirm in your wallet
Confirm the transaction in your wallet.
![Success](https://lh3.googleusercontent.com/d/1jKFIxtDX9PapVwrrZKZbqZy9nhP5uvxc)

Final Notes: A confirmation message successfully will be displayed.`,

  swaparc: `4. SwapARC
Visit: https://www.swaparc.app/

1. Access and Select Currency
Click on Swap. Choose the currency you want to swap.
![Select Currency](https://lh3.googleusercontent.com/d/1t07Qu4CWttlBBMe3aoOpKW6w43ha1R1c)

2. Enter the amount
Type the desired amount and then click Swap.
![Enter Amount](https://lh3.googleusercontent.com/d/1AODNXZysPAXIV-S5efUuY9V3MkNQ5Lxm)

3. Confirm in your wallet
Confirm the transaction in your wallet.
![Success](https://lh3.googleusercontent.com/d/1OjO38Ea9c2xNfm1oolIsrJR_KXgEgzBz)

Final Notes: After confirmation, the message Transaction completed will be displayed.`
};

const ONCHAIN_DETAILS = {
  onchaingm: `a) ONCHAINGM
It is a multi-chain platform that allows for simple and fast daily interactions across different blockchain networks.
Access the ONCHAINGM website:
https://onchaingm.com/
Click on Connect Wallet in Arc Testnet
Locate the Arc Testnet card.
![Arc Testnet Card](https://lh3.googleusercontent.com/d/14eKRVJ-pEKem7MCyV9li0iGm3Hc-R052)

- GM 

Click on GM in Arc Testnet
Your wallet will open automatically
Click on Confirm / Approve transaction
The image will remain like this until the transaction is approved in your wallet.
![Pending Transaction](https://lh3.googleusercontent.com/d/18jV_jXPgrgYYm1YbXPPUEc4LtlDCOqJb)
If everything goes correctly, the message will appear:
🎉 GM Successful
![Success Message](https://lh3.googleusercontent.com/d/1zrmeIZMXDFgfReeuIVvYv5HqMV96lgYF)


-Deploy
On the same screen, click deploy.
![Deploy Step 1](https://lh3.googleusercontent.com/d/1fz6IuF9wR76XO8U_1CCBMZq7d6N_bajk)
Deploy again and confirm the interaction with your wallet.
![Deploy Step 2](https://lh3.googleusercontent.com/d/1Xj5E5abNZMqIn7PzKjsi5ef6KoWJZAfL)
If everything went well, the following message will be displayed.
Contract Deployed on Arc Testnet!
Your contract deployment is confirmed!
![Deploy Success](https://lh3.googleusercontent.com/d/15GbqGB7TjCuDIn1F6FWEFNdggotNVR-e)`,

  watchoor: `b)Watchoor
Watchoor is a Web3 platform focused on digital identity and on-chain activity.
It allows users to interact with the blockchain through actions.

Access the link https://watchoor.xyz/
Search for the ARC network. 
![ARC Network](https://lh3.googleusercontent.com/d/1WHj-EvVR_CZR77LbtohFCyX7SLR1GbnN)

Click on "All". Note that there are 5 workflow progress actions.

0/5 Completed
Say GM
Say GN
Deploy NFT Collection
Deploy ERC20 Token
Deploy Accountant Contract, completing and confirming the interaction 5 times.

![Workflow Progress](https://lh3.googleusercontent.com/d/15ugwknVTKdPg-sLYezso4odJC6VnBUYy)

As you confirm the interactions, the order in which they were successfully completed will be highlighted in green.

![Completed Actions](https://lh3.googleusercontent.com/d/15kn1QIfUcbL42l7mZ2EOH_PzIHSdOtWw)

After completing all interactions, the message "Workflow complete" appears.

![Workflow Complete](https://lh3.googleusercontent.com/d/1nMuVLNAi5Cf1WGodeiRIeIM-J1OsRL3o)`,

  zkcodex: `c)Zkcodex.
Is a Web3 platform that allows you to track, analyze, and interact with multiple blockchains in one place.

Access the website https://zkcodex.com/onchain/gm

Connect to the arc network and search for the arc network.

![Search ARC](https://lh3.googleusercontent.com/d/19kv2bfUjfqvVAgn_Eda3gXVwn5w9Bj1y)

Click on GM and confirm the interaction in your wallet.

![Click GM](https://lh3.googleusercontent.com/d/1KmPNx0EnALXTwgEILxyFahM51zPkESXR)

After confirmation, you will be shown that you have until 23:59 to complete this task again.
![Task Completed](https://lh3.googleusercontent.com/d/1B0TeHn6qMEFeSNA5b1ZQSGvjHtYlrqBR)`,

  onchaindaily: `d)Onchaindaily 

It is a Web3 platform that allows you to generate on-chain activity in a simple way, with just one click.

Access the link https://www.onchaindaily.io/arc

On the ARC network, you can find these interactions;

![Interactions](https://lh3.googleusercontent.com/d/1Un_ifrw-7t1nwJekMcHMGayEJ3eM2iP_)


When you click deploy and confirm the interaction in your wallet, it will turn green because it was successfully deployed.
![Deploy Green](https://lh3.googleusercontent.com/d/1339trjdngXXky44aJUkWINO0Ql9TIZaB)

Follow the same step, clicking on mint,gm,deploy,gn

Confirming the interactions one by one, in the end they all turned green.
![All Green](https://lh3.googleusercontent.com/d/1qI05TwluRKOCRA0qKYFyivFwOVJX_aqu)`
};

const MAX_GENERAL_QUESTIONS = 5;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am ARC IA, your ARC Testnet Assistant (Beta). How can I help you today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generalQuestionsCount, setGeneralQuestionsCount] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; alt: string } | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [activeTab, setActiveTab] = useState<'assistant' | 'monitor'>('assistant');
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setZoomedImage(null);
        setShowWelcomeModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setConnectedAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask or another EVM wallet.");
    }
  };

  const disconnectWallet = () => {
    setConnectedAddress(null);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts[0]) {
            setConnectedAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts && accounts[0]) {
          setConnectedAddress(accounts[0]);
        } else {
          setConnectedAddress(null);
        }
      });
    }
  }, []);

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I am ARC IA, your ARC Testnet Assistant (Beta). How can I help you today?",
        timestamp: Date.now()
      }
    ]);
    setGeneralQuestionsCount(0);
  };

  const findTutorialByKeyword = (text: string): Tutorial | { content: string } | undefined => {
    const lowerText = text.toLowerCase().trim();
    
    if (lowerText === '1' || lowerText.includes('curve')) return { content: SWAP_DETAILS.curve };
    if (lowerText === '2' || lowerText.includes('defi')) return { content: SWAP_DETAILS.defi };
    if (lowerText === '3' || lowerText.includes('axpha')) return { content: SWAP_DETAILS.axpha };
    if (lowerText === '4' || lowerText.includes('swaparc')) return { content: SWAP_DETAILS.swaparc };

    if (lowerText === 'a' || lowerText.includes('onchaingm')) return { content: ONCHAIN_DETAILS.onchaingm };
    if (lowerText === 'b' || lowerText.includes('watchoor')) return { content: ONCHAIN_DETAILS.watchoor };
    if (lowerText === 'c' || lowerText.includes('zkcodex')) return { content: ONCHAIN_DETAILS.zkcodex };
    if (lowerText === 'd' || lowerText.includes('onchaindaily')) return { content: ONCHAIN_DETAILS.onchaindaily };

    if (lowerText.includes('faucet')) return TUTORIALS.find(t => t.id === 'faucet');
    if (lowerText.includes('wallet') || lowerText.includes('metamask')) return TUTORIALS.find(t => t.id === 'wallet');
    if (lowerText.includes('domain')) return TUTORIALS.find(t => t.id === 'domain');
    if (lowerText.includes('create nft') || lowerText.includes('omnihub')) return TUTORIALS.find(t => t.id === 'create-nft');
    if (lowerText.includes('nft') || lowerText.includes('mint')) return TUTORIALS.find(t => t.id === 'nft');
    if (lowerText.includes('swap')) return TUTORIALS.find(t => t.id === 'swap');
    if (lowerText.includes('gm') || lowerText.includes('gn') || lowerText.includes('onchaingm') || lowerText.includes('deploy')) return TUTORIALS.find(t => t.id === 'onchaingm');
    
    if (
      lowerText.includes('social') || 
      lowerText.includes('network') || 
      lowerText.includes('twitter') || 
      lowerText.includes('discord') ||
      lowerText.includes('x.com') ||
      lowerText.includes('community') ||
      lowerText.includes('website') ||
      lowerText.includes('site') ||
      lowerText.includes('link') ||
      lowerText.includes('redes') ||
      lowerText.includes('rede')
    ) return TUTORIALS.find(t => t.id === 'socials');
    
    return undefined;
  };

  const handleSend = async (text: string = input, skipAIContent?: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (skipAIContent) {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: skipAIContent,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
      return;
    }

    const matchedTutorial = findTutorialByKeyword(text);
    if (matchedTutorial && (matchedTutorial as any).content) {
      setIsTyping(true);
      setTimeout(() => {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: (matchedTutorial as any).content || '',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsTyping(false);
      }, 400); 
      return;
    }

    if (generalQuestionsCount >= MAX_GENERAL_QUESTIONS) {
      setIsTyping(true);
      setTimeout(() => {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm sorry, you've reached the limit of 5 general questions for this session. Please use the menu on the left to access our official ARC Testnet tutorials.",
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsTyping(false);
      }, 500);
      return;
    }

    setIsTyping(true);
    const responseText = await generateAssistantResponse(text);
    setGeneralQuestionsCount(prev => prev + 1);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors font-bold break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const renderMessageContent = (content: string) => {
    // Split by images first
    const parts = content.split(/(!\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      const imageMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
      if (imageMatch) {
        const altText = imageMatch[1];
        const imageUrl = imageMatch[2];
        return (
          <div key={`img-${index}`} className="my-6">
            <button 
              onClick={() => setZoomedImage({ url: imageUrl, alt: altText })}
              className="group relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900/50 p-2 block w-full transition-transform active:scale-[0.98]"
            >
              <div className="relative rounded-lg overflow-hidden bg-white flex items-center justify-center">
                <img 
                  src={imageUrl} 
                  alt={altText} 
                  className="w-full h-auto object-contain max-h-[300px] transition-transform duration-500 group-hover:scale-105" 
                  referrerPolicy="no-referrer" 
                  crossOrigin="anonymous" 
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                  <div className="bg-indigo-600 p-3 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <IconWrapper name="zoom" size={24} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center group-hover:text-indigo-400 transition-colors">
                Click to expand
              </div>
            </button>
          </div>
        );
      }

      // Handle code blocks
      const codeBlockParts = part.split(/(```[\s\S]*?```)/g);
      return codeBlockParts.map((codePart, codeIndex) => {
        const codeMatch = codePart.match(/```(?:(\w+)\n)?([\s\S]*?)```/);
        if (codeMatch) {
          const language = codeMatch[1] || 'text';
          const code = codeMatch[2].trim();
          return (
            <div key={`code-${codeIndex}`} className="my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{language}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="text-slate-500 hover:text-white transition-colors"
                  title="Copy code"
                >
                  <IconWrapper name="external" size={14} />
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[13px] font-mono text-indigo-300 leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        return codePart.split('\n').map((line, i) => {
          if (!line.trim()) return <div key={`${index}-${codeIndex}-${i}`} className="h-2" />;
          
          const cleanLine = line.replace(/\*\*\*/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
          const isHeader = line.startsWith('#') || (line.toUpperCase() === line.trim() && line.length > 3 && line.length < 50 && !line.includes('HTTP'));
          
          return (
            <div key={`${index}-${codeIndex}-${i}`} className={isHeader ? 'font-bold text-base mt-6 mb-3 text-white border-l-4 border-indigo-500 pl-4 bg-indigo-500/10 py-2 rounded-r-xl uppercase tracking-tight' : 'mb-3 text-slate-200 text-[14px] leading-relaxed font-medium'}>
              {renderTextWithLinks(cleanLine.replace(/^#+\s*/, ''))}
            </div>
          );
        });
      });
    });
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-sans relative">
      <aside className="hidden md:flex flex-col w-72 bg-slate-900/60 backdrop-blur-2xl border-r border-slate-800/60 p-5">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl shadow-lg flex items-center justify-center p-1.5">
            <img src={ARC_LOGO_URL} alt="ARC" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-tight uppercase font-mono">ARC IA</h1>
            <p className="text-[10px] text-indigo-400 tracking-[0.1em] uppercase font-black">Assistant Beta</p>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto pr-2">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('assistant')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left border active:scale-95 ${
                activeTab === 'assistant' 
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)]' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                activeTab === 'assistant' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400'
              }`}>
                <IconWrapper name="bot" size={16} />
              </div>
              <h3 className="text-[12px] font-black uppercase tracking-tight">AI Assistant</h3>
            </button>

           <button
              onClick={() => setActiveTab('monitor')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left border active:scale-95 ${
                activeTab === 'monitor' 
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)]' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                activeTab === 'monitor' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400'
              }`}>
                <IconWrapper name="bell" size={16} />
              </div>
            <h3 className="text-[12px] font-black uppercase tracking-tight">Wallet Monitor</h3>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800/60">
            <p className="px-3 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tutorials</p>
            <div className="space-y-1">
              {TUTORIALS.filter(t => t.id !== 'socials').map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab('assistant');
                    handleSend(`Tutorial for ${t.title}`, t.content);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left border border-transparent active:scale-95 hover:bg-slate-800/60"
                >
                  <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 transition-colors">
                    <IconWrapper name={t.icon} size={16} />
                  </div>
                  <h3 className="text-[12px] font-black uppercase tracking-tight text-slate-400 group-hover:text-white">{t.title}</h3>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800/60">
            <p className="px-3 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Official Resources</p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  const s = TUTORIALS.find(t => t.id === 'socials');
                  if (s) handleSend(`Tutorial for ${s.title}`, s.content);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left border border-transparent hover:bg-slate-800/60 active:scale-95"
              >
                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <IconWrapper name="users" size={16} />
                </div>
                <h3 className="text-[12px] font-black uppercase tracking-tight text-slate-400 group-hover:text-white">Social Networks</h3>
              </button>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left border border-transparent hover:bg-slate-800/60 active:scale-95"
              >
                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <IconWrapper name="book" size={16} />
                </div>
                <h3 className="text-[12px] font-black uppercase tracking-tight text-slate-400 group-hover:text-white">Documentation</h3>
              </a>
              <a
                href={EXPLORER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left border border-transparent hover:bg-slate-800/60 active:scale-95"
              >
                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <IconWrapper name="globe" size={16} />
                </div>
                <h3 className="text-[12px] font-black uppercase tracking-tight text-slate-400 group-hover:text-white">ARC Scan</h3>
              </a>
            </div>
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <span className="font-black text-white tracking-widest uppercase text-xs font-mono">
              {activeTab === 'assistant' ? 'ARC IA v1.2' : 'Wallet Monitor v1.0'}
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <button 
                  onClick={connectedAddress ? undefined : connectWallet}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border transition-all ${
                    connectedAddress 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default' 
                      : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95'
                  }`}
               >
                  <IconWrapper name="wallet" size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {connectedAddress ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}` : 'Connect Wallet'}
                  </span>
               </button>
               {connectedAddress && (
                 <button 
                    onClick={disconnectWallet}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors border border-slate-700/50 active:scale-95"
                    title="Disconnect Wallet"
                 >
                    <IconWrapper name="close" size={14} />
                 </button>
               )}
             </div>
             {activeTab === 'assistant' && (
               <>
                 <button 
                    onClick={clearChat}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/50"
                    title="Clear Chat"
                 >
                    <IconWrapper name="refresh" size={16} />
                 </button>
                 <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                      AI Limit: {generalQuestionsCount}/{MAX_GENERAL_QUESTIONS}
                    </span>
                </div>
               </>
             )}
            <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Testnet</span>
            </div>
          </div>
        </header>

        <div className={`flex-1 flex flex-col min-h-0 ${activeTab === 'assistant' ? '' : 'hidden'}`}>
          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 space-y-8 scroll-smooth">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
                <div className={`flex gap-4 max-w-[95%] md:max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border ${m.role === 'assistant' ? 'bg-slate-800 border-slate-700' : 'bg-indigo-600 border-indigo-500'}`}>
                    {m.role === 'assistant' ? (
                      <img src={ARC_LOGO_URL} alt="AI" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                    ) : (
                      <IconWrapper name="user" size={18} className="text-white" />
                    )}
                  </div>
                  <div className={`p-5 rounded-2xl text-[14px] message-shadow transition-all ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800/80 border border-slate-700/50 text-slate-100 rounded-tl-none backdrop-blur-md'}`}>
                    {renderMessageContent(m.content)}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center p-2">
                    <img src={ARC_LOGO_URL} alt="AI" className="w-full h-full object-contain animate-pulse" />
                  </div>
                  <div className="p-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-none flex items-center">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          <div className="p-6 bg-slate-900/60 border-t border-slate-800/40 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute -inset-1 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition duration-500 bg-indigo-500"></div>
              <div className="relative flex items-center bg-slate-900 border rounded-2xl p-2.5 pr-4 shadow-2xl transition-all border-slate-700 focus-within:border-indigo-500/40">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                  placeholder="Ask about ARC Testnet..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base px-5 py-2.5 placeholder-slate-600 text-white font-medium" 
                />
                <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="p-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center border shadow-lg bg-indigo-600 hover:bg-indigo-500 border-indigo-400/20 text-white">
                  <IconWrapper name="send" size={18} />
                </button>
              </div>
            </div>
            <p className="text-center mt-4 text-[9px] text-slate-600 uppercase tracking-[0.3em] font-black">Official ARC Protocol Beta Channel</p>
          </div>
        </div>

        <div className={`flex-1 flex flex-col min-h-0 ${activeTab === 'monitor' ? '' : 'hidden'}`}>
          <WalletMonitor connectedAddress={connectedAddress} />
        </div>

      </main>

      {showWelcomeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
          <div className="relative z-[210] max-w-2xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl shadow-[0_0_80px_rgba(79,70,229,0.3)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
            <div className="p-6 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg border border-indigo-500">
                <img src={ARC_LOGO_URL} alt="ARC" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Welcome to ARC Assistant</h2>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Beta Access Protocol</p>
              </div>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
              <div className="space-y-4">
                <p className="text-slate-200 text-base leading-relaxed font-medium">
                  The ARC Assistant helps users learn about and interact with ARC Testnet dApps through guided tutorials.
                </p>
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    Enter a term from the testnet, for example, <span className="text-indigo-400 font-bold">faucet</span>, and receive the tutorial. If you type a question for the AI, it will answer. There are <span className="text-white font-bold">5 questions</span> available per day.
                  </p>
                </div>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-2xl relative">
                {/* Embed otimizado para evitar redirecionamentos e melhorar qualidade */}
                <iframe 
                  src={WELCOME_VIDEO_URL} 
                  className="absolute inset-0 w-full h-full border-0 pointer-events-auto" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  title="ARC Welcome Video"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                ></iframe>
              </div>
              
              <button 
                onClick={closeWelcomeModal}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 border border-indigo-400/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setZoomedImage(null)}
        >
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
          <button 
            className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition-colors active:scale-95"
            onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
          >
            <IconWrapper name="close" size={24} />
          </button>
          <div 
            className="relative z-[105] max-w-7xl max-h-full rounded-2xl overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={zoomedImage.url} 
              alt={zoomedImage.alt} 
              className="w-full h-auto object-contain max-h-[90vh]"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
            <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 backdrop-blur-sm p-4 border-t border-slate-800">
              <p className="text-white text-xs font-bold uppercase tracking-widest text-center">{zoomedImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
