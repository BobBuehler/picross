namespace Picross {
    export function Validate(puzzle: Puzzle, solution: Solution): boolean {
        // assume sizes match
        
        return _.every(solution.getRows(), (row, index) => lineValidate(row, puzzle.rowRules[index])) &&
            _.every(solution.getCols(), (col, index) => lineValidate(col, puzzle.colRules[index]))
    }
    
    function lineValidate(line: boolean[], rules: number[]): boolean {
        return _.isEqual(lineToRules(line), rules);
    }
    
    function lineToRules(line: boolean[]): number[] {
        const rules: number[] = [];
        let counter = 0;
        
        line.forEach(cell => {
            if (cell) {
                counter++;
            } else if (counter) {
                rules.push(counter);
                counter = 0;
            }
        });
        
        if (counter) {
            rules.push(counter);
        }
        
        return rules;
    }
}