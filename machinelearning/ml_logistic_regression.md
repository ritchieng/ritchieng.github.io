---
title: Logistic Regression
keywords: machine_learning
summary: "Classification, logistic regression, advanced optimization, multi-class classification, overfitting, and regularization."
sidebar: ml_sidebar
permalink: /logistic-regression/
folder: machinelearning
tags: [machine_learning]
---

## 1. Classification and Representation
I would like to give full credits to the respective authors as these are my personal python notebooks taken from deep learning courses from Andrew Ng, Data School and Udemy :) This is a simple python notebook hosted generously through Github Pages that is on my main personal notes repository on https://github.com/ritchieng/ritchieng.github.io. They are meant for my personal review but I have open-source my repository of personal notes as a lot of people found it useful.

### 1a. Classification
- y variable (binary classification)
    - 0: negative class
    - 1: positive class
- Examples
    - Email: spam / not spam
    - Online transactions: fraudulent / not fraudulent
    - Tumor: malignant / not malignant
- Issue 1 of Linear Regression
    - As you can see on the graph, your prediction would leave out malignant tumors as the gradient becomes less steep with an additional data point on the extreme right
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_classification.png)
- Issue 2 of Linear Regression
    - Hypothesis can be larger than 1 or smaller than zero
    - Hence, we have to use logistic regression

## 1b. Logistic Regression Hypothesis
- Logistic Regression Model
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression.png)
- Interpretation of Hypothesis Output
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_interpretation.png)

## 1c. Decision Boundary
- Boundaries
    - Max 1
    - Min 0
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_boundaries.png)
- Boundaries are properties of the hypothesis not the data set
    - You do not need to plot the data set to get the boundaries
    - This will be discussed subsequently
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_boundaries2.png)
- Non-linear decision boundaries
    - Add higher order polynomial terms as features
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_boundaries3.png)

## 2. Logistic Regression Model

### 2a. Cost Function
- How do we choose parameters?
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_parameters.png)
- If y = 1
    - If h(x) = 0 & y = 1, costs infinite
    - If h(x) = 1 & y = 1
    , costs = 0
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_parameters_y1.png)
- If y = 0
    - If h(x) = 0 & y = 0, costs = 0
    - If h(x) = 1 & y = 0, costs infinite
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_parameters_y0.png)

### 2b. Simplified Cost Function & Gradient Descent
- Simplified Cost Function Derivatation
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_simple.png)
- Simplified Cost Function
    - Always convex so we will reach global minimum all the time
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_simple2.png)
- Gradient Descent
    - It looks identical, but the hypothesis for Logistic Regression is different from Linear Regression
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_gd.png)
- Ensuring Gradient Descent is Running Correctly
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/logistic_regression_gd2.png)

## 2c. Advanced Optimization
- Background
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/optimisation.png)
- Optimization algorithm
    - Gradient descent
    - Others
        - Conjugate gradient
        - BFGS
        - L-BFGS
- Advantages "Others"
    - No need to manually pick alpha
    - Often faster than gradient descent
- Disadvantages "Others"
    - More complex
    - Should not implement these yourself unless you're an expert in numerical computing
        - Use a software library to do them
        - There are good and bad implementations, choose wisely

- Components of code explanation
    - Code
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/optimisation2.png)
    - 'Gradobj', 'on'
        - We will be providing gradient to this algorithm
    - 'MaxIter', '100'
        - Max iterations to 100
    - fminunc
        - Function minimisation unconstrained
        - Cost minimisation function in octave
    - @costFunction
        - Points to our defined function
    - optTheta
        - Automatically choose learning rate
        - Gradient descent on steriods
    - Results
        - Theta0 = 5
        - Theta1 = 5
        - functionVal = 1.5777e-030
            - Essentially 0 for J(theta), what we are hoping for
        - exitFlag = 1
            - Verify if it has converged, 1 = converged
    - Theta must be more than 2 dimensions
    - Main point is to write a function that returns J(theta) and gradient to apply to logistic or linear regression
        - ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/optimisation3.png)

## 3. Multi-class Classification
- Similar terms
    - One-vs-all
    - One-vs-rest
- Examples
    - Email folders or tags (4 classes)
        - Work
        - Friends
        - Family
        - Hobby
    - Medical Diagnosis (3 classes)
        - Not ill
        - Cold
        - Flu
    - Weather (4 classes)
        - Sunny
        - Cloudy
        - Rainy
        - Snow
- Binary vs Multi-class
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/multiclass_classification.png)
- One-vs-all (One-vs-rest)
    - Split them into 3 distinct groups and compare them to the rest
    - If you have k classes, you need to train k logistic regression classifiers
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/multiclass_classification2.png)
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/multiclass_classification3.png)

## 4. Solving Problem of Overfitting

### 4a. Problem of Overfitting
- Linear Regression: Overfitting
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/overfitting.png)
    - Overfit
        - High Variance
        - Too many features
        - Fit well but fail to generalize new examples
    - Underfit
        - High Bias
- Logistic Regression: Overfitting
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/overfitting2.png)
- Solutions to Overfitting
    - Reduce number of features
        - Manually select features to keep
        - Model selection algorithm
    - Regularization
         - Keep all features, but reduce magnitude or values of parameters theta_j
         - Works well when we've a lot of features

### 4b. Cost Function
- Intuition
    - Making theta so small that is almost equivalent to zero
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/theta_small.png)
- Regularization
    - Small values for parameters (thetas)
        - "Simpler" hypothesis
        - Less prone to overfitting
    - Add regularization parameter to J(theta) to shrink parameters
        - First goal: fit training set well (first term)
        - Second goal: keep parameter small (second, pink, term)
    - If lamda is set to an extremely large value, this would result in underfitting
        - High bias
    - Only penalize thetas from 1, not from 0
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/regularization1.png)


### 4c. Regularized Linear Regression
- Gradient Descent Equation
    - Usually, (1- alpha * lambda / m) is 0.99
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/gd_logistic_regularization.png)
- Normal Equation
    - Alternative to minimise J(theta) only for linear regression
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/normaleqn_regularization_lg.png)
- Non-invertibility
    - Regularization takes care of non-invertibility
    - Matrix will not be singular, it will be invertible

### 4c. Regularized Logistic Regression
- Cost function with regularization
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/regularization_lg.png)
- Using Gradient Descent for Regularized Logistic Regression Cost Function
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/regularization_lg_gd.png)
- To check if Gradient Descent is working well
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/regularization_lg_gd_check.png)
- Using Advanced Optimisation
    - Pass in fminunc in costFunction
    - costFunction need to return
        - jVal
        - gradient
        ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w3_logistic_regression_regularization/regularization_lg_advopt.png)
