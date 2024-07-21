- [Pure Function](#pure-function)
		- [Why?](#why)
- [Currying](#currying)
- [Composition](#composition)
- [References](#references)

## Pure Function

We could look at three little tests to know if we're writing a function or not:
1. Total - For every input there is a corresponding output
2. Deterministic - Always receive the same output for a given input
3. No Observable Side-Effects - No side effects besides computing a value

```js
// Not a function 🚫
const toSlug = (title) => {
	const urlFriendly = title.replace(/\W+/ig, '-');

	if (urlFriendly.length < 1) {
		throw new Error('is bad');
	}

	return urlFriendly;
}

// Function ✅
const toSlug = (title) => {
	return new Promise((res, rej) => {
		const urlFriendly = title.replace(/\W+/ig, '-');

		if (urlFriendly.length < 1) {
			rej(new Error('is bad'));
		}

		return res(urlFriendly);
	});
}
```

```js
// Not a function 🚫
const signUp = (attrs) => {
	let user = saveUser(attrs);
	welcomeUser(user)
}

// Function ✅
const signUp = (attrs) => {
	return () => {
		let user = saveUser(attrs);
		welcomeUser(user)
	}
}
```

#### Why?
- Reliable
- Portable
- Reusable
- Testable
- Composable
- Properties/Contract

## Currying

```js
// Simple example to show how curry works
const add = (x, y) => x + y;

const curry = f => x => y => f(x, y)
const uncurry = f => (x, y) => f(x)(y)

const curriedAdd = curry(add);
const increment = curriedAdd(1);
const result = increment(4) // Output: 5;


const uncurriedAdd = uncurry(curriedAdd);
const result2 = uncurriedAdd(1, 4) // Output: 5;
```

```js
const isOdd = (x) => x % 2;
const filter = curry((f, xs) => xs.filter(f));

const getOdds = filter(isOdd);
const result = getOdds([1,2,3,4,5]) // Output: 1,3,5
```

Currying Exercises: https://codepen.io/drboolean/pen/OJJOQMx?editors=1010

```js
// Curry Implementation
function curry(fn) {
	if (typeof fn !== 'function') throw Error('Parameter should be a function!');

	return function curried(...args) {
		if (args.length >= fn.length) {
			return fn.apply(this, args);
		}

		return function (...args2) {
			return curried.apply(this, args.concat(args2));
		}
	}
}

// E.g.
function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);
console.log(curriedSum(1, 2, 3)); // 6, still callable normally
console.log(curriedSum(1)(2,3)); // 6, currying of 1st arg
console.log(curriedSum(1)(2)(3)); // 6, full currying
```

## Composition

```js
const curry = f => x => y => f(x, y)

// Simple example to show how compose works
const compose = (f, g) => x => f(g(x))

const exclaim = str => str + '!';
const toUpper = str => str.toUpperCase();
const first = xs => xs[0];
const log = curry((tag, x) => (console.log(tag, x), x));

const loudFirst = compose(toUpper, first);
const shout = compose(log('Here:'), loudFirst)

console.log(shout('tears'))
// Log: Here: T
// Output: T
```

Composition Exercises: https://codepen.io/drboolean/pen/zYYPmZO?editors=1010

```ts
// const x = h(g(f(xs))) = compose(h, g, f)
// Simple example to show how compose worksk
const compose = (f, g) => x => f(g(x))

// Compose Implementation
function compose(...fns) {
	return (initialValue) => {
		return fns.reduceRight((params, fn) => {
			return fn(params);
		}, initialValue)
	}
}

type UnaryFunction<T, R> = (arg: T) => R

function compose<T>(...fns: UnaryFunction<any, any>[]): UnaryFunction<T, any> {
	return (initialValue: T): any => (
		fns.reduceRight((acc, fn) => fn(acc), initialValue);
	)
}
```

## Functor
Is a design pattern that allow you to apply a function to values wrapped in a context. This context could be a container or a data structure, like an array, a list, or a more complex structure like an `Option` or `Maybe` type.
**Key Concepts of Functors:**
- **Contextual Wrapper**: A functor is a type that implements a `map` function. The `map` function takes a function as an argument and applies that function to the value(s) inside the functor's context.
- **Preserves Structure**: The `map` function applies the given function to the values without altering the structure of the functor.
**Functor Laws:**
- **Identity Law**: Mapping the identity function over a functor should return the same functor.
	`// Identity law: F.map(x => x) === F`
- **Composition Law**: Mapping the composition of two functions should be the same as mapping one function and then mapping the other.
	`// Composition law: F.map(x => f(g(x))) === F.map(g).map(f)`

```js
class Box {
	constructor(value) {
		this.value = value;
	}

	// Functor's map method
	map(fn) {
		return new Box(fn(this.value));
	}
}
// Example usage
const box = new Box(3);
const result = box.map(x => x + 1).map(x => x * 2);
```

```js
const Box = x => ({
	map: f => Box(f(x)),
	fold: f => f(x),
	inspect: `Box(${x})`
});

const result = Box('a')
				.map(x => x.toUpperCase())
				.fold(x => String.fromCharCode(x))
console.log(result); // Output:
```

## Monad

A monad is a design pattern used in functional programming to handle computations in a consistent way. It provides a way to chain operations together, managing side effects and asynchronous computations without compromising the purity of functions.
**Key Components:**
- **Type Constructor:** A monad wraps a value in a specific context. This is often represented as a generic type or class in programming languages.
- **Unit (or Return):** A function that takes a value and wraps it in the monad's context.
- **Bind (or FlatMap):** A function that chains operations on monads, allowing you to apply functions that return monads without nesting them.
**Monad Laws:** Must adhere to three laws to ensure they behave consistently
- **Left Identity**: Applying `unit` to a value and then `bind` with a function `f` is the same as applying `f` directly to the value.
`unit(a).bind(f) === f(a)
- **Right Identity**: Applying `bind` with `unit` to a monad is the same as the original monad.
`m.bind(unit) === m`
- **Associatively**: The order of applying `bind` operations should not matter.
**Why Use Monads?**
- **Error Handling**: Monads like `Maybe` or `Either` provide a way to handle errors and missing values without using exceptions.
- **Chaining Operations**: Monads allow you to chain operations, making code more readable and composable.
- **Managing Side Effects**: Monads like `IO` or `Task` encapsulate side effects, keeping functions pure and referentially transparent.

```ts
class Maybe<T> {
    private constructor(private value: T | null) {}

    static of<T>(value: T | null): Maybe<T> {
        return new Maybe(value);
    }

    isNothing(): boolean {
        return this.value === null || this.value === undefined;
    }

    map<U>(f: (value: T) => U): Maybe<U> {
        return this.isNothing() ? Maybe.of<U>(null) : Maybe.of<U>(f(this.value!));
    }

    flatMap<U>(f: (value: T) => Maybe<U>): Maybe<U> {
        return this.isNothing() ? Maybe.of<U>(null) : f(this.value!);
    }

    getOrElse(defaultValue: T): T {
        return this.isNothing() ? defaultValue : this.value!;
    }
}

// Example usage:

const maybeNumber = Maybe.of(5);

const result = maybeNumber
    .map(x => x * 2)
    .flatMap(x => Maybe.of(x + 3))
    .getOrElse(0);

console.log(result); // Output: 13
```

## References
https://mostly-adequate.gitbook.io/mostly-adequate-guide

https://github.com/FrontendMasters/hardcore-functional-js-v2/tree/solutions

![Functional Programming Part 1](FP-Class-v2.pdf)

![Functional Programming Part 2](FP-Arch-Class.pdf)
