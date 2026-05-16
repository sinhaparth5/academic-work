---
title: "The FABRIC Strategy for Verifying Neural Feedback Systems"
date: 2026-05-16
draft: false
math: true
summary: "Notes on the FABRIC strategy for verifying nonlinear neural feedback systems by combining forward reachability, backward reachability, polyhedral enclosures, MILP encodings, DRiPy refinement, and FITS inner-set construction."
tags: ["neural feedback systems", "reachability analysis", "formal verification", "control systems", "reading notes"]
series: ""
images: ["/images/seo_image_FaBRIC.png"]
---

## The report

*The FABRIC Strategy: An Exhaustive Mathematical Treatise on Verifying Nonlinear Neural Feedback Systems.*

---

The integration of artificial intelligence into safety-critical physical environments has changed the verification problem for control theory, computer science, and formal methods. Dynamical systems controlled by neural networks, often called **neural feedback systems**, **neural network control systems**, or **neural feedback loops**, now appear in autonomous aviation, robotic manipulation, power-grid management, and medical dosing algorithms.

Traditional control architectures come with well-developed tools for proving stability, robustness, and safety. Neural network controllers complicate that picture. They are nonlinear, high-dimensional, and usually embedded inside a closed loop where their outputs shape the next physical state. A controller that performs well under simulation does not automatically come with a mathematical guarantee that it will behave safely at the boundary of its operating envelope.

Historically, engineers have relied on sampling-based falsification methods: Monte Carlo evaluation, scenario testing, or targeted failure sampling. These methods are useful because they scale, but they can only expose behaviours that were sampled. They cannot prove that an untested state, disturbance, or boundary condition is safe.

The **Forward and Backward Reachability Integration for Certification (FABRIC)** strategy addresses this gap by combining forward reachable-set propagation with backward pre-image analysis. The central idea is to avoid pushing one approximation across a long time horizon. Instead, FABRIC computes from both ends and asks whether the two analyses meet in the middle.

![Visualizing neural feedback systems as a closed loop between controller, plant dynamics, disturbance, and safety specification](/images/notes/Visualizing-Neural-Feedback-Systems.png "Visualizing Neural Feedback Systems")

## Mathematical Formalization of Neural Feedback Systems

To verify a neural feedback system, the system must first be expressed in a form an optimization solver can reason about. A discrete-time neural feedback system can be modelled by a tuple containing:

| Component | Meaning |
|---|---|
| State dimension | The dimension of the real-valued state space. |
| Operating domain | The bounded region where the controller and plant model are certified. |
| Initial set | The set of states from which verification trajectories may begin. |
| Transition functions | The physical plant dynamics. |
| Perturbation set | Bounded environmental, modelling, or adversarial disturbance. |
| Neural controller | A feed-forward ReLU network mapping state observations to control actions. |
| Time step | The discrete temporal resolution of the model. |
| Horizon | The maximum number of discrete steps under analysis. |
| Goal set | States the system should reach. |
| Avoid set | Unsafe states the system must not enter. |

A state is a vector $x \in \mathbb{R}^n$. The operating domain $\mathcal{D} \subset \mathbb{R}^n$ bounds the region in which the certification claim is meaningful. If the system leaves this domain, the neural controller may be queried outside the region for which any guarantee was established.

The physical plant is governed by a transition function, while the controller is represented by a neural network $\pi(x)$. Because real systems are imperfect, the model also includes a perturbation variable $w \in \mathcal{W}$, where $\mathcal{W}$ is a bounded disturbance set.

For a time step $\Delta t$, the next-state mapping can be written abstractly as:

$$
x_{t+1} \in F(x_t)
  = x_t + \Delta t \left(f(x_t, \pi(x_t)) + w_t\right),
  \qquad w_t \in \mathcal{W}.
$$

This set-valued form is the mathematical reason sampling is insufficient. The verifier must reason about every allowed disturbance, not just a finite collection of sampled trajectories.

## Forward and Backward Reachability

Reachability analysis asks which states a system can reach under uncertain initial conditions, bounded disturbances, and constrained control. In neural feedback systems there are two complementary questions.

**Forward reachability** asks: if the system starts anywhere in the initial set, where could it be after $k$ steps?

