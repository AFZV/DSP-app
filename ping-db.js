// ping-db.js
const { Client } = require("pg");

const client = new Client({
  connectionString:
    "postgresql://vendedores_goh_DB_owner:npg_qpyo06KtWvGX@ep-flat-truth-a50v0npd-pooler.us-east-2.aws.neon.tech/vendedores_goh_DB?sslmode=require",
});

async function keepAlive() {
  try {
    await client.connect();
    console.log("Conectado a la base de datos.");

    setInterval(async () => {
      try {
        await client.query("SELECT 1");
        console.log("Ping enviado: la base de datos sigue despierta.");
      } catch (err) {
        console.error("Error durante ping:", err.message);
      }
    }, 4 * 60 * 1000); // Cada 4 minutos
  } catch (err) {
    console.error("Error de conexión:", err.message);
  }
}

keepAlive();
