export function median(values) {
  const sortedValues = [...values].sort((left, right) => left - right);
  const middleIndex = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 1) {
    return sortedValues[middleIndex];
  }

  return Math.ceil((sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2);
}

export function calculateMetrics(processes) {
  return processes.map((process) => {
    const turnaround = process.completion - process.arrival;

    // Waiting excludes the time a process was actually executing. Response
    // captures only the delay before its first CPU allocation.
    return {
      id: process.id,
      completion: process.completion,
      turnaround,
      waiting: turnaround - process.burst,
      response: process.start - process.arrival,
    };
  });
}

export function calculateAverages(metrics) {
  const average = (field) => (
    metrics.reduce((total, metric) => total + metric[field], 0) / metrics.length
  );

  return {
    waiting: average('waiting'),
    turnaround: average('turnaround'),
    response: average('response'),
  };
}
