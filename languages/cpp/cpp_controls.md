---
title: C++ Control Flow
keywords: cpp
summary: "Control flow of C++ such as conditionals and loops"
sidebar: lang_sidebar
permalink: /cpp/control-flow/
folder: languages
tags: [cpp]
---

## Relational Operators
They are similar to python with the following:
```
>
>=
<
<=
==
!= 
```

## Logical Operators
This is slightly different compared with Python: and, or and not.
```
&&
||
!
```

## If conditional
Notice how there's a need for curly braces for multiple statements and none for a single statement.
```
if(condition) 
{
      statement1
      statement2
      ...
}
else if
{
      statement3
      statement4
      ...
}
else
    statement5
```

This is an actual example.

<script src="https://gist.github.com/ritchieng/d020544ce5762114ed9d60ce6f4bc2e2.js"></script>

There is something called the "switch case". It has a weird syntax and can almost always be replaced with if-else statements so I'm not writing about that here.

## While Loop
This has similar syntax to the if loop.
```
while(condition)
{
      statement1
      statement2
      ...
}
```

Working example.
<script src="https://gist.github.com/ritchieng/b83f4a282221b6c7056daa83957a3811.js"></script>

## Do-While Loop
This allows you to loop once regardless of whether the condition is true. If it is true, it will continue looping until the condition evaluates to `False`.

```
do {
    statement1
    statement2
    ... 
}
while(condition);
```

## For Loop
The syntax is simple too. A thing to take note is that you can leave out the initialization and increment by including them in the block, I feel it's weird that it's there coming from Python.

```
for(initialization; condition; incrementation){
      statement1
      statement2
      ...
}
```

Working example.
<script src="https://gist.github.com/ritchieng/365192e736559347036a85a6ed522670.js"></script>

Now you can create any complex nested loops and/or for conditionals! 