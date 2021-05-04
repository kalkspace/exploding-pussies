import { useEffect, useReducer, useState } from "react";

const numberOfCardsOnHand = 5 // without defense card

export const BUM = "Bumm!";
export const DEFENSE = "Defense";
export const BORING = "Boring";

const DRAWACARD = "drawACard";

const initialState = (numberOfPlayers, generateHand, generateDrawPile) => ({
  numberOfPlayers,
  looser: null,
  playerCards: new Array(numberOfPlayers).fill().map((hand, playerNumber) => generateHand(playerNumber)),
  drawPile: generateDrawPile(numberOfPlayers),
  discardPile: []
})

const drawACardAction = {
  type: DRAWACARD,
  player: ''
}

const handleBum = (prevState, playerNumber) => {
  const { playerCards, drawPile, discardPile } = prevState
  const cards = playerCards[playerNumber];
  const defenseIndex = cards.indexOf(DEFENSE);
  if (defenseIndex !== -1) {
    const currentPlayerCards = [
      ...cards.slice(0, defenseIndex),
      ...cards.slice(defenseIndex + 1),
    ];
    const newPlayerCards = [...playerCards]
    playerCards[playerNumber] = currentPlayerCards
    const newDiscardPile = [...discardPile, DEFENSE];
    const newBumIndex = Math.random() * drawPile.length;
    const newDrawPile = [
      ...drawPile.slice(0, newBumIndex),
      BUM,
      ...drawPile.slice(newBumIndex),
    ];
    return {
      ...prevState,
      drawPile: newDrawPile,
      playerCards: newPlayerCards,
      discardPile: newDiscardPile
    };
  } else {
    return { ...prevState, looser: playerNumber }
  }
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case DRAWACARD: {
      const { playerNumber } = action;
      const [card, ...newDrawPile] = prevState.drawPile;
      switch (card) {
        case BUM: {
          return handleBum(prevState, playerNumber);
        }
        default: {
          const playerCards = [
            ...prevState.playerCards,
          ];
          playerCards[playerNumber] = [...prevState.playerCards[playerNumber], card]
          return {
            ...prevState,
            drawPile: newDrawPile,
            playerCards,
          }
        }
      }
    }
    default:
      return prevState
  }
}

const defaultHand = () => {
  const hand = [DEFENSE]
  for (let i = 0; i < numberOfCardsOnHand; i++) {
    hand.push(BORING) // TODO: In future draw these fro draw pile before Bumm! and extra defense get in there
  }
  return hand
}

const defaultDrawPile = (numberOfPlayers) => {
  const drawPile = []
  for (let i = 0; i < 30; i++) {
    drawPile.push(BORING)
  }
  for (let i = 0; i < numberOfPlayers - 1; i++) {
    drawPile.push(BUM)
  }
  drawPile.push(DEFENSE)
  drawPile.sort(() => Math.random() * 60 - 30)
  return drawPile
}

function Game({ numberOfPlayers, generateHand = defaultHand, generateDrawPile = defaultDrawPile }) {
  const [state, dispatch] = useReducer(reducer, initialState(numberOfPlayers, generateHand, generateDrawPile))
  const { looser, drawPile, discardPile, playerCards } = state

  const drawACard = (playerNumber) => {
    dispatch({ type: DRAWACARD, playerNumber })
  };
  if (looser != null) {
    return `player${looser + 1}, you loose!`
  }
  return (
    <>
      <h1>Exploding pussies</h1>
      {playerCards.map((hand, playerNumber) => (
        <p key={playerNumber}>
          Cards of player{playerNumber + 1}:{" "}
          <button onClick={() => drawACard(playerNumber)}>Draw a card, player{playerNumber + 1}!</button>
          {hand.map((card, index) => (
            <li key={index}>{card}</li>
          ))}
        </p>
      ))}
      <p>
        Cards in draw pile:
        {drawPile.map((card, index) => (
        <li key={index}>{card}</li>
      ))}
      </p>
      <p>
        Cards in discard pile:
        {discardPile.map((card, index) => (
        <li key={index}>{card}</li>
      ))}
      </p>
    </>
  );
}

export default Game;
