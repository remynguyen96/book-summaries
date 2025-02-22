This chapter covers:
 - Thinking in functional terms
 - Learning the what and why of functional programming
 - Understanding the principles of immutability and pure function
 - Functional programming techniques and their impact on overall design

> OO makes code understandable by encapsulating moving parts
> FP makes code understandable by minimizing moving parts

When thinking about an application's design, ask yourself the following questions in terms of these design principles:
- **Extensibility**: Do I constantly refactor my code to support additional functionality?
- **Easy to modularize**: If I change one file, is another file affected?
- **Reusability**: Is there a lot of duplication?
- **Testability**: Do I struggle to unit test my functions?
- **Easy to reason about**: Is my code unstructured and hard to follow?

FP requires a shift in the way you think about problems. FP isn’t a new tool or an API, but a different approach to problem solving that will become intuitive once you understand the basic principles.

FP requires you to think a bit differently about how to approach the tasks you’re facing. It’s not a matter of just applying functions to come up with a result; the goal, rather, is to **_abstract control flows** and **operations_** on data with functions in order to **_avoid side effects_** and **_reduce mutation of state_** in your application.

 Fundamental concepts in FP:
 - Declarative programming
 - Pure functions
 - Referential transparency
 - Immutability

### Functional programming is declarative

The more popular models used today, though, are **_imperative_** or **_procedural_**, and are supported in most structured and object-oriented languages like Java, C#, C++, and others. **Imperative programming** treats a computer program as merely a sequence of top-to-bottom statements that changes the state of the system in order to compute a result.

Let’s look at a simple imperative example. Suppose you need to square all the numbers in an array. An imperative program follows these steps:

```ts
var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
for(let i = 0; i < array.length; i++) {
   array[i] = Math.pow(array[i], 2);
}

array; //-> [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

  Imperative programming tells the computer, in great detail, **_how_** to perform a certain task (looping through and applying the square formula to each number, in this case). This is the most common way of writing this code and will most likely be your first approach to tackling this problem.

**Declarative programming**, on the other hand, separates program description from evaluation. It focuses on the use of **_expressions_** to describe what the logic of a program is without necessarily specifying its control flow or state changes.

Shifting to a functional approach to tackle this same task, you only need to be concerned with applying the right behavior at each element and cede control of looping to other parts of the system. You can let `Array.map()` do most of the heavy lifting:
```ts
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => Math.pow(num, 2));

//-> [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

### Pure functions and the problem with side effects

Functional programming is based on the premise that you build immutable programs based on the building blocks of pure functions. A pure function has the following qualities:
- It depends only on the input provided and not on any hidden or external state that may change during its evaluation or between calls.
- It doesn’t inflict changes beyond their scope, such as modifying a global object or a parameter passed by reference.

This function is impure because it reads/modifies an external variable, `counter`, which isn’t local to the function’s scope.
```ts
var counter = 0;
function increment() {
   return ++counter;
}
```

![Pure_functions_and_the_problem_with_side_effects.png](Pure_functions_and_the_problem_with_side_effects.png)

 Another common side effect occurs when accessing instance data via the this keyword. The behavior of this in JavaScript is unlike it is in any other programming language because it determines the runtime context of a function. This often leads to code that’s hard to reason about, which is why I avoid it when possible.
Side effects can occur in many situations, including these:
- Changing a variable, property, or data structure globally
- Changing the original value of a function’s argument
- Processing user input
- Throwing an exception, unless it’s caught within the same function
- Printing to the screen or logging
- Querying the HTML documents, browser cookies, or databases

There are two simple enhancements which you can make at the moment:
- Separate this long function into shorter functions, each with a single purpose.
- Reduce the number of side effects by explicitly defining all arguments needed for the functions to carry out their job.

With currying (a popular FP technique), you can partially set some of the arguments of a function in order to reduce them down to one.

Making function's result consistent and predicable. This is a quality of pure functions called **_referential transparency_**.
### Referential transparency and substitutability

