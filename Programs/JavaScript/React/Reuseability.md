### What is prop drilling?

> **Prop drilling** happens when a component down the component tree needs access to data in a grandparent (or higher) component, and that data is manually passed down to each child component until it finally reaches the component that needs in.

![[Prop drilling.png]]

##### Solutions to~ prop drilling
- Do nothing!
	- [Avoid Hasty Abstraction](https://kentcdodds.com/blog/aha-programming)
- Compound components
	- "Flattens" the structure
	- Easily pass props to more deeply-nested components
- Context
	- Access state directly from the components that need it
	
### Compound components

HTML Examples: 
```html
- <form>, <input>
- <ul>, <li>
- <table>, <thread>, <tbody>, <td>,...
- <select>,<option>
```

- Use children props
- Have dedicated function/styling
- Make the component structure more transparent
- Give more control to the `user` of the component
##### Compound Components Quiz

1. How would you explain the concept of compound components in React to someone who only knows the very basics of React?
=> Components that work together to accomplish a greater objective than might make sense to try and accomplish with a single component alone.

2. What are some examples of HTML elements that work together to add functionality or styling to each other?
=>  `<ul> & <li>,  <select> & <option>`

3. How can compound components help you avoid having to drill props multiple levels down?
=> Compound component "flatten" the heirarchy that I would otherwise need to pass props through. Since I need to provide the children to render, the parent-most component has direct access to those "grandchild" components, to which it can pass whatever props it needs to pass directly.
##### Implementation

![[Prop Drilling Implementation.png]]

```jsx
// App.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import Menu from "./Menu/Menu"
import MenuButton from "./Menu/MenuButton"
import MenuDropdown from "./Menu/MenuDropdown"
import MenuItem from "./Menu/MenuItem"

function App() {
const sports = ["Tennis", "Pickleball", "Racquetball", "Squash"]

return (
	<Menu>
		<MenuButton>Sports</MenuButton>
		<MenuDropdown>
			{sports.map(sport => (
				<MenuItem key={sport}>{sport}</MenuItem>
			))}
		</MenuDropdown>
	</Menu>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);


// Menu.jsx
export default function Menu({ children }) {
	const [open, setOpen] = React.useState(true)
	function toggle() {
		setOpen(prevOpen => !prevOpen)
	}
	return  <div className="menu"> {children} </div>
}

// MenuButton.jsx
export default function MenuButton({ children, onClick }) {
	return <Button onClick={onClick}>{children}</Button> 
}

// MenuDropdown.jsx
export default function MenuDropdown({ children }) {
	return  <div className="menu-dropdown">{children}</div>
}

// MenuItem.jsx
export default function MenuItem({ children }) {
	return  <div className="menu-item">{children}</div>
}

```

### Implicit State

###### React.Children
Utility that provides methods for interacting with a component's direct children elements.
- React.Children.map()
- React.Children.forEach()
- React.cloneElement()
	- Utility that duplicates a React element and provides a way to inject additional props to that element
	- When used with `React.Children.map()`, it can be used to 'argument' the original children with new props

**What's wrong with React.Children?**
	Fragile / delicate

Ref: https://react.dev/reference/react/Children

```jsx
// App.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import Menu from "./Menu/Menu"
import MenuButton from "./Menu/MenuButton"
import MenuDropdown from "./Menu/MenuDropdown"
import MenuItem from "./Menu/MenuItem"

function App() {
const sports = ["Tennis", "Pickleball", "Racquetball", "Squash"]

return (
	<Menu>
		<MenuButton>Sports</MenuButton>
		<MenuDropdown>
			{sports.map(sport => (
				<MenuItem key={sport}>{sport}</MenuItem>
			))}
		</MenuDropdown>
	</Menu>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);


// Menu.jsx
export default function Menu({ children }) {
	const [open, setOpen] = React.useState(true)
	function toggle() {
		setOpen(prevOpen => !prevOpen)
	}
	
	return (
		<div className="menu">
			{React.Children.map(children, (child) => {
				 return React.cloneElement(child, {
					 open,
					 toggle
				 })			 
			})}	
		</div>
	)
}

// MenuButton.jsx
export default function MenuButton({ children, toggle }) {
	return <Button onClick={toggle}>{children}</Button> 
}

// MenuDropdown.jsx
export default function MenuDropdown({ children, open }) {
	return open && <div className="menu-dropdown">{children}</div>
}

// MenuItem.jsx
export default function MenuItem({ children }) {
	return  <div className="menu-item">{children}</div>
}

```

###### Context

```jsx
// App.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import Menu from "./Menu/Menu"
import MenuButton from "./Menu/MenuButton"
import MenuDropdown from "./Menu/MenuDropdown"
import MenuItem from "./Menu/MenuItem"

function App() {
const sports = ["Tennis", "Pickleball", "Racquetball", "Squash"]

return (
	<Menu>
		<MenuButton>Sports</MenuButton>
		<MenuDropdown>
			{sports.map(sport => (
				<MenuItem key={sport}>{sport}</MenuItem>
			))}
		</MenuDropdown>
	</Menu>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);


// Menu.jsx
const MenuContext = React.createContext()

export default function Menu({ children }) {
	const menuId = React.useId();
	const [open, setOpen] = React.useState(true)
	
	function toggle() {
		setOpen(prevOpen => !prevOpen)
	}
	
	return (
		<MenuContext.Provider value={{ menuId, open, toggle }}>
			<div className="menu" role="menu">
				{children}
			</div>
		</MenuContext.Provider>
	)
}

// MenuButton.jsx
export default function MenuButton({ children }) {
	const { menuId, open, toggle } = useContext(MenuContext);
	return (
		<Button
			onClick={toggle}
			aria-expanded={open}
			aria-haspopup="true"
			aria-controls={menuId}>								
			{children}
		</Button>
	)
}

// MenuDropdown.jsx
export default function MenuDropdown({ children }) {
	const { open, menuId } = useContext(MenuContext);
	return open && <div className="menu-dropdown" id={menuId} aria-hidden={!open}>{children}</div>
}

// MenuItem.jsx
export default function MenuItem({ children }) {
	return  <div className="menu-item">{children}</div>
}

```

#### A11y for toggles menus
- `role="menu"`
- `aria-expanded`
- `aria-haspopup`
- `aria-hidden`
- `aria-controls`

**Enhance imports**

```jsx
import Menu from "./Menu"
import MenuButton from "./MenuButton"
import MenuDropdown from "./MenuDropdown"
import MenuItem from "./MenuItem"

Menu.Button = MenuButton
Menu.Dropdown = MenuDropdown
Menu.Item = MenuItem

export default Menu

// App.jsx
return (
	<Menu>
		<Menu.Button>Sports</Menu.Button>
		<Menu.Dropdown>
		{sports.map(sport => (
			<Menu.Item key={sport}>{sport}</Menu.Item>
		))}
		</Menu.Dropdown>
	</Menu>
)
```

#### Render Props
```jsx
// App.tsx
import React from "react"
function App() {
	return (
		<Decision>
			{(goingOut) => {
				return (
					<h1>Am I going out tonight?? {goingOut ? "Yes!" : "Nope..."}</h1>
				)
			}}
		</Decision>
	)
}
  
export default function Decision({ children }) {
	const [goingOut, setGoingOut] = React.useState(false)
	function toggleGoingOut() {
		setGoingOut(prev => !prev)
	}

	return (
		<div>
			<button onClick={toggleGoingOut}>Change mind</button>
			{children(goingOut)}
		</div>
	)
}
```

#### Custom Hooks
**Build-in**
- `useState`
- `useEffect`
- `useRef`
- etc.
**Custom**
- Combine existing hooks into custom, reusable pieces of logics
- Similar to regular utility functions, but use hooks to access the render cycles of React. 





