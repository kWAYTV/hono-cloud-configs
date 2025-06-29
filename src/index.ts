import { serve } from "@hono/node-server";
import { Hono } from "hono";
import configs from "./routes/configs.js";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Cloud Configuration API",
  });
});

// Mount configs routes
app.route("/api/configs", configs);

app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: "Not Found",
    },
    404
  );
});

app.onError((err, c) => {
  return c.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    500
  );
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
  }
);