Referential transparency is a more formal way of defining a pure function. _Purity_ in this sense refers to the existence of a pure mapping between a function’s arguments and its return value. Hence, if a function consistently yields the same result on the same input, it’s said to be _referentially transparent_. In order to make a function referentially transparent, you need to remove its dependent state and make it an explicit formal parameter of the function signature.

We seek this quality in functions because it not only makes code easier to test, but also allows us to _reason about entire programs_ much more easily. Referential transparency or _equational correctness_ is inherited from math, but functions in programming languages behave nothing like mathematical functions; so achieving referential transparency is strictly on us

Let’s look at this more concretely and assume that any program can be defined as a set of functions that processes a given input and produces an output. Here it is in pseudo form:
```ts
Program = [Input] + [func1, func2, func3, ...] -> Output

// E.g.
var input = [80, 90, 100];
var average = (arr) => divide(sum(arr), size(arr));
average (input); //-> 90
```

### Preserving immutable data

_Immutable data_ is data that can’t be changed after it’s been created. In JavaScript, as with many other languages, all primitive types (String, Number, and so on) are inherently immutable. But other objects, like arrays, aren’t immutable; even if they’re passed as input to a function, you can still cause a side effect by changing the original content. Consider this simple array-sorting code:

```ts
var sortDesc = arr => {
    return arr.sort(
       (a, b) => b - a
    );
};

var arr = [1,2,3,4,5,6,7,8,9];
sortDesc(arr); //-> [9,8,7,6,5,4,3,2,1]
```

At a glance, this code seems perfectly fine and side effect–free. It does what you’d expect it to do—you provide an array, and it returns the same array sorted in descending order. Unfortunately, the Array.sort function is stateful and causes the side effect of sorting the array in place—the original reference is changed.

_functional programming refers to the declarative evaluation of pure functions to create immutable programs by avoiding externally observable side effects_

Most of the issues JavaScript developers face nowadays are due to the heavy use of large functions that rely greatly on externally shared variables, do lots of branching, and have no clear structure. Unfortunately, this is the situation for many JavaScript applications today—even successful ones made up of many files that execute together, forming a shared mesh of mutable, global data that can be hard to track and debug.

Being forced to think in terms of pure operations and looking at functions as sealed _units of work_ that never mutate data can definitely reduce the potential for bugs. Understanding these core principles is important in order to reap the benefits functional programming brings to your code, which will guide you on the path to overcoming complexity.

### Benefits of functional programming

Now let’s explore at a high level the benefits FP brings to your JavaScript applications. The following subsections explain how it can
- Encourage you to decompose tasks into simple functions
- Process data using fluent chains
- Decrease the complexity of event-driven code by enabling reactive paradigms

#### Encouraging the decomposition of complex tasks

At a high level, functional programming is effectively the interplay between decomposition (breaking programs into small pieces) and composition (joining the pieces back together). It’s this duality that makes functional programs modular and so effective. Modularization in FP is closely related to the _singularity_ principle, which states that functions should have a single purpose;

Purity and referential transparency encourage you to think this way because in order to glue simple functions together, they must agree on the types of inputs and outputs. From referential transparency, you learn that a function’s complexity is sometimes directly related to the number of arguments it receives (this is merely a practical observation and not a formal concept indicating that the lower the number of function parameters, the simpler the function tends to be).

The **composition** of two functions is another function that results from taking the output of one and plugging it into the next. Assume that you have two functions f and g. Formally, this can be expressed as follows:
`f • g = f(g(x))`
This formula reads “f composed of g,” which creates a loose, type-safe relationship between g’s return value and f’s argument. The requirement for two functions to be compatible is that they must agree in the number of arguments as well as their types.

Understanding compose is crucial for learning how to implementing modularity and reusability in functional applications. Functional composition leads to code in which the meaning of the entire expression can be understood from the meaning of its individual pieces—a quality that becomes hard to achieve in other paradigms.
In addition, functional composition raises the level of abstraction so that you can clearly outline all the steps performed in this code without being exposed to any of its underlying details. Because compose accepts other functions as arguments, it’s known as a _higher-order function_. But composition isn’t the only way to create fluent, modular code; in this book, you’ll also learn how to build sequences of operations by connecting operations in a chain-like manner.

