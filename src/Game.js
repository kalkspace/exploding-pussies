import { useEffect, useState } from "react";

const BUM = "Bumm!";
const DEFENSE = "Defense";
const BORING = "Boring";

function Game() {
  const [players, setPlayers] = useState({
    player1: [BORING, BORING],
    player2: [DEFENSE, BORING],
  });

  const [drawPile, setDrawPile] = useState([BORING, BUM, DEFENSE, BORING]);

  const [discardPile, setDiscardPile] = useState([]);

  const handleBum = (player, drawPile) => {
    const cards = players[player];
    const defenseIndex = cards.indexOf(DEFENSE);
    if (defenseIndex !== -1) {
      const newPlayerCards = [
        ...cards.slice(0, defenseIndex),
        ...cards.slice(defenseIndex + 1),
      ];
      setPlayers({
        ...players,
        [player]: newPlayerCards,
      });
      setDiscardPile([...discardPile, DEFENSE]);
      const newBumIndex = Math.random() * drawPile.length;
      const newDrawPile = [
        ...drawPile.slice(0, newBumIndex),
        BUM,
        ...drawPile.slice(newBumIndex),
      ];
      return newDrawPile;
    } else {
      throw new Error("Game over");
    }
  };

  const drawACard = (player) => {
    let [card, ...newDrawPile] = drawPile;
    switch (card) {
      case BUM: {
        newDrawPile = handleBum(player, newDrawPile);
        break;
      }
      default: {
        setPlayers({
          ...players,
          [player]: [...players[player], card],
        });
      }
    }
    setDrawPile(newDrawPile);
  };

  return (
    <>
      <h1>Exploding pussies</h1>
      {Object.keys(players).map((player) => (
        <p>
          Cards of {player}:{" "}
          <button onClick={() => drawACard(player)}>Draw a card</button>
          {players[player].map((card) => (
            <li>{card}</li>
          ))}
        </p>
      ))}
      <p>
        Cards in draw pile:
        {drawPile.map((card) => (
          <li>{card}</li>
        ))}
      </p>
      <p>
        Cards in discard pile:
        {discardPile.map((card) => (
          <li>{card}</li>
        ))}
      </p>
    </>
  );
}

export default Game;
