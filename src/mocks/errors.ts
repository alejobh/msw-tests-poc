import { rest } from 'msw';

// TODO: Check if there is a possible way to unify all 4 network error handlers with paths into one single function.
// NOTE: This should be used if you need to specify which request has to fail.
export const mockNetworkGetError = (path: string) =>
  rest.get(path, (_, res) => res.networkError('Failed to connect'));

export const mockNetworkDeleteError = (path: string) =>
  rest.delete(path, (_, res) => res.networkError('Failed to connect'));

export const mockNetworkPostError = (path: string) =>
  rest.post(path, (_, res) => res.networkError('Failed to connect'));

export const mockNetworkPutError = (path: string) =>
  rest.put(path, (_, res) => res.networkError('Failed to connect'));

// NOTE: This should be used if you don't need to specify which request has to fail. In this case, when called, will cause all request to throw an exception.
export const MOCK_NETWORK_ERROR = [
  rest.get('*', (_, res) => res.networkError('Failed to connect')),
  rest.post('*', (_, res) => res.networkError('Failed to connect')),
  rest.delete('*', (_, res) => res.networkError('Failed to connect')),
  rest.put('*', (_, res) => res.networkError('Failed to connect'))
];
