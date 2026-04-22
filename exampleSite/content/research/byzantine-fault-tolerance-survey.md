---
title: "Byzantine Fault Tolerance in Practice: A Survey of Modern BFT Protocols"
date: 2024-03-01
draft: false
summary: "A structured survey of Byzantine fault-tolerant consensus protocols deployed since 2015, identifying the practical trade-offs between safety, liveness, and throughput that are often obscured in theoretical treatments."
authors: ["Parth Sinha", "James Whitfield"]
publication: "ACM Computing Surveys"
year: 2024
tags: ["distributed systems", "BFT", "consensus", "survey"]
links:
  - label: "PDF"
    url: "/files/bft-survey-2024.pdf"
  - label: "arXiv"
    url: "https://arxiv.org/abs/example"
---

## Abstract

Byzantine fault-tolerant (BFT) consensus protocols have seen renewed attention driven by blockchain systems and the need for strong guarantees in adversarial environments. Yet the gap between theoretical results and production deployments remains wide.

This survey examines eighteen BFT protocols published or deployed between 2015 and 2024, with a focus on three practical dimensions: message complexity under Byzantine failures, view-change behaviour, and throughput degradation as the fraction of faulty replicas approaches the *f < n/3* bound.

We categorise protocols along a theory–practice axis and identify four recurring design patterns — optimistic fast paths, leader rotation, threshold signatures, and DAG-based ordering — that characterise the most deployment-ready systems.
