import express from "express";
import multer from "multer";
import * as fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const Router = express.Router();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const storage = multer.memoryStorage();
const upload = multer({ storage });

function fileToGenerativePart(fileBuffer : any , mimeType : any) {
  return {
    inlineData: {
      data: fileBuffer.toString("base64"),
      mimeType,
    },
  };
}

async function run(fileBuffer : any) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `Observe this image carefully and study each thing in detail and generate the code for the component present in this image in react and tailwind css make it as accurate as possible if there is any icons in the image add the CDN link of the similar icons present on the internet, notice the colors very carefully and add the appropriate color if there are any gradient colors add that too and notice the size of the margin and padding and add them properly as
     well , set the component name as App also center the component in the page`;

  const imageParts = [fileToGenerativePart(fileBuffer, "image/jpg")];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    throw new Error(`Error generating content: ${error}`);
  }
}

Router.post("/upload", upload.single("file"), async (req, res) => {
  console.log("desigtocode request received");

  if (!req.file) {
     res.status(400).send("No file uploaded.");
     return;
  }

  try {
    const fileBuffer = req.file.buffer;
    const result = await run(fileBuffer);
    res.send({ result });
  } catch (error) {
    res.status(500).send("Error processing file: " + error);
  }
});


export default Router;