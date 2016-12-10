---
title: Machine Learning Journal Library
keywords: machine_learning
summary: "My personal list of journals I use for my research and projects where I wrote one-sentence summaries."
sidebar: ml_sidebar
permalink: /machine-learning/journals-library/
folder: machinelearning
tags: [machine_learning]
---
## Machine Learning Research Conferences and Journals
- [ICLR](http://www.iclr.cc)
- [IJCAI](http://aij.ijcai.org)
- [JAIR](https://www.jair.org)
- [NIPS](https://nips.cc)
- [Journal of Machine Learning Research](http://www.jmlr.org)
- [IEEE Transactions on Pattern Analysis and Machine Intelligence](http://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34)
- [Artificial Intelligence](http://www.sciencedirect.com/science/journal/00043702)
- [Machine Learning](http://www.springer.com/computer/ai/journal/10994)

### Deep Reinforcement Learning
- [Playing Atari with Deep Reinforcement Learning](https://arxiv.org/abs/1312.5602)
- [Continuous Control with Deep Reinforcement Learning](https://arxiv.org/abs/1509.02971)
- [Deterministic Policy Gradient Algorithms](http://jmlr.org/proceedings/papers/v32/silver14.pdf)
- [Actor-Critic Methods](https://webdocs.cs.ualberta.ca/~sutton/book/ebook/node66.html)
    - Summary: an actor neural network would determine the actions (student) while the critic neural network would evaluate the actor's actions (teacher)
- [Progressive Neural Network, Reinforcment Learning Context](https://arxiv.org/pdf/1606.04671.pdf)
    - Summary: adding columns for each new task results in better transfer learning compared to partial or complete fine-tuning which causes catastrophic forgetting

### Deep Convolutional Neural Networks
- [Wide Residual Networks](https://arxiv.org/abs/1605.07146)
    - Summary: a variation of residual networks where width over depth has shown better performance
- [SqueezeNet](https://arxiv.org/abs/1602.07360)
    - Summary: AlexNet-level accuracy with 50x fewer parameters and <0.5MB model size

    
### Deep Neural Networks
- [A shared neural ensemble links distinct contextual memories encoded close in time](http://www.nature.com/nature/journal/v534/n7605/full/nature17955.html)
    - Summary: spatial memories that are acquired near in time are associated with overlapping neuronal ensembles in the brain’s hippocampus
- [Memories linked within a window of time](http://www.nature.com/nature/journal/v536/n7617/full/536405a.html)
    - Summary: a theory called temporal context memory (TCM) explains why people have a better memory for words that occur close together in a list than for words that are further apart
- [Learning Step Size Controllers for Robust Neural Network Training](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/04/daniel2016stepsizecontrol.pdf)
    - Summary: identifying informative states, using the states for learning step size and showing generalization to different tasks
- [Weight Features for Predicting Future Model Performance of Deep Neural Networks](http://www.ijcai.org/Proceedings/16/Papers/318.pdf)
    - Summary: using statistics of weights instead of actual weights
- [Compete to Compute](http://papers.nips.cc/paper/5059-compete-to-compute.pdf)
    - Summary: using competing linear units to outperform non-competing nonlinear units and avoid catastrophic forgetting when training sets change over time
- [HyperNetworks](https://arxiv.org/pdf/1609.09106v3.pdf)
    - Summary: using a HyperLSTMCell over BasicLSTM cell by using a small number of parameters (small LSTM) to generate a large number of parameters (larger LSTM)
- [Non-Local Interaction via Diffusible Resource Prevents Coexistence of Cooperators and Cheaters in a Lattice Model](http://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0063304&type=printable)
- [Decoupled Neural Interfaces using Synthetic Gradients](https://arxiv.org/abs/1608.05343)
    - Summary: by modelling error gradients (synthetic gradients), we can decouple subgraphs and update them independently and asynchronously
- [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)
    - Summary: using soft targets instead of hard targets, we can achieve similar performance from a much smaller network than a large network where we learned the soft targets from
    
### Hyper-parameter Optimization
- [Learning to learn by gradient descent by gradient descent](https://arxiv.org/abs/1606.04474)
    - Summary: learning an optimization algorithm that works on a class of optimization problems by parameterizing the optimizer
- [Direct Feedback Alignment Provides Learning in Deep Neural Networks](https://arxiv.org/abs/1609.01596)
    - Summary: an alternative to error backpropagation by propagating the error through fixed random feedback connections directly from the output layer to each hidden layer
- [DrMAD: Distilling Reverse-Mode Automatic Differentiation for Optimizing Hyperparameters of Deep Neural Networks](https://arxiv.org/abs/1601.00917)
    - Summary: using a convex combination of the starting and ending points to accelerate convergence
- [Gradient-based Hyperparameter Optimization through Reversible Learning](https://arxiv.org/abs/1502.03492)
    - Summary: tuning hyperparameters by casting them as a learning problem

### Deep Recurrent Neural Networks
- [HyperNetworks](https://arxiv.org/abs/1609.09106)
    - Summary: using a small LSTM to generate a large LSTM for substantial model compression
- [Exploring Sparsity in RNN](https://openreview.net/pdf?id=BylSPv9gx)
    - Summary: model size can be reduced by 90% and speed-up is around 2× to 7× while maintain accuracy by pruning weights during the initial training of the network

### Numerical Optimization
- [Fast Exact Multiplication by the Hessian](http://www.bcl.hamilton.ie/~barak/papers/nc-hessian.pdf)