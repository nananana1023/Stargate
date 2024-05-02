const table = document.querySelector("table");

const size = 5;
let array = Array.from({ length: size }, () => Array(size).fill('-')); //matrix 

const items = ['Oasis', 'Oasis', 'Oasis', 'Drought', 'Item 1', 'Item 2', 'Item 3'];

 function findElementIndexes(matrix, target) {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (matrix[row][col] === target) {
        return { row, col };
      }
    }
  }
  return null;
}

function shuffleItems(){
  // Shuffle the items array for randomness
  for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
  }
}

function placeClues() {
  // Extract positions for each item
  const item1Position = findElementIndexes(array, 'Item 1');
  const item2Position = findElementIndexes(array, 'Item 2');
  const item3Position = findElementIndexes(array, 'Item 3');

  // Define a helper function to place clues for a given item
  function placeItemClues(position, item) {
    if (!position) return; // If the item position wasn't found, exit

    // Place clue to the RIGHT, if there's space
    if (position.col < 4) {
      for (let c = position.col + 1; c < 5; c++) {
        if (array[position.row][c] === '-') {
          array[position.row][c] = `${item} - clue_LEFT`;
          break;
        }
      }
    }

    // Place clue to the LEFT, if there's space
    if (position.col > 0) {
      for (let c = position.col - 1; c >= 0; c--) {
        if (array[position.row][c] === '-') {
          array[position.row][c] = `${item} - clue_RIGHT`;
          break;
        }
      }
    }

    // Place clue DOWN, if there's space
    if (position.row < 4) {
      for (let r = position.row + 1; r < 5; r++) {
        if (array[r][position.col] === '-') {
          array[r][position.col] = `${item} - clue_UP`;
          break;
        }
      }
    }

    // Place clue UP, if there's space
    if (position.row > 0) {
      for (let r = position.row - 1; r >= 0; r--) {
        if (array[r][position.col] === '-') {
          array[r][position.col] = `${item} - clue_DOWN`;
          break;
        }
      }
    }
  }

  // Place clues for each item based on its position
  placeItemClues(item1Position, 'Item 1');
  placeItemClues(item2Position, 'Item 2');
  placeItemClues(item3Position, 'Item 3');

  console.log(array);
}

  function placeItemsRandomly() {
    shuffleItems();
    let placedItems = 0;
    array[2][2]='Stargate';
    while (placedItems < items.length) {     
      let rowIndex = Math.floor(Math.random() * size);
      let colIndex = Math.floor(Math.random() * size);

      if (array[rowIndex][colIndex] === '-' && !(rowIndex===2 && colIndex===2) ) {
        array[rowIndex][colIndex] = items[placedItems++];
      }
    
    }
    placeClues();
  }

  function createTable() {
    placeItemsRandomly();
    table.innerHTML = '';

    array.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      row.forEach((cell, colIndex) => {
        const td = document.createElement('td');

        const img = document.createElement('img');
        if(cell=='Oasis' || cell=='Drought') 
        {
          img.src = `Assets/Oasis marker.png`;
        }
        td.appendChild(img);

        // If this cell is the middle, add the player
        if (rowIndex === 2 && colIndex === 2) {
          const stargateImg = document.createElement('img');
          stargateImg.src = 'Assets/Stargate.png';
          stargateImg.classList.add('stargate-img');
          td.appendChild(stargateImg);
  
          const playerImg = document.createElement('img');
          playerImg.src = 'Assets/Player.png';
          playerImg.id = 'player';
          playerImg.classList.add('player-img');
          playerImg.dataset.row = '2'; // The initial Y position (row index)
          playerImg.dataset.col = '2'; // The initial X position (column index)

         // const player1 = new Player(1,);

          td.appendChild(playerImg);
        }
  
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
  }

let foundItems=[];
let numPlayers;
let currentPlayerId=0;
let players=[];

class Player {
  constructor(id,name, water, moves,isActive) {
    this.id = id;
    this.name=name;
    this.water = water;
    this.moves = moves;
    this.isActive=isActive;
  }
}

function movePlayer(direction) {
  // Get the player's current position
  const player = document.querySelector('#player');
  let playerRow = parseInt(player.dataset.row, 10);
  let playerCol = parseInt(player.dataset.col, 10);

  // Calculate new position based on direction
  let newRow = playerRow;
  let newCol = playerCol;
  if (direction === 'up' && playerRow > 0) newRow--;
  if (direction === 'down' && playerRow < size - 1) newRow++;
  if (direction === 'left' && playerCol > 0) newCol--;
  if (direction === 'right' && playerCol < size - 1) newCol++;

  updatePlayers();

  if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
    const newCell = table.rows[newRow]?.cells[newCol];
    if (newCell) {
      newCell.appendChild(player);
      // Update the player's data-attributes for position
      player.dataset.row = newRow.toString();
      player.dataset.col = newCol.toString();
    }
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp') movePlayer('up');
  if (event.key === 'ArrowDown') movePlayer('down');
  if (event.key === 'ArrowLeft') movePlayer('left');
  if (event.key === 'ArrowRight') movePlayer('right');
  if (event.code === 'Space') dig();
});

function dig() {
  const player = document.querySelector('#player');
  let playerRow = parseInt(player.dataset.row, 10);
  let playerCol = parseInt(player.dataset.col, 10);
  
  let cellContent = array[playerRow][playerCol];

  let img = table.rows[playerRow].cells[playerCol].querySelector('img');
  img.src = 'Assets/' + cellContent + '.png';

  if(cellContent === 'Item 1') foundItems.push(1)
  if(cellContent === 'Item 2') foundItems.push(2)
  if(cellContent === 'Item 3') foundItems.push(3)

  if(cellContent==='Oasis')
  {
    players[currentPlayerId].water=6;
  }

  updatePlayers();
  if(foundItems.length===3)
    win();
}

function updatePlayers(){
  players[currentPlayerId].moves--;

  if(numPlayers===1) //single player 
  {
    if(players[currentPlayerId].water===0)
      lose();
    if(players[currentPlayerId].moves===0)
      players[currentPlayerId].moves=3;
  }

  if(players[currentPlayerId].moves===0) //A player's turn ends after using three actions
  {
    players[currentPlayerId].water--; //At the end of the round, the given player's water supply decreases by one

    if(players[currentPlayerId].water===0)
      lose();

    else   //next player
    {
      players[currentPlayerId].isActive=false;
      currentPlayerId = (currentPlayerId===numPlayers-1)?0:currentPlayerId+1;
      players[currentPlayerId].moves=3;
      //the current player is indicated 
      players[currentPlayerId].isActive=true;
    }
      
  }
  displayPlayersData();
  displayFoundItems();
  console.log(players[currentPlayerId])
  console.log("current: "+currentPlayerId)

}

function win() {
  var modal = document.getElementById("winModal");
  modal.style.display = "block";

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function lose() {
  var modal = document.getElementById("loseModal");
  modal.style.display = "block";

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}


function setPlayerNumberAndNames() {
  const dialog = document.getElementById('playerSetupDialog');
  const closeBtn = document.querySelector('.close');
  const confirmPlayersBtn = document.getElementById('confirmPlayers');

  dialog.style.display = "block"; //show dialogs

  // Close the dialog on clicking the close button or clicking outside of dialog 
  closeBtn.onclick = function() {
      dialog.style.display = "none";
  };
  window.onclick = function(event) {
      if (event.target == dialog) {
          dialog.style.display = "none";
      }
  };

  confirmPlayersBtn.onclick = function() {
      numPlayers = document.getElementById('numPlayers').value;
      const playerNamesInputs = document.getElementById('playerNamesInputs');
      const primaryWaterSupply = document.getElementById('primaryWaterSupply').value;

      if (numPlayers < 1 || numPlayers > 4) {
          alert("Invalid number of players. Please enter a number between 1 and 4.");
          return;
      }
      playerNamesInputs.innerHTML = '';

      //player names
      for (let i = 0; i < numPlayers; i++) {
          const input = document.createElement('input');
          input.type = 'text';
          input.id = `playerName${i}`;
          input.placeholder = `Player ${i + 1} Name`;
          playerNamesInputs.appendChild(input);
          playerNamesInputs.appendChild(document.createElement('br'));
      }

      const setNamesBtn = document.createElement('button');
      setNamesBtn.textContent = 'Set Names';
      playerNamesInputs.appendChild(setNamesBtn);

      setNamesBtn.onclick = function() {        
          for (let i = 0; i < numPlayers; i++) {
              const name = document.getElementById(`playerName${i}`).value;
              players.push(new Player(i, name, primaryWaterSupply, 3,false)); 
          }
          dialog.style.display = "none";
          players[0].isActive=true; //first player is playing
          displayPlayersData();
          displayFoundItems();
          startTimer();
      };
  };
}

function displayPlayersData() {
  const container = document.getElementById('players-container');
  container.innerHTML = ''; 

  players.forEach((player, index) => {
      // Create the card element and assign a player ID
      const card = document.createElement('div');
      card.className = 'player-card';
      card.dataset.playerId = index; // Store the player index (ID) in a data attribute

      //active player
      if (player.isActive) {
        card.classList.add('active-player');
      }

      //name
      const name = document.createElement('div');
      name.className = 'player-name';
      name.textContent = player.name;
      card.appendChild(name);

      //water
      const waterStats = document.createElement('div');
      waterStats.className = 'stats';

      const waterIcon = document.createElement('img');
      waterIcon.src = 'Assets/Water.png';
      waterIcon.className = 'icon';
      waterStats.appendChild(waterIcon);

      const waterCount = document.createElement('span');
      waterCount.textContent ="Water supply: "+ player.water;
      waterStats.appendChild(waterCount);

      card.appendChild(waterStats);

      //moves
      const moveStats = document.createElement('div');
      moveStats.className = 'stats';

      const moveIcon = document.createElement('img');
      moveIcon.src = 'Assets/Action Points.png';
      moveIcon.className = 'icon';
      moveStats.appendChild(moveIcon);

      const moveCount = document.createElement('span');
      moveCount.textContent ="Actions left: "+ player.moves;
      moveStats.appendChild(moveCount);

      card.appendChild(moveStats);

      container.appendChild(card);
  });
}

function displayFoundItems() {
  const container = document.getElementById('found-items');
  container.innerHTML = ''; 

  //found items
  const card = document.createElement('div');
  card.className = 'found-items-card';

  //elapsed time
  const timerContainer = document.createElement('div');
  timerContainer.id = 'game-timer';
  const timerLabel = document.createElement('span');
  timerLabel.textContent = 'Time Elapsed: ';
  const timerValue = document.createElement('span');
  timerValue.id = 'timer';
  timerValue.textContent = '00:00:00'; // Initial timer value
  timerContainer.appendChild(timerLabel);
  timerContainer.appendChild(timerValue);
  card.appendChild(timerContainer);

  const count = document.createElement('div');
  count.className = 'found-items-count';
  count.textContent = `Found Items: ${foundItems.length}`;
  card.appendChild(count);

  foundItems.forEach(element => {
    const itemImage = document.createElement('img');
    itemImage.src = `Assets/Item ${element}.png`;
    itemImage.className = 'found-item-icon';
    card.appendChild(itemImage);
  });
  container.appendChild(card);
}


let startTime;
let elapsedTime = 0;
let timerInterval;

function startTimer() {
  startTime = Date.now();
  
  timerInterval = setInterval(function() {
    elapsedTime = Date.now() - startTime;
    // Update the timer display in both locations
    const timerDisplays = document.querySelectorAll('#timer');
    timerDisplays.forEach(timerDisplay => {
      timerDisplay.textContent = formatTime(elapsedTime);
    });
  }, 1000);
}


function formatTime(time) {
  let date = new Date(time);
  let hours = date.getUTCHours().toString().padStart(2, '0');
  let minutes = date.getUTCMinutes().toString().padStart(2, '0');
  let seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

createTable();
setPlayerNumberAndNames();