import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS (sem / no final)
app.use(cors({
  origin: [
    "https://arc-testnet-assistant.vercel.app",
    "http://localhost:5173"
  ]
}));

// ✅ JSON
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// ✅ STORAGE (JS PURO)
const monitoredWallets = {};
const lastTxMap = {};
const monitors = {};

// ===== TELEGRAM =====
async function sendTelegramMessage(chatId, text) {
  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text
      }
    );
  } catch (err) {
    console.log("Telegram send error", err.message);
  }
}

// ===== CHECK WALLET =====
async function checkWallet(wallet) {
  try {
    const res = await axios.get(
      `https://testnet.arcscan.app/api/v2/addresses/${wallet}/transactions`
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

    await sendTelegramMessage(chatId, `
🚨 ARC Transaction Detected

Wallet: ${wallet}
Type: ${type}
Hash: ${latestTx.hash}
https://testnet.arcscan.app/tx/${latestTx.hash}
    `);

    console.log("New TX:", latestTx.hash);

  } catch (err) {
    console.log("Arcscan API error", err.message);
  }
}

// ===== MONITOR =====
function startMonitoring(wallet) {
  if (monitors[wallet]) return;

  checkWallet(wallet);

  monitors[wallet] = setInterval(() => {
    checkWallet(wallet);
  }, 10000);
}

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/monitor", async (req, res) => {
  const { walletAddress, telegramChatId } = req.body;

  if (!walletAddress || !telegramChatId) {
    return res.status(400).json({ error: "Missing data" });
  }

  monitoredWallets[walletAddress] = telegramChatId;

  startMonitoring(walletAddress);

  await sendTelegramMessage(
    telegramChatId,
    `🚀 Monitoring started for ${walletAddress}`
  );

  res.json({ success: true });
});

app.post("/stop", (req, res) => {
  const { walletAddress } = req.body;

  if (monitors[walletAddress]) {
    clearInterval(monitors[walletAddress]);
    delete monitors[walletAddress];
  }

  delete monitoredWallets[walletAddress];

  res.json({ stopped: true });
});

// ✅ START
app.listen(PORT, "0.0.0.0", () => {console.log(`Server running on port ${PORT}`);});