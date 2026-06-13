const mineflayer = require('mineflayer');
const express = require('express');

const botArgs = {
    host: 'Mohtasebandsawalmeh.aternos.me',
    port: 54622,
    username: 'AFK_Bot_24',
    version: '1.21.5'
};

let bot;
let isConnected = false;
let reconnectCount = 0;
let connectedAt = null;
const startedAt = new Date();

function initBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('login', () => {
        isConnected = true;
        connectedAt = new Date();
        console.log(`[${new Date().toLocaleTimeString()}] Bot logged in successfully!`);
    });

    bot.on('spawn', () => {
        console.log("Bot spawned and ready.");
        setInterval(() => {
            if (!bot) return;
            const yaw = Math.random() * Math.PI * 2;
            bot.look(yaw, 0, true);
            bot.setControlState('forward', true);
            setTimeout(() => {
                bot.setControlState('forward', false);
            }, 500);
        }, 30000);
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        if (message.includes('/register')) {
            bot.chat('/register Bot123456 Bot123456');
        } else if (message.includes('/login')) {
            bot.chat('/login Bot123456');
        }
    });

    bot.on('end', () => {
        isConnected = false;
        connectedAt = null;
        reconnectCount++;
        console.log(`[${new Date().toLocaleTimeString()}] Bot disconnected! Reconnecting in 45s...`);
        setTimeout(initBot, 45000);
    });

    bot.on('error', (err) => {
        console.log('Error: ', err);
    });
}

initBot();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running 24/7!'));

app.get('/status', (req, res) => {
    const now = new Date();
    const uptimeSeconds = Math.floor((now - startedAt) / 1000);
    const connectedForSeconds = connectedAt
        ? Math.floor((now - connectedAt) / 1000)
        : null;

    res.json({
        status: isConnected ? 'connected' : 'disconnected',
        username: botArgs.username,
        server: `${botArgs.host}:${botArgs.port}`,
        uptime_seconds: uptimeSeconds,
        connected_for_seconds: connectedForSeconds,
        reconnect_count: reconnectCount,
        started_at: startedAt.toISOString(),
    });
});

app.listen(port, () => console.log(`Web server ready on port ${port}`));
