import { render, screen, fireEvent } from '@testing-library/react';
import { setupServer } from 'msw/node';

import { API_BASE_URL, API_SECONDARY_URL } from 'config/api';
import { GET_CHARACTER_HANDLERS } from 'mocks/characters';
import { POST_HANDLERS } from 'mocks/posts';
import {
  MOCK_NETWORK_ERROR,
  mockNetworkGetError,
  mockNetworkDeleteError,
  mockNetworkPutError,
  mockNetworkPostError
} from 'mocks/errors';

import Home from './index';

const handlers = [...GET_CHARACTER_HANDLERS, ...POST_HANDLERS];

const server = setupServer(...handlers);

const setup = () => {
  render(<Home />);
  const input = screen.getByLabelText('form-input');
  const button = screen.getByLabelText('button');
  const createButton = screen.getByLabelText('create');
  const deleteButton = screen.getByLabelText('delete');
  const editButton = screen.getByLabelText('edit');
  return {
    input,
    button,
    createButton,
    deleteButton,
    editButton
  };
};

beforeAll(() => {
  server.listen();
  render(<Home />);
});
/* NOTE: It is important to reset all handlers either before or after each test runs. Specially if you are using use() and trying to handle Network exceptions.
If not done, the handlers in use() statements will override the proper handlers for all the following tests, causing them to fail */
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('When screen renders', () => {
  test('shows characters count', async () => {
    expect(await screen.findByText('Home:total 82')).toBeInTheDocument();
  });
  test('if no connection, shows error message', async () => {
    server.use(...MOCK_NETWORK_ERROR);
    setup();
    expect(await screen.findByText('Home:countError')).toBeInTheDocument();
  });
});

describe('When trying to get a character', () => {
  test('if disconnected, shows error', async () => {
    server.use(mockNetworkGetError(`${API_BASE_URL}people/:id`));
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
    fireEvent.change(input, { target: { value: 'someValue' } });
    fireEvent.click(button);
    expect(await screen.findByText('Home:error')).toBeInTheDocument();
  });
});

describe('When trying to delete a character', () => {
  test('if failure, shows proper invalid id message', async () => {
    const { input, button, deleteButton } = setup();
    fireEvent.change(input, { target: { value: ' ' } });
    fireEvent.click(button);
    fireEvent.click(deleteButton);
    expect(await screen.findByText('Home:invalidID')).toBeInTheDocument();
  });
  test('if success, shows proper message', async () => {
    const { input, button, deleteButton } = setup();
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.click(button);
    fireEvent.click(deleteButton);
    expect(await screen.findByText('Home:deleteSuccess')).toBeInTheDocument();
  });
  test('if no connection, shows error message', async () => {
    const { input, button, deleteButton } = setup();
    server.use(mockNetworkDeleteError(`${API_SECONDARY_URL}posts/:id`));
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.click(button);
    fireEvent.click(deleteButton);
    expect(await screen.findByText('Home:deleteError')).toBeInTheDocument();
  });
});

describe('When trying to edit a character', () => {
  test('if success, shows proper message', async () => {
    const { input, button, editButton } = setup();
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.click(button);
    fireEvent.click(editButton);
    expect(await screen.findByText('Home:editSuccess')).toBeInTheDocument();
  });
  test('if failure, shows proper invalid id message', async () => {
    const { input, button, editButton } = setup();
    fireEvent.change(input, { target: { value: ' ' } });
    fireEvent.click(button);
    fireEvent.click(editButton);
    expect(await screen.findByText('Home:invalidID')).toBeInTheDocument();
  });
  test('if no connection, shows error message', async () => {
    const { input, button, editButton } = setup();
    server.use(mockNetworkPutError(`${API_SECONDARY_URL}posts/:id`));
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.click(button);
    fireEvent.click(editButton);
    expect(await screen.findByText('Home:editError')).toBeInTheDocument();
  });
});

describe('When trying to create a character', () => {
  test('if user provided, shows proper message with ID and userID', async () => {
    const { input, button, createButton } = setup();
    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.click(button);
    fireEvent.click(createButton);
    expect(await screen.findByText('Home:createSuccess {"id":101,"userId":7}')).toBeInTheDocument();
  });
  test('if no user provided, shows proper message without userID', async () => {
    const { input, button, createButton } = setup();
    fireEvent.change(input, { target: { value: ' ' } });
    fireEvent.click(button);
    fireEvent.click(createButton);
    expect(await screen.findByText('Home:createConditionalSuccess {"id":101}')).toBeInTheDocument();
  });
  test('if failure, shows error message', async () => {
    const { input, button, createButton } = setup();
    server.use(mockNetworkPostError(`${API_SECONDARY_URL}posts`));
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.click(button);
    fireEvent.click(createButton);
    expect(await screen.findByText('Home:createError')).toBeInTheDocument();
  });
});
