---
title: "STARK Paper and KernelBench Test Notes"
date: 2026-06-07
draft: false
math: true
summary: "Notes on STARK, a strategic multi-agent system for refining CUDA kernels, with local KernelBench experiments on an RTX 3060 Laptop GPU."
tags: ["GPU kernels", "CUDA", "KernelBench", "LLM agents", "reading notes"]
series: ""
images: ["/images/seo_image_STARK.png"]
imageWidth: 1200
imageHeight: 700
---

![Research notes cover illustration for STARK and KernelBench, showing the plan-code-test-debug loop, CUDA blocks, runtime testing, and an RTX 3060 setup](/images/seo_image_STARK.png "Research Notes: STARK and KernelBench. AI-generated illustration.")

These notes explain the paper `2510.16996v1.pdf`.

## The paper

The paper title is:

```text
STARK: Strategic Team of Agents for Refining Kernels
```

The paper is about using LLM agents to write faster GPU kernels.

It evaluates the method on KernelBench.

We also tested KernelBench locally on an NVIDIA GeForce RTX 3060 Laptop GPU.

---

## 1. One-Line Summary

STARK is a multi-agent LLM system that repeatedly writes, tests, debugs, and improves CUDA kernels.

The goal is:

```text
Given a PyTorch reference program, generate a custom GPU kernel that is correct and faster.
```

---

## 2. Why GPU Kernels Matter

Modern AI models run many operations on GPUs.

Common examples are matrix multiplication, convolution, reductions, softmax, normalization, and attention. These operations appear repeatedly in neural networks, so even a small improvement in one kernel can matter when the operation is executed thousands or millions of times.

A GPU kernel is the low-level program that runs one operation, or a fused group of operations, on the GPU.

If a kernel becomes faster, model training and inference can become faster.

The runtime objective is:

$$
\text{minimize } T_{\text{kernel}}
$$

Here, `T_kernel` means the wall-clock runtime of the generated GPU kernel. The smaller this value is, the better the kernel is from a performance point of view.

---

## 3. The Problem STARK Tries To Solve

Writing fast CUDA code is hard.

A correct kernel is not always fast.

A fast-looking kernel may fail to compile.

A compiling kernel may produce wrong outputs.

The important details include thread block size, memory coalescing, shared memory usage, register usage, synchronization, GPU architecture, and launch overhead. A kernel can look reasonable in source code but still perform badly if it reads memory inefficiently, uses too many registers, launches too many small operations, or does not match the GPU architecture well.

The paper argues that a single LLM call is not enough.

Instead, STARK uses several agents with different jobs.

---

## 4. KernelBench

KernelBench is the benchmark used in the paper.

Each KernelBench task gives a PyTorch reference model named `Model`.

The LLM must generate a new model named `ModelNew`.

`ModelNew` should use custom CUDA kernels.

The correctness goal is:

$$
ModelNew(x) \approx Model(x)
$$

The performance goal is:

$$
T_{\text{ModelNew}} < T_{\text{Model}}
$$

KernelBench reports the whole result of the attempt. It checks whether the generated kernel compiles, whether it runs without crashing, whether it produces correct outputs, and whether it is faster than the PyTorch reference.

---

## 5. KernelBench Levels

KernelBench has multiple difficulty levels.

Level 1 contains single operators.

Examples include matrix multiplication, convolution, pooling, activation functions, and reductions. These tasks are smaller than complete models, but they still require correct CUDA indexing and careful memory access.

Level 2 contains fused operator chains.

Example:

```text
matmul -> divide -> sum -> scale
```

Level 3 contains larger model components.

Examples include ResNet blocks, VGG-style components, LSTM modules, and Transformer blocks. At this level, the generated kernel may need to handle multiple operations and more complicated tensor shapes.

The higher the level, the harder the optimization problem.

---

## 6. LLM Generation Equation

The paper describes how an LLM generates tokens.

Given input context:

$$
x = (x_1, x_2, ..., x_n)
$$

the model generates output tokens:

$$
y = (y_1, y_2, ..., y_m)
$$

At step `t`, the model chooses the next token using:

