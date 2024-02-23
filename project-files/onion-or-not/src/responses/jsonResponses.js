const helperFunctions = require('../helperFunctions/helperFunctions.js');

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return helperFunctions.respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => helperFunctions.respondJSONMeta(request, response, 404);

module.exports = {
  notFound,
  notFoundMeta,
};
