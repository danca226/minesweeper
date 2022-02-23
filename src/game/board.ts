export enum BoardType {
    BEGINNER, INTERMEDIATE, EXPERT
}

export type Board = {
    width: number;
    height: number;
    mines: number;
    unexploredCount: number;
    gameOver: boolean;
    cells: [BoardCell[]];
}

export type BoardCell = {
    explored: boolean;
    content: {
        empty: boolean;
        mine: boolean;
        explodedMine: boolean;
        digit: number;
    }
}

const BOARDSPEC = {
    [BoardType.BEGINNER]: {
        width: 9,
        height: 9,
        mines: 10
    },
    [BoardType.INTERMEDIATE]: {
        width: 16,
        height: 16,
        mines: 40
    },
    [BoardType.EXPERT]: {
        width: 30,
        height: 16,
        mines: 99
    },
}

const DIRS = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];

export function createBoard(type: BoardType): Board {
    return createBoardWithSpec(BOARDSPEC[type]);
}

export function makeMove(r: number, c: number, board: Board) {
    const {
        cells,
        mines,
    } = board;

    if (cells[r][c].content.mine) {
        board.gameOver = true;
        cells[r][c].content.explodedMine = true;
        showAllMines(r, c, board);
        return board;
    }

    exploreCell(r, c, board);

    if (board.unexploredCount === mines) {
        board.gameOver = true;
    }

    return board;
}

function createBoardWithSpec({
    width,
    height,
    mines
}: { width: number, height: number, mines: number }) {
    const board: Board = {
        height,
        width,
        mines,
        gameOver: false,
        unexploredCount: width * height,
        cells: [[]]
    };

    initBoard(board);
    placeMines(board);
    updateAdjacentMineCount(board);

    return board;
}

function initBoard(board: Board) {
    const {
        height,
        width,
        cells
    } = board;

    for (let r = 0; r < height; r++) {
        const rows: BoardCell[] = [];
        for (let c = 0; c < width; c++) {
            rows.push({
                explored: false,
                content: {
                    empty: true,
                    mine: false,
                    explodedMine: false,
                    digit: 0
                }
            });
        }
        cells[r] = rows;
    }
}

function placeMines(board: Board) {
    let { mines: minesLeft } = board;
    const {
        width,
        height,
        cells
    } = board;

    while (minesLeft) {
        let [r, c] = getRandomPosition(width, height);
        if (cells[r][c] === undefined || cells[r][c].content === undefined) {
            console.log('wtf')
        }
        while (cells[r][c].content.mine) {
            [r, c] = getRandomPosition(width, height);
        }
        cells[r][c].content.empty = false;
        cells[r][c].content.mine = true;
        minesLeft--;
    }
}

function updateAdjacentMineCount(board: Board) {
    const {
        width,
        height,
        cells
    } = board;

    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            if (cells[r][c].content.mine) {
                for (const dir of DIRS) {
                    const adjr = r + dir[0];
                    const adjc = c + dir[1];
                    if (adjr < 0 || adjr === height) continue;
                    if (adjc < 0 || adjc === width) continue;
                    if (!cells[adjr][adjc].content.mine) {
                        cells[adjr][adjc].content.digit += 1;
                        cells[adjr][adjc].content.empty = false;
                    }
                }
            }
        }
    }

}

function getRandomPosition(width: number, height: number) {
    const r = Math.floor(Math.random() * height);
    const c = Math.floor(Math.random() * width);
    return [r, c]
}

function showAllMines(r: number, c: number, board: Board) {
    const {
        width,
        height,
        cells
    } = board;

    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            if (cells[r][c].content.mine) {
                cells[r][c].explored = true;
            }
        }
    }
}

function exploreCell(r: number, c: number, board: Board) {
    const {
        width,
        height,
        cells
    } = board;

    if (cells[r][c].explored) return;

    cells[r][c].explored = true;
    board.unexploredCount -= 1;

    if (!cells[r][c].content.empty) return;

    for (const dir of DIRS) {
        const adjr = r + dir[0];
        const adjc = c + dir[1];
        if (adjr < 0 || adjr === height) continue;
        if (adjc < 0 || adjc === width) continue;
        exploreCell(adjr, adjc, board);
    }
}