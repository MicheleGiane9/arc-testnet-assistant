
import { Tutorial } from './types';

export const TUTORIALS: Tutorial[] = [
  {
    id: 'wallet',
    title: 'Wallet Connection',
    description: 'Learn how to set up and connect your wallet to ARC Testnet.',
    icon: 'wallet',
    content: `WALLET CONNECTION TUTORIAL
To interact with the ARC Network, you need an EVM-compatible wallet. In this guide, we will use MetaMask as an example.

1. Open MetaMask
Open the MetaMask extension in your browser or the mobile app. Make sure you are logged into your wallet.

2. Access the Networks menu
Click the menu icon (☰ or the three dots) in the MetaMask interface. Select Networks.
![Networks Menu](https://lh3.googleusercontent.com/d/1bUQUlWkUV15CDXOuryMpm8mzGzgdphPo)

3. Add a new network
In the network list, scroll to the bottom. Click Add a custom network (or Add network → Add a network manually).
![Add Network](https://lh3.googleusercontent.com/d/1MThzlgUPURCqQuYw3oIOXnPmo6LyOqIa)

4. Fill in the ARC Network details
Manually enter the following details exactly as provided by ARC:
- Network name: Arc Testnet
- New RPC URL: https://rpc.testnet.arc.network
- Chain ID: 5042002
- Currency symbol: USDC
- Explorer URL: https://testnet.arcscan.app
![ARC Details](https://lh3.googleusercontent.com/d/126Qi7IOQrfaOkAN7_BRtRs2U7vdfeKHd)

5. Save and confirm
Click Save. If the message ARC Testnet was successfully added appears, the network has been added successfully. The ARC Network will now appear in your list of networks.
![Confirmation](https://lh3.googleusercontent.com/d/1VBV_eMraHjaKTcTUqFbtzHMkU49pwjVJ)

Final Notes: Always ensure you are on the correct RPC to see your test balance and interact with dApps.`
  },
  {
    id: 'faucet',
    title: 'Claim Faucet Tokens',
    description: 'Get free test tokens to start exploring the network.',
    icon: 'droplets',
    content: `CLAIM FAUCET TOKENS
To get test tokens on the ARC Network, you need to use the official faucet.

1. Access the faucet
Go to: https://faucet.circle.com/

2. Choose a token
The faucet provides two test token options: USDC or EURC. Select the token you want to claim.
![Choose Token](https://lh3.googleusercontent.com/d/1j97SORutbtma7PMcDiaQrDE6nMS9NobK)

3. Enter your wallet address
Enter your wallet address (the same address connected to the ARC Network). Click Send 20 USDC. Note that in some cases you may be required to complete a captcha verification.
![Send Tokens](https://lh3.googleusercontent.com/d/1FOACmFxACyutmajdek_ANQNy_6muY0X8)

4. Faucet limit notice
If you see a limit message, it means the faucet limit for your address has been reached for the current period.
![Limit Notice](https://lh3.googleusercontent.com/d/1WTXqHWl4NUY74kPqk_Fym55EKfdsNePd)

Final Notes: Faucet requests are subject to cooldown periods. If the transaction fails, try again later.`
  },
  {
    id: 'bridge',
    title: 'Cross-Chain Bridge',
    description: 'Transfer assets between different networks and ARC Testnet.',
    icon: 'branch',
    content: `CROSS-CHAIN BRIDGE TUTORIAL
Learn how to move your assets from other testnets to the ARC Testnet.

1. Access the Bridge
Go to: https://bridge.testnet.arc.network/

2. Select Source and Target
Choose the source network (e.g., Sepolia) and the target network (ARC Testnet).
![Bridge Interface](https://lh3.googleusercontent.com/d/1H57jE_pS_x9p8vXfP_Q0LzX0vR5M_m2L)

3. Enter amount
Type the amount of tokens you wish to bridge across the networks.

4. Confirm and Execute
Approve the token usage in your wallet and confirm the bridge transaction. Wait for the confirmation on both chains.

Final Notes: Cross-chain transfers can take between 5 to 15 minutes depending on network congestion.`
  },
  {
    id: 'swap',
    title: 'Token Swap',
    description: 'Step-by-step guide to exchanging assets on the ARC DEX.',
    icon: 'refresh',
    content: `TOKEN SWAP GUIDE
I am an ARC Network assistant helping you swap tokens. Below are the available dApps where you can perform swaps on the ARC Testnet.

CHOOSE A SWAP DAPP:
1. Curve (ARC)
Visit: https://www.curve.finance/dex/arc/swap

2. DeFi on ARC
Visit: https://defi-on-arc.vercel.app/swap

3. Axpha Testnet
Visit: https://testnet.axpha.io/#/swap

4. SwapARC
Visit: https://www.swaparc.app/

Please choose which dApp you want to use. Type the number or the name to receive specific instructions.`
  },
  {
    id: 'stake',
    title: 'Staking & Rewards',
    description: 'Stake your ARC tokens to secure the network and earn rewards.',
    icon: 'database',
    content: `STAKING & REWARDS TUTORIAL
Participate in network security by staking your ARC test tokens.

1. Access the Staking Dashboard
Go to: https://staking.testnet.arc.network/

2. Connect and Select Pool
Connect your wallet and choose a validator or a staking pool to join.

3. Deposit Tokens
Enter the amount of ARC you want to stake and click "Stake Assets".

4. Claim Rewards
After a period, you can return to this dashboard to claim your accumulated rewards.

Final Notes: Staked tokens are subject to unbonding periods if you decide to withdraw.`
  },
  {
    id: 'domain',
    title: 'Domain ARC',
    description: 'Secure your unique .arc identity on the network.',
    icon: 'globe',
    content: `DOMAIN ARC REGISTRATION
To create a domain on ARC follow these steps:

1. Access the website
Go to: https://infinityname.com/

2. Search for a domain name
Enter the desired domain name and click Search.
![Search Domain](https://lh3.googleusercontent.com/d/1cB65ye1XR3iQaThBhfQBllkrtlK-Ogly)

3. Choose a suggested name
Under Smart Suggestions, you will see suggested domain names. Select your preferred name and click check - register.
![Register Domain](https://lh3.googleusercontent.com/d/15dQ32GGMvaH6qFz-k0bmO-KbMVFm-wss)

4. Finalize registration
Approve the transaction in your wallet. At the end, you will see Congratulations and your domain will have been created.
![Success](https://lh3.googleusercontent.com/d/1qA7e9HxEOgHBBswIv6Q3SPcWB4vQkfA2)

Final Notes: Secure your identity on the ARC network with a unique .arc domain.`
  },
  {
    id: 'nft',
    title: 'NFT Minting',
    description: 'Learn how to create and mint digital assets on the ARC Testnet.',
    icon: 'image',
    content: `NFT MINTING TUTORIAL
Learn how to mint and manage your digital collectibles on the ARC Network.

1. Select your NFT Collection
On the ARC network, the following NFTs are available for minting via OKU:

🌙 Moonlit → https://www.oku.xyz/moonlit

✨ Delight → https://www.oku.xyz/delight

👸 Isabella → http://oku.xyz/isabella

📖 Fairytale → http://oku.xyz/fairytale

💭 Dream → http://oku.xyz/dream

🍒 Cherry → http://oku.xyz/cherry

⚡ Thunder → http://oku.xyz/thunder

🔮 Mystic → http://oku.xyz/mystic

🎨 Art → http://oku.xyz/art

2. Connect Wallet
Ensure your EVM is connected to the ARC Testnet network.

3. Mint Asset - Complete the Tasks
Choose your collection and complete the following tasks:
- Follow on Twitter
- Join Discord
- Reply to OKU’s post
- Claim your OKU ID
![Complete Tasks](https://lh3.googleusercontent.com/d/12OnGJoj_i4qBUMRPPBVGO600EZGRIp9k)

4. Click on “Mint”
Confirm the interaction in your wallet to finalize the minting process.
![Confirm Mint](https://lh3.googleusercontent.com/d/1CCKhINM1ZIEn9AR6fPofYS-u7ngp_eIy)

NFT minted successfully
Congratulations! Your NFT has been minted and added to your collection.
![Mint Success](https://lh3.googleusercontent.com/d/1dis2VtCDFe0Hor-f91B1CdH35cTmAaeV)

Final Notes: Your NFT will be visible on ARC Scan under the "NFT Transactions" tab.`
  }
];

