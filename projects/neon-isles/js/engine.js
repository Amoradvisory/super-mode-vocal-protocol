export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

const PIECE_TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
const SHAPES = {
  I: [[[0,1],[1,1],[2,1],[3,1]],[[2,0],[2,1],[2,2],[2,3]],[[0,2],[1,2],[2,2],[3,2]],[[1,0],[1,1],[1,2],[1,3]]],
  J: [[[0,0],[0,1],[1,1],[2,1]],[[1,0],[2,0],[1,1],[1,2]],[[0,1],[1,1],[2,1],[2,2]],[[1,0],[1,1],[0,2],[1,2]]],
  L: [[[2,0],[0,1],[1,1],[2,1]],[[1,0],[1,1],[1,2],[2,2]],[[0,1],[1,1],[2,1],[0,2]],[[0,0],[1,0],[1,1],[1,2]]],
  O: [[[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]]],
  S: [[[1,0],[2,0],[0,1],[1,1]],[[1,0],[1,1],[2,1],[2,2]],[[1,1],[2,1],[0,2],[1,2]],[[0,0],[0,1],[1,1],[1,2]]],
  T: [[[1,0],[0,1],[1,1],[2,1]],[[1,0],[1,1],[2,1],[1,2]],[[0,1],[1,1],[2,1],[1,2]],[[1,0],[0,1],[1,1],[1,2]]],
  Z: [[[0,0],[1,0],[1,1],[2,1]],[[2,0],[1,1],[2,1],[1,2]],[[0,1],[1,1],[1,2],[2,2]],[[1,0],[0,1],[1,1],[0,2]]],
};
const SPEEDS = { relax: 950, standard: 760, dynamic: 610 };
export function createEmptyBoard() { return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null)); }
export function clearCompletedLines(board) { const remaining = board.filter((row) => row.some((cell) => cell === null)); const lines = BOARD_HEIGHT - remaining.length; const emptyRows = Array.from({ length: lines }, () => Array(BOARD_WIDTH).fill(null)); return { board: [...emptyRows, ...remaining.map((row) => [...row])], lines }; }
export function scoreForClear(lines, level) { const table = [0,100,300,500,800]; return (table[lines] ?? 0) * (level + 1); }
export function getDropInterval(level, difficulty = 'relax') { const base = SPEEDS[difficulty] ?? SPEEDS.relax; return Math.max(150, base - level * 55); }
function shuffledBag(random) { const items=[...PIECE_TYPES]; for(let i=items.length-1;i>0;i-=1){const j=Math.floor(random()*(i+1)); [items[i],items[j]]=[items[j],items[i]];} return items; }
function clonePiece(piece){return {...piece};}
function spawnPiece(type){return {type,x:3,y:-1,rotation:0};}
export function pieceCells(piece, rotation = piece.rotation){return SHAPES[piece.type][rotation%4].map(([x,y])=>[piece.x+x,piece.y+y]);}
export function collides(board,piece,x=piece.x,y=piece.y,rotation=piece.rotation){const candidate={...piece,x,y,rotation}; return pieceCells(candidate).some(([cellX,cellY])=>{if(cellX<0||cellX>=BOARD_WIDTH||cellY>=BOARD_HEIGHT)return true; if(cellY<0)return false; return board[cellY][cellX]!==null;});}
export class Game {
  constructor({random=Math.random,difficulty='relax'}={}){this.random=random;this.difficulty=difficulty;this.reset();}
  reset(){this.board=createEmptyBoard();this.queue=[];this.active=null;this.holdType=null;this.canHold=true;this.score=0;this.lines=0;this.level=0;this.paused=false;this.gameOver=false;this.lastClear=0;this.#fillQueue();this.#spawnNext();}
  setDifficulty(difficulty){if(SPEEDS[difficulty])this.difficulty=difficulty;}
  get dropInterval(){return getDropInterval(this.level,this.difficulty);}
  get nextTypes(){this.#fillQueue();return this.queue.slice(0,3);}
  get ghostY(){if(!this.active)return 0;let y=this.active.y;while(!collides(this.board,this.active,this.active.x,y+1,this.active.rotation))y+=1;return y;}
  move(dx,dy){if(this.paused||this.gameOver||!this.active)return false;const nextX=this.active.x+dx,nextY=this.active.y+dy;if(collides(this.board,this.active,nextX,nextY,this.active.rotation))return false;this.active.x=nextX;this.active.y=nextY;return true;}
  rotate(direction=1){if(this.paused||this.gameOver||!this.active)return false;if(this.active.type==='O')return true;const target=(this.active.rotation+direction+4)%4;for(const dx of [0,-1,1,-2,2]){if(!collides(this.board,this.active,this.active.x+dx,this.active.y,target)){this.active.x+=dx;this.active.rotation=target;return true;}}return false;}
  softDrop(){if(this.paused||this.gameOver)return false;if(this.move(0,1)){this.score+=1;return true;}this.#lockActive();return false;}
  tick(){if(this.paused||this.gameOver)return false;if(this.move(0,1))return true;this.#lockActive();return false;}
  hardDrop(){if(this.paused||this.gameOver||!this.active)return 0;let distance=0;while(this.move(0,1))distance+=1;this.score+=distance*2;this.#lockActive();return distance;}
  hold(){if(this.paused||this.gameOver||!this.active||!this.canHold)return false;const currentType=this.active.type;if(this.holdType===null){this.holdType=currentType;this.#spawnNext();}else{const swap=this.holdType;this.holdType=currentType;this.active=spawnPiece(swap);if(collides(this.board,this.active))this.gameOver=true;}this.canHold=false;return true;}
  togglePause(){if(this.gameOver)return false;this.paused=!this.paused;return this.paused;}
  snapshot(){return {board:this.board.map((row)=>[...row]),active:this.active?clonePiece(this.active):null,holdType:this.holdType,nextTypes:this.nextTypes,score:this.score,lines:this.lines,level:this.level,paused:this.paused,gameOver:this.gameOver,ghostY:this.ghostY,dropInterval:this.dropInterval,difficulty:this.difficulty,lastClear:this.lastClear};}
  #fillQueue(){while(this.queue.length<7)this.queue.push(...shuffledBag(this.random));}
  #spawnNext(){this.#fillQueue();this.active=spawnPiece(this.queue.shift());this.#fillQueue();if(collides(this.board,this.active))this.gameOver=true;}
  #lockActive(){if(!this.active)return;for(const [x,y] of pieceCells(this.active)){if(y<0){this.gameOver=true;return;}this.board[y][x]=this.active.type;}const cleared=clearCompletedLines(this.board);this.board=cleared.board;this.lastClear=cleared.lines;if(cleared.lines>0){this.score+=scoreForClear(cleared.lines,this.level);this.lines+=cleared.lines;this.level=Math.floor(this.lines/10);}this.canHold=true;this.#spawnNext();}
}
