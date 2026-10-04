import React, {useState} from 'react';
import './App.css';
import {CARD_TYPES, CardInfo, CardType, newTypes, SimulationInfo} from "./types";

const SIMULATION_RUN_COUNT = 100_000;

function App() {
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [xValue, setXValue] = useState<number>(4);
  const [simulationInfo, setSimulationInfo] = useState<SimulationInfo | undefined>();

  function cardTypeEditor(card: CardInfo, index: number) {
    return <div key={`card_${index}`}>
      <input type="number" value={card.quantity} onChange={(ev) => setCardQuantity(+ev.target.value, index)} />
      {CARD_TYPES.map((type) => {
        return <label key={`card_${index}_type_${type}`}>
          <input type="checkbox" checked={card.types[type]} onChange={() => toggleCardType(type, index)}/>
          {type}
        </label>;
      })}
    </div>
  }

  function setCardQuantity(quantity: number, index: number) {
    const newc = [...cards];
    newc[index] = {quantity, types: cards[index].types};
    setCards(newc);
  }

  function toggleCardType(type: CardType, index: number) {
    const newc = [...cards];
    newc[index] = {...cards[index]};
    newc[index].types[type] = !newc[index].types[type];
    setCards(newc);
  }

  function simulation(){
    return <div>
      {simulationInfo
          ? `In ${simulationInfo.runCount} runs, there were ${simulationInfo.hitRate} hits. (${simulationInfo.hitRate/simulationInfo.runCount})`
          : 'No simulation available, click below to run one.'
      }
      <br/>
      Flip <input type="number" value={xValue} onChange={(ev) => setXValue(+ev.target.value)}/> cards
      <br/>
      <button onClick={runSimulation}>Run simulation</button>
    </div>
  }

  function runSimulation(){
    let hitRate = 0;
    for (let i=0; i<SIMULATION_RUN_COUNT; i++) {
      const wasHit = shuffleAndFlipX(cards, xValue);
      if (wasHit) hitRate++;
    }

    setSimulationInfo({
      runCount: SIMULATION_RUN_COUNT,
      hitRate,
    });
  }

  return (
    <div>
      <div>
        Cards in deck:
        {cards.map(cardTypeEditor)}
        <br/>
        <button onClick={() => setCards((c) => [...c, {quantity: 0, types: newTypes()}])}>
          Add cards
        </button>
      </div>
      {simulation()}
    </div>
  );
}

function shuffleAndFlipX(cards: CardInfo[], xValue: number): boolean {
  const deck = cards.flatMap(card => Array.from({ length: card.quantity }, () => ({types: card.types})));
  const shuffledDeck = deck.sort(() => Math.random() - 0.5);
  const typesFound: Record<CardType, boolean> = newTypes();
  for (let i = 0; i < xValue; i++) {
    const card = shuffledDeck.pop();
    if (!card) break;
    for (const type of CARD_TYPES) {
      typesFound[type] ||= card.types[type];
    }
  }
  let foundCount = 0;
  for (const type of CARD_TYPES) {
    if (typesFound[type]) foundCount++;
  }
  return foundCount >= 4;
}

export default App;
