---
title: "Working Notes: What Raft Actually Guarantees"
date: 2024-07-18
draft: false
math: true
summary: "Informal notes clarifying which safety and liveness properties Raft provides under which assumptions, written while preparing a talk on adaptive consensus."
tags: ["distributed systems", "Raft", "consensus", "working notes"]
series: "Distributed Systems Classics"
---

## Safety properties (hold unconditionally)

**Election safety.** At most one leader can be elected in any given term $t$.

**Log matching.** If two logs contain an entry with index $i$ and term $t$, then the logs are identical in all entries up through index $i$. Formally, for logs $L_a$ and $L_b$:

$$L_a[i].\text{term} = L_b[i].\text{term} \implies \forall j \leq i,\; L_a[j] = L_b[j]$$

**Leader completeness.** If entry $e$ is committed in term $t$, then $e$ is present in the log of every leader elected in any term $t' > t$.

**State machine safety.** If server $s_i$ applies log entry at index $i$ to its state machine, no server $s_j$ will ever apply a different entry at index $i$.

## Liveness requires timing

Raft guarantees progress only under **partial synchrony**. Specifically, the system makes progress if:

$$\text{broadcastTime} \ll \text{electionTimeout} \ll \text{MTBF}$$

where $\text{broadcastTime}$ is the average round-trip time, $\text{electionTimeout}$ is the window before a follower starts an election, and $\text{MTBF}$ is the mean time between server failures.

There is no liveness guarantee in a fully asynchronous model — a direct consequence of the FLP impossibility result, which states that no deterministic consensus protocol can guarantee termination if even one process may fail.

## The election timeout problem

In practice the optimal timeout $\tau^*$ minimises:

$$\mathcal{L}(\tau) = \alpha \cdot \mathbb{E}[\text{elections per unit time}] + \beta \cdot \mathbb{E}[\text{recovery latency}]$$

for some weights $\alpha, \beta > 0$. The two terms pull in opposite directions: smaller $\tau$ reduces recovery latency after a genuine failure but increases spurious elections under network jitter. The original paper recommends $\tau \in [150\text{ms}, 300\text{ms}]$ — essentially a guess for a LAN. In a geo-distributed deployment it is almost certainly wrong in one direction or the other.

AdaptRaft treats $\tau$ as a bandit action and learns $\tau^*$ online from observed round-trip times and election frequency.
