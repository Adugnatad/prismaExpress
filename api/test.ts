import express from "express";

const app = express();

app.get("/new", (req, res) => {
  res.send("vercel api");
});

module.exports = app;
