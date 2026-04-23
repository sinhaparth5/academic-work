---
title: "Learned Indices for Distributed Key-Value Stores"
date: 2023-06-10
draft: false
summary: "We explore the applicability of learned index structures to distributed key-value stores, demonstrating that model-based indices can reduce lookup latency by 22% with a modest increase in memory footprint on skewed workloads."
authors: ["Parth Sinha"]
publication: "Workshop on ML for Systems (MLSys)"
year: 2023
tags: ["machine learning", "distributed systems", "indexing", "key-value stores"]
links:
  - label: "PDF"
    url: "/files/main.pdf"
---

## Abstract

Learned index structures replace traditional B-tree or hash-table indices with regression models that predict the position of a key in a sorted array. While these have been shown to be effective in single-node settings, their applicability to distributed key-value stores is less well understood.

This work evaluates three learned index models (RMI, PGM-Index, and RadixSpline) when integrated as the local index layer in a distributed key-value store. We benchmark against a production-grade B-tree baseline on four workloads drawn from the YCSB benchmark suite.

On read-heavy skewed workloads, learned indices reduce median lookup latency by 22% and p99 latency by 18%. On write-heavy uniform workloads, the advantage disappears and B-trees remain preferable. We discuss the conditions under which learned indices are a sound choice for distributed deployments.
