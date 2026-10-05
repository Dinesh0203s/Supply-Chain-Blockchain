# 🚨 Quick Fix Guide - "Network or wallet connection issue"

## ⚡ IMMEDIATE ACTIONS (Do these first!)

### 1. Check if MetaMask is Installed
- Look for the **MetaMask fox icon** in your browser toolbar
- **Not there?** → Install from https://metamask.io/download/

### 2. Open MetaMask
- Click the MetaMask icon
- Do you see a wallet with accounts?
  - **NO** → Create a new wallet or import one
  - **YES** → Continue to step 3

### 3. Check MetaMask Connection Status
Look at the top of the web page (http://localhost:3001):
- You should now see a **Connection Diagnostic Box** in the bottom-right corner
- It will show exactly what's wrong

### 4. Common Issues and Fixes

#### ❌ Issue: "MetaMask Connected" shows ✗
**Fix:**
1. Look for a "Connect" button in the diagnostic box
2. Click it
3. OR click the MetaMask icon → Select accounts → Connect

#### ❌ Issue: "Correct Network (1337)" shows ✗  
**Fix:**
1. Look for a "Switch" button in the diagnostic box
2. Click it
3. If that doesn't work:
   - Open MetaMask
   - Click network dropdown (top left)
   - Look for "Hardhat Local" or "Chain ID 1337"
   - If not there, click "Add network" and enter:
     ```
     Network Name: Hardhat Local
     RPC URL: http://127.0.0.1:8545
     Chain ID: 1337
     Currency Symbol: ETH
     ```
   - Click Save
   - Switch to this network

#### ❌ Issue: "RPC Connection" shows ✗
**Fix:** Hardhat node might not be running
1. Check your terminal where you ran `npm run node`
2. You should see "Started HTTP and WebSocket JSON-RPC server"
3. If not running, restart it:
   ```bash
   cd backend
   npm run node
   ```

## 🔄 If Nothing Works - Nuclear Option

Do this in order:

1. **Stop everything:**
   - Close all terminal windows running the project
   - Close your browser

2. **Restart Hardhat Node:**
   ```bash
   cd backend
   npm run node
   ```
   Wait for "Started HTTP and WebSocket JSON-RPC server"

3. **Redeploy Contract** (in a new terminal):
   ```bash
   cd backend
   npm run deploy:local
   ```
   You should see "SupplyChain deployed to: 0x..."

4. **Restart Frontend** (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```
   Wait for "Ready" message

5. **Reset MetaMask:**
   - Open MetaMask
   - Settings → Advanced → Clear activity tab data
   - OR Settings → Advanced → Reset account

6. **Clear Browser Cache:**
   - Press `Ctrl + Shift + Delete` (Windows)
   - Select "Cached images and files"
   - Clear data

7. **Reopen Browser:**
   - Go to http://localhost:3001
   - Check the Connection Diagnostic box
   - Follow any remaining instructions

## 📋 Checklist - Everything Must Show ✓

In the Connection Diagnostic box (bottom-right), verify:
- ✓ MetaMask Installed
- ✓ MetaMask Connected
- ✓ Correct Network (1337)
- ✓ RPC Connection
- ✓ Contract Deployed

When all show ✓, you're ready to use the app!

## 🆘 Still Not Working?

Check these terminal outputs:

### Backend Terminal (Hardhat Node):
Should show:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### Frontend Terminal:
Should show:
```
✓ Ready in X.Xs
- Local: http://localhost:3001
```

### Browser Console (F12):
Should NOT show:
- "Cannot read properties of undefined"
- "RPC endpoint returned too many errors"

If you see these errors, MetaMask is not connected. Use the diagnostic box!

## 💡 Pro Tips

1. **Use the Right Account:** 
   - Import the owner account for full access
   - Private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

2. **Watch the Diagnostic Box:**
   - It updates every 3 seconds
   - Shows exactly what to fix

3. **Check Hardhat Logs:**
   - Every blockchain request appears in the backend terminal
   - If you don't see logs, MetaMask isn't reaching the node

## 🎯 Success Indicators

You know it's working when:
- ✅ No error messages in the diagnostic box
- ✅ All status checks show green ✓
- ✅ You see "🎉 All systems ready!"
- ✅ The app displays actual data (product counts, etc.)
- ✅ You can interact with buttons without errors
