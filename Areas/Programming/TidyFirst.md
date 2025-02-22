## Guard Clauses

You see some code like this:
```ts
if (condition)
    ...some code...

// Or even better, this:

if (condition)
    if (not other condition)
        ...some code...
```

As a reader, it’s easy to get lost in nested conditions. Tidy the above to:
```ts
if (not condition) return
if (other condition) return
...some code...
```

This is easier to read. It says, “Before we get into the details of the code, there are some preconditions we need to bear in mind.”

Code with guard clauses is easier to analyze because the preconditions are explicit

## Dead Code

Delete it. That’s all. If the code doesn’t get executed, just delete it.

Deleting dead code can feel mighty strange. After all, someone took the time and effort to write it. The organization paid for it. There it is. All somebody has to do to make it valuable is call it again. If we need it again, we’ll be sad we deleted it.

I’ll leave it as an exercise for you, tidy reader, to identify all the cognitive biases I just demonstrated.

Sometimes it’s easy to identify dead code. Sometimes, because of extensive use of reflection, it’s not so easy. If you suspect code isn’t used, pre-tidy it by logging its use. Put the pre-tidying into production and wait until you’re confident.

You might ask, “But what if we need it later?” That’s what version control is for. We aren’t really deleting anything. We just don’t have to look at it right now. If (and this is a long string of conditionals) we 1) have a lot of code that 2) isn’t used right now that 3) we want to use in the future 4) in exactly the same way it was originally written and 5) it still works, then yes, we can get it back. Or we can just write it again, and better. But if worse comes to worst, we can always get it back.

## Cohesion Order

You read the code, you figure out that to make a behavior change you’re going to have to change several widely dispersed spots in the code, and you get grumpy. What should you do?

Reorder the code so the elements you need to change are adjacent. Cohesion order works for routines in a file: if two routines are coupled, put them next to each other. It also works for files in directories: if two files are coupled, put them in the same directory. It even works across repositories: put coupled code in the same repository before changing it.

Why not just eliminate the coupling? If you know how to do that, go for it. That’s the best tidying of all, assuming:

cost(decoupling) + cost(change) < cost(coupling) + cost(change)

It may not be feasible, though, for various reasons:

Decoupling can be an intellectual stretch (you don’t know how to do it).

Decoupling can be a time/money stretch (you could do it, but you can’t afford to take that time just now).

Decoupling can be a relationship stretch (the team has taken as much change as it can handle right now).

You aren’t stuck with Swiss cheese changes. Tidying can increase cohesion enough to make behavior changes easier. Sometimes the increased clarity from slightly better cohesion unlocks whatever is blocking you from decoupling. Sometimes better cohesion helps you live with the coupling.

## Move Declaration and Initialization Together

Variables and their initialization seem to drift apart sometimes. The name of a variable gives you a hint as to its role in the computation. However, the initialization reinforces the message of the name. When you come across code that separates the declaration (with a possible type) and initialization, it’s harder to read. By the time you get to the initialization, you’ve forgotten some of the context of what the variable is for.

Here’s what this tidying looks like. Imagine you have some code like this:
```ts
fn()
    int a
    ...some code that doesn't use a
    a = ...
    int b
    ...some more code, maybe it uses a but doesn't use b
    b = ...a...
    ...some code that uses b
```
Tidy this by moving the initialization up to the declaration:

```ts
fn()
    int a = ...
    ...some code that doesn't use a
    ...some more code, maybe it uses a but doesn't use b
    int b = ...a...
    ...some code that uses b
```

Play around with the order. Is it easier to read and understand the code if each of the variables is declared and initialized just before it’s used, or if they’re all declared and initialized together at the top of the function? This is where you get to be a mystery writer, imagining the experience of a reader of your code and leaving them the clues they need to guess who done it.

You can’t just put variables and code that sets them in any old order. You must respect the data dependencies between variables. If you use a to initialize b, you have to initialize a first. As you’re executing this tidying, remember that you have to maintain the order of the data dependencies.

If you have to analyze data dependencies by hand, you are going to eventually make mistakes. You’ll accidentally change the behavior of the code when you were just trying to improve its structure. No problem. Back up to a known correct version of the code. Work in smaller steps. That’s the tidying way. Big design changes too hard and scary? Take smaller steps. No, smaller. Still scary? No? Good.