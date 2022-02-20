/*
pseudocode

dice rolls:
loop for how many dice rolls are available
for every rolls, push value into an array
return that array, use returned array to format output

score rolls:
take dice roll array as parameter
sort that array, it's fine to use default sort as of now (values are single digits only), highest or lowest
put that and stringify numbers, and add it as a string
change string to number 
push number onto score array

standard game:
at init, default to player 1 to play the next round
next click is when first player rolls
following clicks after that is when the other players roll
scorecheck all rolls
highest/lowest number wins, add into highscore array

scorechecking:
use max or min function, depending on what dice mode
find index which is max or min
return the index of the winner

knockout game:
at init, randomize 2 players from player array to come out and play
next click is when first player rolls
next click is when the second player rolls
scorecheck the two rolls
kick losing player off the player list
randomize another pair of players to play

*/

//global constant initialisation

//mode values
const HIGHEST_MODE = "highest";
const LOWEST_MODE = "lowest";
const STANDARD_MODE = "standard";
const KNOCKOUT_MODE = "knockout";

//return messages
const RESET_MSG = "Game is reset! <br> If you want to play again, press start!";

//global variable initialisation
//values to take from the html
var playerNum = "";
var diceNum = "";
var diceMode = "";
var gameMode = "";

//game variable initialisation
var currentPlayer;

//game array initialisation
var playerArray = [];
var resultArray = [];
var highScoreArray = [];

//helper function initialisation

/***
 * simulates a dice roll
 * @returns {number} a random number between 1-6
 */
var randomizeDiceRoll = function () {
  return Math.floor(Math.random() * 6) + 1;
};

/***
 * initializes game and sets global variables
 * @param {number} playerAmt the amount of players playing the game
 * @param {number} diceAmt the number of dice for the game
 * @param {string} diceSetting the string value of the dice mode (highest/lowest)
 * @param {string} gameSetting the string value of the game mode (standard/knockout)
 * @returns {string} game initialised display
 */
var gameInitialize = function (playerAmt, diceAmt, diceSetting, gameSetting) {
  playerNum = playerAmt;
  diceNum = diceAmt;
  diceMode = diceSetting;
  gameMode = gameSetting;

  //added a number in the player array to signify player counter
  //added a 0 in the highscore array to signify highscore
  //added a 0 in the result array to symbolise the current roll score
  for (i = 0; i < playerNum; i += 1) {
    playerArray.push(i + 1);
    highScoreArray.push(0);
    resultArray.push(0);
  }

  //sets the current player
  if (gameMode == STANDARD_MODE) currentPlayer = playerArray[0];

  return `Game is set: <br> Total Players ${playerNum} <br> Total Dice: ${diceNum} <br> Dice Mode: ${diceMode} <br> Game Mode: ${gameMode}`;
};

/***
 * resets game and erases the values of the global variables
 * @returns {string} game reset display
 */
var gameReset = function () {
  playerNum = "";
  diceNum = "";
  diceMode = "";
  gameMode = "";
  currentPlayer = "";

  //changes array length to 0, effectively emptying the array
  playerArray.length = 0;
  resultArray.length = 0;
  highScoreArray.length = 0;

  return RESET_MSG;
};

/***
 * Playe a roll of the game, rolls dice according to how much dice are in the game
 * @returns {Array} an array of all the rolls of the player
 */
var rollDice = function () {
  var diceRolls = [];
  for (i = 0; i < diceNum; i += 1) {
    diceRolls.push(randomizeDiceRoll());
  }
  return diceRolls;
};

/***
 * Plays standard game and it goes on every single time the function is triggered
 * @returns {string} Result of the current roll for output
 */
var playStandardGame = function () {
  var outputMsg = `Player ${currentPlayer} has thrown the dice! <br><br>`;
  var currentPlayerRoll = rollDice();
  for (var i = 0; i < currentPlayerRoll.length; i += 1) {
    outputMsg += `Dice ${i + 1}: ${currentPlayerRoll[i]}<br>`;
  }

  //sorting the array, normal string sort can be applied because values are only single digit
  //if playing with a dice of more than 2 digits, need to update this code with a compare function
  //this will sort smallest to biggest number
  currentPlayerRoll.sort();
  //reverses the array if it's playing the highest mode, hence biggest to smallest
  if (diceMode == HIGHEST_MODE) currentPlayerRoll.reverse();

  var playerScore = "";

  //string variable does not add the numbers, it concactenates the string
  for (var i = 0; i < currentPlayerRoll.length; i += 1) {
    playerScore += String(currentPlayerRoll[i]);
  }

  //assigns the current player's score to the resultArray
  currentPlayerIndex = playerArray.indexOf(currentPlayer);
  resultArray[currentPlayerIndex] = Number(playerScore);

  outputMsg += `<br> The ${diceMode} possible score is ${playerScore}`;

  //initialize next Player's index
  var nextPlayerIndex = playerArray.indexOf(currentPlayer) + 1;

  //if next player's index is still within the array range, assign the next player as the current player
  if (nextPlayerIndex < playerArray.length) {
    currentPlayer = playerArray[nextPlayerIndex];
    outputMsg += `<br><br> It's Player ${currentPlayer}'s Turn now!`;
    return outputMsg;
  }

  //if it's not within the array range, means all player has taken a turn, output will reflect who win
  var winningPlayerScore;

  if (diceMode == HIGHEST_MODE) winningPlayerScore = Math.max(...resultArray);
  else if (diceMode == LOWEST_MODE)
    winningPlayerScore = Math.min(...resultArray);

  var winningPlayerIndex = resultArray.indexOf(winningPlayerScore);

  outputMsg += `<br><br>With a score of ${resultArray[winningPlayerIndex]}, Player ${playerArray[winningPlayerIndex]} Wins this round!`;

  //win state, add the highscore of the winning player
  highScoreArray[winningPlayerIndex] += 1;

  var currentHighScore = Math.max(...highScoreArray);
  var highScoreIndex = highScoreArray.indexOf(currentHighScore);
  outputMsg += `<br><br>With ${currentHighScore} win, Player ${playerArray[highScoreIndex]} is currently leading the pack!`;

  //TO ADD: leaderboard sort function here
  outputMsg += `<br>add the leaderboard`;

  //reset resultArray to have 0 values all around
  for (var i = 0; i < resultArray.length; i += 1) resultArray[i] = 0;
  //also resets current player to be index 0
  currentPlayer = playerArray[0];

  return outputMsg;
};

var main = function () {
  var myOutputValue;
  if (gameMode == STANDARD_MODE) myOutputValue = playStandardGame();
  return myOutputValue;
};