Given a set $\mathcal{X}_t$, a forward reachable set is:

$$
\mathcal{X}_{t+1} = F(\mathcal{X}_t)
  = \{x' : x' \in F(x),\; x \in \mathcal{X}_t\}.
$$

For nonlinear systems, exact computation is usually intractable, so practical methods compute an overapproximation $\overline{\mathcal{X}}_{t+1}$ such that:

$$
\mathcal{X}_{t+1} \subseteq \overline{\mathcal{X}}_{t+1}.
$$

If an overapproximated forward set is disjoint from the avoid set, then the true reachable set is also disjoint from the avoid set.

**Backward reachability** reverses the question: given a target set, which earlier states could lead into it?

Two predecessor notions matter:

| Operator | Meaning | Used for |
|---|---|---|
| Must-reach predecessor | States that enter the target for all allowed disturbances. | Proving goal reachability. |
| May-reach predecessor | States that enter the target for at least one allowed disturbance. | Proving safety against avoid states. |

The must-reach predecessor of a target $\mathcal{T}$ is:

$$
\operatorname{Pre}_{\forall}(\mathcal{T})
  = \{x \in \mathcal{D} : F(x) \subseteq \mathcal{T}\}.
$$

The may-reach predecessor is:

$$
\operatorname{Pre}_{\exists}(\mathcal{T})
  = \{x \in \mathcal{D} : F(x) \cap \mathcal{T} \neq \emptyset\}.
$$

For goal certification, the verifier wants an **underapproximation** of the must-reach set: every state inside the computed set is guaranteed to reach the goal. For avoid certification, the verifier wants an **overapproximation** of the may-reach set: every state that could possibly reach danger is enclosed by the computed danger zone.

## Abstracting Nonlinear Dynamics with Polyhedral Enclosures

The first major hurdle is nonlinear plant dynamics. Exact verification over nonlinear dynamics is generally not tractable, so FABRIC replaces the nonlinear transition with a tight linear enclosure over a bounded region.

A polyhedron is a set described by finitely many linear inequalities:

$$
\mathcal{P} = \{x \in \mathbb{R}^n : A x \leq b\}.
$$

Equivalently, a bounded polytope can be understood through the convex hull of finitely many points:

$$
\operatorname{conv}(V)
  = \left\{\sum_{i=1}^{m} \lambda_i v_i :
      \lambda_i \geq 0,\;
      \sum_{i=1}^{m} \lambda_i = 1
    \right\}.
$$

FABRIC partitions the domain into simplices. A simplex is the higher-dimensional generalization of a line segment, triangle, or tetrahedron. Over each simplex, the nonlinear function is enclosed between linear upper and lower bounds. The union of those local bounds forms a polyhedral enclosure of the nonlinear plant.

![Abstracting nonlinear dynamics by covering curved trajectories with local polyhedral enclosures](/images/notes/Abstracting-Nonlinear-Dynamics.png "Abstracting Nonlinear Dynamics")

### Delaunay Triangulation

To keep these enclosures tight, the state space is subdivided using Delaunay triangulation. A triangulation is Delaunay if no point lies strictly inside the circumsphere of any simplex in the triangulation.

A useful geometric interpretation is the parabolic lifting map. In two dimensions, points $(x,y)$ are lifted onto a paraboloid:

$$
(x,y) \mapsto (x,y,x^2+y^2).
$$

The downward-facing facets of the convex hull of these lifted points, projected back to the original plane, form the Delaunay triangulation. This construction avoids long, thin simplices, which improves interpolation quality and reduces enclosure looseness.

## Exact Neural Encoding through MILP

Once the plant dynamics are linearly enclosed, the neural network controller must also be encoded in a solver-compatible form. FABRIC uses **Mixed-Integer Linear Programming (MILP)** for this step.

A MILP has a linear objective, linear constraints, continuous variables, and integer variables. The integer variables are essential for encoding the discrete activation pattern of a ReLU network.

For a ReLU neuron:

$$
y = \max(0,z),
$$

where $z$ is the pre-activation and $y$ is the output. Suppose known bounds satisfy:

$$
l \leq z \leq u.
$$

