BACKEND GOBARBER

Para rodar o projeto basta clonar o repositório e rodar o comando yarn para instalar as dependências.

Em seguida rodamos o comando yarn dev + yarn queue

Abaixo segue um resumo do que considerei mais importante na criação desse backend

Instalamos o Docker que cria uma imagem do postgress com o seguinte comando

docker run --name database -e POSTGRES_PASSWORD=docker -p 5433:5433 -d postgres

após isso instalamos o POSTBIRD para checar se o docker está funcionando, em seguida criamos a database "gobarber"

Sequelize (ORM) Abstração do banco de dados, serve para manipulação dos dados (banco) via javascript

Migrations é controle de versão para base de dados (versionamento)

Arquitetura MVC

Model (Armazena a abstração do banco e manipula os dados na tabela)

Controller (Responsável pelas regras de negócios e entradas das requisições da nossa aplicação)

View (É o retorno ao acliente, pode ser um html ou JSON)

A face de um controller

* Classes
* Sempre retorna um JSON
* Não chama outro controller

Quando criar um novo controller

* Apenas 5 métodos (Index, show, store, update, delete)

Após isso confguramos o Eslint , Prettier e EditorConfig

Em seguida criamos a pasta "config" e "database" dentro de src.

*Em "database" criamos a pasta "migrations" que fará o versionamento dos dados.

Depois criamos a pasta app que contem os nossos "controllers" e "models"


Em sequida instalamos a dependência sequelize => yarn add sequelize e yarn add sequelize-cli -D

Após isso nós criamos o arquivo .sequelizerc na raiz do projeto, esse arquivo vai exportar os controllers e models...

nesse arquivo definimos const {resolve} = require('path') que padroniza o caminho nos sistemas operacionais

Depois apontamos para os respectivos arquivos, database.js, models migrations, seeds


Em seguida configuramos o database.js, informando o dialect (postgres) e instalando as dependêncas
yarn add pg pg-hstore, em seguida configuramos o database com os dados relacionados.

* Para criarmos as migrations, utilizamos yarn sequelize migration:create --name=create-users (esse comando cria automaticamente as nossas migrations)

Navegando na migration criada, executamos todas as alterações necessárias com os atributos id, name, email, password, provider, created_at e updated_at (cada atributo possui um obejeto de valores).

Em seguida rodamos o comando yarn sequelize db:migrate

yarn sequelize db:migrate:undo (Desfaz ultima migration)
yarn sequelize db:migrate:undo:all (Desfaz todas as migrations)

Em seguida configuramos o User.js passando dois parâmetros de configuração, o 1 é referente ao objeto com as informações do usuário e o segundo é o sequelize.


Criamos também o arquivo index.js detro da pasta Database para ele fazer o postgress conhecer os controllers e views

Após as configurações importamos o User.js dentro de index.js/database == importamos ./database em app (raiz) e por fim
importamos User.js em routes.js


Depois criamos a feature de criação "UserController.js"

Nessa etapa importamos o "import User from '../models/User'" para ter acesso aos modelos do JSON e criamos a const user validando também se o e-mail é unico. Ao importar o "User" tivemos acesso para fazer o User.create e o User.findOne, por ultimo fizemos a desestruturação para exibirmos somente o id, name, email e provider.


Em seguida iniciamos o process de gerar a senha (password_hash), para isso adicionamos o yarn add bcryptjs.

* Importamos o import bcrypt from 'bcryptjs' no "User.js" dentro da pasta "models"
* Adicionamos o password: Sequelize.VIRTUAL (Virtual quer dizer que é um campo que nunca vai existir na base de dados)
* Toda vez o usuário criar o password temos a necessidade de gerar um password_hash, para isso alterarmos o valor no json do de password_hash para "password" e adicionamos o hook abaixo:

 this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

A finalidade desse hook é executar um código antes mesmo de salvar os dados no banco e criar o hash com força 8 de encriptação.


JWT

Para fazer inserir o token criamos a SessionController.js dentro da pasta controllers.
* Adicionamos o yarn add jsonwebtoken
* Importamos o jwt de 'jsonwebtoken'
* Importamos o "User" de "models/User"

Em User.js (models) adicionamos a função:

checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

que faz a comparação entre o password com o hash gerado no banco

* Adicionamos o token com o método jwt.sign({id}) que recebe 2 parâmetros

O primeiro é o ID e o segundo é o código gerado no md5online 'df927c5ab8fcfc37f3209bc815607c75', depois disso expiramos o token:  expiresIn: '7d', testamos no insominia e o token foi gerado.

