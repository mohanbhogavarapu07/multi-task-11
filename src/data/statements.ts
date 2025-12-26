import { Statement } from '@/types/game';

const simpleStatements: Statement[] = [
  { text: "Fire is hot", isTrue: true },
  { text: "Ice is cold", isTrue: true },
  { text: "Water is wet", isTrue: true },
  { text: "The sky is blue", isTrue: true },
  { text: "Dogs can bark", isTrue: true },
  { text: "Fish live in water", isTrue: true },
  { text: "Birds have wings", isTrue: true },
  { text: "The sun is bright", isTrue: true },
  { text: "Snow is white", isTrue: true },
  { text: "Grass is green", isTrue: true },
  { text: "Fire is cold", isTrue: false },
  { text: "Ice is hot", isTrue: false },
  { text: "Water is dry", isTrue: false },
  { text: "The sky is green", isTrue: false },
  { text: "Dogs can fly", isTrue: false },
  { text: "Fish live on land", isTrue: false },
  { text: "Birds have gills", isTrue: false },
  { text: "The sun is dark", isTrue: false },
  { text: "Snow is black", isTrue: false },
  { text: "Grass is purple", isTrue: false },
];

const mediumStatements: Statement[] = [
  { text: "2 + 2 = 4", isTrue: true },
  { text: "5 × 3 = 15", isTrue: true },
  { text: "10 - 7 = 3", isTrue: true },
  { text: "8 ÷ 2 = 4", isTrue: true },
  { text: "3² = 9", isTrue: true },
  { text: "√16 = 4", isTrue: true },
  { text: "7 + 6 = 13", isTrue: true },
  { text: "9 × 4 = 36", isTrue: true },
  { text: "15 - 8 = 7", isTrue: true },
  { text: "24 ÷ 6 = 4", isTrue: true },
  { text: "2 + 2 = 5", isTrue: false },
  { text: "5 × 3 = 12", isTrue: false },
  { text: "10 - 7 = 4", isTrue: false },
  { text: "8 ÷ 2 = 3", isTrue: false },
  { text: "3² = 6", isTrue: false },
  { text: "√16 = 8", isTrue: false },
  { text: "7 + 6 = 12", isTrue: false },
  { text: "9 × 4 = 32", isTrue: false },
  { text: "15 - 8 = 6", isTrue: false },
  { text: "24 ÷ 6 = 5", isTrue: false },
];

const complexStatements: Statement[] = [
  { text: "Paris is in France", isTrue: true },
  { text: "The Earth orbits the Sun", isTrue: true },
  { text: "Humans have 206 bones", isTrue: true },
  { text: "Water boils at 100°C", isTrue: true },
  { text: "Diamond is harder than gold", isTrue: true },
  { text: "Oxygen is needed for fire", isTrue: true },
  { text: "The Moon causes tides", isTrue: true },
  { text: "Sound travels faster in water", isTrue: true },
  { text: "Penguins live in Antarctica", isTrue: true },
  { text: "12 × 12 = 144", isTrue: true },
  { text: "Tokyo is in China", isTrue: false },
  { text: "The Sun orbits the Earth", isTrue: false },
  { text: "Humans have 300 bones", isTrue: false },
  { text: "Water boils at 50°C", isTrue: false },
  { text: "Gold is harder than diamond", isTrue: false },
  { text: "Fire can exist in a vacuum", isTrue: false },
  { text: "The Sun causes tides", isTrue: false },
  { text: "Sound travels faster in air", isTrue: false },
  { text: "Penguins live in the Arctic", isTrue: false },
  { text: "12 × 12 = 124", isTrue: false },
];

const absurdStatements: Statement[] = [
  { text: "Yesterday is after tomorrow", isTrue: false },
  { text: "Silence is louder than noise", isTrue: false },
  { text: "Darkness produces light", isTrue: false },
  { text: "Empty is heavier than full", isTrue: false },
  { text: "Slow is faster than quick", isTrue: false },
  { text: "Up is the same as down", isTrue: false },
  { text: "Zero equals infinity", isTrue: false },
  { text: "Hot ice melts cold fire", isTrue: false },
  { text: "Square circles exist", isTrue: false },
  { text: "Nothing weighs something", isTrue: false },
  { text: "All squares have 4 sides", isTrue: true },
  { text: "Some numbers are negative", isTrue: true },
  { text: "Triangles have 3 angles", isTrue: true },
  { text: "Zero multiplied by any number is zero", isTrue: true },
  { text: "All circles are round", isTrue: true },
  { text: "1 + 1 × 0 = 1", isTrue: true },
  { text: "A dozen equals 12", isTrue: true },
  { text: "Parallel lines never meet", isTrue: true },
  { text: "Prime numbers have exactly 2 factors", isTrue: true },
  { text: "An hour has 60 minutes", isTrue: true },
];

export function getRandomStatement(complexity: 'simple' | 'medium' | 'complex' | 'absurd'): Statement {
  let pool: Statement[];
  
  switch (complexity) {
    case 'simple':
      pool = simpleStatements;
      break;
    case 'medium':
      pool = mediumStatements;
      break;
    case 'complex':
      pool = complexStatements;
      break;
    case 'absurd':
      pool = absurdStatements;
      break;
  }
  
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getMixedStatement(level: number): Statement {
  // Higher levels mix in more complex/absurd statements
  const rand = Math.random();
  
  if (level <= 3) {
    return getRandomStatement('simple');
  } else if (level <= 6) {
    return rand < 0.5 ? getRandomStatement('simple') : getRandomStatement('medium');
  } else if (level <= 10) {
    if (rand < 0.3) return getRandomStatement('medium');
    if (rand < 0.7) return getRandomStatement('complex');
    return getRandomStatement('absurd');
  } else {
    if (rand < 0.2) return getRandomStatement('complex');
    return getRandomStatement('absurd');
  }
}
