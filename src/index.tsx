ReactDOM.render(<Hello />, document.getElementById("root"));

const T = true;
const F = false;

// http://venturebeat.com/community/2009/08/24/picross-does-what-sudontku/
const puzzle = new Picross.Puzzle();
puzzle.rowRules = [
    [2],
    [4],
    [2, 2],
    [2, 2],
    [2, 2, 2],
    [1, 2, 1],
    [1, 2, 1],
    [1, 2, 2, 1],
    [1, 2, 2, 1],
    [1, 2, 1]
];
puzzle.colRules = [
    [6],
    [2],
    [2, 2],
    [2, 2, 2],
    [2, 2],
    [2],
    [2, 4],
    [2, 4],
    [2],
    [6]
];

const solver = new Picross.Solver(puzzle);
while(true) {
    const line: Picross.Line = solver.step();
    if (line) {
        console.log(`${line.isRow ? 'r' : 'c'}-${line.index}`);
        console.log(solver.getPartial().toString());
    } else {
        break;
    }
};

const solution = solver.getSolution();
console.log(solution.toString());
console.log(Picross.Validate(puzzle, solution));
