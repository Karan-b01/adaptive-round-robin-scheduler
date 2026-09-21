import { PLAYBACK_INTERVAL, SCHEDULER } from '../constants.js';

export function createPlaybackController() {
  const state = { mode: SCHEDULER.ADAPTIVE, step: 0, timer: null };
  const elements = {
    tabs: document.querySelectorAll('[data-playback]'),
    liveState: document.querySelector('#liveState'),
    progressFill: document.querySelector('#progressFill'),
    trace: document.querySelector('#trace'),
    previous: document.querySelector('#previousStep'),
    next: document.querySelector('#nextStep'),
    autoPlay: document.querySelector('#autoPlay'),
  };
  let results = null;

  function currentResult() {
    return state.mode === SCHEDULER.ADAPTIVE ? results.arr : results.rr;
  }

  function render() {
    if (!results) {
      return;
    }

    const result = currentResult();
    const item = result.trace[state.step];
    const label = state.mode === SCHEDULER.ADAPTIVE ? 'Adaptive RR' : 'Traditional RR';

    elements.tabs.forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.playback === state.mode);
    });
    elements.liveState.innerHTML = item ? renderActiveState(item) : renderCompleteState(result, label);
    elements.progressFill.style.width = `${calculateProgress(result.trace.length, item)}%`;
    elements.trace.innerHTML = result.trace.map(renderTraceItem).join('');
    elements.previous.disabled = state.step === 0;
    elements.next.textContent = state.step >= result.trace.length ? 'Completed' : 'Next step';
  }

  function renderActiveState(item) {
    return `
      <div class="live-item"><b>SIMULATION TIME</b><span>t = ${item.time}</span></div>
      <div class="live-item"><b>RUNNING PROCESS</b><span>${item.process}</span></div>
      <div class="live-item"><b>TIME QUANTUM</b><span>${item.quantum}</span></div>
      <div class="live-item"><b>CPU BURST</b><span>${item.duration} unit${item.duration === 1 ? '' : 's'}</span></div>
    `;
  }

  function renderCompleteState(result, label) {
    return `
      <div class="live-item"><b>STATUS</b><span>Complete</span></div>
      <div class="live-item"><b>ALGORITHM</b><span>${label}</span></div>
      <div class="live-item"><b>FINISH TIME</b><span>${result.totalTime}</span></div>
      <div class="live-item"><b>SWITCHES</b><span>${result.contextSwitches}</span></div>
    `;
  }

  function calculateProgress(traceLength, item) {
    if (!traceLength) {
      return 0;
    }
    return ((state.step + (item ? 1 : 0)) / traceLength) * 100;
  }

  function renderTraceItem(entry, index) {
    return `
      <div class="trace-item ${index === state.step ? 'active' : ''}">
        <b>Step ${index + 1} | t=${entry.time}</b> | ${entry.process} runs with Q=${entry.quantum}
        <div class="trace-queue">Ready queue: ${entry.queue.join(' -> ')}</div>
        <div class="trace-queue">After run: ${entry.remaining ? `${entry.process} has ${entry.remaining} left` : `${entry.process} completes`}</div>
      </div>
    `;
  }

  function stopAutoPlay() {
    if (!state.timer) {
      return;
    }
    clearInterval(state.timer);
    state.timer = null;
    elements.autoPlay.textContent = 'Auto play';
  }

  function move(stepChange) {
    const trace = currentResult().trace;
    state.step = Math.max(0, Math.min(trace.length, state.step + stepChange));
    render();

    if (state.step >= trace.length) {
      stopAutoPlay();
    }
  }

  function reset() {
    stopAutoPlay();
    state.step = 0;
    render();
  }

  function setResults(newResults) {
    results = newResults;
    reset();
  }

  elements.next.addEventListener('click', () => results && move(1));
  elements.previous.addEventListener('click', () => results && move(-1));
  document.querySelector('#resetPlayback').addEventListener('click', () => results && reset());
  elements.autoPlay.addEventListener('click', () => {
    if (!results) return;
    if (state.timer) return stopAutoPlay();
    state.timer = setInterval(() => move(1), PLAYBACK_INTERVAL);
    elements.autoPlay.textContent = 'Stop';
  });
  elements.tabs.forEach((tab) => tab.addEventListener('click', () => {
    state.mode = tab.dataset.playback;
    state.step = 0;
    stopAutoPlay();
    render();
  }));

  return { setResults };
}
