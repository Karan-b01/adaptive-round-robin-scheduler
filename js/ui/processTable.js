export function createProcessTable(container, initialProcesses) {
  let processes = structuredClone(initialProcesses);

  function render() {
    container.innerHTML = processes.map((process, index) => `
      <tr>
        <td><input data-field="id" data-index="${index}" value="${process.id}" aria-label="Process ID"></td>
        <td><input data-field="arrival" data-index="${index}" type="number" min="0" value="${process.arrival}" aria-label="Arrival time"></td>
        <td><input data-field="burst" data-index="${index}" type="number" min="1" value="${process.burst}" aria-label="Burst time"></td>
        <td><button class="delete" data-remove="${index}" title="Remove ${process.id}">&times;</button></td>
      </tr>
    `).join('');
  }

  function getProcesses() {
    return processes;
  }

  function setProcesses(newProcesses) {
    processes = structuredClone(newProcesses);
    render();
  }

  function addProcess() {
    processes.push({
      id: `P${processes.length + 1}`,
      arrival: 0,
      burst: 1,
    });
    render();
  }

  container.addEventListener('input', (event) => {
    const input = event.target;
    if (!input.dataset.field) {
      return;
    }

    const process = processes[Number(input.dataset.index)];
    process[input.dataset.field] = input.dataset.field === 'id'
      ? input.value
      : Number(input.value);
  });

  container.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove]');
    if (!button || processes.length === 1) {
      return;
    }

    processes.splice(Number(button.dataset.remove), 1);
    render();
  });

  render();
  return { addProcess, getProcesses, setProcesses };
}

export function createRandomWorkload() {
  const processCount = 5 + Math.floor(Math.random() * 3);
  const processes = Array.from({ length: processCount }, (_, index) => ({
    id: `P${index + 1}`,
    arrival: Math.floor(Math.random() * 9),
    burst: 1 + Math.floor(Math.random() * 14),
  }));

  return processes.sort((left, right) => (
    left.arrival - right.arrival || left.id.localeCompare(right.id)
  ));
}
