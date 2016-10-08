namespace Picross {
    export interface Line {
        isRow: boolean;
        index: number;
    }
    
    export module Line {
        export function getLines(rowCount: number, colCount: number): Line[] {
            return _.range(rowCount).map(index => { return { isRow: true, index }; })
                .concat(_.range(colCount).map(index => { return { isRow: false, index }; }));
        }
        
        export function getLine<T>(rows: T[][], line: Line): T[] {
            if (line.isRow) {
                return rows[line.index];
            } else {
                return Util.getCol(rows, line.index);
            }
        }
        
        export function setLine<T>(rows: T[][], line: Line, lineValues: T[]): void {
            if (line.isRow) {
                rows[line.index] = lineValues;
            } else {
                Util.setCol(rows, line.index, lineValues);
            }
        }
    }
}