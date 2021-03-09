import {
    PawnDirection,
    Point,
    SideColor,
} from './static/definitions'

import {
    _emptyPosition, 
} from './static/constants';

export default class Side {
    public current: SideColor|undefined;
    public ally : SideColor = SideColor.WHITE
    public enemy: SideColor|undefined;
    public blackKingPosition: Point = { row: -1, col: -1 }
    public whiteKingPosition: Point = { row: -1, col: -1 }
    public whiteKingStartPosition: Point = { row: 7, col: 4 }
    public blackKingStartPosition: Point = { row: 7, col: 4 }
    public whiteKingHasMoved: boolean = false;
    public blackKingHasMoved: boolean = false;
    public whiteKingRookHasMoved: boolean = false;
    public whiteQueenRookHasMoved: boolean = false;
    public blackKingRookHasMoved: boolean = false;
    public blackQueenRookHasMoved: boolean = false;
    public white_can_kingside_castle : boolean = true;
    public white_can_queenside_catyle: boolean = true;
    public black_can_kingside_castle : boolean = true;
    public black_can_queenside_catyle: boolean = true; 
    public half_move_count : number = 0;
    public full_move_count : number = 0;
    public enpassant_point : Point|undefined;
    public white_pawn_direction= PawnDirection.up
    public black_pawn_direction = PawnDirection.down;
    public get king_position(): Point {
        
        switch (this.ally) {
            case SideColor.WHITE: return this.whiteKingPosition
            case SideColor.BLACK: return this.blackKingPosition
            default: return { row: -1, col: -1 };
        }
    }
    public switch(){
        if (this.ally === SideColor.WHITE){
            this.ally = SideColor.BLACK 
            this.enemy = SideColor.WHITE           
        }else{
            this.ally = SideColor.WHITE 
            this.enemy = SideColor.BLACK
        }
       
    }
    get kingCanCastleQueenside(): boolean {
        if (this.ally === SideColor.WHITE) {
            if (this.whiteKingHasMoved === false && this.whiteQueenRookHasMoved === false) {
                return true;
            } return false;
        } else {
            if (this.blackKingHasMoved === false && this.blackQueenRookHasMoved === false) {
                return true;
            } return false;
        }
    }
    get kingCanCastleKingSide(): boolean {

        if (this.ally === SideColor.WHITE) {
            if (this.whiteKingHasMoved === false && this.whiteKingRookHasMoved === false) {
                return true;
            } return false;
        } else {
            if (this.blackKingHasMoved === false && this.blackKingRookHasMoved === false) {
                return true;
            } return false;
        }
    }

}