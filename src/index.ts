import express from "express";
import expressWS from "express-ws";
import cors from "cors";
import { deleteCounterStrikeData, deleteRocketLeagueData, events, getCounterStrikeData, getMessages, getRocketLeagueData, sendMessage, updateCounterStrikeData, updateRocketLeagueData } from "./api";

(async () => {
    const baseApp = express();

    baseApp.use(cors({ origin: "*" }));

    const app = expressWS(baseApp).app;

    app.get("/messages", async (req, res) => {
        try {
            const messages = await getMessages();
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error retrieving messages:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/rl", express.json(), async (req, res) => {
        try {
            await updateRocketLeagueData(req.body);
            res.status(200).send("OK");
        } catch (error) {
            console.error("Error handling rocket league request:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get("/rl", async (req, res) => {
        try {
            res.status(200).json(await getRocketLeagueData());
        } catch (error) {
            console.error("Error handling rocket league GET request:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.delete("/rl", async (req, res) => {
        try {
            await deleteRocketLeagueData();
            res.status(200).send("OK");
        } catch (error) {
            console.error("Error handling rocket league DELETE request:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/cs", express.json(), async (req, res) => {
        try {
            await updateCounterStrikeData(req.body);
            res.status(200).send("OK");
        } catch (error) {
            console.error("Error handling counter strike request:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get("/cs", async (req, res) => {
        try {
            res.status(200).json(await getCounterStrikeData());
        } catch (error) {
            console.error("Error handling counter strike GET request:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.delete("/cs", async (req, res) => {
        try {
            await deleteCounterStrikeData();
            res.status(200).send("OK");
        } catch (error) {
            console.error("Error handling counter strike DELETE request:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.ws("/ws", (ws) => {
        ws.on('message', (message) => {
            try {
                const { type, data } = JSON.parse(message.toString());
                if (!type || !data) {
                    console.error('Invalid message format:', message.toString());
                    return;
                }
                switch (type) {
                    case 'message': {
                        const { content, user } = data;
                        sendMessage(content, user);
                        break;
                    }
                    case 'ping': {
                        const { user } = data;
                        events.emit('ping', { user });
                        break;
                    }
                    default:
                        console.error('Unknown message type:', type);
                }
            } catch (error) {
                console.error('Error handling WebSocket message:', error);
            }
        });
        events.on('message', (msg) => {
            ws.send(JSON.stringify({ type: 'message', data: msg }));
        });
        events.on('ping', (ping) => {
            ws.send(JSON.stringify({ type: 'ping', data: ping }));
        });


        events.on('rl', (data) => {
            ws.send(JSON.stringify({ type: 'rl', data: data }));
        });
        events.on('cs', (data) => {
            ws.send(JSON.stringify({ type: 'cs', data: data }));
        });
    });

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });

})();