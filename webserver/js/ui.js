  
  // Popola dinamicamente le righe della tabella
  const tbody = document.getElementById("table-body");
  for (let i = 1; i <= 5; i++) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border border-gray-300 p-2">Anno ${i}</td>
      <td class="border border-gray-300 p-2"><input type="number" name="rev_${i}" step="0.01" min="0" class="w-full border rounded p-1"></td>
      <td class="border border-gray-300 p-2"><input type="number" name="ebitda_${i}" step="0.01" min="0" max="1" class="w-full border rounded p-1"></td>
      <td class="border border-gray-300 p-2"><input type="number" name="cpx_${i}" step="0.01" min="0" class="w-full border rounded p-1"></td>
    `;
    tbody.appendChild(tr);
  }

  const listEl = document.getElementById("list");

  function renderList(items) {
    if (!items.length) { listEl.innerHTML = "<i>nessuno scenario</i>"; return; }
    listEl.innerHTML = "";
    items.forEach(it => {
      const row = document.createElement("div");
      row.className = "scenario-row";
      row.innerHTML = `<div>
          <strong>${it.scenarioid}</strong><br/>
          name: ${it.name} — wacc:${it.wacc} - pgr:${it.pgr} - Adv. cashflow:${it.cf_adv}
        </div>`;
      listEl.appendChild(row);
    });

    // attach click
    Array.from(listEl.querySelectorAll("button")).forEach(b=>{
      b.addEventListener("click", async (ev)=>{
        const id = ev.target.dataset.id;
        const ver = ev.target.dataset.ver;
        //await loadScenario(id, ver);
      });
    });
}