* Separamos a lógica da secret key e do expires no arquivo auth.js dentro da pasta config


Após isso criamos o routes.put('/users', UserController.update); rota para atualizar as informações do user

Em seguida criamos a pasta middlewares/auth.js que serve para garantirmos que o token gerado na /session só ative com usuários logados. Depois importamos o middleware em routes.js

Depois colocamos o authMiddleware após as rotas de post.

Dentro do Middleware/auth.js importamos o jwt (jsonwebtoken) e o authConfig (../../config/auth)

*Utilizamos um recurso chamado jwt.verify

Depois importamos um recurso import {promisify } from 'util' que é nativo do Node

* {promisify} tem a finalidade de transformar uma função de call back em uma função de async await

Passamos o método async no inicio da exportação e depois utilizamos o await no decoded (antes do promosify)

em seguida criamos a const decoded que recebeu o jwt.verify e token, authConfig.secret, ambos em parâmetros.

*Pegamos o id que foi declarado em  req.userId = decoded.id; (ele faz parte do req)

em seguida exibimos ele no UserController console.log(req.userId);
// Tivemos acesso ao req.userId , pois a rota de update está após o middleware


Em seguida vamos alterar as informações do usuário (informações comentadas no UserController.js


Para fazer as validações de entrada utilizamos o yarn add yup, fizemos a validação no UserController e SessionController, ambos comentados

Parte II *** Continuando API GoBarber ***


Configuramos a parte de upload de imagens, para isso utilizamos o multer yarn add multer

Criamos uma pasta tmp/uploads na raiz do projeto

* Criamos o arquivo multer.js dentro da pasta config
* Fizamos alterações no multer.js (comentários no código)
* em routes.js nós importamos o multer e o multerConfig de config/multer


//Criamos a variável upload passando o multer + as configurações do multer
const upload = multer(multerConfig)

Após isso criamos a nossa rota:

routes.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true });
});


2) Salvar imagen no banco de dados

*Criamos o FileController.js dentro da pasta controllers e em seguida importamos ele dentro de routes.
*Em routes nós deixamos a lógica do req.file dentro de FileController.store , sendo assim, colocamos toda a lógica dentro dela.

Após isso criamos uma nova tabela no banco de dados para armazenar as imagens, yarn sequelize migration:create --name=create-files

Utilizamos a mesma estrutura da tabela de usuários, porém alteramos o nome da tabela e removemos o provider e password

Em seguida rodamos o yarn sequelize db:migrate e após isso criamos o File.js dentro da pasta models

*Utilizamos as mesmas configurações do model de User, porém removemos o hoock e checpassword, deixando apenas name e path na estrutura

Por ultimo, dentro do arquivo index.js dentro da pasta database, importamos o model File.js e adicionamos ele no array de models

* Criamos uma nova migration para salvar o avatar yarn sequelize migration:create --name=add-avatar-field-to-users

* Configuramos a nova migration (comentada) e rodamos o comando yarn sequelize db:migrate

Dentro de User.js utilizamos o 

 static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id' });
  }
Esse código referencia o id de um arquivo (avatar_id) File.js 

Em seguida inserimos o código .map(model => model.associate && model.associate(this.connection.models)) dentro de index.js (database)

Percorre os models e faz asssociação.

(Rota para fazer a listagem de todos os prestadores de serviços)

*Criamos o ProviderController.js dentro da pasta controllers, em seguida criamos a rota e importamos o ProviderController em routes.js.

No ProviderController.js importamos o User.js pq o provider também é um usuário.

No File.js adicionamos o campo url return `http://localhost:3535/files/${this.path}`, em seguida importamos o import path from 'path' dentro de app.js

Ainda em app.j, utilizamos o express.static para subir as imagens estáticas.

Tabela de agendamento (Usuário)

Criamos a tabela yarn sequelize migration:create --name=create-appointments

Nessa tabela nós usamos o código abaixo para fazer a associção

    type: Sequelize.INTEGER,
        // Faz referência a tabela files e ao id
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true,

Um faz o agendamento e outro marca o prestador de serviço, apois isso rodamos o yarn sequelize db:migrate

* Criamos o model de Appointments.js

Fizemos a assossiação e depois o import no index.js dentro da pasta database

Rota de agendamento de serviço

*Criamos o AppointmentController.js dentro dos controllers, depois criamos a rota em routes.js
*Importamos o User.j e o Yup para fazer as validações.
*Mais detalhes comentados no código

