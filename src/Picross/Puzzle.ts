namespace Picross {
    export class Puzzle {
        rowRules: number[][];
        colRules: number[][];
        
        getRules(line: Line): number[] {
            if (line.isRow) {
                return this.rowRules[line.index];
            } else {
                return this.colRules[line.index];
            }
        }
    }
}