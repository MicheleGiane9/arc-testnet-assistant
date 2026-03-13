import express from "express";
import type { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const monitoredWallets: Record<string, string> = {};
const lastTxMap: Record<string, string> = {};
const monitors: Record<string, NodeJS.Timeout> = {};

async function sendTelegramMessage(chatId: string, text: string) {

  try {

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: chatId,
      text: text
    });

  } catch (err) {

    console.log("Telegram send error");

  }

}

async function checkWallet(wallet: string) {

  try {

    const res = await axios.get(
      `https://testnet.arcscan.app/api/v2/addresses/${wallet}/transactions`,
      { timeout: 5000 }
    );

    const txs = res.data.items;

    if (!txs || txs.length === 0) return;

    const latestTx = txs[0];

    if (lastTxMap[wallet] === latestTx.hash) return;

    lastTxMap[wallet] = latestTx.hash;

    const chatId = monitoredWallets[wallet];

    if (!chatId) return;

    const type =
      latestTx.from.hash.toLowerCase() === wallet.toLowerCase()
        ? "Outgoing"
        : "Incoming";

    const message = `
🚨 ARC Transaction Detected

Wallet
${wallet}

Type
${type}

Hash
${latestTx.hash}

Explorer
https://testnet.arcscan.app/tx/${latestTx.hash}
`;

    await sendTelegramMessage(chatId, message);

    console.log("New TX detected:", latestTx.hash);

  } catch (err) {

    console.log("Arcscan API error");

  }

}

function startMonitoring(wallet: string) {

  if (monitors[wallet]) {

    console.log("Already monitoring:", wallet);
    return;

  }

  const interval = setInterval(() => {

    checkWallet(wallet);

  }, 10000);

  monitors[wallet] = interval;

}

async function startServer() {

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  app.post("/monitor", async (req: Request, res: Response) => {

    const { walletAddress, telegramChatId } = req.body;

    if (!walletAddress || !telegramChatId) {

      return res.status(400).json({
        error: "Wallet and Telegram ID required"
      });

    }

    monitoredWallets[walletAddress] = telegramChatId;

    startMonitoring(walletAddress);

    await sendTelegramMessage(
      telegramChatId,
`🚀 ARC Wallet Monitor Activated

Wallet:
${walletAddress}

Monitoring started`
    );

    console.log("Monitoring:", walletAddress);

    res.json({
      status: "success"
    });

  });

  app.post("/stop", (req: Request, res: Response) => {

    const { walletAddress } = req.body;

    if (monitors[walletAddress]) {

      clearInterval(monitors[walletAddress]);
      delete monitors[walletAddress];

    }

    delete monitoredWallets[walletAddress];

    res.json({
      status: "stopped"
    });

  });

  if (process.env.NODE_ENV !== "production") {

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });

    app.use(vite.middlewares);

  } else {

    app.use(express.static(path.join(__dirname, "dist")));

    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });

  }

  app.listen(PORT, () => {

    console.log("Wallet monitor started");
    console.log(`Server running http://localhost:${PORT}`);

  });

}

startServer();