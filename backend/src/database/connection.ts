import knex from 'knex';
import path from 'path'; //retorna o caminho adaptado do sistema com \ ou /

const connection = knex({
    client:'sqlite3',
    connection: {
        filename:path.resolve(__dirname, 'database.sqlite'),
    },
});

export default connection;
