// Educational sequences only. No recordings, fitted states or participant data.
const sequences = {
  grouped: [...Array(8).fill('A'), ...Array(8).fill('B'), ...Array(8).fill('C')],
  alternating: Array.from({length: 24}, (_, i) => ['A', 'B', 'C'][i % 3])
};
const bins = sequence => sequence.map(state => `<span class="state-bin state-${state}" aria-hidden="true"></span>`).join('');
const switches = sequence => sequence.slice(1).filter((state, i) => state !== sequence[i]).length;
export function stateExplorer() {
  return `<section class="concept-explorer state-explorer" aria-labelledby="state-title">
    <p class="eyebrow">A visual explanation</p><h2 id="state-title">Time spent, and time ordered.</h2>
    <p>Two made-up sequences can spend equal time in each state while switching very differently. This distinction helps explain why state occupancy and temporal dynamics answer different questions.</p>
    <div class="view-switch" role="group" aria-label="Illustrative state sequence"><button data-state="grouped" aria-pressed="true">Longer visits</button><button data-state="alternating" aria-pressed="false">Frequent switching</button></div>
    <div class="state-chart"><p class="state-axis">Illustrative sequence · time →</p><div class="state-sequence" role="img" aria-label="Synthetic sequence: eight visits to A, then eight to B, then eight to C.">${bins(sequences.grouped)}</div>
    <div class="state-legend"><span><i class="state-A"></i>State A · 8 bins</span><span><i class="state-B"></i>State B · 8 bins</span><span><i class="state-C"></i>State C · 8 bins</span></div>
    <p class="state-summary" aria-live="polite">Equal occupancy: 8 of 24 time bins per state. State changes: 2.</p></div>
    <p class="figure-note">Synthetic teaching example. These are invented labels and sequences, unrelated to fitted project states or experimental results. A model-defined state requires interpretation in its research context.</p>
  </section>`;
}
export function bindStateExplorer() {
  const chart = document.querySelector('.state-explorer');
  if (!chart) return;
  chart.querySelectorAll('[data-state]').forEach(button => button.addEventListener('click', () => {
    const sequence = sequences[button.dataset.state];
    chart.querySelectorAll('[data-state]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const view = chart.querySelector('.state-sequence');
    view.innerHTML = bins(sequence);
    view.setAttribute('aria-label', `Synthetic sequence: ${sequence.join(', ')}.`);
    chart.querySelector('.state-summary').textContent = `Equal occupancy: 8 of 24 time bins per state. State changes: ${switches(sequence)}.`;
  }));
}
