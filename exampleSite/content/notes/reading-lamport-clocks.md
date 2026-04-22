---
title: "Reading Notes: Lamport Clocks and Happens-Before"
date: 2024-10-03
draft: false
math: true
summary: "Notes on Lamport's 1978 paper introducing logical clocks and the happens-before relation, with observations on how the idea maps onto modern distributed databases."
tags: ["distributed systems", "clocks", "Lamport", "reading notes"]
series: "Distributed Systems Classics"
---

## The paper

Lamport, L. (1978). Time, clocks, and the ordering of events in a distributed system. *Communications of the ACM*, 21(7), 558–565.

## The happens-before relation

The relation $a \to b$ (a happens before b) holds if:

1. $a$ and $b$ are events in the same process and $a$ comes before $b$, or
2. $a$ is the sending of a message and $b$ is the receipt of that same message, or
3. There exists a $c$ such that $a \to c$ and $c \to b$ (transitivity).

Two events are **concurrent** if neither $a \to b$ nor $b \to a$.

## Lamport timestamps

Each process $p_i$ maintains a counter $C_i$. The rules are:

- Increment $C_i$ before each event.
- When sending a message, attach the current value $C_i$.
- On receiving a message with timestamp $T_m$, set $C_i \leftarrow \max(C_i,\, T_m) + 1$.

This guarantees the **clock condition**:

$$a \to b \implies C(a) < C(b)$$

The converse does not hold — $C(a) < C(b)$ does not imply $a \to b$. Two events may have different timestamps and still be concurrent.

## Vector clocks

To capture concurrency precisely, Fidge and Mattern (1988) independently proposed **vector clocks**. Each process $p_i$ maintains a vector $V_i \in \mathbb{N}^n$ where $n$ is the number of processes.

The update rules become:

- Increment $V_i[i]$ before each event at $p_i$.
- Attach $V_i$ to every message sent.
- On receiving a message with vector $V_m$, set $V_i[k] \leftarrow \max(V_i[k],\, V_m[k])$ for all $k$, then increment $V_i[i]$.

We say $V_a \leq V_b$ iff $V_a[k] \leq V_b[k]$ for all $k$. Then:

$$a \to b \iff V(a) < V(b)$$
$$a \parallel b \iff V(a) \not\leq V(b) \text{ and } V(b) \not\leq V(a)$$

The cost is $O(n)$ space per timestamp — a real concern at scale.

## Modern relevance

Lamport clocks appear directly in distributed databases. CockroachDB uses a **hybrid logical clock** (HLC) that blends physical wall time $t$ with a Lamport counter $l$, representing time as the pair $(t, l)$ ordered lexicographically. This gives causally consistent timestamps that are also close to real time — the tension Lamport identified is still unresolved forty years later.
