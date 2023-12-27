var {fillRound} = require('../frontend/tournament_algorithm.js');

let players = ["1","2","3","4","5","6","7","8"];

test('testing fillRound with 8 players', () => {
    expect(fillRound(players)).toBe(players);
    players.push("9");
    expect(() => fillRound(players)).toThrow("Invalid players array size");
    expect(() => fillRound([])).toThrow("Invalid players array size");
});

