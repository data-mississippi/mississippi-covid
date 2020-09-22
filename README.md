# mississippicovid.com
This website [is deployed here](https://mississippicovid.com).
---
## Requirements
For development, you only need Node.js installed on your machine. npm is the package manager and it comes with Node.
The actual server is an npm package called Express.

- #### Node: https://nodejs.org/en/
- #### Express: https://www.npmjs.com/package/express

If the installation was successful, you should be able to run the following commands:

    $ node --version
    $ npm --version

---
## Install

    $ git clone https://github.com/smcalilly/mississippi-covid.git
    $ cd mississippi-covid
    $ npm install
    
---
## Running the project

You can run the project with this command, and the server will restart whenever you make any changes:

    $ npm run dev
    
Let me know if you have any troubles, because I've never walked anybody through from scratch.

---
## etc

The UI templating engine is called Handlebars: https://www.npmjs.com/package/handlebars. (Need to fix a security warning for a dependency.)
The file extension is `.hbs` but it's html with the handlebars syntax for rendering. Those files are served by Express. The files are in the `views` directory. 
The main html pages are in `pages` and partials are in `partials`.

The variables for handlebars come from app.js. The `.hbs` file name matches the routes setup in the `routes/index.js`. If you see anything that might need a variable but you aren't sure or can't figure out how to do it, let me know and I'll adjust.

Any resources that are sent to the client -- like css, client javascript, or images -- are available in the `public` directory.
If you make any changes to the public folder, you might need to hard refresh in your browser to reset the cache: `shift + cmd + r`.
