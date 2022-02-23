import React from 'react';
import { Board as GameBoard, BoardCell } from '../../game/board';

type BoardProps = {
    board: GameBoard;
    onSquareClick: (r: number, c: number) => void;
}

export function Board({ board, onSquareClick }: BoardProps) {
    const {
        width,
        height,
        cells
    } = board;


    const uicells = [];
    for (let r = 0; r < height; r++) {
        uicells.push(<div key={`cells${uicells.length}`} className='asset border borderlr'></div>)
        for (let c = 0; c < width; c++) {
            const cellClass = getClassForCell(cells[r][c]);
            uicells.push(<div key={`cells${uicells.length}`} className={cellClass} onClick={() => onSquareClick(r, c)}></div>)
        }
        uicells.push(<div key={`cells${uicells.length}`} className='asset border borderlr'></div>)
    }

    return (
        <div>
            {uicells}
            <div className='asset border borderbl'></div>
            {[...Array(width)].map((_, i) => <div key={i} className='asset border bordertb'></div>)}
            <div className='asset border borderbr'></div>
        </div>
    )
}

function getClassForCell(cell: BoardCell) {
    if (!cell.explored) {
        return 'asset square unexplored'
    }

    if (cell.content.empty) {
        return 'asset square blank'
    }

    if (cell.content.mine) {
        return 'asset square ' + (cell.content.explodedMine ? 'mineexploded' : 'mine')
    }

    if (cell.content.digit) {
        return 'asset square number' + cell.content.digit
    }
}

type TimerDisplayProps = {
    number: number
}

export function TimerDisplay({ number }: TimerDisplayProps) {
    let digit_100 = 'time0';
    let digit_10 = 'time0';
    let digit_1 = 'time0';
    const s = number.toString();
    if (s.length === 1) {
        digit_1 = `time${s[0]}`;
    }
    else if (s.length === 2) {
        digit_10 = `time${s[0]}`;
        digit_1 = `time${s[1]}`;
    }
    else {
        digit_100 = `time${s[0]}`;
        digit_10 = `time${s[1]}`;
        digit_1 = `time${s[2]}`;
    }
    return (
        <>
            <div className={`asset border ${digit_100} time_hundreds`}></div>
            <div className={`asset border ${digit_10} time_tens`}></div>
            <div className={`asset border ${digit_1} time_ones`}></div>
        </>
    )
}

type HeaderProps = {
    width: number;
    children: React.ReactChild;
}

export function Header({ width, children }: HeaderProps) {
    return (
        <>
            <div className='asset border bordertl'></div>
            {[...Array(width)].map((_, i) => <div key={i} className='asset border bordertb'></div>)}
            <div className='asset border bordertr'></div>
            <div className='asset border borderlrlong'></div>
            <div style={{
                width: `${32 * width}px`,
                height: '64px',
                float: 'left'
            }}>
                {children}
            </div>
            <div className='asset border borderlrlong'></div>
            <div className='asset border borderjointl'></div>
            {[...Array(width)].map((_, i) => <div key={i} className='asset border bordertb'></div>)}
            <div className='asset border borderjointr'></div>
        </>
    )
}