const knex = require('../utils/conector');

const listCategories = async (req, res) => {

    try {
        const categories = await knex('categorias').select('*');

        return res.json(categories);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

module.exports = {
    listCategories
}