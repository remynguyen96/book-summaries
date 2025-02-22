A comprehensive understanding of web security. Covering topics from basic principles to advanced security techniques, participants will learn about common vulnerabilities, prevention strategies, and best practices to secure their web applications. Also includes practical exercises to apply the learned concepts in real-world scenarios.

### Cookies

Small pieces of data stored on the client-side to track and identity users.
HTTP is **stateless**. Cookies are used to implement **sessions**. 
 - Keeping track of the currently authenticated user.
 - Storing the contents of a shopping cart.
 - More nefariously: tracking users.
The browser sends back the cookie on subsequent requests.

![Cookie-Header](cookie-header.png)
**Expiration Dates:** Without some kind of expiration, cookies last for the duration of the session. You can set it's expiration date to some time in the past to delete a cookie.

**Scoping:** The domain attribute specifies which server can receive a cookie. if specified, cookies are available on the specified server and its subdomains.

**HTTPOnly:** Prevents client-side scripts from accessing cookies.

**Secure:** Ensures cookies are sent over HTTPS only.

**SameSite:** Restricts how cookies are sent with cross-origin requests.

### Session Hijacking

Exploits active sessions to gain unauthorized access.
Basically, the attacker can become the user as far as the server is concerned.
##### Command Injection
A type of security vulnerability where an attacker can execute arbitrary commands on the host operating system via a vulnerable application.

**Target:** Applications that pass unsafe user inputs to system shell commands.
**User Input:** Application receives input from a user.
**Unsanitized Input:** The user input is concatenated with a system command in a way that allows additional commands to be executed.
**Shell Execution:** The combined command is executed in the system command shell.
**Malicious Payload:** Attackers inject malicious commands, piggybacking on legitimate commands.

##### Remote Code Execution
This one kind of does what it says on the tin. Remote Code Execution (RCE) is a vulnerability that allows an attacker to execute arbitrary code on a remote system.

How it works:
	**Injection:** RCE typically occurs when the user input is not properly sanitized.
	**Processing:** The malicious input is processed by the server through eval functions, un-sanitized inputs to shell commands, or unsafe deserialization.
	**Execution:** Malicious code is executed within the server environment, providing the attacker with control over the server resources.

Steps to prevent bad things from happening:
	**Input Validation:** Always validate and sanitize user inputs. Use strict data types and constraints.
	**Don't Do Dangerous Stuff:** Avoid using `eval()`, `Function()`, `exec()`, and other potentially dangerous Node.js functions.
	**Use Security Libraries:** Utilize libraries such as `DOMPurify` for sanitizing HTML. Use `sandboxed` environments like VM2 for executing untrusted code.
	**Principle of Least Privilege:** Run services with the minimal required permissions. Do not run your application as a root user.
	**Update Your Stuff:** Keep Node js and all dependencies up-to-date to mitigate known vulnerabilities.

### Cross-Site Request Forgery (CSRF)
A vulnerability that allows an attacker to make unauthorized requests on the user's behalf.

The three ingredients to the recipe.
	**A relevant action**. There has to be something interesting to the attacker. Relevant actions can include: email or password changes, balance transfers, etc.
	**Cookie-based session handling**. In a CSRF attack, the attacker is tricking you into accidentally performing action with your very legitimate session authentication without your knowledge.
	**No unpredictable parameters**. The attacker needs to be able to guess what it ought to send to get the desired outcome.

How does it work?
	**User Authentication:** User logs into a web application and receives an authentication token (e.g. a cookie).
	**Malicious Site Visit:** User visits a malicious website while still authenticated.
	**Malicious Request:** The malicious website contains code that sends a request to the authenticated web application.
	**Unauthorized Action:** The web application processes the request as if it were made by the user.

Techniques for prevention.
	**Generate a unique token:** Generate a token that validates that this is a legitimate request.
	**Use SameSite Cookies:** Limit cookies to only working with requests that come from your domain.
	**Set up a CORS policy:** Implement a strict Cross-Origin Resource. Sharing (CORS) policy to disallow unauthorized domains.
	**Referer-based validation:** This is typically less-than-effective.

**Double-Signed Cookie Pattern** An alternative to CSRF tokens.
If you can't use a CSRF token, you might consider using a second cookie that is used to validate the user's session.

### Cross-Site Scripting (XSS)
Cross-Site Scripting (XSS) is a type of injection attack where malicious scripts are injected into otherwise benign, trusted websites.
This occurs when an attacker sends malicious code, generally in the form of a browser-side script, to a different end user.

It comes in a few different flavors.
	**Stored:** The malicious data is stored in the database or somewhere else on the backend.
	**Reflected:** The malicious data is slid into the URL or query parameters.
	**DOM-based:** The malicious data is input into the DOM (e.g. an input field that changes the page).

How it works.
	**Injection of a Malicious Script:** An attacker injects malicious. JavaScript (or other scripting languages) into a web application. This usually happens via user input (e.g. the comments section).
	**Execution of Client-Side Code:** The malicious script runs in the context of the victim user's session, with the permissions of that user's browser.
	**Data Theft and Manipulation:** Since the script executes as if it were part of the original website, it can steal cookies, session tokens, or other sensitive information.


Best practices for mitigation.
	**Input Validation:** Validate and sanitize all user inputs.
	**Output Encoding:** Escape user-generated content before rendering it in the browser using context-appropriate escaping (HTML, JavaScript, URL, etc.).
	**Content Security Policy (CSP):** Implement CSP headers to restrict sources from where scripts, styles, and other resources can be loaded.
	**Use Safe Methods:** Avoid using functions that allow raw HTML input like innerHTML or document.write.
	Libraries and Frameworks: Utilize established libraries and frameworks that auto-escape content and provide built-in protection mechanisms.

##### Safe Sink
A place where you can out data without the risk of it being vulnerable to XSS. For our purposes, these are places where the browser promises not to execute any code you give it.

![Safe Sinks](safesinks.png)

Some DOM methods are considered safe sinks.

```js
element.textContent
element.insertAdjacentText
element.className
element.setAttribute
element.value
document.createTextNode
document.createElement
```


**References:**
- https://stevekinney.net/courses/web-security
- https://github.com/stevekinney/web-security
- https://speakerdeck.com/stevekinney/web-security-frontend-masters