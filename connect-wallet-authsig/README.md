# `signAndSaveAuthMessage` example

This is a [Next.js](https://nextjs.org/) example that demonstrates how to use the `signAndSaveAuthMessage` function from the `@lit-protocol/auth-browser` package with a **Connect Wallet** modal like [RainbowKit](https://www.rainbowkit.com/docs/introduction).

Note: This example uses prior versions of RainbowKit and `wagmi` that are compatible with `ethers`.

## 💻 Getting Started

1. Clone this repo and download dependencies:

```bash
git clone git@github.com:LIT-Protocol/sdk-examples.git
cd connect-wallet-authsig
npm install
# or
yarn
# or
pnpm
```

2. Add environment variables:

```bash
NEXT_PUBLIC_ENABLE_TESTNETS='<true or false>'
NEXT_PUBLIC_WC_PROJECT_ID='<Your WalletConnect project ID>'
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## 📚 Resources

- [Lit Protocol Developer Docs](https://developer.litprotocol.com/)
- [`@lit-protocol/auth-browser` API Docs](https://js-sdk.litprotocol.com/modules/auth_browser_src.html)