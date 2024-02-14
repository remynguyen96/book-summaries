##### Variables and Functions

Variable names are always camel case and should begin with a noun. Beginning with a noun helps to differentiate variables from functions, which should begin with a verb.

```js
// Good
var count = 10;
var myName = "Nicholas";
var found = true;

// Bad: Easily confused with functions
var getCount = 10;
var isFound = true;

// Good
function getName() {
    return myName;
}

// Bad: Easily confused with variable
function theName() {
    return myName;
}
```

The naming of variables is more art than science, but in general, you should try to make the variable names as short as possible to get the point across. Try to make the variable name indicate the data type of its value. For example, the names `count`, `length`, and `size` suggest the data type is a number, and names such as `name`, `title`, and `message` suggest the data type is a string

`can`, `is`, `has` -> Function returns a boolean
`get` -> Function returns a non-boolean
`set` ->  Function is used to save a value

Constants: all uppercase letters with underscores separating words (`MAX_COUNT`)
Constructors: are formatted using Pascal case.

##### Null
The special value `null` is often misunderstood and confused with `undefined`. This value should be used in just a few cases:
- To initialize a variable that may later be assigned an object value
- To compare against an initialized variable that may or may not have an object value
- To pass into a function where an object is expected
- To return from a function where an object is expected

There are also some cases in which `null` should not be used:
- Do not use `null` to test whether an argument was supplied.
- Do not test an uninitialized variable for the value `null`.

The best way to think about `null` is as a placeholder for an object. These rules are not covered by any major style guide but are important for overall maintainability.