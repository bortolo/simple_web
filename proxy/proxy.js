const express = require("express");
const fetch = require("node-fetch");
const app = express();

// Metti qui il tuo Function URL (si potrebbe parametrizzare tra i vari stage e locale vs su aws)
const lambdaUrl = "https://ajx89qr9d6.execute-api.eu-central-1.amazonaws.com"+"/prod"; // VPC endpoint (attenzione che per renderlo ID indipendent bisogna creare cetificato custom)


app.use("/api", async (req, res) => {
  try {
    const path = req.url;
    const apiUrl = lambdaUrl + path;

    const apiResponse = await fetch(apiUrl, {
      method: req.method,
      headers: req.headers
    });

    const data = await apiResponse.json();
    res.status(apiResponse.status).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Proxy server running on port 3000"));