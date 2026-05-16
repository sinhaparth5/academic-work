---
title: "Reachable Polyhedral Marching for Deep-Learned Control Systems"
date: 2026-05-13
draft: false
math: true
summary: "Notes on Vincent & Schwager (2022) introducing the Reachable Polyhedral Marching (RPM) algorithm for exact reachability analysis of ReLU neural network controllers."
tags: ["neural networks", "reachability analysis", "control systems", "robotics", "reading notes"]
series: ""
images: ["/images/seo_image.png"]
---

## The paper

Vincent, J. A., & Schwager, M. (2022). Reachable Polyhedral Marching (RPM): An Exact Analysis Tool for Deep-Learned Control Systems. *arXiv:2210.08339*.

---

The transition of autonomous systems from highly controlled laboratory environments to the chaotic realities of the physical world has necessitated a fundamental shift in how we approach software reliability. In the traditional engineering paradigm, often referred to as "Software 1.0," humans manually write code and logic, which can be verified through standard unit testing and formal methods. However, the modern era of robotics is increasingly defined by "Software 2.0," where complex behaviours are not programmed but learned from data through deep neural networks. While these networks achieve unprecedented accuracy in perception and decision-making, they operate as high-dimensional black boxes, often lacking the transparency required for safety-critical deployment. In safety-critical sectors such as aerospace, autonomous driving, and healthcare, the inability to mathematically guarantee a system's behaviour is a primary bottleneck to full-scale adoption.

Neural network controllers (NNCs) are now frequently used for everything from maintaining the centreline of a runway in an aircraft to balancing the unstable dynamics of a humanoid robot. Despite their empirical success, these systems are vulnerable to adversarial perturbations — minuscule changes to inputs that can lead to wildly incorrect outputs — and the accumulation of errors over time in a closed-loop feedback system. Formal verification serves as the rigorous mathematical answer to these vulnerabilities, aiming to prove that a system will never enter an unsafe state or, conversely, that it will always reach a desired goal. The Reachable Polyhedral Marching (RPM) algorithm represents a significant technical leap in this field, moving beyond conservative approximations toward exact, anytime analysis of neural network behaviour.

## The Mathematical Architecture of Deep-Learned Systems

To understand how RPM verifies a system, one must first deconstruct the underlying mathematics of the neural network itself. Most modern robotic control systems rely on feedforward neural networks using the Rectified Linear Unit (ReLU) activation function. The ReLU function is defined simply as:

$$\phi(z) = \max(0,\, z)$$

It is the atomic unit that grants neural networks their power and their unique geometric properties.

### Homogeneous Recursive Formulations

Consider a deep neural network with $L$ layers. The map from an input $x \in \mathbb{R}^n$ to an output $y \in \mathbb{R}^m$ is defined by the recursive iteration:

$$h^{(l)} = \phi\!\left(\tilde{W}^{(l)}\, \tilde{h}^{(l-1)}\right), \quad l = 1, \ldots, L$$

where $h^{(l-1)}$ is the output of the previous layer, $W^{(l)}$ is the weight matrix, and $b^{(l)}$ is the bias vector. For the purposes of formal analysis, it is more efficient to represent these parameters in a *homogeneous* form, combining weights and biases into a single matrix. The homogeneous parameters are:

$$\tilde{W}^{(l)} = \begin{bmatrix} W^{(l)} & b^{(l)} \end{bmatrix}, \qquad \tilde{h}^{(l)} = \begin{bmatrix} h^{(l)} \\ 1 \end{bmatrix}$$

In this framework, the hidden state at each layer includes a constant $1$ to account for the bias term. The network's behaviour is determined by the *activation pattern* $\sigma \in \{0,1\}^N$, a binary vector representing whether each neuron is "on" or "off". A neuron is active ($\sigma_j = 1$) if its pre-activation value is positive, and inactive ($\sigma_j = 0$) otherwise.

### The Piecewise Affine Nature of Intelligence

