   // Popola dinamicamente le righe della tabella
  const tbody = document.getElementById("table-body");
  for (let i = 1; i <= 5; i++) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border border-gray-300 p-2">Anno ${i}</td>
      <td class="border border-gray-300 p-2"><input type="number" name="varA_${i}" class="w-full border rounded p-1"></td>
      <td class="border border-gray-300 p-2"><input type="number" name="varB_${i}" class="w-full border rounded p-1"></td>
      <td class="border border-gray-300 p-2"><input type="number" name="varC_${i}" class="w-full border rounded p-1"></td>
    `;
    tbody.appendChild(tr);
  }
 
// Chiamate API al backend ========================

 // Metti qui il tuo Function URL (si potrebbe parametrizzare tra i vari stage e locale vs su aws)
    const lambdaUrl = "https://ajx89qr9d6.execute-api.eu-central-1.amazonaws.com"+"/prod"; // VPC endpoint (attenzione che per renderlo ID indipendent bisogna creare cetificato custom)

    const express = require("express");
const fetch = require("node-fetch");
const app = express();

// Proxy generico per poter far fare le chiamate private al VPCe alla EC2 e non al browser client
app.use("/api", async (req, res) => {
  try {
    // Ricostruisco l'URL completo per la REST API privata
    const path = req.url; // es. /status o /another/path
    const apiUrl = lambdaUrl + path;

    // Chiamata verso API Gateway
    const apiResponse = await fetch(apiUrl, {
      method: req.method,
      headers: req.headers // puoi filtrare se vuoi
    });

    const data = await apiResponse.json();
    res.status(apiResponse.status).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Proxy server running on port 3000"));


// Bottone per verificare se API status OK
document.getElementById("btnAltro").addEventListener("click", async () => {
  try {
    const response = await fetch("/api/status", {
      method: "GET",                       
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();

    // Aggiorno il div con la risposta della Lambda
    document.getElementById("lambda-message").innerText = "✅ Risultato API: " + JSON.stringify(result.message);
  } catch (err) {
    document.getElementById("lambda-message").innerText = "❌ Errore API: " + err.message;
  }
});

// Bottone per generare grafici
document.getElementById("dataForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = Number(value); // converto in numero
  });

  try {
    const response = await fetch("api/graph", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Errore nella richiesta");
    }

    // assumiamo che la Lambda risponda in formato { data: [...], layout: {...} }
    const figData = await response.json();

    // mostro anche un messaggio testuale
    document.getElementById("result").innerText = "✅ Dati ricevuti, creo grafico...";

    // plotto con Plotly
    Plotly.newPlot("grafico_1", figData.figA.data, figData.figA.layout);
    Plotly.newPlot("grafico_2", figData.figB.data, figData.figB.layout);
    Plotly.newPlot("grafico_3", figData.figC.data, figData.figC.layout);
    Plotly.newPlot("grafico_4", figData.figD.data, figData.figD.layout);
    document.getElementById("npv").innerText = "NPV: " + figData.npv
    document.getElementById("tv").innerText = "TV: " + figData.tv
  } catch (err) {
    document.getElementById("result").innerText = "❌ Errore: " + err.message;
  }
});

