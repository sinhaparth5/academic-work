---
title: "Distributed Systems Reading List"
date: 2024-01-15
draft: false
summary: "A curated reading list for anyone starting research in distributed systems — foundational papers, key textbooks, and a handful of essential blog posts."
---

An opinionated list of what to read when getting into distributed systems research, loosely ordered by where to start.

{{< callout tone="note" title="How to Use This Page" >}}
This kind of library page works well when you want a document-like resource that is still navigable on the web rather than just a file download.
{{< /callout >}}

## Foundational papers

- Lamport (1978) — Time, clocks, and the ordering of events
- Fischer, Lynch, Paterson (1985) — Impossibility of distributed consensus with one faulty process (FLP)
- Brewer (2000) — Towards robust distributed systems (CAP conjecture)
- Gilbert & Lynch (2002) — Brewer's conjecture and the feasibility of consistent, available, partition-tolerant web services
- Ongaro & Ousterhout (2014) — In search of an understandable consensus algorithm (Raft)
- Lamport (1998) — The part-time parliament (Paxos)

## Systems papers worth reading carefully

- DeCandia et al. (2007) — Dynamo: Amazon's highly available key-value store
- Chang et al. (2006) — Bigtable: A distributed storage system for structured data
- Corbett et al. (2012) — Spanner: Google's globally distributed database
- Moraru, Andersen, Kaminsky (2013) — There is more consensus in Egalitarian parliaments (EPaxos)

## Textbooks

- *Designing Data-Intensive Applications*, Kleppmann — best practical introduction
- *Distributed Systems*, van Steen & Tanenbaum — comprehensive reference
- *Database Internals*, Petrov — excellent on storage engines and consensus

## Essential reading online

- The Raft website and visualisation (thesecretlivesofdata.com)
- Martin Kleppmann's lecture notes (University of Cambridge)
- Kyle Kingsbury's Jepsen analyses (jepsen.io)
