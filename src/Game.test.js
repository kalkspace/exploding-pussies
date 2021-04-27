import { fireEvent, render, screen } from '@testing-library/react';
import Game from './Game';

/* 
- if player2 clicks draw and then player1 clicks draw, game over error 
*/

test('finds a draw pile', () => {
  render(<Game />);
  const drawPile = screen.getByText(/draw pile/i);
  expect(drawPile).toBeInTheDocument();
  expect(drawPile.children[0].textContent).toBe("Boring")
});

test('game ends after two draws', () => {
  render(<Game />);
  const buttonPlayer2 = screen.getByText(/draw a card, player2/i)
  const buttonPlayer1 = screen.getByText(/draw a card, player1/i)
  fireEvent.click(buttonPlayer2)
  fireEvent.click(buttonPlayer1)
  expect(screen.getByText(/player1, you loose!/i)).toBeInTheDocument();
});