Introduce a binary variable $\delta \in \{0,1\}$ indicating whether the neuron is active. The exact Big-M encoding is:

$$
y \geq z,
$$

$$
y \geq 0,
$$

$$
y \leq z - l(1-\delta),
$$

$$
y \leq u\delta.
$$

If $\delta = 1$, the constraints force $y=z$. If $\delta=0$, they force $y=0$. Repeating this construction for every ReLU neuron encodes the neural controller exactly as a mixed-integer linear system.

### Branch and Bound

MILPs are solved using methods such as branch and bound. The solver first relaxes integer constraints, allowing binary variables to take fractional values. If a relaxed solution assigns a neuron indicator a fractional value, the solver branches into two subproblems: one where the variable is fixed to $0$, and another where it is fixed to $1$.

As the search tree grows, the solver uses objective bounds to prune branches that cannot improve the current best feasible solution. This avoids brute force enumeration of every activation pattern, though the worst-case search remains combinatorial.

## Outer Sets: Overapproximating the Backward May-Reachable Set

To prove that a system avoids unsafe states, FABRIC computes an outer approximation of the backward may-reachable set. This set contains every state that could possibly reach the avoid set under some allowed disturbance.

For each state dimension $i$, the lower and upper bounds of the outer hyperrectangle can be computed by solving two MILPs:

$$
\ell_i = \min_x x_i
$$

and

$$
u_i = \max_x x_i,
$$

subject to:

$$
x \in \mathcal{D},
$$

$$
x^+ \in \mathcal{T},
$$

$$
x^+ \in x + \Delta t\left(\widehat{f}(x,\pi(x)) + w\right),
$$

$$
w \in \mathcal{W}.
$$

Here, $\widehat{f}$ denotes the polyhedral enclosure of the nonlinear plant, and $\pi(x)$ is the MILP-encoded neural controller.

This procedure is sound, but it can be conservative. If the domain is too large, the solver is allowed to consider implausible combinations of state, disturbance, and abstraction error, causing the outer set to inflate.

## DRiPy: Domain Refinement Iteration with Polyhedral Enclosures

FABRIC reduces outer-set conservatism using **DRiPy**, an iterative domain refinement procedure.

The process is:

1. Start with the target set and the broad operating domain.
2. Encode the neural controller as a MILP.
3. Enclose the nonlinear plant dynamics over the current domain.
4. Solve optimization queries to obtain lower and upper state bounds.
5. Replace the current domain with the newly computed hyperrectangle.
6. Repeat until the volume reduction falls below a convergence threshold or a maximum iteration count is reached.

If the previous domain has volume $V_k$ and the new domain has volume $V_{k+1}$, one natural stopping criterion is:

$$
\frac{V_k}{V_{k+1}} - 1 < \varepsilon.
$$

The important point is that each refinement recomputes the plant enclosure over a smaller domain. Smaller domains yield tighter linear bounds, and tighter bounds yield less conservative reachable sets.

## Inner Sets: Underapproximating the Backward Must-Reachable Set

Safety proofs need outer approximations of danger. Reachability-to-goal proofs need inner approximations of success.

An inner set for a target $\mathcal{T}$ is a set $\underline{\mathcal{B}}$ such that:

$$
\underline{\mathcal{B}} \subseteq \operatorname{Pre}_{\forall}(\mathcal{T}).
$$

Every state inside $\underline{\mathcal{B}}$ is guaranteed to enter the target, regardless of disturbance.

FABRIC computes these inner sets using **Fast Inner Template Sets (FITS)**. The abstract objective is:

$$
\max_{\mathcal{S}} \operatorname{vol}(\mathcal{S})
$$

subject to:

$$
\mathcal{S} \subseteq \overline{\mathcal{B}},
$$

$$
F(\mathcal{S}) \subseteq \mathcal{T}.
$$

Here, $\overline{\mathcal{B}}$ is a previously computed outer set that bounds the search region. FITS provides three algorithms with different tradeoffs.

