// RUOLO PROXY
// Processo Node.js lanciato su EC2 utilizzato come proxy per far fare le chiamate al API gw REST alla EC2
// e non al browser client (non sarebbe riconosciuto dal dominio di AWS)
// Il processo serve anche a definire dinamicamente URL API GW rest.

// Tramite SDK ottengo ID del gateway rest
const AWS = require("aws-sdk");
const express = require("express");
const fetch = require("node-fetch"); // assicurati versione 2.x

// Configura regione AWS
AWS.config.update({ region: "eu-central-1" });

// Client API Gateway (REST API v1)
const apigateway = new AWS.APIGateway();

// Funzione per ottenere ID REST API per nome
async function getRestApiId(apiName) {
  const response = await apigateway.getRestApis().promise();
  const api = response.items.find(item => item.name === apiName);

  if (!api) throw new Error(`API con nome "${apiName}" non trovata`);
  return api.id;
}

// Funzione per costruire URL completo
async function getLambdaUrl() {
  const apiId = await getRestApiId("my_private_api");
  const stage = "prod";
  const region = "eu-central-1";
  return `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`;
}

// Avvio proxy Express
(async () => {
  try {
    const lambdaUrl = await getLambdaUrl();
    console.log("Lambda URL:", lambdaUrl);

    const app = express();

    // Middleware CORS (utile per chiamate browser)
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    // Proxy tutte le chiamate /api/* verso la REST API
    app.use("/api", express.json(), async (req, res) => {
      try {
        const path = req.url.replace(/^\/api/, ""); // rimuove /api dal path
        const apiUrl = lambdaUrl + path;

        console.log(`${req.method} ${req.url} -> ${apiUrl}`);
        console.log("Body in ingresso:", req.body);

        // Copia headers tranne host
        const { host, ...forwardHeaders } = req.headers;

            // Prepara il body solo per metodi che lo usano
        const fetchOptions = {
          method: req.method,
          headers: forwardHeaders
        };

        if (req.method !== "GET" && req.body) {
          fetchOptions.body = JSON.stringify(req.body);
        }

        const apiResponse = await fetch(apiUrl, fetchOptions);

        // Log risposta raw per debug
        const text = await apiResponse.text();
        console.log("Risposta API:", text);

        // Tenta di fare JSON
        try {
          res.status(apiResponse.status).json(JSON.parse(text));
        } catch {
          res.status(apiResponse.status).send(text);
        }

        // const apiResponse = await fetch(apiUrl, {
        //   method: req.method,
        //   headers: forwardHeaders
        // });

        // const data = await apiResponse.json();
        // res.status(apiResponse.status).json(data);

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });

    app.listen(3000, () => console.log("Proxy server running on port 3000"));

  } catch (err) {
    console.error("Errore inizializzazione proxy:", err);
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