### Overview

If we want to share properties among many objects of the same type, we can use the Prototype pattern.

The Prototype Pattern in JavaScript leverages the language's built-in prototypal inheritance to create objects that share properties and methods with a prototype object. This pattern is particularly useful for creating objects that need to share behavior or for optimizing the creation process of complex objects. By using the `Object.create` method, developers can efficiently clone and extend objects, making the Prototype Pattern a powerful tool in JavaScript development.

![Prototype_Pattern](Prototype_Pattern.png)

### Implementation

```js
class Dog {
	constructor(name, age) {
		this.name = name;
		this.age = age;
	}

	bark() {
		console.log(`${this.name} is barking!`);
	}

	wagTail() {
		console.log(`${this.name} is wagging their tail!`);
	}
}

const dog1 = new Dog('Max', 4);
const dog2 = new Dog('Sam', 2);
```

Define a prototype object:

```js
const personalPrototype = {
	init(name, age) {
		this.name = name;
		this.age = age;
	},
	getDetails() {
		console.log(`Name: ${this.name}, Age: ${this.age})`);
	}
}

// Create a new person object using the prototype
function createPerson(name, age) {
	const person = Object.create(personalPrototype);
	person.init(name, age);

	return person;
}

// Usage 
const person1 = createPerson('Alice', 30); 
const person2 = createPerson('Bob', 25);

personalPrototype.greet = function() {
	console.log(`Hello, my name is ${this.name}`)
}

console.log(person1.greet === person2.greet); // Output: true
person1.greet(); // Hello, my name is Alice 
person2.greet(); // Hello, my name is Bob
```

### Tradeoffs

> **✅ Memory efficient**: The prototype chain allows us to access properties that aren't directly defined on the object itself, we can avoid duplication of methods and properties, thus reducing the amount of memory used.

> **⚠️ Readability**: When a class has been extended many times, it can be difficult to know where certain properties come from. For example, if we have a `BorderCollie` class that extends all the way to the `Animal` class, it can be difficult to trace back where certain properties came from.