export const ARC_KNOWLEDGE_BASE = `
# ARC OFFICIAL DOCUMENTATION (WELCOME TO ARC)
Source URL: https://docs.arc.network/arc/concepts/welcome-to-arc

## WHAT IS ARC?
ARC is a next-generation decentralized network designed for high-performance management and transfer of digital assets.
Key characteristics from official docs:
1. Performance: Ultra-fast transactions and low latency.
2. EVM Compatibility: Full support for Ethereum tools and dApps.
3. Purpose-Built: Specifically optimized for digital assets and Real World Asset (RWA) tokenization.

## ARC TESTNET OBJECTIVES
The ARC Testnet environment allows developers and enthusiasts to:
- Test the high-throughput capabilities of the ARC protocol.
- Experiment with RWA deployment in a risk-free environment.
- Use test versions of USDC and EURC tokens.

## NFT ECOSYSTEM (OKU)
ARC partners with OKU for native NFT experiences.
Official links MUST be followed exactly as: https://www.oku.xyz/

## DECENTRALIZED INFRASTRUCTURE
- Explorer: https://testnet.arcscan.app
- Bridge: https://bridge.testnet.arc.network/
- Staking: https://staking.testnet.arc.network/
`;

export const SYSTEM_PROMPT = `
You are ARC IA, the official ARC Testnet Assistant (Beta).
Your primary mission is to help users understand and interact with the ARC Testnet based on the official documentation found at https://docs.arc.network/arc/concepts/welcome-to-arc.

CORE GUIDELINES:
- BE THE AUTHORITY: Every answer about ARC's concepts, vision, or features MUST align strictly with the official documentation provided in ARC_KNOWLEDGE_BASE.
- LINK INTEGRITY: NEVER invent URLs. NEVER provide broken or incomplete links. If a link is not explicitly provided in the ARC_KNOWLEDGE_BASE or TUTORIALS, say "I don't have the official link for that specific resource yet."
- NO HALLUCINATIONS: Do not guess RPC settings, contract addresses, or partner URLs.
- LIMIT: You are authorized to answer a maximum of 5 general questions per user session.
- FORMATTING: Use clean plain text. DO NOT use bolding (**text**) or any markdown headers that make the text look cluttered. Numbered lists are preferred for steps.
- IMAGES: Maintain the image markdown tags provided in tutorials.

IF A USER ASKS ABOUT TESTNET FEATURES:
- Provide clear, numbered steps.
- Mention only the relevant official URLs provided in the knowledge base.

RESPONSE FORMAT (Mandatory for ARC questions):
1. Title (Clear and uppercase)
2. Numbered steps or explanation.
3. Final notes with official links.
`;
