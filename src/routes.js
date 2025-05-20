import fetch from 'node-fetch'

const recipes = {}

export function registerRoutes(fastify) {
  const apiKey = process.env.API_KEY
  const baseUrl = 'https://api-ugi2pflmha-ew.a.run.app'

  const headers = {
    headers: {
      apiKey: apiKey
    }
  }

  // GET /cities/:cityId/infos
  fastify.get('/cities/:cityId/infos', async (request, reply) => {
    const cityId = request.params.cityId

    try {
      // Appel vers /cities/:cityId/insights
      const cityRes = await fetch(`${baseUrl}/cities/${cityId}/insights`, headers)
      if (!cityRes.ok) return reply.status(404).send({ error: 'City not found' })
      const city = await cityRes.json()

      // Appel vers weather-predictions avec cityIdentifier
      const weatherRes = await fetch(`${baseUrl}/weather-predictions?cityIdentifier=${cityId}`, headers)
      const weather = await weatherRes.json()

      const response = {
        coordinates: [
          city.coordinates[0].latitude,
          city.coordinates[0].longitude
        ],
        population: city.population,
        knownFor: city.knownFor.map(item => item.content),
        weatherPredictions: weather[0].predictions.slice(0, 2).map((w, i) => ({
          when: i === 0 ? 'today' : 'tomorrow',
          min: w.minTemperature,
          max: w.maxTemperature
        })),
        recipes: recipes[cityId] || []
      }

      reply.send(response)
    } catch (error) {
      reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // POST /cities/:cityId/recipes
  fastify.post('/cities/:cityId/recipes', async (request, reply) => {
    const cityId = request.params.cityId
    const { content } = request.body || {}

    if (!content || typeof content !== 'string' || content.length < 10 || content.length > 2000) {
      return reply.status(400).send({ error: 'Invalid content' })
    }

    try {
      const cityCheck = await fetch(`${baseUrl}/cities/${cityId}/insights`, headers)
      if (!cityCheck.ok) return reply.status(404).send({ error: 'City not found' })

      if (!recipes[cityId]) recipes[cityId] = []

      const newRecipe = { id: Date.now(), content }
      recipes[cityId].push(newRecipe)
      reply.status(201).send(newRecipe)
    } catch (error) {
      reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // DELETE /cities/:cityId/recipes/:recipeId
  fastify.delete('/cities/:cityId/recipes/:recipeId', async (request, reply) => {
    const { cityId, recipeId } = request.params

    try {
      const cityCheck = await fetch(`${baseUrl}/cities/${cityId}/insights`, headers)
      if (!cityCheck.ok) return reply.status(404).send({ error: 'City not found' })

      const list = recipes[cityId] || []
      const index = list.findIndex(r => r.id === parseInt(recipeId))

      if (index === -1) return reply.status(404).send({ error: 'Recipe not found' })

      list.splice(index, 1)
      reply.status(204).send()
    } catch (error) {
      reply.status(500).send({ error: 'Internal server error' })
    }
  })
}
