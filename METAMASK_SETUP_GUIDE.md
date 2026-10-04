# MetaMask Setup Guide for Supply Chain Blockchain

## 🔴 Current Errors Explained

The errors you're seeing mean:
1. **MetaMask is not connected** to the application yet
2. **Wrong network** - MetaMask is not configured for the local Hardhat blockchain

## ✅ Step-by-Step Setup

### Step 1: Install MetaMask
- Download and install [MetaMask browser extension](https://metamask.io/download/)
- Create a new wallet or import an existing one
- **Keep your seed phrase safe!**

### Step 2: Add Hardhat Local Network to MetaMask

1. **Open MetaMask** and click the network dropdown (top left)
2. Click **"Add network"** or **"Add a network manually"**
3. Enter these exact details:

```
Network Name:       Hardhat Local
RPC URL:           http://127.0.0.1:8545
Chain ID:          1337
Currency Symbol:   ETH
```

4. Click **"Save"**
5. **Switch to this network** in MetaMask

### Step 3: Import the Contract Owner Account

The contract deployer (owner) has special privileges. Import this account:

1. In MetaMask, click the **account icon** (top right)
2. Select **"Import account"**
3. Select **"Private Key"**
4. Paste this private key:
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
5. Click **"Import"**

**⚠️ WARNING:** This is a **test account** from Hardhat. NEVER use it on mainnet or with real funds!

### Step 4: Connect MetaMask to the Application

1. Open the app at **http://localhost:3001**
2. MetaMask will prompt you to **connect**
3. Click **"Connect"** and select the imported account
4. You should now see your account address in the app

## 📝 Quick Reference

### Important Addresses

**Contract Address:**
```
0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Owner Account (imported from Hardhat):**
```
Address:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Balance:     10,000 ETH (test tokens)
```

### Available Test Accounts

Hardhat provides 20 test accounts, each with 10,000 ETH. Here are the first few:

**Account #1** (Owner - already imported):
```
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**Account #2** (for testing roles):
```
Address:     0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

**Account #3**:
```
Address:     0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

You can import these additional accounts to test different roles (Supplier, Manufacturer, Distributor, Retailer).

## 🔧 Troubleshooting

### Error: "Cannot read properties of undefined (reading 'getChainId')"
**Solution:** MetaMask is not connected. Follow Steps 1-4 above.

### Error: "RPC endpoint returned too many errors"
**Solution:** 
1. Check if Hardhat node is running (should see logs in terminal)
2. Verify MetaMask RPC URL is `http://127.0.0.1:8545`
3. Verify Chain ID is `1337`

### Error: "wallet_requestPermissions already pending"
**Solution:** 
1. Open MetaMask
2. Check if there's a pending connection request
3. Either approve or reject it
4. Refresh the page

### Error: "Contract not found on chainId"
**Solution:**
1. Make sure you've deployed the contract (check backend terminal for deployment logs)
2. Ensure MetaMask is on Chain ID `1337`
3. Check that `client/src/deployments.json` has the correct contract address

### Network Mismatch
If you see a "Wrong Network" message:
1. Open MetaMask
2. Switch to **"Hardhat Local"** network (Chain ID 1337)
3. Refresh the page

### Reset Everything
If nothing works:
1. **Stop all processes** (Ctrl+C in terminals)
2. **Reset MetaMask**: Settings → Advanced → Reset Account
3. **Restart Hardhat node**: `cd backend && npm run node`
4. **Redeploy contract**: `cd backend && npm run deploy:local`
5. **Restart frontend**: `cd client && npm run dev`
6. **Re-import the owner account** in MetaMask
7. **Refresh browser** and connect MetaMask

## 📚 Using the Application

Once MetaMask is connected:

1. **Register Roles** - Add participants (only owner can do this)
   - Navigate to "Register Roles"
   - Add addresses for Suppliers, Manufacturers, Distributors, Retailers

2. **Order Materials** - Create new product orders (only owner)
   - Go to "Order Materials"
   - Fill in product details and submit

3. **Supply Chain Flow** - Progress products through stages
   - Each role advances products to the next stage
   - Switch MetaMask accounts to test different roles

4. **Track Materials** - View product journey
   - Enter product ID to see its complete history
   - Generate QR codes for tracking

## 🎯 Success Indicators

You'll know everything is working when:
- ✅ MetaMask shows "Connected" with your address
- ✅ No console errors about RPC or getChainId
- ✅ The app displays blockchain data (product counts, etc.)
- ✅ You can click buttons without "wallet not connected" errors

## 🆘 Still Having Issues?

1. Check that Hardhat node is running (look for "Started HTTP and WebSocket JSON-RPC server" message)
2. Verify contract deployment succeeded (check for "SupplyChain deployed to: 0x..." message)
3. Make sure browser console shows no MetaMask errors
4. Try a different browser or incognito mode
5. Check that no firewall is blocking localhost connections
