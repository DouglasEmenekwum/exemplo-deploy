const express = require('express');
const { registerUser, login, detailUser, updateUser } = require('./controllers/user');
const { listCategories } = require('./controllers/categories');
const verifyLogin = require('./middlewares/loginVerify');


const routes = express();

routes.get('/categorias', listCategories);
routes.post('/usuario', registerUser);
routes.post('/login', login);

routes.use(verifyLogin);

routes.get('/teste', detailUser);
routes.put('/usuario', updateUser);

module.exports =  routes;