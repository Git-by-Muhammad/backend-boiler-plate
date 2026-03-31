const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const Ticket = require('../../models/ticket.model');
const { authenticate } = require('../../middleware/auth');
const { createTicketSchema, updateTicketSchema, idParamsSchema, listQuerySchema } = require('../../validation/ticket.validation');
const { assignOwnerOnCreate, scopeQueryToOwner, adminOrOwner } = require('../../middleware/resourceAccess');

const router = express.Router();

router.use(
  '/',
  createCrudRoutes(Ticket, {
    validation: {
      create: createTicketSchema,
      update: updateTicketSchema,
      id: idParamsSchema,
      list: listQuerySchema,
    },
    middlewares: {
      create: [authenticate, assignOwnerOnCreate('user')],
      list: [authenticate, scopeQueryToOwner('user')],
      getById: [authenticate, adminOrOwner(Ticket, 'user')],
      update: [authenticate, adminOrOwner(Ticket, 'user')],
      remove: [authenticate, adminOrOwner(Ticket, 'user')],
    },
  })
);

module.exports = router;

