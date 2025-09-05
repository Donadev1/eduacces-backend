import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  dialect: 'postgres',
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432', 10),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
}));
