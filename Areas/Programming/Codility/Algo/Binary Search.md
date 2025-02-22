```ts
export default function bs(haystack: number[], needle: number): boolean {
	let high = haystack.length;
	let low = 0;
	// Example
	// 0 , 1, ,2, 3, 4, 5, 6
	// haystack = 7; neddle: 2

	// mid = 3; mid > needle (3 > 2)
	// lo = 0;
	// hi = mid = 3;

	// mid = 1; mid < needle (1 < 2)
	// lo = mid + 1 = 2;
	// hi = 3;

	// mid = 1; mid === needle (2 + ((3 - 2) / 2)) = 2
	// lo = 2; // no change
	// hi = 3; // no change

	do {
		const mid = Math.floor(low + ((high - low) / 2));
		const v = haystack[mid];
			
		if (v === needle) return true;
		else if (v > needle) high = mid;
		else (low = mid + 1);

	} while (low < high);

	return false;
}
```

ref: https://github.com/ThePrimeagen/kata-machine/blob/master/scripts/dsa.js#L228-L233