import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Se o middleware não estiver presente
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Utilizamos o split para pegar apenas a 2 posição do array que é o token.
  const [, token] = authHeader.split(' ');

  try {
    // Dentro do promisify passamos o jwt.verify, sem seguida os parâmetros token + authConfig.secret
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    // Garante que se chegou até aqui, o usuário está autenticado
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
