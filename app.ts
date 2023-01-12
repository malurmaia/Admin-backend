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

const PORT = 3000

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
      User,
      Role,
      Document
    ]
  }

  const admin = new AdminJS(adminOptions)

  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)

  app.get('/', (req,res)=>{
    res.send('hello world')

  })

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()