### Hooks
- You can’t call Hooks inside conditions, loops, or other nested functions. 
- Hooks are functions, but it’s helpful to think of them as unconditional declarations about your component’s needs. 
- You “**use**” React features at the top of your component similar to how you “import” modules at the top of your file (Hooks can only be called at the top level of the component function)

### Rendering
- Rendering must always be a pure calculation:
	- **Same inputs, same output**. Given the same inputs, a component should always return the same JSX 
	- **It minds its own business**. It should not change any objects or variables that existed before rendering
	- Setting state does not change the variable in the existing render, but it requests a new render.
	- During the re-render, React will process the queue. Updater functions run during rendering, so updater functions must be pure and only return the result.	
	- React processes state updates after event handlers have finished running. This is called batching.

### Naming conventions
- It’s common to name the updater function argument by the first letters of the corresponding state variable:
```js
setEnabled(e => !e);  
setLastName(ln => ln.reverse());  
setFriendCount(fc => fc * 2);
```

- As a rule of thumb, Effect Events should correspond to something that happens from the _user’s_ perspective. Should name your Effect Events after what the user thinks has happened, not when some code happened to run.
- For example, `onMessage`, `onTick`, `onVisit`, or `onConnected` are good Effect Event names.

-  Hook names must start with `use` followed by a capital letter, like [`useState`](https://react.dev/reference/react/useState) (built-in) or `useOnlineStatus` (custom, like earlier on the page). Hooks may return arbitrary values.


### Why is mutating state not recommended in React
- **Debugging**: You can clearly see how state has changed between renders if you use `console.log` and don't mutate state.
- **Optimization**: If you never mutate state, it is very fast to check whether there were any changes.
- **New features**: The new React feature we're building rely on state being treated like a snapshot. That may prevent you from using new features if you're mutating past version of state.
- **Requirement Changes**: Like implementing Undo/Redo, showing a history of changes, or letting the user reset a form to earlier values, are easier to do when nothing is mutated.
- **Simpler Implementation**: Because React does not rely on mutation, it does not need to do anything special with your objects. It does not need to hijack their properties, always wrap them into Proxies, or do other work at initialization as many “reactive” solutions do. This is also why React lets you put any object into state—no matter how large—without additional performance or correctness pitfalls.

In practice, you can often "get away" with mutating state in React, but we strongly advise you not to do that so that you can use new React features developed with this approach in mind.


### Principles for structuring state
The goal behind these principles is to _make state easy to update without introducing mistakes_.

1. **Group related state.** If you always update two or more state variables at the same time, consider merging them into a single state variable.

2. **Avoid contradictions in state.** When the state is structured in a way that several pieces of state may contradict and “disagree” with each other, you leave room for mistakes. Try to avoid this.

3. **Avoid redundant state.** If you can calculate some information from the component’s props or its existing state variables during rendering, you should not put that information into that component’s state.

4. **Avoid duplication in state.** When the same data is duplicated between multiple state variables, or within nested objects, it is difficult to keep them in sync. Reduce duplication when you can.
   
5. **Avoid deeply nested state.** Deeply hierarchical state is not very convenient to update. When possible, prefer to structure state in a flat way.

## Writing reducers well

- **Reducers must be pure.** Similar to [state updater functions](https://react.dev/learn/queueing-a-series-of-state-updates), reducers run during rendering! (Actions are queued until the next render.) This means that reducers [must be pure](https://react.dev/learn/keeping-components-pure)—same inputs always result in the same output. They should not send requests, schedule timeouts, or perform any side effects (operations that impact things outside the component). They should update [objects](https://react.dev/learn/updating-objects-in-state) and [arrays](https://react.dev/learn/updating-arrays-in-state) without mutations.

- **Each action describes a single user interaction, even if that leads to multiple changes in the data.** For example, if a user presses “Reset” on a form with five fields managed by a reducer, it makes more sense to dispatch one `reset_form` action rather than five separate `set_field` actions. If you log every action in a reducer, that log should be clear enough for you to reconstruct what interactions or responses happened in what order. This helps with debugging!

### Keys

When children have keys, React uses the key to match children in the original tree with children in the subsequent tree. Keys should be stable, predictable, and unique. Unstable keys (like those produced by `Math.random()`) will cause many component instances and DOM nodes to be unnecessarily recreated, which can cause performance degradation and lost state in child components.



https://react.dev/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state
As a rule of thumb, **if you want to preserve the state between re-renders, the structure of your tree needs to “match up”** from one render to another. If the structure is different, the state gets destroyed because React destroys state when it removes a component from the tree.



https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components

https://react.dev/learn/preserving-and-resetting-state#same-component-at-the-same-position-preserves-state