| Algorithm | Full name | Strategy | Tradeoff |
|---|---|---|---|
| SHARP | Scaled Hyperrectangular Approximation of Reachable Polytopes | Shrinks an outer hyperrectangle toward its centre. | Fast, but can be suboptimal for skewed sets. |
| CRISP | Convex Rectangle Inferred via Sampled Positives | Samples positive points, builds their convex hull, and inscribes a rectangle. | Often larger sets, but assumes convex positive structure. |
| CLEAN | Constrained Local Exclusion of Aligned Negatives | Uses negative samples and MILP exclusion constraints. | Robust to holes and non-convexity, but computationally heavier. |

### SHARP

SHARP assumes an outer hyperrectangle with centre $c$ and radius vector $r$. It searches for a scale vector $\alpha \in [0,1]^n$ and defines the candidate inner rectangle:

$$
\mathcal{S}(\alpha)
  = \{x : |x_i - c_i| \leq \alpha_i r_i,\; i=1,\ldots,n\}.
$$

The algorithm maximizes the volume of $\mathcal{S}(\alpha)$ while ensuring its forward reachable image remains inside the target. It uses a golden-section-style line search to reduce the number of expensive containment checks.

### CRISP

CRISP removes SHARP's centre constraint. It samples points inside the outer set using Sobol sequences, evaluates forward reachability for those points, and labels a point positive if it is guaranteed to reach the target.

The positive samples are wrapped in a convex hull. CRISP then solves for the largest axis-aligned hyperrectangle inside that hull. This tends to produce larger inner sets when the true must-reach geometry is asymmetric.

### CLEAN

CLEAN is designed for cases where the reachable geometry is non-convex or contains holes. Instead of relying only on positive samples, it tracks negative samples: points whose forward projection does not certify containment in the target.

The optimization asks for the largest hyperrectangle inside the outer set that excludes all negative samples. This requires binary variables to encode the condition that each negative point is outside the rectangle along at least one dimension. CLEAN is more expensive, but it is less likely to falsely certify a rectangle that spans unsafe gaps.

## The FABRIC Architecture

FABRIC combines these pieces into one verification architecture. Pure forward reachability can become too conservative as overapproximation error compounds over time. Pure backward reachability can become expensive because pre-image computation is difficult for neural feedback loops.

FABRIC splits the horizon:

$$
N = N_f + N_b,
$$

where $N_f$ is the number of forward steps and $N_b$ is the number of backward steps. Usually $N_f$ is larger because backward queries are more expensive.

![The FABRIC architecture meets forward reachable sets and backward reachable sets in the middle of the verification horizon](/images/notes/The-FABRIC-Architecture.png "The FABRIC Architecture")

### Certifying Reach Properties

To prove all initial states reach a goal:

1. Compute an overapproximated forward reachable set from the initial states for $N_f$ steps.
2. Compute an underapproximated backward must-reach set from the goal for $N_b$ steps.
3. Check whether the forward set at the meeting time is fully contained in the backward must-reach set.

The final certificate has the form:

$$
\overline{\mathcal{X}}_{N_f}
  \subseteq
\underline{\operatorname{Pre}}_{\forall}^{N_b}(\mathcal{G}).
$$

If this inclusion holds, every state in the initial set reaches the goal within the full horizon.

### Certifying Avoid Properties

To prove trajectories avoid unsafe states:

1. Compute overapproximated forward reachable sets from the initial states.
2. Compute overapproximated backward may-reachable sets from the avoid set.
3. Verify that the forward sets do not intersect the raw avoid set at intermediate steps.
4. Verify that the final forward set is disjoint from the backward danger zone.

The key final check is:

$$
\begin{aligned}
\overline{\mathcal{X}}_{N_f}
  \cap \overline{\operatorname{Pre}}_{\exists}^{N_b}(\mathcal{A})
  &= \emptyset.
\end{aligned}
$$

If this holds, the initial states cannot reach the avoid set within the horizon.

## Empirical Validation

FABRIC, DRiPy, and FITS were benchmarked against standard nonlinear and hybrid-system examples from the ARCH competition ecosystem.

| Benchmark | State dimension | Verification challenge |
|---|---:|---|
| TORA | 4 | Actuation limits of a cart attached to a wall via a spring, with nonlinear oscillatory dynamics. |
| Unicycle Car | 4 | Collision avoidance for a planar vehicle with trigonometric position updates. |
| Attitude Control | 6 | Orientation stability for a rigid-body aircraft modelled with Rodrigues parameters and rotational rates. |

