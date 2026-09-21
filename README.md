# Adaptive Round Robin CPU Scheduling Simulator

An interactive Operating Systems project that compares traditional fixed-quantum Round Robin (RR) against Adaptive Round Robin (ARR).

## Run

Open `index.html` in a modern browser. No installation, server, or external library is required.

## Core Idea

Traditional RR uses one fixed Time Quantum (TQ) for every dispatch. ARR recalculates its TQ from the current ready queue:

`ARR quantum = clamp(median(remaining burst times), Qmin, Qmax)`

The queue discipline remains Round Robin: arrivals join the ready queue, the process at the front runs, and unfinished work returns to the back.

## Implemented Features

- Editable process ID, arrival time, and burst time input.
- Fixed RR baseline and bounded median-based ARR.
- Configurable fixed quantum, ARR lower/upper bounds, and context-switch cost.
- Preset mixed, short-job, and staggered workloads plus randomized workload generation.
- Side-by-side Gantt charts and CT, TAT, WT, RT tables.
- Average waiting, turnaround, response time, CPU utilization, throughput, and context-switch metrics.
- Metric comparison chart and a workload-specific interpretation panel.
- Interactive next/previous/auto-play scheduler trace with ready queue and quantum decisions.
- CSV metrics export.

## Metrics

| Metric | Formula |
| --- | --- |
| Completion Time (CT) | Time when a process finishes |
| Turnaround Time (TAT) | `CT − Arrival Time` |
| Waiting Time (WT) | `TAT − Burst Time` |
| Response Time (RT) | First CPU start time `− Arrival Time` |
| CPU Utilization | `(Total burst time / total simulation time) × 100` |
| Throughput | `Number of processes / total simulation time` |

Context switches count transitions between different processes. When a non-zero context-switch cost is configured, the simulation inserts a `CS` segment in the Gantt chart and includes its time in the reported metrics.

## Suggested Test Cases

| Workload | What it demonstrates |
| --- | --- |
| Mixed bursts | General RR vs ARR comparison |
| Mostly short jobs | Effect of avoiding unnecessary slices |
| Mostly long jobs | CPU-intensive behaviour |
| Staggered arrivals | Ready-queue updates during execution |
| Same bursts | Median ties and fairness |
| High switch cost | Context-switch overhead impact |

For each workload, record the configuration and report the measured metrics. Do not claim ARR is always superior: its result depends on burst distribution and selected quantum bounds.

## Demo Flow

1. Start with the **Mixed** preset and explain the inputs.
2. Set RR quantum to `3`, ARR bounds to `2–8`, and run the comparison.
3. Point out the two Gantt charts and context-switch difference.
4. Use **Scheduler step-through** to show the ready queue and median quantum at each ARR dispatch.
5. Change the context-switch cost to `1`, rerun, and explain `CS` intervals.
6. Generate a random workload and export its results to CSV.

## Viva Questions

1. Why can a very small RR quantum increase overhead?
2. Why is the median more resistant to an extreme burst time than the average?
3. How does ARR preserve Round Robin fairness?
4. What is the difference between waiting time and response time?
5. Why can lower context switching conflict with better response time?
6. How does a process arriving during another process's time slice enter the ready queue?
7. Why is ARR a heuristic rather than a universally optimal scheduler?
