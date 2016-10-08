namespace Picross {
    export class Solver {
        puzzle: Puzzle;
        
        private rowCount: number;
        private colCount: number;
        
        private partial: PartialSolution;
        private lineChangeCounts: LineChangeCounts;
        
        constructor (puzzle: Puzzle) {
            this.puzzle = puzzle;
            
            this.rowCount = puzzle.rowRules.length;
            this.colCount = puzzle.colRules.length;
            
            this.partial = new PartialSolution(this.rowCount, this.colCount);
            this.lineChangeCounts = new LineChangeCounts(this.rowCount, this.colCount, 1);
        }
        
        getPartial(): PartialSolution {
            return this.partial;
        }
        
        getSolution(): Solution {
            return new Solution(this.partial.getRows()
                .map(partialRow => partialRow.map(partialValue => partialValue === YES)));
        }
        
        step(): Line {
            let changedLine: Line = null;
            while (!changedLine) {
                const line: Line = this.lineChangeCounts.getMax();
                if (this.lineChangeCounts.getCount(line) === 0) {
                    break;
                }
                const partialLine = this.partial.getLine(line);
                const updatedPartial = calcUpdatedPartial(partialLine, this.puzzle.getRules(line));
                if (updatedPartial) {
                    updatedPartial.forEach((value, index) => {
                        if (value !== partialLine[index]) {
                            changedLine = line;
                            this.lineChangeCounts.incCount({ isRow: !line.isRow, index });
                        }
                    });
                    if (changedLine) {
                        this.partial.setLine(line, updatedPartial);
                    }
                }
                this.lineChangeCounts.setCount(line, 0);
            }
            
            return changedLine;
        }
    }
    
    class LineChangeCounts {
        private rowCount: number;
        private colCount: number;
        
        private counts: number[];
        
        constructor(rowCount: number, colCount: number, initialValue: number) {
            this.rowCount = rowCount;
            this.colCount = colCount;
            
            this.counts = Util.filledArray(rowCount + colCount, initialValue);
        }
        
        getCount(line: Line): number {
            return this.counts[this.getOffset(line)];
        }
        
        setCount(line: Line, count: number): void {
            this.counts[this.getOffset(line)] = count;
        }
        
        incCount(line: Line): void {
            this.counts[this.getOffset(line)]++;
        }
        
        getMax(): Line {
            return _.maxBy(Line.getLines(this.rowCount, this.colCount), line => this.getCount(line));
        }
        
        private getOffset(line: Line) {
            return line.isRow ? line.index : this.rowCount + line.index;
        }
    }
    
    const YES = 1;
    const MAYBE = 0;
    const NO = -1;
    
    class PartialSolution {
        private rows: number[][];
        
        constructor(rowCount: number, colCount: number) {
            this.rows = Util.filled2dArray(rowCount, colCount, MAYBE);
        }
        
        getRows(): number[][] {
            return this.rows;
        }
        
        getCols(): number[][] {
            return Util.getCols(this.rows);
        }
        
        getLine(line: Line): number[] {
            return Line.getLine(this.rows, line);
        }
        
        setLine(line: Line, partialLine: number[]): void {
            Line.setLine(this.rows, line, partialLine);
        }
        
        toString(): string {
            return Util.stringify2dArray(this.rows, '', cell => cell === YES ? '+' : cell === NO ? '-' : ' ');
        }
    }
    
    interface SearchNode {
        ruleIndex: number;
        cellIndex: number;
        
        parent: SearchNode;
    }
    
    function calcUpdatedPartial(partial: number[], rules: number[]): number[] {
        if (rules.length === 0 || rules[0] === 0) {
            return Util.filledArray(partial.length, NO); // The row is known to be blank
        }
        
        // Perform depth first search for all possible layouts that match the rules and the current partial
        // Keep track of how often each cell is ON vs OFF in those possibilities
        //      If it is always on, update the partial to YES
        //      If it is always off, update the partial to NO
        //      If it is a mixture, keep the partial at MAYBE
        
        let possibilityCount = 0;
        const cellPossibilityCounts = Util.filledArray(partial.length, 0);
        
        const openList: SearchNode[] = nextNodes(partial, rules, null);
        while(openList.length > 0) {
            const node = openList.pop();
            if (node.ruleIndex === rules.length - 1) {
                updateCellPossibilityCounts(cellPossibilityCounts, buildPossibility(partial.length, node, rules));
                possibilityCount++;
            } else {
                openList.push(...nextNodes(partial, rules, node));
            }
        }
        
        if (possibilityCount === 0) {
            return null; // The rules cannot be satisfied with the current partial
        }
        
        return cellPossibilityCounts.map((count: number) => {
            switch(count) {
                case 0:
                    return NO;
                case possibilityCount:
                    return YES;
                default:
                    return MAYBE;
            }
        });
    }
    
    function updateCellPossibilityCounts(cellPossibilityCounts: number[], possibility: boolean[]): void {
        possibility.forEach((cell: boolean, index: number) => {
            if (cell) {
                cellPossibilityCounts[index]++;
            }
        });
    }
    
    function nextNodes(partial: number[], rules: number[], parent: SearchNode): SearchNode[] {
        const nextRuleIndex = parent ? parent.ruleIndex + 1 : 0;
        const nextCellIndexStart = parent ? parent.cellIndex + rules[parent.ruleIndex] + 1 : 0;
        
        const remainingRules = rules.slice(nextRuleIndex);
        const minCellsForRemainingRules = _.sum(remainingRules) + remainingRules.length - 1;
        const nextCellIndexEnd = partial.length - minCellsForRemainingRules + 1;
        
        const possibleNodes: SearchNode[] = _.range(nextCellIndexStart, nextCellIndexEnd).map(cellIndex => {
            return {
                ruleIndex: nextRuleIndex,
                cellIndex,
                parent
            };
        });
        
        return possibleNodes.filter(node => canPlaceRule(partial, rules[nextRuleIndex], nextCellIndexStart, node.cellIndex));
    }
    
    function buildPossibility(length: number, node: SearchNode, rules: number[]): boolean[] {
        const possibility = Util.filledArray<boolean>(length, false);
        while (node) {
            const rule = rules[node.ruleIndex];
            possibility.splice(node.cellIndex, rule, ...Util.filledArray(rule, true));
            node = node.parent;
        }
        return possibility;
    }
    
    function canPlaceRule(partial: number[], rule: number, offsStart: number, ruleStart: number): boolean {
        return canBeOffs(partial, offsStart, ruleStart) &&
            canBeOns(partial, ruleStart, ruleStart + rule) &&
            canBeOff(partial, ruleStart + rule);
    }
    
    function canBeOns(partial: number[], start: number, end: number) {
        return _.every(_.range(start, end), index => canBeOn(partial, index));
    }
    
    function canBeOn(partial: number[], index: number): boolean {
        return index < partial.length && (partial[index] === MAYBE || partial[index] === YES);
    }
    
    function canBeOffs(partial: number[], start: number, end: number) {
        return _.every(_.range(start, end), index => canBeOff(partial, index));
    }
    
    function canBeOff(partial: number[], index: number): boolean {
        return index >= partial.length || partial[index] === MAYBE || partial[index] === NO;
    }
}
