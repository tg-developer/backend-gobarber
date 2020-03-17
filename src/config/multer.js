import multer from 'multer';
// Importamos o crypto para transformar as imagens em ids (criptografar)
import crypto from 'crypto';
// Informamos os parâmetros extname (extensão da imagem) e resolve (caminho da imagem)
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    // Aqui estamos apontando o caminho da imagem (pasta)
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        // Caso aconteça o erro será exibido o call back de erro
        if (err) return cb(err);
        // Senão será retornado o null na primeira posição e a res com o extname
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
