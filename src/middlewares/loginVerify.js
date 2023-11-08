const jwt = require('jsonwebtoken');
const passwordJWT = require('../utils/passwordJWT');
const knex = require('../utils/conector');

const verifyLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado' })
    }

    try {
        const token = authorization.split(" ")[1];

        const { id } = jwt.verify(token, passwordJWT);

        const verifyUser = await knex('usuarios').where('id', id).first();

        if (!verifyUser) {
            return res.status(401).json({ mensagem: 'Não autorizado' })
        }

        const { senha:_, ...user } = verifyUser;

        req.user = user;

        next();
    } catch (error) {
        return res.status(400).json(error.mensagem)
    }
}
module.exports = verifyLogin;