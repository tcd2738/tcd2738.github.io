// Respond with JSON object.
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// Response with no body (HEAD requests).
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const getRandomNum = (max) => Math.floor(Math.random() * max);

module.exports = {
  respondJSON,
  respondJSONMeta,
  getRandomNum,
};
