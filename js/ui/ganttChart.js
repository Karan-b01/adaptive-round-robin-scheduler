import { PROCESS_COLORS, SEGMENT } from '../constants.js';

function colorForSegment(id) {
  if (id === SEGMENT.IDLE) {
    return '#aebbc5';
  }

  if (id === SEGMENT.CONTEXT_SWITCH) {
    return '#334e68';
  }

  const processNumber = Number((id.match(/\d+/) || ['0'])[0]);
  return PROCESS_COLORS[processNumber % PROCESS_COLORS.length];
}

export function renderGanttChart(slices, totalTime) {
  const segments = slices.map((slice) => {
    const width = Math.max(4, ((slice.end - slice.start) / totalTime) * 100);
    const quantumDetail = slice.quantum ? ` (Q=${slice.quantum})` : '';

    return `
      <div class="slice" title="${slice.id}: ${slice.start}-${slice.end}${quantumDetail}"
           style="width:${width}%;background:${colorForSegment(slice.id)}">
        ${slice.id}<small>${slice.start}-${slice.end}</small>
      </div>
    `;
  }).join('');

  return `
    <div class="gantt">${segments}</div>
    <p class="gantt-caption">Hover a segment for its interval. <b>CS</b> shows configured context-switch overhead. Timeline ends at <b>${totalTime}</b>.</p>
  `;
}
