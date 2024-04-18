**What we'll learn**
- How React Renders Components
- Strict Equality
- React.StrictMode
- Code Splitting
- `useMemo`
	- To remember calculated values between renders. 
	- Avoid recalculation expensive calculations if it's not necessary.
	- Maintain referential equality of a complex data type between renders.
- `React.memo`
	- Memoizes a component if the props don't change from one render to the next.
	- The rendering phase in React isn't usually slow/expensive. It's more important to [fix slow renders](https://kentcdodds.com/blog/fix-the-slow-render-before-you-fix-the-re-render) before worrying about reducing re-renders.
- `useCallback` 
	- For caching function definitions.
	- Maintaining reference to functions between renders

**Perfjormance Strategies**
- Send less code to the browser (Code Splitting)
- Cache expensive calculations to re-use from render to render
- Avoid unnecessary re-renders
- Re-structure the application
#### How React Renders
React will render all of components in application recursively
![[Recursive Rendering.png]]
#### What actually happens during a re-render?
State Change -> Render -> Reconciliation -> Commit to DOM

**Rendering Phases**
1. Rendering
	- All components in this branch of the tree are called again. Any calculations, function creations, and side effects get run again in JS, and a new virtual DOM model is created.
2. Reconciliation
	- React uses an advanced "diff algorithm" to check the previous version of the virtual DOM against the new version of the virtual DOM and determines what has actually changed from the last render.
3. Commit
	- React makes changes to the actual DOM based on the smallest amount of work needed (based on what it determined in reconciliation) to ensure the actual DOM is displaying correctly.

#### What is StrictMode doing?
- Double renders all functions that should be pure functions.
- Re-runs all effects in components
- Checks for deprecated React APIs"

Ref: https://react.dev/reference/react/StrictMode

#### What is Code Splitting?
- Instead of always importing heavy code, you can conditionally import it only if/when needed
- Splits up download times, so your main feature aren't blocked by slow connections.
- Sometimes bypassed unneeded code altogether
#### How does it work?
- Uses dynamic import function - `import()` 
- Combine `import()` with `React.lazy()` to only load a heavy component if needed. Use `React.lazy()` to create a suspending component
- Use `<React.Suspense>` component to provide a fallback UI while the `lazy` component is loading. The prop to give `React` something to render in the meantime while it's downloading all the code for the suspended component.
#### What is referential equality?
- JavaScripts stores all functions and values in memory.
	- **Value types** (a.k.a primitive type): Strings, Booleans, Numbers
	- **Reference types** (a.k.a complex type): Objects, Arrays, Functions

