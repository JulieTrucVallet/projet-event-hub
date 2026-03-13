import fs from "fs";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "./swagger.config";

const swaggerSpec = swaggerJSDoc(swaggerOptions);

fs.writeFileSync("./docs/swagger-output.json", JSON.stringify(swaggerSpec, null, 2));

console.log("Fichier Swagger généré: swagger-output.json");