The ARC AI Assistant (Beta) is onboarding and tutorial assistant for the ARC Testnet ecosystem.

Try it here:  https://arcportal.space/

While many teams create dApps, new users often struggle to understand how to use them. The ARC  Assistant solves this problem by providing clear, step-by-step tutorials for ARC Testnet dApps, helping users connect wallets, interact securely, and troubleshoot common issues.

The ARC Assistant helps users learn about and interact with ARC Testnet dApps through guided tutorials.

In the chat, type words like swap, faucet.. if you type an invalid term, a message will appear: "I'm having technical difficulties. Please try again in a few moments."

💸 SEND USDC

📌 Overview

The Send USDC feature allows users to transfer tokens on the ARC Testnet in a simple and secure way.

It provides a clean interface where users can:

-Select a predefined amount or enter a custom value

-View their current wallet balance

-Send tokens to another address

-Receive instant transaction feedback


1. 🔗 Connect Wallet

The user connects their Web3 wallet (MetaMask, Rabby, etc).

<img width="1076" height="619" alt="image" src="https://github.com/user-attachments/assets/63b67b64-dc1b-4bdc-ad10-11a8f021de54" />


-The connected address is displayed

-The current balance is automatically fetched

2. 💰 Balance Display

The app retrieves the wallet balance in real time:

-Uses getBalance from the ARC network

-Converts values using formatUnits

-Displays a clean value (e.g. 12.4500 USDC)

<img width="962" height="633" alt="image" src="https://github.com/user-attachments/assets/dca70ba2-2ad8-48a5-ae2f-7cfeea6adbca" />


3. 🔢 Select Amount

Users can quickly choose an amount:

1 USDC
5 USDC
10 USDC

Or enter a custom value:

Custom amount input

4. 📥 Enter Recipient

The user inputs the destination wallet address:

0x...

<img width="900" height="612" alt="image" src="https://github.com/user-attachments/assets/4235aac3-0945-4a83-bcdb-a7bdc9264690" />


5. 🚀 Send Transaction

When clicking Send:

-The app prepares a transaction using viem

-Sends native USDC on ARC Testnet

-Wallet opens for confirmation


6. ⚡ Instant Feedback

After user approval:

-Transaction hash is immediately shown

-UI displays success message:

🚀 Token Sent Successfully

<img width="844" height="188" alt="image" src="https://github.com/user-attachments/assets/3af74e3e-9079-45e1-a9ae-11c661070eb9" />


Explorer link is provided:

https://testnet.arcscan.app/

https://testnet.arcscan.app/tx/<tx_hash>

7. 🔄 Balance Auto Update

The system updates balance in two steps:

Instantly after sending (UX improvement)

After blockchain confirmation

This ensures the UI is always up-to-date.

🎨 UI Features

Responsive layout (mobile + desktop)

Smooth animations on success

Clean Web3-style interface

Scrollable page for better usability

⚠️ Notes

The ARC Testnet uses native USDC (18 decimals)

No ERC-20 contract interaction is required

Wallet must be connected to ARC Testnet (Chain ID: 5042002

🚀 Summary

The Send USDC module delivers a smooth Web3 payment experience by combining:

Simplicity

Real-time feedback

Clean UI/UX

Reliable transaction handling







