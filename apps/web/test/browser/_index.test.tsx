import { render, screen, waitFor } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import Home from '../../app/routes/_index';

test('generic browser mode test', async () => {
  const Stub = createRoutesStub([
    {
      path: '/',
      Component: Home,
      loader: () =>
        Promise.resolve({
          data: JSON.stringify({
            id: 4,
          }),
        }),
      action() {
        return {
          errors: {
            username: 'test',
            password: 'test',
          },
        };
      },
    },
  ]);

  render(<Stub initialEntries={['/']} />);

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: '4' })).toBeVisible();
  });
});