$$
p_\theta(y_t | y_{<t}, x)
=
\frac{\exp(z_\theta(y_t | y_{<t}, x) / \tau)}
{\sum_{y' \in Y} \exp(z_\theta(y' | y_{<t}, x) / \tau)}
$$

In this equation, `p_theta` is the probability assigned by the LLM to the next token. The value `z_theta` is the raw score, also called the logit. The set `Y` is the vocabulary of possible tokens, and `tau` is the temperature parameter that controls how random or deterministic the generation is.

High temperature:

```text
more diverse, more creative, more risky
```

Low temperature:

```text
more deterministic, more precise, less risky
```

This motivates STARK's design.

Planning can use a higher temperature.

Coding and debugging can use a lower temperature.

---

## 7. STARK's Main Idea

STARK stands for:

```text
Strategic Team of Agents for Refining Kernels
```

It is not a single agent.

It is a team of agents.

Each agent has a separate role.

First, it chooses a previous kernel attempt from memory. Then it plans an improvement, writes CUDA code, compiles and tests that code, debugs failures when they happen, records the result, and tries again. This repeated loop is important because kernel optimization usually needs many attempts before a correct and fast version appears.

---

## 8. The Three STARK Agents

### 8.1 Plan Agent

The plan agent decides what optimization to try.

It thinks at a higher level.

The plan may suggest shared memory tiling, operator fusion, vectorized loads and stores, reduced global memory traffic, a different block size, or fewer synchronization points. These are high-level CUDA optimization ideas, and the plan agent's job is to decide which one is worth trying next.

The plan agent should be creative.

The paper uses higher temperature for this role.

### 8.2 Code Agent

The code agent turns the plan into real CUDA code.

It must produce compilable code.

It must define `ModelNew`.

It must preserve the same input-output behavior as `Model`.

The code agent should be precise.

The paper uses lower temperature for this role.

### 8.3 Debug Agent

The debug agent fixes broken attempts.

It uses compiler errors, runtime errors, and correctness failures.

Typical bugs include wrong index math, out-of-bounds memory access, missing boundary checks, wrong tensor shapes, wrong launch configurations, and wrong data types. The debug agent uses the error messages and failed test results to make a targeted repair instead of starting from scratch.

---

## 9. Grounded Instructions

The paper says LLMs often know the right plan but fail to implement it correctly.

Example:

```text
Plan: use shared memory tiling.
Failure: generated CUDA has wrong indexing.
```

STARK uses grounded instructions to reduce this gap.

The plan agent marks the exact code span that should be changed.

The paper uses markers like:

```text
<<<IMPROVE BEGIN>>>
<<<IMPROVE END>>>
```

Simple idea:

```text
Do not just say what to improve.
Point to exactly where the improvement should happen.
```

This helps the code agent focus on the right part of the kernel.

---

## 10. Strategic Search With Tree Memory

STARK stores all attempts in a tree.

The root is the original PyTorch reference.

Each child is a generated kernel attempt.

Each node stores the source code for that attempt, whether it compiled, whether it was correct, the measured runtime, the compiler logs, and the runtime logs. This makes the search tree a memory of what has already been tried, what failed, and what looked promising.

The score of a node is its runtime:

$$
s(n) = T(n)
$$

Lower score is better.

If a kernel fails or is incorrect:

$$
s(n) = +\infty
$$

This means a failed kernel should not be treated as a good candidate.

---

## 11. Exploration and Exploitation

STARK uses a search policy similar to epsilon-greedy search.

With probability `epsilon`, it explores.

With probability `1 - epsilon`, it exploits the best known attempts.

The simple rule is:

$$
\pi(n) =
\begin{cases}
\text{random expandable node}, & \text{with probability } \epsilon \\
\text{best known node}, & \text{with probability } 1 - \epsilon
\end{cases}
$$

Exploration means the system deliberately tries something different, even if it is not currently the best path. Exploitation means the system focuses on improving the best known attempts. STARK needs both because always exploring wastes time, but always exploiting can get stuck in a weak local solution.

The paper reports using:

$$
\epsilon \approx 0.3
$$

This means the system explores often enough to avoid getting stuck.

---

## 12. Dynamic Context Window

The agents do not see all previous attempts.

That would be too much text.

