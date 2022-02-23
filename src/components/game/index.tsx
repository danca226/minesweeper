import React, { useEffect, useState } from 'react';
import { Board, Header, TimerDisplay } from '../board';
import { Board as GameBoard, BoardType, createBoard, makeMove } from '../../game/board';

function tick(setTimerValue: React.Dispatch<React.SetStateAction<number>>) {
    let start = Date.now();
    return function () {
        const now = Date.now()
        const duration = Math.floor((now - start) / 1000);
        setTimerValue(duration);
    }
}

export function Game() {
    const [board, setBoard] = useState<GameBoard>(createBoard(BoardType.BEGINNER));

    const [timerValue, setTimerValue] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (timerRunning) {
            interval = setInterval(tick(setTimerValue), 1000);
        } else {
            if (interval) {
                clearInterval(interval)
            }
        }
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [timerRunning])

    function onSquareClick(r: number, c: number) {
        if (board.gameOver) {
            return;
        }

        if (!timerRunning) {
            setTimerRunning(true);
        }

        const nextBoard = {
            ...makeMove(r, c, board)
        }
        if (nextBoard.gameOver) {
            setTimerRunning(false);
        }

        setBoard(nextBoard)
    }

    function onLevelSelectionClick(type: BoardType) {
        setBoard(createBoard(type))
        setTimerRunning(false);
        setTimerValue(0)
    }

    const uiWidth = 32 * board.width + 40;
    const uiHeight = 32 * board.height + 124;

    return (
        <div>
            <LevelSelection onLevelSelectionClick={onLevelSelectionClick} />
            <div id='game' style={{
                width: `${uiWidth}px`,
                height: `${uiHeight}px`,
            }}>
                <Header width={board.width}>
                    <TimerDisplay number={timerValue} />
                </Header>
                <Board board={board} onSquareClick={onSquareClick} />
            </div>
        </div>
    )
}

type LevelSelectionProps = {
    onLevelSelectionClick: (type: BoardType) => void;
}
function LevelSelection({ onLevelSelectionClick }: LevelSelectionProps) {
    return (
        <div>
            <button onClick={() => onLevelSelectionClick(BoardType.BEGINNER)}>Beginner</button>
            <button onClick={() => onLevelSelectionClick(BoardType.INTERMEDIATE)}>Intermediate</button>
            <button onClick={() => onLevelSelectionClick(BoardType.EXPERT)}>Expert</button>
        </div>
    )
}