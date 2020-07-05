import * as Koa from 'koa';
import * as Router from 'koa-joi-router';
import * as config from 'config';
import * as bodyParser from 'koa-body';
import * as httpLogger from 'koa-logger';
import * as cors from '@koa/cors';
import * as helmet from 'koa-helmet';
import { createConnection } from 'typeorm';
import { SwaggerAPI } from 'koa-joi-router-docs';
import { KoaSwaggerUiOptions } from 'koa2-swagger-ui';
import { createServer } from 'http';

import adminRouter from './admins/admins.router';

type koa2SwaggerUiFunc = (config: Partial<KoaSwaggerUiOptions>) => Koa.Middleware;
const koaSwagger = require('koa2-swagger-ui') as koa2SwaggerUiFunc;
import 'reflect-metadata';

const databaseConf: any = config.get('database');

import errorCatcherMiddleware from './middlewares/errorCatcher';

/*
 * Using copy of database configuration from config
 * because pg driver will trying to change the read-only 'type' property
 */
createConnection({ ...databaseConf })
  .then(async () => {
    const app = new Koa();
    const server = createServer(app.callback());

    const router = Router();
    const generator = new SwaggerAPI();

    generator.addJoiRouter(adminRouter);

    const spec = generator.generateSpec({
      info: {
        title: 'Profile site for photographer API',
        description: 'API for creating and editing examples.',
        version: '0.0.1',
      },
      basePath: '/',
      tags: [
        {
          name: 'admin',
          description: 'Group of API methods for managing admin panel',
        },
      ],
    }, {
      defaultResponses: {},
    });

    router.get('/api.json', async (ctx) => {
      ctx.body = JSON.stringify(spec, null, '  ');
    });

    app.use(httpLogger());
    app.use(errorCatcherMiddleware);
    app.use(cors({
      credentials: true,
    }));
    app.use(bodyParser({
      multipart: true,
      includeUnparsed: true,
    }));
    app.use(helmet());

    app.use(
      koaSwagger({
        routePrefix: '/docs',
        hideTopbar: true,
        swaggerOptions: {
          url: `${config.get('server.baseUrl')}/api.json`,
        },
      }),
    );

    router.get('/', async (ctx) => {
      ctx.body = 'It works!';
    });
    router.use(adminRouter.middleware());

    app.use(router.middleware());

    server.listen(config.get('server.port'), () => {
      console.log(`Server running on port ${config.get('server.port')}`);
    });
  })
  .catch((error) => {
    console.log(`Database connection error: ${error}`);
  })
;
