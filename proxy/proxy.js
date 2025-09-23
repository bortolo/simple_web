// Tramite SDK ottengo ID del gateway rest

const { APIGatewayClient, GetRestApisCommand } = require("@aws-sdk/client-apigateway");

async function getRestApiId(apiName) {
  const client = new APIGatewayClient({ region: "eu-central-1" });
  const command = new GetRestApisCommand({});
  const response = await client.send(command);

  const api = response.items.find(item => item.name === apiName);
  if (!api) throw new Error(`API con nome "${apiName}" non trovata`);

  return api.id;
}

// Funzione per ottenere l'URL completo della REST API
async function getLambdaUrl() {
  const apiId = await getRestApiId("private_api");
  const stage = "prod";
  const region = "eu-central-1";

  // Costruisci dinamicamente la URL
  return `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`;
}

// Uso della URL nelle altre funzioni
(async () => {
  try {
    const lambdaUrl = await getLambdaUrl();
    console.log("Lambda URL:", lambdaUrl);

    const express = require("express");
    const fetch = require("node-fetch");
    const app = express();

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

  } catch (err) {
    console.error(err);
  }
})();



// Metti qui il tuo Function URL (si potrebbe parametrizzare tra i vari stage e locale vs su aws)
// const lambdaUrl = "https://ywkvlbnnoh.execute-api.eu-central-1.amazonaws.com"+"/prod"; // VPC endpoint (attenzione che per renderlo ID indipendent bisogna creare cetificato custom)


// const express = require("express");
// const fetch = require("node-fetch");
// const app = express();

// app.use("/api", async (req, res) => {
//   try {
//     const path = req.url;
//     const apiUrl = lambdaUrl + path;

//     const apiResponse = await fetch(apiUrl, {
//       method: req.method,
//       headers: req.headers
//     });

//     const data = await apiResponse.json();
//     res.status(apiResponse.status).json(data);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(3000, () => console.log("Proxy server running on port 3000"));