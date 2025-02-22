```js
function removeElement(arr, index) {
 // If the index is out of bounds, return the original array unchanged

if (index < 0 || index >= arr.length) {
    // If the index is out of bounds, return the original array unchanged
    return arr;
  }

  for (let i = index; i < arr.length - 1; i++) {
    // Shift each element after the specified index to the left
    arr[i] = arr[i + 1];
  }

  // Remove the last element, which is now a duplicate of the previous element
  arr.length = arr.length - 1;

  return arr;
}
// Solution 2;
arr = [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)];


// Example usage:
const myArray = [1, 2, 3, 4, 5];
console.log(removeElement(myArray, 2)); 

// Output: [1, 2, 4, 5]
```
