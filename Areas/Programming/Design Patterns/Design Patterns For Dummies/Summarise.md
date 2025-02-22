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





## Improving the New Operator with the Factory Pattern
Here, in your capacity of highly paid, hotshot, design pattern pro for MegaGigaCo, you’re creating a new database connection object.

You’ve got three different kinds of connections to make: Oracle, SQL Server, and MySQL. So you might start to adapt your code to make a connection based on the value in a variable named type: “Oracle”, “SQL Server”, or anything else (which results in the default connection to MySQL).

```java
Connection connection;

if (type.equals(“Oracle”)){ 
	connection= new OracleConnection();
}  
else if (type.equals(“SQL Server”)){
	connection = new SqlServerConnection(); 
} else {  
	connection = new MySqlConnection();
}
```

That’s all fine, you think, but there are about 200 places in your code where you need to create a database connection. So maybe it’s time to put this code into a method, createConnection, and pass the type of connection you want to that method as follows:

```java
public Connection createConnection(String type) {
. . .
}
```

You can return the correct connection object, depending on what type of connection is required:

```java
public Connection createConnection(String type) {
	if (type.equals(“Oracle”)){ 
		return new OracleConnection();
	} else if (type.equals(“SQL Server”)){
		return new SqlServerConnection(); }
	else {  
		return new MySqlConnection();
	}
}
```

Bingo, you think. What could go wrong with that? “Bad news,” cries the CEO, running into your office suddenly. “We need to rework your code to handle secure connections to all database servers as well! The board of our Western division is demanding it.”


In Chapter 2 of this book, you will find this valuable design insight: “Separate the parts of your code that will change the most from the rest of your application. And always try to reuse those parts as much as possible.” Maybe it’s time to start thinking about separating out the part of the code that’s changing so much — the connection object creation part — and encapsulating it in its own object. And that object is a factory object — it’s a factory, written in code, for the creation of connection objects.

So how did you get here? Here’s the trail of bread crumbs:

1. You started off by using the new operator to create OracleConnection objects.
2. Then you used the new operator to create SqlServerConnection objects, followed by MySqlConnection objects. In other words, you were using the new operator to instantiate many different concrete classes, and the code that did so was becoming larger and had to be replicated in many places.
3. Then you factored that code out into a method.
4. Because the code was still changing quickly, it turned out to be best to encapsulate the code out into a factory object. In that way, you were able to separate out the changeable code and leave the core code closed for modification.
All of which is to say — the `new` operator is fine as far as it goes, but when your object creation code changes a lot, it’s time to think about factoring it out into factory objects.
## Building Your First Factory

Lots of programmers know how `factory` objects work — or think they do. The idea, they think, is simply that you have an object that creates other objects. That’s the way factory objects are usually created and used, but there’s a little more to it than that
### Creating the factory

Now you can use the new factory object to create connection objects like this with a factory method named `createConnection`.

The `FirstFactory` class exposes the public method `createConnection` which is what actually creates the objects. Here’s where the object-creation code that changes a lot goes — all you have to do is to check which type of object you should be creating (OracleConnection, SqlServerConnection, or MySqlConnection) and then create it.

There you go — you’ve got a factory class.
```java
public class FirstFactory {

	protected String type;

	public FirstFactory(String t) {
		type = t; 
	}

	public Connection createConnection() {
		if (type.equals(“Oracle”)){ 
			return new OracleConnection();
		}  
		else if (type.equals(“SQL Server”)){
			return new SqlServerConnection(); }
		else {  
			return new MySqlConnection();
		} 
	}
}
```

### Creating the abstract Connection class

Remember that one of our objectives is to make sure that the core code doesn’t have to be modified or has to be modified as little as possible. Bearing that in mind, take a look at this code that uses the connection object returned by our new `factory` object:

```java
FirstFactory factory;  
factory = new FirstFactory(“Oracle”);  
Connection connection = factory.createConnection(); connection.setParams(“username”, “Steve”); connection.setParams(“password”, “Open the door!!!)”; connection.initialize();
connection.open();
. .
```

As you see, the connection objects created by our factory are going to be used extensively in the code. To be able to use the same code for all the different types of connection objects we’re going to return (for Oracle connections, MySQL connections, and so on), the code should be polymorphic — all connection objects should share the same interface or be derived from the same base class. That way, you’ll be able to use the same variable for any created object.

In this case, I make `Connection` an abstract class so all the classes derived from it for the various connection types (OracleConnection, MySqlConnection, and so on) can use the same code after being created by the `FirstFactory` object. The Connection class will have just a constructor and a description method (which will return a description of the type of connection).

