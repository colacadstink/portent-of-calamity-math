export type CardInfo = {
  quantity: number;
  types: Record<CardType, boolean>;
};

export const CARD_TYPES = Object.freeze([
    'Artifact',
    'Battle',
    'Creature',
    'Enchantment',
    'Instant',
    'Kindred',
    'Land',
    'Planeswalker',
    'Sorcery',
] as const);
export type CardType = typeof CARD_TYPES[number];
export const newTypes = () => {
  return Object.fromEntries(
      CARD_TYPES.map((type) => [type, false])
  ) as Record<CardType, boolean>;
}

export type SimulationInfo = {
  runCount: number;
  hitRate: number;
};
