---
title: Introduction to C++
keywords: cpp
summary: "This is a basic introduction where we learn how to output Hello World! and see the differences between Python and C++"
sidebar: lang_sidebar
permalink: /cpp/introduction/
folder: languages
tags: [cpp]
---

## Main difference in running C++ and Python
- So if you are familiar with python, you know we can easily create a file called `hello.py` and simply run it with `python hello.py`
- However for C++, we've 1 more step: compiling!
    - Create the file `hello.cpp`
    - Compile: `g++ hello.cpp -o hello`
    - Run: `./hello`

## Getting started with "Hello World"
You would notice it's less intuitive compared to Python, but nonetheless similar.

<script src="https://gist.github.com/ritchieng/bc6fa46ada69b2ce6d0471b8337ccb44.js"></script>

### There are 3 things to note here:
1. We use `//` for comments
2. Lines beginning with `#` are preprocessor commands
    - `#include`: tells preprocessor to dump contents in another file
    - `<iostream>`: file we're dumping into that defines our IO
3. `int main()` defines the code when the program starts
    - `{}`: multiple commands in a block
    - Think of this as similar to defining a function in Python
4. `::` is the scope resolution operator
    - It tells the compiler to look for the identifier we want in the namespace (directory of identifiers)
5. `cout <<:` is the syntax for outputting text
    - Intuitively, anything after `<<:` flows to `cout` that prints!
    - On the other hand, we can get user's input with `cin >>:`, see how the data flows in the opposite direction?
6. In the `{}` block, you must always use a `;` after every line. 
    - This is a common mistake I made when I first started out.

## Variables

<script src="https://gist.github.com/ritchieng/5cf520d1f55aed2d4dd9750dc7b14447.js"></script>

We can test the file by running where `variable.cpp` is the file we saved our above code into:

```
g++ variable.cpp -o variable
./variable
``` 

## Getting input

<script src="https://gist.github.com/ritchieng/74a497046132ca6f34662a65ef670e51.js"></script>