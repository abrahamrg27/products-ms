

import 'dotenv/config.js';
import joi from 'joi'; 

interface EnvVars {
  PORT: number;
}// función para validar que el puerto sea un número positiv

const envsSchema = joi.object<EnvVars>({
  PORT: joi.number().integer().min(1).max(65535).required(),
}).unknown(true);

const result = envsSchema.validate(process.env, { abortEarly: false });

if(result.error) {
  throw new Error(`config validation error: ${result.error.message}`);
}
const envVars = result.value;

export const envs: EnvVars = {
  PORT: envVars.PORT,
} as const;
 //buscar prisma nest, ver docuentacion de nest, instalarlo y llegar hasta la parte de model and migrations, con sqlite

 