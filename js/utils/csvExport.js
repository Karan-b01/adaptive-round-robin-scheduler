export function exportMetricsCsv(results) {
  const rows = [[
    'Algorithm', 'PID', 'Completion Time', 'Turnaround Time', 'Waiting Time',
    'Response Time', 'Context Switches', 'CPU Utilization', 'Throughput',
  ]];

  const algorithms = [
    ['Round Robin', results.rr],
    ['Adaptive Round Robin', results.arr],
  ];

  algorithms.forEach(([name, result]) => {
    result.metrics.forEach((metric) => {
      rows.push([
        name, metric.id, metric.completion, metric.turnaround, metric.waiting,
        metric.response, result.contextSwitches, result.utilization.toFixed(2),
        result.throughput.toFixed(3),
      ]);
    });
  });

  const csv = rows.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), {
    href: url,
    download: 'arr-scheduling-results.csv',
  });

  link.click();
  URL.revokeObjectURL(url);
}
