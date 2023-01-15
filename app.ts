import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminSequelize, { Database } from '@adminjs/sequelize';
import AdminMongoose from '@adminjs/mongoose';
import express from 'express';
require('dotenv').config()

// Models
import { Role } from './models/role.entity';
import { User } from './models/user.entity';
import { Document } from './models/document.entity';

//CONTROLLERS
import UserController from './controllers/UserController';

// ROUTES
import document from './routes/document';
import auth from './routes/auth';

import session from 'express-session';
import cors from 'cors';
import hbs from 'hbs';
const path = require('node:path');

const bcrypt = require("bcryptjs");
const mysqlStore = require("express-mysql-session")(session);
const { PORT } = process.env

const sessionStore = new mysqlStore({
  connectionLimit: 10,
  password: process.env.SQL_DB_PASS,
  user: process.env.SQL_DB_USER,
  database: process.env.SQL_DB_NAME,
  host: process.env.SQL_DB_HOST,
  port: process.env.SQL_DB_PORT,
  createDatabaseTable: true
})

const ROOT_DIR = __dirname


AdminJS.registerAdapter({
  Resource: AdminSequelize.Resource,
  Database: AdminSequelize.Database
});
AdminJS.registerAdapter({
  Resource: AdminMongoose.Resource,
  Database: AdminMongoose.Database
})

const generateResource = (Model: object, properties: any = {}, actions: any = {}) => {
  return {
    resource: Model,
    options: {
      properties: {
        ...properties,
        createdAt: {
          isVisible: { list: true, edit: false, create: false, show: true }
        },
        updatedAt: {
          isVisible: { list: true, edit: false, create: false, show: true }
        }
      },
      actions: {
        ...actions
      }
    }
  }
}

const start = async () => {
  const app = express()


  const adminOptions = {
    resources: [
      generateResource(Role),
      generateResource(User,
        {
          password: {
            type: 'password'
          }
        },
        {
          new: {
            before: async (request: any, context: any) => {
              if (request.paylod.password) {
                request.payload.password = await bcrypt.hashSync(request.payload.password, 10);
              }
              return request;
            },
            after: async (request: any, context: any, originalResponse: any) => {
              return originalResponse;
            }
          }
        }
      ),
      generateResource(Document)
    ],
    dashboard: {
      component: AdminJS.bundle('./components/DashboardComponent')
    },
    branding: {
      companyName: 'MyDocs',
      logo: 'https://i.ytimg.com/vi/F5SvBq4IhO8/maxresdefault.jpg',

    }
  }

  const admin = new AdminJS(adminOptions)
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin,
    {
      authenticate: async (email, password) => {
        const userCtrl = new UserController
        return await userCtrl.login(email, password);
      },
      cookieName: 'adminjs-dash-admin',
      cookiePassword: '8F!ActmB36YdpTwny!&Gi@Yeh2%PWfHj',
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: '6QFn*][i9JK+)pPSb2C{q<SlCA(aJkG|f_zW3E0EGs{121{.I#HP<%OeeD[~rsV',
      cookie: {
        httpOnly: process.env.NODE_ENV !== 'production',
        secure: process.env.NODE_ENV === 'production'
      },
      name: 'adminjs-dash-admin',

    })

  app.use(cors());
  app.use(express.json());
  hbs.registerPartials(path.join(ROOT_DIR, 'views'))
  app.set('view engine', '.hbs')
  app.use(admin.options.rootPath, adminRouter)
  app.use('/document', document)
  app.use('/auth', auth)

  app.get('/', (req, res) => {
    res.send('=== SYSTEM OK ===')
  })

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()