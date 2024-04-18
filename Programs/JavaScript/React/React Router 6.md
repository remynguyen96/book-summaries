![[MPAs.png]]
![[SPAs.png]]


1. What is a route/url parameter?
A portion of our route path that is a placeholder for what will eventually be the actual segment in the URL of the page.

2. Add a route parameter called `productId` to the Route path below:
```jsx
	<Route path="/products/:productId" element={<ProductDetail />} />
``` 

3. Add whatever you need to add for the component below to display the route parameter in the `<h1>`

```jsx
import { useParams } from "react-router-dom"
function ProductDetail() {
	const { productId } = useParams()
	return <h1>Product id is {productId}</h1>
}
```


## Nested Routes
- Nested URL
	- /van
	- /van/van-id-or-name
- Shared UI
	- Often parts of the page are shared within the same route.

![[Nested-UI.png]]

1. What is the primary reason to use a nested route?
Whenever we have some shared UI between routes in our app.

2. What is a "Layout Route"?
It's the parent route of some nested routes that contains just the portion of the UI that will be shared. It will use an `Outlet` component.

3. What does the `<Outlet />` component do? When do you use it?
We use it anytime we have a parent Route that's wrapping children routes. It renders the matching child route's `element` prop given in its route definition
  
4. What is an "Index Route"?
It's the "default route" we want to render when the path of the parent route matches. It gives us a chance to render an element inside the parent's `<Outlet />` at the same path as the parent route.


```jsx
import { BrowserRouter, Routes, Routes, Outlet } from "react-router-dom"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="about" element={<About />} />
	
					<Route path="vans">
						<Route index element={<Vans />} />
						<Route path=":id" element={<VanDetail />} />
					</Route
	
					<Route path="host" element={<HostLayout />}>
						<Route index element={<Dashboard />} />
						<Route path="income" element={<Income />} />
						<Route path="reviews" element={<Reviews />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default function Layout() {
	return (
		<>
			<Header />
			<Outlet />
		</>
	)
}

export default function HostLayout() {
	return (
		<>
			<nav className="host-nav">
				<Link to="/host">Dashboard</Link>
				<Link to="/host/income">Income</Link>
				<Link to="/host/reviews">Reviews</Link>
			</nav>
			<Outlet />
		</>
	)
}
```

#### Search/Query Parameters
- Represent a change in the UI
	- Sorting, filtering, pagination
- Used as a *single source of truth* for certain application state.
	- Ask yourself: "Should a user be able to revisit or share this page just like it is?" If yes, then you might consider raising that state up to the URL in a query parameter.
- Key/value pairs in the URL. Begin with **?** (/vans?type=rugged) and separated by **&** (/vans?type=rugged&filterBy=price)

```jsx
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams()

return (
	<button onClick={() => setSearchParams({ type: "jedi" })}>Jedi</button>
) 
```

### Protected Routes
Purpose: stop data fetching of sensitive information. Only allow logged-in users to access their data.

Preventing renders
**Approach**: If user isn't logged in, stop data fetching by blocking components from rendering and send to the Login page. Since fetching is happening inside the components, if those components never render, the fetching never happens.



1. How did we change our route definitions in order to "protect" certain routes from an un-logged-in user?
Wrapped the routes we wanted to protect in a Layout route that contains logic to redirect someone if they're not logged in

2. What component can we use to automatically send someone to a different route in our app?
`<Navigate to="/login" />`

3. What component can we render if the user IS logged in?
`<Outlet />`

![[History Stack.png]]


