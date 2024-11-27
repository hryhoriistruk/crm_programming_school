import * as process from 'node:process';

import * as dotenv from 'dotenv';

import { Configs } from './configs.type';

const environment = process.env.APP_ENVIRONMENT || 'local';
dotenv.config({ path: `environments/${environment}.env` });

export default (): Configs => ({
  app: {
    port: parseInt(process.env.APP_PORT) || 3000,
    host: process.env.APP_HOST || '0.0.0.0',
    swagger_url_path: process.env.SWAGGER_URL_PATH,
  },
  database: {
    port: parseInt(process.env.MYSQL_PORT),
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    db_name: process.env.MYSQL_DB_NAME,
  },
  security: {
    hashPasswordRounds: parseInt(process.env.HASH_PASSWORD_ROUNDS),
    defaultManagerPassword: process.env.DEFAULT_MANAGER_PASSWORD,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    refresh_expires_in: Number(process.env.JWT_REFRESH_EXPIRES_IN),
    access_expires_in: Number(process.env.JWT_ACCESS_EXPIRES_IN),
    action_expires_in: Number(process.env.JWT_ACTION_EXPIRES_IN),
    access_secret: process.env.JWT_ACCESS_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    action_recovery_password_secret:
      process.env.JWT_ACTION_RECOVERY_PASSWORD_SECRET,
    action_activate_manager_secret:
      process.env.JWT_ACTION_ACTIVATE_MANAGER_SECRET,
  },
  excel: {
    excelMimeType: process.env.EXCEL_MIME_TYPE,
    excelWorksheet: process.env.EXCEL_WORKSHEET,
  },
  auth: {
    managerDefaultPassword: process.env.MANAGER_DEFAULT_PASSWORD,
  },
});