#### Processing data using fluent chains

A _chain_ is a sequential invocation of functions that share a common object return value. Like composition, this idiom allows you to write terse and concise code, and it’s typically used a lot in functional as well as reactive programming JavaScript libraries. To show this, let’s tackle a different problem. Suppose you’re tasked with writing a program that computes the average grade for students who have enrolled in more than one class. Given this array of enrollment data

```ts
let enrollment = [
  {enrolled: 2, grade: 100},
  {enrolled: 2, grade: 80},
  {enrolled: 1, grade: 89}
];

// an imperative approach might look like this:
let totalGrades = 0;
let totalStudentsFound = 0;
for(let i = 0; i < enrollment.length; i++) {
    let student = enrollment[i];
    if(student !== null) {
       if(student.enrolled > 1) {
          totalGrades+= student.grade;
          totalStudentsFound++;
       }
    }
 }
 var average = totalGrades / totalStudentsFound; //-> 90
```

Just as before, decomposing this problem with a functional mindset, you can identify three major steps:
- Selecting the proper set of students (whose enrollment is greater than one)
- Extracting their grades
- Calculating their average grade

 Function chain is a **_lazy evaluated_** program, which means it defers its execution until needed. This benefits performance because you can avoid executing entire sequences of code that won’t be used anywhere else, saving precious CPU cycles. This effectively simulates the _call-by-need_ behavior built into other functional languages.

```ts
_.chain(enrollment)
	.filter(student => student.enrolled > 1)
	.pluck('grade')
	.average()
	.value(); // 90
```
``
#### Reacting to the complexity of asynchronous applications

If you remember the last time you had to fetch remote data, handle user input, or interact with local storage, you probably recall writing entire sections of business logic into nested sequences of callback functions. This callback pattern breaks the linear flow of your code and becomes hard to read, because it’s cluttered with nested forms of success- and error-handling logic. This is all about to change.

**Reactive programming** is probably one of the most exciting and interesting applications of functional programming. You can use it to dramatically reduce the complexity in asynchronous and event-driven code that you, as JavaScript developers, deal with on a daily basis on the client as well as the server.

The main benefit of adopting a reactive paradigm is that it raises the level of abstraction of your code, allowing you to focus on specific business logic while forgetting about the arduous boilerplate code associated with setting up asynchronous and event-based programs. Events come in many flavors: mouse clicks, text field changes, focus changes, handling new HTTP requests, database queries, file writes, and so on

Functional programming is a paradigm shift that can dramatically transform the way you tackle solutions to any programming challenges. So is FP a replacement for the more popular object-oriented design? Fortunately, applying functional programming to your code isn’t an all-or-nothing approach, as noted in the Michael Feathers quote at the beginning of this chapter.

 In fact, lots of applications can benefit from using FP alongside an object-oriented architecture. Due to rigid control for immutability and shared state, FP is also known for making multithreaded programming more straightforward. Because JavaScript is a single-threaded platform, this isn’t something we need to worry about or cover in this book.
 
In traditional OOP, you’re accustomed to programming in the imperative/procedural style; changing this will require you to make a drastic shift in your thought processes as you begin to tackle problems the “functional way.”

### Summary

- Code that uses pure functions has zero chance of changing or breaking global state, which helps make your code more testable and maintainable.
- Functional programming is done in a declarative style that’s easy to reason about. This improves the overall readability of the application and makes your code leaner through a combination of functions and lambda expressions.
- Data processing in a collection of elements is done fluently via function chains that link operations such as map and reduce.
- Functional programming treats functions as building blocks by relying on first-class, higher-order functions to improve the modularity and reusability of your code.
- You can reduce the complexity of event-based programs by combining functional with reactive programming.

