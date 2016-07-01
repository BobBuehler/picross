import * as _ from "lodash";
import * as React from "react";

export interface GridProps {
    rowCount: number;
    colCount: number;
    getCell: (row: number, col: number) => React.ReactNode
}

export class Grid extends React.Component<GridProps, {}> {
    render() {
        return <div className="grid">{_.range(this.props.rowCount).map(this.renderRow.bind(this))}</div>;
    }

    renderRow(row: number) {
        return <Row key={row}>{_.range(this.props.colCount).map(this.renderCell.bind(this, row))}</Row>;
    }

    renderCell(row: number, col: number) {
        return <Cell key={col}>{this.props.getCell(row, col)}</Cell>;
    }
}

function Row(props: React.Props<any>): React.ReactElement<any> {
    return <div className="grid-row">{props.children}</div>;
}

function Cell(props: React.Props<any>): React.ReactElement<any> {
    return <div className="grid-cell">{props.children}</div>;
}
