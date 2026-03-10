# Assignment 4

**→ Preferred deadline: 11:59pm on Monday, 12/1/2025** <br/>
**→ Extension deadline: 11:59pm on Wednesday, 12/3/2025 (no submissions allowed after this)** <br/>
**→ Assignment and Code Blog entry due at the same time.  Submit Code Blog on Canvas.** <br/>
**→ Grading demo due: 11:59pm on Friday 12/12/2025**

There are two goals for this assignment:
  * To implement a server for the Benny's List app.
  * To use EJS to make a fully templatized version of the app that is dynamically rendered based on application data.

The specific tasks you'll need to accomplish for this assignment are outlined below after an explanatory note on the organization of the starter code you're provided with here.

## A note on starter code organization

The starter code you are given for this assignment provides a complete implementation of the client-side Benny's List app.  However, the code is organized in a somewhat unusual way:

  * The `static/` directory contains the CSS and client-side JS for the app along with a copy of the Benny image that is used in the app's header.  These are files your server will ultimately need to serve if you want to have a fully-functional Benny's List app.  In other words, you can think of the `static/` directory as containing "stuff you need to keep" in your final solution for the assignment.

  * The `html/` directory contains two HTML files: `index.html` (which is the HTML for the main Benny's List page we've worked on all term) and `404.html` (which is the HTML for a new "404" page).  These are files that will not be used directly in the app you implement for the assignment, since your entire app will be temlatized using EJS.  Instead, they are included as "inspiration" (i.e. something to copy/paste) when you are implementing EJS templates for your app.  In other words, you can think of the `html/` directory as containing "stuff you need to replace using EJS" in your final solution for the assignment.

## 1. Implement an Express-based server for the app

Your first task for the assignment is to implement a server for the Benny's List app using Express.js.  Your server should be implemented in `server.js` and should include the following routes (all for HTTP GET requests):

  * `/` - This route should serve the Benny's List home page, which is currently implemented in `html/index.html`.  The page served by this route should be dynamically generated using an EJS template and the application data provided in the file `postData.json` (see the next section for more details about this template).

  * `/posts/<n>` - This route should serve a page that allows the user to view a single post, where `<n>` designates the specific post that should be displayed.  The page served by this route should be dynamically generated using an EJS template and the application data provided in the file `postData.json` (see the next section for more details about this template).  Possible values of `<n>` are the integer numbers 0-7, and each different value of `<n>` should be mapped to the post represented by the data at index `<n>` in the data array in `postData.json`.  For example, a request for `/posts/0` should render a page that displays only the post represented by the data at index 0 in the data array.  Note that each post in the HTML in `html/index.html` contains a link to its own single-post page.
    * URLs that match this route but contain an invalid value for `<n>` (e.g. `/posts/1024`) should result in a "404" response (see below for more details).

Your server should also implement the following functionality:
  * The server should log to the console the URL and HTTP method of every request it receives.
  * The server should serve a "404" page in response to all requests for URLs that don't correspond to valid application content.  This page should always be served with the status code 404.  The "404" page will be implemented with an EJS template.  More details on this template are included in the next section.
  * The server should serve all the files in the `static/` directory at a URL that matches the name of the file.  For example the file `static/style.css` should be served at the URL `/style.css`.
  * The server should listen for requests on the port specified by the environment variable `PORT`.  If the environment variable `PORT` is not set, then the server should listen for requests on port 8000 by default.

Note that you may not be able to implement the complete functionality described in this section until you finish implementing the templates described in the next section.

## 2. Implement a fully-templatized version of the app using EJS

