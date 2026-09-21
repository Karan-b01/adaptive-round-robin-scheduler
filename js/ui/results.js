import { renderGanttChart } from './ganttChart.js';

export function renderResults(results, config, processes) {
  const { rr, arr } = results;
  const switchDifference = rr.contextSwitches - arr.contextSwitches;
  const waitingDifference = rr.averages.waiting - arr.averages.waiting;

  renderSummary(arr, switchDifference);
  renderComparison(rr, arr);
  renderFinding(config, processes, switchDifference, waitingDifference);
  renderConclusion(rr, arr, switchDifference, waitingDifference);
  renderEfficiency(arr, processes);
  renderAlgorithmResults(rr, arr, config);

  document.querySelector('#emptyState').classList.add('hidden');
  document.querySelector('#results').classList.remove('hidden');
}

function renderSummary(arr, switchDifference) {
  const switchDescription = switchDifference === 0
    ? 'the same number of'
    : switchDifference > 0 ? 'fewer' : 'more';

  document.querySelector('#summaryCards').innerHTML = `
    <div class="summary teal"><p class="summary-label">ADAPTIVE QUANTUM RULE</p><p class="summary-value">Median</p><p class="summary-note">Remaining bursts, bounded by your limits</p></div>
    <div class="summary"><p class="summary-label">CONTEXT SWITCH DIFFERENCE</p><p class="summary-value">${Math.abs(switchDifference)}</p><p class="summary-note">ARR has ${switchDescription} switches than RR</p></div>
    <div class="summary amber"><p class="summary-label">TOTAL OVERHEAD TIME</p><p class="summary-value">${arr.overheadTime}</p><p class="summary-note">ARR overhead at the selected switch cost</p></div>
  `;
}

function renderComparison(rr, arr) {
  const comparisonData = [
    ['Avg waiting', rr.averages.waiting, arr.averages.waiting],
    ['Avg turnaround', rr.averages.turnaround, arr.averages.turnaround],
    ['Avg response', rr.averages.response, arr.averages.response],
    ['Switches', rr.contextSwitches, arr.contextSwitches],
  ];
  const maximum = Math.max(...comparisonData.flatMap((item) => item.slice(1)), 1);

  document.querySelector('#comparisonChart').innerHTML = comparisonData.map((data) => {
    const [label, rrValue, arrValue] = data;
    return `
      <div class="bar-row">
        <span>${label}</span>
        <div class="bar-pair"><div class="bar" style="width:${(rrValue / maximum) * 100}%"></div><div class="bar arr" style="width:${(arrValue / maximum) * 100}%"></div></div>
        <span class="bar-value">${rrValue.toFixed(1)} / ${arrValue.toFixed(1)}</span>
      </div>
    `;
  }).join('');
}

function renderFinding(config, processes, switchDifference, waitingDifference) {
  const title = switchDifference > 0
    ? 'Adaptive RR reduces switching here.'
    : switchDifference < 0
      ? 'Fixed RR switches less here.'
      : 'Both policies switch equally here.';
  const waitingText = waitingDifference > 0
    ? `ARR reduces average waiting by ${waitingDifference.toFixed(2)} time units.`
    : waitingDifference < 0
      ? `ARR increases average waiting by ${Math.abs(waitingDifference).toFixed(2)} time units.`
      : 'Both policies have identical average waiting.';

  document.querySelector('#findingTitle').textContent = title;
  document.querySelector('#findingText').textContent = `${waitingText} This result is specific to the selected workload and settings.`;
  document.querySelector('#configSummary').innerHTML = `
    <span>RR Q=${config.fixed}</span><span>ARR bounds ${config.min}-${config.max}</span>
    <span>Switch cost ${config.switchCost}</span><span>${processes.length} processes</span>
  `;
}