Instead, each agent gets a role-specific context window.

The plan agent sees information useful for choosing a strategy.

The code agent sees information useful for implementing a strategy.

The debug agent sees nearby failed attempts useful for fixing bugs.

Let `i` be the selected node in the search tree. Let `n_root` be the root node, which represents the original PyTorch reference. Let `D(i)` be the children of node `i`, let `C` be a leaderboard of strong kernels, and let `S(i)` be the siblings of node `i`.

The plan context is:

$$
W_{\text{plan}}(i)
=
\{i, n_{\text{root}}\}
\cup D(i)
\cup Top_r(C)
$$

This means the plan agent sees the current node, the original reference, previous children of the current node, and the top global candidates. That gives the plan agent enough information to avoid repeating failed ideas while still seeing the best strategies found so far.

The code context is:

$$
W_{\text{code}}(i)
=
\{i, n_{\text{root}}\}
\cup D(i)
\cup \{j : p(j) \in S(i)\}
$$

This means the code agent sees the current node, the root reference, child attempts, and related attempts from nearby branches. The purpose is to give the code agent enough concrete examples to implement the plan correctly.

The debug context is:

$$
W_{\text{debug}}(i)
=
\{i, n_{\text{root}}\}
\cup S(i)
$$

This means the debug agent mostly uses local related attempts. That is useful because debugging usually needs nearby context, such as the code that just failed and similar attempts that either failed differently or worked.

---

## 13. STARK Algorithm In Simple Steps

STARK starts with the PyTorch reference.

It initializes a search tree.

It initializes a leaderboard.

For each attempt, STARK selects a node from the tree. If the node has a bug, it calls the debug agent; otherwise, it calls the plan agent. The plan is then passed to the code agent, which writes the next kernel candidate. The system compiles the generated kernel, runs correctness tests, measures runtime, adds the result to the tree, updates the leaderboard, and finally returns the fastest correct kernel at the end.

The final answer is:

$$
n^* = \arg\min_{n \in C_{\text{correct}}} T(n)
$$

Here, `C_correct` is the set of kernels that passed correctness testing. The value `T(n)` is the runtime of kernel `n`, and `n*` is the best generated kernel found by the search.

---

## 14. Metrics Used In The Paper

### 14.1 Success Rate

Success rate measures how often the agent finds a compiled and correct kernel.

