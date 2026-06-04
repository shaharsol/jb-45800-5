(function () {
  "use strict";

  const parseInteger = (x) => Number.parseInt(x, 10);
  const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const isHumanTurn = (state) => state.turn === "human";
  const isAiTurn = (state) => state.turn === "ai";

  const OPENAI_MODEL = "gpt-4.5";

  let apiKey = "";
  let gameState = null;

  const getPointIndexFromPointNumber = (pointNum) => pointNum - 1;
  const getPointNumberFromIndex = (index) => index + 1;

  const initialPoints = () => {
    const pts = Array.from({ length: 24 }, () => 0);
    pts[getPointIndexFromPointNumber(24)] = 2;
    pts[getPointIndexFromPointNumber(13)] = 5;
    pts[getPointIndexFromPointNumber(8)] = 3;
    pts[getPointIndexFromPointNumber(6)] = 5;
    pts[getPointIndexFromPointNumber(1)] = -2;
    pts[getPointIndexFromPointNumber(12)] = -5;
    pts[getPointIndexFromPointNumber(17)] = -3;
    pts[getPointIndexFromPointNumber(19)] = -5;
    return pts;
  };

  const createInitialState = () => ({
    points: initialPoints(),
    barHuman: 0,
    barAi: 0,
    turn: "human",
    dice: [],
    remainingDice: [],
    phase: "roll",
    isGameOver: false,
  });

  const getPointEl = (pointIndex) => document.querySelector(`[data-point-index="${pointIndex}"]`);
  const getBarTopEl = () => document.getElementById("bar-top");
  const getBarBottomEl = () => document.getElementById("bar-bottom");
  const getStatusEl = () => document.getElementById("status");
  const getMovePromptText = () => document.getElementById("move-prompt-text");
  const getRollBtn = () => document.getElementById("roll-btn");
  const getApiKeyInput = () => document.getElementById("api-key-input");
  const getApiKeyError = () => document.getElementById("api-key-error");
  const getApiKeyModal = () => document.getElementById("api-key-modal");
  const getGameContainer = () => document.getElementById("game-container");
  const getPointsContainer = () => document.getElementById("points-container");
  const getHumanDiceEl = () => document.getElementById("human-dice");
  const getAiDiceEl = () => document.getElementById("ai-dice");

  const renderPoint = (pointIndex, value, isTop, isLight) => {
    const pointNum = getPointNumberFromIndex(pointIndex);
    const column = document.createElement("div");
    column.className = `point-column ${isTop ? "top" : "bottom"} ${isLight ? "light" : "dark"}`;
    column.dataset.pointIndex = String(pointIndex);

    const triangle = document.createElement("div");
    triangle.className = "point-triangle";

    const stack = document.createElement("div");
    stack.className = "checkers-stack";

    const count = Math.abs(value);
    const isHumanPoint = value > 0;
    Array.from({ length: count }).forEach((_, i) => {
      const checker = document.createElement("div");
      checker.className = `checker ${isHumanPoint ? "human" : "ai"}`;
      checker.dataset.pointIndex = String(pointIndex);
      checker.dataset.checkerIndex = String(i);
      if (isHumanPoint) checker.setAttribute("draggable", "true");
      stack.appendChild(checker);
    });

    triangle.appendChild(stack);
    column.appendChild(triangle);
    return column;
  };

  const renderBar = (state) => {
    const topEl = getBarTopEl();
    const bottomEl = getBarBottomEl();
    const clearChildren = (el) => {
      while (el.firstChild) el.removeChild(el.firstChild);
    };
    clearChildren(topEl);
    clearChildren(bottomEl);
    Array.from({ length: state.barAi }).forEach(() => {
      const c = document.createElement("div");
      c.className = "checker ai";
      topEl.appendChild(c);
    });
    Array.from({ length: state.barHuman }).forEach(() => {
      const c = document.createElement("div");
      c.className = "checker human";
      c.setAttribute("draggable", "true");
      bottomEl.appendChild(c);
    });
  };

  const renderBoard = (state) => {
    const container = getPointsContainer();
    container.innerHTML = "";
    const isLight = (i) => (Math.floor(i / 6) + (i >= 12 ? 0 : 1)) % 2 === 0;
    const columnIndices = Array.from({ length: 12 }, (_, i) => i);
    columnIndices.forEach((colIndex) => {
      const topPointIndex = 23 - colIndex;
      const bottomPointIndex = 11 - colIndex;
      const wrapper = document.createElement("div");
      wrapper.className = "point-column-wrapper";
      wrapper.dataset.columnIndex = String(colIndex);
      const topCol = renderPoint(topPointIndex, state.points[topPointIndex], true, isLight(topPointIndex));
      const bottomCol = renderPoint(bottomPointIndex, state.points[bottomPointIndex], false, isLight(bottomPointIndex));
      wrapper.appendChild(topCol);
      wrapper.appendChild(bottomCol);
      container.appendChild(wrapper);
    });
    renderBar(state);
  };

  const renderDice = (diceEl, dice, usedIndices) => {
    diceEl.innerHTML = "";
    dice.forEach((value, i) => {
      const die = document.createElement("div");
      die.className = "die" + (usedIndices.includes(i) ? " used" : "");
      die.textContent = value;
      diceEl.appendChild(die);
    });
  };

  const updateStatus = (text) => {
    const el = getStatusEl();
    if (el) el.textContent = text;
  };

  const updateMovePrompt = (text) => {
    const el = getMovePromptText();
    if (el) el.textContent = text;
  };

  const getLegalMovesForHuman = (state) => {
    const moves = [];
    const fromBar = state.barHuman > 0;
    const dists = state.remainingDice;

    const canLand = (pointIndex) => {
      const v = state.points[pointIndex];
      if (v >= 0) return true;
      return v === -1;
    };

    const addMove = (from, to, steps) => {
      if (dists.includes(steps) && to >= 0 && to <= 23 && canLand(to)) moves.push({ from, to, steps });
    };

    if (fromBar) {
      state.remainingDice.forEach((steps) => {
        const pointNum = 25 - steps;
        if (pointNum >= 1 && pointNum <= 24 && canLand(getPointIndexFromPointNumber(pointNum))) {
          addMove("bar", getPointIndexFromPointNumber(pointNum), steps);
        }
      });
    }

    state.points.forEach((value, fromIndex) => {
      if (value <= 0) return;
      state.remainingDice.forEach((steps) => {
        const toIndex = fromIndex - steps;
        addMove(fromIndex, toIndex, steps);
      });
    });

    return moves;
  };

  const applyHumanMove = (state, from, to, steps) => {
    const next = {
      points: state.points.slice(),
      barHuman: state.barHuman,
      barAi: state.barAi,
      turn: state.turn,
      dice: state.dice.slice(),
      remainingDice: [],
      phase: state.phase,
      isGameOver: state.isGameOver,
    };

    if (from === "bar") {
      next.barHuman -= 1;
    } else {
      next.points[from] = next.points[from] - 1;
    }

    if (next.points[to] === -1) {
      next.barAi += 1;
      next.points[to] = 0;
    }
    next.points[to] = (next.points[to] || 0) + 1;

    const remaining = state.remainingDice.slice();
    const idx = remaining.indexOf(steps);
    if (idx !== -1) remaining.splice(idx, 1);
    next.remainingDice = remaining;

    if (remaining.length === 0) {
      next.turn = "ai";
      next.phase = "roll";
      next.dice = [];
      next.remainingDice = [];
    }

    return next;
  };

  const findCheckerElement = (pointIndex, checkerIndex) => {
    const pointEl = getPointEl(pointIndex);
    if (!pointEl) return null;
    const stack = pointEl.querySelector(".checkers-stack");
    if (!stack) return null;
    return stack.children[checkerIndex] || null;
  };

  const setupDragAndDrop = (state) => {
    const setDraggable = (checkerEl, canDrag) => {
      if (!checkerEl) return;
      checkerEl.classList.toggle("draggable", canDrag);
      checkerEl.classList.toggle("not-draggable", !canDrag);
    };

    const legalMoves = getLegalMovesForHuman(state);
    const isFromBar = state.barHuman > 0;
    const possibleFroms = isFromBar
      ? ["bar"]
      : state.points
          .map((v, i) => (v > 0 ? i : null))
          .filter((x) => x !== null);

    const canMoveFrom = (from) => {
      const hasMove = legalMoves.some((m) => (from === "bar" ? m.from === "bar" : m.from === from));
      return hasMove;
    };

    document.querySelectorAll(".checker.human").forEach((el) => {
      const pointIndex = el.dataset.pointIndex != null ? parseInteger(el.dataset.pointIndex) : null;
      const from = pointIndex != null ? pointIndex : "bar";
      setDraggable(el, canMoveFrom(from));
    });

    const onDragStart = (e) => {
      const from = e.target.dataset.pointIndex != null ? parseInteger(e.target.dataset.pointIndex) : "bar";
      if (!canMoveFrom(from)) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("application/json", JSON.stringify({ from }));
      e.target.classList.add("dragging");
    };

    const onDragEnd = (e) => {
      e.target.classList.remove("dragging");
    };

    const onDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };

    const onDrop = (e) => {
      e.preventDefault();
      const toPointEl = e.target.closest(".point-column");
      const toBarBottom = e.target.closest("#bar-bottom");
      if (!toPointEl && !toBarBottom) return;

      let raw;
      try {
        raw = e.dataTransfer.getData("application/json");
      } catch (_) {
        return;
      }
      if (!raw) return;
      const { from } = JSON.parse(raw);

      let toIndex = null;
      if (toPointEl) toIndex = parseInteger(toPointEl.dataset.pointIndex);
      if (toIndex == null) return;

      const fromIndex = from === "bar" ? null : from;
      const steps =
        from === "bar"
          ? 24 - getPointNumberFromIndex(toIndex)
          : fromIndex - toIndex;

      if (steps <= 0) return;
      if (!state.remainingDice.includes(steps)) return;

      const legalMovesAfter = getLegalMovesForHuman(state);
      const isLegal = legalMovesAfter.some(
        (m) =>
          m.from === from &&
          m.to === toIndex &&
          m.steps === steps
      );
      if (!isLegal) return;

      gameState = applyHumanMove(state, from, toIndex, steps);
      renderBoard(gameState);
      updateMovePrompt(
        gameState.remainingDice.length > 0
          ? `Use one die: ${gameState.remainingDice.join(" or ")}. Make a second move.`
          : "Move complete. AI's turn."
      );
      renderDice(getHumanDiceEl(), gameState.dice, getUsedDiceIndices(gameState));
      if (gameState.remainingDice.length === 0) {
        getRollBtn().disabled = true;
        runAiTurn();
      } else {
        setupDragAndDrop(gameState);
      }
    };

    document.querySelectorAll(".checker.human").forEach((el) => {
      el.removeEventListener("dragstart", onDragStart);
      el.removeEventListener("dragend", onDragEnd);
      el.addEventListener("dragstart", onDragStart);
      el.addEventListener("dragend", onDragEnd);
    });

    getPointsContainer().querySelectorAll(".point-column").forEach((col) => {
      col.removeEventListener("dragover", onDragOver);
      col.removeEventListener("drop", onDrop);
      col.addEventListener("dragover", onDragOver);
      col.addEventListener("drop", onDrop);
    });
    const barBottom = getBarBottomEl();
    if (barBottom) {
      barBottom.removeEventListener("dragover", onDragOver);
      barBottom.removeEventListener("drop", onDrop);
      barBottom.addEventListener("dragover", onDragOver);
      barBottom.addEventListener("drop", onDrop);
    }
  };

  const getUsedDiceIndices = (state) => {
    const used = [];
    const remaining = state.remainingDice.slice();
    state.dice.forEach((d, i) => {
      const idx = remaining.indexOf(d);
      if (idx !== -1) {
        remaining.splice(idx, 1);
      } else {
        used.push(i);
      }
    });
    return used;
  };

  const humanRoll = () => {
    if (!gameState || gameState.turn !== "human" || gameState.phase !== "roll") return;
    const d1 = randomBetween(1, 6);
    const d2 = randomBetween(1, 6);
    const dice = d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];
    gameState = {
      ...gameState,
      dice,
      remainingDice: d1 === d2 ? [d1, d1, d1, d1] : [d1, d2],
      phase: "move",
    };
    renderDice(getHumanDiceEl(), gameState.dice, []);
    updateStatus("Your turn. Make two moves (one per die).");
    updateMovePrompt(`Move first with ${gameState.remainingDice[0]}, then with ${gameState.remainingDice[1]}.`);
    getRollBtn().disabled = true;
    setupDragAndDrop(gameState);
  };

  const stateToFen = (state) => {
    const pts = state.points
      .map((v, i) => {
        const n = getPointNumberFromIndex(i);
        if (v > 0) return `${n}W${v}`;
        if (v < 0) return `${n}B${Math.abs(v)}`;
        return null;
      })
      .filter((x) => x != null);
    const bar = [];
    if (state.barHuman > 0) bar.push(`barW${state.barHuman}`);
    if (state.barAi > 0) bar.push(`barB${state.barAi}`);
    return pts.concat(bar).join(" ");
  };

  const askOpenAIForMove = async (state) => {
    const fen = stateToFen(state);
    const diceStr = state.dice.join(",");
    const system = `You are a backgammon expert. Reply with a JSON array of moves only. Each move: {"from": point number 1-24 or "bar", "to": point number 1-24, "steps": number}.
White (W) moves from high to low points. Black (B) moves from low to high. Hit single opponent checker (blot) by landing on it.
Current board (point: W/B count): ${fen}
Dice: ${diceStr}
Return exactly one JSON array of moves, e.g. [{"from":8,"to":2,"steps":6},{"from":6,"to":5,"steps":1}]. No other text.`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: "user", content: system }],
        max_tokens: 200,
      }),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || response.statusText);
    }
    const data = await response.json();
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? data.choices[0].message.content.trim()
      : "";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const moves = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    return moves;
  };

  const applyAiMove = (state, move) => {
    const from = move.from === "bar" ? "bar" : getPointIndexFromPointNumber(move.from);
    const to = getPointIndexFromPointNumber(move.to);
    const steps = move.steps;

    const next = {
      points: state.points.slice(),
      barHuman: state.barHuman,
      barAi: state.barAi,
      turn: state.turn,
      dice: state.dice.slice(),
      remainingDice: state.remainingDice.slice(),
      phase: state.phase,
      isGameOver: state.isGameOver,
    };

    if (from === "bar") {
      next.barAi -= 1;
    } else {
      next.points[from] = next.points[from] + 1;
    }

    if (next.points[to] === 1) {
      next.barHuman += 1;
      next.points[to] = 0;
    }
    next.points[to] = (next.points[to] || 0) - 1;

    next.remainingDice = state.remainingDice.slice();
    const ridx = next.remainingDice.indexOf(steps);
    if (ridx !== -1) next.remainingDice.splice(ridx, 1);

    return next;
  };

  const runAiTurn = async () => {
    if (!gameState || gameState.turn !== "ai") return;
    updateStatus("AI is thinking...");
    getRollBtn().disabled = true;

    const roll = () => {
      const d1 = randomBetween(1, 6);
      const d2 = randomBetween(1, 6);
      return d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];
    };

    const rolled = roll();
    let state = {
      ...gameState,
      dice: rolled,
      remainingDice: rolled.slice(),
    };

    renderDice(getAiDiceEl(), state.dice, []);

    try {
      const moves = await askOpenAIForMove(state);
      const applyNext = (s, movesLeft) => {
        if (movesLeft.length === 0) return s;
        const m = movesLeft[0];
        const steps = m.steps;
        if (!s.remainingDice.includes(steps)) return applyNext(s, movesLeft.slice(1));
        const nextState = applyAiMove(s, m);
        return applyNext(nextState, movesLeft.slice(1));
      };
      state = applyNext(state, moves);
    } catch (err) {
      updateStatus("AI move failed: " + err.message);
    }

    state.turn = "human";
    state.phase = "roll";
    state.dice = [];
    state.remainingDice = [];
    gameState = state;

    renderBoard(gameState);
    getAiDiceEl().innerHTML = "";
    updateStatus("Your turn. Roll the dice.");
    updateMovePrompt("");
    getRollBtn().disabled = false;
  };

  const initGame = () => {
    gameState = createInitialState();
    renderBoard(gameState);
    updateStatus("Your turn. Roll the dice.");
    updateMovePrompt("");
    getRollBtn().disabled = false;
    getHumanDiceEl().innerHTML = "";
    getAiDiceEl().innerHTML = "";

    getRollBtn().addEventListener("click", () => {
      humanRoll();
    });
  };

  const showGame = () => {
    getApiKeyModal().classList.add("hidden");
    getGameContainer().classList.remove("hidden");
    initGame();
  };

  const getApiKeySubmit = () => document.getElementById("api-key-submit");

  getApiKeySubmit().addEventListener("click", () => {
    const input = getApiKeyInput();
    const key = input.value.trim();
    const errEl = getApiKeyError();
    if (!key) {
      errEl.textContent = "Please enter an API key.";
      return;
    }
    apiKey = key;
    errEl.textContent = "";
    showGame();
  });

  getApiKeyInput().addEventListener("keydown", (e) => {
    if (e.key === "Enter") getApiKeySubmit().click();
  });
})();
