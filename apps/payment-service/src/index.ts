import "dotenv/config.js";
import { serve } from "@hono/node-server";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";

const app = new Hono();

app.use('*', clerkMiddleware())
app.use("*", async (c, next) => {
  const res = c.res;
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3002");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type"
  );
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (c.req.method === "OPTIONS") {
    return c.text("OK", 200);
  }

  await next();
});

app.get("/auths/product-page", async (c) => {
  try {
    const auth = getAuth(c);
    if (!auth || !auth.userId) {
      return c.json({ message: "❌ Você não está logado" }, 401);
    }

    console.log("✅ User ID:", auth.userId);

    return c.json({
      message: "✅ Payment service autenticado",
      userId: auth.userId,
    });
  } catch (err) {
    console.error("❌ Erro no Payment Service:", err);
    return c.json({ message: "Erro interno do Payment Service" }, 500);
  }
});

const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      () => {
        console.log(`✅ Payment service is running on port 8002`);
      }
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
