import { rest } from 'msw';

export const mockNetworkError = (path: string) =>
  rest.get(path, (_, res) => res.networkError('Failed to connect'));

export const MOCK_NETWORK_ERROR = rest.get('*', (_, res) => res.networkError('Failed to connect'));
