```js
function tag(strings, ...values) {
  console.log("Strings length:", strings.length);
  console.log("Values length:", values.length);

  return strings[0] + values.join('');
}
const value = 'world';
const result = tag`Hello, ${value}!`;

// strings = ["Hello, ", "!"]
// values = ${value}

console.log(result);

// Output:
// Strings length: 2
// Values length: 1
// Hello, world

// Example
// Hello, ${firstName} ${lastName}!
// strings = ["Hello, ", " ", "!"]
// values = ${firstName}, ${lastName} (2 arguments)

```

```js
function format(strings, ...values) {
    let output = "";
    for (let i=0; i<strings.length; i++) {
        output += strings[i];
        if (i<values.length) {
            if (typeof values[i] == "number") {
                output += `<i>${values[i]}</i>`;
            } else {
                output += `<b>${values[i]}</b>`;
            }
        }
    }
    return output;
}
const result = format`Data: ${'Maria'} has been working at ${'Apple'} for ${5} years.`;
console.log(result);

// Output: Data: <b>Maria</b> has been working at <b>Apple</b> for <i>5</i> years.
```


References:
 - https://firtman.github.io/projs/