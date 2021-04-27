import { render, screen } from '@testing-library/react';
import App from './App';

test('renders game', () => {
  render(<App />);
  const linkElement = screen.getByText(/pussies/i);
  expect(linkElement).toBeInTheDocument();
});
