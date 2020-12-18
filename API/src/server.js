// Import des librairies
const express = require('express');
const cors = require('cors');
const { JsonDB } = require('node-json-db');
const bodyParser = require('body-parser');

// Import de nos objets
const bookRoutes = require('./api/routes/bookRoutes');
const userRoutes = require('./api/routes/userRoutes');
const copyRoutes = require('./api/routes/copyRoutes');
const loanRoutes = require('./api/routes/loanRoutes');

const BookController = require('./api/controllers/bookController');
const UserController = require('./api/controllers/userController');
const CopyController = require('./api/controllers/copyController');
const LoanController = require('./api/controllers/loanController');

const BookRepository = require('./repositories/bookRepository');
const UserRepository = require('./repositories/userRepository');
const CopyRepository = require('./repositories/copyRepository');
const LoanRepository = require('./repositories/loanRepository');

// Création de nos objets
const db = new JsonDB("./data/library", true, true);
const bookRepository = new BookRepository(db);
const bookController = new BookController(bookRepository);
const userRepository = new UserRepository(db);
const userController = new UserController(userRepository);
const copyRepository = new CopyRepository(db, bookRepository);
const copyController = new CopyController(copyRepository);
const loanRepository = new LoanRepository(db, copyRepository, userRepository);
const loanController = new LoanController(loanRepository);
/* A compléter */

// Création du serveur
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuration des routes
bookRoutes(app, bookController);
userRoutes(app, userController);
copyRoutes(app, copyController);
loanRoutes(app, loanController);
/* A compléter */


function errorHandler(err, req, res, next) {
    console.error(err);
    if (err.isClientError) {
        res.status(403).send({ message: err.message });
    }
    else {
        res.status(500).send({ message: 'Something went wrong' });
    }
}
app.use(errorHandler);
// Démarrage du serveur
app.listen(3000);
console.log('Library API started on port: 3000.');

