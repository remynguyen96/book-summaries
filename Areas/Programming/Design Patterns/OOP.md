**Object-oriented programming** is a paradigm based on the con- cept of wrapping pieces of data, and behavior related to that data, into special bundles called objects, which are constructed from a set of “blueprints”, defined by a programmer, called **classes**.
![OOP-UML-DIAGRAM-1](OOP-UML-1.png)

![OOP-UML-DIAGRAM-2](OOP-UML-2.png)
Object-oriented programming is based on four pillars, concepts that differentiate it from other programming paradigms.
#### Abstraction
Abstraction is a model of a real-world object or phenomenon, limited to a specific context, which represents all details relevant to this context with high accuracy and omits all the rest.
#### Encapsulation
Encapsulation is the ability of an object to hide parts of its state and behaviors from other objects, exposing only a limited interface to the rest of the program.

![OOP-UML-DIAGRAM-3](OOP-UML-3.png)
#### Inheritance
Inheritance is the ability to build new classes on top of existing ones. The main benefit of inheritance is code reuse. If you want to create a class that’s slightly different from an existing one, there’s no need to duplicate code. Instead, you extend the existing class and put the extra functionality into a resulting subclass, which inherits fields and methods of the superclass.
In most programming languages a subclass can extend only one superclass. On the other hand, any class can implement several interfaces at the same time. But, as I mentioned before, if a superclass implements an interface, all of its subclasses must also implement it.

![OOP-UML-4](OOP-UML-4.png)
#### Polymorphism
Polymorphism Let’s look at some animal examples. Most Animals can make sounds. We can anticipate that all subclasses will need to over- ride the base makeSound method so each subclass can emit the correct sound; therefore we can declare it abstract right away. This lets us omit any default implementation of the method in the superclass, but force all subclasses to come up with their own.
Polymorphism is the ability of a program to detect the real class of an object and call its implementation even when its real type is unknown in the current context.

![OOP-UML-5](OOP-UML-5.png)```
```ts
const bag = [new Cat(), new Dog()];

bag.forEach((animal) => {
	animal.makeSound();
});
// 1. Meow!
// 2. Woof!
```
#### Relations Between Objects
**Association** is a type of relationship in which one object uses or interacts with another. In UML diagrams the association relationship is shown by a simple arrow drawn from an object and pointing to the object it uses. By the way, having a bidirectional association is a completely normal thing. In this case, the arrow has a point at each end.
![OOP-UML-6](OOP-UML-6.png)
**Dependency** is a weaker variant of association that usually implies that there’s no permanent link between objects. Dependency typically (but not always) implies that an object accepts another object as a method parameter, instantiates, or uses another object. Here’s how you can spot a dependency between classes: a dependency exists between two classes if changes to the definition of one class result in modifications in another class.
![OOP-UML-7](OOP-UML-7.png)
**Composition** is a “whole-part” relationship between two objects, one of which is composed of one or more instances of the other. The distinction between this relation and others is that the component can only exist as a part of the container. In UML the composition relationship is shown by a line with a filled diamond at the container end and an arrow at the end pointing toward the component.
![OOP-UML-8](OOP-UML-8.png)
**Aggregation** is a less strict variant of composition, where one object merely contains a reference to another. The container doesn’t control the life cycle of the component. The component can exist without the container and can be linked to several containers at the same time. In UML the aggregation relationship is drawn the same as for composition, but with an empty diamond at the arrow’s base.
![OOP-UML-9](OOP-UML-9.png)