The most critical insight for formal verification is that ReLU networks are equivalent to continuous **piecewise-affine (PWA) functions**. This means the network does not behave like a single complex curve, but rather like a mosaic of many flat, linear surfaces joined at their edges. The input space is tessellated into a finite collection of polyhedra, and within each polyhedron $\mathcal{P}_i$ the network simplifies to a basic affine equation:

$$f(x) = A_i\, x + c_i, \quad x \in \mathcal{P}_i$$

Because each region is a convex polyhedron defined by linear inequalities, the entire network can be analysed using the tools of linear programming and computational geometry.

| Network Component | Formal Representation | Role in Verification |
|---|---|---|
| Input State | $x \in \mathbb{R}^n$ | The initial condition of the robot or system. |
| Weight Matrix | $W^{(l)} \in \mathbb{R}^{n_l \times n_{l-1}}$ | Defines the strength of connections between neurons. |
| Activation Pattern | $\sigma \in \{0,1\}^N$ | Determines the active linear piece of the network. |
| Polyhedral Region | $\mathcal{P}_i \subset \mathbb{R}^n$ | The "domain of validity" for a local linear map. |
| Output Map | $A_i x + c_i$ | The control action or state prediction. |

![ReLU piecewise linear surface — each flat plate represents one affine region of the network](/images/notes/neural-mosaic-relu-piecewise-linear-surface.png "Neural Mosaic: ReLU Piecewise Linear Surface. AI-generated illustration.")

## Reachable Polyhedral Marching: The Core Algorithm

While existing methods for analysing neural networks typically proceed layer-by-layer, RPM takes a fundamentally different approach by exploring the input space in an incremental, connected walk. Layer-by-layer methods can be likened to a bulldozer trying to move an entire wall at once; if the process is interrupted, nothing useful remains. RPM, by contrast, is like a scout exploring a landscape one patch at a time. If the exploration stops early, the user still has a valid map of the territory already covered — a property known as **"anytime" verification**.

### Step 1: Determining Polyhedral Regions

The first task of RPM is to translate an activation pattern $\sigma$ into its corresponding polyhedron in the input space. For every neuron $j$ in every layer $l$, the pre-activation value must be either positive or non-positive to maintain the current pattern. The pre-activation as a function of the input $x$ is:

$$z_{jl}(x) = \tilde{w}_{jl}^\top \tilde{h}^{(l-1)}(x)$$

This defines a halfspace constraint $z_{jl}(x) \geq 0$ (if $\sigma_{jl} = 1$) or $z_{jl}(x) \leq 0$ (if $\sigma_{jl} = 0$). By collecting these constraints for all neurons in the network, RPM defines a polyhedron $\mathcal{P}_\sigma$ where the activation pattern remains constant:

$$\mathcal{P}_\sigma = \{ x \in \mathcal{D} : z_{jl}(x) \geq 0 \text{ if } \sigma_{jl}=1,\; z_{jl}(x) \leq 0 \text{ if } \sigma_{jl}=0,\; \forall j, l \}$$

### Step 2: Essential Representation and Redundancy Removal

A major computational hurdle in polyhedral analysis is the presence of **redundant constraints**. A network with thousands of neurons might generate thousands of linear inequalities to define a single region, but many may be irrelevant. RPM utilises a Linear Programming (LP) strategy to identify "essential" constraints — those that actually form the faces of the polyhedron.

For each constraint $a_i^\top x \leq b_i$ in a set of $m$ halfspaces, RPM solves:

$$\max_{x}\; a_i^\top x \quad \text{s.t.} \quad a_k^\top x \leq b_k,\; k \neq i$$

If the maximum value is strictly greater than $b_i$, the constraint is essential; otherwise it is redundant and can be discarded. This reduction to a minimal representation is not just for efficiency — it identifies the "neighbours" of the current region.

### Step 3: Neighbour Discovery and Edge Flipping