$$
\text{Success Rate}
=
\frac{\# \text{correct compiled tasks}}
{\# \text{total tasks}}
$$

### 14.2 Fast1 Rate

Fast1 rate measures how often the generated kernel is at least as fast as the baseline.

$$
\text{Fast1}
=
\frac{\# \text{tasks where } T_{\text{kernel}} \le T_{\text{baseline}}}
{\# \text{total tasks}}
$$

### 14.3 Speed

Speed is reported as a runtime ratio.

$$
\text{Speed}
=
\frac{T_{\text{baseline}}}
{T_{\text{kernel}}}
$$

If:

$$
\text{Speed} > 1
$$

then the generated kernel is faster.

If:

$$
\text{Speed} < 1
$$

then the generated kernel is slower.

---

## 15. Paper Results

The paper compares STARK with Torch Eager, Torch Compile default, Torch Compile max-autotune, a Sampling Agent, and a Reflexion Agent. This comparison matters because STARK is not only being compared with other LLM-based methods; it is also being compared with strong PyTorch execution baselines.

Sampling Agent:

```text
Generate many independent kernels and pick the best.
```

Reflexion Agent:

```text
Iteratively improve the previous attempt using feedback.
```

STARK:

```text
Use planning, coding, debugging, memory, and strategic search.
```

### 15.1 Level 1 Results

Against Torch Eager, the Sampling Agent reached `0.81x`, the Reflexion Agent reached `1.24x`, and STARK reached `3.03x`. This means STARK was much stronger on Level 1 single-operator tasks.

In simple terms, STARK is much faster than the two baseline agents on Level 1. This is the easiest KernelBench level, but the result still matters because it shows that the structured agent loop can find better kernels than independent sampling or basic iterative reflection.

### 15.2 Level 2 Results

Against Torch Eager, the Sampling Agent reached `1.06x`, the Reflexion Agent reached `0.88x`, and STARK reached `2.69x`. This shows that STARK was especially useful for fused-operator tasks, where planning and debugging can help discover better combinations of operations.

In simple terms, STARK gets a large advantage on fused-operator tasks. These tasks benefit from planning because a good solution may need to combine several operations into one kernel and avoid extra memory movement between separate PyTorch calls.

### 15.3 Level 3 Results

Against Torch Eager, the Sampling Agent reached `0.87x`, the Reflexion Agent reached `0.79x`, and STARK reached `1.58x`. Level 3 is harder because it contains larger model components, so this result shows that STARK still found useful speedups even when the task was more complex.

In simple terms, STARK still stays faster than PyTorch on larger model components. The margin is smaller than Level 1 and Level 2, but the task is also harder because there are more shapes, operations, and implementation details to handle.

---

## 16. Paper Ablation Results

The paper also tests which STARK components matter.

It compares the Sampling Agent, a Search Agent, a Multi-Agent-only version, and the full STARK system. This helps separate the value of search, the value of using multiple specialized agents, and the value of combining both ideas.

For Level 3 against Torch Eager, the Sampling Agent reached `0.87x`, the Search Agent reached `0.89x`, the Multi-Agent-only version reached `1.11x`, and full STARK reached `1.58x`.

The ablation result says that search helps, the multi-agent workflow helps, and combining both helps the most. This supports the paper's main design choice: STARK is stronger because it uses both structured roles and strategic memory-based search.

---

## 17. Important Lesson From The Paper

The paper's core lesson is:

```text
Kernel optimization is not just code generation.
It is search plus feedback plus debugging plus performance measurement.
```

This matches what we saw in our local experiments.

---

## 18. Our Local Test Environment

We tested on:

```text
NVIDIA GeForce RTX 3060 Laptop GPU
```

The correct CUDA architecture for this GPU is:

```text
sm_86
```

PyTorch extension compilation converted this to:

```text
-gencode=arch=compute_86,code=sm_86
```

This confirmed that the kernel was being compiled for the right GPU architecture.

---

## 19. Initial Problem: Missing `ref_origin`

The first command was:

```bash
uv run scripts/run_and_check.py eval_mode=local gpu_arch=sm_86
```

This failed because the script did not know what to evaluate.

The error was:

```text
Missing required config value: ref_origin
```

In simple terms, KernelBench needs both a reference program and a generated kernel. The reference tells the evaluator what the correct output should be, and the generated kernel is the candidate being tested.

A complete local command needs:

```text
ref_origin
ref_arch_src_path or level/problem_id
kernel_src_path
eval_mode
gpu_arch
```

---

## 20. Second Problem: `gpu_arch=sm_86`

The original script expected architecture names like:

```text
Ada
Ampere
Hopper
```

But the RTX 3060 is usually described by compute capability:

```text
sm_86
```

We updated the architecture handling so:

```text
sm_86 -> 8.6
```

This sets:

```text
TORCH_CUDA_ARCH_LIST=8.6
```

That allows PyTorch CUDA extensions to compile for the RTX 3060.

---

## 21. Third Problem: Missing CUDA Toolkit

The next failure was:

```text
CUDA_HOME environment variable is not set.
```

Then we checked:

```bash
which nvcc
nvcc --version
```

At first, `nvcc` was missing.

The NVIDIA driver lets PyTorch run on the GPU, but the CUDA toolkit provides `nvcc`. KernelBench needs `nvcc` because it compiles custom CUDA extensions before it can run and benchmark them.

After installing the CUDA toolkit, compilation worked.

---

## 22. Smoke Test: Elementwise Add

We ran:

```bash
uv run scripts/run_and_check.py ref_origin=local \
  ref_arch_src_path=src/kernelbench/prompts/model_ex_add.py \
  kernel_src_path=src/kernelbench/prompts/model_new_ex_add.py \
  eval_mode=local gpu_arch=sm_86
```

The generated compile command included:

```text
-gencode=arch=compute_86,code=sm_86
```

The result was:

```text
compiled=True
correctness=True
correctness_trials: 5 / 5
```

Runtime:

```text
PyTorch eager: 0.00387 ms
torch.compile: 0.00425 ms
Custom kernel: 0.00619 ms
```

Speedup over eager:

$$
\frac{0.00387}{0.00619} \approx 0.63
$$

The custom kernel was correct but slower. This is normal for a tiny operation like elementwise add because the overhead of launching a CUDA kernel can be larger than the actual computation being performed.

---

## 23. Larger Test: Tiled Matmul Example

We ran:

```bash
uv run scripts/run_and_check.py ref_origin=local \
  ref_arch_src_path=src/kernelbench/prompts/few_shot/model_ex_tiled_matmul.py \
  kernel_src_path=src/kernelbench/prompts/few_shot/model_new_ex_tiled_matmul.py \
  eval_mode=local gpu_arch=sm_86 \
  num_perf_trials=30 clear_cache=True
```

The compile output showed:

```text
ptxas info: Compiling entry function ... for 'sm_86'
```

The result was:

```text
compiled=True
correctness=True
correctness_trials: 5 / 5
```

Runtime:

```text
PyTorch eager: 0.311 ms
torch.compile: 0.354 ms
Custom kernel: 2.47 ms
```

Speedup over eager:

$$
\frac{0.311}{2.47} \approx 0.13
$$

The custom kernel was correct but much slower than PyTorch. PyTorch uses highly optimized GPU libraries, so a simple tiled example is useful for validating the setup but should not be expected to beat production-level kernels.

---

## 24. Real KernelBench Problem Test

We tested KernelBench Level 1 Problem 1.

The task was:

```text
Square matrix multiplication
```

The reference operation is:

$$
C = A B
$$

For square matrices:

$$
A \in \mathbb{R}^{N \times N}
$$

$$
B \in \mathbb{R}^{N \times N}
$$

$$
C \in \mathbb{R}^{N \times N}
$$

Each output element is:

$$
C_{ij} = \sum_{k=0}^{N-1} A_{ik} B_{kj}
$$

The KernelBench problem used:

```text
N = 2048 * 2 = 4096
```

So the output has:

$$
4096 \times 4096 = 16,777,216
$$

elements.

---

## 25. Placeholder Mistake

We tried:

```bash
kernel_src_path=path/to/generated_kernel.py
```

That failed because it was a placeholder path.

The script needs a real Python file containing `ModelNew`. A placeholder like `path/to/generated_kernel.py` is only an example path, so KernelBench cannot evaluate it until it is replaced with an actual candidate file.

We created:

```text
runs/manual/level1_problem1_matmul.py
```

This file contains a simple tiled CUDA matmul implementation.

---

## 26. Our Manual Matmul Kernel

The manual kernel computes:

$$
C_{ij} = \sum_k A_{ik} B_{kj}
$$

It uses tiling.

Tile size:

```text
TILE = 16
```

Each block computes a `16 x 16` region of `C`.

Each thread computes one output element.

The kernel loads a tile of `A` and a tile of `B` into shared memory.

For each tile:

$$
\text{acc}_{ij}
=
\text{acc}_{ij}
+
\sum_{k=0}^{15}
A^{tile}_{ik} B^{tile}_{kj}
$$

After all tiles are processed:

$$
C_{ij} = \text{acc}_{ij}
$$

The point of tiling is to avoid reading every value directly from global memory every time it is needed. Instead, the kernel reuses small blocks of `A` and `B` in shared memory, which is faster than global memory when the tiling is implemented well.

---

## 27. Real KernelBench Command

We ran:

```bash
uv run scripts/run_and_check.py ref_origin=kernelbench level=1 problem_id=1 \
  kernel_src_path=runs/manual/level1_problem1_matmul.py \
  eval_mode=local gpu_arch=sm_86 \
  num_perf_trials=10 clear_cache=True
```

The compile command included:

```text
-gencode=arch=compute_86,code=sm_86
```

The result was:

```text
compiled=True
correctness=True
correctness_trials: 5 / 5
```

Runtime:

```text
PyTorch eager: 29.2 ms
torch.compile: 27.5 ms
Custom kernel: 180.0 ms
```

Speedup over eager:

$$
\frac{29.2}{180.0} \approx 0.16
$$

Speedup over torch.compile:

$$
\frac{27.5}{180.0} \approx 0.15
$$

The kernel passed correctness, but it was slower than PyTorch/cuBLAS. This means the evaluation pipeline worked, while also showing that correctness alone is not enough for a strong KernelBench result.

---

## 28. Why Our Matmul Was Slower

Our kernel is simple.

PyTorch matmul uses cuBLAS.

cuBLAS is heavily optimized by NVIDIA.

Our kernel did not use advanced optimizations such as Tensor Cores, larger optimized tiles, warp-level matrix multiply instructions, double buffering, vectorized memory access, advanced register blocking, or occupancy tuning. These techniques are exactly the kind of details that make production GPU libraries much faster than a simple teaching kernel.

The theoretical work for matmul is:

$$
2N^3
$$

For `N = 4096`:

$$
2 \times 4096^3
=
137,438,953,472
$$

floating-point operations.

That is about:

$$
137.4 \text{ GFLOP}
$$

Our kernel runtime:

$$
180 \text{ ms} = 0.180 \text{ s}
$$

Approximate throughput:

$$
\frac{137.4 \text{ GFLOP}}{0.180 \text{ s}}
\approx
763 \text{ GFLOP/s}
$$

PyTorch eager runtime:

$$
29.2 \text{ ms} = 0.0292 \text{ s}
$$

Approximate throughput:

$$
\frac{137.4 \text{ GFLOP}}{0.0292 \text{ s}}
\approx
4707 \text{ GFLOP/s}
$$

cuBLAS used the GPU much more efficiently than our simple tiled kernel. The throughput estimate makes this visible: PyTorch/cuBLAS achieved much higher effective GFLOP/s on the same RTX 3060 Laptop GPU.

---

## 29. What Our Tests Proved

Our tests proved that the local setup works. KernelBench can load local examples, download HuggingFace benchmark tasks, compile CUDA extensions, use `nvcc`, accept `gpu_arch=sm_86`, detect the RTX 3060, compile kernels for `sm_86`, run correctness trials, and measure timings.

The important pass condition was:

```text
compiled=True correctness=True
```

We achieved that pass condition on the elementwise add smoke test, the tiled matmul example, and KernelBench Level 1 Problem 1. This is enough to show that the environment and evaluation pipeline are functioning correctly.

---

## 30. What Our Tests Did Not Prove

Our tests did not prove that our generated kernels are optimized.

Correctness is different from performance.

A kernel can be correct and slow.

In KernelBench, the best result is:

```text
compiled=True
correctness=True
speedup > 1.0x
```

Our manual kernels got:

```text
compiled=True
correctness=True
speedup < 1.0x
```

So the setup works, but the kernels were not performance winners.

---

## 31. How This Relates Back To STARK

Our local experiment shows why STARK is useful.

A basic hand-written CUDA kernel can be correct but slow.

Finding a faster kernel requires repeated search.

The STARK paper's main claim is that an agent team can automate that search.

The process should be:

```text
generate kernel
compile
test correctness
measure runtime
analyze failure or slowness
try a better version
repeat
```

This is exactly the workflow KernelBench enables.

---

## 32. Practical Next Steps

To use KernelBench seriously, we need generated candidate files.

Each candidate file should define:

```python
class ModelNew(nn.Module):
    ...
```

Then run:

```bash
uv run scripts/run_and_check.py ref_origin=kernelbench level=1 problem_id=1 \
  kernel_src_path=path/to/real_candidate.py \
  eval_mode=local gpu_arch=sm_86
```

For faster local iteration on a laptop GPU, use fewer trials:

```bash
num_perf_trials=10
```

For more stable final timing, use more trials:

```bash
num_perf_trials=100
```

---

## 33. Final Takeaway

The STARK paper argues that LLM-based kernel optimization needs a structured loop.

The loop is:

```text
plan -> code -> compile -> test -> time -> debug -> search -> repeat
```

Our local tests validated the KernelBench side of that loop.

The environment now supports:

```text
CUDA compilation + correctness testing + runtime measurement on sm_86
```

The remaining challenge is the hard part:

```text
generate kernels that are not only correct, but faster than PyTorch/cuBLAS.
```
