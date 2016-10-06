namespace Picross {
    export function Solve(puzzle: Puzzle): Solution {
        const partialRows: number[][] = _.range(puzzle.rowRules.length).map(() => Util.filledArray(puzzle.colRules.length, MAYBE));
        let changed = true;
        let failed = false;
        while (changed && !failed && !_.every(partialRows, partialIsSolved)) {
            changed = false;
            partialRows.forEach((partial: number[], index: number) => {
                const updatedPartial = calcUpdatedPartial(partial, puzzle.rowRules[index]);
                if (updatedPartial === null) {
                    failed = true;
                } else if (!_.isEqual(partial, updatedPartial)) {
                    partialRows[index] = updatedPartial;
                    changed = true;
                }
            });
            
            Util.getCols(partialRows).forEach((partial: number[], index: number) => {
                const updatedPartial = calcUpdatedPartial(partial, puzzle.colRules[index]);
                if (updatedPartial === null) {
                    failed = true;
                } else if (!_.isEqual(partial, updatedPartial)) {
                    Util.setCol(partialRows, index, updatedPartial);
                    changed = true;
                }
            });
        }
        
        if (failed) {
            return null;
        }
        if (changed) {
            return new Solution(partialRows.map(partial => partial.map(cell => cell === YES)));
        }
        return null;
    }
    
    const YES = 1;
    const MAYBE = 0;
    const NO = -1;
        
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
    
    function partialIsSolved(partial: number[]) {
        return _.every(partial, cell => cell !== MAYBE);
    }
    
    function partialRowsToString(partialRows: number[][]): string {
        return Util.stringify2dArray(partialRows, '', cell => cell === YES ? '+' : cell === NO ? '-' : ' ');
    }
}
