  
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