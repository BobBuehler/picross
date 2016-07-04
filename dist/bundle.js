/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(2);
	var Picross = __webpack_require__(3);
	var PicrossGrid_1 = __webpack_require__(4);
	var game = new Picross.Game([
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
	ReactDOM.render(React.createElement(PicrossGrid_1.PicrossGrid, {game: game}), document.getElementById("root"));


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	(function (CellState) {
	    CellState[CellState["Empty"] = 0] = "Empty";
	    CellState[CellState["No"] = 1] = "No";
	    CellState[CellState["Yes"] = 2] = "Yes";
	})(exports.CellState || (exports.CellState = {}));
	var CellState = exports.CellState;
	var Game = (function () {
	    function Game(rowRules, colRules) {
	        this.rowRules = rowRules;
	        this.colRules = colRules;
	        this.cells = [];
	        for (var r = 0; r < rowRules.length; ++r) {
	            var row = [];
	            for (var c = 0; c < colRules.length; ++c) {
	                row[c] = CellState.Empty;
	            }
	            this.cells[r] = row;
	        }
	    }
	    Game.prototype.setCell = function (row, col, state) {
	        this.cells[row][col] = state;
	    };
	    return Game;
	}());
	exports.Game = Game;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var Picross_1 = __webpack_require__(3);
	var Grid_1 = __webpack_require__(5);
	var PicrossGrid = (function (_super) {
	    __extends(PicrossGrid, _super);
	    function PicrossGrid() {
	        _super.apply(this, arguments);
	    }
	    PicrossGrid.prototype.render = function () {
	        var _this = this;
	        var metrics = this.calcMetrics();
	        return React.createElement(Grid_1.Grid, {rowCount: metrics.rows + metrics.maxRowRules, colCount: metrics.cols + metrics.maxColRules, getCell: function (r, c) { return _this.renderCell(metrics, r, c); }});
	    };
	    PicrossGrid.prototype.calcMetrics = function () {
	        var game = this.props.game;
	        return {
	            rows: game.rowRules.length,
	            cols: game.colRules.length,
	            maxRowRules: Math.max.apply(Math, game.rowRules.map(function (rules) { return rules.length; })) || 1,
	            maxColRules: Math.max.apply(Math, game.colRules.map(function (rules) { return rules.length; })) || 1
	        };
	    };
	    PicrossGrid.prototype.renderCell = function (metrics, row, col) {
	        if (row < metrics.maxColRules) {
	            if (col < metrics.maxRowRules) {
	                return this.renderOutter();
	            }
	            else {
	                return this.renderRule(this.props.game.colRules[col - metrics.maxRowRules], metrics.maxColRules, row);
	            }
	        }
	        else if (col < metrics.maxRowRules) {
	            return this.renderRule(this.props.game.rowRules[row - metrics.maxColRules], metrics.maxRowRules, col);
	        }
	        else {
	            return this.renderBoard(this.props.game.cells[row - metrics.maxColRules][col - metrics.maxRowRules]);
	        }
	    };
	    PicrossGrid.prototype.renderOutter = function () {
	        return React.createElement("span", {className: "picross cell outter"});
	    };
	    PicrossGrid.prototype.renderRule = function (rules, maxRules, index) {
	        var offset = index - (maxRules - rules.length);
	        if (offset < 0) {
	            return this.renderOutter();
	        }
	        return React.createElement("span", {className: "picross cell rule"}, rules[offset]);
	    };
	    PicrossGrid.prototype.renderBoard = function (state) {
	        var board = null;
	        if (state === Picross_1.CellState.Yes) {
	            board = '+';
	        }
	        else if (state === Picross_1.CellState.No) {
	            board = '-';
	        }
	        return React.createElement("span", {className: "picross cell board"}, board);
	    };
	    return PicrossGrid;
	}(React.Component));
	exports.PicrossGrid = PicrossGrid;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var _ = __webpack_require__(6);
	var React = __webpack_require__(1);
	var Grid = (function (_super) {
	    __extends(Grid, _super);
	    function Grid() {
	        _super.apply(this, arguments);
	    }
	    Grid.prototype.render = function () {
	        return React.createElement("div", {className: "grid"}, _.range(this.props.rowCount).map(this.renderRow.bind(this)));
	    };
	    Grid.prototype.renderRow = function (row) {
	        return React.createElement(Row, {key: row}, _.range(this.props.colCount).map(this.renderCell.bind(this, row)));
	    };
	    Grid.prototype.renderCell = function (row, col) {
	        return React.createElement(Cell, {key: col}, this.props.getCell(row, col));
	    };
	    return Grid;
	}(React.Component));
	exports.Grid = Grid;
	function Row(props) {
	    return React.createElement("div", {className: "grid-row"}, props.children);
	}
	function Cell(props) {
	    return React.createElement("div", {className: "grid-cell"}, props.children);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = _;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map