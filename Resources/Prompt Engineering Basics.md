#### Key principles
- Appropriate action verbs (Write, Complete, Explain, Describe, Evaluate)
- Detailed instructions
- Precise descriptions
- Well-structured delimited prompts
#### Be Specific, Use Technical Terms, Provide Context
Improve the following prompts:
1. I need to loop through an array. Help?
✅ In JavaScript, how can I utilize the forEach() method to iterate over an array of objects and extract a specific property from each?
2. How do I center somethings?
✅ What's the best way to center a div element horizontally and vertically using CSS?
3. I'm having issues bringing data into my React app.
✅ How can I use the useEffect hook in React to fetch data from a REST API endpoint and store the results in a local state using the useState hook?

**More Examples**:
- Explain GrahphQL in one paragraph.
- Define JavaScript closures in one sentence
- Explain what Webpack is in 30 words or less.
- TL;DR: Explain the difference between 'let' and 'const' in JavaScript
- How can I do X task in React without using external tools or libraries
- Explain the concept of JavaScript even loop using an analogy.
- Here's some code. Please comment every line explaining what it does.
- In your response, please include only the code that need to be modified.

---- 

1. Why break tasks into smaller steps, even if the language model is smart enough to handle it?
- To make the project more manageable overall, to make sure I thoroughly understand the code, and to more effectively discover bugs and other issues.

2. How would you break the following prompt into smaller tasks? Don't worry about writing the prompts, just think about a high-level way the app could be broken down to build incrementally with the help of ChatGPT.

"I want to design the front end for a pet adoption app from scratch.
This app should have a user-friendly UI that displays a comprehensive list of pets,
each with a photo, name, age, and brief description. Users should be able to click on a pet to see a detailed profile, including its medical history and dietary requirements. I also need mechanisms for filtering pets by various criteria and want to ensure the design is mobile-responsive and adheres to accessibility standards. How can I tackle this?"

- Pet list and layout
- Responsiveness
- Accessibility
- Pet filter
- Pet Detail Page
- Styling
---- 

You can use ChatGPT to help you optimize prompts using three basic steps:
1. Give ChatGPT an overview of what you'd like to do, prompt to ask clarifying questions
2. Answer ChatGPT's clarifying questions
3. When ChatGPT returns an optimized prompt, feed the prompt back to ChatGPT
**Practice: Use the steps above to optimize the following prompt:**
"Show me a code snippet for a modal in React."

**My prompt**
"I'm going to give you a prompt and I want you to ask me clarifying questions to help optimize the prompt. Suggest a more effective prompt based on my answers. Here's the prompt: "Show me a code snippet for a modal in React."

**Clarifying Questions:**
- Do you want a functional component or a class component in React?
	- functional
- Should the modal be styled with plain CSS, SCSS, or a specific library like styled-components?
	- external css stylesheet
- Do you want the modal to open and close based on a button click?
	- yes
- Are there any specific content types you want inside the modal? (e.g., text, images, forms)
	- just text is fine for now
- Do you require any animation or transition effects when the modal appears or disappears?
	- use a simple fade in/out effect
- Are you using any state management tools (like Redux) or do you prefer local component state for managing the modal's visibility?
	- local component state

**Optimized prompt**
"Provide a React functional component code snippet for a modal that utilizes an external CSS stylesheet. The modal should display text content and open/close based on a button click. It should have a simple fade in/out transition effect and manage its visibility using local component state."

**Role-based prompting**
- Use phrases like "Act as a..." and "You are a..." to prompt ChatGPT to assume a certain role
- Prompt ChatGPT to ask clarifying questions
- Assume a role to define technologies, determine key features, and write user stories




