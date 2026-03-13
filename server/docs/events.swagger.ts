/**
 * @openapi
 * /events:
 *   post:
 *     summary: Créer un événement
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventInputs'
 *     responses:
 *       201:
 *         description: Événement créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonSuccessIdResponse'
 *
 *   get:
 *     summary: Lister les événements
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Liste des événements
 *
 * /events/{id}:
 *   get:
 *     summary: Récupérer un événement par ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Événement trouvé
 *       404:
 *         description: Événement non trouvé
 *
 *   put:
 *     summary: Modifier un événement
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventInputs'
 *     responses:
 *       200:
 *         description: Événement modifié
 *
 *   delete:
 *     summary: Supprimer un événement
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Événement supprimé
 */