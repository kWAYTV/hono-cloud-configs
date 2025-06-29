import { serve } from "@hono/node-server";
import { Hono } from "hono";
import configs from "./routes/configs.js";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "🚀 Cloud Configuration System API",
    version: "1.0.0",
    endpoints: {
      configs: "/api/configs",
    },
  });
});

// Mount configs routes
app.route("/api/configs", configs);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
    console.log(`📚 API Documentation: http://localhost:${info.port}/`);
  }
);
