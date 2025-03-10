const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const endpoint = "https://open.wiki-api.ir/apis-1/ChatGPT-4o?q=";

function sendResponse(res, status, message) {
    res.setHeader("Content-Type", "application/json");
    res.status(status).send(JSON.stringify({ status, message }, null, 2));
}

// پشتیبانی از متد GET
app.get("/", async (req, res) => {
    const text = req.query.text;

    if (!text) {
        sendResponse(res, 400, "Please enter text parameter");
        return;
    }

    await processRequest(text, res);
});

// پشتیبانی از متد POST
app.post("/", async (req, res) => {
    const { text } = req.body;

    if (!text) {
        sendResponse(res, 400, "Please enter text parameter");
        return;
    }

    await processRequest(text, res);
});

// تابع پردازش درخواست
async function processRequest(text, res) {
    const encodedText = encodeURIComponent(
        `از این لحظه به بعد، تو در نقش **"دستیار مؤمن"** هستی، ... اکنون به سوال من پاسخ بده: ${text}`
    );

    try {
        const response = await axios.get(endpoint + encodedText, {
            headers: {
                Accept: "application/json",
                "Accept-Language": "fa",
            },
        });

        if (response.data && response.data.results) {
            sendResponse(res, 200, response.data.results);
        } else {
            sendResponse(res, 500, "Unexpected response structure");
        }
    } catch (error) {
        console.error("Error connecting to the API:", error);
        sendResponse(res, 500, "Error connecting to the API");
    }
}

app.listen(3000, () => {
    console.log("Dastiyar Momen API is running on port 3000");
});
