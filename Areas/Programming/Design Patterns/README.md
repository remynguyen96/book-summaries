- [Design Principles](#design-principles)
  - [Encapsulate What Varies](#encapsulate-what-varies)
      - [Encapsulation on a method level](#encapsulation-on-a-method-level)
      - [Encapsulation on a class level](#encapsulation-on-a-class-level)
      - [Program to an Interface, not an Implementation](#program-to-an-interface-not-an-implementation)
      - [Favor Composition Over Inheritance](#favor-composition-over-inheritance)
- [SOLID Principles](#solid-principles)
  - [Single Responsibility Principle](#single-responsibility-principle)
  - [Open/Closed Principle](#openclosed-principle)
  - [Liskov Substitution Principle](#liskov-substitution-principle)
  - [Interface Segregation Principle](#interface-segregation-principle)
  - [Dependency Inversion Principle](#dependency-inversion-principle)
- [Design Patterns](#design-patterns)
  - [Creational Patterns](#creational-patterns)
    - [Singleton](#singleton)
    - [Factory](#factory)
      - [Factory Method](#factory-method)
      - [Abstract Factory](#abstract-factory)
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
## Design Principles
What is good software design? How would you measure it? What practices would you need to follow to achieve it? How can you make your architecture flexible, stable and easy to understand?
### Encapsulate What Varies
Identify the aspects of your application that vary and separate them from what stays the same.
The main goal of this principle is to minimize the effect caused by changes. The less time you spend making changes, the more time you have for implementing features.
##### Encapsulation on a method level
Say you’re making an e-commerce website. Somewhere in your code, there’s a `getOrderTotal` method that calculates a grand total for the order, including taxes. We can anticipate that tax-related code might need to change in the future. The tax rate depends on the country, state or even city where the customer resides, and the actual formula may change over time due to new laws or regulations. As a result, you’ll need to change the `getOrderTotal` method quite often. But even the **method’s name** suggests that it doesn’t care about how the tax is calculated.

```ts
method getOrderTotal(order) is
	total = 0
	foreach item in order.lineItems
		total += item.price * item.quantity
	total += total * getTaxRate(order.country)
	return total

method getTaxRate(country) is
if (country == "US")
	return 0.07 // US sales tax
else if (country == "EU")
	return 0.20 // European VAT
else
	return 0
```
Tax-related changes become isolated inside a single method. Moreover, if the tax calculation logic becomes too complicated, it’s now easier to move it to a separate class.
##### Encapsulation on a class level
Over time you might add more and more responsibilities to a method which used to do a simple thing. These added behaviors often come with their own helper fields and methods that eventually blur the primary responsibility of the containing class. Extracting everything to a new class might make things much more clear and simple.
##### Program to an Interface, not an Implementation
Program to an interface, not an implementation. Depend on abstractions, not on concrete classes.
When you want to make two classes collaborate, you can start by making one of them dependent on the other. Hell, I often start by doing that myself. However, there’s another, more flexible way to set up collaboration between objects:
1. Determine what exactly one object needs from the other: which methods does it execute?
2. Describe these methods in a new interface or abstract class.
3. Make the class that is a dependency implement this interface.
4. Now make the second class dependent on this interface rather than on the concrete class. You still can make it work with objects of the original class, but the connection is now much more flexible.
![Design-Principles-1](Design-Principles-1.png)
##### Favor Composition Over Inheritance
Inheritance is probably the most obvious and easy way of reusing code between classes. You have two classes with the same code. Create a common base class for these two and move the similar code into it. Piece of cake!
Unfortunately, inheritance comes with caveats that often become apparent only after your program already has tons of classes and changing anything is pretty hard. Here’s a list of those problems.
- **A subclass can’t reduce the interface of the superclass**. You have to implement all abstract methods of the parent class even if you won’t be using them
- **When overriding methods you need to make sure that the new behavior is compatible with the base one**. It’s important because objects of the subclass may be passed to any code that expects objects of the superclass and you don’t want that code to break.
- **Inheritance breaks encapsulation of the superclass because the internal details of the parent class become available to the subclass**. There might be an opposite situation where a programmer makes a superclass aware of some details of subclasses for the sake of making further extension easier.
- **Subclasses are tightly coupled to superclasses**. Any change in a superclass may break the functionality of subclasses.
- **Trying to reuse code through inheritance can lead to creating parallel inheritance hierarchies**. Inheritance usually takes place in a single dimension. But whenever there are two or more dimensions, you have to create lots of class combinations, bloating the class hierarchy to a ridiculous size.

Whereas inheritance represents the **“is a”** relationship between classes (a car is a transport), composition represents the **“has a”** relationship (a car has an engine). I should mention that this principle also applies to **aggregation**—a more relaxed variant of composition where one object may have a reference to the other one but doesn’t manage its lifecycle. Here’s an example: a car has a driver, but he or she may use another car or just walk without the car.
## SOLID Principles
SOLID is a mnemonic for five design principles intended to make software designs more understandable, flexible and maintainable.
As with everything in life, using these principles mindlessly can cause more harm than good. The cost of applying these principles into a program’s architecture might be making it more complicated than it should be. I doubt that there’s a successful software product in which all of these principles are applied at the same time. Striving for these principles is good, but always try to be pragmatic and don’t take everything written here as dogma.
### Single Responsibility Principle
>A class should have just one reason to change.

Try to make every class responsible for a single part of the functionality provided by the software, and make that responsibility entirely encapsulated by (you can also say hidden within) the class. The main goal of this principle is reducing complexity. You don’t need to invent a sophisticated design for a program that only has about 200 lines of code. Make a dozen methods pretty, and you’ll be fine.
The real problems emerge when your program constantly grows and changes. At some point classes become so big that you can no longer remember their details. Code navigation slows down to a crawl, and you have to scan through whole classes or even an entire program to find specific things. The number of entities in program overflows your brain stack, and you feel that you’re losing control over the code.
There’s more: if a class does too many things, you have to change it every time one of these things changes. While doing that, you’re risking breaking other parts of the class which you didn’t even intend to change.
If you feel that it’s becoming hard to focus on specific aspects of the program one at a time, remember the single responsibility principle and check whether it’s time to divide some classes into parts.
### Open/Closed Principle
> Class should be open for extension and closed for modification.

The main idea of this principle is to keep existing code from breaking when you implement new features.
A class is open if you can extend it, produce a subclass and do whatever you want with it — add new methods or fields, override base behavior, etc.
Some programming languages let you restrict further extension of a class with special keywords, such as `final` . After this, the class is no longer open. At the same time, the class is closed (you can also say complete) if it’s 100% ready to be used by other classes—its interface is clearly defined and won’t be changed in the future.

If a class is already developed, tested, reviewed, and included in some framework or otherwise used in an app, trying to mess with its code is risky. Instead of changing the code of the class directly, you can create a subclass and override parts of the original class that you want to behave differently. You’ll achieve your goal but also won’t break any existing clients of the original class.

This principle isn’t meant to be applied for all changes to a class. If you know that there’s a bug in the class, just go on and fix it; don’t create a subclass for it. A child class shouldn’t be responsible for the parent’s issues.
### Liskov Substitution Principle
>When extending a class, remember that you should be able to pass objects of the subclass in place of objects of the parent class without breaking the client code.

This means that the subclass should remain compatible with the behavior of the superclass. When overriding a method, extend the base behavior rather than replacing it with something else entirely.

The substitution principle has a set of formal requirements for subclasses, and specifically for their methods. Let’s go over this checklist in detail:
- **Parameter types in a method of a subclass should match or be more abstract than parameter types in the method of the superclass**. Sounds confusing? Let’s have an example.
	- Say there’s a class with a method that’s supposed to feed cats: `feed(Cat c)`. Client code always passes cat objects into this method.
	- **Good:** Say you wcreated a subclass that overrode the method so that it can feed any animal (a superclass of cats): `feed(Animal c)`. Now if you pass an object of this subclass instead of an object of the superclass to the client code, everything would still work fine. The method can feed all animals, so it can still feed any cat passed by the client.
	- **Bad:** You created another subclass and restricted the feeding method to only accept Bengal cats (a subclass of cats): `feed(BengalCat c)`. What will happen to the client code if you link it with an object like this instead of with the original class? Since the method can only feed a specific breed of cats, it won’t serve generic cats passed by the client, breaking all related functionality.
- **The return type in a method of a subclass should match or be a subtype of the return type in the method of the superclass.** - As you can see, requirements for a return type are inverse to requirements for parameter types.
	- Say you have a class with a method `buyCat(): Cat`. The client code expects to receive any cat as a result of executing this method.
	- **Good:** `buyCat(): BengalCat` - The client gets a Bengal cat, which is still a cat, so everything is okay.
	- **Bad:** `buyCat(): Animal` - Now the client code breaks since it receives an unknown generic animal (an alligator? a bear?) that doesn’t fit a structure designed for a cat.
- **A method in a subclass shouldn’t throw types of exceptions which the base method isn’t expected to throw.** In other words, types of exceptions should match or be subtypes of the ones that the base method is already able to throw. This rule comes from the fact that try-catch blocks in the client code target specific types of exceptions which the base method is likely to throw.
- **A subclass shouldn’t strengthen pre-conditions** - For example, the base method has a parameter with type int . If a subclass overrides this method and requires that the value of an argument passed to the method should be positive (by throwing an exception if the value is negative), this strengthens the pre-conditions. The client code, which used to work fine when passing negative numbers into the method, now breaks if it starts working with an object of this subclass.
- **A subclass shouldn’t weaken post-conditions**
- **A of a superclass must be preserved** - Invariants are conditions in which an object makes sense. The rule on invariants is the easiest to violate because you might misunderstand or not realize all of the invariants of a complex class. Therefore, the safest way to extend a class is to introduce new fields and methods, and not mess with any existing members of the superclass. Of course, that’s not always doable in real life.
- **A subclass shouldn’t change values of private fields of the superclass**.
Example: Let’s look at an example of a hierarchy of document classes that violates the substitution principle.
![Design-Principles-2](Design-Principles-2.png)
![Design-Principles-3](Design-Principles-3.png)
### Interface Segregation Principle
> Clients shouldn't be forced to depend on methods they do not use

Try to make your interfaces narrow enough that client classes don’t have to implement behaviors they don’t need. According to the interface segregation principle, you should break down “fat” interfaces into more granular and specific ones. Clients should implement only those methods that they really need. Otherwise, a change to a “fat” interface would break even clients that don’t use the changed methods.
Don’t further divide an interface which is already quite specific. Remember that the more interfaces you create, the more complex your code becomes. Keep the balance.
### Dependency Inversion Principle
> High-level classes shouldn't depend on low-level classes. Both should depend on abstractions. Abstractions shouldn't depend on details. Details should depend on abstractions.

Usually when designing software, you can make a distinction between two levels of classes.
- **Low-level classes** implement basic operations such as working with a disk, transferring data over a network, connecting to a database, etc.
- **High-level classes** contain complex business logic that directs low-level classes to do something.
The dependency inversion principle often goes along with the open/closed principle: you can extend low-level classes to use with different business logic classes without breaking existing classes.

![Design-Principles-4](Design-Principles-4.png)
![Design-Principles-5](Design-Principles-5.png)
## Design Patterns

Aj design pattern is a reusable template for solving a common software design problems, enhancing code readability, maintainability, efficiency and creating a common language for developers to communicate.

**Idea**: Anyone can create a design pattern. it typically starts as a blog post or an article setting a name and explaining the problem and the solution that was already implemented in a real-world example.

### Creational Patterns
They aim to solve the problems associated with creating objects in a way that enhances flexibility and reusability. The primary purpose of creational design patterns is to separate the logic of object creation from the rest of the code.
#### Singleton

**Problem to Solve:** Ensure that a class has only one instance and provide a global point of access to it.

**Solution:** Restrict the instantiation of a class to one object and provide a method to access this instance.

**Use Cases:** Logging, Caching, Thread Pools, Configuration Settings, Device Manager, State Management, etc.

#### Factory

**Problem to Solve:** Object creation can become complex and may involve multiple steps, conditional logic, or dependencies.

**Solution:** The factory pattern encapsulates the object creation process within a separate method or class, isolating it from the rest of the application logic.

**Use Cases:** UI element creation, Different types of notifications, Data Parsers
##### Factory Method
Factory Method is a creational design pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.
**Problems:** Adding a new class to the program isn’t that simple if the rest of the code is already coupled to existing classes.
**Solution:** The Factory Method pattern suggests that you replace direct object construction calls (using the `new` operator) with calls to a special factory method. Now you can override the factory method in a subclass and change the class of products being created by the method.

![FactoryMethodPattern-1](FactoryMethodPattern-1.png)
![FactoryMethodPattern-2](FactoryMethodPattern-2.png)
1. The **Product** declares the interface, which is common to all objects that can be produced by the creator and its subclasses.
2. **Concrete Products** are different implementations of the product interface.
3. The **Creator** class declares the factory method that returns new product objects. It’s important that the return type of this method matches the product interface.
4. **Concrete Creators** override the base factory method so it returns a different type of product.

```ts
interface Button {
	render: Function
	onClick: Function
}

class WindowsButton implements Button {
	render(a, b) {...}
	onClick(f) {...}
}

class HTMLButton implements Button {
	render(a, b) {...}
	onClick(f) {...}
}

abstract class Dialog {
	abstract createButton();

	render() {
		Button okButton = createButton();
		okButton.onClick(closeDialog);
		okButton.render();
	}
}

class WindowsDialog extends Dialog {
	createButton() {
		return new WindowsButton();
	}
}

class WebDialog extends Dialog {
	createButton() {
		return new HTMLButton();
	}
}

class Application {
	initialise(config) {
		config.OS === 'Windows'
			return new WindowsDialog();
		config.OS === 'Web'
			return new WebDialog();
	}
}
```

**⭐️ Use the Factory Method when you don’t know beforehand the exact types and dependencies of the objects your code should work with.

**⭐ Use the Factory Method when you want to provide users of your library or framework with a way to extend its internal components.**

**⭐ Use the Factory Method when you want to save system resources by reusing existing objects instead of rebuilding them each time.**
##### Abstract Factory
**Abstract Factory** is a creational design pattern that lets you produce families of related objects without specifying their concrete classes.
### Structural Patterns
Solutions for composing classes and objects to form larger structures while keeping them flexible and efficient. They focus on simplifying and relationships between entities to ensure system maintainability and scalability.
#### Decorator

**Problem to Solve:** Add additional functionality to objects dynamically without modifying their structure.

**Solution:** Wrap an object with another object that adds the desired behavior.

**Use Cases:**
  - Adding logging, validation, or caching to method calls.
  - Extending user interface components with additional features.
  - Wrapping API responses to format or process data before passing it on.

#### Adapter

**Problem to Solve:** Allow incompatible interfaces to work together.

**Solution:** Create an adapter that translates one interface into another that a client expects.

**Use Cases:**
  - Integrating third-party libraries with different interfaces into your application.
  - Adapting legacy code to work with new systems or APIs.
  - Converting data formats.

#### Mixins

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

#### Value Object

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

### Behavioral Patterns
Deal with object interaction and responsibility distribution. They focus on how objects communicate and cooperate, ensuring that the system is flexible and easy to extend.
#### Observer

**Problem to Solve:** Allow an object (subject) to notify other objects (observers) about changes in its state without requiring them to be tightly coupled.

**Solution:** Define a subject that maintains a list of observers and notifies them of any state changes, typically by calling one of their methods.

**Use Cases:**
  - Event handlers
  - Real-time notifications
  - Ul updates

#### Template Method

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

#### Memento

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

#### Command

**Problem to Solve:** How to avoid hard-wiring a request from its invoker.

**Solution:** create an object that is used to encapsulate all information needed to perform an action or trigger an event at a later time

**Use Cases:** Manage the actions of your app (such as Add, Delete, print, save, load)

### Data and State Management Patterns

**Problem to Solve:**

**Solution:**

**Use Cases:**

#### Promisify Data

**Problem to Solve:** Data management tends to change in the future, and when working with static hardcoded data is difficult to move later to an async call.

**Solution:** Use Promises to deliver all data, including sync data by resolving the Promise statically.

**Use Cases:** • Hardcoded data, Access to sync APIs, such as Local Storage.


