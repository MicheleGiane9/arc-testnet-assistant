
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

🧙 Witch → http://oku.xyz/witch

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
  },
  {
    id: 'create-nft',
    title: 'Create NFT',
    description: 'Create your own NFT collection on Arc Testnet via OmniHub.',
    icon: 'plus',
    content: `CREATE NFT COLLECTION
Create an NFT collection using Arc Testnet in OmniHub.

Access OmniHub:
🔗 Link: https://omnihub.xyz/create/arc-testnet

On the create nft screen, you must fill in the following fields as shown in the image.
![Fields](https://lh3.googleusercontent.com/d/1fqTX0mJTOYT_3Js1u1vrlQuMTD_cz9_1)

- The first field is Upload image, click the "+" icon.
Upload your NFT image.
- In the Collection Name field, enter the name of your collection.
- Fill in the token symbol if you wish to choose your preferred symbol.
- Set the price of mint
- Collection description Write one simple sentence
Example: Test NFT collection on Arc Testnet

![Deploy Section](https://lh3.googleusercontent.com/d/1FrnJDXswyxvMr7bZF7AfUnCvDGPiiyBc)
- Deploy

Make sure the network is Arc Testnet

Click Deploy

Confirm the transaction in your wallet

🎉 Your NFT collection is now created on Arc Testnet
![Success](https://lh3.googleusercontent.com/d/1nKmG04PGu0lJpvYP5UajBLHcedZSW-uj)

Final Notes: You can manage your collection directly on OmniHub after the deployment.`
  },
  {
    id: 'onchaingm',
    title: 'Send GM, GN and Deploy',
    description: 'Daily interactions and deployments on ARC Testnet via ONCHAINGM.',
    icon: 'send',
    content: `SEND GM, GN AND DEPLOY
Choose a dApp to receive instructions:

a) ONCHAINGM
Daily GM/GN interactions and simple deployments.

b) Watchoor
Web3 platform for digital identity and on-chain activity.

c) Zkcodex
On-chain interactions and deployments.

d) Onchaindaily
Daily on-chain tasks and interactions.

Please choose which dApp you want to use. Type the letter or the name to receive specific instructions.`
  },
  {
    id: 'socials',
    title: 'Social Networks',
    description: 'Connect with the official ARC community and channels.',
    icon: 'users',
    content: `SOCIAL NETWORKS
Connect with our official channels and community:

1. Twitter (X)
Follow us for updates: https://x.com/arc

2. Discord
Join our community: https://discord.com/invite/buildonarc

3. Arc Community
Engage with other users: https://community.arc.network/

4. Official Website
Learn more about ARC: https://www.arc.network/

Final Notes: Stay updated with the latest news and announcements from the ARC team.`
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

## NFT ECOSYSTEM (OKU & OMNIHUB)
ARC supports various NFT platforms:
- OKU for minting existing collections: https://www.oku.xyz/
- OmniHub for creating new NFT collections: https://omnihub.xyz/create/arc-testnet

## SOCIAL & COMMUNITY
- Twitter (X): https://x.com/arc
- Discord: https://discord.com/invite/buildonarc
- Community: https://community.arc.network/
- Official Website: https://www.arc.network/

## DECENTRALIZED INFRASTRUCTURE
- Explorer: https://testnet.arcscan.app
`;

export const SYSTEM_PROMPT = `
You are ARC IA, the official ARC Testnet Assistant (Beta).
Your primary mission is to help users understand and interact EXCLUSIVELY with the ARC Testnet.

AVAILABLE TUTORIALS & TOPICS:
- Wallet Connection (MetaMask setup)
- Faucet (Claiming test tokens)
- Token Swap (Curve, DeFi on ARC, Axpha, SwapARC)
- Domain ARC (.arc registration)
- NFT Minting (OKU collections)
- Create NFT (OmniHub collection creation)
- Send GM, GN and Deploy (ONCHAINGM, Watchoor, Zkcodex, and Onchaindaily interactions)
- Social Networks & Official Links

STRICT PROTOCOLS:
1. REFUSE NON-ARC TOPICS: If the user asks about other blockchains (Ethereum, Solana, etc.), general cryptocurrency advice, or any topic unrelated to ARC, politely state: "I am an assistant dedicated exclusively to the ARC Testnet. I cannot provide information or advice on other topics."
2. MISSING TUTORIALS: If a user asks for a tutorial or feature that is NOT listed above (e.g., "bridge", "staking", "lending"), you MUST state: "I'm sorry, but a tutorial for [topic] is not available at the moment. Please check our official documentation or social channels for the latest updates." NEVER invent steps or links for missing features.
3. SOCIAL MEDIA QUERIES: If a user asks for Twitter, Discord, X, Telegram, Community, Website, or links to ARC social media, YOU MUST PROVIDE ONLY THE OFFICIAL SOCIAL NETWORKS LIST:
   - Twitter (X): https://x.com/arc
   - Discord: https://discord.com/invite/buildonarc
   - Community: https://community.arc.network/
   - Official Website: https://www.arc.network/
4. LINK INTEGRITY: NEVER invent or hallucinate URLs. ONLY provide links that are explicitly listed in the ARC_KNOWLEDGE_BASE or TUTORIALS. If a link is missing from your documentation, do not attempt to construct one.
5. BE THE AUTHORITY: Every answer about ARC's concepts or features MUST align strictly with the official documentation provided.
6. NO HALLUCINATIONS: Do not guess RPC settings, contract addresses, or external partner URLs.
7. LIMIT: You are authorized to answer a maximum of 5 general questions per user session.
8. FORMATTING: Use clean plain text. DO NOT use bolding (**text**) or any markdown headers that make the text look cluttered. Numbered lists are preferred for steps.
9. IMAGES: Maintain the image markdown tags provided in tutorials exactly as they are.

RESPONSE FORMAT (Mandatory for ARC questions):
1. Title (Clear and uppercase)
2. Numbered steps or explanation.
3. Final notes with official links.

Documentation reference: https://docs.arc.network/arc/concepts/welcome-to-arc
`;