Validações de Agendamento

Utilizamos a biblioteca yarn add date-fns@next (código comentado)

Listagem dos agendamentos

*Criamos a rota com método get no routes.js
*importamos o import Appointment from '../models/Appointments'; no Appointment Controller


Listar o agendamento do prestador de serviço

*Criamos o ScheduleController.js na pasta de controllers
*Importamos o import Appointment from '../models/Appointments'
*Importamos o ScheduleController em routes.js e também criamos a rota de get
*Importamos o import User from '../models/User'
* import { startOfDay, endOfDay, parseISO } from 'date-fns' e import {Op} from 'sequelize'



Utilizando o MongoDB (Enviar notificação para o provider e guardar dentro do banco)

Usamos o docker para criar a imagem do mongo => docker run --name mongobarber -p 27017:27017 -d -t mongo
foi gerado a imagem 6b8e0f56a803f4f4b879f729c6c30941ea053cacee2ca155c41b4f29fda34c8e

*Instalamos o yarn add mongoose (faz a ligação do banco de dados)

*Dentro do index.js na pasta database nós importamos o import mongoose from 'mongoose' e fizemos as configurações iniciais

Criamos a pasta schema e dentro Notification.js

Em Notification.js fizemos as atribuíções necessárias e as devidas importações.


Rota de notificações do prestador de serviço

Criamos a rota de NotificationController assim como sua importação e fizemos as devidas configurações.

Verificar quando a notificação foi lida.


Cancelamento de agendamentos

*Criada rota de delete no routes.js
*Em seguida feita as configurações no AppointmentController

Configurando o NodeMaler

* yarn add nodemailer
* dentro da pasta config foi criado o arquivo mail.js
* Utilizamos o Mail Trap para fazer as configurações de e-mail
* Fizemos as configurações dentro do mail.js em seguida criamos a pasta lib dentro de src
* Criamos o arquivo Mail.js e importamos o import nodemailer from 'nodemailer'
* Fizemos as configurações e validamos o recebimento dos e-mails.


Template de E-mails

* adicionamos o yarn add express-handlebars nodemailer-express-handlebars

No arquivo Mail.js dentro da pasta lib importamos o import exphbs from 'express-handlebars' + import nodemailerhbs from 'nodemailer-express-handlebars' + import { resolve } from 'path';

Após isso criamos a pasta view > emails onde será concentrado os templates

Detro de e-mails criamos a pasta layouts e partial e cada uma foi configurado um template

Dentro de Mail.js na pasta lib fizemos as devidas configurações.


Configurando fila com redis (Diminui tempo de resposta no Redis)

Redis é um banco de dados que trabalha sobre filas e deixa o sistema mais perfomático 

docker run --name resdisbarber -p 6379:6379 -d -t redis:alpine

Após isso instalamos o bee-queue , yarn add bee-queue

*Criamos o arquivo Queue.js dentro da pasta lib e fizemos as devidas importações/configurações.
* Criamos a pasta jobs dentro de app, em seguida o arquivo CancellationMail.js e fizemos as configurações necessárias.

Criamos o arquivo redis.js dentro do pasta config.

Criamos o arquivo queue.js dentro da pasta src



Monitorando Falhas na Fila


 processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.hadleFailure).process(handle);
    });
  }
  hadleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err)
  }


Listando horários disponíveis

*Criamos a rota routes.get('/providers/:providerId/available' , AvailableController.index )
*Criamos o AvailableController.js
*Criamos os query params date + 

new Date().getTime()
1584363847699

fizemos as devidas alterações nesse controller


Litar campos amais para frontend

Monitorar erros com Sentry

import * as Sentry from '@sentry/node'

Criado arquivo sentry.js na pasta config


yarn add express-async-errors

yarn add youch


Configurar as variaveis de ambiente

Criamos o arquivo .env da raiz do projeto

Fizemos as configurações no arquivi .env e depois adicionamos o yarn add dotenv

No arquivo app.js importamos o import 'dotenv/config'

*Também fizemos o import no queue.js import 'dotenv/config';
*Foi inserido o require('dotenv').config(); no database.js (dentro da pasta config)

Após isso modificamos todos os arquivos inserindo as variaveis criadas no .env

Por ultimo, criamos o arquivo .env.example removendo as informações "sensiveis".


git remote add origin https://github.com/tg-developer/backend-gobarber.git


$ git remote set-url origin https://github.com/tg-developer/backend-gobarber.git


