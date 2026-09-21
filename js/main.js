import { INSIGHT_INTERVAL, SCHEDULER } from './constants.js';
import { defaultProcesses, osInsights, workloads } from './data/workloads.js';
import { simulate } from './scheduler/simulator.js';
import { createInsightsCarousel } from './ui/insights.js';
import { createPlaybackController } from './ui/playback.js';
import { createProcessTable, createRandomWorkload } from './ui/processTable.js';
import { renderResults } from './ui/results.js';
import { exportMetricsCsv } from './utils/csvExport.js';
import { validateSimulationInput } from './utils/validation.js';

const processTable = createProcessTable(
  document.querySelector('#processRows'),
  defaultProcesses,
);
const playback = createPlaybackController();
const insights = createInsightsCarousel(osInsights);
let latestResults = null;

function readConfiguration() {
  return {
    fixed: Number(document.querySelector('#fixedQuantum').value),
    min: Number(document.querySelector('#minQuantum').value),
    max: Number(document.querySelector('#maxQuantum').value),
    switchCost: Number(document.querySelector('#switchCost').value),
  };
}

function runSimulation() {
  const processes = processTable.getProcesses();
  const config = readConfiguration();
  const error = validateSimulationInput(processes, config);
  const errorMessage = document.querySelector('#errorMessage');

  errorMessage.textContent = error || '';
  if (error) {
    return;
  }

  latestResults = {
    rr: simulate(processes, SCHEDULER.FIXED, config),
    arr: simulate(processes, SCHEDULER.ADAPTIVE, config),
    config,
  };

  renderResults(latestResults, config, processes);
  playback.setResults(latestResults);
  document.querySelector('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelector('#addProcess').addEventListener('click', () => processTable.addProcess());

document.querySelectorAll('[data-sample]').forEach((button) => {
  button.addEventListener('click', () => {
    processTable.setProcesses(workloads[button.dataset.sample]);
  });
});

document.querySelector('#randomWorkload').addEventListener('click', () => {
  processTable.setProcesses(createRandomWorkload());
});

document.querySelector('#runSimulation').addEventListener('click', runSimulation);

document.querySelector('#exportCsv').addEventListener('click', () => {
  if (latestResults) {
    exportMetricsCsv(latestResults);
  }
});

setInterval(() => insights.change(1), INSIGHT_INTERVAL);
