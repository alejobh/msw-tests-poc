/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */
import { rest } from 'msw';

import { STATUS_CODES, API_BASE_URL } from 'config/api';

export const MOCK_CHARACTER = {
  name: 'C-3PO',
  height: '167',
  mass: '75',
  hair_color: 'n/a',
  skin_color: 'gold',
  eye_color: 'yellow',
  birth_year: '112BBY',
  gender: 'n/a',
  homeworld: 'https://swapi.dev/api/planets/1/',
  films: [
    'https://swapi.dev/api/films/1/',
    'https://swapi.dev/api/films/2/',
    'https://swapi.dev/api/films/3/',
    'https://swapi.dev/api/films/4/',
    'https://swapi.dev/api/films/5/',
    'https://swapi.dev/api/films/6/'
  ],
  species: ['https://swapi.dev/api/species/2/'],
  vehicles: [],
  starships: [],
  created: '2014-12-10T15:10:51.357000Z',
  edited: '2014-12-20T21:17:50.309000Z',
  url: 'https://swapi.dev/api/people/2/'
};

export const MOCK_CAST = {
  count: 82,
  next: 'https://swapi.dev/api/people/?page=2',
  previous: 'https://swapi.dev/api/people/?page=3',
  results: [MOCK_CHARACTER]
};

const validId = (id: number) => id && !isNaN(id) && id < 50;

export const GET_CHARACTER_HANDLERS = [
  rest.get(`${API_BASE_URL}people`, (_, res, ctx) => res(ctx.status(STATUS_CODES.ok), ctx.json(MOCK_CAST))),
  rest.get(`${API_BASE_URL}people/:id`, (req, res, ctx) => {
    const { id } = req.params;
    if (validId(id)) {
      return res(ctx.status(STATUS_CODES.ok), ctx.json(MOCK_CHARACTER));
    }
    return isNaN(id) ? res(ctx.status(STATUS_CODES.notFound)) : res(ctx.status(STATUS_CODES.badRequest));
  })
];
