const grid = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const restartBtn = document.getElementById('restart');

const icons = ['🍎','🍌','🍇','🍊','🍓','🥝']; // 6 pairs -> 12 cards
let deck = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;

function generateDeck(){
  deck = [...icons, ...icons];
  for(let i=deck.length-1;i>0;i--){
    const j = Math.floor(Math.random() * (i+1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function buildBoard(){
  grid.innerHTML = '';
  deck.forEach((val, idx)=>{
    const card = document.createElement('div');
    card.className = `
      relative w-full h-32 sm:h-40 cursor-pointer 
      transform transition duration-500 
      [transform-style:preserve-3d]
    `;
    card.dataset.value = val;

    const inner = document.createElement('div');
    inner.className = `
      absolute inset-0 
      [transition:transform_0.6s] 
      [transform-style:preserve-3d]
    `;

    const front = document.createElement('div');
    front.className = `
      absolute inset-0 bg-indigo-500 text-white flex items-center justify-center 
      text-4xl sm:text-5xl font-bold rounded-xl 
      [backface-visibility:hidden]
      [transform:rotateY(180deg)]
    `;
    front.textContent = val;

    const back = document.createElement('div');
    back.className = `
      absolute inset-0 bg-gray-200 flex items-center justify-center 
      text-3xl sm:text-4xl rounded-xl 
      [backface-visibility:hidden]
    `;
    back.textContent = '?';

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => {
      if (lockBoard) return;
      if (card === firstCard) return;

      card.classList.add('[transform:rotateY(180deg)]');
      inner.classList.add('[transform:rotateY(180deg)]');
      flipCard(card);
    });

    grid.appendChild(card);
  });
}

function flipCard(card){
  if(!firstCard){
    firstCard = card;
    return;
  }
  secondCard = card;
  moves++;
  movesEl.textContent = moves;

  checkMatch();
}

function checkMatch(){
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if(isMatch){
    matches++;
    matchesEl.textContent = matches;
    disableCards();

    if(matches === icons.length){
      setTimeout(() => alert(`🎉 You Won! Total Moves: ${moves}`), 300);
    }
  } else {
    lockBoard = true;
    setTimeout(() => unflipCards(), 800);
  }
}

function disableCards(){
  firstCard.style.pointerEvents = "none";
  secondCard.style.pointerEvents = "none";
  resetTurn();
}

function unflipCards(){
  firstCard.children[0].classList.remove('[transform:rotateY(180deg)]');
  secondCard.children[0].classList.remove('[transform:rotateY(180deg)]');

  firstCard.classList.remove('[transform:rotateY(180deg)]');
  secondCard.classList.remove('[transform:rotateY(180deg)]');

  resetTurn();
}

function resetTurn(){
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function start(){
  generateDeck();
  moves = 0;
  matches = 0;
  movesEl.textContent = moves;
  matchesEl.textContent = matches;
  buildBoard();
}

restartBtn.addEventListener('click', start);
start();