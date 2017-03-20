'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Hoek = require('hoek');
const azure = require('azure-storage');
const storage = requiew('./utility/storage');
const tableService = azure.createTableService();

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000, host: 'localhost' })

server.register(require('inert'), (err) => {
  server.route({
    method: 'GET',
    path: '/css/{param*}',
    handler: {
        directory: {
            path: 'public/css'
        }
    }
  });

  server.route({
    method: 'GET',
    path: '/fonts/{param*}',
    handler: {
        directory: {
            path: 'public/fonts'
        }
    }
  });
});

server.register(require('vision'), (err) => {

  Hoek.assert(!err, err);

  server.views({
    engines: {
        html: require('handlebars')
    },
    relativeTo: __dirname,
      path: './templates',
    layoutPath: './templates/layout'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      storage.getLastNRows(azure, tableService, 100, function(error, rows) {
         reply.view('index', { rows: rows }, { layout: 'main'});
      });
    }
  });
});

server.start((err) => {
  if (err) { throw err; }
  console.log(`Server running at: ${server.info.uri}`);
});
