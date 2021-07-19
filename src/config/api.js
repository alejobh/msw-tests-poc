import { create } from 'apisauce';
import { CamelcaseSerializer, SnakecaseSerializer } from 'cerealizr';

export const STATUS_CODES = {
  ok: 200,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  syntaxError: 500
};

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/';

export const API_SECONDARY_URL = process.env.REACT_APP_API_SECONDARY_URL || 'http://localhost:5000/';

const api = create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export const apiSecondary = create({
  baseURL: API_SECONDARY_URL,
  timeout: 15000,
});

const deserializer = new CamelcaseSerializer();
const serializer = new SnakecaseSerializer();

// If you need to add more monitors consider calling api.addMonitor from your component
// eslint-disable-next-line no-unused-vars, prettier/prettier, @typescript-eslint/no-unused-vars
export const apiSetup = (unauthorizedCallback, networkErrorCallback) => {
  api.addMonitor((response) => {
    if (response.status === STATUS_CODES.unauthorized) {
      /*
       * TODO: These callbacks should only be called if no other callback was asigned for the response.
       * - i.e: unauthorizedCallback?.(response)
       */
    }
  });

  api.addMonitor((response) => {
    if (response.problem === 'NETWORK_ERROR') {
      /*
       * TODO: These callbacks should only be called if no other callback was asigned for the response.
       * - i.e: networkErrorCallback?.(response)
       */
    }
  });

  api.addResponseTransform(response => {
    if (response.ok && response.data) {
      response.data = deserializer.serialize(response.data);
    }
  });

  api.addRequestTransform(request => {
    if (request.data) {
      request.data = serializer.serialize(request.data);
    }
    if (request.params) {
      request.params = serializer.serialize(request.params);
    }
  });
};

export default api;
