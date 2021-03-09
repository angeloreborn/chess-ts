import {
    Position, Move, Event, SideColor
} from './static/definitions'

import {
    start_position
} from './static/constants';

import Board from './Board';

import parse_fen from './Parser';


    export class Chess {

        protected board: Board;

        constructor(input_position?: string) {
            if (!input_position)this.board = parse_fen(start_position);
            else this.board = parse_fen(input_position);
        }

        public get_fen(): string {
            return this.board.get_fen()
        }

        public get_pgn(): object {
            return this.board.get_pgn();
        }

        public get_side(): SideColor {
            return this.board.get_side();
        }

        public take_back(): boolean{
            return this.board.take_back();
        }

        public get_moves(): Map<string, Move[]> {
            return this.board.get_moves()
        }

        public flip_board(): boolean {
            return this.board.flip_board();
        }

        public set_position(fen: string): void {
            this.board = parse_fen(fen);
        }

        public get_position(): Position{
            return this.board.get_position();
        }

        public on(event:Event, fn:Function){
            
        }

        public move(move: Move) : boolean{
            return this.board.move_piece(move);   
        }

        public reset(): void {
            this.board = parse_fen(start_position);
        }
    }


