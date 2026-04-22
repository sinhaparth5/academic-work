---
title: "Adaptive Consensus Protocols Under Partial Synchrony"
date: 2024-09-15
draft: false
math: true
summary: "We present AdaptRaft, a variant of the Raft consensus algorithm that dynamically adjusts its timing parameters using a lightweight online learning model, reducing tail latency by up to 34% in geo-distributed deployments."
authors: ["Parth Sinha", "Elena Voronova", "James Whitfield"]
publication: "ACM Symposium on Operating Systems Principles (SOSP)"
year: 2024
tags: ["distributed systems", "consensus", "machine learning", "Raft"]
links:
  - label: "PDF"
    url: "/files/main.pdf"
  - label: "Code"
    url: "https://github.com/example/adapraft"
---

## Abstract

Consensus protocols such as Raft and Multi-Paxos rely on static timeout parameters set at deployment time. In geo-distributed systems, network conditions vary significantly over time, causing unnecessarily frequent leader elections and elevated tail latency.

We present **AdaptRaft**, a modified Raft implementation that uses a bandit-based online learning model to continuously adapt election and heartbeat timeouts to observed network conditions.

## Problem formulation

Let $\tau \in \mathbb{R}_{>0}$ be the election timeout. At each epoch $k$, the system observes a round-trip time sample $r_k \sim \mathcal{D}_k$ drawn from a time-varying distribution $\mathcal{D}_k$. An election is triggered whenever no heartbeat is received within $\tau$, so the expected election rate is:

$$\lambda(\tau) = \mathbb{P}[r > \tau] = 1 - F_{\mathcal{D}}(\tau)$$

where $F_{\mathcal{D}}$ is the CDF of the RTT distribution. The recovery latency after a genuine failure is bounded by $\tau$ from below. We minimise the composite objective:

$$\mathcal{L}(\tau) = \alpha \cdot \lambda(\tau) + \beta \cdot \tau$$

subject to $\tau \geq \tau_{\min}$, where $\alpha$ and $\beta$ are operator-supplied weights.

## Algorithm

Since $\mathcal{D}_k$ is non-stationary and unknown, we discretise the action space to $K$ candidate timeouts $\{\tau_1, \dots, \tau_K\}$ and apply an **Exp3** bandit. At each epoch the learner selects action $\tau_{i_k}$ with probability:

$$p_{i_k} = \frac{(1-\gamma)\, w_{i_k}}{\sum_j w_j} + \frac{\gamma}{K}$$

where $\gamma \in (0,1]$ is an exploration parameter and weights are updated as $w_i \leftarrow w_i \cdot \exp\!\left(\gamma \hat{r}_i / K\right)$ using an importance-weighted reward estimate $\hat{r}_i$.

## Results

In an evaluation across three simulated WAN topologies, AdaptRaft reduces median leader-election events by $61\%$ and $p_{99}$ commit latency by $34\%$ compared to static-timeout Raft, with negligible overhead ($< 0.3\%$ additional CPU).

## BibTeX

```bibtex
@inproceedings{sinha2024adaptive,
  title     = {Adaptive Consensus Protocols Under Partial Synchrony},
  author    = {Sinha, Parth and Voronova, Elena and Whitfield, James},
  booktitle = {Proceedings of the 30th ACM Symposium on Operating Systems Principles},
  year      = {2024}
}
```
