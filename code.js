let colores=['red','blue'];
let pos=[5,5,5,5,5,5,5];
let mat=new Array(6),move=0, movimi=0;
let player=1, WinPlayer=-1,cmp=0;
let isWinner=false, start=false;
let evaluation_table=[[3,4,5,7,5,4,3],[4,6,8,10,8,6,4],[5,8,11,13,11,8,5],[5,8,11,13,11,8,5],[4,6,8,10,8,6,4],[3,4,5,7,5,4,3]];
let hwin = document.querySelector('h4');
function createBoard(){
    for(let i=0;i<6;i++){
        mat[i]=new Array(7);
        for(let j=0;j<7;j++){
            mat[i][j]=-1;
            let casilla=document.createElement('div');
            casilla.style.backgroundColor='white';
            casilla.style.width= '50px';
            casilla.style.height='50px';
            casilla.style.borderRadius='50%';
            casilla.id=i.toString()+j.toString();
            casilla.addEventListener("click",function(){
                if(!isWinner) agregar(j);
            });
            document.getElementById('board').appendChild(casilla);
        }
    }
    // for(let i=0;i<7;i++){
    //     let boton=document.createElement('input');
    //     boton.type="button";
    //     boton.style.backgroundColor='gray';
    //     boton.style.width='50px';
    //     boton.style.height='50px';
    //     boton.style.borderRadius='50%';
    //     boton.addEventListener("click",function(){
    //         if(!isWinner) agregar(i);
    //     });
    //     document.getElementById('board').appendChild(boton);
    // }
}
createBoard();
function colorear(i,j,k){
    let casillas=document.getElementById(i.toString()+j.toString());
    casillas.style.backgroundColor=colores[k];
}
function ganador(b){
    let Winner=false;
    let cant;
    for(let k=0;k<6;k++){
        for(let i=0;i<=3;i++){
            cant=0;
            if(b[k][i]===-1) continue;
           for(let j=0;j<4;j++){
               if(b[k][i]===b[k][i+j]) cant++;
           }
           if(cant===4){
               WinPlayer=b[k][i];
               return true;
           }
        }
    }
    for(let k=0;k<7;k++){
        for(let i=0;i<=2;i++){
            if(b[i][k]===-1) continue; 
            cant=0;
            for(let j=0;j<4;j++){
                if(b[i][k]===b[i+j][k]) cant++;
            }
            if(cant===4){
                WinPlayer=b[i][k];
                return true;
            }
        }
    }
    for(let i=0;i<6;i++){
        for(let j=0;j<7;j++){
            if(i<=2 && j<=3 && b[i][j]!==-1){
                cant=0;
                for(let k=0;k<4;k++){
                    if(b[i][j]===b[i+k][j+k]) cant++;
                }
                if(cant===4){
                    WinPlayer=b[i][j];
                    return true;
                }
            }
            if(i<=2 && j>=3 && b[i][j]!==-1){
                cant=0;
                for(let k=0;k<4;k++){
                    if(b[i][j]===b[i+k][j-k]) cant++;
                }
                if(cant===4){
                    WinPlayer=b[i][j];
                    return true;
                }
            }
        }
    }
    return false;
}

// Funcion para agregar jugada de usuairo
function agregar(i){
    let j = pos[i];
    if(j == -1) return;
    move++;
    mat[j][i]=player;
    pos[i]--;
    colorear(j,i,player);
    if(ganador(mat)){
        isWinner = true;
        hwin.innerHTML="User Wins"
    }else if(move==42){
        hwin.innerHTML="Tie"
    }else{
        move_comp();
    }
}
function move_comp(){
    let best_move, best_res, alpha, beta;
        movimi=0;
        [best_res, best_move, alpha, beta] = minimax(mat, true, 7, -Infinity, Infinity);
        console.log(best_res)
        let j = pos[best_move];
        colorear(j,best_move,cmp);
        move++;
        mat[j][best_move]=cmp;
        pos[best_move]--;
        if(ganador(mat)){ 
            isWinner=true;
            hwin.innerHTML="Computer Wins"
        }else if(move==42){
            hwin.innerHTML="Tie";
        }
}



// Funcion minimax
function minimax(board, is_maximizing, depth, alpha, beta){
    if(ganador(board) || depth===0) return [validar(board, !is_maximizing),"", alpha, beta];
    let best_move = "", best_choice = (is_maximizing)? -Infinity:Infinity; 
    for(let i=0;i<7;i++){
        let j = pos[i];
        if(j == -1) continue;
        let new_board = new Array(6);
        copy_boards(board,new_board);
        if(best_move==="") best_move=i;
        new_board[j][i] = (is_maximizing)? 0:1;
        pos[i]--;
        // if(ganador(new_board)){pos[i]++;return (is_maximizing)? 1:-1;}
        let hypothetical_value = minimax(new_board,!is_maximizing, depth-1, alpha, beta)[0];
        //if(depth==6 && pos[5]==3) console.log("6 "+hypothetical_value);
        if(depth==10) console.log(hypothetical_value);
        pos[i]++;
        // movimi--;
        if(hypothetical_value>best_choice && is_maximizing){
            best_choice = hypothetical_value;
            best_move = i;
            alpha = Math.max(alpha,best_choice);
        }
        if(hypothetical_value<best_choice && !is_maximizing){
            best_choice = hypothetical_value;
            best_move = i;
            beta = Math.min(beta, best_choice);
        }
        
        if(alpha>=beta) break;
    }
    return [best_choice, best_move, alpha, beta];
}

function validar(board,is_maximizing){
    if(ganador(board)){
        return (is_maximizing)? Infinity: -Infinity;
    }
    if(no_more_moves(board)) return 0;
    let x_values = 0, o_values = 0;
    for(let i=0;i<6;i++){
        for(let j=0;j<7;j++){
            if(board[i][j]==0) x_values+=evaluation_table[i][j];
            if(board[i][j]==1) o_values += evaluation_table[i][j];
        }
    }
    return x_values - o_values;
}

function copy_boards(board, new_board){
    for(let i=0;i<6;i++){
        new_board[i] = new Array(7);
        for(let j=0;j<7;j++){
            new_board[i][j]=board[i][j];
        }
    }
}
function no_more_moves(board){
    for(let i=0;i<7;i++){
        if(board[0][i]==-1) return false;
    }
    return true;
}