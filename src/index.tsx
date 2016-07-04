import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Picross from "./Picross";
import { PicrossGrid } from "./components/PicrossGrid"

const game = new Picross.Game([
    [3],
    [1, 1],
    [1],
    [1, 2],
    [3]
], [
    [3],
    [1, 1],
    [1, 1],
    [1, 1],
    [2]
]);

ReactDOM.render(
    <PicrossGrid game={game} />,
    document.getElementById("root")
);