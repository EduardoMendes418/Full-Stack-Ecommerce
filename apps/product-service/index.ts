import express, { Request, Response } from "express";
import cors from "cors";
import 'dotenv/config'
import { requireAuth } from "@clerk/express";
import { clerkMiddleware } from '@clerk/express'

const app = express();

app.use(cors({ origin: ["http://localhost:3002", "http://localhost:3003"], credentials: true }));
app.use(express.json());
app.use(clerkMiddleware())

declare global {
  namespace Express {
    interface Request {
      auth?: any;
    }
  }
}

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

app.get("/auths/product-page", requireAuth(), (req, res) => {
  const auth = req.auth(); 
  console.log("User ID:", auth.userId);

  res.json({
    message: "Rota protegida acessada",
    userId: auth.userId,
  });
});

app.listen(8000, () => console.log("✅ Backend rodando na porta 8000"));
