import express from 'express';
import { WebSocketServer } from 'ws';
import path from 'path';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse URL-encoded bodies & JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let currentPrice = 60;

// API to get the current price (fallback for non-WebSocket clients)
app.get('/get-price', async (req, res) => {
    try {
        const price = await fetchBitcoinPrice();
        res.send(`$${price}`);
    } catch (error) {
        res.status(500).send("Error fetching price");
    }
});

// Serve index.html at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// WebSocket Server for real-time updates
const server = app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

async function fetchBitcoinPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        return data.bitcoin.usd.toFixed(2);
    } catch (error) {
        console.error("⚠️ Error fetching Bitcoin price:", error);
        return currentPrice.toFixed(2);
    }
}

wss.on('connection', async (ws) => {
    console.log("🔥 New WebSocket connection");

    const sendPriceUpdate = async () => {
        const price = await fetchBitcoinPrice();
        ws.send(JSON.stringify({ price }));
    };

    sendPriceUpdate();
    const interval = setInterval(sendPriceUpdate, 2000);

    ws.on('close', () => {
        clearInterval(interval);
        console.log("❌ WebSocket connection closed");
    });
});
