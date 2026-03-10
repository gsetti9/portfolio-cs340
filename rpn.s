.section .rodata
tok_delim:
    .asciz " \n\t"
plus_str:
    .asciz "+"
minus_str:
    .asciz "-"
div_str:
    .asciz "/"
mul_str:
    .asciz "*"
eq_str:
    .asciz "="
fmt_str:
    .asciz "%ld\n"
err_underflow:
    .asciz "Error: stack underflow\n"
err_badassign:
    .asciz "Error: bad assignment\n"
err_badtoken:
    .asciz "Error: bad token\n"
err_divzero:
    .asciz "Error: division by zero\n"

.section .bss
stack:
    .space 4096 * 8        
kind_stack:
    .space 4096 * 8   
vars:
    .space 26 * 8          

.section .data
stack_ptr:
    .quad stack
kind_ptr:
    .quad kind_stack



.section .text
stack_push:
    movq    stack_ptr(%rip), %rax
    movq    %rdi, (%rax)
    leaq    8(%rax), %rax
    movq    %rax, stack_ptr(%rip)

    movq    kind_ptr(%rip), %rax
    movq    %rsi, (%rax)
    leaq    8(%rax), %rax
    movq    %rax, kind_ptr(%rip)
    ret



stack_pop:
    movq    stack_ptr(%rip), %rax
    leaq    -8(%rax), %rax
    movq    %rax, stack_ptr(%rip)
    movq    (%rax), %rax

    movq    kind_ptr(%rip), %rdx
    leaq    -8(%rdx), %rdx
    movq    %rdx, kind_ptr(%rip)
    movq    (%rdx), %rdx
    ret



stack_peek:
    movq    stack_ptr(%rip), %rax
    movq    -8(%rax), %rax
    ret



stack_size:
    movq    stack_ptr(%rip), %rax
    leaq    stack(%rip), %rdx
    subq    %rdx, %rax
    shrq    $3, %rax
    ret



pop_value:
    call    stack_pop
    cmpq    $1, %rdx              
    jne     pop_value_done
    leaq    vars(%rip), %rdx
    movq    (%rdx, %rax, 8), %rax  
pop_value_done:
    ret



.globl main
main:
    pushq   %rbp
    movq    %rsp, %rbp
    pushq   %r12               
    pushq   %r13                
    pushq   %r14               
    pushq   %r15               

    .equ lineptr, -40          
    .equ n,       -48         
    leaq    -48(%rsp), %rsp

    movq    $0, lineptr(%rbp)
    movq    $0, n(%rbp)

outer_loop:
    /* reset stack to empty for each new line */
    leaq    stack(%rip), %rax
    movq    %rax, stack_ptr(%rip)
    leaq    kind_stack(%rip), %rax
    movq    %rax, kind_ptr(%rip)

    movq    stdin@GOTPCREL(%rip), %rdx
    movq    (%rdx), %rdx
    leaq    n(%rbp), %rsi
    leaq    lineptr(%rbp), %rdi
    call    getline@plt
    cmpq    $0, %rax
    jl      outer_loop_break

    /* get the first token */
    movq    lineptr(%rbp), %rdi
    jmp     strtok_first_call

inner_loop:
    movq    $0, %rdi
strtok_first_call:
    leaq    tok_delim(%rip), %rsi
    call    strtok@plt
    movq    %rax, %r12  
    cmpq    $0, %r12
    je      inner_loop_break


    leaq    plus_str(%rip), %rsi
    movq    %r12, %rdi
    call    strcmp@plt
    cmpq    $0, %rax
    jne     not_plus
    call    stack_size
    cmpq    $2, %rax
    jl      error_underflow
    call    pop_value
    movq    %rax, %r13             
    call    pop_value
    addq    %r13, %rax         
    movq    %rax, %rdi
    movq    $0, %rsi
    call    stack_push
    jmp     inner_loop

not_plus:
    leaq    minus_str(%rip), %rsi
    movq    %r12, %rdi
    call    strcmp@plt
    cmpq    $0, %rax
    jne     not_minus
    call    stack_size
    cmpq    $2, %rax
    jl      error_underflow
    call    pop_value
    movq    %rax, %r13          
    call    pop_value
    subq    %r13, %rax   
    movq    %rax, %rdi
    movq    $0, %rsi
    call    stack_push
    jmp     inner_loop

