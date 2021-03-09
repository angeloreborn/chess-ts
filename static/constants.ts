import { Piece, Position, MoveType, PathSigniture, PieceType, Path } from './definitions';

export const start_board_position: Position = [
    [Piece.r, Piece.n, Piece.b, Piece.q, Piece.k, Piece.b, Piece.n, Piece.r],
    [Piece.p, Piece.p, Piece.p, Piece.p, Piece.p, Piece.p, Piece.p, Piece.p],
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e],
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e],
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e],
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e],
    [Piece.P, Piece.P, Piece.P, Piece.P, Piece.P, Piece.P, Piece.P, Piece.P],
    [Piece.R, Piece.N, Piece.B, Piece.Q, Piece.K, Piece.B, Piece.N, Piece.R]]

export const _emptyPosition: Position = [
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e],
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e],
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e],
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e],
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e],
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e],
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e],
    [Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e, Piece.e]]

export const standardPawnPath = [
    { rowShift: +1, colShift: +0, moveType: MoveType.Default, signiture: PathSigniture.Vertical },
    { rowShift: +1, colShift: +1, moveType: MoveType.Capture, signiture: PathSigniture.PositiveSlope },
    { rowShift: +1, colShift: -1, moveType: MoveType.Capture, signiture: PathSigniture.NegativeSlope }]

export const specialPawnPath = [
    { rowShift: +2, colShift: +0, moveType: MoveType.Pawn2Up, signiture: PathSigniture.Vertical }]

export const rookPath: Path[] = [
    { rowShift: +1, colShift: +0, pathSigniture: PathSigniture.Vertical, pieceType: PieceType.ROOK },
    { rowShift: -1, colShift: +0, pathSigniture: PathSigniture.Vertical, pieceType: PieceType.ROOK },
    { rowShift: +0, colShift: +1, pathSigniture: PathSigniture.Horizontal, pieceType: PieceType.ROOK },
    { rowShift: +0, colShift: -1, pathSigniture: PathSigniture.Horizontal, pieceType: PieceType.ROOK }]

export const bishopPath = [
    { rowShift: -1, colShift: +1, pathSigniture: PathSigniture.PositiveSlope, pieceType: PieceType.BISHOP },
    { rowShift: +1, colShift: -1, pathSigniture: PathSigniture.PositiveSlope, pieceType: PieceType.BISHOP },
    { rowShift: +1, colShift: +1, pathSigniture: PathSigniture.NegativeSlope, pieceType: PieceType.BISHOP },
    { rowShift: -1, colShift: -1, pathSigniture: PathSigniture.NegativeSlope, pieceType: PieceType.BISHOP }]

export const queenPath = [
    { rowShift: +1, colShift: +0, pathSigniture: PathSigniture.Vertical, pieceType: PieceType.QUEEN },
    { rowShift: -1, colShift: +0, pathSigniture: PathSigniture.Vertical, pieceType: PieceType.QUEEN },
    { rowShift: +0, colShift: +1, pathSigniture: PathSigniture.Horizontal, pieceType: PieceType.QUEEN },
    { rowShift: +0, colShift: -1, pathSigniture: PathSigniture.Horizontal, pieceType: PieceType.QUEEN },
    { rowShift: -1, colShift: +1, pathSigniture: PathSigniture.PositiveSlope, pieceType: PieceType.QUEEN },
    { rowShift: +1, colShift: -1, pathSigniture: PathSigniture.PositiveSlope, pieceType: PieceType.QUEEN },
    { rowShift: +1, colShift: +1, pathSigniture: PathSigniture.NegativeSlope, pieceType: PieceType.QUEEN },
    { rowShift: -1, colShift: -1, pathSigniture: PathSigniture.NegativeSlope, pieceType: PieceType.QUEEN }]

export const knightPath = [
    { rowShift: +2, colShift: +1, pathSigniture: PathSigniture.Lshape, pieceType: PieceType.KNIGHT },
    { rowShift: +1, colShift: +2, pathSigniture: PathSigniture.Lshape, pieceType: PieceType.KNIGHT },
    { rowShift: +1, colShift: -2, pathSigniture: PathSigniture.Lshape, pieceType: PieceType.KNIGHT },
    { rowShift: +2, colShift: -1, pathSigniture: PathSigniture.Lshape, pieceType: PieceType.KNIGHT },
    { rowShift: -2, colShift: +1, pathSigniture: PathSigniture.Lshape, pieceType: PieceType.KNIGHT },
    { rowShift: -1, colShift: +2, pathSigniture: PathSigniture.Lshape, pieceType: PieceType.KNIGHT },
    { rowShift: -1, colShift: -2, pathSigniture: PathSigniture.Lshape, pieceType: PieceType.KNIGHT },
    { rowShift: -2, colShift: -1, pathSigniture: PathSigniture.Lshape, pieceType: PieceType.KNIGHT }]

 export const kingPath = [
        { rowShift: +1, colShift: +0, signiture: PathSigniture.Vertical, pieceType: PieceType.KING },
        { rowShift: -1, colShift: +0, signiture: PathSigniture.Vertical, pieceType: PieceType.KING },
        { rowShift: +0, colShift: +1, signiture: PathSigniture.Horizontal, pieceType: PieceType.KING },
        { rowShift: +0, colShift: -1, signiture: PathSigniture.Horizontal, pieceType: PieceType.KING },
        { rowShift: -1, colShift: +1, signiture: PathSigniture.PositiveSlope, pieceType: PieceType.KING },
        { rowShift: +1, colShift: -1, signiture: PathSigniture.PositiveSlope, pieceType: PieceType.KING },
        { rowShift: +1, colShift: +1, signiture: PathSigniture.NegativeSlope, pieceType: PieceType.KING },
        { rowShift: -1, colShift: -1, signiture: PathSigniture.NegativeSlope, pieceType: PieceType.KING }
    ]
export const start_position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; 