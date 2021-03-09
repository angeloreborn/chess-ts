import Board from './Board'
import Side from './Side';
import { start_board_position} from './static/constants'

import { 
    Piece, 
    Point, 
    Position, 
    SideColor 
} from './static/definitions'

import { 
    getFenSymbolExpansion, 
    getPieceCode 
} from './static/functions'

export default function parse_fen(fen: string): Board {
    let fen_parts = fen.split(/ /);
    let fen_position = fen_parts[0];
    let fen_side = fen_parts[1];
    let fen_castling = fen_parts[2];
    let fen_enpassant = fen_parts[3];
    let fen_halfmove = fen_parts[4];
    let fen_fullmove = fen_parts[5];

    let position: Position = convert_string_to_board_position(fen_position);
    let side = new Side();

    let side_is_valid = check_side_match(fen_side);
    if (side_is_valid === false) throw new Error('Invalid Fen Format: Fen does not specify side');

    if (fen_side === 'w') {
        side.ally = SideColor.WHITE 
        side.enemy = SideColor.BLACK
    }
    if (fen_side === 'b') {
        side.ally = SideColor.BLACK 
        side.enemy = SideColor.WHITE
    }
   
    side.white_can_kingside_castle = fen_castling.includes('K');
    side.black_can_kingside_castle = fen_castling.includes('k');
    side.white_can_queenside_catyle = fen_castling.includes('Q');      
    side.black_can_queenside_catyle = fen_castling.includes('q');
    
    side.enpassant_point = convert_string_to_enpassant_point(fen_enpassant); 
    
    side.half_move_count = string_to_number(fen_halfmove);
    side.full_move_count = string_to_number(fen_fullmove);

    for (let row = 0; row < position.length; row++) {
        for (let col = 0; col < position[row].length; col++) {
            if (position[row][col] === Piece.K){
                side.whiteKingPosition = {row:row, col:col}
            }
            if (position[row][col] === Piece.k){
                side.blackKingPosition = {row:row, col:col}
            }           
        }       
    }
    return new Board(position, side);
}

function string_to_number(string:any): number{
    if (isNaN(string)) return 0;
    return parseInt(string);
}
function convert_string_to_board_position(position: string): Position {

    let new_position: Position = start_board_position;
    let clean_position = position.replace('/', '');
    let expanded_position = expand_position(clean_position);

    if (expanded_position.length != 64) throw Error('Invalid Fen format: Fen does not specify 64 positions');
       

    for (let row = 0, index = 0; row < new_position.length; row++) {
        for (let col = 0; col < new_position[row].length; col++, index++) {
            let piece_code = getPieceCode(expanded_position[index]);
            new_position[row][col] = piece_code;
        }
    }
    return new_position;
}

function expand_position(cleaned_position: string) {
    let expanded_fen = '';
    for (const char of cleaned_position) {
        let expanded_char = getFenSymbolExpansion(char);
        expanded_fen = expanded_fen + expanded_char;
    }
    return expanded_fen;
}

function check_side_match(side:string){
    switch(side.toLowerCase()){
        case 'w' : return true;
        case 'b' : return true;
        default : return false;
    }
}

function convert_string_to_enpassant_point(point: string): Point | undefined {
    if (point === '-') return undefined;
    if (point.length != 2) throw new Error('Invalid Fen Format: Enpassant not set');

    let row_number = get_row_number(point[1]);
    let col_number = get_column_number(point[0]);

    if (!row_number || !col_number) throw new Error('Invalid Fen Format: Incorrect enpassant point');

    return {row:row_number, col:col_number}
}

function get_column_number(col: string):number|null{
    switch (col){
        case 'c' :return 2;
        case 'e' :return 4;
        default : return null;
    }
}
function get_row_number(row:string):number|null{
    switch (row){
        case '1' :return 0;
        case '2' :return 1;
        case '3' :return 2;
        case '4' :return 3;
        case '5' :return 4;
        case '6' :return 5;
        case '7' :return 6;
        case '8' :return 7;
        default : return null;
    }
}


