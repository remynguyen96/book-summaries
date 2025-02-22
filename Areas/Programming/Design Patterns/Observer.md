### Overview

With the **observer pattern**, we can _subscribe_ certain objects, the **observers**, to another object, called the **observable**. Whenever an event occurs, the observable notifies all its observers!

**Role in the pattern**
- **Observer**: Listens for changes.
- **Observable**: Notified observers about changes.

**Functionality**
- **Observer**: Implements a method to handle updates.
- **Observable**: Manages a collection of observers and contains the logic to notify them.

An observable object usually contains 3 important parts:
- **`observers`**: an array of observers that will get notified whenever a specific event occurs
- **`subscribe()`**: a method in order to add observers to the observers list
- **`unsubscribe()`**: a method in order to remove observers from the observes list
- **`notify()`**: a method to notify all observers whenever a specific event occurs.

### Implementation

We can export a singleton Observer object, which contains a `notify`, `subscribe`, and `unsubscribe` method

```js
// observerable.js
let observers =[];

const notify = (data) => observers.forEach((observer) => observer(data))

const subscribe = (func) => observers.push(func);

const unsubscribe = (func) => {
observers = observers.filter((observer) => observer !== func);

/* another ways
const unsubscribe = (func) => {
	[...observers].forEach((observer, index) => {
		if (func === observer) {
			 observers.splice(index, 1) 
		}
	});
}
*/
}

export default Object.freeze({
	noitfy,
	subscribe,
	unsubscribe,
});
```

We can use this observable throughout the entire application, making it possible to subscribe functions to the observable

```js
// analytics
import Observable from "./observable"

function logger(data) {
	console.log(`${Date.now()} ${data}`);
}

function sendToGoogleAnalytics(data) {
	console.log('Sent to Google analytics: ', data);
}

function sendToEmail(data) {
	console.log('Sent to email: ', data);
}

Observable.subscribe(sendToGoogleAnalytics);
Observable.subscribe(sendToEmail);
Observable.subscribe(logger);
```

And notify all subscribers based on certain events.
```js
import Observable from "./observable"
document.getElementById("btn").addEventListener("click", () => {
  Observable.notify("✨ data ✨ - Clicked!");
  // Notifies all subscribed observers
});
```

Here’s a simple implementation of the Observer and Observable Classes

```js
class Observer {
	constructor(name) {
		this.name = name;
	}

	update(message) {
		console.log(`${this.name} received message: ${message}`);
	}
}

class Observable {
	constructor(){
		this.observers = []	
	}

	subscribe(observer) {
		this.observers = this.observers.push(observer)
	}

	unsubscribe(observer) {
		this.observers = this.observers.filter(obs => obs !== observer)
	}

	notify(message) {
		this.observers.forEach(observer => observer.update(message)); 
	}
}

// Usage
const observable = new Observable(); 
const observer1 = new Observer('Observer 1'); 
const observer2 = new Observer('Observer 2'); 

observable.subscribe(observer1); 
observable.subscribe(observer2); 

observable.notify('Hello Observers!'); // Both observers will receive this message 
```

### Tradeoffs

> **✅ Separation of Concerns**: The observer objects aren't tightly coupled to the observable object, and can be (de)coupled at any time. The observable object is responsible for monitoring the events, while the observers simply handle the received data.

> **⚠️ Decreased performance**: Notifying all subscribers might take a significant amount of time if the observer handling becomes too complex, or if there are too many subscibers to notify.

### References
- https://javascriptpatterns.vercel.app/patterns/design-patterns/observer-pattern#overview
- https://www.patterns.dev/vanilla/observer-pattern