```java
public abstract class Connection {
	public Connection() { }
	
	public String description() {
		return “Generic”; 
	}
}
```

You should derive all the objects your factory creates from the same base class or interface so that code that uses the objects it creates doesn’t have to be modified for each new object type.

### Creating the concrete connection classes
There are three concrete connection classes that `FirstFactory` can create, matching the connections the CEO wants: `OracleConnection`, `SqlServerConnection`, and `MySqlConnection`. As just discussed, each of these should be based on the abstract Connection class so they can be used in Connection variables after the factory object creates them. And each of them should return a description from the description method that indicates what kind of connection each connection is. Here’s how the OracleConnection class looks in code:

```java
public class OracleConnection extends Connection {
	public OracleConnection() { }
	
	public String description() {
		return “Oracle”; 
	}
}
```

Excellent — now you’ve got the factory class set up, as well as the classes that the factory uses to create objects. How about putting it to the test?
### Testing it out
Everything’s ready to go; all you need is a framework to test it in, TestConnection.java. You can start by creating a factory object which will create Oracle connections.

```java
public class TestConnection {
	public static void main(String args[]) {
	
		FirstFactory factory;
		factory = new FirstFactory(“Oracle”);
		Connection connection = factory.createConnection();

	System.out.println(“You’re connecting with “ + connection.description());
	}
}
```
What are the results? You should see the following message:
`You’re connecting with Oracle`
Not bad; that’s what you’d expect of most factory objects you usually come across.
### Creating a Factory the GoF Way
How do you “let the subclasses decide which class to instantiate” when creating an object factory? The way to do that is to define your factory as an abstract class or interface that has to be implemented by the subclasses that actually do the work by creating objects.
In other words, you at MegaGigaCo headquarters can create the specification for factory objects, and the actual implementation of those factories is up to those who subclass your specification. It all starts by creating that factory specification, and I do that with an abstract factory class.
### Creating an abstract factory
Besides an empty constructor, the important method here is the factory method createConnection. I make this method abstract so that any sub- classes have to implement it. This method takes one argument — the type of connection you want to create.

```java
public abstract class ConnectionFactory {

	public ConnectionFactory() { }
	
	protected abstract Connection createConnection(String type);
}
```

And that’s all you need — the specification for an object factory. Now the Western division will be happy because they can implement their own concrete factory classes from this abstract factory class.
### Creating a concrete factory
“Okay,” you say, “all you have to do is to extend the new abstract class I’ve named ConnectionFactory when you create your own object factory. Make sure you implement the createConnection method, or Java won’t let you compile. Then it’s up to you to write the code in the createConnection method to create objects of the new secure type that you want to use.”
The Western division programmers say, “Hey, that’s easy. We’ll name our new concrete factory class that creates connection objects SecureFactory, and it’ll extend your abstract ConnectionFactory class this way”:
“Next,” the Western division programmers say, “we just implement the createConnection class that the abstract ConnectionFactory class requires like this”:
“Finally,” the programmers say, “we just need to create objects from our own classes, the SecureOracleConnection, SecureSqlServerConnection, and SecureMySqlConnection classes, depending on the type passed to the createConnection method”:
```java
public class SecureFactory extends ConnectionFactory {
	public Connection createConnection(String type) {
		if (type.equals(“Oracle”)){  
		return new SecureOracleConnection();
		
		}  
		else if (type.equals(“SQL Server”)){
		
		return new SecureSqlServerConnection(); }
		
		else {  
		return new SecureMySqlConnection();
		
		}
	}
}
```
And it is simple. The difference between the usual way of creating object factories and the GoF (_Gang Of Four_) way is that the GoF way provides more of a specification for a factory and lets subclassers handle the details.
### Creating the secure connection classes

```java
public class SecureOracleConnection extends Connection {
	public SecureOracleConnection() { }

	public String description() {
		return “Oracle secure”; 
	}
}
```

Testing it out:
```java
public class TestFactory {

	public static void main(String args[]) {
		
		SecureFactory factory;
		
		factory = new SecureFactory();
	...
	}
}

public class TestFactory {

public static void main(String args[]) {

SecureFactory factory;  
factory = new SecureFactory();  
Connection connection = factory.createConnection(“Oracle”);

System.out.println(“You’re connecting with “ + connection.description());

}

}
```
# Chapter 4: Watch What’s Going On with the Observer and Chain of Responsibility Patterns

the Observer design pattern should “Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.”

