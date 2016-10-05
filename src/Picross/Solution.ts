namespace Picross {
    export class Solution {
        private rows: boolean[][];
        
        constructor(rows: boolean[][]) {
            this.rows = rows;
        }
        
        getRow(index: number): boolean[] {
            return this.rows[index];
        }
        
        getRows(): boolean[][] {
            return this.rows;
        }
        
        getCol(index: number): boolean[] {
            return this.rows.map(row => row[index]);
        }
        
        getCols(): boolean[][] {
            return _.range(this.rows[0].length).map(index => this.getCol(index));
        }
        
        toString(): string {
            return this.rows.map(rowToString).join('\n');
        }
    }
    
    function rowToString(row: boolean[]): string {
        return row.map(cell => cell ? 'X' : ' ').join('');
    }
}