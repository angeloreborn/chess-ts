import {
    Point,
    Piece,
    PieceType,
    PawnDirection,
    PathSigniture,
    SpecialPawnStart,
    MoveType,
    BoardOrientation,
    Boundary,
    Move,
    Path,
    Position,
    SideColor
} from './static/definitions'

import {
    _emptyPosition,
    rookPath,
    bishopPath,
    queenPath,
    knightPath,
    standardPawnPath,
    specialPawnPath,
    kingPath
} from './static/constants';

import {
    getPieceType,
    getPieceSideFromCode,
    getPiecePathSigniture,
    getPieceString,
    bounds
} from './static/functions'

import Side from './Side'

export default class Board {
    public position: Position;
    public side = new Side();
    public enpassant: Point | undefined;
    public enpassantPoint: Point | undefined;
    public halfmove: number = 0
    public fullmove: number = 0
    public legalmoves: Map<string, Move[]>;
    public orientation: BoardOrientation = BoardOrientation.WhiteFacingUp;
    public kingIsInCheck = false;
    public kingIsInDoubleCheck = false;
    public isolatedKingCheckPathPoints: Map<string, Point> = new Map();
    public kingPathSigniturePointsToIsolate: Point[] | undefined;

    constructor(_position: Position, _side: Side) {
        this.position = _position;
        this.side = _side;
        this.legalmoves = this.findLegalMoves();
    }

    public get pawn_start() {
        return this.side.ally === SideColor.WHITE ? SpecialPawnStart.white : SpecialPawnStart.black;
    }
    public get pawn_step() {
        return this.side.ally === SideColor.WHITE ? PawnDirection.up : PawnDirection.down;
    }
    public get promotion_row() {
        if (this.side.ally === SideColor.WHITE) {
            return Boundary.Min;
        } else {
            return Boundary.Max;
        }
    }
    public get pawn_direction() {
        if (this.side.ally === SideColor.WHITE) {
            return this.side.white_pawn_direction;
        } else {
            return this.side.black_pawn_direction;
        }
    }

    public flip_board() {
        //return this.orientation === BoardOrientation.WhiteFacingDown ? this.orientation = BoardOrientation.WhiteFacingUp : this.orientation = BoardOrientation.WhiteFacingDown;
        return true;
    }

    public get_fen(): string {
        let chessPosition: string[] = [];
        if (this.position) {
            for (let row = 0; row < this.position.length; row++) {
                let part: string = '';
                for (let col = 0; col < this.position[row].length; col++) {
                    const pieceCode: Piece = this.position[row][col];
                    part += getPieceString(pieceCode);
                    switch (pieceCode) {
                        case Piece.K: this.side.whiteKingPosition = { row: row, col: col }; break;
                        case Piece.k: this.side.blackKingPosition = { row: row, col: col }; break;
                    }
                }
                chessPosition.push(part);
            }
        } else {

        }
        let p = chessPosition.join('/');
        let fen = `${p} ${this.side.ally} ${this.enpassant} ${this.halfmove} ${this.fullmove}`

        return fen;
    }

    public get_moves(): Map<string, Move[]> {
        return this.legalmoves;
    }
    public get_position() {
        return this.position;
    }
    public get_side(): SideColor {
        return this.side.ally;
    }
    public get_pgn() {
        return {};
    }

    public take_back() {
        return true;
    }

