# CS271 Reverse Polish Notation (RPN) Calculator (Assembly)

**Course:** CS 271 – Computer Systems, Winter 2026

## Description
`rpn.s` implements a Reverse Polish Notation (RPN) calculator in x86-64 assembly.  
It reads input lines from `stdin`, parses tokens, and evaluates arithmetic expressions using a stack-based approach.

## Features
- Supports addition (`+`), subtraction (`-`), multiplication (`*`), and division (`/`).
- Handles integer variables (`a`–`z`) and assignment using `=` operator.
- Uses two stacks in memory:
  - `stack` for values
  - `kind_stack` to track types
- Handles errors gracefully:
  - Stack underflow
  - Division by zero
  - Invalid tokens or assignments
- Prints results of expressions to stdout.

## Usage
1. Assemble and link:
```bash
as -o rpn.o rpn.s
ld -o rpn rpn.o -lc -dynamic-linker /lib64/ld-linux-x86-64.so.2