The application you implement for this assignment must be fully templatized using EJS.  In other words, all of the HTML content sent from your server to the client must be generated using an EJS template, and your server may not serve any hard-coded HTML files.  There are three separate pages your application will serve that must be implemented as EJS templates.  Here are a few notes/requirements for each of these pages:

  * **The "all-posts" page (AKA the "home" page).**
    * This page will be rendered on the `/` route.
    * It will display all of the posts whose data is contained in `postData.json`.
    * Other elements rendered on this page should include the Benny's List application header/title, the filters sidebar, and the "sell something" modal and button.  In other words, this page should look like the Benny's List page you've been working on all term.

  * **The "single-post" page.**
    * This page will be rendered on the `/posts/<n>` route.
    * It will display just a single post corresponding to the value specified for `<n>` as described in the previous section.
    * The single post displayed on this page should appear the same as the individual posts displayed on the "all-posts" page (i.e. you don't need to display a different version of the post on this page).
    * This page *SHOULD* include the Benny's List application header/title, but it *SHOULD NOT* include the filters sidebar or the "sell something" modal and button.
    * You *MUST* use the same EJS template to render this page as the one you use to render the "all posts" page (i.e. one template will be used to render both pages).  You will need to include logic in the template and probably also in the server to determine which elements should be rendered depending on which page is being rendered.

  * **The "404" page.**
    * This page will be rendered for all requests that contain invalid URLs, including URLs that match the `/posts/<n>` route but contain an invalid value of `<n>`.
    * This page should include all content currently present in `html/404.html`, including the Benny's List application header/title and the "404" error message.  It should not include any other content.
    * You should implement a separate EJS template to power the "404" page.

The templates you write to represent these three pages should also satisfy the following requirement:
  * All elements that are repeated within a single page or across multiple pages should be factored into their own template representation and incorporated when needed using EJS's `include()` call.  Examples of elements that should be factored into their own template representation are the Benny's List application header/title and the individual post.

## 3. Use the post template to render posts on the client side

Finally, you should replace the representation of the post that is used on the client side for generating new posts when the user submits information in the "sell something" modal.  This representation of the post is currently implemented in the starter code using native JS methods like `document.createElement()` in the client-side function [`insertNewPost()`](static/index.js#L31-L96) at the top of `static/index.js`.  You must update this function so that it uses the post template you implemented in the previous section to generate new posts instead of using native JS methods.  Here are some notes/requirements for generating posts on the client side:

  * You must convert the post template into a form that is usable on the client side, make this form of the post template available to use in the client-side code (i.e. by serving it with your server), and then update the client-side code to incorporate this form of the post template.  In class we will cover how to compile a template into a JS function that can be used on the client side.  This approach would be appropriate here.
    * Make sure you also incorporate the EJS client-side library into your client-side code so you can use your template there.

  * You must invoke your template-based representation of the post when generating a new post in `insertNewPost()`.  This will require other changes to the client-side code as well, e.g. since the template-based representation of the post will output HTML strings instead of DOM elements.
    * No changes in `static/index.js` are necessary below the comment that reads "You should not modify any of the code below."

  * Any command line commands that need to be executed to make your post template usable on the client side (e.g. a compilation command) must be encoded as `npm` scripts that are run automatically when the `npm start` command is executed.

## Code blog

Add an entry to your Code Blog reflecting on your experience with this assignment and publish the new entry.  Here are some questions you could answer (though these aren't the only ones):

* What was challenging about the assignment, and what specific kinds of problems did you have.  How did you solve those problems?

* What did you learn from the assignment?  Were there any special insights you had?  What did you find that you already knew?

* What kinds of resources were helpful for completing the assignment?  Specific websites?  Lectures?  The class Ed forum?  The TAs?  How did you use each of these resources?

* What are one or two things you had to Google to complete the assignment?

## Submission

As always, we'll be using GitHub Classroom for this assignment, and you will submit your assignment via GitHub.  Just make sure your completed files are committed and pushed by the assignment's deadline to the main branch of the GitHub repo that was created for you by GitHub Classroom.  A good way to check whether your files are safely submitted is to look at the main branch your assignment repo on the github.com website (i.e. https://github.com/osu-cs290-f25/assignment-4-YourGitHubUsername/). If your changes show up there, you can consider your files submitted.

In addition to submitting your assignment via GitHub, you must submit the URL to your code blog entry (e.g. http://web.engr.oregonstate.edu/~YOUR_ONID_ID/cs290/blog.html) via Canvas by the due date specified above.  Make sure to submit your code blog URL on Canvas even if it hasn't changed from the one you submitted for previous assignments.

## Grading criteria

The assignment is worth 100 points total:

  * Server implementation: 15 points

    * 5 points: The server correctly implements the routes described above, including `/`, `/posts/<n>`, and a "404" route

    * 3 points: The "404" route correctly handles all invalid URLs
      * Invalid URLs include ones of the form `/posts/<n>` that contain an invalid value for `<n>`.

    * 3 points: The server correctly serves the files in the `static/` directory by name, as described above

    * 2 points: The server correctly listens for requests on the port specified by the environment variable `PORT` or port 8000 by default

    * 2 points: The server correctly logs the HTTP method and URL for every request it receives

  * Templates: 25 points

    * 5 points: The "all-posts" page is correctly dynamically rendered on the `/` route using an EJS template and the data in `postData.json`, as described above
      * This page must include all posts represented in `postData.json` as well as the site header/title, the filters sidebar, and the "sell something" modal and button.

    * 5 points: The "single-post" page is correctly dynamically rendered on the `/posts/<n>` route using an EJS template and the data in `postData.json`, as described above
      * This page must include only the individual post designated by the route paramer `<n>` as well as the site header/title, but it must not include the filters sidebar or the "sell something" modal and button.

    * 5 points: The "all-posts" page and the "single-post" page are correctly implemented using the same template, as described above

    * 3 points: The "404" page is correctly rendered using an EJS template for all invalid URLs

    * 4 points: A template is correctly implemented to represent a single post, and it is correctly invoked at the appropriate location(s) using the EJS `include()` call

    * 3 points: All other elements repeated across pages are correctly implemented as templates and invoked at the appropriate location(s) using the EJS `include()` call

  * Client-side post generation: 10 points

    * 4 points: The post template is correctly converted into a form usable on the client side and incorporated into the client-side code

    * 3 points: The post template is correctly invoked on the client side to generate all new posts

    * 3 points: All command line commands that must be run to be able to use the post template on the client side are encoded as `npm` scripts that are automatically run when `npm start` is executed

* Understanding: 50 points
  * To earn these points, you must demonstrate a strong understanding of all aspects of the assignment and of your own implementation.

In addition to your programming assignment grade, you will receive a pass/fail grade for your code blog entry, included in the code blog portion of your grade.