    public findLegalMoves(): Map<string, Move[]> {
        let legalMoves: Map<string, Move[]> = new Map();
        let isolatedPoints: Map<any, PathSigniture> = this.traceKingPathSignitures();
        for (let row = 0; row < this.position.length; row++) {
            for (let col = 0; col < this.position[row].length; col++) {
                if (isolatedPoints.has(row + '' + col)) {
                    legalMoves.set(row + '' + col, this.findAllLegalMovesOfPiecePositionAndFilterPathSignitures(row, col, isolatedPoints.get(row + '' + col)))
                } else {
                    if (getPieceSideFromCode(this.position[row][col]) === this.side.ally) {
                        legalMoves.set(row + '' + col, this.findAllLegalMovesOfPiecePositionAndFilterPathSignitures(row, col, isolatedPoints.get(row + '' + col)))
                    }
                }
            }
        }
        let total = 0;
        legalMoves.forEach((sf) => {
            total += sf.length;
        })
        let filteredLegalMoves: Map<string, Move[]> = new Map();
        if (this.kingIsInCheck) {
            if (this.kingIsInDoubleCheck) {
                legalMoves.forEach((moves: Move[], key) => {
                    for (const move of moves) {
                        if (move.piecetype === PieceType.KING) {
                            filteredLegalMoves.set(key, moves);
                            break;
                        }
                    }
                })
                return filteredLegalMoves;
            } else {
                let filter_king_map: Map<string, Move[]> = new Map();
                legalMoves.forEach((moves: Move[], key) => {
                    let block_moves: Move[] = [];
                    for (const move of moves) {
                        if (move.piecetype === PieceType.KING) {
                            block_moves.push(move);
                        } else {
                            if (this.isolatedKingCheckPathPoints.has(move.to.row + '' + move.to.col)) {
                                block_moves.push(move);
                            }
                        }
                    }
                    filter_king_map.set(key, block_moves);
                })
                return filter_king_map;
            }
        } else {
            filteredLegalMoves = legalMoves;
            return legalMoves;
        }
    }
    public findAllLegalMovesOfPiecePositionAndFilterPathSignitures(row: number, col: number, signiture: PathSigniture | undefined): Move[] {

        let pieceType = getPieceType(this.position[row][col]);
        let lll: Move[] = [];
        let pawnIsolatedPaths = []
        if (pieceType === PieceType.PAWN) {
            let pawnPath;
            if (row === this.pawn_start) {
                pawnPath = standardPawnPath.concat(specialPawnPath);
            } else {
                pawnPath = standardPawnPath;
            }
            for (const path of pawnPath) {
                if (signiture === path.signiture) {
                    pawnIsolatedPaths.push(signiture);
                }
                let targetRow = row + path.rowShift * this.pawn_direction;
                let targetCol = col + path.colShift;
                if (bounds(targetRow) && bounds(targetCol)) {
                    if (getPieceSideFromCode(this.position[row + path.rowShift * this.pawn_direction][col + path.colShift]) === this.side.enemy) {
                        if (signiture === path.signiture || signiture === undefined) {
                            if (path.moveType === MoveType.Capture) {
                                if (targetRow === this.promotion_row) {
                                    lll.push({ name: 'Pawn Capture Promote Queen', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol }, promote: PieceType.QUEEN })
                                    lll.push({ name: 'Pawn Capture Promote Rook', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol }, promote: PieceType.ROOK })
                                    lll.push({ name: 'Pawn Capture Promote Bishop', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol }, promote: PieceType.BISHOP })
                                    lll.push({ name: 'Pawn Capture Promote Knight', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol }, promote: PieceType.KNIGHT })
                                } else {
                                    lll.push({ name: 'Pawn Capture', movetype: MoveType.Capture, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol } })
                                }
                                continue;
                            }
                        } else {
                            lll.push({ name: 'Pawn Capture', movetype: MoveType.Capture, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol } })
                        }
                    }

                    if (this.position[targetRow][targetCol] === Piece.e) {
                        if (path.moveType === MoveType.Default) {
                            if (signiture === path.signiture || signiture === undefined) {
                                if (targetRow === this.promotion_row) {
                                    lll.push({ name: 'Pawn Promote Queen', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol }, promote: PieceType.QUEEN })
                                    lll.push({ name: 'Pawn Promote Rook', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol }, promote: PieceType.ROOK })
                                    lll.push({ name: 'Pawn Promote Bishop', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol }, promote: PieceType.BISHOP })
                                    lll.push({ name: 'Pawn Promote Knight', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol }, promote: PieceType.KNIGHT })
                                } else {
                                    lll.push({ name: 'Pawn Default Move', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol } })
                                }
                            }
                        }
                        if (path.moveType === MoveType.Pawn2Up) {
                            if (this.position[targetRow][targetCol] === Piece.e && this.position[targetRow - (this.pawn_step)][targetCol] === Piece.e) {
                                if (!signiture) {
                                    lll.push({ name: 'Pawn 2Up', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol } })
                                }
                                else {
                                    if (signiture === path.signiture) {
                                        lll.push({ name: 'Pawn Special Move 2UP', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: targetRow, col: targetCol } })
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this.enpassantPoint) {
                if (this.enpassantPoint.row === row) {
                    if (Math.abs(col - this.enpassantPoint.col) === 1) {
                        if (typeof signiture === 'undefined') {
                            if (col < this.side.king_position.col) {
                                for (let hcol = this.side.king_position.col - 1; hcol >= Boundary.Min; hcol--) {
                                    let targetPiece = this.position[row][hcol]
                                    let targetPieceType = getPieceType(targetPiece)
                                    if (getPieceSideFromCode(targetPiece) === this.side.enemy) {
                                        if (targetPieceType === PieceType.ROOK || targetPieceType === PieceType.QUEEN) {
                                            if (hcol < col && hcol < this.enpassantPoint.col) {
                                                continue;
                                            } else {
                                                lll.push({ name: 'Pawn Capture Enpassant', movetype: MoveType.Capture, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: this.enpassantPoint.row - this.pawn_step, col: this.enpassantPoint.col } })
                                            }
                                        }
                                        if (row === this.enpassantPoint.row)
                                            continue;
                                        else
                                            break;
                                    }
                                }
                            } else {
                                for (let hcol = this.side.king_position.col - 1; hcol <= Boundary.Max; hcol++) {
                                    let targetPiece = this.position[row][hcol]
                                    let targetPieceType = getPieceType(targetPiece)
                                    if (getPieceSideFromCode(targetPiece) === this.side.enemy) {
                                        if (targetPieceType === PieceType.ROOK || targetPieceType === PieceType.QUEEN) {
                                            if (hcol > col && hcol > this.enpassantPoint.col) {
                                                continue;
                                            } else {
                                                lll.push({ name: 'Pawn Capture Enpassant', movetype: MoveType.Capture, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: this.enpassantPoint.row - this.pawn_step, col: this.enpassantPoint.col } })
                                            }
                                        }
                                        if (row === this.enpassantPoint.row)
                                            continue
                                        else
                                            break;
                                    }
                                }
                            }
                        } else {
                            if (this.enpassantPoint.col > col) {
                                if (signiture != PathSigniture.PositiveSlope) {
                                    if (signiture === PathSigniture.Horizontal) {
                                    }
                                } else {
                                    lll.push({ name: 'Pawn Capture Enpassant', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: this.enpassantPoint.row - this.pawn_step, col: this.enpassantPoint.col } })
                                }
                            }
                            if (this.enpassantPoint.col < col) {
                                if (signiture != PathSigniture.NegativeSlope) {
                                    if (signiture === PathSigniture.Horizontal) {
                                    }
                                } else {
                                    lll.push({ name: 'Pawn Capture Enpassant', movetype: MoveType.Default, piecetype: PieceType.PAWN, from: { row: row, col: col }, to: { row: this.enpassantPoint.row - this.pawn_step, col: this.enpassantPoint.col } })
                                }
                            }
                        }
                    }
                }
            }
        } else
            if (pieceType === PieceType.KING) {
                for (const path of kingPath) {
                    let targetRow = row + path.rowShift;
                    let targetCol = col + path.colShift;

                    if (bounds(targetRow) && bounds(targetCol)) {
                        if (getPieceSideFromCode(this.position[targetRow][targetCol]) === this.side.ally) {

                        } else {
                            if (this.isSquareAttackedByEnemyPathSigniture(targetRow, targetCol) === false) {
                                if (getPieceSideFromCode(this.position[targetRow][targetCol]) === this.side.enemy) {
                                    lll.push({ name: 'King Move', movetype: MoveType.Capture, piecetype: PieceType.KING, from: { row: row, col: col }, to: { row: targetRow, col: targetCol } })
                                } else {
                                    lll.push({ name: 'King Move', movetype: MoveType.Default, piecetype: PieceType.KING, from: { row: row, col: col }, to: { row: targetRow, col: targetCol } })
                                }

                            }
                        }
                    }
                }
                let kingSideCastleIsLegal = true;
                let queenSideCastleIsLegal = true;
                if (this.side.kingCanCastleKingSide === true) {
                    for (let k = col + 1; k < Boundary.Max; k++) {
                        if (this.position[row][k] === Piece.e) {
                            let squareAttacked = this.isSquareAttackedByEnemyPathSigniture(row, k);
                            if (squareAttacked === true) {
                                kingSideCastleIsLegal = false;
                                break;
                            }
                            continue;
                        } else {
                            kingSideCastleIsLegal = false;
                        }
                    }
                    if (kingSideCastleIsLegal === true) {
                        lll.push({ name: 'Kingside Castle', movetype: MoveType.KingSideCastle, piecetype: PieceType.KING, from: { row: this.side.king_position.row, col: this.side.king_position.col }, to: { row: this.side.king_position.row, col: this.side.king_position.col + 2 } })
                    }
                }
                if (this.side.kingCanCastleQueenside) {
                    for (let q = col - 1; q >= Boundary.Min + 1; q--) {
                        if (this.position[row][q] === Piece.e) {
                            let squareAttacked = this.isSquareAttackedByEnemyPathSigniture(row, q);
                            if (squareAttacked === true) {
                                queenSideCastleIsLegal = false;
                                break;
                            }
                            continue;
                        } else {
                            queenSideCastleIsLegal = false;
                        }
                    }
                    if (queenSideCastleIsLegal === true) {
                        lll.push({ name: 'QueenSide Castle', movetype: MoveType.QueenSideCastle, piecetype: PieceType.KING, from: { row: this.side.king_position.row, col: this.side.king_position.col }, to: { row: this.side.king_position.row, col: this.side.king_position.col - 2 } })
                    }
                }
            } else
                if (pieceType === PieceType.KNIGHT) {

                    let knightPath = this.getPiecePathing(PieceType.KNIGHT);

                    for (const path of knightPath) {
                        let targetRow = row + path.rowShift;
                        let targetCol = col + path.colShift;
                        if (bounds(targetRow) && bounds(targetCol)) {
                            if (getPieceSideFromCode(this.position[targetRow][targetCol]) === this.side.ally)
                                continue
                            else {
                                if (getPieceSideFromCode(this.position[targetRow][targetCol]) === this.side.enemy) {
                                    lll.push({ name: 'Knight Move', movetype: MoveType.Capture, piecetype: PieceType.KNIGHT, from: { row: row, col: col }, to: { row: targetRow, col: targetCol } })
                                } else {
                                    lll.push({ name: 'Knight Move', movetype: MoveType.Default, piecetype: PieceType.KNIGHT, from: { row: row, col: col }, to: { row: targetRow, col: targetCol } })
                                }

                            }

                        }
                    }
                }
                else {

                    let currentPieceType = getPieceType(this.position[row][col]);
                    let movePath = this.getPiecePathing(currentPieceType);
                    for (const path of movePath) {
                        let targetRow = row + path.rowShift;
                        let targetCol = col + path.colShift;
                        if (typeof signiture != 'undefined') {
                            if (signiture === path.pathSigniture) {
                                let targetRow = row + path.rowShift;
                                let targetCol = col + path.colShift;
                                for (let srow = targetRow, scol = targetCol; bounds(srow) && bounds(scol); srow += path.rowShift, scol += path.colShift) {
                                    if (getPieceSideFromCode(this.position[srow][scol]) === this.side.enemy) {
                                        lll.push({ name: 'Piece Capture', movetype: MoveType.Capture, piecetype: currentPieceType, from: { row: row, col: col }, to: { row: srow, col: scol } })
                                        break;
                                    }
                                    else {
                                        if (this.position[srow][scol] === Piece.e) {
                                            lll.push({ name: 'Default ', movetype: MoveType.Default, piecetype: currentPieceType, from: { row: row, col: col }, to: { row: srow, col: scol } });
                                        } else {
                                            break;
                                        }
                                    }
                                }
                            }
                        } else {
                            for (let srow = targetRow, scol = targetCol; bounds(srow) && bounds(scol); srow += path.rowShift, scol += path.colShift) {
                                if (getPieceSideFromCode(this.position[srow][scol]) === this.side.enemy) {
                                    lll.push({ name: 'Capture ', movetype: MoveType.Capture, piecetype: currentPieceType, from: { row: row, col: col }, to: { row: srow, col: scol } });
                                    break;
                                }
                                else
                                    if (this.position[srow][scol] === Piece.e) {
                                        lll.push({ name: 'Default ', movetype: MoveType.Default, piecetype: currentPieceType, from: { row: row, col: col }, to: { row: srow, col: scol } });
                                    } else {
                                        break;
                                    }
                            }
                        }
                    }
                }
        return lll;
    }

    public isSquareAttackedByEnemyPathSigniture(row: number, col: number): boolean {

        let instanceOfCollision = false;

        KINGPATHCHECK:
        for (const path of kingPath) {
            for (let krow = row + path.rowShift, kcol = col + path.colShift, distance = 0; bounds(krow) && bounds(kcol); krow += path.rowShift, kcol += path.colShift, distance++) {
                let pieceOnKingPath = this.position[krow][kcol];
                let pieceOnKingPathSigniture = getPiecePathSigniture(pieceOnKingPath);
                let pieceOnKingPathType = getPieceType(pieceOnKingPath);

                if (getPieceSideFromCode(pieceOnKingPath) === this.side.enemy) {
                    if (pieceOnKingPathSigniture.includes(path.signiture)) {
                        switch (pieceOnKingPathType) {
                            case PieceType.PAWN: {
                                switch (path.signiture) {
                                    case PathSigniture.NegativeSlope: {
                                        if (this.pawn_direction === PawnDirection.up) {
                                            if (krow < row && kcol < col && distance === 0) {
                                                instanceOfCollision = true;
                                                break KINGPATHCHECK;
                                            } else {
                                                continue KINGPATHCHECK;
                                            }
                                        } else {
                                            if (krow > row && kcol > col && distance === 0) {
                                                instanceOfCollision = true;
                                                break KINGPATHCHECK;
                                            } else {
                                                continue KINGPATHCHECK;
                                            }
                                        }
                                    }
                                    case PathSigniture.PositiveSlope: {
                                        if (this.pawn_direction === PawnDirection.up) {
                                            if (krow < row && kcol > col && distance === 0) {
                                                instanceOfCollision = true;
                                                break KINGPATHCHECK;
                                            } else {
                                                continue KINGPATHCHECK;
                                            }
                                        } else {
                                            if (krow > row && kcol < col && distance === 0) {
                                                instanceOfCollision = true;
                                                break KINGPATHCHECK;
                                            } else {
                                                continue KINGPATHCHECK;
                                            }
                                        }

                                    }
                                }
                            } continue;
                            case PieceType.KING: {
                                if (distance === 0) {
                                    instanceOfCollision = true;
                                    break KINGPATHCHECK;
                                } else {
                                    continue KINGPATHCHECK;
                                }
                            }
                            default: {
                                instanceOfCollision = true;
                                break KINGPATHCHECK;
                            }
                        }
                    } else continue KINGPATHCHECK;
                }
            }
        }

        for (const path of knightPath) {
            let knight_target_row = row + path.rowShift;
            let knight_target_col = col + path.colShift;
            if (bounds(knight_target_row) && bounds(knight_target_col)) {
                if (getPieceSideFromCode(this.position[knight_target_row][knight_target_col]) === this.side.enemy) {
                    if (getPieceType(this.position[knight_target_row][knight_target_col]) === PieceType.KNIGHT) {
                        instanceOfCollision = true;
                    }
                }
            }
        }
        if (instanceOfCollision === false) return false;
        return true;
    }
    public traceKingPathSignitures(): Map<any, PathSigniture> {
        let pathKingMap: Map<any, PathSigniture> = new Map();
        let checkCount = 0;
        if (this.side.king_position) {
            for (const p of kingPath) {
                let AllyPiecesInPathSigniture: Point[] = [];
                let KingCheckPathPoints: Map<string, Point> = new Map();

                for (let row = this.side.king_position?.row + p.rowShift, col = this.side.king_position?.col + p.colShift; bounds(row) && bounds(col); row += p.rowShift, col += p.colShift) {

                    if (getPieceSideFromCode(this.position[row][col]) === this.side.ally) {

                        AllyPiecesInPathSigniture.push({ row: row, col: col })
                        continue;
                    }
                    else {
                        if (this.position[row][col] === Piece.e) {
                            KingCheckPathPoints.set(row + '' + col, { row: row, col: col });
                            continue;
                        }
                        else {
                            if (this.pathSignitureMatch(this.position[row][col], p.signiture)) {
                                if (AllyPiecesInPathSigniture.length === 0) {

                                    if (getPieceType(this.position[row][col]) != PieceType.KING && getPieceType(this.position[row][col]) != PieceType.PAWN) {

                                        if (getPieceSideFromCode(this.position[row][col]) === this.side.enemy) {
                                            KingCheckPathPoints.set(row + '' + col, { row: row, col: col });
                                            checkCount++;
                                            this.kingIsInCheck = true;
                                            this.isolatedKingCheckPathPoints = new Map([...this.isolatedKingCheckPathPoints, ...KingCheckPathPoints])
                                        }
                                    }
                                }

                                if (AllyPiecesInPathSigniture.length === 1) {
                                    pathKingMap.set(AllyPiecesInPathSigniture[0].row.toString() + AllyPiecesInPathSigniture[0].col.toString(), p.signiture)
                                    break
                                }
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
            for (const path of knightPath) {
                let targetRow = this.side.king_position.row + path.rowShift
                let targetCol = this.side.king_position.col + path.colShift
                if (bounds(targetRow) && bounds(targetCol)) {
                    if (getPieceSideFromCode(this.position[targetRow][targetCol]) === this.side.enemy) {
                        if (getPieceType(this.position[targetRow][targetCol]) === PieceType.KNIGHT) {
                            checkCount++;
                            this.isolatedKingCheckPathPoints.set(targetRow + '' + targetCol, { row: targetCol, col: targetCol })
                        }
                    }
                }
            }
            if (checkCount === 1) {
                this.kingIsInCheck = true;
            }
            if (checkCount > 1) {
                this.kingIsInDoubleCheck = true;
            }
        }
        return pathKingMap;
    }


    public getPiecePathing(pieceType: PieceType): Path[] {
        switch (pieceType) {
            case PieceType.ROOK: return rookPath;
            case PieceType.BISHOP: return bishopPath;
            case PieceType.QUEEN: return queenPath;
            case PieceType.KNIGHT: return knightPath;
            default: return []
        }
    }

    public pathSignitureMatch(enemyPath: Piece, source: PathSigniture): boolean {
        return getPiecePathSigniture(enemyPath).includes(source);
    }

    public switch_side() {
        this.kingIsInCheck = false;
        this.kingIsInDoubleCheck = false;
        this.kingPathSigniturePointsToIsolate = undefined;
        this.side.switch();
    }
    public move_piece(move: Move): boolean {

        switch (move.movetype) {
            case MoveType.Capture: {
                this.position[move.to.row][move.to.col] = this.position[move.from.row][move.from.col];
                this.position[move.from.row][move.from.col] = Piece.e;

            } break;
            case MoveType.Default: {
                this.position[move.to.row][move.to.col] = this.position[move.from.row][move.from.col];
                this.position[move.from.row][move.from.col] = Piece.e;
            } break
            case MoveType.KingSideCastle: {
                this.position[move.to.row][move.to.col] = this.position[move.from.row][move.from.col];
                this.position[move.to.row][move.to.col - 1] = this.position[move.to.row][Boundary.Max];
                this.position[move.from.row][move.from.col] = Piece.e;
                this.position[move.to.row][Boundary.Max] = Piece.e;

            } break;
            case MoveType.QueenSideCastle: {
                this.position[move.to.row][move.to.col] = this.position[move.from.row][move.from.col];
                this.position[move.to.row][move.to.col + 1] = this.position[move.to.row][Boundary.Min];
                this.position[move.from.row][move.from.col] = Piece.e;
                this.position[move.to.row][Boundary.Min] = Piece.e;
            } break;
            default: return false;
        }
        if (move.promote) {
            this.position[move.to.row][move.to.col] = this.getPieceFromPieceType(move.promote)
        }
        if (move.piecetype === PieceType.KING) {
            this.side.ally === SideColor.WHITE ? this.side.whiteKingPosition = move.to : this.side.blackKingPosition = move.to;
        }

        this.switch_side();
        this.isolatedKingCheckPathPoints = new Map();
        this.legalmoves = this.findLegalMoves();
        return true;
    }
    public getPieceFromPieceType(piece_type: PieceType): Piece {
        if (this.side.ally === SideColor.WHITE) {
            switch (piece_type) {
                case PieceType.QUEEN: return (Piece.Q);
                case PieceType.ROOK: return (Piece.R);
                case PieceType.BISHOP: return (Piece.B);
                case PieceType.KNIGHT: return (Piece.N);
                case PieceType.PAWN: return (Piece.P);
                default: return Piece.e;
            }

        } else {
            switch (piece_type) {
                case PieceType.QUEEN: return (Piece.q);
                case PieceType.ROOK: return (Piece.r);
                case PieceType.BISHOP: return (Piece.b);
                case PieceType.KNIGHT: return (Piece.n);
                case PieceType.PAWN: return (Piece.p);
                default: return Piece.e;
            }
        }
    }
}

