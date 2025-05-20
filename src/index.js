import 'dotenv/config'
import Fastify from 'fastify'
import { submitForReview } from './submission.js'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { swaggerDocument } from './swagger.js'
import { registerRoutes } from './routes.js'

const fastify = Fastify({
  logger: true,
})

// Swagger JSON (disponible sur /documentation/json)
fastify.register(fastifySwagger, {
  swagger: swaggerDocument,
})

// Swagger UI (interface visible à la racine "/")
fastify.register(fastifySwaggerUI, {
  routePrefix: '/',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
})

// Routes de l'API (GET infos, POST recipes, DELETE recipe)
registerRoutes(fastify)

// Lancement du serveur
fastify.listen(
  {
    port: process.env.PORT || 3000,
    host: process.env.RENDER_EXTERNAL_URL ? '0.0.0.0' : process.env.HOST || 'localhost',
  },
  function (err) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }

    // Ne pas supprimer cette ligne ! C’est ce qui permet la vérification automatique
    submitForReview(fastify)
  }
)
