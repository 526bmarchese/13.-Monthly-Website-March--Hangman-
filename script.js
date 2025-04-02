// List of words for the game
const wordList = [
  'gold',
  'luck',
  'clover',
  'rain',
  'charm',
  'parade',
  'leprechaun',
  'treasure',
  'celebration',
  'greenery',
  'shenanigans',
  'tradition'
]

// Set up the basic stuff we need
let selectedWord = '' // the word player needs to guess
let displayedWord = '' // shows _ _ _ for unguessed letters
let wrongGuesses = 0 // counts wrong guesses
let guessedLetters = [] // keeps track of letters already guessed
const maxMistakes = 6 // player loses after 6 wrong guesses
let wins = 0 // track wins
let losses = 0 // track losses

// A function that updates score display
function updateScoreDisplay() {
  document.querySelector('.wins').textContent = `Wins: ${wins}`
  document.querySelector('.losses').textContent = `Losses: ${losses}`
}

// This starts the game when you pick a difficulty
function startGame(level) {
  // Reset everything to start fresh
  wrongGuesses = 0
  guessedLetters = []

  // Pick a random word based on difficulty
  selectedWord = getRandomWord(level)
  // Make the display show _ for each letter
  displayedWord = '_'.repeat(selectedWord.length)

  // Update the screen
  updateDifficultyDisplay(level)
  updateUI()
  
  // Show/hide the right stuff on screen
  document.getElementById('gameArea').classList.remove('d-none')
  document.getElementById('gameArea').classList.add('d-block')
  document.getElementById('difficultyBox').classList.remove('d-none')
  document.getElementById('difficultyBox').classList.add('d-block')
  document.getElementById('difficultySelection').classList.add('d-none')
  
  // Make the input box ready to type
  document.getElementById('letterInput').focus()
}

// Pick a random word based on how hard you want it
function getRandomWord(level) {
  let filteredWords = wordList.filter(word => {
      if (level === 'easy') return word.length <= 4 // short words
      if (level === 'medium') return word.length >= 5 && word.length <= 7 // medium words
      if (level === 'hard') return word.length >= 8 // long words
  })
  return filteredWords[Math.floor(Math.random() * filteredWords.length)]
}

// Show how hard the game is
function updateDifficultyDisplay(level) {
  let difficultyBox = document.getElementById('difficultyBox')
  difficultyBox.classList.remove('easy', 'medium', 'hard')

  // Add the right color and emoji
  if (level === 'easy') {
      difficultyBox.textContent = 'Difficulty: Easy 🍀'
      difficultyBox.classList.add('easy')
  } else if (level === 'medium') {
      difficultyBox.textContent = 'Difficulty: Medium 🌟'
      difficultyBox.classList.add('medium')
  } else if (level === 'hard') {
      difficultyBox.textContent = 'Difficulty: Hard 💀'
      difficultyBox.classList.add('hard')
  }
}

// Update what's shown on screen
function updateUI() {
  document.getElementById('wordDisplay').textContent = displayedWord.split('').join('  ')
}

// When player guesses a letter
function guessLetter() {
  let inputField = document.getElementById('letterInput')
  let guessedLetter = inputField.value.toLowerCase()

  // Make sure it's a real letter
  if (!guessedLetter.match(/^[a-z]$/)) {
      alert('Please enter a valid letter (A-Z)!')
      inputField.value = ''
      return
  }

  // Check if letter was already used
  if (guessedLetters.includes(guessedLetter)) {
      alert(`You already guessed '${guessedLetter}'. Try a different letter!`)
      inputField.value = ''
      return
  }

  // Add letter to used letters list
  guessedLetters.push(guessedLetter)

  // Check if guess was right or wrong
  if (selectedWord.includes(guessedLetter)) {
      updateCorrectGuess(guessedLetter)
  } else {
      updateWrongGuess(guessedLetter)
  }

  // Clear and focus input box
  inputField.value = ''
  document.getElementById('letterInput').focus()
}

// Handle wrong guesses
function updateWrongGuess(guessedLetter) {
  wrongGuesses++
  document.getElementById('wrongLetters').textContent += `${guessedLetter}`

  // Check if player lost
  if (wrongGuesses === maxMistakes) {
      endGame(false)
  }
}

// Handle correct guesses
function updateCorrectGuess(guessedLetter) {
  let newDisplayedWord = ''

  // Show the correct letter in the word
  for (let i = 0; i < selectedWord.length; i++) {
      if (selectedWord[i] === guessedLetter) {
          newDisplayedWord += guessedLetter
      } else {
          newDisplayedWord += displayedWord[i]
      }
  }

  displayedWord = newDisplayedWord
  updateUI()

  // Check if player won
  if (!displayedWord.includes('_')) {
      endGame(true)
  }
}

// Show win/lose message
function endGame(won) {
  if (won) {
      wins++
  } else {
      losses++
  }
  updateScoreDisplay()
  
  let message = won
      ? '🎉 Congratulations! You guessed the word! 🍀'
      : `❌ Game Over! The word was "${selectedWord}".`

  const messageDiv = document.createElement('div')
  messageDiv.className = `alert ${won ? 'alert-success' : 'alert-danger'} mt-3`
  messageDiv.textContent = message
  document.getElementById('gameArea').appendChild(messageDiv)
}

// Start over
function restartGame() {
  // Clear everything
  document.getElementById('wordDisplay').textContent = ''
  document.getElementById('wrongLetters').textContent = ''
  
  // Remove any alert messages
  const alerts = document.querySelectorAll('.alert')
  alerts.forEach(alert => alert.remove())

  // Show/hide the right stuff
  document.getElementById('difficultySelection').classList.remove('d-none')
  document.getElementById('difficultySelection').classList.add('d-block')
  document.getElementById('gameArea').classList.remove('d-block')
  document.getElementById('gameArea').classList.add('d-none')
  document.getElementById('difficultyBox').classList.remove('d-block')
  document.getElementById('difficultyBox').classList.add('d-none')
}

// Make Enter key work for guessing
document.getElementById('letterInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
      guessLetter()
  }
})