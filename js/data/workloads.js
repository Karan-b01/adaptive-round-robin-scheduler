export const workloads = Object.freeze({
  mixed: [
    { id: 'P1', arrival: 0, burst: 8 },
    { id: 'P2', arrival: 1, burst: 4 },
    { id: 'P3', arrival: 2, burst: 12 },
    { id: 'P4', arrival: 3, burst: 6 },
  ],
  short: [
    { id: 'P1', arrival: 0, burst: 2 },
    { id: 'P2', arrival: 0, burst: 3 },
    { id: 'P3', arrival: 1, burst: 2 },
    { id: 'P4', arrival: 2, burst: 4 },
    { id: 'P5', arrival: 3, burst: 1 },
  ],
  staggered: [
    { id: 'P1', arrival: 0, burst: 10 },
    { id: 'P2', arrival: 3, burst: 3 },
    { id: 'P3', arrival: 6, burst: 8 },
    { id: 'P4', arrival: 10, burst: 2 },
  ],
});

export const defaultProcesses = workloads.mixed;

export const osInsights = [
  {
    question: 'Why does Round Robin use a time quantum?',
    answer: 'A time quantum prevents one CPU-bound process from keeping the processor for too long. Every ready process gets a turn, improving fairness and interactive responsiveness.',
    quote: 'Fair scheduling is not giving everyone the same outcome; it is giving everyone a meaningful chance to run.',
  },
  {
    question: 'What is a context switch?',
    answer: 'It is the CPU changing from one process to another by saving the current state and restoring another state. It enables multitasking, but it also uses time without completing application work.',
    quote: 'A fast switch is useful. An unnecessary switch is overhead.',
  },
  {
    question: 'Why use a median for Adaptive Round Robin?',
    answer: 'The median is less affected by one unusually long burst than an average. It provides a stable, explainable quantum that reflects the middle of the ready queue.',
    quote: 'A good scheduling rule listens to the workload before deciding how long to run.',
  },
  {
    question: 'What is the difference between waiting and response time?',
    answer: 'Waiting time is all time spent in the ready queue. Response time is only the delay before a process first receives the CPU. Interactive users notice response time first.',
    quote: 'The first response creates the user experience; total waiting defines the cost.',
  },
  {
    question: 'Can Adaptive Round Robin always beat fixed Round Robin?',
    answer: 'No. ARR is a workload-dependent heuristic. The simulator compares measured results because different arrivals, burst patterns, and quantum bounds can favour different policies.',
    quote: 'In operating systems, a measured trade-off is more valuable than an untested promise.',
  },
];
