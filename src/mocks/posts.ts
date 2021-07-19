import { rest } from 'msw';

import { STATUS_CODES, API_SECONDARY_URL } from 'config/api';

export const MOCK_POST = {
  id: 101,
  title: 'Mock title',
  body: 'Mock body',
  userId: 1
};

export const POST_HANDLERS = [
  rest.post(`${API_SECONDARY_URL}posts`, (_, res, ctx) =>
    res(ctx.status(STATUS_CODES.ok), ctx.json(MOCK_POST))
  ),
  rest.delete(`${API_SECONDARY_URL}posts/`, (_, res, ctx) => res(ctx.status(STATUS_CODES.notFound))),
  rest.delete(`${API_SECONDARY_URL}posts/:id`, (_, res, ctx) => res(ctx.status(STATUS_CODES.ok))),
  rest.put(`${API_SECONDARY_URL}posts/:id`, (req, res, ctx) => {
    const { id } = req.params;
    if (isNaN(id)) {
      return res(ctx.status(STATUS_CODES.syntaxError));
    }
    return res(ctx.status(STATUS_CODES.ok));
  })
];

/* IMPORTANT NOTE: You will probably notice that there are two handlers for the delete method. The reason is that, if you try to delete the
id ' ', it will instead try to delete 'posts/'. This is a different behaviour that the one present in the PUT case, in that in this case, it will
try to update a NaN element */
