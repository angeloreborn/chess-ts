import {
    Piece, 
    PieceType, 
    Boundary, 
    PathSigniture, 
    SideColor
} from './definitions';

export function getPieceSideFromCode(piece: Piece): SideColor|undefined {
    switch (piece) {
        case Piece.k: return SideColor.BLACK;
        case Piece.q: return SideColor.BLACK;
        case Piece.r: return SideColor.BLACK;
        case Piece.b: return SideColor.BLACK;
        case Piece.n: return SideColor.BLACK;
        case Piece.p: return SideColor.BLACK;
        case Piece.K: return SideColor.WHITE;
        case Piece.N: return SideColor.WHITE;
        case Piece.Q: return SideColor.WHITE;
        case Piece.R: return SideColor.WHITE;
        case Piece.B: return SideColor.WHITE;
        case Piece.P: return SideColor.WHITE;
        default: return undefined;
    }
}

export function getPieceCode(piece: string) {
    switch (piece) {
        case 'K': return Piece.K;
        case 'Q': return Piece.Q;
        case 'R': return Piece.R;
        case 'B': return Piece.B;
        case 'N': return Piece.N;
        case 'P': return Piece.P;
        case 'k': return Piece.k;
        case 'q': return Piece.q;
        case 'r': return Piece.r;
        case 'b': return Piece.b;
        case 'n': return Piece.n;
        case 'p': return Piece.p;
        default: return Piece.e;
    }
}

export function getPieceString(piece: Piece) {
    switch (piece) {
        case Piece.K: return 'K';
        case Piece.Q: return 'Q';
        case Piece.R: return 'R';
        case Piece.B: return 'B';
        case Piece.N: return 'N';
        case Piece.P: return 'P';
        case Piece.k: return 'k';
        case Piece.q: return 'q';
        case Piece.r: return 'r';
        case Piece.b: return 'b';
        case Piece.n: return 'n';
        case Piece.p: return 'p';
        case Piece.e: return '1';
    }
}

export function bounds(num: number) {
    if (num >= Boundary.Min && num <= Boundary.Max) return true;
    return false
}

export function getPieceType(piece: Piece) {
    switch (piece) {
        case Piece.K: return PieceType.KING
        case Piece.Q: return PieceType.QUEEN
        case Piece.R: return PieceType.ROOK
        case Piece.B: return PieceType.BISHOP
        case Piece.N: return PieceType.KNIGHT
        case Piece.P: return PieceType.PAWN
        case Piece.k: return PieceType.KING
        case Piece.q: return PieceType.QUEEN
        case Piece.r: return PieceType.ROOK
        case Piece.b: return PieceType.BISHOP
        case Piece.n: return PieceType.KNIGHT
        case Piece.p: return PieceType.PAWN;
        default: return PieceType.EMPTY
    }
}

export function getPiecePathSigniture(piece: Piece): PathSigniture[] {
    switch (piece) {
        case Piece.k: return [PathSigniture.Vertical, PathSigniture.Horizontal, PathSigniture.NegativeSlope, PathSigniture.PositiveSlope]
        case Piece.q: return [PathSigniture.Vertical, PathSigniture.Horizontal, PathSigniture.NegativeSlope, PathSigniture.PositiveSlope]
        case Piece.r: return [PathSigniture.Vertical, PathSigniture.Horizontal]
        case Piece.b: return [PathSigniture.NegativeSlope, PathSigniture.PositiveSlope]
        case Piece.n: return [PathSigniture.Default]
        case Piece.p: return [PathSigniture.PositiveSlope, PathSigniture.NegativeSlope]
        case Piece.K: return [PathSigniture.Vertical, PathSigniture.Horizontal, PathSigniture.NegativeSlope, PathSigniture.PositiveSlope]
        case Piece.N: return [PathSigniture.Default]
        case Piece.Q: return [PathSigniture.Vertical, PathSigniture.Horizontal, PathSigniture.NegativeSlope, PathSigniture.PositiveSlope]
        case Piece.R: return [PathSigniture.Vertical, PathSigniture.Horizontal]
        case Piece.B: return [PathSigniture.NegativeSlope, PathSigniture.PositiveSlope]
        case Piece.P: return [PathSigniture.PositiveSlope, PathSigniture.NegativeSlope];
    }
    return [PathSigniture.Default];
}

export function getFenSymbolExpansion(s: string) {
    switch (s) {
        case '1': return '1';
        case '2': return '11';
        case '3': return '111';
        case '4': return '1111';
        case '5': return '11111';
        case '6': return '111111';
        case '7': return '1111111';
        case '8': return '11111111';
        case '/': return '';
        case 'K': return s;
        case 'Q': return s;
        case 'R': return s;
        case 'B': return s;
        case 'N': return s;
        case 'P': return s;
        case 'k': return s;
        case 'q': return s;
        case 'r': return s;
        case 'b': return s;
        case 'n': return s;
        case 'p': return s;
        default: return '1';
    }
}


