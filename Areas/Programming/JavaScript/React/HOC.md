### Overview
Within our application, we often want to use the same logic in multiple components. This logic can include applying a certain styling to components, requiring authorization, or adding a global state.

One way of being able to reuse the same logic in multiple components, is by using the **higher order component** pattern. This pattern allows us to reuse component logic throughout our application.

A Higher Order Component (HOC) is a component that receives another component. The HOC contains certain logic that we want to apply to the component that we pass as a parameter. After applying that logic, the HOC returns the element with the additional logic.

### Implementation

We can apply logic to another component, by:
1. Receiving another component as its `props`
2. Applying additional logic to the passed component
3. Returning the same or a new component with additional logic

```jsx
function withLoader(Element, url) {
  return props => {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch(url)
        .then(res => res.json())
        .then(data => setData(data));
    }, []);

    if (!data) return <div>Loading...</div>;

    return <Element {...props} data={data} />;
  };
}

function DogImages(props) {
  return (
	  <div id="list">
		{props.data.message.map((dog, index) => (
		  <img src={dog} alt="Dog" key={index} />
		))}
	  </div>
  );
}

export default withLoader(
DogImages,
"https://dog.ceo/api/breed/labrador/images/random/6"
);


```

### Best use-cases for a HOC

- The _same, uncustomized_ behavior needs to be used by many components throughout the application.
- The component can work standalone, without the added custom logic.

### Tradeoffs

> **✅ Separation of concerns**:** Using the Higher-Order-Component pattern allows us to keep logic that we want to re-use all in one place. This reduces the risk of accidentally spreading bugs throughout the application by duplicating code over and over, potentially introducing new bugs each time 

> **⚠️ Naming collisions**: ** It can easily happen that the HOC overrides a prop of a component. Make sure that the HOC can handle accidental name collision, by either renaming the prop or merging the props.






