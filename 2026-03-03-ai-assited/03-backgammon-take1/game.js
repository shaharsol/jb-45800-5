/**
 * Backgammon game logic and UI
 * Points: 1-24. White moves 24→1 (down), Black moves 1→24 (up).
 * White home: 1-6, Black home: 19-24.
 */

const WHITE = 'white';
const BLACK = 'black';

function getInitialSetup() {
  const board = {};
  for (let p = 1; p <= 24; p++) board[p] = { count: 0, color: null };
  board[24] = { count: 2, color: WHITE };
  board[13] = { count: 5, color: WHITE };
  board[8] = { count: 3, color: WHITE };
  board[6] = { count: 5, color: WHITE };
  board[1] = { count: 2, color: BLACK };
  board[12] = { count: 5, color: BLACK };
  board[17] = { count: 3, color: BLACK };
  board[19] = { count: 5, color: BLACK };
  return board;
}

const state = {
  board: getInitialSetup(),
  bar: { [WHITE]: 0, [BLACK]: 0 },
  bearOff: { [WHITE]: 0, [BLACK]: 0 },
  turn: null,
  dice: [0, 0],
  usedDice: [],
  selectedPoint: null,
  phase: 'start', // start | roll | move | gameover
  winner: null
};

const $ = (id) => document.getElementById(id);
const statusEl = () => document.getElementById('status');
const rollBtn = () => document.getElementById('rollBtn');
const dice1El = () => document.getElementById('dice1');
const dice2El = () => document.getElementById('dice2');
const usedDiceEl = () => document.getElementById('usedDice');

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function isWhiteHome(point) {
  return point >= 1 && point <= 6;
}
function isBlackHome(point) {
  return point >= 19 && point <= 24;
}
function whiteEntersOn() {
  return [19, 20, 21, 22, 23, 24];
}
function blackEntersOn() {
  return [1, 2, 3, 4, 5, 6];
}

function getBoardPoint(board, point) {
  const v = board[point];
  if (!v) return { count: 0, color: null };
  return v;
}

function getValidMoves(color) {
  const moves = [];
  const { board, bar, usedDice } = state;
  const dice = [...usedDice].filter(d => d > 0);
  if (dice.length === 0) return moves;

  const isWhite = color === WHITE;
  const onBar = bar[color] || 0;

  if (onBar > 0) {
    const enterPoints = isWhite ? whiteEntersOn() : blackEntersOn();
    for (const d of dice) {
      const target = isWhite ? 25 - d : d;
      if (enterPoints.includes(target)) {
        const pt = getBoardPoint(board, target);
        if (pt.count === 0 || pt.color === color || (pt.color !== color && pt.count === 1)) {
          moves.push({ from: 'bar', to: target, die: d });
        }
      }
    }
    if (moves.length > 0) return moves;
  }

  for (let from = 1; from <= 24; from++) {
    const pt = getBoardPoint(board, from);
    if (pt.color !== color || pt.count === 0) continue;
    const fromInHome = isWhite ? isWhiteHome(from) : isBlackHome(from);
    for (const d of dice) {
      const to = isWhite ? from - d : from + d;
      if (to < 1 || to > 24) {
        if (fromInHome && (isWhite ? to >= 1 - d : to <= 24 + d))
          moves.push({ from, to: 'bear', die: d });
        continue;
      }
      const toPt = getBoardPoint(board, to);
      if (toPt.count === 0 || toPt.color === color || (toPt.color !== color && toPt.count === 1))
        moves.push({ from, to, die });
    }
  }
  return moves;
}

function canBearOff(color) {
  const { board } = state;
  const isWhite = color === WHITE;
  const home = isWhite ? [1, 2, 3, 4, 5, 6] : [19, 20, 21, 22, 23, 24];
  for (let p = 1; p <= 24; p++) {
    const pt = getBoardPoint(board, p);
    if (pt.color === color && pt.count > 0 && !home.includes(p)) return false;
  }
  return true;
}

function getPossibleTargets(fromPointOrBar, color) {
  const { usedDice, board, bar } = state;
  const dice = [...usedDice].filter(d => d > 0);
  const targets = [];
  const isWhite = color === WHITE;
  const fromBar = fromPointOrBar === 'bar';
  const onBar = bar[color] || 0;

  if (fromBar && onBar > 0) {
    const enterPoints = isWhite ? whiteEntersOn() : blackEntersOn();
    for (const d of dice) {
      const to = isWhite ? 25 - d : d;
      if (enterPoints.includes(to)) {
        const pt = getBoardPoint(board, to);
        if (pt.count === 0 || pt.color === color || (pt.color !== color && pt.count === 1))
          targets.push({ to, die: d });
      }
    }
    return targets;
  }

  const from = Number(fromPointOrBar);
  const pt = getBoardPoint(board, from);
  if (pt.color !== color || pt.count === 0) return [];

  const inHome = isWhite ? isWhiteHome(from) : isBlackHome(from);
  for (const d of dice) {
    const to = isWhite ? from - d : from + d;
    if (to >= 1 && to <= 24) {
      const toPt = getBoardPoint(board, to);
      if (toPt.count === 0 || toPt.color === color || (toPt.color !== color && toPt.count === 1))
        targets.push({ to, die: d });
    } else if (inHome && canBearOff(color)) {
      if (isWhite && to < 1) targets.push({ to: 'bear', die: d });
      if (!isWhite && to > 24) targets.push({ to: 'bear', die: d });
    }
  }
  return targets;
}

