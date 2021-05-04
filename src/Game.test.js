import { fireEvent, render, screen } from '@testing-library/react';
import Game, { BORING, DEFENSE } from './Game';


/* 
- if player2 clicks draw and then player1 clicks draw, game over error 
*/

const generateHand = (playerNumber) => {
  if (playerNumber == 0) {
    return [BORING, BORING]
  }
  if (playerNumber == 1) {
    return [BORING, DEFENSE]
  }
  return [BORING, BORING]
}

test('finds a draw pile', () => {
  render(<Game numberOfPlayers={2} generateHand={generateHand} />);
  const drawPile = screen.getByText(/draw pile/i);
  expect(drawPile).toBeInTheDocument();
  expect(drawPile.children[0].textContent).toBe("Boring")
});

test('game ends after two draws', () => {
  render(<Game numberOfPlayers={2} generateHand={generateHand} />);
  const buttonPlayer2 = screen.getByText(/draw a card, player2/i)
  const buttonPlayer1 = screen.getByText(/draw a card, player1/i)
  fireEvent.click(buttonPlayer2)
  fireEvent.click(buttonPlayer1)
  expect(screen.getByText(/player1, you loose!/i)).toBeInTheDocument();
});

test('game does not end after two draws', () => {
  render(<Game numberOfPlayers={2} generateHand={generateHand} />);
  const buttonPlayer2 = screen.getByText(/draw a card, player2/i)
  const buttonPlayer1 = screen.getByText(/draw a card, player1/i)
  fireEvent.click(buttonPlayer1)
  fireEvent.click(buttonPlayer2)
  expect(screen.queryByText(/you loose!/i)).toBeNull();
});