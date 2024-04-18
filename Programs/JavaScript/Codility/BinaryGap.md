https://app.codility.com/programmers/lessons/1-iterations/binary_gap/

> A _binary gap_ within a positive integer N is any maximal sequence of consecutive zeros that is surrounded by ones at both ends in the binary representation of N.

E.g. 
9 - > 1001
contains a binary gap of length 2

529 -> 1000010001
contains two binary gaps: one of length 4 and one of length 3

20 -> 10100
contains one binary gap of length 1.

15 -> 1111 ; 32 -> 100000
has no binary gaps

```ts
function solution(N: number): number {
const binaryCode = (N >>> 0).toString(2);


}


function toBinary(n: number): number {
	if (!Number.isSafeInteger(n) || n < 0) throw Error(`n must be a non-negative integer`);
	if (n === 1) return '1';
	if (n === 0) return '0';
	
	const evenlyDivision = Math.floor(n / 2);
	const remainder = n % 2;
	
	return toBinary(evenlyDivision) + remainder;
}
```





