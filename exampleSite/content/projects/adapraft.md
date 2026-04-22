---
title: "AdaptRaft"
date: 2024-08-01
draft: false
summary: "A modified Raft implementation with an online bandit learner that adapts election and heartbeat timeouts to observed network conditions. Companion codebase for the SOSP 2024 paper."
tags: ["distributed systems", "Raft", "Go", "machine learning"]
---

AdaptRaft extends the standard Raft consensus protocol with a lightweight contextual bandit that continuously adjusts timing parameters based on observed round-trip times and election frequency.

**Language:** Go  
**Status:** Active — feedback and contributions welcome

## What it does

Standard Raft uses static election and heartbeat timeouts set at deployment time. In geo-distributed clusters, network conditions vary significantly by time of day and traffic load. AdaptRaft addresses this by:

1. Tracking the moving distribution of observed message round-trip times
2. Feeding these statistics to an Exp3-style bandit that selects from a small set of candidate timeout values
3. Updating the selection each epoch based on observed election frequency (fewer elections = better reward)

The learner is fully decoupled from the Raft safety logic and can be disabled with a single flag to fall back to standard behaviour.

## Getting started

```bash
git clone https://github.com/example/adapraft
cd adapraft
go test ./...
go run ./cmd/demo --nodes 5 --latency-profile wan
```

Configuration is via a TOML file; see `config/example.toml`.

## Source

[github.com/example/adapraft](https://github.com/example/adapraft)
