namespace Util {
    export function stringify2dArray<T>(rows: T[][], delimiter: string, map?: (value: T) => string): string {
        return rows
            .map(row => (map ? row.map(map) : row).join(delimiter))
            .join('\n');
    }
    
    export function filledArray<T>(length: number, value: T): T[] {
        return _.range(length).map(() => value);
    }
    
    export function filled2dArray<T>(rowCount: number, colCount: number, value: T): T[][] {
        return _.range(rowCount).map(() => filledArray(colCount, value));
    }
    
    export function getCols<T>(rows: T[][]): T[][] {
        return _.range(rows[0].length).map(colIndex => getCol(rows, colIndex));
    }
    
    export function getCol<T>(rows: T[][], colIndex: number): T[] {
        return rows.map(row => row[colIndex]);
    }
    
    export function setCol<T>(rows: T[][], colIndex: number, col: T[]): void {
        col.forEach((value: T, index: number) => rows[index][colIndex] = value);
    }
}
