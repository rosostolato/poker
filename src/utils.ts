import { randomInt } from 'crypto';

export function shuffle<Type>(array: Type[]) {
  for (let index = array.length - 1; index > 0; index--) {
    const newIndex = randomInt(index + 1);
    [array[index], array[newIndex]] = [array[newIndex], array[index]];
  }
}
