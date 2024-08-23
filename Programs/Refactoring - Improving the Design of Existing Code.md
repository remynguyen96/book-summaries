# Chapter 1: 
## Refactoring: A First Example

Image a company of theatrical players who go out to various events performing plays. Typically, a customer will request a few plays and the company charges them based on the size of the audience and the kind of play they perform. There are currently two kinds of plays that the company performs: tragedies and comedies. As well as providing a bill for the performance, the company gives its customers “volume credits” which they can use for discounts on future performances—think of it as a customer loyalty mechanism.
The performers store data about their plays in a simple JSON file that looks something like this:

```json
# plays.json
{
  "hamlet": {"name": "Hamlet", "type": "tragedy"},
  "as-like": {"name": "As You Like It", "type": "comedy"},
  "othello": {"name": "Othello", "type": "tragedy"}
}

# invoices.json
[
  {
    "customer": "BigCo",
    "performances": [
      {
        "playID": "hamlet",
        "audience": 55
      },
      {
        "playID": "as-like",
        "audience": 35
      },
      {
        "playID": "othello",
        "audience": 40
      }
    ]
  }
]
```

The code that prints the bill is this simple function:
```js
function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US",
                        { style: "currency", currency: "USD",
                          minimumFractionDigits: 2 }).format;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
    case "tragedy":
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case "comedy":
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
        throw new Error(`unknown type: ${play.type}`);
    }

    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    // print line for this order
    result += `  ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount/100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}
```

#### Comments on the Starting Program
A poorly designed system is hard to change—because it is difficult to figure out what to change and how these changes will interact with the existing code to get the behavior I want. And if it is hard to figure out what to change, there is a good chance that I will make mistakes and introduce bugs.
Thus, if I’m faced with modifying a program with hundreds of lines of code, I’d rather it be structured into a set of functions and other program elements that allow me to understand more easily what the program is doing. If the program lacks structure, it’s usually easier for me to add structure to the program first, and then make the change I need.

> When you have to add a feature to a program but the code is not structured in a convenient way, first refactor the program to make it easy to add the feature, then add the feature.

###  The First Step in Refactoring
Whenever I do refactoring, the first step is always the same. I need to ensure I have a solid set of tests for that section of code. The tests are essential because even though I will follow refactorings structured to avoid most of the opportunities for introducing bugs, I’m still human and still make mistakes

>  Before you start refactoring, make sure you have a solid suite of tests. These tests must be self-checking.
>  
>  Refactoring changes the programs in small steps, so if you make a mistake, it is easy to find where the bug is.

Is this renaming worth the effort? Absolutely. Good code should clearly communicate what it is doing, and variable names are a key to clear code. Never be afraid to change names to improve clarity. With good find-and-replace tools, it is usually not difficult; testing, and static typing in a language that supports it, will highlight any occurrences you miss. And with automated refactoring tools, it’s trivial to rename even widely used functions.
### Final Thoughts
As is often the case with refactoring, the early stages were mostly driven by trying to understand what was going on. A common sequence is: Read the code, gain some insight, and use refactoring to move that insight from your head back into the code. The clearer code then makes it easier to understand it, leading to deeper insights and a beneficial positive feedback loop. There are still some improvements I could make, but I feel I’ve done enough to pass my test of leaving the code significantly better than how I found it.

>The true test of good code is how easy it is to change it.

I’m talking about improving the code—but programmers love to argue about what good code looks like. I know some people object to my preference for small, well-named functions. If we consider this to be a matter of aesthetics, where nothing is either good or bad but thinking makes it so, we lack any guide but personal taste. I believe, however, that we can go beyond taste and say that the true test of good code is how easy it is to change it. Code should be obvious: When someone needs to make a change, they should be able to find the code to be changed easily and to make the change quickly without introducing any errors. A healthy code base maximizes our productivity, allowing us to build more features for our users both faster and more cheaply. To keep code healthy, pay attention to what is getting between the programming team and that ideal, then refactor to get closer to the ideal.
But the most important thing to learn from this example is the rhythm of refactoring. Whenever I’ve shown people how I refactor, they are surprised by how small my steps are, each step leaving the code in a working state that compiles and passes its tests. I was just as surprised myself when Kent Beck showed me how to do this in a hotel room in Detroit two decades ago. The key to effective refactoring is recognizing that you go faster when you take tiny steps, the code is never broken, and you can compose those small steps into substantial changes. Remember that—and the rest is silence.

# Chapter 2:
## Principles in Refactoring

### Defining Refactoring
The term “refactoring” can be used either as a noun or a verb. The noun’s definition is:
**Refactoring** (noun): a change made to the internal structure of software to make it easier to understand and cheaper to modify without changing its observable behavior.
**Refactoring** (verb): to restructure software by applying a series of refactorings without changing its observable behavior.

So I might spend a couple of hours refactoring, during which I would apply a few dozen individual refactorings.

Over the years, many people in the industry have taken to use “refactoring” to mean any kind of code cleanup—but the definitions above point to a particular approach to cleaning up code. Refactoring is all about applying small behavior-preserving steps and making a big change by stringing together a sequence of these behavior-preserving steps. Each individual refactoring is either pretty small itself or a combination of small steps. As a result, when I’m refactoring, my code doesn’t spend much time in a broken state, allowing me to stop at any moment even if I haven’t finished.

> If someone says their code was broken for a couple of days while they are refactoring, you can be pretty sure they were not refactoring.

I use “restructuring” as a general term to mean any kind of reorganizing or cleaning up of a code base, and see refactoring as a particular kind of restructuring. Refactoring may seem inefficient to people who first come across it and watch me making lots of tiny steps, when a single bigger step would do. But the tiny steps allow me to go faster because they compose so well—and, crucially, because I don’t spend any time debugging.

In my definitions, I use the phrase “observable behavior.” This is a _deliberately_ loose term, indicating that the code should, overall, do just the same things it did before I started. It doesn’t mean it will work exactly the same

Refactoring is very similar to performance optimization, as both involve carrying out code manipulations that don’t change the overall functionality of the program. The difference is the purpose: Refactoring is always done to make the code “easier to understand and cheaper to modify.” This might speed things up or slow things down. With performance optimization, I only care about speeding up the program, and am prepared to end up with code that is harder to work with if I really need that improved performance.

### The Two Hats

When I use refactoring to develop software, I divide my time between two distinct activities: adding functionality and refactoring. When I add functionality, I shouldn’t be changing existing code; I’m just adding new capabilities. I measure my progress by adding tests and getting the tests to work. When I refactor, I make a point of not adding functionality; I only restructure the code. I don’t add any tests (unless I find a case I missed earlier); I only change tests when I have to accommodate a change in an interface.


