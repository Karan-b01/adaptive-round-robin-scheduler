# Adaptive Round Robin CPU Scheduling Simulator

<p align="center">
  <strong>An Interactive CPU Scheduling Simulator for Operating Systems</strong>
</p>

<p align="center">
  Compare Traditional Round Robin with Adaptive Round Robin through interactive
  simulation, Gantt charts, scheduling metrics, and scheduler visualization.
</p>

---

## 📌 Overview

**Adaptive Round Robin CPU Scheduling Simulator** is an interactive web-based
Operating Systems project developed to simulate and analyze CPU scheduling
using two approaches:

- **Traditional Round Robin (RR)**
- **Adaptive Round Robin (ARR)**

Traditional Round Robin uses a fixed Time Quantum for every process, whereas
Adaptive Round Robin dynamically adjusts the Time Quantum according to the
current workload.

The simulator allows users to create and modify processes, configure
scheduling parameters, run simulations, visualize execution using Gantt charts,
inspect scheduler decisions, and compare important CPU scheduling metrics.

The project is designed primarily for **Operating Systems education,
algorithm visualization, experimentation, and academic demonstration**.

---

## 🎯 Project Objectives

The main objectives of this project are:

- Understand the working principle of Round Robin scheduling.
- Demonstrate an adaptive Time Quantum mechanism.
- Compare fixed and adaptive Round Robin scheduling.
- Visualize process execution through Gantt charts.
- Calculate and compare CPU scheduling metrics.
- Study the effect of context-switch overhead.
- Observe how workload characteristics affect scheduling behaviour.
- Provide an interactive learning environment for CPU scheduling concepts.

---

## ✨ Key Features

### Process Configuration

- Add and edit processes.
- Configure:
  - Process ID
  - Arrival Time
  - Burst Time
- Generate randomized workloads.
- Use predefined workload presets.

### Scheduling Algorithms

#### Traditional Round Robin

- Uses a fixed Time Quantum.
- Preemptive scheduling.
- Processes are executed according to the ready-queue order.
- Unfinished processes are placed at the back of the queue.

#### Adaptive Round Robin

- Dynamically calculates the Time Quantum.
- Uses the median of remaining burst times.
- Supports configurable minimum and maximum quantum bounds.
- Maintains the Round Robin ready-queue discipline.

### Visualization

- Side-by-side Gantt charts.
- Process execution timeline.
- Ready Queue visualization.
- Scheduler step-through mode.
- Previous / Next scheduler states.
- Automatic scheduler playback.
- Dynamic quantum visualization.
- Context-switch (`CS`) visualization.

### Performance Analysis

The simulator calculates:

- Completion Time (CT)
- Turnaround Time (TAT)
- Waiting Time (WT)
- Response Time (RT)
- Average Waiting Time
- Average Turnaround Time
- Average Response Time
- CPU Utilization
- Throughput
- Context Switches

### Additional Features

- Mixed workload preset.
- Short-job workload.
- Long-job workload.
- Staggered-arrival workload.
- Same-burst workload.
- High context-switch workload.
- Random workload generation.
- Metric comparison chart.
- Workload-specific interpretation.
- CSV metrics export.

---

# ⚙️ Adaptive Round Robin Algorithm

Traditional Round Robin uses a fixed Time Quantum:

```text
Time Quantum = Constant