const knex = require('../utils/conector');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordJWT = require('../utils/passwordJWT');

const missingFields = (req, res, fields) => {
    const missingFields = [];
    let msn;

    for (const field of fields) {
        if (!req.body[field]) {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 1) {
        msn = `Para prosseguir é necessário informar os campos ${missingFields.join(', ')}`;  
    }
    if (missingFields.length === 1) {
        msn = `Para prosseguir é necessário informar o campo ${missingFields}`
    }
    
    if (missingFields.length > 0) {
        return res.status(400).json({ mensagem: msn })
    }

    return null
}

const registerUser = async (req, res) => {
    const { nome, senha, email } = req.body;

    const requiredFileds = ['nome', 'senha', 'email'];

    const error = missingFields(req, res, requiredFileds);
    if (error) {
        return error
    }

    try {
        const verifyEmail = await knex('usuarios').where('email', email).first();

        if (verifyEmail) {
            return res.status(401).json({ mensagem: 'Email já cadastrado' });
        }

        const crypPassword = await bcrypt.hash(senha, 10);

        const newUser = await knex('usuarios').insert({
            nome,
            email,
            senha: crypPassword
        });

        if (newUser.length === 0) {
            return res.status(400).json({ mensagem: 'Usuarios não cadastrado' })
        }

        return res.json({ mensagem: 'Usuario registrado com uscesso' })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }

}

const login = async (req, res) => {
    const { email, senha } = req.body;

    const requiredFields = ['email', 'senha'];

    const error = missingFields(req, res, requiredFields);

    if (error) {
        return error
    }

    try {
        const user = await knex('usuarios').where('email', email).first();
        
        if (!user) {
            return res.status(401).json({ mensagem: 'Email e/ou senha inválidos' })
        }

        const verifyPassword = await bcrypt.compare(senha, user.senha);
        
        if (!verifyPassword) {
            return res.status(401).json({ mensagem: 'Email e/ou senha inválidos' }) 
        }

        const token = jwt.sign({ id: user.id}, passwordJWT, { expiresIn: '12h' });
        
        const { senha:_, ...userdata } = user;

        return res.status(200).json({
            user: userdata,
            token
        });

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

const detailUser = async (req, res) => {
    console.log(req.user.id);
    return res.json(req.user)
}

const updateUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    const requiredFields = ['nome', 'email', 'senha'];

    const error = missingFields(req, res, requiredFields);

    if (error) {
        return error
    }

    try {
        const verifyEmail = await knex('usuarios').where('email', email).first();

        if (verifyEmail) {
            return res.status(400).json({ mensagem: 'Email já cadastrado' })
        }

        const newPassword = await bcrypt.hash(senha, 10);

        const updatedUser = {
            nome,
            email,
            senha: newPassword
        }

        const update = await knex('usuarios').where('id', req.user.id).update(updatedUser);

        return res.status(200).json({ mensagem: `Os dados do usuario de id: ${req.user.id} foram atualizados, por favor faça novamento o login` })


    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

module.exports = {
    registerUser,
    login,
    detailUser,
    updateUser
}