Once the essential faces of a polyhedron are found, RPM can "march" into the next region. This is achieved through the **Neighbouring Activation Pattern** theorem. Instead of re-evaluating the network from scratch, RPM simply "flips" the activation of the neuron associated with the essential face.

**Theorem 1** provides the mathematical rigour: if two regions $\mathcal{P}_\sigma$ and $\mathcal{P}_{\sigma'}$ share a face defined by neuron $(j, l)$, then the only neurons that can change state are those whose own decision boundaries are aligned with that face. This allows for a massive reduction in the search space, as the algorithm only needs to consider a handful of "flipper" neurons rather than checking every neuron in the network.

### Step 4: The Connected Walk

The global RPM algorithm maintains a **working set** of unexplored activation patterns and a **visited set**. It iteratively pops a pattern, computes its essential polyhedron, identifies its neighbours, and adds them to the working set. This creates an expanding front of discovery, ensuring that every realisable affine piece of the network within the domain of interest is eventually enumerated.

| Algorithm Component | Implementation | Goal |
|---|---|---|
| Input Pattern | $\sigma^{(0)}$ | The starting point for exploration. |
| Constraint Extractor | Algorithm 1 | Build the polyhedral boundaries from neuron logic. |
| Minimal H-Rep | Algorithm 2 | Use LPs to remove redundant constraints. |
| Neighbour Logic | Algorithm 3 | Flip specific neurons to find the next activation state. |
| Marching Process | Algorithm 4 | Recursively visit neighbours until the domain is covered. |

![The RPM algorithm marches incrementally through polyhedral activation regions](/images/notes/reachable-polyhedral-marching-process.png "Reachable Polyhedral Marching Process. AI-generated illustration.")

## Reachability: Predicting the Future and Tracing the Past

In the context of a robotic controller, reachability is the process of mapping a set of possible initial states to their possible future outcomes. If we know the range of errors a sensor might have, reachability tells us whether those errors could lead to the robot hitting a wall five seconds from now.

### Forward Reachability

The forward reachable set (the "image") of a polyhedron under an affine transformation $T(x) = A_i x + c_i$ is computed by transforming the vertices or the constraints of the original set. For an invertible matrix $A_i$, the image polyhedron $\mathcal{R}_i$ is:

$$\mathcal{R}_i = \{ A_i x + c_i : x \in \mathcal{P}_i \}$$

If $A_i$ is singular, RPM uses polyhedral projection methods such as block elimination to find the shadow cast by the higher-dimensional input set onto the output space. In a multi-step scenario where the network is applied repeatedly ($k$ times), RPM concatenates the network with itself, effectively analysing a deeper network to find the $k$-step reachable set in a single pass.

### Backward Reachability

Backward reachability (the "preimage") is often more critical for safety verification. If we define an **Avoid Set** $\mathcal{Q}$ (e.g., a region of the runway that is off-limits), backward reachability identifies the exact set of initial positions and headings that will lead the plane into that set.

The preimage of $\mathcal{Q}$ under the local affine map $T_i$ is:

$$T_i^{-1}(\mathcal{Q}) \cap \mathcal{P}_i = \{ x \in \mathcal{P}_i : A_i x + c_i \in \mathcal{Q} \}$$

RPM finds the total backward reachable set by intersecting this preimage with the region $\mathcal{P}_i$ where that specific map is valid. This allows for the identification of complex, non-convex regions of "inevitable failure," enabling engineers to patch or retrain the controller.

## Stability Analysis: Fixed Points and Regions of Attraction

One of the oldest questions in control theory is whether a system will naturally "settle" at a desired state. For nonlinear systems like those controlled by neural networks, this is characterised by the **Region of Attraction (ROA)** — the set of all points from which a system will eventually converge to a stable equilibrium.

### Finding Equilibrium

To find where a neural network-controlled system might settle, RPM solves for fixed points within each affine region $\mathcal{P}_i$:

$$x^* = A_i\, x^* + c_i \implies x^* = (I - A_i)^{-1} c_i$$

If a solution $x^*$ exists and lies inside the polyhedron $\mathcal{P}_i$, it is a fixed point. To determine if it is a stable equilibrium (an attractor), we examine the eigenvalues of the matrix $A_i$. If all eigenvalues satisfy $|\lambda_k(A_i)| < 1$, the local dynamics are contractive — any state near $x^*$ will be pulled toward it over time.

### Growing the Attraction Set

Classical methods often approximate the ROA using ellipsoids derived from Lyapunov functions. However, these are often too conservative and fail to capture the true capability of the controller. RPM offers a more constructive alternative:

1. Establish a small, local "seed ROA" around the stable fixed point $x^*$.
2. Use backward reachability to find all states that will reach this seed within one step, then two steps, and so on.
3. The union of these preimages forms an increasingly accurate and exact map of the total ROA.

This method is uniquely powerful because it can handle **non-convex and even disconnected sets** — something traditional "bowl-shaped" Lyapunov methods cannot do.

![Safety enclosure comparison: conservative Lyapunov ellipsoid (left) vs. exact RPM polyhedral region (right)](/images/notes/safety-enclosure-comparison.png "Safety Enclosure Comparison. AI-generated illustration.")

## Homeomorphisms: The Secret to Computational Speed

A significant discovery in the RPM research is the **Homeomorphism Property**. A homeomorphism is a continuous, one-to-one mapping that can be inverted — think of it as a piece of rubber that you can stretch and bend but never tear or fold. If a neural network is a homeomorphism, it possesses unique topological stability.

### The Homeomorphism Condition

RPM provides the first known procedure to check if a deep ReLU network is a homeomorphism by analysing its PWA representation. **Theorem 2** states that a PWA function is a homeomorphism if the sign of the determinant of the local linear map $A_i$ remains constant across every region:

$$\text{sign}\!\left(\det(A_i)\right) = \text{const} \quad \forall i$$

If this condition holds, the network is guaranteed to be a bijection with a continuous inverse.

### The 15× Acceleration

In practical terms, this property allows for a massive speedup in backward reachability. If the network is a homeomorphism, a connected set in the output space must have a connected preimage in the input space. This allows RPM to ignore any part of the state space that is not physically connected to the "growing" ROA. In the van der Pol case study, this allowed the algorithm to solve in 157 seconds what previously took over 2,200 seconds — a **15-fold improvement**.

| Analysis Metric | Naive Reachability | Homeomorphic Acceleration |
|---|---|---|
| Regions Explored | 85,217 | 6,898 |
| Solve Time (s) | 2,280 | 157 |
| Result Accuracy | Exact | Exact |
| Invariance Guarantee | Yes | Yes |

## Case Study 1: The van der Pol Oscillator

The van der Pol oscillator is a classic example of a nonlinear system that exhibits **limit cycles** — stable, self-sustaining oscillations. It is famously used to model everything from the firing of neurons in the brain to the vibrations of a bridge in the wind.

### Learning the Chaos

In this experiment, a neural network was trained to model the reverse-time dynamics of a 10 Hz discrete-time van der Pol system. In reverse time, the stable limit cycle becomes an attractor, and the goal of verification is to find the ROA — the set of all initial states that will eventually settle into the oscillation.

### RPM Results

Using the homeomorphic acceleration, RPM was able to compute 30-step ROAs that perfectly matched the theoretical limit cycle boundary. The resulting set was composed of **32,753 unique polyhedral regions**. Notably, the algorithm was able to verify the entire stable region even as it became highly non-convex and "stretched" by the system's dynamics. Traditional Lyapunov methods in the MPT3 toolbox failed to converge on an answer even after 9 hours of computation, highlighting the superiority of RPM's reachability-based approach for high-nonlinearity systems.

{{< video src="/videos/van-der-pol-oscillator-phase-plot.mp4" >}}

![Phase-plane portrait of the van der Pol limit cycle, with RPM polyhedral mosaic filling the region of attraction](/images/notes/van-der-pol-limit-cycle-phase-portrait.png "Van der Pol Limit Cycle Phase Portrait. AI-generated illustration.")

## Case Study 2: The Torque-Controlled Inverted Pendulum

The inverted pendulum is a classic "unstable" system — it is like trying to balance a broomstick on your finger. It requires constant, precise adjustments to remain upright.

### Control Invariance

The goal of this case study was to find a **control invariant set** — a region of the pendulum's state (angle and angular velocity) from which there exists at least one control action that keeps the pendulum from falling over.

The analysis revealed a fascinating topological feature: the control invariant set was not a single contiguous blob, but **three disjoint sets**:

1. **The Vertical Core** — states near the top where the pendulum can be balanced easily.
2. **The Lateral Holds (left and right)** — disjoint regions where the pendulum is tilted but can be "held" in place by maximum torque, preventing it from swinging further down.

RPM identified these **958 polyhedra** in 5.4 hours, providing an exact map of where the pendulum can be safely operated. This demonstrates that neural networks can learn highly complex, non-intuitive strategies that simple linear controllers would miss.

## Case Study 3: Image-Based Aircraft Taxiing (TaxiNet)

The most industrially significant application of RPM is in the Boeing DARPA **TaxiNet** project. This system uses a camera on an aircraft to track the centreline of a runway during taxiing — a safety-critical task that requires handling diverse lighting conditions, shadows, and weather.

### The Complexity of Vision

The closed-loop TaxiNet system is incredibly complex. It involves three chained components:

- **Observation Model** — translating a state (position on runway) to a camera image.
- **Control Network** — translating the image into a rudder command.
- **Dynamics Model** — updating the plane's position based on the rudder angle.

When these three components are combined, they form a single ReLU network. RPM analysed this system over a domain of $\pm 6$ metres of cross-track error and $\pm 10$ degrees of heading.

### Massive-Scale Verification

The resulting PWA function contained **244,920 affine regions** — orders of magnitude larger than previous benchmarks in the formal verification literature. RPM computed an 11-step ROA (representing 11 seconds of real-time movement) consisting of **28,715 polyhedra**.

This analysis provided a definitive **"safety funnel"** for pilots and autonomous systems. It showed that as long as the plane starts within this polyhedral region, the learned image-based controller is mathematically guaranteed to stabilise it onto the centreline, despite the complexity of the visual inputs. This represents a milestone in the "Assured Autonomy" movement, providing a path to certify vision-based AI for use in commercial aviation.

![The RPM safety funnel for TaxiNet: the polyhedral region of guaranteed stabilisation onto the runway centreline](/images/notes/taxiway-safety-funnel.png "Taxiway Safety Funnel. AI-generated illustration.")

## Formal Verification vs. Traditional Engineering

The shift toward exact verification methods like RPM highlights a growing divide between traditional "sampling-based" safety and formal mathematical guarantees. In the past, an engineer might run 10,000 simulations and, if the plane never left the runway, declare the system safe. However, as the 2018 Uber autonomous car accident demonstrated, a "one-in-a-million" edge case — such as a specific shadow or a slightly faded sign — can lead to catastrophic failure.

| Safety Strategy | Mechanism | Strength | Weakness |
|---|---|---|---|
| Statistical Testing | Sampling and Simulation | Fast, easy to implement. | Cannot prove absence of failures. |
| Over-Approximation | Interval Arithmetic / Zonotopes | Scalable to large networks. | May report "unsafe" for safe systems. |
| Exact Reachability (RPM) | Polyhedral Marching | No conservatism; exact bounds. | Computationally intensive for huge nets. |
| Lyapunov Search | Energy Function Discovery | Fast online execution. | Hard to find valid functions for AI. |

RPM bridges this gap by offering **completeness**. If RPM says a region is safe, it is not a statistical probability; it is a geometric fact. By identifying precisely where a network fails, RPM allows developers to perform "Targeted Policy Improvement" — adding specific training data for the exact polyhedral regions where the network showed weakness.

## Future Directions: Beyond the Polyhedral Frontier

As we look toward the future of robotics, the techniques pioneered by RPM will likely evolve in several directions. One promising area is the **"Inverse RPM" problem** — encoding existing safe controllers directly into neural networks to ensure safety by construction. Another is the investigation of **"Mechanistic Interpretability"**, using the PWA regions to understand why a neuron makes a certain decision, effectively turning the "black box" into a series of understandable linear rules.

Furthermore, the expansion of RPM to handle more complex activation functions (like Sigmoid or Tanh) through piecewise-linear approximation remains an active area of research. As the size of neural networks continues to grow, the "anytime" property of marching algorithms will become even more valuable, allowing for real-time safety checks on the edge — where a robot can check if its next planned move enters a known "unsafe polyhedron" before executing the command.

## Conclusion

The Reachable Polyhedral Marching (RPM) algorithm provides a comprehensive solution for the exact formal verification of deep-learned autonomous systems. By treating neural networks as geometric mosaics and "marching" through their activation patterns, RPM eliminates the conservatism of traditional safety checks and offers a rigorous path to certification for high-risk applications.

The ability to compute exact forward and backward reachable sets, identify non-convex regions of attraction, and exploit homeomorphisms for massive computational speedups represents a new gold standard in AI safety. Whether it is balancing a pendulum, stabilising an aircraft, or navigating a chaotic city street, the mathematical certainty provided by RPM is the key to transforming deep learning from a powerful experimental tool into a reliable, trusted component of our autonomous future.

## Works cited

1. [Neural network verification: Where are we and where do we go from here? SIGPLAN Blog.](https://blog.sigplan.org/2021/11/04/neural-network-verification-where-are-we-and-where-do-we-go-from-here/)
2. [Mechanistic Interpretability of ReLU Neural Networks Through Piecewise-Affine Mapping.](https://www.es.mdu.se/pdf_publications/7328.pdf)
3. [Model checking deep neural networks: opportunities and challenges. *Frontiers in Computer Science*, 2025.](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1557977/full)
4. [Huang, X., Kwiatkowska, M., Wang, S., & Wu, M. Safety Verification of Deep Neural Networks. Heriot-Watt University.](https://researchportal.hw.ac.uk/files/15724646/neural_network.pdf)
5. [Vincent, J. A., & Schwager, M. (2022). Reachable Polyhedral Marching (RPM): An Exact Analysis Tool for Deep-Learned Control Systems. *arXiv:2210.08339*.](https://arxiv.org/html/2210.08339v3)
6. [Formal Analysis and Redesign of a Neural Network-Based Aircraft Taxiing System with VerifAI. *PMC*.](https://pmc.ncbi.nlm.nih.gov/articles/PMC7363209/)
7. [Efficient Reachability Analysis of Closed-Loop Systems with Neural Network Controllers.](https://airou.cs.ou.edu/airou/assets/publications/Efficient_Reachability_Analysis_of_Closed-Loop_Systems_with_Neural_Network_Controllers.pdf)
8. [Hamilton-Jacobi Reachability Theory. The Safe Autonomous Systems Lab.](http://sylviaherbert.com/hamilton-jacobi-reachability-analysis)
9. [Vincent, J. A., & Schwager, M. (2021). Reachable Polyhedral Marching (RPM): A Safety Verification Algorithm for Robotic Systems with Deep Neural Network Components. Stanford MSL.](https://msl.stanford.edu/papers/vincent_reachable_2021.pdf)
10. [Neural Network Repair with Reachability Analysis. DigitalCommons@UNL.](https://digitalcommons.unl.edu/cgi/viewcontent.cgi?article=1322&context=csearticles)
11. [Van der Pol oscillator. *Wikipedia*.](https://en.wikipedia.org/wiki/Van_der_Pol_oscillator)
12. [Lyapunov stability. *Wikipedia*.](https://en.wikipedia.org/wiki/Lyapunov_stability)
