# Adaptive Round Robin CPU Scheduling Simulator

An interactive, browser-based simulator for comparing traditional Round Robin (RR) scheduling with an adaptive Round Robin (ARR) policy. It is designed for operating-systems learning, experimentation, and demonstrations.

## Overview

The simulator runs the same workload through two preemptive scheduling policies and presents their execution timelines and performance metrics side by side:

- **Round Robin (RR):** uses a fixed time quantum.
- **Adaptive Round Robin (ARR):** calculates a quantum from the median remaining burst time of the ready queue, constrained by configurable minimum and maximum bounds.

Use it to explore how arrival times, CPU bursts, quantum choices, and context-switch cost affect scheduling outcomes. ARR is a workload-dependent heuristic; the simulator reports measured results rather than assuming one policy is always better.

## Features

- Create, edit, remove, randomize, or load preset process workloads.
- Configure fixed RR quantum, ARR quantum bounds, and context-switch cost.
- Compare RR and ARR Gantt charts, per-process metrics, and aggregate metrics.
- Inspect a scheduler trace one step at a time or with automatic playback.
- Visualize ready-queue state, dynamic quantum selection, idle periods, and context-switch (`CS`) overhead.
- Review completion, turnaround, waiting, and response times.
- Compare CPU utilization, throughput, averages, and context-switch counts.
- Export simulation metrics as CSV.

## Run Locally

This is a dependency-free static web application. No build step or package installation is required. Because the JavaScript is organized as browser modules, serve the directory over HTTP rather than opening the HTML file directly.

If Python 3 is installed, start the included local server:

```bash
python server.py
```

Then visit `http://localhost:8000`. To choose a different port, pass it as an argument, such as `python server.py 3000`.

After opening the app, define a workload and scheduling settings, then select **Run simulation** to compare the policies. Any static-file server can be used instead.

## Deploy on GitHub Pages

Push the repository to GitHub, then enable **GitHub Pages** from the repository's **Settings > Pages** section. Select the branch containing `index.html` as the deployment source. No server-side code is required: GitHub Pages serves the HTML, CSS, and JavaScript modules directly.

## How the Simulation Works

### Traditional Round Robin

RR selects the next process from the ready queue and runs it for:

```text
min(fixed quantum, remaining burst time)
```

If the process is unfinished, it is returned to the end of the ready queue.

### Adaptive Round Robin

Before each dispatch, ARR derives its quantum from the processes currently in the ready queue:

```text
quantum = clamp(median(remaining burst times), minimum quantum, maximum quantum)
```

It then follows the same ready-queue discipline as RR. For an even number of values, the simulator uses the ceiling of the middle-pair average.

### Context-Switch Cost

A context switch is recorded when execution moves directly from one process to a different process. When a positive switch cost is configured, the corresponding overhead is added to the timeline as a `CS` segment. CPU utilization is calculated from total process burst time divided by total elapsed simulation time, including idle and overhead time.

## Metrics

For each process, the simulator reports:

| Metric | Meaning |
| --- | --- |
| Completion Time (CT) | Time at which the process finishes. |
| Turnaround Time (TAT) | `completion time - arrival time` |
| Waiting Time (WT) | `turnaround time - burst time` |
| Response Time (RT) | `first start time - arrival time` |

It also reports average waiting, turnaround, and response times, along with CPU utilization, throughput, and total context switches.

## Project Structure

```text
.
├── index.html       # Application markup
├── styles.css       # Primary layout and component styles
├── dark-theme.css   # Dark-theme styling
├── effects.css      # Visual effects and animations
├── js/              # Modular application source code
│   ├── main.js      # Application coordinator and event wiring
│   ├── scheduler/   # Pure RR/ARR simulation logic
│   ├── ui/          # DOM rendering and interaction components
│   ├── utils/       # Validation, metrics, and CSV export helpers
│   └── data/        # Preset workloads and OS insights
└── server.py         # Optional local Python web-server launcher
```

## Notes

- Inputs require unique process IDs, non-negative integer arrival times, and positive integer burst times.
- Quantum values and context-switch cost must be whole numbers; ARR's maximum quantum must be at least its minimum quantum.
- Results are specific to the selected workload and configuration.

## License

No license is currently specified. Add a license file before distributing or reusing this project outside its intended scope.
