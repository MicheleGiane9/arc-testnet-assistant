The ARC AI Assistant (Beta) is onboarding and tutorial assistant for the ARC Testnet ecosystem.

While many teams create dApps, new users often struggle to understand how to use them. The ARC  Assistant solves this problem by providing clear, step-by-step tutorials for ARC Testnet dApps, helping users connect wallets, interact securely, and troubleshoot common issues.

The ARC Assistant helps users learn about and interact with ARC Testnet dApps through guided tutorials.

In the chat, type words like swap, faucet.. if you type an invalid term, a message will appear: "I'm having technical difficulties. Please try again in a few moments."

ARC Wallet Monitor — How It Works

📌 Overview

The ARC Wallet Monitor is a real-time notification system that tracks blockchain wallet activity and sends instant alerts via Telegram whenever a new transaction occurs.

It is designed to be simple, automated, and user friendly, requiring no manual setup of Telegram IDs.

⚙️ How It Works
1. 🔗 Connect Wallet

The user connects their wallet through the interface.
This wallet address will be monitored for incoming and outgoing transactions.

2. 🤖 Connect Telegram (Automatic Linking)

When the user clicks "Connect Telegram":

A unique sessionId is generated

The Telegram bot opens with a deep link:

https://t.me/ArcTestnetMonitorBot?start=<sessionId>

The user clicks Start inside the bot

Note: On a computer browser, if Telegram is the web version, the link may take a while to load. On a PC or mobile app, it opens automatically, and you can start the chat.

<img width="1358" height="609" alt="montior1" src="https://github.com/user-attachments/assets/dcec4a2c-1cc4-409c-854f-b4169b059cfc" />

3. 🔄 Session Linking via Webhook

Once the user starts the bot:

Telegram sends a webhook event to the backend
The backend extracts:
chatId (user identifier)
sessionId (from /start command)

The system links them:

sessionId → chatId

4. 🔍 Automatic Detection (Frontend Polling)

The frontend continuously checks:

GET /telegram-status/:sessionId

When the backend confirms the link:

The chatId is automatically assigned
No manual input is required
Telegram is now connected ✅

5. 🚀 Start Monitoring

When monitoring starts:

The backend stores:

walletAddress → chatId
A monitoring process begins using setInterval
Every 10 seconds, the system checks for new transactions

<img width="1040" height="531" alt="monitor 3" src="https://github.com/user-attachments/assets/4a5e613e-cb79-4f97-8d97-c9941a45a9db" />



6. 📡 Blockchain Data Fetching

The backend fetches data from the ARC Testnet explorer:

https://testnet.arcscan.app/api/v2/addresses/{wallet}/transactions


7. 🧠 Transaction Detection Logic

To avoid duplicate alerts:

The system stores the last transaction hash
Only sends a notification if a new transaction is detected



8. 📩 Telegram Notification

When a new transaction is found:

The system determines:
Incoming or Outgoing
Sends a formatted message via Telegram Bot API:

🚨 ARC Transaction Detected

Wallet: <address>
Type: Incoming / Outgoing
Hash: <tx_hash>

https://testnet.arcscan.app/tx/<tx_hash>



9. 🛑 Stop Monitoring

Users can stop monitoring at any time:

The interval process is cleared
The wallet is removed from tracking


🧩 Architecture Summary

Frontend (React)

Handles UI and user interaction

Generates sessionId

Polls backend for Telegram connection

Backend (Node.js + Express)

Manages wallet monitoring

Processes Telegram webhook

Sends notifications

External Services

ARC Testnet Explorer API → transaction data

Telegram Bot API → message delivery




💡 Key Features


✅ Real-time transaction monitoring

✅ Automatic Telegram connection (no Chat ID needed)

✅ Duplicate transaction prevention

✅ Lightweight and fast polling system

✅ Simple and scalable architecture






🚀 Conclusion



The ARC Wallet Monitor provides a seamless way to track blockchain activity and receive instant notifications, combining Web3 data with real-time messaging in a clean and automated workflow.