function applyMove(from, to, die) {
  const { board, bar, bearOff, usedDice } = state;
  const color = state.turn;
  const isWhite = color === WHITE;

  if (from === 'bar') {
    state.bar[color]--;
    const toPt = getBoardPoint(board, to);
    if (toPt.color && toPt.color !== color && toPt.count === 1) {
      state.bar[toPt.color]++;
      board[to] = { count: 0, color: null };
    }
    board[to] = { count: (board[to]?.count || 0) + 1, color };
  } else {
    const fromPt = getBoardPoint(board, from);
    fromPt.count--;
    if (fromPt.count === 0) board[from] = { count: 0, color: null };

    if (to === 'bear') {
      state.bearOff[color]++;
    } else {
      const toPt = getBoardPoint(board, to);
      if (toPt.color && toPt.color !== color && toPt.count === 1) {
        state.bar[toPt.color]++;
        board[to] = { count: 0, color: null };
      }
      board[to] = { count: (board[to]?.count || 0) + 1, color };
    }
  }

  const idx = state.usedDice.indexOf(die);
  if (idx !== -1) state.usedDice.splice(idx, 1);
  if (state.usedDice.length === 0) {
    state.turn = isWhite ? BLACK : WHITE;
    state.phase = 'roll';
    statusEl().textContent = `${state.turn === WHITE ? 'White' : 'Black'} to roll.`;
  } else {
    statusEl().textContent = `${color === WHITE ? 'White' : 'Black'}: make another move.`;
  }
  if (state.bearOff[color] === 15) {
    state.phase = 'gameover';
    state.winner = color;
  }
  render();
}

function rollDice() {
  if (state.phase === 'start') {
    let d1 = rollDie(), d2 = rollDie();
    while (d1 === d2) {
      d1 = rollDie();
      d2 = rollDie();
    }
    state.dice = [d1, d2];
    state.usedDice = d1 > d2 ? [d1, d2] : [d2, d1];
    state.turn = d1 > d2 ? WHITE : BLACK;
    state.phase = 'roll';
    statusEl().textContent = `${state.turn === WHITE ? 'White' : 'Black'} moves first. Roll dice.`;
    render();
    return;
  }
  if (state.phase !== 'roll' || state.phase === 'gameover') return;
  const d1 = rollDie(), d2 = rollDie();
  state.dice = [d1, d2];
  state.usedDice = d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];
  state.phase = 'move';
  const moves = getValidMoves(state.turn);
  if (moves.length === 0) {
    state.turn = state.turn === WHITE ? BLACK : WHITE;
    state.phase = 'roll';
    statusEl().textContent = `No moves. ${state.turn === WHITE ? 'White' : 'Black'} to roll.`;
  } else {
    statusEl().textContent = `${state.turn === WHITE ? 'White' : 'Black'}: choose a checker and then a target.`;
  }
  render();
}

