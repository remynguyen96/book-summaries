- [Design Patterns](#design-patterns)
  - [Creational Patterns](#creational-patterns)
    - [Singleton](#singleton)
    - [Factory](#factory)
  - [Structural Patterns](#structural-patterns)
    - [Decorator](#decorator)
    - [Adapter](#adapter)
    - [Mixins](#mixins)
    - [Value Object](#value-object)
  - [Behavioral Patterns](#behavioral-patterns)
    - [Observer](#observer)
    - [Template Method](#template-method)
    - [Memento](#memento)
    - [Command](#command)
  - [Data and State Management Patterns](#data-and-state-management-patterns)
    - [Promisify Data](#promisify-data)

# Design Patterns

A design pattern is a reusable template for solving a common software design problems, enhancing code readability, maintainability, efficiency and creating a common language for developers to communicate.

**Idea**: Anyone can create a design pattern. it typically starts as a blog post or an article setting a name and explaining the problem and the solution that was already implemented in a real-world example.

## Creational Patterns

They aim to solve the problems associated with creating objects in a way that enhances flexibility and reusability. The primary purpose of creational design patterns is to separate the logic of object creation from the rest of the code.

### Singleton

**Problem to Solve:** Ensure that a class has only one instance and provide a global point of access to it.

**Solution:** Restrict the instantiation of a class to one object and provide a method to access this instance.

**Use Cases:** Logging, Caching, Thread Pools, Configuration Settings, Device Manager, State Management, etc.

### Factory

**Problem to Solve:** Object creation can become complex and may involve multiple steps, conditional logic, or dependencies.

**Solution:** The factory pattern encapsulates the object creation process within a separate method or class, isolating it from the rest of the application logic.

**Use Cases:** UI element creation, Different types of notifications, Data Parsers

## Structural Patterns

Solutions for composing classes and objects to form larger structures while keeping them flexible and efficient. They focus on simplifying and relationships between entities to ensure system maintainability and scalability.

### Decorator

**Problem to Solve:** Add additional functionality to objects dynamically without modifying their structure.

**Solution:** Wrap an object with another object that adds the desired behavior.

**Use Cases:**
  - Adding logging, validation, or caching to method calls.
  - Extending user interface components with additional features.
  - Wrapping API responses to format or process data before passing it on.

### Adapter

**Problem to Solve:** Allow incompatible interfaces to work together.

**Solution:** Create an adapter that translates one interface into another that a client expects.

**Use Cases:**
  - Integrating third-party libraries with different interfaces into your application.
  - Adapting legacy code to work with new systems or APIs.
  - Converting data formats.

### Mixins

**Problem to Solve:** Share functionality between classes without using inheritance.

**Solution:** Create a class containing methods that can be used by other classes and apply it to multiple classes.

**Use Cases:** Integrating third-party libraries with different interfaces into your application.

```js
let sayHiMixin = {
  sayHi() {
    console.log(`Hello ${this.name}`);
  },
  sayBye() {
    console.log(`Bye ${this.name}`);
  }
};

class User {
  constructor(name) {
    this.name = name;
  }
}

Object.assign(User.prototype, sayHiMixin);
```

### Value Object

**Problem to Solve:** Represent a value that is immutable and distinct from other objects based on its properties rather than its identity.

**Solution:** Create a class where instances are considered equal if all their properties are equal and ensure the object is immutable.

**Use Cases:** Representing complex data types like money, coordinates, or dates.

```js
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
    // Freeze the object to make it immutable
    Object.freeze(this);
  }

  equals(other) {
    return other instanceof Money &&
      this.amount === other.amount &&
      this.currency === other.currency;
  }
}
```

## Behavioral Patterns

Deal with object interaction and responsibility distribution. They focus on how objects communicate and cooperate, ensuring that the system is flexible and easy to extend.

### Observer

**Problem to Solve:** Allow an object (subject) to notify other objects (observers) about changes in its state without requiring them to be tightly coupled.

**Solution:** Define a subject that maintains a list of observers and notifies them of any state changes, typically by calling one of their methods.

**Use Cases:**
  - Event handlers
  - Real-time notifications
  - Ul updates

### Template Method

**Problem to Solve:** Define the skeleton of an algorithm that will change on different implementations.

**Solution:** Create a class with a template method that outlines the algorithm and make subclasses to override specific steps of the algorithm.

**Use Cases:** Data Processing

```js
class DataProcessor {
  process() {
    this.loadData();
    this.processData();
    this.saveData();
  }
}

class JSONDataProcessor extends DataProcessor {
  loadData () { /* code */ }
  processData () { /* code */ }
  saveData () { /* code */
}
```

### Memento

**Problem to Solve:** Capture and externalize an object's internal state so that it can be restored later, without violating encapsulation.

**Solution:** Create an object that stores the state of the original object and provide methods to save and restore the state.

**Use Cases:** Undo/Redo functionality

```js
class HistoryManager {
  history = [];

  push() {
    this.history.push(createMemento());
  }

  pop() {
    if (this.history.length === 0) return null;

    return this.history.pop();
  }
}
```

### Command

**Problem to Solve:** How to avoid hard-wiring a request from its invoker.

**Solution:** create an object that is used to encapsulate all information needed to perform an action or trigger an event at a later time

**Use Cases:** Manage the actions of your app (such as Add, Delete, print, save, load)

## Data and State Management Patterns

**Problem to Solve:**

**Solution:**

**Use Cases:**

### Promisify Data

**Problem to Solve:** Data management tends to change in the future, and when working with static hardcoded data is difficult to move later to an async call.

**Solution:** Use Promises to deliver all data, including sync data by resolving the Promise statically.

**Use Cases:** • Hardcoded data, Access to sync APIs, such as Local Storage.


