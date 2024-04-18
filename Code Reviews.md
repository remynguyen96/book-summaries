##### What you'll learn
- Common types of code reviews
- What to look for in a code review
- Written code reviews
- Scrim-based code reviews
- Practice giving code reviews

### Why do code reviews?
- Common part of software development
- Reinforce learning
- Build good programming habits
- Discover new ways to solve problems
- Valuable learning opportunity

> Code reviews provide growth. You learn how to give feedback and form sharper coding instincts.

### What to look for?
- Functionality
- Code formatting
- Naming conventions
- Consistency
- Simplicity
- Unused code
- Praise your peers

### Over-the-shoulder
- Provide suggestions through a conversation
- Often more immediate, nuanced feedback
- Sandwich approach: Positive - Constructive - Positive

For example:

```js
/* Let's pay closer attention to code indentation and semicolon consistency */


function getdiscount(code) {
	let promo = promos.find(promo => promo.code === code)
	
	console.log(promo)
	
/* Make this condition more concise without the !== comparison; only check if promo is truthy and active: promo && promo.isActive */
	if (promo !== undefined && promo.isActive) {
		// Consider leaving out of production code
		console.log(`You get a ${promo.amount}% discount!`)
	
		return promo.amount / 100;
	}
	return 0;
}


/* I believe that you should pay closer attention to
code indentation and semicolon consistency */

/* JavaScript guidelines suggest using camelCase for
variable and function names, e.g., calculatePrice, finalPrice */
function calculate_price(basePrice) {
	/* Let's not include console.log statements in production code */
	
	console.log("Calculating final price...");
	
	/* Declare the discount variable with const to prevent reassignment */
	let discount = getDiscount(basePrice)
	
	const final_price = basePrice - discount
	
	return final_price;
}


/* Function name would be more readable in camelCase: calculateFinalPrice */
function calculatefinalprice(basePrice, userCode) {
/* Similar to getDiscount, consider omitting the else block and returning basePrice if the condition is false */
	if (userCode) {
		const discount = getdiscount(userCode)
		const finalPrice = basePrice - basePrice * discount
		
		return finalPrice;
	} else {
		return basePrice;
	}
}

  

/* Declare getDiscount with const to prevent reassignment, or change this to a named function */

let getDiscount = function(basePrice) {
/* This variable is unused; please remove it */
	let currentDiscount = 0;

/* What do you think about returning the value using
a ternary operator to make the function more concise? */

	if (basePrice > 100) {
		return 20
	} else {
		return 10;
	}
}


/* Move this array to the top of the file for better code organization */
const promos = [
	{ code: 'TOTALLY10', amount: 10, isActive: true },
	{ code: 'PLENTY20', amount: 20, isActive: false },
	{ code: 'NIFTY50', amount: 50, isActive: true },
	{ code: 'WHOPPING75', amount: 75, isActive: true },
	{ code: 'YOLOFREE', amount: 100, isActive: false },
]

console.log(`The final price is $${calculate_price(90)}`)

console.log(calculatefinalprice(500.10, 'TOTALLY10'))
```
