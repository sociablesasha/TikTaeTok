import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

Array.matrix = function(rows, cols, init) {
    var arr;
    var row = [];
    for (let i = 0; i < rows; i++) {
        var col = [];
        for (let j = 0; j < cols; j++) {
            col[j] = init;
        }
        row[i] = col;
    }
    arr = row;
    return arr;
}

class Square extends React.Component {
    render() {
        return (
            <button className="square" onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(row, col) {
        col -= 1;
        row -= 1;

        return <Square
            value={this.props.squares[row][col]}
            onClick={() => this.props.onClick(row, col)}
        />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(1, 1)}
                    {this.renderSquare(1, 2)}
                    {this.renderSquare(1, 3)}
                </div>
                <div className="board-row">
                    {this.renderSquare(2, 1)}
                    {this.renderSquare(2, 2)}
                    {this.renderSquare(2, 3)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3, 1)}
                    {this.renderSquare(3, 2)}
                    {this.renderSquare(3, 3)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array.matrix(3, 3, null),
                col: null,
                row: null
            }],
            stepNumber: 0,
            xIsNext: true
        }
    }

    handleClick(row, col) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = JSON.parse(JSON.stringify(current.squares));

        console.log(row);
        console.log(col);

        if (calculateWinner(squares) || isNaN(squares[row][col])) {
            return;
        }

        squares[row][col] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                row: row + 1,
                col: col + 1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + " " + getRowAndCol(step.row, step.col) :
                'Go to game start';
            return (
                <li key={move}>
                    <button
                        style={current === step ? { fontWeight: "bold" } : { fontWeight: "" }}
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(row, col) => this.handleClick(row, col)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const size = squares.length;
    
    var diagonalLeft = [];
    var diagonalRight = [];
    var horizontal = [];
    var vertical = [];
    for (let i = 0; i < size; i++) {
        horizontal = [];
        vertical = [];
        for (let j = 0; j < size; j++) {
            horizontal.push(squares[i][j]);
            vertical.push(squares[j][i]);
        }
        diagonalLeft.push(squares[i][i]);
        diagonalRight.push(squares[size - i - 1][i]);

        if (allEquals(horizontal))
            return horizontal[0];
        if (allEquals(vertical))
            return vertical[0];
    }

    if (allEquals(diagonalLeft))
        return diagonalLeft[0];
    if (allEquals(diagonalRight))
        return diagonalRight[0];

    return null;
}

function getRowAndCol(row, col) {
    return "(" + row + "," + col + ")";
}

function allEquals(array) {
    let allEqual = true;
    for (let i = 1; i < array.length; i++) {
        if (!isNaN(array[i]) || array[i - 1] !== array[i]) {
            allEqual = false;
            break;
        }
    }
    return allEqual;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);