const knex = require('knex')({
    client: 'pg',
    connection: {
        user: 'postgres',
        host: 'localhost',
        password: 'postgres',
        database: 'pdv1',
        port: 5432,
    },
    useNullAsDefault: true
});

module.exports = knex;