import { DB } from './wpdb.interface'
import { createPool } from 'mysql2'
import { CamelCasePlugin, DeduplicateJoinsPlugin, Kysely, MysqlDialect } from 'kysely'

const dialect = new MysqlDialect({
    pool: createPool({
        user: 'root',
        host: 'db',
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 150,
        maxIdle: 150,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    }),
})

export const wpdb = new Kysely<DB>({
    dialect,
    plugins: [new CamelCasePlugin(), new DeduplicateJoinsPlugin()],
    // log(event) {
    //     if (process.env.NODE_ENV !== 'development') return;

    //     if (event.level === 'query') {
    //         console.log(`\n[${event.queryDurationMillis.toFixed(2)}ms] QUERY EXECUTION`);
    //         console.log(`SQL: ${event.query.sql}`);
    //         console.log(`PARAMS: ${JSON.stringify(event.query.parameters)}`);
    //     }
    //     if (event.level === 'error') {
    //         console.error(`DB ERROR:`, event.error);
    //     }
    // }
})
