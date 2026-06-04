import dotenv from "dotenv";
dotenv.config();

import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Fix paths en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Variables de entorno
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Servir frontend
app.use(express.static(path.join(__dirname, "public")));

// ✅ Configuración de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: user,
    pass: pass
  }
});

// ✅ Endpoint principal
app.post("/send", async (req, res) => {
  const { name, email, brief } = req.body;

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: user, // te llega a ti
      subject: "🔥 Nuevo Brief Maestro",
      text: `
Nombre: ${name}
Correo: ${email}

---------------------------------

${brief}
      `
    });

    console.log("✅ Correo enviado");

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("❌ Error enviando correo:", err);
    res.status(500).json({ success: false });
  }
});

// ✅ IMPORTANTE: fallback para frontend (evita 404)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Puerto dinámico (Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});
