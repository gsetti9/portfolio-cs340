# Define the maximum output buffer size constant
#define MAX_OUTPUT 4096

# Data section for initialized and uninitialized data
.section .data
# Allocate 4096 bytes for output buffer
buffer: .space MAX_OUTPUT
# Store newline character
newline: .byte 10

# Text section for executable code
.section .text
# Make _start appear to linker
.globl _start

# Entry point
_start:
    # Load argument count from stack into r12
    movq (%rsp), %r12
    # Load address of argument array into r13
    leaq 8(%rsp), %r13
    # Load buffer start address into r14
    leaq buffer(%rip), %r14
    # Copy buffer start to r15 for current write position
    movq %r14, %r15
    # Calculate buffer end address into rbx
    leaq MAX_OUTPUT(%r14), %rbx
    # Initialize argument index to 1 to skip program name
    movq $1, %rcx

# Loop through all command line arguments
argument_loop:
    # Compare current index with total argument count
    cmpq %r12, %rcx
    # Exit loop if all arguments processed
    jge done_arguments
    # Check if this is the first argument
    cmpq $1, %rcx
    # Skip adding space if first argument
    je skip_space
    # Check if buffer is full
    cmpq %rbx, %r15
    # Exit if buffer full
    jge done_arguments
    # Write space character to buffer
    movb $32, (%r15)
    # Move buffer position forward one byte
    incq %r15

# Skip space insertion for first argument
skip_space:
    # Load pointer to current argument string
    movq (%r13,%rcx,8), %rsi

# Loop through characters in current argument
character_loop:
    # Check if buffer is full
    cmpq %rbx, %r15
    # Exit if buffer full
    jge done_arguments
    # Load current character from argument into al
    movb (%rsi), %al
    # Check if character is null terminator
    testb %al, %al
    # Jump to next argument if end of string reached
    jz next_argument
    # Copy character to output buffer
    movb %al, (%r15)
    # Move buffer position forward one byte
    incq %r15
    # Move to next character in argument string
    incq %rsi
    # Repeat loop for next character
    jmp character_loop

# Move to next argument
next_argument:
    # Increment the argument index by one
    incq %rcx
    # Repeat loop for next argument
    jmp argument_loop

# Finished processing all arguments
done_arguments:
    # Check if buffer has space for newline
    cmpq %rbx, %r15
    # Skip newline if the buffer full
    jge skip_newline
    # Write newline character to buffer
    movb $10, (%r15)
    # Move buffer position forward one byte
    incq %r15

# Skip newline insertion if buffer full
skip_newline:
    #  Set system call number to 1 for write
    movq $1, %rax
    # Set file descriptor to 1 for stdout
    movq $1, %rdi
    # Set buffer address as source for write
    movq %r14, %rsi
    # Copy current buffer position to rdx
    movq %r15, %rdx
    # Subtract buffer start to get total bytes written
    subq %r14, %rdx
    # Invoke write system call
    syscall
    # Compare write return value with zero
    cmpq $0, %rax
    # Jump to error handler if write failed
    jl write_error
    # Set system call number to 60 for exit
    movq $60, %rax
    # Set exit status to 0 for success
    movq $0, %rdi
    # Invoke exit system call
    syscall

# Handle write system call error
write_error:
    # Set system call number to 60 for exit
    movq $60, %rax
    # Set exit status to 1 for error
    movq $1, %rdi
    # Invoke exit system call
    syscall
