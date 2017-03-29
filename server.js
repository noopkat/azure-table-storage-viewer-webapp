'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Hoek = require('hoek');
const azure = require('azure-storage');
const storage = require('./utility/storage');
const tableService = azure.createTableService(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCOUNT_KEY);

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
      const columns = process.env.TABLE_COLUMNS.split(',');

      storage.getLastNRows(azure, tableService, columns, 100, function(error, rows) {
        if (error) return reply(error);
        
        const viewData = {
          rows: rows,
          storageName: process.env.AZURE_STORAGE_ACCOUNT,
          tableName: process.env.TABLE_NAME
        };

        reply.view('index', viewData, { layout: 'main'});
      });
    }
  });
});

server.start((err) => {
  if (err) { throw err; }
  console.log(`Server running at: ${server.info.uri}`);
});
