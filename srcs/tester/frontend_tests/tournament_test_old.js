var { fillRound, getLevel } = require('../frontend/tournament_algorithm.js');


let players = ["1", "2"];
test('fillRound with correct number of players', () => {

    expect(Object.keys(fillRound(players))).toHaveLength(1);
    players.push("3");
    players.push("4");
    expect(Object.keys(fillRound(players))).toHaveLength(2);
    players.push("5");
    players.push("6");
    expect(Object.keys(fillRound(players))).toHaveLength(3);
    players.push("7");
    players.push("8");
    expect(Object.keys(fillRound(players))).toHaveLength(4);
})


test('testing fillRound with 0 or more than 8 players', () => {
    players = ["1","2","3","4","5","6","7","8"];
    players.push("9");
    expect(() => fillRound(players)).toThrow("Invalid players array size");
    expect(() => fillRound([])).toThrow("Invalid players array size");
    expect(() => fillRound(["1"])).toThrow("Invalid players array size");
});


test('fillRound odd number of players', () => {
    players = ["1"];
    expect(() => fillRound(players)).toThrow("Invalid players array size");
    players.push("3");
    players.push("4");
    expect(Object.keys(fillRound(players))).toHaveLength(2);
    players.push("5");
    players.push("6");
    expect(Object.keys(fillRound(players))).toHaveLength(3);
    players.push("7");
    players.push("8");
    expect(Object.keys(fillRound(players))).toHaveLength(4);
})

test('repeated player', () => {
    players = ["1"];
    expect(() => fillRound(players)).toThrow("Invalid players array size");
    players.push("4");
    players.push("4");
    expect(() => fillRound(players)).toThrow("Repeated player!");
    players = ["1", "1", "2", "3" ]
    expect(() => fillRound(players)).toThrow("Repeated player!");
    
})

test('getLevel of the tournament start', ()=> {
    players = ["1","2","3","4","5","6","7","8"];
    expect(getLevel(fillRound(players))).toBe(3);
    players = ["1","2","3","4","5","6","7"];
    expect(getLevel(fillRound(players))).toBe(3);
    players = ["1","2","3","4","5","6"];
    expect(getLevel(fillRound(players))).toBe(3);
    players = ["1","2","3","4","5"];
    expect(getLevel(fillRound(players))).toBe(3);
    players = ["1","2","3","4"];
    expect(getLevel(fillRound(players))).toBe(2);
    players = ["1","2","3"];
    expect(getLevel(fillRound(players))).toBe(2);
    players = ["1","2"];
    expect(getLevel(fillRound(players))).toBe(1);
    players = ["1"];
    expect(() => getLevel(fillRound(players))).toThrow("Invalid players array size");
    expect(() => getLevel({})).toThrow("incorrect number of matches in the round");
    players = ["1","2","3","4","5","6","7","8", "9", "10"];
    expect(() => getLevel(fillRound(players))).toThrow("Invalid players array size");
})