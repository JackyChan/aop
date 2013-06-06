aop
===

js aop library

aop.js 借鉴自 aop-php 的实现方式，提供了 aop_add_before(), aop_add_after(), aop_add_around() 三个接口，及 AopJoinPoint 类。
但因JS本身的语言特性，aop.js不支持对属性读/写增加切点，只支持方法或函数的调用。