For outer sets, the unrefined polyhedral approach already improved raw computation time relative to some previous tools. DRiPy then reduced conservatism substantially by repeatedly shrinking the domain and recomputing tighter enclosures. In the Unicycle benchmark, the reported outer-set volume dropped by roughly a factor of forty compared with prior state-of-the-art baselines. In the higher-dimensional Attitude benchmark, the reported volume reduction exceeded a factor of 2900.

For inner sets, earlier tools such as BURNS failed to find non-zero certified sets on some higher-dimensional problems. FITS, especially CRISP, produced certified non-zero underapproximations by sampling within the already-condensed outer set rather than the full domain.

The full FABRIC strategy also showed the benefit of meeting in the middle. On the Unicycle benchmark, splitting the analysis into a larger forward segment and a smaller backward segment produced more than a sevenfold speedup compared with standalone forward reachability.

## Why FABRIC Matters

FABRIC is useful because it separates the verification problem into complementary geometric tasks:

- Polyhedral enclosures make nonlinear plant dynamics solver-compatible.
- MILP encodings make ReLU controllers exact rather than approximate.
- DRiPy reduces the conservatism of backward may-reachable outer sets.
- FITS provides practical inner sets for proving goal reachability.
- Forward and backward integration limits the accumulation of approximation error over long horizons.

The result is a structured strategy for certifying systems that combine continuous dynamics, bounded disturbances, and neural network policies. That combination is exactly where safety-critical autonomy is hardest: the plant is nonlinear, the controller is learned, and the specification must hold for sets of states rather than isolated traces.

## Conclusion

The FABRIC strategy provides a rigorous architecture for verifying nonlinear neural feedback systems. It does not rely on isolated simulations or empirical confidence. Instead, it builds geometric certificates from forward reachable sets, backward predecessor sets, polyhedral plant abstractions, and exact neural-network MILP encodings.

Its key design choice is integration. Forward analysis captures what the system can do from the initial states. Backward analysis captures what must lead to the goal or what might lead to danger. By making these analyses meet in the middle, FABRIC reduces the long-horizon conservatism that often prevents reachability methods from scaling.

For safety-critical neural control, that matters. A deployed neural controller needs more than good average-case behaviour. It needs a certificate that its closed-loop dynamics remain inside the allowed region, reach the intended target when required, and avoid catastrophic states under every bounded disturbance covered by the model.

## Works cited

1. [The FABRIC Strategy for Verifying Neural Feedback Systems](https://arxiv.org/abs/2603.08964).
2. [Reachability Analysis - Professorship of Cyber-Physical Systems, TUM](https://www.ce.cit.tum.de/en/cps/research/reachability-analysis/).
3. [Backwards Reachability: A Tutorial - Robot Vision and Learning Lab, University of Toronto](https://rvl.cs.toronto.edu/backwards-reachability/).
4. [Reachability Analysis and Safety Verification for Neural Network Control Systems](https://arxiv.org/abs/1805.09944).
5. [Backward Reachability Analysis for Neural Feedback Loops](https://arxiv.org/abs/2204.08319).
6. [Polyhedral Enclosures: An Efficient Combinatorial Abstraction for Nonlinear Neural Feedback Systems](https://arxiv.org/pdf/2503.22660).
7. [Lecture Notes on Delaunay Mesh Generation](https://people.eecs.berkeley.edu/~jrs/meshpapers/delnotes.pdf).
8. [Mixed-Integer Programming: An Introduction to the Basics - Gurobi](https://www.gurobi.com/resources/blog/mixed-integer-programming-an-introduction-to-the-basics).
9. [Partition-Based Formulations for Mixed-Integer Optimization of Trained ReLU Neural Networks](https://proceedings.neurips.cc/paper_files/paper/2021/file/17f98ddf040204eda0af36a108cbdea4-Paper.pdf).
10. [Comparing Forward and Backward Reachability as Tools for Safety Analysis](https://www.cs.ubc.ca/~mitchell/Papers/myHSCC07.pdf).
