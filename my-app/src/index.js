import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
        let squareClass="square";
        var greenIfWinningSquare = this.props.isWinningSquare ? "t-b cWht bGrn1" : "";

        return (
            <button className={[squareClass, greenIfWinningSquare].join(' ')} onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        let isWinningSquare = this.props.winningRow.indexOf(i) > -1

        return (
            <Square
                isWinningSquare={isWinningSquare}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRows() {
        var rowCount = 3;
        var colCount = 3;

        let rows = [];
        for (var row=0; row<rowCount; row++) {
            let cols = [];

            for (var col=0; col<colCount; col++) {
                cols.push(this.renderSquare(row*3 + col));
            }
            rows.push(<div className="board-row">{cols}</div>);
        }

        return rows
    }

    render() {
        let rows = this.renderRows();
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastMove: Array(9).fill(null),
                winningRow: Array(3).fill(null),
            }],
            stepNumber: 0,
            lastMove: null,
            xIsNext: true,
            ordering: "DESC",
        };
    }

    calculateWinner(squares) {
        var result = {};
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                result.squares = squares[a];
                result.lines = lines[i];
                return result;
            }
        }
        result.squares=null;
        result.lines = Array(3).fill(null);
        return result;
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = this.calculateWinner(squares);
        if (winner && winner.squares || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastMove: i,
                winningRow: winner.lines
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            history: this.state.history.slice(0,step+1)
        });
    }

    toggleOrdering() {
        if (this.state.ordering == "ASC") {
            this.setState({
                ordering: "DESC"
            });
        } else{
            this.setState({
                ordering: "ASC"
            });
        }
    }

    getMoves() {
        const history = this.state.history;
        const moves = history.map((step, move) => {
            const currentPosString = "(" + ((Math.floor(history[move].lastMove/3) + 1)).toString() + "," + ((history[move].lastMove % 3) + 1).toString() + ")";
            const isLastIteration = move == history.length-1;
            const highlightIfLastIteration = isLastIteration ? "t-b cGrn1" : "";
            const desc = move ? 'Move ' + currentPosString : 'Game Start';

            return (
                <li key={move}>
                    <a href="#" className={highlightIfLastIteration} onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            )
        });

        if (this.state.ordering == "ASC"){
            moves.reverse();
        }

        return moves;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);
        const moves = this.getMoves();

        let status;
        if (winner && winner.squares) {
            status = 'Winner: ' + winner.squares;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="w95p mauto bdrs bWht ps ms">{status}</div>
                <div className="game-board bWht ms txtc mauto">
                    <Board
                        squares={current.squares}
                        winningRow={winner.lines}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="bWht bdrs mauto w95p ps">
                        <div className="txtc mauto">
                            <button onClick={() => this.toggleOrdering()}>{this.state.ordering}</button>
                        </div>
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

class Container extends React.Component {
    render() {
        return (
            <div className="background-image">
                <div className="mauto bdrs w400 bdr-rm mtxxl">
                    <Game/>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Container />,
    document.getElementById('root')
);