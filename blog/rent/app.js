// Calculate entropy for a probability distribution
function calculateEntropy(probs) {
    return -probs.reduce((sum, p) => p > 0 ? sum + p * Math.log(p) : sum, 0);
  }
  
  // Update calculations dynamically
  function updateCalculations() {
    const rows = document.querySelectorAll('.prob-row');
    let cumulativeEntropy = 0;
  
    rows.forEach(row => {
      const inputs = row.querySelectorAll('input');
      const probs = Array.from(inputs).map(input => parseFloat(input.value) || 0);
      const entropy = calculateEntropy(probs).toFixed(3);
      const reward = (-entropy).toFixed(3);
  
      row.querySelector('.entropy').textContent = entropy;
      row.querySelector('.reward').textContent = reward;
  
      cumulativeEntropy += parseFloat(entropy);
    });
  
    const averageReward = (-cumulativeEntropy / rows.length).toFixed(3);
    document.getElementById('averageReward').textContent = averageReward;
  
    MathJax.typesetPromise();
  }
  
  // Add new rows dynamically
  function addRow() {
    const tableBody = document.getElementById('probTable');
    const row = document.createElement('tr');
    row.classList.add('prob-row');
    row.innerHTML = `
    <td class="border px-4 py-2">${tableBody.children.length + 1}</td>
    <td class="border px-4 py-2">
      <input class="w-16 bg-[#101216] text-[#00ff88] border p-1" type="number" step="0.01" placeholder="0.0" />
      <input class="w-16 bg-[#101216] text-[#00ff88] border p-1" type="number" step="0.01" placeholder="0.0" />
      <input class="w-16 bg-[#101216] text-[#00ff88] border p-1" type="number" step="0.01" placeholder="0.0" />
    </td>
    <td class="border px-4 py-2 entropy">-</td>
    <td class="border px-4 py-2 reward">-</td>
  `;
    tableBody.appendChild(row);
  }
  
  // Initial setup
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('calculate').addEventListener('click', updateCalculations);
    document.getElementById('addRow').addEventListener('click', addRow);
  });
  