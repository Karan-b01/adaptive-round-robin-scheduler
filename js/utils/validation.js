export function validateSimulationInput(processes, config) {
  const hasValidProcesses = processes.length > 0 && processes.every((process) => (
    process.id.trim()
    && Number.isInteger(process.arrival)
    && process.arrival >= 0
    && Number.isInteger(process.burst)
    && process.burst > 0
  ));

  if (!hasValidProcesses) {
    return 'Use non-empty process IDs, whole-number arrivals (0+) and bursts (1+).';
  }

  const processIds = processes.map((process) => process.id.trim());
  if (new Set(processIds).size !== processes.length) {
    return 'Each process ID must be unique.';
  }

  const hasValidConfiguration = (
    Number.isInteger(config.fixed) && config.fixed >= 1
    && Number.isInteger(config.min) && config.min >= 1
    && Number.isInteger(config.max) && config.max >= config.min
    && Number.isInteger(config.switchCost) && config.switchCost >= 0
  );

  return hasValidConfiguration
    ? null
    : 'Quantums and switch cost must be whole numbers; maximum must be at least minimum.';
}
