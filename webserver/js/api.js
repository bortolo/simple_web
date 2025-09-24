
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

let action = null;

// intercetta il click sui bottoni
document.querySelectorAll('#dataForm button[type="submit"]').forEach(btn => {
  btn.addEventListener('click', e => {
    action = e.target.value; // salva quale bottone è stato cliccato
  });
});

// Bottone per generare grafici
document.getElementById("dataForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  // Controllo se ci sono campi vuoti
  let empty = false;
  formData.forEach((value, key) => {
    if (value.trim() === "") {
      empty = true;
    }
  });

  if (empty) {
    alert("Per favore, compila tutti i campi del form prima di inviare.");
    return; // esce dalla funzione, non fa fetch
  }
console.log(action)
  const data = {};
  formData.forEach((value, key) => {
    if (key !== "action") data[key] = value; // escludo "action" dai dati
  });

  try {
console.log(action)
        if (action === "save") {
      // chiamata API per save
      const response = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // mostro anche un messaggio testuale
      document.getElementById("result").innerText = "✅ Risultato save: " + JSON.stringify(result.message);

    } else if (action === "graph"){

    const response = await fetch("/api/graph", {
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
    document.getElementById("result").innerText = "✅ Dati ricevuti, creo grafico e calcolo risultati...";

    // plotto con Plotly
    Plotly.newPlot("grafico_1", figData.figA.data, figData.figA.layout);
    Plotly.newPlot("grafico_2", figData.figB.data, figData.figB.layout);
    Plotly.newPlot("grafico_3", figData.figC.data, figData.figC.layout);
    Plotly.newPlot("grafico_4", figData.figD.data, figData.figD.layout);
    document.getElementById("npv").innerText = "Net Present Value (NPV): " + Number(figData.npv).toFixed(2);
    document.getElementById("tv").innerText = "Terminal Value (TV): " + Number(figData.tv).toFixed(2);
  }} catch (err) {
    document.getElementById("result").innerText = "❌ Errore: " + err.message;
  }
});