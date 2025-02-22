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

As I develop software, I find myself swapping hats frequently. I start by trying to add a new capability, then I realize this would be much easier if the code were structured differently. So I swap hats and refactor for a while. Once the code is better structured, I swap hats back and add the new capability. Once I get the new capability working, I realize I coded it in a way that’s awkward to understand, so I swap hats again and refactor. All this might take only ten minutes, but during this time I’m always aware of which hat I’m wearing and the subtle difference that makes to how I program.

### Why Should We Refactor?

I don’t want to claim refactoring is the cure for all software ills. It is no “silver bullet.” Yet it is a valuable tool—a pair of silver pliers that helps you keep a good grip on your code. Refactoring is a tool that can—and should—be used for several purposes.
#### Refactoring Improves the Design of Software

Without refactoring, the internal design—the architecture—of software tends to decay. As people change code to achieve short-term goals, often without a full comprehension of the architecture, the code loses its structure. It becomes harder for me to see the design by reading the code. Loss of the structure of code has a cumulative effect. The harder it is to see the design in the code, the harder it is for me to preserve it, and the more rapidly it decays. Regular refactoring helps keep the code in shape.

Poorly designed code usually takes more code to do the same things, often because the code quite literally does the same thing in several places. Thus an important aspect of improving design is to eliminate duplicated code. It’s not that reducing the amount of code will make the system run any faster—the effect on the footprint of the programs rarely is significant. Reducing the amount of code does, however, make a big difference in modification of the code. The more code there is, the harder it is to modify correctly. There’s more code for me to understand. I change this bit of code here, but the system doesn’t do what I expect because I didn’t change that bit over there that does much the same thing in a slightly different context. By eliminating duplication, I ensure that the code says everything once and only once, which is the essence of good design.

#### Refactoring Makes Software Easier to Understand

Programming is in many ways a conversation with a computer. I write code that tells the computer what to do, and it responds by doing exactly what I tell it. In time, I close the gap between what I want it to do and what I tell it to do. Programming is all about saying exactly what I want. But there are likely to be other users of my source code. In a few months, a human will try to read my code to make some changes. That user, who we often forget, is actually the most important. Who cares if the computer takes a few more cycles to compile something? Yet it does matter if it takes a programmer a week to make a change that would have taken only an hour with proper understanding of my code.
#### Refactoring Helps Me Find Bugs
Help in understanding the code also means help in spotting bugs. I admit I’m not terribly good at finding bugs. Some people can read a lump of code and see bugs; I cannot. However, I find that if I refactor code, I work deeply on understanding what the code does, and I put that new understanding right back into the code. By clarifying the structure of the program, I clarify certain assumptions I’ve made—to a point where even I can’t avoid spotting the bugs.

It reminds me of a statement Kent Beck often makes about himself: “I’m not a great programmer; I’m just a good programmer with great habits.” Refactoring helps me be much more effective at writing robust code.
#### Refactoring Helps Me Program Faster
When I talk about refactoring, people can easily see that it improves quality. Better internal design, readability, reducing bugs—all these improve quality. But doesn’t the time I spend on refactoring reduce the speed of development?

When I talk to software developers who have been working on a system for a while, I often hear that they were able to make progress rapidly at first, but now it takes much longer to add new features. Every new feature requires more and more time to understand how to fit it into the existing code base, and once it’s added, bugs often crop up that take even longer to fix. The code base starts looking like a series of patches covering patches, and it takes an exercise in archaeology to figure out how things work. This burden slows down adding new features—to the point that developers wish they could start again from a blank slate.

Software with a good internal design allows me to easily find how and where I need to make changes to add a new feature. Good modularity allows me to only have to understand a small subset of the code base to make a change. If the code is clear, I’m less likely to introduce a bug, and if I do, the debugging effort is much easier.

### When Should We Refactor?
The Rule of Three
Here’s a guideline Don Roberts gave me: The first time you do something, you just do it. The second time you do something similar, you wince at the duplication, but you do the duplicate thing anyway. The third time you do something similar, you refactor.
#### Preparatory Refactoring—Making It Easier to Add a Feature

