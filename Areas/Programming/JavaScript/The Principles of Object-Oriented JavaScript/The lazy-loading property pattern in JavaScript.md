# The lazy-loading property pattern

You can defer computationally-expensive operations until needed using an accessor property.

Traditionally, developers have created properties inside of JavaScript classes for any data that might be needed within an instance. This isn’t a problem for small pieces of data that are readily available inside of the constructor. However, if some data needs to be calculated before becoming available in the instance, you may not want to pay that cost upfront. For example, consider this class:

```js

function someExpensiveComputation() {
  let result = 0;
  for (let i = 0; i < 8000000; i++) {

    result += i;
  }

  console.log('Done Computation');
  return result;
}

class MyClass {
  constructor() {
    Object.defineProperty(this, "data", {
        get() {
            const actualData = someExpensiveComputation();

            Object.defineProperty(this, "data", {
                value: actualData,
                writable: false,
                configurable: false
            });

            return actualData;
        },
        configurable: true,
        enumerable: true
    });
  }
}


class MyClass {
    constructor() {
        this.data = someExpensiveComputation();
    }
}
```

### The on-demand property pattern

The easiest way to optimize performing an expensive operation is to wait until the data is needed before doing the computation. For example, you could use an accessor property with a getter to do the computation on demand, like this:

```js
class MyClass {
    get data() {
        return someExpensiveComputation();
    }
}
```

In this case, your expensive computation isn’t happening until the first time someone reads the `data` property, which is an improvement. However, that same expensive computation is performed every time the `data` property is read, which is worse than previous example where at least the computation was performed just once. This isn’t a good solution, but you can build upon it to create a better one.

### The only-own lazy-loading property pattern for classes

Only performing the computation when the property is accessed is a good start. What you really need is to cache the information after that point and just use the cached version. But where do you cache that information for easy access? The easiest approach is to define a property with the same name and set its value to the computed data.

`Object.defineProperty()` to create property inside of the class constructor. Ensure that the property only ever exists on the instance

```js
class MyClass {
  constructor() {
    Object.defineProperty(this, "data", {
        get() {
            const actualData = someExpensiveComputation();

            Object.defineProperty(this, "data", {
                value: actualData,
                writable: false,
                configurable: false
            });

            return actualData;
        },
        configurable: true,
        enumerable: true
    });
  }
}
const object = new MyClass();
console.log(object.hasOwnProperty("data"));     // true

// calls the getter
const data1 = object.data;
console.log(object.hasOwnProperty("data"));

// reads from the data property
const data2 = object.data;
```

Here, the constructor creates the data accessor property using `Object.defineProperty()`. The property is created on the instance (by using this) and defines a getter as well as specifying the property to be enumerable and configurable (typical of own properties). It's particularly important to set the data property as configurable so you can call `Object.defineProperty()` on it again.

The getter function then does the computation and calls `Object.defineProperty()` a second time. The data property is now redefined as a data property with a specific value and is made non-writable and non-configurable to protect the final data.
Then, the computed data is returned from the getter. The next time the `data` property is read, it will read from the stored value. As a bonus, the `data` property now only ever exists as an own property and acts the same both before and after the first read.

For classes, this is most likely the pattern you want to use; object literals, on the other hand, can use a simpler approach.

### The lazy-loading property pattern for object literals

If you are using an object literal instead of a class, the process is much simpler because getters defined on object literals are defined as enumerable own properties (not prototype properties) just like data properties. That means you can use the messy lazy-loading property pattern for classes without being messy:

```js
const object = {
    get data() {
        const actualData = someExpensiveComputation();

        Object.defineProperty(this, "data", {
            value: actualData,
            writable: false,
            configurable: false,
            enumerable: false
        });

        return actualData;
    }
};

console.log(object.hasOwnProperty("data"));     // true

const data = object.data;
console.log(object.hasOwnProperty("data"));     // true
```


**Reference:** https://humanwhocodes.com/blog/2021/04/lazy-loading-property-pattern-javascript/

