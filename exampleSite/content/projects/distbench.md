---
title: "DistBench"
date: 2023-11-01
draft: false
summary: "A configurable benchmarking harness for distributed consensus protocols. Supports pluggable protocol implementations, synthetic and replay workloads, and structured JSON output for reproducible experiments."
tags: ["distributed systems", "benchmarking", "Python", "research tools"]
---

DistBench is a benchmarking harness for evaluating distributed consensus protocols under controlled conditions. It grew out of the need for reproducible comparisons in the BFT survey paper.

**Language:** Python + shell  
**Status:** Stable

## Features

- Pluggable protocol backend: swap in Raft, PBFT, HotStuff, or any gRPC-based implementation
- Synthetic workload generation (uniform, skewed, bursty) and YCSB trace replay
- Configurable network emulation via tc/netem for latency, jitter, and packet loss
- Structured JSON output with per-operation latency histograms
- Experiment reproducibility via declarative YAML configs
- Simple HTML report generation from result sets

## Usage

```bash
pip install distbench
distbench run --config experiments/raft-wan.yaml
distbench report results/ --output report.html
```

## Source

[github.com/example/distbench](https://github.com/example/distbench)
