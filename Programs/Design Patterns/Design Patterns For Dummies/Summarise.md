### The big four OOP building blocks

There are four pillars of OOP — abstraction, encapsulation, polymorphism, and inheritance.

#### Abstraction is the good kind of breakdown

Abstraction isn’t a programming technique; in essence, it just means that you conceptualize a problem before applying OOP techniques.

Abstraction is all about breaking your approach to a problem into natural segments. This is where you come up with the objects that divide the problem into manageable parts. In other words, abstracting a problem simply means thinking of how to tackle that problem in terms of object-oriented code. The data items needed by each object become that object’s properties, whether public or private, and the actions each object needs to perform in the real world become its actions in code.

Much of what design patterns are all about has to do with making sure you’re setting up the way you attack the problem correctly. Working with design pat- terns often means spending more time on the abstraction part of the process than on the concrete classes part.
#### Encapsulating all that junk

When you wrap methods and data up into an object, you encapsulate those methods and data. That’s the power of working with objects — you remove the complexity from view and make it into an easily graspable object. That’s how a mass of pipes, tubing, pumps, thermostats, and lights becomes, conceptually, a refrigerator.

When you encapsulate functionality into an object, you decide what interface that object exposes to the world. That refrigerator may handle a lot of complex actions behind the scenes, but you might want to put a dial in it to let the user tell the appliance how cold he wants his food. In the same way, you decide what getter and setter methods and/or public properties your objects present to the rest of the application so that the application can interact with it.

That’s the idea behind encapsulation — you hide the complexities inside objects and then create a simple interface to let that object interact with the rest of your code. Design patterns are particularly big on encapsulation. One of the primary design insights here is that you should encapsulate what changes the most. A number of patterns revolve around that idea — extracting the part of your code that changes the most, or that needs the most maintenance, and encapsulating that part into its own object for easier handling. You see a lot about encapsulation and how to put it to work in unexpected ways to solve common problems in this book.
#### Mighty polymorphism rangers

Another cornerstone of OOP is polymorphism: the ability to write code that can work with different object types and decide on the actual object type at runtime. For example, you might want to write code that handles all kinds of different shapes — rectangles, circles, triangles, and so on. Although they’re different shapes, they all have in common certain actions as far as your code goes — for example, they can all be drawn.

Using polymorphism, you can write your code to perform various actions on the shapes you’re working with — and then decide on the actual shape(s) you want to use at runtime. Polymorphic (which means many form) code works with any such shape without being rewritten.

```ts
// Start with this Shape class that draws a generic shape when you call its draw method:

class Shape {
	public void draw() {
		System.out.println(“Drawing a shape.”); 
	}
}

// Then you extend a new class, Rectangle, from Shape, and let it draw a rectangle when you call its draw method as follows:

class Rectangle extends Shape {
	public void draw() {
		System.out.println(“Drawing a rectangle.”); 
	}
}
```


Polymorphism often comes into play when you work with design patterns because design patterns tend to favor composition over inheritance. (You use composition when your object contains other objects instead of inheriting from them.) Inheritance sets up “is-a” relationships — Rectangle “is-a” Shape, for example. As you’re going to see, however, that can introduce unexpected rigidity and problems into your code, especially when it comes time to maintain that code.

Design pattern-oriented programming often prefers object composition over inheritance. When you use composition, your code contains other objects, rather than inheriting from them. And to be supple enough to deal with the various kinds of contained objects in the same way, with the same code, design-patterns often rely on polymorphism.
#### Handling Change with “has-a” Instead of “is-a”

Here’s a design insight that you may have seen mentioned: Separate the parts of your code that will change the most from the rest of your application and try to make them as freestanding as possible for easy maintenance. You should also always try to reuse those parts as much as possible.

What this means is that if part of your application changes a lot, get it out of those large files that otherwise change very little and make the sections that change a lot as freestanding as you can so that you can make changes as easily as possible while reducing side effects. And if you can, reuse the separated components that change a lot so that if you need to make a change, that change will be made automatically throughout the many places in the code that use those components.

With inheritance, base classes and derived classes have an “is-a” relationship. That is, a Helicopter “is-a” Vehicle, which means Helicopter inherits from Vehicle, and if you have to customize the methods you inherit a great deal, you’re going to run up against maintenance issues in the future. The base class handles a particular task one way, but then a derived class changes that, and the next derived class down the line changes things yet again. So you’ve spread out how you handle a task over several generations of classes.

On the other hand, you can extract the volatile parts of your code and encapsulate them as objects, you can use those objects as you need them — and the entire task is handled by the code in such an object, it’s not spread out over generations of classes. Doing so allows you to customize your code by creating composites of objects. With composites, you select and use the objects you want, instead of having a rigid hard-coded internal way of doing things. That gives you a “has-a” relationship with those objects — a street racer “has-a” certain way of moving, which is encapsulated in an object; a helicopter “has-a” different way of moving, which is also encapsulated in an object. And each object performs a task.

When planning for change, consider “has-a” instead of “is-a” relationships, and put volatile code in the objects your application contains, rather than inheriting that code.

### Creating your algorithms
To make sure that all the algorithms implement the same methods (that’s just the go method here), you need to create an interface, the `GoAlgorithm` interface, which all algorithms must implement:

```ts
public interface GoAlgorithm {
	public void go();
}

public class GoByDrivingAlgorithm implements GoAlgorithm {
	public void go(){
		System.out.printLn("Now I'm driving.");
	}
}

public class GoByFlying implements GoAlgorithm {
	public void go(){
		System.out.printLn("Now I'm flying.");
	}
}

```

Great. You just separated algorithms from your code. You’re starting to implement “has-a” rather than “is-a” design techniques. Now you’ve got to put those algorithms to work.

### Using your algorithms

After you create an object from an algorithm, you’ve got to store that object somewhere, so I’ll add a new method to the Vehicle base class, `setGoAlgorithm`. That method stores the algorithm you want to use in an internal, private variable, `goAlgorithm` as shown in the following:

```ts
public abstract class Vehicle {
	private GoAlgorithm goAlgorithm;

	public Vehicle() {
	
	}

	public void setGoAlgorithm(GoAlgorithm algorithm){
		goAlgorithm = algorithm
	}
}
```

Now when you want to use a particular algorithm in a derived class, all you’ve got to do is to call the `setGoAlgorithm` method with the correct algorithm object, this way:
```ts
setGoAlgorithm(new GoByDrivingAlgorithm());
```

