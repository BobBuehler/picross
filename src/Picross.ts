
export enum CellState {
    Empty,
    No,
    Yes
}

export class Game {
    rowRules: number[][];
    colRules: number[][];
    cells: CellState[][];
    
    constructor (rowRules: number[][], colRules: number[][]) {
        this.rowRules = rowRules;
        this.colRules = colRules;
        this.cells = [];
        
        for (let r = 0; r < rowRules.length; ++r) {
            const row: CellState[] = [];
            for (let c = 0; c < colRules.length; ++c) {
                row[c] = CellState.Empty;
            }
            this.cells[r] = row;
        }
    }
    
    setCell(row: number, col: number, state: CellState) {
        this.cells[row][col] = state;
    }
}
