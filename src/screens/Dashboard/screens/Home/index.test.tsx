/* eslint-disable @typescript-eslint/naming-convention */
import { render, screen, fireEvent } from '@testing-library/react';
// import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { API_BASE_URL } from 'config/api';
import { GET_CHARACTER_HANDLERS_V2 } from 'mocks/characters';
import { MOCK_NETWORK_ERROR, mockNetworkError } from 'mocks/errors';

import Home from './index';

const server = setupServer(...GET_CHARACTER_HANDLERS_V2);

const setup = () => {
  const utils = render(<Home />);
  const input = utils.getByLabelText('form-input');
  const button = utils.getByLabelText('button');
  return {
    input,
    button,
    ...utils
  };
};

beforeEach(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('When screen renders', () => {
  test('shows characters count', async () => {
    setup();
    expect(await screen.findByText('Home:total 82')).toBeInTheDocument();
  });
  test('if no connection, shows error message', async () => {
    setup();
    server.use(MOCK_NETWORK_ERROR);
    expect(await screen.findByText('Home:countError')).toBeInTheDocument();
  });
});

describe('When trying to get a character', () => {
  test('if disconnected, shows error', async () => {
    server.use(mockNetworkError(`${API_BASE_URL}people/:id`));
    const { input, button } = setup();
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.click(button);
    expect(await screen.findByText('Home:connectionError')).toBeInTheDocument();
  });
  test('if exists, shows name', async () => {
    const { input, button } = setup();
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.click(button);
    expect(await screen.findByText('C-3PO')).toBeInTheDocument();
  });
  test('if does not exist, shows error', async () => {
    const { input, button } = setup();
    fireEvent.change(input, { target: { value: 'sarasa' } });
    fireEvent.click(button);
    expect(await screen.findByText('Home:error')).toBeInTheDocument();
  });
});
