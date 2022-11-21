import { _MetaLogs } from "src/repos/meta-logs.entity";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
/**
 * Postgres DB settings value from env
 */
const config: PostgresConnectionOptions = {
    type: "postgres",
    host: process.env.GAME_POSTGRES_DB_HOST,
    port: parseInt(<string>process.env.GAME_POSTGRES_DB_PORT),
    username: process.env.GAME_POSTGRES_DB_USER,
    password: process.env.GAME_POSTGRES_DB_PASSWORD,
    database: process.env.GAME_POSTGRES_DB_NAME,
    entities: [ _MetaLogs],
    synchronize: false,
};

export default config;