not_minus:
    leaq    mul_str(%rip), %rsi
    movq    %r12, %rdi
    call    strcmp@plt
    cmpq    $0, %rax
    jne     not_mul
    call    stack_size
    cmpq    $2, %rax
    jl      error_underflow
    call    pop_value
    movq    %rax, %r13           
    call    pop_value
    imulq   %r13, %rax           
    movq    %rax, %rdi
    movq    $0, %rsi
    call    stack_push
    jmp     inner_loop

not_mul:
    leaq    div_str(%rip), %rsi
    movq    %r12, %rdi
    call    strcmp@plt
    cmpq    $0, %rax
    jne     not_div
    call    stack_size
    cmpq    $2, %rax
    jl      error_underflow
    call    pop_value
    movq    %rax, %r14
    cmpq    $0, %r14    
    je      error_divzero
    call    pop_value            
    cqto                     
    idivq   %r14              
    movq    %rax, %rdi
    movq    $0, %rsi
    call    stack_push
    jmp     inner_loop

not_div:
    leaq    eq_str(%rip), %rsi
    movq    %r12, %rdi
    call    strcmp@plt
    cmpq    $0, %rax
    jne     not_eq
    call    stack_size
    cmpq    $2, %rax
    jl      error_underflow
    call    stack_pop               
    cmpq    $1, %rdx              
    jne     error_badassign
    movq    %rax, %r14          
    call    pop_value        
    movq    %rax, %r13          
    leaq    vars(%rip), %rdx
    movq    %r13, (%rdx, %r14, 8) 
    movq    %r13, %rdi
    movq    $0, %rsi
    call    stack_push        
    jmp     inner_loop

not_eq:
    /* check if token is a single letter a-z (variable name) */
    movzbq  (%r12), %rax
    cmpb    $0, 1(%r12)       
    jne     try_number
    cmpb    $'a', %al
    jb      try_number
    cmpb    $'z', %al
    ja      try_number
    subb    $'a', %al         
    movzbq  %al, %rdi
    movq    $1, %rsi            
    call    stack_push
    jmp     inner_loop

try_number:
    /* try to parse token as an integer with strtol */
    leaq    n(%rbp), %rsi        
    movq    %r12, %rdi
    movq    $0, %rdx
    call    strtol@plt
    movq    n(%rbp), %rcx        
    cmpq    %r12, %rcx      
    je      error_badtoken
    cmpb    $0, (%rcx)        
    jne     error_badtoken
    movq    %rax, %rdi
    movq    $0, %rsi    
    call    stack_push
    jmp     inner_loop

inner_loop_break:
    /* print the result sitting on top of the stack */
    call    stack_size
    cmpq    $1, %rax
    jne     outer_loop           
    call    pop_value
    leaq    fmt_str(%rip), %rdi
    movq    %rax, %rsi
    movq    $0, %rax
    call    printf@plt
    jmp     outer_loop

outer_loop_break:
    /* free the getline buffer and exit cleanly */
    movq    lineptr(%rbp), %rdi
    cmpq    $0, %rdi
    je      done
    call    free@plt
done:
    movq    $0, %rax
    leaq    48(%rsp), %rsp
    popq    %r15
    popq    %r14
    popq    %r13
    popq    %r12
    popq    %rbp
    ret

error_underflow:
    movq    stderr@GOTPCREL(%rip), %rdi
    movq    (%rdi), %rdi
    leaq    err_underflow(%rip), %rsi
    movq    $0, %rax
    call    fprintf@plt
    jmp     outer_loop

error_badassign:
    movq    stderr@GOTPCREL(%rip), %rdi
    movq    (%rdi), %rdi
    leaq    err_badassign(%rip), %rsi
    movq    $0, %rax
    call    fprintf@plt
    jmp     outer_loop

error_badtoken:
    movq    stderr@GOTPCREL(%rip), %rdi
    movq    (%rdi), %rdi
    leaq    err_badtoken(%rip), %rsi
    movq    $0, %rax
    call    fprintf@plt
    jmp     outer_loop

error_divzero:
    movq    stderr@GOTPCREL(%rip), %rdi
    movq    (%rdi), %rdi
    leaq    err_divzero(%rip), %rsi
    movq    $0, %rax
    call    fprintf@plt
    jmp     outer_loop
