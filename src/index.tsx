ReactDOM.render(<Hello />, document.getElementById("root"));

const T = true;
const F = false;

// http://venturebeat.com/community/2009/08/24/picross-does-what-sudontku/
const puzzle = new Picross.Puzzle();
puzzle.rowRules = [
    [4, 4],
    [6, 6],
    [6, 6],
    [6, 6],
    [6, 6],
    [4, 4],
    [10, 10],
    [12, 12],
    [12, 12],
    [12, 12],
    [12, 12],
    [12, 12],
    [12, 12],
    [1, 8, 1, 1, 8, 1],
    [3, 3, 3, 3],
    [3, 3, 3, 3],
    [3, 3, 3, 3],
    [3, 3, 3, 3],
    [3, 3, 3, 3],
    [3, 3, 3, 3]
];
puzzle.colRules = [
    [0],
    [7],
    [7],
    [14],
    [4, 14],
    [20],
    [14],
    [14],
    [20],
    [4, 14],
    [14],
    [7],
    [7],
    [0],
    [0],
    [0],
    [0],
    [7],
    [7],
    [14],
    [4, 14],
    [20],
    [14],
    [14],
    [20],
    [4, 14],
    [14],
    [7],
    [7],
    [0]
];

const solver = new Picross.Solver(puzzle);
while(true) {
    const line: Picross.Line = solver.step();
    if (line) {
        console.log(line);
        console.log(solver.getPartial().toString());
    } else {
        break;
    }
};

const solution = solver.getSolution();
console.log(solution.toString());
console.log(Picross.Validate(puzzle, solution));
