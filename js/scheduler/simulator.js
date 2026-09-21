import { SCHEDULER, SEGMENT } from '../constants.js';
import { calculateAdaptiveQuantum } from './adaptiveRoundRobin.js';
import { calculateFixedQuantum } from './roundRobin.js';
import { calculateAverages, calculateMetrics } from '../utils/metrics.js';

export function simulate(sourceProcesses, policy, config) {
  const processes = initializeProcesses(sourceProcesses);
  const pendingProcesses = sortByArrival(processes);
  const readyQueue = [];
  const slices = [];
  const trace = [];
  const state = createSchedulerState();

  while (pendingProcesses.length > 0 || readyQueue.length > 0) {
    enqueueArrivals(pendingProcesses, readyQueue, state.time);

    if (readyQueue.length === 0) {
      advanceToNextArrival(pendingProcesses, slices, state);
      enqueueArrivals(pendingProcesses, readyQueue, state.time);
    }

    const queueSnapshot = createQueueSnapshot(readyQueue);
    const quantum = calculateQuantum(policy, readyQueue, config);
    const process = readyQueue.shift();

    handleContextSwitch(process, pendingProcesses, readyQueue, slices, state, config);
    executeProcess(process, quantum, slices, trace, queueSnapshot, state);
    enqueueArrivals(pendingProcesses, readyQueue, state.time);
    finalizeProcessTurn(process, readyQueue, state.time);
    state.previousProcessId = process.id;
  }

  return createSimulationResult(processes, policy, slices, trace, state);
}

function initializeProcesses(sourceProcesses) {
  return sourceProcesses.map((process, index) => ({
    ...process,
    index,
    remaining: process.burst,
    start: null,
    completion: null,
  }));
}

function sortByArrival(processes) {
  return [...processes].sort((left, right) => (
    left.arrival - right.arrival || left.index - right.index
  ));
}

function createSchedulerState() {
  return {
    time: 0,
    previousProcessId: null,
    contextSwitches: 0,
    overheadTime: 0,
  };
}

function enqueueArrivals(pendingProcesses, readyQueue, currentTime) {
  // Admit every process that has arrived before this CPU decision. Keeping the
  // pending list sorted preserves deterministic ready-queue ordering.
  while (pendingProcesses.length > 0 && pendingProcesses[0].arrival <= currentTime) {
    readyQueue.push(pendingProcesses.shift());
  }
}

function advanceToNextArrival(pendingProcesses, slices, state) {
  const nextArrival = pendingProcesses[0].arrival;

  if (nextArrival > state.time) {
    slices.push({ id: SEGMENT.IDLE, start: state.time, end: nextArrival });
  }

  state.time = nextArrival;
  state.previousProcessId = null;
}

function createQueueSnapshot(readyQueue) {
  return readyQueue.map((process) => `${process.id}(${process.remaining})`);
}

function calculateQuantum(policy, readyQueue, config) {
  if (policy === SCHEDULER.ADAPTIVE) {
    return calculateAdaptiveQuantum(readyQueue, config);
  }

  return calculateFixedQuantum(config);
}

function handleContextSwitch(process, pendingProcesses, readyQueue, slices, state, config) {
  const isSwitchingProcess = (
    state.previousProcessId !== null && state.previousProcessId !== process.id
  );

  if (!isSwitchingProcess) {
    return;
  }

  state.contextSwitches += 1;

  if (config.switchCost === 0) {
    return;
  }

  // Switching consumes CPU time but completes no process work. Arrivals during
  // the overhead still join the ready queue before the next scheduling choice.
  const end = state.time + config.switchCost;
  slices.push({ id: SEGMENT.CONTEXT_SWITCH, start: state.time, end });
  state.time = end;
  state.overheadTime += config.switchCost;
  enqueueArrivals(pendingProcesses, readyQueue, state.time);
}

function executeProcess(process, quantum, slices, trace, queueSnapshot, state) {
  if (process.start === null) {
    process.start = state.time;
  }

  const start = state.time;
  const duration = Math.min(quantum, process.remaining);
  state.time += duration;
  process.remaining -= duration;

  slices.push({ id: process.id, start, end: state.time, quantum });
  trace.push({
    time: start,
    process: process.id,
    quantum,
    queue: queueSnapshot,
    duration,
    remaining: process.remaining,
  });
}

function finalizeProcessTurn(process, readyQueue, completionTime) {
  if (process.remaining > 0) {
    readyQueue.push(process);
    return;
  }

  process.completion = completionTime;
}

function createSimulationResult(processes, policy, slices, trace, state) {
  const metrics = calculateMetrics(processes);
  const busyTime = processes.reduce((total, process) => total + process.burst, 0);

  return {
    policy,
    slices,
    trace,
    metrics,
    contextSwitches: state.contextSwitches,
    totalTime: state.time,
    overheadTime: state.overheadTime,
    utilization: (busyTime / state.time) * 100,
    throughput: processes.length / state.time,
    averages: calculateAverages(metrics),
  };
}
