# CS271 Echo Program (Assembly)

**Course:** CS 271 – Computer Systems, Winter 2026

## Description
`echo.S` is a simple x86-64 assembly program that mimics the behavior of the Unix `echo` command.  
It reads command-line arguments and prints them to standard output, separated by spaces, followed by a newline.

## Features
- Reads command-line arguments from `%rsp`.
- Uses a fixed-size buffer (`MAX_OUTPUT = 4096`) to store output.
- Implements character-by-character copying and space insertion.
- Performs a system call to write the buffer to stdout.
- Handles errors from the write syscall and exits cleanly.

## Usage
1. Assemble and link:
```bash
as -o echo.o echo.S
ld -o echo echo.o
