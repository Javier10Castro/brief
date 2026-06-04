import dotenv from "dotenv";
dotenv.config();

import express from "express";
const nodemailer = require("nodemailer");
import cors from "cors";
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 CONFIGURAR GMAIL APP PASSWORD
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: user,
    pass: pass
  }
});

// 🚀 ENDPOINT PRINCIPAL
app.post("/send", async (req, res) => {
  const { name, email, brief } = req.body;

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "javiercastro9912@gmail.com",
      subject: "🔥 Nuevo Brief Maestro",
      text: `
Nombre: ${name}
Correo: ${email}

---------------------------------

${brief}
`
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

app.listen(3000, () => console.log("✅ Server running"));
