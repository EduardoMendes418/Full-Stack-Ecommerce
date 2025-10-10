"use client";
import 'dotenv/config.js';
import { useEffect, useState } from "react";
import {
  useAuth,
  UserButton,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";


export default function AuthenticationPage() {
  const { isSignedIn, userId, getToken } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const backendOrdersUrl = process.env.NEXT_PUBLIC_BACKEND_ORDERS_URL;

  useEffect(() => {
    if (!isSignedIn || !backendUrl || !backendOrdersUrl) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getToken();

        const productRes = await fetch(`${backendUrl}/auths/product-page`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const productJson = await productRes.json();

        const orderRes = await fetch(`${backendOrdersUrl}/auths/order-page`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const orderJson = await orderRes.json();

        setData({ product: productJson, order: orderJson });
      } catch (err) {
        console.error("❌ Erro ao buscar dados do backend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSignedIn, getToken, backendUrl, backendOrdersUrl]);

  if (!isSignedIn) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>❌ Você não está autenticado</h1>
        <SignInButton>
          <button
            style={{
              padding: "0.5rem 1rem",
              marginTop: "1rem",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🔐 Teste de Autenticação</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <p>
          <strong>User ID:</strong> {userId}
        </p>
        <UserButton />
        <SignOutButton>
          <button style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            Logout
          </button>
        </SignOutButton>
      </div>

      {loading && <p>Carregando dados do backend...</p>}

      {data && (
        <>
          <h2>Respostas dos Serviços:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
