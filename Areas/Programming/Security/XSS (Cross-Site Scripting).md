**XSS Example for education: **
```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>XSS Demo</title>
</head>

<!--To run: npx http-server -p 8080 -->
<!-- http://127.0.0.1:8080/?comment=<script>alert('xss')</script> -->
<body>
  <h1>Comment Page (Vulnerable to XSS)</h1>
  <form method="GET" action="">
    <input type="text" name="comment" placeholder="Enter comment">
    <input type="submit" value="Submit">
  </form>
  <h2>Comments:</h2>
  <div id="comments"></div>

  <script>
    // Retrieve the "comment" parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const comment = params.get('comment');

    // INTENTIONAL VULNERABILITY: Direct insertion of user input into HTML without sanitization
    // didn't work due to the script tag
    // if (comment) {
    //   document.getElementById('comments').innerHTML = '<p>' + comment + '</p>';
    // }

    if (comment) {
      const container = document.getElementById('comments');
      const p = document.createElement('p');
      p.innerHTML = comment;
      container.appendChild(p);

      // Look for any <script> tags and execute them
      const scripts = p.getElementsByTagName('script');
      if (scripts.length > 0) {
        for (let script of scripts) {
          const newScript = document.createElement('script');
          newScript.text = script.textContent;
          document.body.appendChild(newScript);
        }
      }
    }
  </script>
</body>
</html>
```
