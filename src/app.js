const path = require('path');
const express = require('express');
const hbs = require('hbs');
const routes = require('./routes');

// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// define paths for express config
const PUBLIC_DIRECTORY = path.join(__dirname, '../public');
const VIEWS_PATH = path.join(__dirname, '../templates/views');
const PARTIALS_PATH = path.join(__dirname, '../templates/partials');

// create app instance
const app = express();
const port = process.env.PORT || 3000;

// setup root route and connect all routes to app
app.use(express.static(PUBLIC_DIRECTORY));
app.use('/', routes);

// set the templating engine and view path
app.set('view engine', 'hbs');
app.set('views', VIEWS_PATH);
hbs.registerPartials(PARTIALS_PATH);

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Something Broke!');
 })

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'sam mcalilly',
    errorMessage: 'page not found'
  })
})

// setup the server to listen to a port
app.listen(port, () => {
  console.log('server started on port' + port)
})