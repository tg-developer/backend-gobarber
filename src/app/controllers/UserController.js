// Colocamos o * no yup porque ele não tem exportação
import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  // Como estamos iniciando um cadastro de users, utilizamos o store (middleware)
  async store(req, res) {
    // Aqui o yup valida cada campo dentro de shape
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    // Aqui copiamos o mesmo esquema de validação do store, porém modificamos o oldPassword
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      // Aqui utilizamos o when + operador ternario para verificar se ele informou a senha antiga, caso sim , a nova senha precisa estar presente.
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      // Utilizams o when novamente para confirmar senha no campo confirmPassword
      // Utilizamos o ondeOf para referenciar o confirmPassword e operador ternário
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Aqui capturamos as informações do body dentro do insominia
    const { email, oldPassword } = req.body;

    // Aqui buscamos o id do usuário no banco de dados
    const user = await User.findByPk(req.userId);

    // Se o e-mail for diferente do email que ele já tem...
    if (email && email !== user.email) {
      // Faz a verificação do e-mail
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }
    // Utilizamos o checkPassword(oldPassword) para fazer a comparação das senhas
    // Colocado oldPassword no incio para fazer uma dupla condição ( se ele informou a senha)
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    // Atualizo as informações do id, name, provider
    const { id, name, provider } = await user.update(req.body);
    // Tivemos acesso ao req.userId , pois a rota de update está após o middleware
    // Conseguimos utilizar essa varíavel para buscar usuários e fazer as alterações como update
    // Como resposta eu envio as informações
    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
