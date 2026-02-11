
import { useState, useRef, useEffect } from 'react';
import { Message, Tutorial } from './types';
import { TUTORIALS } from './constants';
import { generateAssistantResponse } from './services/gemini';
import IconWrapper from './components/IconWrapper';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ARC_LOGO_URL = "https://lh3.googleusercontent.com/d/1pyqTRBFYE_oiMikiH-oXl9cPHc-VFq7M";
const DOCS_URL = "https://docs.arc.network/arc/";
const EXPLORER_URL = "https://testnet.arcscan.app";
// Convert Google Drive view link to embeddable preview link
const WELCOME_VIDEO_URL = '/src/video/tutor.mp4';


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
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem('arc_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }

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
    localStorage.setItem('arc_welcome_seen', 'true');
    setShowWelcomeModal(false);
  };

  const findTutorialByKeyword = (text: string): Tutorial | { content: string } | undefined => {
    const lowerText = text.toLowerCase().trim();
    
    if (lowerText === '1' || lowerText.includes('curve')) return { content: SWAP_DETAILS.curve };
    if (lowerText === '2' || lowerText.includes('defi')) return { content: SWAP_DETAILS.defi };
    if (lowerText === '3' || lowerText.includes('axpha')) return { content: SWAP_DETAILS.axpha };
    if (lowerText === '4' || lowerText.includes('swaparc')) return { content: SWAP_DETAILS.swaparc };

    if (lowerText.includes('faucet')) return TUTORIALS.find(t => t.id === 'faucet');
    if (lowerText.includes('wallet') || lowerText.includes('metamask')) return TUTORIALS.find(t => t.id === 'wallet');
    if (lowerText.includes('domain')) return TUTORIALS.find(t => t.id === 'domain');
    if (lowerText.includes('create nft') || lowerText.includes('omnihub')) return TUTORIALS.find(t => t.id === 'create-nft');
    if (lowerText.includes('nft') || lowerText.includes('mint')) return TUTORIALS.find(t => t.id === 'nft');
    if (lowerText.includes('swap')) return TUTORIALS.find(t => t.id === 'swap');
    
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

      return part.split('\n').map((line, i) => {
        if (!line.trim()) return <div key={`${index}-${i}`} className="h-2" />;
        const cleanLine = line.replace(/\*\*\*/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
        const isHeader = line.startsWith('#') || (line.toUpperCase() === line.trim() && line.length > 3 && line.length < 50);
        return (
          <div key={`${index}-${i}`} className={isHeader ? 'font-bold text-base mt-6 mb-3 text-white border-l-4 border-indigo-500 pl-4 bg-indigo-500/10 py-2 rounded-r-xl uppercase tracking-tight' : 'mb-3 text-slate-200 text-[14px] leading-relaxed font-medium'}>
            {renderTextWithLinks(cleanLine.replace(/^#+\s*/, ''))}
          </div>
        );
      });
    });
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-sans relative">
      {/* Sidebar */}
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
            {TUTORIALS.filter(t => t.id !== 'socials').map((t) => (
              <button
                key={t.id}
                onClick={() => handleSend(`Tutorial for ${t.title}`, t.content)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left border border-transparent active:scale-95 hover:bg-slate-800/60"
              >
                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <IconWrapper name={t.icon} size={16} />
                </div>
                <h3 className="text-[12px] font-black uppercase tracking-tight text-slate-400 group-hover:text-white">{t.title}</h3>
              </button>
            ))}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <span className="font-black text-white tracking-widest uppercase text-xs font-mono">ARC IA v1.2</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                  AI Limit: {generalQuestionsCount}/{MAX_GENERAL_QUESTIONS}
                </span>
            </div>
            <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Testnet</span>
            </div>
          </div>
        </header>

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

        {/* Input Area */}
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
      </main>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
          <div className="relative z-[210] max-w-2xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl shadow-[0_0_80px_rgba(79,70,229,0.3)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg border border-indigo-500">
                <img src={ARC_LOGO_URL} alt="ARC" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Welcome to ARC Assistant</h2>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Beta Access Protocol</p>
              </div>
            </div>
            
            {/* Content */}
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

              {/* Video Embed */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-2xl relative">
                <iframe 
                  src={WELCOME_VIDEO_URL} 
                  className="absolute inset-0 w-full h-full" 
                  allow="autoplay; encrypted-media" 
                  allowFullScreen
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

      {/* Lightbox / Zoom Modal */}
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
