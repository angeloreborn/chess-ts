# chess-ts
Chess module for programatically checking chess board move logic written in typescript

## Importing chess
```typescript
import { Chess } from '{chess.tsx path}';
```

## Setting up
Creates Chess board at default starting position
```typescript
let chess = new Chess();
```

Set custom start position
```typescript
let chess = new Chess('r1b1kbnr/pppp1ppp/2n1q3/8/3Pp1N1/4P3/PPP2PPP/RNBQKB1R w KQkq - 1 6');
```

## Get legal moves
Get all current legal moves, method call as:
```typescript
public get_moves(): Map<string, Move[]> {
            return this.board.get_moves()
        }
```
can be used as:
```typescript
import {Move} from './static/definitions';

let legal_moves : Map<string, Move[]> = chess.get_moves();
```

## Make move
Use `Move` in `Move[]` from legal_moves Map to pass into `chess.move()`
Get map as `row`+`col` as a string.

Example #1 Using Map.get(key:string)
```typescript
let moves_from_square : Move[] | undefined = legal_moves.get('11');
if (moves_from_square){
    let my_move = moves_from_square[0]; // Sample; only gets first move
    chess.move(my_move);
}else{
    // Move is undefined
}
```

## Make a custom move
```typescript
import {Move, MoveType, PieceType} from './static/definitions';
```
Create custom move
```typescript
let sample_move : Move = {
    name : 'Custom move',
    from : {
        row: 0,
        col: 1,
    },
    to : {
        row:1,
        col:2,
    },
    piecetype: PieceType.QUEEN,
    movetype: MoveType.Default
}
```
Call chess.move() with a Move type object
```typescript
let my_sample_move = chess.move(sample_move);
```
Check the response to validate if move was successfull
```typescript
if (my_sample_move === true)
{
    // Succeeded
}else{
    // Failed
}
```
