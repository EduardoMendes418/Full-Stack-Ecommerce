import "dotenv/config.js";
import Fastify from "fastify";
import Clerk from "@clerk/fastify";
import cors from "@fastify/cors";

const fastify = Fastify();

fastify.register(Clerk.clerkPlugin, {
  secretKey: process.env.CLERK_SECRET_KEY!,
});

fastify.register(cors, {
  origin: ["http://localhost:3002"],
  credentials: true,
});

fastify.get("/health", (request, reply) => {
  return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timeStamp: Date.now(),
  });
});

fastify.get("/test", (request, reply) => {
  const { userId } = Clerk.getAuth(request);

  if (!userId) {
    return reply.send({ message: "You are not logged in!" });
  }
  return reply.send({ message: "Order service is authenticated!" });
});

fastify.get("/auths/product-page", async (request, reply) => {
  try {
    const { userId } = Clerk.getAuth(request);

    if (!userId) {
      return reply.status(401).send({ message: "❌ Não logado" });
    }

    console.log("User ID:", userId);

    return reply.send({
      message: "✅ Order Service autenticado",
      userId,
    });
  } catch (err) {
    console.error("❌ Erro no Order Service:", err);
    return reply.status(500).send({ message: "Erro interno do Order Service" });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 8001 });
    console.log("✅ Order Service is running on port 8001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
