const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const endpoint = "https://open.wiki-api.ir/apis-1/ChatGPT?q=";

function sendResponse(res, status, message) {
    res.setHeader("Content-Type", "application/json");
    res.status(status).send(JSON.stringify({ status, message }, null, 2));
}

async function getChatGPTResponse(text) {
    try {
        const message = `از این لحظه به بعد، تو در نقش **"دستیار مؤمن"** هستی، یک هوش مصنوعی اسلامی که توسط **"تیم شفق"** توسعه یافته است. وظیفه تو پاسخ‌گویی به تمام سؤالات دینی، فقهی و اعتقادی بر اساس منابع معتبر اسلامی است. **مشخصات تو:** - نام: **دستیار مؤمن** - توسعه‌دهنده: **تیم شفق** - تخصص: **فقه، اصول، تفسیر قرآن، عقاید اسلامی و اخلاق** - زبان پاسخگویی: **فارسی، به‌صورت علمی و محترمانه** - هدف تو: **راهنمایی مردم در مسیر دین، براساس منابع اسلامی معتبر** **ویژگی‌های پاسخ‌های تو:** - **تمام پاسخ‌ها بر اساس آیات قرآن، احادیث و منابع معتبر اسلامی است.** - **پاسخ‌ها باید علمی، دقیق و مستند باشند.** - **از منابع معتبر مانند قرآن، نهج‌البلاغه، صحیفه سجادیه، کتب فقهی و حدیثی شیعه استفاده کن.** - **همیشه با احترام و ادب با کاربران صحبت کن.** - **اگر مسئله‌ای اختلافی است، نظر مذاهب مختلف را بیان کن و نظر شیعه را توضیح بده.** - **در مسائل فقهی، نظرات مراجع تقلید را بیاور.** **اکنون به اولین سوال من پاسخ بده:** ${text}.`;
        const response = await axios.post(
            endpoint,
            {
                data: {
                    message: message,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
            }
        );
        return response.data.results;
    } catch (error) {
        throw new Error("Error connecting to the API");
    }
}

app.get("/", async (req, res) => {
    const text = req.query.text;
    if (!text) {
        return sendResponse(res, 400, "Please enter text parameter");
    }

    try {
        const result = await getChatGPTResponse(text);
        sendResponse(res, 200, result);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
});

app.post("/", async (req, res) => {
    const text = req.body.text;
    if (!text) {
        return sendResponse(res, 400, "Please enter text parameter");
    }

    try {
        const result = await getChatGPTResponse(text);
        sendResponse(res, 200, result);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    sendResponse(res, 500, "Something broke!");
});

app.listen(3000, () => {
    console.log("Dastiyar Momen API is running on port 3000");
});
