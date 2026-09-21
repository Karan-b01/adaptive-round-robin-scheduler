import { median } from '../utils/metrics.js';

export function calculateAdaptiveQuantum(readyQueue, config) {
  const remainingBursts = readyQueue.map((process) => process.remaining);
  const medianBurst = median(remainingBursts);

  // The median reflects the middle of the current workload without allowing
  // an unusually long process to dominate the quantum. Bounds keep it usable.
  return Math.min(config.max, Math.max(config.min, medianBurst));
}
