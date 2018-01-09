---
title: Recommender Systems
keywords: machine_learning
summary: "Predicting movie ratings, collaborative filtering, and low rank matrix factorization."
sidebar: ml_sidebar
permalink: /machine-learning-recommender-systems/
folder: machinelearning
tags: [machine_learning]
---

This is an important practical application of machine learning. Netflix, Spotify, Youtube, Amazon and other companies try to recommend things to you every time you use their services.

## 1. Predicting Movie Ratings
I would like to give full credits to the respective authors as these are my personal python notebooks taken from deep learning courses from Andrew Ng, Data School and Udemy :) This is a simple python notebook hosted generously through Github Pages that is on my main personal notes repository on https://github.com/ritchieng/ritchieng.github.io. They are meant for my personal review but I have open-source my repository of personal notes as a lot of people found it useful.

### 1a. Problem Formulation
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection24.png)

### 1b. Content Based Recommendations
- How do we predict the missing values? 
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection25.png)
- Problem formulation
    - If we minimize the following function, we get the parameters to predict 
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection26.png)
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection27.png)
    - We can use other minimization algorithms (other than gradient descent)
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection28.png)

## 2. Collaborative Filtering

### 2a. Introduction
- Here we will be learning about "Feature Learning"
    - Feature Learning: learning what features to use
- Problem motivation
    - It is inefficient and difficult to ask someone to watch each movie and inform us how romantic or action-packed the movie is
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection29.png)
        - Now we've no idea how each movie is romantic (x1) or action-packed (x2)
        - Let's say that
            - Alice (θ1): likes romance
            - Bob (θ2): likes romance
            - Carol (θ3): likes action
            - Dave (θ4): likes action
        - We can discover x_1 by making sure the following happens
            - θ1_transpose * x_1 = 5
            - θ2_transpose * x_1 = 5
            - θ3_transpose * x_1 = 0
            - θ4_transpose * x_1 = 0
- Optimization algorithm
    - This tries to choose features X_i so that for all the users J that have rated that movie, the algorithm also predicts a value for how that user would have rated that movie that is not too far, in the squared error sense, from the actual value that the user had rated that movie
    - Regularization term to prevent features from becoming too big
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection30.png)
    - We can guess θ, solve for x, then solve for θ and continue
        - There is a more efficient method to do this and we will be discussing this shortly
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection31.png)
    
### 2b. Collaborative Filtering Algorithm
- Collaborative filtering optimization objective
    - We will take both of these optimization objectives and put them together
    - Now we get to minimize with respect to x and θ simultaneously
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection32.png)
- Collaborative filtering algorithm
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection33.png)

## 3. Low Rank Matrix Factorization

### 3a. Vectorization: Low Rank Matrix Factorization
- Low rank matrix factorization
    - Y matrix: all the predicted ratings
    - We conduct matrix factorization by decomposing the matrix into a product of matrices
        - X matrix: features of each movie stacked in rows
        - H matrix: parameters of each user stacked in rows
        - Product of X and H_transpose equals Y matrix
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection34.png)
- Finding related movies
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection35.png)

### 3b. Implementation Detail: Mean Normalization
- Issue without mean normalization
    - And for even the Swords vs. Karate, someone rated it 5 stars
    - So some people do like some movies
    - It seems not useful to just predict that Eve is going to rate everything 0 stars
    - If we're predicting that eve is going to rate everything 0 stars, we also don't have any good way of recommending any movies to her, because you know all of these movies are getting exactly the same predicted rating for Eve so there's no one movie with a higher predicted rating that we could recommend to her
![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection36.png)
- We can conduct mean normalization to solve this issue
    - Our prediction would be the average of each movie
    ![](https://raw.githubusercontent.com/ritchieng/machine-learning-stanford/master/w9_anomaly_recommender/anomaly_detection37.png)

