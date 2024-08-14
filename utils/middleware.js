const logger = require("./logger");

const requestLogger = (req, resp, next) => {
  logger.info("method: ",req.method);
  logger.info("path: ",req.path);
  logger.info("body: ",req.body);
  logger.info("-----------")
  next();
};

const unknownEndpoint = (req, resp, next) => {
  resp.status(404).send({error: "Unknown Endpoint"});
};

const errorHandler = (error, req, resp, next) => {
  logger.error(error.message);

  if (error.name === "CastError"){
    return resp.status(400).send({error:"malformatted id"})
  } else if ( error.name === "ValidationError"){
    return resp.status(400).send({error:error.message})
  }

  next(error)
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
