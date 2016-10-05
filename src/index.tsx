ReactDOM.render(<Hello />, document.getElementById("root"));

const puzzle = new Picross.Puzzle();
puzzle.rowRules = [[2],[1]];
puzzle.colRules = [[2],[1]];

const T = true;
const F = false;
console.log(Picross.Validate(puzzle, new Picross.Solution([[T, T],[T, F]])));
console.log(Picross.Validate(puzzle, new Picross.Solution([[T, F],[T, F]])));