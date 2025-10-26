import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import voice from "elevenlabs-node";
import express from "express";
import { promises as fs } from "fs";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY || "";
//const voiceID = "gD1IexrzCvsXPHUuT0s3";
const voiceID = "zGjIP4SZlMnY9m93k97r";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  await execCommand(
    `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
  );
  await execCommand(
    `./bin/rhubarb -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`
  );
};

function numeroAPalabras(numero) {
  const unidades = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];
  const decenas = ["", "", "veinte", "treinta"];

  if (numero < 20) {
    return unidades[numero];
  } else if (numero < 100) {
    let unidad = numero % 10;
    let decena = Math.floor(numero / 10);
    return decenas[decena] + (unidad > 0 ? " y " + unidades[unidad] : "");
  } else {
    return numero.toString();
  }
}

app.post("/chat", async (req, res) => {
  let userMessage = req.body.message;
  let previousMessage = userMessage;

  console.log("Received:", req.body);
  console.log(`User message: ${userMessage}`);

  const validNames = ["Santiago", "José", "Karla", "Gael", "Jose", "Carla"];
  const foundName = validNames.find(name => userMessage.toLowerCase().includes(name.toLowerCase()));
  if (foundName) {
    userMessage = `Say only the following: “Welcome, ${foundName}. Please support me by entering your monthly income and pressing the checkmark button.”`;
  }

  const incomeRegex = /income.*?(\d{1,3}(?:[,\.\s]?\d{3})*(?:\.\d+)?)/i;
  const incomeMatch = userMessage.match(incomeRegex);
  if (incomeMatch) {
    const incomeAmount = incomeMatch[1].replace(/[,\s]/g, "");
    userMessage = `Say only the following: "That's a solid income of $${incomeAmount}, now let's organize your budget in 3 categories: Home, Leisure and Food. How much would you like to allocate to each?"`;
  }

  const budgetRegex = /(home|leisure|food)\s+([\d,.\s]+)/gi;
  const budgetMatch = userMessage.match(budgetRegex);
  if (budgetMatch) {
    const regex = /(home|leisure|food)\s+([\d,.\s]+)/gi;
    const budgets = {
      home: "0",
      leisure: "0",
      food: "0",
    };
    let match;

    while ((match = regex.exec(userMessage)) !== null) {
      const category = match[1].toLowerCase();
      const value = match[2].replace(/[,\s]/g, "");
      budgets[category] = value;
    }
    console.log("Parsed budgets:", budgets);
    const home = budgets.home;
    const leisure = budgets.leisure;
    const food = budgets.food;
    userMessage = `Say only the following: "Here is your budget breakdown: Home $${home}, Leisure $${leisure}, Food $${food}. That's a fantastic start! now please enter your expenses in each category."`;
  }



  const numbersToWords = {
    "00": "",
    "01": "una",
    "02": "dos",
    "03": "tres",
    "04": "cuatro",
    "05": "cinco",
    "06": "seis",
    "07": "siete",
    "08": "ocho",
    "09": "nueve",
    "10": "diez",
    "11": "once",
    "12": "doce",
    "13": "una",
    "14": "dos",
    "15": "tres",
    "16": "cuatro",
    "17": "cinco",
    "18": "seis",
    "19": "siete",
    "20": "ocho",
    "21": "nueve",
    "22": "diez",
    "23": "once",
    "30": "y media",
  };

  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const systemMessage = `
You are a great assistant named Omnia who helps young people with their finances and make better decisions.
You will always respond with a JSON array of messages.
Each message has a text property, facial expression, and animation.
The different facial expressions are: smile.
The different animations are: Talking_0.
`;

  const fullPrompt = `${systemMessage}\nUsuario: ${userMessage || "Hello"}`;

  const completion = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    temperature: 0.6,
    maxOutputTokens: 1000,
    candidateCount: 1,
    contents: [
      {
        contentType: "text",
        text: fullPrompt,
      },
    ],
  });

  let rawText = completion.candidates[0].content.parts[0].text;
  console.log("Gemini completion raw text:", rawText);

  if (rawText.startsWith("```")) {
    const firstNewline = rawText.indexOf("\n");
    if (firstNewline !== -1) {
      rawText = rawText.slice(firstNewline + 1);
    } else {
      rawText = rawText.slice(3);
    }
  }
  if (rawText.endsWith("```")) {
    rawText = rawText.slice(0, -3);
  }
  const cleanedText = rawText.trim();

  let messages = JSON.parse(cleanedText);

  if (messages.messages) {
    messages = messages.messages;
  }

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const fileName = `audios/message_${i}.mp3`;
    const textInput = message.text;
    await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, textInput);
    await lipSyncMessage(i);
    message.audio = await audioFileToBase64(fileName);
    message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
  }

  res.send({ messages });
});

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

app.listen(port, () => {
  console.log(`Omnia listening on port ${port}`);
});
