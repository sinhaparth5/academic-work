---
title: "MEng Thesis: A Comparative Analysis of Byzantine Fault-Tolerant Consensus Protocols"
date: 2022-06-01
draft: false
summary: "My undergraduate thesis comparing PBFT, HotStuff, and Tendermint across latency, throughput, and message complexity in a simulated WAN environment."
file: "/files/main.pdf"
---

Undergraduate thesis submitted in partial fulfilment of the MEng in Computer Science, June 2022.

**Abstract.** Byzantine fault-tolerant (BFT) consensus protocols provide safety and liveness guarantees even when up to one-third of participants behave arbitrarily. This thesis implements and systematically benchmarks three representative BFT protocols — PBFT, HotStuff, and Tendermint — in a simulated wide-area network environment.

We find that HotStuff achieves the best throughput at scale due to its linear message complexity, while PBFT retains a latency advantage at small replica counts. Tendermint's simple design and explicit timeout-based liveness make it the most straightforward to reason about in practice. We discuss the implications for protocol selection in production blockchain and replication systems.
