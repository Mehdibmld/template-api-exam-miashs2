export const swaggerDocument = {
  swagger: '2.0',
  info: {
    title: 'MIASHS Exams API',
    description: 'API documentation for MIASHS Exams',
    version: '1.0.0',
  },
  host: 'monapi.render.com', // à remplacer par ton vrai domaine render
  basePath: '/',
  schemes: ['https'],
  paths: {
    '/cities/{cityId}/infos': {
      get: {
        summary: 'Obtenir les infos de la ville',
        parameters: [
          {
            name: 'cityId',
            in: 'path',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          200: {
            description: 'Données de la ville',
          },
          404: {
            description: 'Ville non trouvée',
          },
        },
      },
    },
    '/cities/{cityId}/recipes': {
      post: {
        summary: 'Ajouter une recette à une ville',
        parameters: [
          {
            name: 'cityId',
            in: 'path',
            required: true,
            type: 'string',
          },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              properties: {
                content: { type: 'string' },
              },
            },
          },
        ],
        responses: {
          201: {
            description: 'Recette ajoutée',
          },
          400: {
            description: 'Contenu invalide',
          },
          404: {
            description: 'Ville non trouvée',
          },
        },
      },
    },
    '/cities/{cityId}/recipes/{recipeId}': {
      delete: {
        summary: 'Supprimer une recette',
        parameters: [
          {
            name: 'cityId',
            in: 'path',
            required: true,
            type: 'string',
          },
          {
            name: 'recipeId',
            in: 'path',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          204: {
            description: 'Supprimée',
          },
          404: {
            description: 'Ville ou recette non trouvée',
          },
        },
      },
    },
  },
};
