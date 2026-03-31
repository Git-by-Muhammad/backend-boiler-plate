const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const Ticket = require('../../models/ticket.model');
const { authenticate } = require('../../middleware/auth');
const { createTicketSchema, updateTicketSchema, idParamsSchema, listQuerySchema } = require('../../validation/ticket.validation');

const router = express.Router();

router.use(
  '/',
  authenticate,
  createCrudRoutes(Ticket, {
    validation: {
      create: createTicketSchema,
      update: updateTicketSchema,
      id: idParamsSchema,
      list: listQuerySchema,
    },
  })
);

module.exports = router;

