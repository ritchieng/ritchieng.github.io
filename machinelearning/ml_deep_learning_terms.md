---
title: Deep Learning Essential Terms
keywords: machine_learning
summary: "Essential terms for understanding deep learning research papers, tutorials and textbooks."
sidebar: ml_sidebar
permalink: /machine-learning/deep-learning/terms/
folder: machinelearning
tags: [machine_learning]
---

| Term        | Description           |
| ------------- |-------------|
| Jacobian matrix      | The matrix containing all partial derivatives of a function whose input and output are both vectors |
| Hessian matrix     | Similar to Jacobian matrix but it contains the second derivatives collected in a matrix    |
| First-order optimization algorithms | Optimization algorithms that use only a gradient such as gradient descent |
| Second-order optimization algorithms | Optimization algorithms that use Hessian matrix like Newton's method |
| Constrained Optimization | Find the maximal or minimal value of f(x) |
| Karush-Kuhn-Tucker (KKT) Approach | General solution to constrained optimization making use of generalized Lagrange function (Lagrangian) |
| KKT Conditions | Simple set of properties that describe the optimal points of constrained optimization problems |
| Hyperparameters | Machine algorithms' settings that must be determined external to the learning algorithm itself |
| Accuracy | Proportion of examples for which the model produces the correct output |
| Error rate | Proportion of examples for which the model produces an incorrect output |
| Design matrix | Matrix containing a different example in each row |
| Underfitting | Model cannot obtain sufficiently low error value |
| Overfitting | Large gap between training and test error |
| Capacity | Model's ability to fit functions |
| Hypothesis space | Set of functions learning algorithm s allowed to select as being the solution |
| Representational capacity | The model specifies which family of functions the learning algorithm can choose from when varying the parameters to reduce training objective|
| Occam's razor | Among competing hypotheses, one should choose the simplest one |
| Vapnik-Chervonenkis (VC) dimension | Measures the capacity of a binary classifier |
| Nearest neighbor Regression | Non-parametric model minimizing the L2 norm of the point and the surrounding points |
| Parametric Models | Models that learn a function described by a finite-sized parameter vector such as Linear Regression. And if it has less than optimal capacity, it will asymptote with an error value more than the Bayes error |
| Non-parametric Models | No limitation on parameters such as nearest neighbour regression. And more data yields better generalization |
| Nearest neighbour regression | It simply stores X and y and when given x it looks up for the nearest entry and returns the label |
| Bayes error | The error incurred by an oracle, knowing the true probability distribution that generates the data, making predictions from the true distribution p(x, y) |
| Generalization error | It can never increase with more training examples |
| No Free Lunch Theorem | Averaged over all possible data generating distributions, every classification algorithm has the same error rate when classifying previously unobserved points |













