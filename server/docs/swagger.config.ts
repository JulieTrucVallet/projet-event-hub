const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EventHub API",
      version: "1.0.0",
      description: "Documentation de l'API EventHub",
    },
    servers: [
      {
        url: "http://localhost:8000/api/v1",
        description: "Version 1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        CreateEventInputs: {
          type: "object",
          required: ["title", "startDate", "venueId", "capacity", "organizerId", "categoryId"],
          properties: {
            title: { type: "string", example: "Event DB" },
            description: { type: "string", example: "Créé via Prisma" },
            startDate: { type: "string", format: "date-time", example: "2030-06-01T18:00:00.000Z" },
            venueId: { type: "string", example: "95f1323c-594b-406a-9782-b15d64cae245" },
            capacity: { type: "number", example: 120 },
            price: { type: "number", example: 25 },
            organizerId: { type: "string", example: "f0116095-ed8a-477e-a817-7c6365328535" },
            categoryId: { type: "string", example: "196bc98d-39f0-4c2d-8052-52a976df1c10" },
            imageUrl: { type: "string", example: "https://example.com/event-db.jpg" },
          },
        },
        UpdateEventInputs: {
          type: "object",
          properties: {
            title: { type: "string", example: "Event UPDATED" },
            description: { type: "string", example: "Nouvelle description" },
            startDate: { type: "string", format: "date-time", example: "2030-06-02T18:00:00.000Z" },
            capacity: { type: "number", example: 150 },
            price: { type: "number", example: 30 },
            imageUrl: { type: "string", example: "https://example.com/new.jpg" },
          },
        },
        JsonSuccessIdResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                id: { type: "string", example: "04326f3a-9669-41f9-a73b-a9577194e191" },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    "./docs/**/*.ts",
    "./src/controllers/**/*.ts",
  ],
};

export default swaggerOptions;