function renderConclusion(rr, arr, switchDifference, waitingDifference) {
  const responseDifference = rr.averages.response - arr.averages.response;
  const title = switchDifference > 0
    ? 'Adaptive RR is more efficient for this workload.'
    : switchDifference < 0
      ? 'Fixed RR is more efficient for this workload.'
      : 'The policies have equal switching overhead here.';

  document.querySelector('#conclusionTitle').textContent = title;
  document.querySelector('#conclusionText').textContent = `In this simulation, Adaptive RR uses ${arr.contextSwitches} context switches against ${rr.contextSwitches} for fixed RR and produces an average waiting time of ${arr.averages.waiting.toFixed(2)}. The result is measured from the selected processes and settings, not assumed in advance.`;
  document.querySelector('#impactPoints').innerHTML = `
    <div class="impact-point"><b>What it proves</b>${switchDifference === 0 ? 'Quantum adaptation did not change switching for this input.' : `The selected policy changes overhead by ${Math.abs(switchDifference)} process switches.`}</div>
    <div class="impact-point"><b>Workload impact</b>${waitingDifference >= 0 ? `ARR lowers average waiting by ${waitingDifference.toFixed(2)} units.` : `ARR raises average waiting by ${Math.abs(waitingDifference).toFixed(2)} units.`}</div>
    <div class="impact-point"><b>Trade-off to discuss</b>${responseDifference >= 0 ? `ARR improves average response by ${responseDifference.toFixed(2)} units.` : `ARR has ${Math.abs(responseDifference).toFixed(2)} more response-time units.`}</div>
  `;
}

function renderEfficiency(arr, processes) {
  const busyTime = processes.reduce((total, process) => total + process.burst, 0);
  const idleTime = Math.max(0, arr.totalTime - busyTime - arr.overheadTime);
  const utilization = Math.min(100, arr.utilization);
  const overheadPercentage = (arr.overheadTime / arr.totalTime) * 100;
  const busyDegrees = utilization * 3.6;
  const overheadDegrees = (utilization + overheadPercentage) * 3.6;

  document.querySelector('#efficiencyDonut').style.background = `conic-gradient(var(--teal) ${busyDegrees}deg, var(--amber) ${busyDegrees}deg ${overheadDegrees}deg, #e5ebef ${overheadDegrees}deg)`;
  document.querySelector('#utilizationValue').textContent = `${utilization.toFixed(1)}%`;
  document.querySelector('#efficiencyLegend').innerHTML = `
    <div><span>Useful CPU work</span><b>${busyTime} units</b></div>
    <div><span>Switch overhead</span><b>${arr.overheadTime} units</b></div>
    <div><span>Idle CPU time</span><b>${idleTime} units</b></div>
    <div><span>Total finish time</span><b>${arr.totalTime} units</b></div>
  `;
}

function renderAlgorithmResults(rr, arr, config) {
  document.querySelector('#rrResults').innerHTML = renderAlgorithmResult(
    rr,
    'Traditional Round Robin',
    `Fixed quantum: ${config.fixed}`,
  );
  document.querySelector('#arrResults').innerHTML = renderAlgorithmResult(
    arr,
    'Adaptive Round Robin',
    `Bounded median: ${config.min}-${config.max}`,
  );
}

function renderAlgorithmResult(result, title, subtitle) {
  const metricRows = result.metrics.map((metric) => `
    <tr><td><b>${metric.id}</b></td><td>${metric.completion}</td><td>${metric.turnaround}</td><td>${metric.waiting}</td><td>${metric.response}</td></tr>
  `).join('');

  return `
    <header><div class="algo-title"><div><h3>${title}</h3><p class="eyebrow">${subtitle}</p></div><span class="pill">${result.contextSwitches} switches</span></div></header>
    <div class="gantt-wrap">${renderGanttChart(result.slices, result.totalTime)}</div>
    <div class="averages"><div class="average"><b>AVG WAIT</b><span>${result.averages.waiting.toFixed(2)}</span></div><div class="average"><b>AVG TURN</b><span>${result.averages.turnaround.toFixed(2)}</span></div><div class="average"><b>CPU UTIL.</b><span>${result.utilization.toFixed(1)}%</span></div><div class="average"><b>THROUGHPUT</b><span>${result.throughput.toFixed(2)}</span></div></div>
    <div class="metric-table"><table><thead><tr><th>PID</th><th>CT</th><th>TAT</th><th>WT</th><th>RT</th></tr></thead><tbody>${metricRows}</tbody></table></div>
  `;
}
