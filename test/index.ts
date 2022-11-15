import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { Action, Table } from '../src';

const rl = readline.createInterface({ input, output });
type PlayerAction = [action: Action, betSize?: number];

const table = new Table(9, [1, 2]);

async function getPlayerAction(seatIndex: number): Promise<PlayerAction> {
  const player = table.getPlayer(seatIndex)!;
  const playerCards = table.getPlayerCards(seatIndex)!;
  const actions = table.getLegalActions();

  console.log(`\n[Player ${seatIndex}] Hand: ${playerCards.join(' | ')}`);
  console.log(`[Player ${seatIndex}] Chips: ${player.chips}`);
  console.log(`[Player ${seatIndex}] Max Bet: ${table.rounBet}`);
  console.log(`[Player ${seatIndex}] Bet: ${player.bet}`);

  // const actionIndex = await rl.question(
  //   `[Player ${seatIndex}] Choose an action (${actions
  //     .map((action, i) => `${i + 1}-${action}`)
  //     .join(', ')}): `
  // );

  // return [actions[parseInt(actionIndex) - 1]];
  const action = actions[1];
  console.log(`[Player ${seatIndex}] Action: ${action}`);
  return [action];
}

function showdown() {
  console.log('\nShowdown!');
  const { playerCards, winners } = table.showdown();
  const cards = Object.values(playerCards).map((cards, i) =>
    cards ? `[Player ${i}] Hand: ${cards.join(' | ')}` : null
  );

  cards.filter(Boolean).forEach(console.log);
  console.log('\n');

  if (!winners.length) {
    console.log('😭 😭 😭 No winners 😭 😭 😭');
  }

  winners.forEach(winner => {
    console.log(`🎉 🎉 🎉 Congrats to the player #${winner.seat + 1} 🎉 🎉 🎉`);
  });

  table.endHand();
}

async function startHand() {
  console.log('Starting hand!');
  table.startHand();

  while (table.isHandInProgress) {
    console.log(`\nRound of betting: ${table.roundOfBetting}`);
    console.log(`Table cards: ${table.cards.join(' | ') || 'Empty'}`);
    console.log(`Pot: ${table.pot}`);

    while (table.isBettingRoundInProgress) {
      const seatIndex = table.playerTurn!;
      const [action, betSize] = await getPlayerAction(seatIndex);

      table.takeAction(action, betSize);
    }

    table.endBettingRound();

    if (table.areBettingRoundsCompleted) {
      showdown();
    }
  }
}

async function main() {
  console.log('Welcome to poker!');

  // const playerCount =
  //   (await rl.question('How many opponent players are there? (2): ')) || '2';
  // const buyIn =
  //   (await rl.question('How much is the buy-in for everyone? (100): ')) ||
  //   '100';
  const playerCount = '2';
  const buyIn = '100';

  for (let i = 0; i < parseInt(playerCount); i++) {
    table.sitPlayer(i, parseInt(buyIn));
    console.log(`Player ${i} sat down with ${buyIn} chips`);
  }

  while (table.playersCount > 1) {
    await startHand();
    await rl.question('Press enter to start the next hand');
  }
}

main();
