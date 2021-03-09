export type Point = { col: number, row: number }
export enum Piece { K, Q, R, N, B, P, k, q, r, n, b, p, e }
export enum PathSigniture { Horizontal, Vertical, PositiveSlope, NegativeSlope, Round, Lshape, Default }
export enum SignitureUp { One, Two }
export enum Boundary { Min = 0, Max = 7 }
export enum MoveType { EnPassant, QueenSideCastle, KingSideCastle, Capture, Default, Pawn2Up }
export enum PieceType { PAWN, QUEEN, ROOK, BISHOP, KNIGHT, KING, EMPTY }
export enum SpecialPawnStart { black = 1, white = 6 }
export enum PawnDirection { up = -1, down = 1 }
export enum BoardOrientation { WhiteFacingUp, WhiteFacingDown }
export enum SideColor {WHITE, BLACK}

export type Event = 'checkmate'|'stalemate'|'check'
export type Move = {name: string, movetype: MoveType, piecetype:PieceType,  to: Point, from: Point, promote?:PieceType}
export type Castling = 'KQkq' | 'KQk' | 'KQ' | 'K' | 'Q' | 'Qk' | 'Qkq' | 'kq' | 'q' | 'Kq' | 'Qq' | '';
export type Row = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Col = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Enp = Location | '-'
export type PieceString = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | number;
export type Sides = 'w' | 'b' | null;
export type Path = { rowShift: number, colShift: number, pathSigniture: PathSigniture, pieceType: PieceType }
export type PawnSigniture = SignitureUp;

export type Position = [
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]]
