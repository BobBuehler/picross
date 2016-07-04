import * as _ from "lodash";
import * as React from "react";

import { Game, CellState} from '../Picross';
import { Grid } from './Grid';

export interface PicrossGridProps {
    game: Game;
}

interface GameMetrics {
    rows: number;
    cols: number;
    maxRowRules: number;
    maxColRules: number;
}

export class PicrossGrid extends React.Component<PicrossGridProps, {}> {
    
    render(): React.ReactElement<any> {
        const metrics = this.calcMetrics();
        
        return <Grid rowCount={metrics.rows + metrics.maxRowRules} colCount={metrics.cols + metrics.maxColRules} getCell={(r, c) => this.renderCell(metrics, r, c)} />;
    }
    
    calcMetrics(): GameMetrics {
        const game = this.props.game;
        return {
            rows: game.rowRules.length,
            cols: game.colRules.length,
            maxRowRules: Math.max(...game.rowRules.map(rules => rules.length)) || 1,
            maxColRules: Math.max(...game.colRules.map(rules => rules.length)) || 1
        }
    }

    renderCell(metrics: GameMetrics, row: number, col: number): React.ReactNode {
        if (row < metrics.maxColRules) {
            if (col < metrics.maxRowRules) {
                return this.renderOutter();
            } else {
                return this.renderRule(this.props.game.colRules[col - metrics.maxRowRules], metrics.maxColRules, row);
            }
        } else if (col < metrics.maxRowRules) {
            return this.renderRule(this.props.game.rowRules[row - metrics.maxColRules], metrics.maxRowRules, col);
        } else {
            return this.renderBoard(this.props.game.cells[row - metrics.maxColRules][col - metrics.maxRowRules])
        }
    }
    
    renderOutter(): React.ReactNode {
        return <span className="picross cell outter"></span>;
    }
    
    renderRule(rules: number[], maxRules: number, index: number): React.ReactNode {
        const offset = index - (maxRules - rules.length);
        if (offset < 0) {
            return this.renderOutter();
        }
        return <span className="picross cell rule">{rules[offset]}</span>
    }
    
    renderBoard(state: CellState): React.ReactNode {
        let board: React.ReactNode = null;
        if (state === CellState.Yes) {
            board = '+';
        } else if (state === CellState.No) {
            board = '-';
        }
        return <span className="picross cell board">{board}</span>
    }
}