The best time to refactor is just before I need to add a new feature to the code base. As I do this, I look at the existing code and, often, see that if it were structured a little differently, my work would be much easier. Perhaps there’s function that does almost all that I need, but has some literal values that conflict with my needs. Without refactoring I might copy the function and change those values. But that leads to duplicated code—if I need to change it in the future, I’ll have to change both spots (and, worse, find them). And copy-paste won’t help me if I need to make a similar variation for a new feature in the future. So with my refactoring hat on, I use _[Parameterize Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#ch11lev1sec2) ([310](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#page_310))_. Once I’ve done that, all I have to do is call the function with the parameters I need.

_— Jessica Kerr  [https://martinfowler.com/articles/preparatory-refactoring-example.html](https://martinfowler.com/articles/preparatory-refactoring-example.html)

The same happens when fixing a bug. Once I’ve found the cause of the problem, I see that it would be much easier to fix should I unify the three bits of copied code causing the error into one. Or perhaps separating some update logic from queries will make it easier to avoid the tangling that’s causing the error. By refactoring to improve the situation, I also increase the chances that the bug will stay fixed, and reduce the chances that others will appear in the same crevices of the code.
#### Litter-Pickup Refactoring
 If I make it a little better each time I pass through the code, over time it will get fixed. The nice thing about refactoring is that I don’t break the code with each small step—so, sometimes, it takes months to complete the job but the code is never broken even when I’m part way through it.
#### Planned and Opportunistic Refactoring
I do refactoring as part of adding a feature or fixing a bug. It’s part of my natural flow of programming. Whether I’m adding a feature or fixing a bug, refactoring helps me do the immediate task and also sets me up to make future work easier. This is an important point that’s frequently missed. Refactoring isn’t an activity that’s separated from programming—any more than you set aside time to write `if` statements. I don’t put time on my plans to do refactoring; most refactoring happens while I’m doing other things.

For a long time, people thought of writing software as a process of accretion: To add new features, we should be mostly adding new code. But good developers know that, often, the fastest way to add a new feature is to change the code to make it easy to add. Software should thus be never thought of as “done.” As new capabilities are needed, the software changes to reflect that. Those changes can often be greater in the existing code than in the new code.

#### Long-Term Refactoring
Most refactoring can be completed within a few minutes—hours at most. But there are some larger refactoring efforts that can take a team weeks to complete. Perhaps they need to replace an existing library with a new one. Or pull some section of code out into a component that they can share with another team. Or fix some nasty mess of dependencies that they had allowed to build up.

#### Refactoring in a Code Review
Some organizations do regular code reviews; those that don’t would do better if they did. Code reviews help spread knowledge through a development team. Reviews help more experienced developers pass knowledge to those less experienced. They help more people understand more aspects of a large software system. They are also very important in writing clear code. My code may look clear to me but not to my team. That’s inevitable—it’s hard for people to put themselves in the shoes of someone unfamiliar with whatever they are working on. Reviews also give the opportunity for more people to suggest useful ideas. I can only think of so many good ideas in a week. Having other people contribute makes my life easier, so I always look for reviews.

Before I started using refactoring, I could read the code, understand it to some degree, and make suggestions. Now, when I come up with ideas, I consider whether they can be easily implemented then and there with refactoring. If so, I refactor. When I do it a few times, I can see more clearly what the code looks like with the suggestions in place. I don’t have to imagine what it would be like—I can see it. As a result, I can come up with a second level of ideas that I would never have realized had I not refactored.

If I need to add a new function and the design does not suit the change, I find it’s quicker to refactor first and then add the function. If I need to fix a bug, I need to understand how the software works—and I find refactoring is the fastest way to do this. A schedule-driven manager wants me to do things the fastest way I can; how I do it is my responsibility. I’m being paid for my expertise in programming new capabilities fast, and the fastest way is by refactoring—therefore I refactor.

Whenever anyone advocates for some technique, tool, or architecture, I always look for problems. Few things in life are all sunshine and clear skies. You need to understand the tradeoffs to decide when and where to apply something. I do think refactoring is a valuable technique—one that should be used more by most teams. But there are problems associated with it, and it’s important to understand how they manifest themselves and how we can react to them.

#### Slowing Down New Features

Although many people see time spent refactoring as slowing down the development of new features, the whole purpose of refactoring is to speed things up. But while this is true, it’s also true that the perception of refactoring as slowing things down is still common—and perhaps the biggest barrier to people doing enough refactoring.

> The whole purpose of refactoring is to make us program faster, producing more value with less effort.

We refactor because it makes us faster—faster to add features, faster to fix bugs. It’s important to keep that in front of your mind and in front of communication with others. The economic benefits of refactoring should always be the driving factor, and the more that is understood by developers, managers, and customers, the more of the “good design” curve we’ll see.
#### Testing

To some readers, self-testing code sounds like a requirement so steep as to be unrealizable. But over the last couple of decades, I’ve seen many teams build software this way. It takes attention and dedication to testing, but the benefits make it really worthwhile. Self-testing code not only enables refactoring—it also makes it much safer to add new features, since I can quickly find and kill any bugs I introduce. The key point here is that when a test fails, I can look at the change I’ve made between when the tests were last running correctly and the current code. With frequent test runs, that will be only a few lines of code. By knowing it was those few lines that caused the failure, I can much more easily find the bug.
This also answers those who are concerned that refactoring carries too much risk of introducing bugs. Without self-testing code, that’s a reasonable worry—which is why I put so much emphasis on having solid tests.

There is another way to deal with the testing problem. If I use an environment that has good automated refactorings, I can trust those refactorings even without running tests. I can then refactor, providing I only use those refactorings that are safely automated. This removes a lot of nice refactorings from my menu, but still leaves me enough to deliver some useful benefits. I’d still rather have self-testing code, but it’s an option that is useful to have in the toolkit.

#### Legacy Code

Most people would regard a big legacy as a Good Thing—but that’s one of the cases where programmers’ view is different. Legacy code is often complex, frequently comes with poor tests, and, above all, is written by Someone Else (shudder).
Refactoring can be a fantastic tool to help understand a legacy system. Functions with misleading names can be renamed so they make sense, awkward programming constructs smoothed out, and the program turned from a rough rock to a polished gem. But the dragon guarding this happy tale is the common lack of tests. If you have a big legacy system with no tests, you can’t safely refactor it into clarity.
### Refactoring, Architecture, and Yagni

Refactoring has profoundly changed how people think about software architecture. Early in my career, I was taught that software design and architecture was something to be worked on, and mostly completed, before anyone started writing code. Once the code was written, its architecture was fixed and could only decay due to carelessness.

The biggest issue with finishing architecture before coding is that such an approach assumes the requirements for the software can be understood early on. But experience shows that this is often, even usually, an unachievable goal. Repeatedly, I saw people only understand what they really needed from software once they’d had a chance to use it, and saw the impact it made to their work.

One way of dealing with future changes is to put flexibility mechanisms into the software. As I write some function, I can see that it has a general applicability. To handle the different circumstances that I anticipate it to be used in, I can see a dozen parameters I could add to that function. These parameters are flexibility mechanisms—and, like most mechanisms, they are not a free lunch. Adding all those parameters complicates the function for the one case it’s used right now. If I miss a parameter, all the parameterization I have added makes it harder for me to add more. I find I often get my flexibility mechanisms wrong—either because the changing needs didn’t work out the way I expected or my mechanism design was faulty. Once I take all that into account, most of the time my flexibility mechanisms actually _slow down_ my ability to react to change.

Instead of speculating on what flexibility I will need in the future and what mechanisms will best enable that, I build software that solves only the currently understood needs, but I make this software excellently designed for those needs. As my understanding of the users’ needs changes, I use refactoring to adapt the architecture to those new demands. I can happily include mechanisms that don’t increase complexity (such as small, well-named functions) but any flexibility that complicates the software has to prove itself before I include it. If I don’t have different values for a parameter from the callers, I don’t add it to the parameter list. Should the time come that I need to add it, then _[Parameterize Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#ch11lev1sec2) ([310](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#page_310))_ is an easy refactoring to apply. I often find it useful to estimate how hard it would be to use refactoring later to support an anticipated change. Only if I can see that it would be substantially harder to refactor later do I consider adding a flexibility mechanism now.

This approach to design goes under various names: simple design, incremental design, or yagni (originally an acronym for “you aren’t going to need it”). Yagni doesn’t imply that architectural thinking disappears, although it is sometimes naively applied that way. I think of yagni as a different style of incorporating architecture and design into the development process—a style that isn’t credible without the foundation of refactoring.

Adopting yagni doesn’t mean I neglect all upfront architectural thinking. There are still cases where refactoring changes are difficult and some preparatory thinking can save time. But the balance has shifted a long way—I’m much more inclined to deal with issues later when I understand them better. All this has led to a growing discipline of evolutionary architecture [[Ford et al.](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/biblo.xhtml#bib9)] where architects explore the patterns and practices that take advantage of our ability to iterate over architectural decisions.

### Refactoring and the Wider Software Development Process

 To really operate in an agile way, a team has to be capable and enthusiastic refactorers—and for that, many aspects of their process have to align with making refactoring a regular part of their work.
 The first foundation for refactoring is self-testing code. By this, I mean that there is a suite of automated tests that I can run and be confident that, if I made an error in my programming, some test will fail. This is such an important foundation for refactoring that I’ll spend a chapter talking more about this. Self-testing code is also a key element of Continuous Integration, so there is a strong synergy between the three practices of self-testing code, continuous integration, and refactoring.

### Where Did Refactoring Come From?

Good programmers have always spent at least some time cleaning up their code. They do this because they have learned that clean code is easier to change than complex and messy code, and good programmers know that they rarely write clean code the first time around.

### Going Further

_Refactoring Workbook_ [[Wake](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/biblo.xhtml#bib47)] that contains many exercises to practice refactoring.

Many of those who pioneered refactoring were also active in the software patterns community. Josh Kerievsky tied these two worlds closely together with _Refactoring to Patterns_ [[Kerievsky](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/biblo.xhtml#bib14)], which looks at the most valuable patterns from the hugely influential “Gang of Four” book [[gof](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/biblo.xhtml#bib11)] and shows how to use refactoring to evolve towards them.

This book concentrates on refactoring in general-purpose programming, but refactoring also applies in specialized areas. Two that have got useful attention are _Refactoring Databases_ [[Ambler & Sadalage](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/biblo.xhtml#bib1)] (by Scott Ambler and Pramod Sadalage) and _Refactoring HTML_ [[Harold](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/biblo.xhtml#bib12)] (by Elliotte Rusty Harold).

Although it doesn’t have refactoring in the title, also worth including is Michael Feathers’s _Working Effectively with Legacy Code_ [[Feathers](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/biblo.xhtml#bib7)], which is primarily a book about how to think about refactoring an older codebase with poor test coverage.

For more up-to-date material, look up the web representation of this book, as well as the main refactoring web site: [refactoring.com](http://refactoring.com/) [[ref.com](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/biblo.xhtml#bib46)].

# Chapter 3: 
## Bad Smells in Code

Now comes the dilemma. It is easy to explain how to delete an instance variable or create a hierarchy. These are simple matters. Trying to explain _when_ you should do these things is not so cut-and-dried. Instead of appealing to some vague notion of programming aesthetics (which, frankly, is what we consultants usually do), I wanted something a bit more solid.

Use this chapter and the table on the inside back cover as a way to give you inspiration when you’re not sure what refactorings to do. Read the chapter (or skim the table) and try to identify what it is you’re smelling, then go to the refactorings we suggest to see whether they will help you. You may not find the exact smell you can detect, but hopefully it should point you in the right direction.
### Mysterious Name

One of the most important parts of clear code is good names, so we put a lot of thought into naming functions, modules, variables, classes, so they clearly communicate what they do and how to use them. People are often afraid to rename things, thinking it’s not worth the trouble, but a good name can save hours of puzzled incomprehension in the future.
### Duplicated Code

If you see the same code structure in more than one place, you can be sure that your program will be better if you find a way to unify them. Duplication means that every time you read these copies, you need to read them carefully to see if there’s any difference. If you need to change the duplicated code, you have to find and catch each duplication.

The simplest duplicated code problem is when you have the same expression in two methods of the same class. Then all you have to do is _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_ and invoke the code from both places. If you have code that’s similar, but not quite identical, see if you can use _[Slide Statements](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec6) ([223](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_223))_ to arrange the code so the similar items are all together for easy extraction. If the duplicate fragments are in subclasses of a common base class, you can use _[Pull Up Method](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec1) ([350](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_350))_ to avoid calling one from another.

### Long Function

In our experience, the programs that live best and longest are those with short functions. Programmers new to such a code base often feel that no computation ever takes place—that the program is an endless sequence of delegation. When you have lived with such a program for a few years, however, you learn just how valuable all those little functions are. All of the payoffs of indirection—explanation, sharing, and choosing—are supported by small functions.

Since the early days of programming, people have realized that the longer a function is, the more difficult it is to understand. Older languages carried an overhead in subroutine calls, which deterred people from small functions. Modern languages have pretty much eliminated that overhead for in-process calls. There is still overhead for the reader of the code because you have to switch context to see what the function does. Development environments that allow you to quickly jump between a function call and its declaration, or to see both functions at once, help eliminate this step, but the real key to making it easy to understand small functions is good naming. If you have a good name for a function, you mostly don’t need to look at its body.

The net effect is that you should be much more aggressive about decomposing functions. A heuristic we follow is that whenever we feel the need to comment something, we write a function instead. Such a function contains the code that we wanted to comment but is named after the _intention_ of the code rather than the way it works. We may do this on a group of lines or even on a single line of code. We do this even if the method call is longer than the code it replaces—provided the method name explains the purpose of the code. The key here is not function length but the semantic distance between what the method does and how it does it.

Ninety-nine percent of the time, all you have to do to shorten a function is _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_. Find parts of the function that seem to go nicely together and make a new one.

If you have a function with lots of parameters and temporary variables, they get in the way of extracting. If you try to use _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_, you end up passing so many parameters to the extracted method that the result is scarcely more readable than the original. You can often use _[Replace Temp with Query](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec4) ([178](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_178))_ to eliminate the temps. Long lists of parameters can be slimmed down with _[Introduce Parameter Object](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec8) ([140](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_140))_ and _[Preserve Whole Object](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#ch11lev1sec4) ([319](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#page_319))_.

If you’ve tried that and you still have too many temps and parameters, it’s time to get out the heavy artillery: _[Replace Function with Command](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#ch11lev1sec9) ([337](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#page_337))_.

How do you identify the clumps of code to extract? A good technique is to look for comments. They often signal this kind of semantic distance. A block of code with a comment that tells you what it is doing can be replaced by a method whose name is based on the comment. Even a single line is worth extracting if it needs explanation.

Conditionals and loops also give signs for extractions. Use _[Decompose Conditional](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#ch10lev1sec1) ([260](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#page_260))_ to deal with conditional expressions. A big switch statement should have its legs turned into single function calls with _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_. If there’s more than one switch statement switching on the same condition, you should apply _[Replace Conditional with Polymorphism](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#ch10lev1sec4) ([272](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#page_272))_.

With loops, extract the loop and the code within the loop into its own method. If you find it hard to give an extracted loop a name, that may be because it’s doing two different things—in which case don’t be afraid to use _[Split Loop](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec7) ([227](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_227))_ to break out the separate tasks.

### Long Parameter List

In our early programming days, we were taught to pass in as parameters everything needed by a function. This was understandable because the alternative was global data, and global data quickly becomes evil. But long parameter lists are often confusing in their own right.

If you can obtain one parameter by asking another parameter for it, you can use _[Replace Parameter with Query](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#ch11lev1sec5) ([324](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#page_324))_ to remove the second parameter. Rather than pulling lots of data out of an existing data structure, you can use _[Preserve Whole Object](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#ch11lev1sec4) ([319](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#page_319))_ to pass the original data structure instead. If several parameters always fit together, combine them with _[Introduce Parameter Object](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec8) ([140](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_140))_. If a parameter is used as a flag to dispatch different behavior, use _[Remove Flag Argument](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#ch11lev1sec3) ([314](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#page_314))_.

Classes are a great way to reduce parameter list sizes. They are particularly useful when multiple functions share several parameter values. Then, you can use _[Combine Functions into Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec9) ([144](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_144))_ to capture those common values as fields. If we put on our functional programming hats, we’d say this creates a set of partially applied functions.

### Global Data

Since our earliest days of writing software, we were warned of the perils of global data—how it was invented by demons from the fourth plane of hell, which is the resting place of any programmer who dares to use it. And, although we are somewhat skeptical about fire and brimstone, it’s still one of the most pungent odors we are likely to run into. The problem with global data is that it can be modified from anywhere in the code base, and there’s no mechanism to discover which bit of code touched it. Time and again, this leads to bugs that breed from a form of spooky action from a distance—and it’s very hard to find out where the errant bit of program is. The most obvious form of global data is global variables, but we also see this problem with class variables and singletons.

Our key defense here is _[Encapsulate Variable](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec6) ([132](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_132))_, which is always our first move when confronted with data that is open to contamination by any part of a program. At least when you have it wrapped by a function, you can start seeing where it’s modified and start to control its access. Then, it’s good to limit its scope as much as possible by moving it within a class or module where only that module’s code can see it.

Global data is especially nasty when it’s mutable. Global data that you can guarantee never changes after the program starts is relatively safe—if you have a language that can enforce that guarantee.

Global data illustrates Paracelsus’s maxim: The difference between a poison and something benign is the dose. You can get away with small doses of global data, but it gets exponentially harder to deal with the more you have. Even with little bits, we like to keep it encapsulated—that’s the key to coping with changes as the software evolves.

### Mutable Data

Changes to data can often lead to unexpected consequences and tricky bugs. I can update some data here, not realizing that another part of the software expects something different and now fails—a failure that’s particularly hard to spot if it only happens under rare conditions. For this reason, an entire school of software development—functional programming—is based on the notion that data should never change and that updating a data structure should always return a new copy of the structure with the change, leaving the old data pristine.

These kinds of languages, however, are still a relatively small part of programming; many of us work in languages that allow variables to vary. But this doesn’t mean we should ignore the advantages of immutability—there are still many things we can do to limit the risks on unrestricted data updates.

You can use _[Encapsulate Variable](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec6) ([132](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_132))_ to ensure that all updates occur through narrow functions that can be easier to monitor and evolve. If a variable is being updated to store different things, use _[Split Variable](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch09.xhtml#ch09lev1sec1) ([240](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch09.xhtml#page_240))_ both to keep them separate and avoid the risky update. Try as much as possible to move logic out of code that processes the update by using _[Slide Statements](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec6) ([223](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_223))_ and _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_ to separate the side-effect-free code from anything that performs the update. In APIs, use _[Separate Query from Modifier](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#ch11lev1sec1) ([306](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#page_306))_ to ensure callers don’t need to call code that has side effects unless they really need to. We like to use _[Remove Setting Method](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#ch11lev1sec7) ([331](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#page_331))_ as soon as we can—sometimes, just trying to find clients of a setter helps spot opportunities to reduce the scope of a variable.

Mutable data that can be calculated elsewhere is particularly pungent. It’s not just a rich source of confusion, bugs, and missed dinners at home—it’s also unnecessary. We spray it with a concentrated solution of vinegar and _[Replace Derived Variable with Query](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch09.xhtml#ch09lev1sec3) ([248](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch09.xhtml#page_248))_.

Mutable data isn’t a big problem when it’s a variable whose scope is just a couple of lines—but its risk increases as its scope grows. Use _[Combine Functions into Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec9) ([144](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_144))_ or _[Combine Functions into Transform](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec10) ([149](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_149))_ to limit how much code needs to update a variable. If a variable contains some data with internal structure, it’s usually better to replace the entire structure rather than modify it in place, using _[Change Reference to Value](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch09.xhtml#ch09lev1sec4) ([252](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch09.xhtml#page_252))_.

### Divergent Change

We structure our software to make change easier; after all, software is meant to be soft. When we make a change, we want to be able to jump to a single clear point in the system and make the change. When you can’t do this, you are smelling one of two closely related pungencies.

Divergent change occurs when one module is often changed in different ways for different reasons. If you look at a module and say, “Well, I will have to change these three functions every time I get a new database; I have to change these four functions every time there is a new financial instrument,” this is an indication of divergent change. The database interaction and financial processing problems are separate contexts, and we can make our programming life better by moving such contexts into separate modules. That way, when we have a change to one context, we only have to understand that one context and ignore the other. We always found this to be important, but now, with our brains shrinking with age, it becomes all the more imperative. Of course, you often discover this only after you’ve added a few databases or financial instruments; context boundaries are usually unclear in the early days of a program and continue to shift as a software system’s capabilities change.

If the two aspects naturally form a sequence—for example, you get data from the database and then apply your financial processing on it—then _[Split Phase](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec11) ([154](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_154))_ separates the two with a clear data structure between them. If there’s more back-and-forth in the calls, then create appropriate modules and use _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ to divide the processing up. If functions mix the two types of processing within themselves, use _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_ to separate them before moving. If the modules are classes, then _[Extract Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec5) ([182](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_182))_ helps formalize how to do the split.

### Shotgun Surgery

Shotgun surgery is similar to divergent change but is the opposite. You whiff this when, every time you make a change, you have to make a lot of little edits to a lot of different classes. When the changes are all over the place, they are hard to find, and it’s easy to miss an important change.

In this case, you want to use _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ and _[Move Field](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec2) ([207](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_207))_ to put all the changes into a single module. If you have a bunch of functions operating on similar data, use _[Combine Functions into Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec9) ([144](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_144))_. If you have functions that are transforming or enriching a data structure, use _[Combine Functions into Transform](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec10) ([149](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_149))_. _[Split Phase](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec11) ([154](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_154))_ is often useful here if the common functions can combine their output for a consuming phase of logic.

A useful tactic for shotgun surgery is to use inlining refactorings, such as _[Inline Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec2) ([115](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_115))_ or _[Inline Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec6) ([186](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_186))_, to pull together poorly separated logic. You’ll end up with a Long Method or a Large Class, but can then use extractions to break it up into more sensible pieces. Even though we are inordinately fond of small functions and classes in our code, we aren’t afraid of creating something large as an intermediate step to reorganization.

### Feature Envy

When we modularize a program, we are trying to separate the code into zones to maximize the interaction inside a zone and minimize interaction between zones. A classic case of Feature Envy occurs when a function in one module spends more time communicating with functions or data inside another module than it does within its own module. We’ve lost count of the times we’ve seen a function invoking half-a-dozen getter methods on another object to calculate some value. Fortunately, the cure for that case is obvious: The function clearly wants to be with the data, so use _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ to get it there. Sometimes, only a part of a function suffers from envy, in which case use _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_ on the jealous bit, and _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ to give it a dream home.

Of course not all cases are cut-and-dried. Often, a function uses features of several modules, so which one should it live with? The heuristic we use is to determine which module has most of the data and put the function with that data. This step is often made easier if you use _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_ to break the function into pieces that go into different places.

Of course, there are several sophisticated patterns that break this rule. From the Gang of Four [[gof](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/biblo.xhtml#bib11)], Strategy and Visitor immediately leap to mind. Kent Beck’s Self Delegation [[Beck SBPP](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/biblo.xhtml#bib4)] is another. Use these to combat the divergent change smell. The fundamental rule of thumb is to put things together that change together. Data and the behavior that references that data usually change together—but there are exceptions. When the exceptions occur, we move the behavior to keep changes in one place. Strategy and Visitor allow you to change behavior easily because they isolate the small amount of behavior that needs to be overridden, at the cost of further indirection.

### Data Clumps

Data items tend to be like children: They enjoy hanging around together. Often, you’ll see the same three or four data items together in lots of places: as fields in a couple of classes, as parameters in many method signatures. Bunches of data that hang around together really ought to find a home together. The first step is to look for where the clumps appear as fields. Use _[Extract Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec5) ([182](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_182))_ on the fields to turn the clumps into an object. Then turn your attention to method signatures using _[Introduce Parameter Object](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec8) ([140](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_140))_ or _[Preserve Whole Object](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#ch11lev1sec4) ([319](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#page_319))_ to slim them down. The immediate benefit is that you can shrink a lot of parameter lists and simplify method calling. Don’t worry about data clumps that use only some of the fields of the new object. As long as you are replacing two or more fields with the new object, you’ll come out ahead.

A good test is to consider deleting one of the data values. If you did this, would the others make any sense? If they don’t, it’s a sure sign that you have an object that’s dying to be born.

You’ll notice that we advocate creating a class here, not a simple record structure. We do this because using a class gives you the opportunity to make a nice perfume. You can now look for cases of feature envy, which will suggest behavior that can be moved into your new classes. We’ve often seen this as a powerful dynamic that creates useful classes and can remove a lot of duplication and accelerate future development, allowing the data to become productive members of society.

### Primitive Obsession

Most programming environments are built on a widely used set of primitive types: integers, floating point numbers, and strings. Libraries may add some additional small objects such as dates. We find many programmers are curiously reluctant to create their own fundamental types which are useful for their domain—such as money, coordinates, or ranges. We thus see calculations that treat monetary amounts as plain numbers, or calculations of physical quantities that ignore units (adding inches to millimeters), or lots of code doing `if (a < upper && a > lower)`.

Strings are particularly common petri dishes for this kind of odor: A telephone number is more than just a collection of characters. If nothing else, a proper type can often include consistent display logic for when it needs to be displayed in a user interface. Representing such types as strings is such a common stench that people call them “stringly typed” variables.

You can move out of the primitive cave into the centrally heated world of meaningful types by using _[Replace Primitive with Object](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec3) ([174](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_174))_. If the primitive is a type code controlling conditional behavior, use _[Replace Type Code with Subclasses](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec6) ([362](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_362))_ followed by _[Replace Conditional with Polymorphism](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#ch10lev1sec4) ([272](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#page_272))_.

Groups of primitives that commonly appear together are data clumps and should be civilized with _[Extract Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec5) ([182](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_182))_ and _[Introduce Parameter Object](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec8) ([140](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_140))_.

### Repeated Switches

Talk to a true object-oriented evangelist and they’ll soon get onto the evils of switch statements. They’ll argue that any switch statement you see is begging for _[Replace Conditional with Polymorphism](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#ch10lev1sec4) ([272](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#page_272))_. We’ve even heard some people argue that all conditional logic should be replaced with polymorphism, tossing most `if`s into the dustbin of history.

Even in our more wild-eyed youth, we were never unconditionally opposed to the conditional. Indeed, the first edition of this book had a smell entitled “switch statements.” The smell was there because in the late 90’s we found polymorphism sadly underappreciated, and saw benefit in getting people to switch over.

These days there is more polymorphism about, and it isn’t the simple red flag that it often was fifteen years ago. Furthermore, many languages support more sophisticated forms of switch statements that use more than some primitive code as their base. So we now focus on the repeated switch, where the same conditional switching logic (either in a switch/case statement or in a cascade of if/else statements) pops up in different places. The problem with such duplicate switches is that, whenever you add a clause, you have to find all the switches and update them. Against the dark forces of such repetition, polymorphism provides an elegant weapon for a more civilized codebase.

### Loops

Loops have been a core part of programming since the earliest languages. But we feel they are no more relevant today than bell-bottoms and flock wallpaper. We disdained them at the time of the first edition—but Java, like most other languages at the time, didn’t provide a better alternative. These days, however, first-class functions are widely supported, so we can use _[Replace Loop with Pipeline](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec8) ([231](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_231))_ to retire those anachronisms. We find that pipeline operations, such as filter and map, help us quickly see the elements that are included in the processing and what is done with them.

### Lazy Element

We like using program elements to add structure—providing opportunities for variation, reuse, or just having more helpful names. But sometimes the structure isn’t needed. It may be a function that’s named the same as its body code reads, or a class that is essentially one simple function. Sometimes, this reflects a function that was expected to grow and be popular later, but never realized its dreams. Sometimes, it’s a class that used to pay its way, but has been downsized with refactoring. Either way, such program elements need to die with dignity. Usually this means using _[Inline Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec2) ([115](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_115))_ or _[Inline Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec6) ([186](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_186))_. With inheritance, you can use _[Collapse Hierarchy](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec9) ([380](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_380))_.

### Speculative Generality

Brian Foote suggested this name for a smell to which we are very sensitive. You get it when people say, “Oh, I think we’ll need the ability to do this kind of thing someday” and thus add all sorts of hooks and special cases to handle things that aren’t required. The result is often harder to understand and maintain. If all this machinery were being used, it would be worth it. But if it isn’t, it isn’t. The machinery just gets in the way, so get rid of it.

If you have abstract classes that aren’t doing much, use _[Collapse Hierarchy](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec9) ([380](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_380))_. Unnecessary delegation can be removed with _[Inline Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec2) ([115](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_115))_ and _[Inline Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec6) ([186](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_186))_. Functions with unused parameters should be subject to _[Change Function Declaration](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec5) ([124](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_124))_ to remove those parameters. You should also apply _[Change Function Declaration](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec5) ([124](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_124))_ to remove any unneeded parameters, which often get tossed in for future variations that never come to pass.

Speculative generality can be spotted when the only users of a function or class are test cases. If you find such an animal, delete the test case and apply _[Remove Dead Code](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec9) ([237](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_237))_.

### Temporary Field

Sometimes you see a class in which a field is set only in certain circumstances. Such code is difficult to understand, because you expect an object to need all of its fields. Trying to understand why a field is there when it doesn’t seem to be used can drive you nuts.

Use _[Extract Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec5) ([182](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_182))_ to create a home for the poor orphan variables. Use _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ to put all the code that concerns the fields into this new class. You may also be able to eliminate conditional code by using _[Introduce Special Case](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#ch10lev1sec5) ([289](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#page_289))_ to create an alternative class for when the variables aren’t valid.

### Message Chains

You see message chains when a client asks one object for another object, which the client then asks for yet another object, which the client then asks for yet another another object, and so on. You may see these as a long line of `getThis` methods, or as a sequence of temps. Navigating this way means the client is coupled to the structure of the navigation. Any change to the intermediate relationships causes the client to have to change.

The move to use here is _[Hide Delegate](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec7) ([189](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_189))_. You can do this at various points in the chain. In principle, you can do this to every object in the chain, but doing this often turns every intermediate object into a middle man. Often, a better alternative is to see what the resulting object is used for. See whether you can use _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_ to take a piece of the code that uses it and then _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ to push it down the chain. If several clients of one of the objects in the chain want to navigate the rest of the way, add a method to do that.

Some people consider any method chain to be a terrible thing. We are known for our calm, reasoned moderation. Well, at least in this case we are.

### Middle Man

One of the prime features of objects is encapsulation—hiding internal details from the rest of the world. Encapsulation often comes with delegation. You ask a director whether she is free for a meeting; she delegates the message to her diary and gives you an answer. All well and good. There is no need to know whether the director uses a diary, an electronic gizmo, or a secretary to keep track of her appointments.

c However, this can go too far. You look at a class’s interface and find half the methods are delegating to this other class. After a while, it is time to use _[Remove Middle Man](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec8) ([192](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_192))_ and talk to the object that really knows what’s going on. If only a few methods aren’t doing much, use _[Inline Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec2) ([115](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_115))_ to inline them into the caller. If there is additional behavior, you can use _[Replace Superclass with Delegate](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec11) ([399](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_399))_ or _[Replace Subclass with Delegate](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec10) ([381](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_381))_ to fold the middle man into the real object. That allows you to extend behavior without chasing all that delegation.

### Insider Trading

Software people like strong walls between their modules and complain bitterly about how trading data around too much increases coupling. To make things work, some trade has to occur, but we need to reduce it to a minimum and keep it all above board.

Modules that whisper to each other by the coffee machine need to be separated by using _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ and _[Move Field](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec2) ([207](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_207))_ to reduce the need to chat. If modules have common interests, try to create a third module to keep that commonality in a well-regulated vehicle, or use _[Hide Delegate](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec7) ([189](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_189))_ to make another module act as an intermediary.

Inheritance can often lead to collusion. Subclasses are always going to know more about their parents than their parents would like them to know. If it’s time to leave home, apply _[Replace Subclass with Delegate](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec10) ([381](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_381))_ or _[Replace Superclass with Delegate](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec11) ([399](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_399))_.

### Large Class

When a class is trying to do too much, it often shows up as too many fields. When a class has too many fields, duplicated code cannot be far behind.

You can _[Extract Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec5) ([182](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_182))_ to bundle a number of the variables. Choose variables to go together in the component that makes sense for each. For example, “depositAmount” and “depositCurrency” are likely to belong together in a component. More generally, common prefixes or suffixes for some subset of the variables in a class suggest the opportunity for a component. If the component makes sense with inheritance, you’ll find _[Extract Superclass](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec8) ([375](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_375))_ or _[Replace Type Code with Subclasses](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec6) ([362](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_362))_ (which essentially is extracting a subclass) are often easier.

Sometimes a class does not use all of its fields all of the time. If so, you may be able to do these extractions many times.

As with a class with too many instance variables, a class with too much code is a prime breeding ground for duplicated code, chaos, and death. The simplest solution (have we mentioned that we like simple solutions?) is to eliminate redundancy in the class itself. If you have five hundred-line methods with lots of code in common, you may be able to turn them into five ten-line methods with another ten two-line methods extracted from the original.

The clients of such a class are often the best clue for splitting up the class. Look at whether clients use a subset of the features of the class. Each subset is a possible separate class. Once you’ve identified a useful subset, use _[Extract Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec5) ([182](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_182))_, _[Extract Superclass](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec8) ([375](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_375))_, or _[Replace Type Code with Subclasses](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec6) ([362](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_362))_ to break it out.

### Alternative Classes with Different Interfaces

One of the great benefits of using classes is the support for substitution, allowing one class to swap in for another in times of need. But this only works if their interfaces are the same. Use _[Change Function Declaration](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec5) ([124](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_124))_ to make functions match up. Often, this doesn’t go far enough; keep using _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ to move behavior into classes until the protocols match. If this leads to duplication, you may be able to use _[Extract Superclass](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec8) ([375](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_375))_ to atone.

### Data Class

These are classes that have fields, getting and setting methods for the fields, and nothing else. Such classes are dumb data holders and are often being manipulated in far too much detail by other classes. In some stages, these classes may have public fields. If so, you should immediately apply _[Encapsulate Record](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec1) ([162](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_162))_ before anyone notices. Use _[Remove Setting Method](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#ch11lev1sec7) ([331](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch11.xhtml#page_331))_ on any field that should not be changed.

Look for where these getting and setting methods are used by other classes. Try to use _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ to move behavior into the data class. If you can’t move a whole function, use _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_ to create a function that can be moved.

Data classes are often a sign of behavior in the wrong place, which means you can make big progress by moving it from the client into the data class itself. But there are exceptions, and one of the best exceptions is a record that’s being used as a result record from a distinct function invocation. A good example of this is the intermediate data structure after you’ve applied _[Split Phase](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec11) ([154](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_154))_. A key characteristic of such a result record is that it’s immutable (at least in practice). Immutable fields don’t need to be encapsulated and information derived from immutable data can be represented as fields rather than getting methods.

### Refused Bequest

Subclasses get to inherit the methods and data of their parents. But what if they don’t want or need what they are given? They are given all these great gifts and pick just a few to play with.

The traditional story is that this means the hierarchy is wrong. You need to create a new sibling class and use _[Push Down Method](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec4) ([359](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_359))_ and _[Push Down Field](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec5) ([361](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_361))_ to push all the unused code to the sibling. That way the parent holds only what is common. Often, you’ll hear advice that all superclasses should be abstract.

You’ll guess from our snide use of “traditional” that we aren’t going to advise this—at least not all the time. We do subclassing to reuse a bit of behavior all the time, and we find it a perfectly good way of doing business. There is a smell—we can’t deny it—but usually it isn’t a strong smell. So, we say that if the refused bequest is causing confusion and problems, follow the traditional advice. However, don’t feel you have to do it all the time. Nine times out of ten this smell is too faint to be worth cleaning.

The smell of refused bequest is much stronger if the subclass is reusing behavior but does not want to support the interface of the superclass. We don’t mind refusing implementations—but refusing interface gets us on our high horses. In this case, however, don’t fiddle with the hierarchy; you want to gut it by applying _[Replace Subclass with Delegate](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec10) ([381](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_381))_ or _[Replace Superclass with Delegate](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#ch12lev1sec11) ([399](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch12.xhtml#page_399))_.

### Comments

Don’t worry, we aren’t saying that people shouldn’t write comments. In our olfac-tory analogy, comments aren’t a bad smell; indeed they are a sweet smell. The reason we mention comments here is that comments are often used as a deodorant. It’s surprising how often you look at thickly commented code and notice that the comments are there because the code is bad.

Comments lead us to bad code that has all the rotten whiffs we’ve discussed in the rest of this chapter. Our first action is to remove the bad smells by refactoring. When we’re finished, we often find that the comments are superfluous.

If you need a comment to explain what a block of code does, try _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_. If the method is already extracted but you still need a comment to explain what it does, use _[Change Function Declaration](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec5) ([124](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_124))_ to rename it. If you need to state some rules about the required state of the system, use _[Introduce Assertion](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#ch10lev1sec6) ([302](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch10.xhtml#page_302))_.

![Images](https://learning.oreilly.com/api/v2/epubs/urn:orm:book:9780134757681/files/graphics/common.jpg) _When you feel the need to write a comment, first try to refactor the code so that any comment becomes superfluous._

A good time to use a comment is when you don’t know what to do. In addition to describing what is going on, comments can indicate areas in which you aren’t sure. A comment can also explain why you did something. This kind of information helps future modifiers, especially forgetful ones.

# Chapter 4
## Building Tests

Refactoring is a valuable tool, but it can’t come alone. To do refactoring properly, I need a solid suite of tests to spot my inevitable mistakes. Even with automated refactoring tools, many of my refactorings will still need checking via a test suite.

I don’t find this to be a disadvantage. Even without refactoring, writing good tests increases my effectiveness as a programmer. This was a surprise for me and is counterintuitive for most programmers—so it’s worth explaining why.

### The Value of Self-Testing Code

I realized that, instead of looking at the screen to see if it printed out some information from the model, I could get the computer to make that test. All I had to do was put the output I expected in the test code and do a comparison. Now I could run the tests and they would just print “OK” to the screen if all was well. The software was now self-testing.

> Make sure all tests are fully automatic and that they check their own results
> A suite of tests is a powerful bug detector that decapitates the time it takes to find bugs.

The Test-Driven Development approach to programming relies on short cycles of writing a (failing) test, writing the code to make that test work, and refactoring to ensure the result is as clean as possible.

If you read much about testing, you’ll hear these phases described variously as setup-exercise-verify, given-when-then, or arrange-act-assert. 

**Teardown** removes the fixture between tests so that different tests don’t interact with each other. By doing all my setup in `beforeEach`, I allow the test framework to implicitly tear down my fixture between tests, so I can take the teardown phase for granted. Most writers on tests gloss over teardown—reasonably so, since most of the time we ignore it. But occasionally, it can be important to have an explicit teardown operation, particularly if we have a fixture that we have to share between tests because it’s slow to create.

>  Think of the boundary conditions under which things might go wrong and concentrate your tests there.
>  When you get a bug report, start by writing a unit test that exposes the bug.

A common question is, “How much testing is enough?” There’s no good measurement for this. Some people advocate using test coverage [[mf-tc](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/biblo.xhtml#bib35)] as a measure, but test coverage analysis is only good for identifying untested areas of the code, not for assessing the quality of a test suite.

The best measure for a good enough test suite is subjective: How confident are you that if someone introduces a defect into the code, some test will fail? This isn’t something that can be objectively analyzed, and it doesn’t account for false confidence, but the aim of self-testing code is to get that confidence. If I can refactor my code and be pretty sure that I’ve not introduced a bug because my tests come back green—then I can be happy that I have good enough tests.

It is possible to write too many tests. One sign of that is when I spend more time changing the tests than the code under test—and I feel the tests are slowing me down. But while over-testing does happen, it’s vanishingly rare compared to under-testing.

# Chapter 5
## Introducing the Catalog

This catalog started from my personal notes that I made to remind myself how to do refactorings in a safe and efficient way. Since then, I’ve refined the catalog, and there’s more of it that comes from deliberate exploration of some refactoring moves. It’s still something I use when I do a refactoring I haven’t done in a while.
### Format of the Refactorings
As I describe the refactorings in the catalog, I use a standard format. Each refactoring has five parts, as follows:

- I begin with a **name**. The name is important to building a vocabulary of refactorings. This is the name I use elsewhere in the book. Refactorings often go by different names now, so I also list any aliases that seem to be common.
- I follow the name with a short **sketch** of the refactoring. This helps you find a refactoring more quickly.
- The **motivation** describes why the refactoring should be done and describes circumstances in which it shouldn’t be done.
- The **mechanics** are a concise, step-by-step description of how to carry out the refactoring.
- The **examples** show a very simple use of the refactoring to illustrate how it works.

# Chapter 6  
## A First Set of Refactorings

Probably the most common refactoring I do is extracting code into a function (_[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_) or a variable (_[Extract Variable](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec3) ([119](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_119))_). Since refactoring is all about change, it’s no surprise that I also frequently use the inverses of those two (_[Inline Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec2) ([115](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_115))_ and _[Inline Variable](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec4) ([123](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_123))_).

Extraction is all about giving names, and I often need to change the names as I learn. _[Change Function Declaration](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec5) ([124](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_124))_ changes names of functions; I also use that refactoring to add or remove a function’s arguments. For variables, I use _[Rename Variable](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec7) ([137](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_137))_, which relies on _[Encapsulate Variable](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec6) ([132](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_132))_. When changing function arguments, I often find it useful to combine a common clump of arguments into a single object with _[Introduce Parameter Object](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec8) ([140](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_140))_.

Forming and naming functions are essential low-level refactorings—but, once created, it’s necessary to group functions into higher-level modules. I use _[Combine Functions into Class](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec9) ([144](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_144))_ to group functions, together with the data they operate on, into a class. Another path I take is to combine them into a transform (_[Combine Functions into Transform](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec10) ([149](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_149))_), which is particularly handy with read-only data. At a step further in scale, I can often form these modules into distinct processing phases using _[Split Phase](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec11) ([154](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_154))_.

### Extract Function
formerly: _Extract Method_

```js
function printOwning(invoice) {
	printBanner();
	let outstanding = calculateOutstanding();

	// print details
	console.log('name: ' + invoice.customer);
	console.log('amount: ' + outstanding);
}

// Refactoring
function printOwning(invoice) {
	printBanner();
	let outstanding = calculateOutstanding();
	printDetails(outstanding);

	// print details
	function printDetails(outstanding) {
		console.log('name: ' + invoice.customer);
		console.log('amount: ' + outstanding);
	}
}
```

Extract Function is one of the most common refactorings I do. (Here, I use the term “function” but the same is true for a method in an object-oriented language, or any kind of procedure or subroutine.) I look at a fragment of code, understand what it is doing, then extract it into its own function named after its purpose.
 If you have to spend effort looking at a fragment of code and figuring out _what_ it’s doing, then you should extract it into a function and name the function after the “what.” Then, when you read it again, the purpose of the function leaps right out at you, and most of the time you won’t need to care about how the function fulfills its purpose (which is the body of the function).
#### Mechanics
- Create a new function, and name it after the intent of the function (name it by what it does, not by how it does it).
    
    If the code I want to extract is very simple, such as a single function call, I still extract it if the name of the new function will reveal the intent of the code in a better way. If I can’t come up with a more meaningful name, that’s a sign that I shouldn’t extract the code. However, I don’t have to come up with the best name right away; sometimes a good name only appears as I work with the extraction. It’s OK to extract a function, try to work with it, realize it isn’t helping, and then inline it back again. As long as I’ve learned something, my time wasn’t wasted.
    
    If the language supports nested functions, nest the extracted function inside the source function. That will reduce the amount of out-of-scope variables to deal with after the next couple of steps. I can always use _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ later.

- Copy the extracted code from the source function into the new target function.

- Scan the extracted code for references to any variables that are local in scope to the source function and will not be in scope for the extracted function. Pass them as parameters.
    If I extract into a nested function of the source function, I don’t run into these problems.
    
    Usually, these are local variables and parameters to the function. The most general approach is to pass all such parameters in as arguments. There are usually no difficulties for variables that are used but not assigned to.
    
    If a variable is only used inside the extracted code but is declared outside, move the declaration into the extracted code.
    
    Any variables that are assigned to need more care if they are passed by value. If there’s only one of them, I try to treat the extracted code as a query and assign the result to the variable concerned.
    
    Sometimes, I find that too many local variables are being assigned by the extracted code. It’s better to abandon the extraction at this point. When this happens, I consider other refactorings such as _[Split Variable](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch09.xhtml#ch09lev1sec1) ([240](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch09.xhtml#page_240))_ or _[Replace Temp with Query](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec4) ([178](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_178))_ to simplify variable usage and revisit the extraction later.

- Compile after all variables are dealt with.
    Once all the variables are dealt with, it can be useful to compile if the language environment does compile-time checks. Often, this will help find any variables that haven’t been dealt with properly.

- Replace the extracted code in the source function with a call to the target function.

- Test.

- Look for other code that’s the same or similar to the code just extracted, and consider using _[Replace Inline Code with Function Call](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec5) ([222](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_222))_ to call the new function.
    Some refactoring tools support this directly. Otherwise, it can be worth doing some quick searches to see if duplicate code exists elsewhere.

### Inline Function

One of the themes of this book is using short functions named to show their intent, because these functions lead to clearer and easier to read code. But sometimes, I do come across a function in which the body is as clear as the name. Or, I refactor the body of the code into something that is just as clear as the name. When this happens, I get rid of the function. Indirection can be helpful, but needless indirection is irritating.
I also use Inline Function is when I have a group of functions that seem badly factored. I can inline them all into one big function and then reextract the functions the way I prefer.
I commonly use Inline Function when I see code that’s using too much indirection—when it seems that every function does simple delegation to another function, and I get lost in all the delegation. Some of this indirection may be worthwhile, but not all of it. By inlining, I can flush out the useful ones and eliminate the rest.
#### Mechanics
- Check that this isn’t a polymorphic method.
    If this is a method in a class, and has subclasses that override it, then I can’t inline it.
	
- Find all the callers of the function.

- Replace each call with the function’s body.

- Test after each replacement.
    The entire inlining doesn’t have to be done all at once. If some parts of the inline are tricky, they can be done gradually as opportunity permits.

- Remove the function definition.

### Extract Variable

Expressions can become very complex and hard to read. In such situations, local variables may help break the expression down into something more manageable. In particular, they give me an ability to name a part of a more complex piece of logic. This allows me to better understand the purpose of what’s happening. Such variables are also handy for debugging, since they provide an easy hook for a debugger or print statement to capture.

#### Mechanics
- Ensure that the expression you want to extract does not have side effects.
- Declare an immutable variable. Set it to a copy of the expression you want to name.
- Replace the original expression with the new variable.
- Test.

### Change Function Declaration
Functions represent the primary way we break a program down into parts. Function declarations represent how these parts fit together—effectively, they represent the joints in our software systems. And, as with any construction, much depends on those joints. Good joints allow me to add new parts to the system easily, but bad ones are a constant source of difficulty, making it harder to figure out what the software does and how to modify it as my needs change. Fortunately, software, being soft, allows me to change these joints, providing I do it carefully. A good way to improve a name is to write a comment to describe the function’s purpose, then turn that comment into a name.

##### _Simple Mechanics_
- If you’re removing a parameter, ensure it isn’t referenced in the body of the function.
- Change the method declaration to the desired declaration.
- Find all references to the old method declaration, update them to the new one.
- Test

It’s often best to separate changes, so if you want to both change the name and add a parameter, do these as separate steps. (In any case, if you run into trouble, revert and use the migration mechanics instead.)

### Encapsulate Variable

Refactoring is all about manipulating the elements of our programs. Data is more awkward to manipulate than functions. Since using a function usually means calling it, I can easily rename or move a function while keeping the old function intact as a forwarding function (so my old code calls the old function, which calls the new function). I’ll usually not keep this forwarding function around for long, but it does simplify the refactoring.

Data is more awkward because I can’t do that. If I move data around, I have to change all the references to the data in a single cycle to keep the code working. For data with a very small scope of access, such as a temporary variable in a small function, this isn’t a problem. But as the scope grows, so does the difficulty, which is why global data is such a pain.

Encapsulating data is valuable for other things too. It provides a clear point to monitor changes and use of the data; I can easily add validation or consequential logic on the updates. It is my habit to make all mutable data encapsulated like this and only accessed through functions if its scope is greater than a single function. The greater the scope of the data, the more important it is to encapsulate. My approach with legacy code is that whenever I need to change or add a new reference to such a variable, I should take the opportunity to encapsulate it. That way I prevent the increase of coupling to commonly used data.

This principle is why the object-oriented approach puts so much emphasis on keeping an object’s data private. Whenever I see a public field, I consider using Encapsulate Variable (in that case often called _Encapsulate Field_) to reduce its visibility. Some go further and argue that even internal references to fields within a class should go through accessor functions—an approach known as self-encapsulation. On the whole, I find self-encapsulation excessive—if a class is so big that I need to self-encapsulate its fields, it needs to be broken up anyway. But self-encapsulating a field is a useful step before splitting a class.

Keeping data encapsulated is much less important for immutable data. When the data doesn’t change, I don’t need a place to put in validation or other logic hooks before updates. I can also freely copy the data rather than move it—so I don’t have to change references from old locations, nor do I worry about sections of code getting stale data. Immutability is a powerful preservative.

#### Mechanics

- Create encapsulating functions to access and update the variable.

- Run static checks.

- For each reference to the variable, replace with a call to the appropriate encapsulating function. Test after each replacement.

- Restrict the visibility of the variable.
    Sometimes it’s not possible to prevent access to the variable. If so, it may be useful to detect any remaining references by renaming the variable and testing.

	
- Test.

- If the value of the variable is a record, consider _[Encapsulate Record](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec1) ([162](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_162))_.

### Introduce Parameter Object

I often see groups of data items that regularly travel together, appearing in function after function. Such a group is a data clump, and I like to replace it with a single data structure.

Grouping data into a structure is valuable because it makes explicit the relationship between the data items. It reduces the size of parameter lists for any function that uses the new structure. It helps consistency since all functions that use the structure will use the same names to get at its elements.

But the real power of this refactoring is how it enables deeper changes to the code. When I identify these new structures, I can reorient the behavior of the program to use these structures. I will create functions that capture the common behavior over this data—either as a set of common functions or as a class that combines the data structure with these functions. This process can change the conceptual picture of the code, raising these structures as new abstractions that can greatly simplify my understanding of the domain. When this works, it can have surprisingly powerful effects—but none of this is possible unless I use Introduce Parameter Object to begin the process.
#### Mechanics

- If there isn’t a suitable structure already, create one.
	I prefer to use a class, as that makes it easier to group behavior later on. I usually like to ensure these structures are value objects
- Test.
- Use _[Change Function Declaration](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec5) ([124](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_124))_ to add a parameter for the new structure.
- Test.
- Adjust each caller to pass in the correct instance of the new structure. Test after each one.
- For each element of the new structure, replace the use of the original parameter with the element of the structure. Remove the parameter. Test.

### Combine Functions into Class

Classes are a fundamental construct in most modern programming languages. They bind together data and functions into a shared environment, exposing some of that data and function to other program elements for collaboration. They are the primary construct in object-oriented languages, but are also useful with other approaches too.

When I see a group of functions that operate closely together on a common body of data (usually passed as arguments to the function call), I see an opportunity to form a class. Using a class makes the common environment that these functions share more explicit, allows me to simplify function calls inside the object by removing many of the arguments, and provides a reference to pass such an object to other parts of the system.

In addition to organizing already formed functions, this refactoring also provides a good opportunity to identify other bits of computation and refactor them into methods on the new class.

#### Mechanics
- Apply _[Encapsulate Record](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec1) ([162](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_162))_ to the common data record that the functions share.
    If the data that is common between the functions isn’t already grouped into a record structure, use _[Introduce Parameter Object](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec8) ([140](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_140))_ to create a record to group it together.
- Take each function that uses the common record and use _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ to move it into the new class.
    Any arguments to the function call that are members can be removed from the argument list.
- Each bit of logic that manipulates the data can be extracted with _[Extract Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec1) ([106](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_106))_ and then moved into the new class.

# Chapter 7  
## Encapsulation

### Encapsulate Record
formerly: _Replace Record with Data Class_

```js
organization = {name: "Acme Gooseberries", country: "GB"}

class Organization {
	constructor(data) {
		this._name = data.name;
		this._country = data.country;
	}

	get name() {return this._name};
	set name(arg) {this._name = arg};

	get country() {return this._country};
	set country(arg) {this._country = arg};
}
```

##### Mechanics

- Use _[Encapsulate Variable](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#ch06lev1sec6) ([132](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch06.xhtml#page_132))_ on the variable holding the record.
    Give the functions that encapsulate the record names that are easily searchable.

- Replace the content of the variable with a simple class that wraps the record. Define an accessor inside this class that returns the raw record. Modify the functions that encapsulate the variable to use this accessor.

- Test.

- Provide new functions that return the object rather than the raw record.

- For each user of the record, replace its use of a function that returns the record with a function that returns the object. Use an accessor on the object to get at the field data, creating that accessor if needed. Test after each change.
    If it’s a complex record, such as one with a nested structure, focus on clients that update the data first. Consider returning a copy or read-only proxy of the data for clients that only read the data.
	
- Remove the class’s raw data accessor and the easily searchable functions that returned the raw record.

- Test.

- If the fields of the record are themselves structures, consider using Encapsulate Record and _[Encapsulate Collection](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#ch07lev1sec2) ([170](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch07.xhtml#page_170))_ recursively.

### Extract Class

You’ve probably read guidelines that a class should be a crisp abstraction, only handle a few clear responsibilities, and so on. In practice, classes grow. You add some operations here, a bit of data there. You add a responsibility to a class feeling that it’s not worth a separate class—but as that responsibility grows and breeds, the class becomes too complicated. Soon, your class is as crisp as a microwaved duck.

Imagine a class with many methods and quite a lot of data. A class that is too big to understand easily. You need to consider where it can be split—and split it. A good sign is when a subset of the data and a subset of the methods seem to go together. Other good signs are subsets of data that usually change together or are particularly dependent on each other. A useful test is to ask yourself what would happen if you remove a piece of data or a method. What other fields and methods would become nonsense?

One sign that often crops up later in development is the way the class is sub-typed. You may find that subtyping affects only a few features or that some features need to be subtyped one way and other features a different way.
#### Mechanics

- Decide how to split the responsibilities of the class.
    
- Create a new child class to express the split-off responsibilities.
    
    If the responsibilities of the original parent class no longer match its name, rename the parent.
    
- Create an instance of the child class when constructing the parent and add a link from parent to child.
    
- Use _[Move Field](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec2) ([207](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_207))_ on each field you wish to move. Test after each move.
    
- Use _[Move Function](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#ch08lev1sec1) ([198](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch08.xhtml#page_198))_ to move methods to the new child. Start with lower-level methods (those being called rather than calling). Test after each move.
    
- Review the interfaces of both classes, remove unneeded methods, change names to better fit the new circumstances.
    
- Decide whether to expose the new child. If so, consider applying _[Change Reference to Value](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch09.xhtml#ch09lev1sec4) ([252](https://learning.oreilly.com/library/view/refactoring-improving-the/9780134757681/ch09.xhtml#page_252))_ to the child class.