function render() {
  const { board, bar, bearOff, turn, dice, usedDice, phase, winner, selectedPoint } = state;

  dice1El().textContent = dice[0] || '';
  dice2El().textContent = dice[1] || '';
  dice1El().className = 'dice' + (usedDice.indexOf(dice[0]) === -1 && dice[0] ? ' used' : '');
  dice2El().className = 'dice' + (usedDice.indexOf(dice[1]) === -1 && dice[1] ? ' used' : '');

  rollBtn().disabled = phase !== 'roll' && phase !== 'start';
  if (phase === 'start') rollBtn().textContent = 'Roll to start';
  else rollBtn().textContent = 'Roll dice';

  if (winner) {
    statusEl().textContent = `${winner === WHITE ? 'White' : 'Black'} wins!`;
  }

  usedDiceEl().textContent = phase === 'move' && usedDice.length ? `Moves left: ${usedDice.join(', ')}` : '';

  for (let p = 1; p <= 24; p++) {
    const el = $(`pt${p}`);
    if (!el) continue;
    el.className = 'point' + (Number(selectedPoint) === p ? ' highlight' : '');
    el.classList.remove('valid-target');
    const pt = getBoardPoint(board, p);
    el.innerHTML = '';
    const color = pt.color;
    const count = pt.count || 0;
    for (let i = 0; i < count; i++) {
      const checker = document.createElement('div');
      checker.className = `checker ${color}`;
      checker.dataset.point = p;
      checker.dataset.index = i;
      el.appendChild(checker);
    }
  }

  const barWhite = $('barWhite');
  const barBlack = $('barBlack');
  barWhite.innerHTML = '';
  barBlack.innerHTML = '';
  for (let i = 0; i < (bar[WHITE] || 0); i++) {
    const c = document.createElement('div');
    c.className = 'checker white';
    c.dataset.from = 'bar';
    barWhite.appendChild(c);
  }
  for (let i = 0; i < (bar[BLACK] || 0); i++) {
    const c = document.createElement('div');
    c.className = 'checker black';
    c.dataset.from = 'bar';
    barBlack.appendChild(c);
  }

  const offWhite = $('bearOffWhite');
  const offBlack = $('bearOffBlack');
  offWhite.innerHTML = '<span class="bear-off-label">White off</span>';
  offBlack.innerHTML = '<span class="bear-off-label">Black off</span>';
  for (let i = 0; i < (bearOff[WHITE] || 0); i++) {
    const c = document.createElement('div');
    c.className = 'checker white';
    offWhite.appendChild(c);
  }
  for (let i = 0; i < (bearOff[BLACK] || 0); i++) {
    const c = document.createElement('div');
    c.className = 'checker black';
    offBlack.appendChild(c);
  }

  document.querySelectorAll('.point.valid-target').forEach(el => el.classList.remove('valid-target'));
  $('bearOffWhite').classList.remove('valid-target');
  $('bearOffBlack').classList.remove('valid-target');
  if (selectedPoint != null && phase === 'move' && !winner) {
    const targets = getPossibleTargets(selectedPoint, turn);
    const hasBear = targets.some(t => t.to === 'bear');
    if (turn === WHITE && hasBear) $('bearOffWhite').classList.add('valid-target');
    if (turn === BLACK && hasBear) $('bearOffBlack').classList.add('valid-target');
    targets.forEach(({ to }) => {
      if (to !== 'bear') {
        const el = $(`pt${to}`);
        if (el) el.classList.add('valid-target');
      }
    });
  }
  $('barWhite').classList.toggle('highlight', selectedPoint === 'bar' && turn === WHITE);
  $('barBlack').classList.toggle('highlight', selectedPoint === 'bar' && turn === BLACK);
}

function handlePointClick(pointId) {
  const point = Number(pointId);
  if (isNaN(point)) return;
  const { phase, turn, selectedPoint } = state;
  if (phase !== 'move' || state.winner) return;

  const pt = getBoardPoint(state.board, point);
  const targets = selectedPoint != null ? getPossibleTargets(selectedPoint, turn) : [];

  const targetMatch = targets.find(t => t.to === point);
  if (targetMatch) {
    const from = selectedPoint === 'bar' ? 'bar' : Number(selectedPoint);
    applyMove(from, point, targetMatch.die);
    state.selectedPoint = null;
    return;
  }

  if (pt.color === turn) {
    state.selectedPoint = point;
    render();
    return;
  }
  state.selectedPoint = null;
  render();
}

function handleBarClick(color) {
  if (state.phase !== 'move' || state.turn !== color || state.bar[color] === 0) return;
  state.selectedPoint = 'bar';
  render();
}

function handleBearOffClick() {
  const { selectedPoint, turn, phase } = state;
  if (phase !== 'move' || selectedPoint == null) return;
  const targets = getPossibleTargets(selectedPoint, turn);
  const bearTarget = targets.find(t => t.to === 'bear');
  if (!bearTarget) return;
  applyMove(selectedPoint === 'bar' ? 'bar' : Number(selectedPoint), 'bear', bearTarget.die);
  state.selectedPoint = null;
}

document.addEventListener('DOMContentLoaded', () => {
  render();

  rollBtn().addEventListener('click', rollDice);

  document.querySelectorAll('.point').forEach(el => {
    el.addEventListener('click', (e) => {
      const point = e.target.closest('.point');
      if (point) handlePointClick(point.dataset.point);
    });
  });

  $('barWhite').addEventListener('click', (e) => {
    if (e.target.classList.contains('checker')) handleBarClick(WHITE);
  });
  $('barBlack').addEventListener('click', (e) => {
    if (e.target.classList.contains('checker')) handleBarClick(BLACK);
  });

  $('bearOffWhite').addEventListener('click', () => {
    if (state.selectedPoint != null && state.turn === WHITE) handleBearOffClick();
  });
  $('bearOffBlack').addEventListener('click', () => {
    if (state.selectedPoint != null && state.turn === BLACK) handleBearOffClick();
  });
});
