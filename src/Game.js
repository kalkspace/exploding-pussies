import { useEffect, useReducer, useState } from "react";

const BUM = "Bumm!";
const DEFENSE = "Defense";
const BORING = "Boring";

const DRAWACARD = "drawACard";

const initialState = {
  looser: null,
  playerCards: {
    player1: [BORING, BORING],
    player2: [DEFENSE, BORING],
  },
  drawPile: [BORING, BUM, DEFENSE, BORING],
  discardPile: []
}

const drawACardAction = {
  type: DRAWACARD,
  player: ''
}

const handleBum = (prevState, player) => {
  const { playerCards, drawPile, discardPile } = prevState
  const cards = playerCards[player];
  const defenseIndex = cards.indexOf(DEFENSE);
  if (defenseIndex !== -1) {
    const currentPlayerCards = [
      ...cards.slice(0, defenseIndex),
      ...cards.slice(defenseIndex + 1),
    ];
    const newPlayerCards = {
      ...playerCards,
      [player]: currentPlayerCards,
    };
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
    return { ...prevState, looser: player }
  }
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case DRAWACARD: {
      const { player } = action;
      const [card, ...newDrawPile] = prevState.drawPile;
      switch (card) {
        case BUM: {
          return handleBum(prevState, player);
        }
        default: {
          const playerCards = {
            ...prevState.playerCards,
            [player]: [...prevState.playerCards[player], card],
          };
          return {
            ...prevState,
            drawPile: newDrawPile,
            playerCards,
          }
        }
      }
    }
  }

  return prevState

}

function Game() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { looser, drawPile, discardPile, playerCards } = state

  const drawACard = (player) => {
    dispatch({ type: DRAWACARD, player })
  };
  if (looser != null) {
    return `${looser}, you loose!`
  }
  return (
    <>
      <h1>Exploding pussies</h1>
      {Object.keys(playerCards).map((player) => (
        <p key={player}>
          Cards of {player}:{" "}
          <button onClick={() => drawACard(player)}>Draw a card, {player}!</button>
          {playerCards[player].map((card, index) => (
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
