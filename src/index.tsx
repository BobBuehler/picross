import * as React from "react";
import * as ReactDOM from "react-dom";

import { Grid } from "./components/Grid";

ReactDOM.render(
    <Grid rowCount={3} colCount={3} getCell={(r, c) => r * c} />,
    document.getElementById("root")
);