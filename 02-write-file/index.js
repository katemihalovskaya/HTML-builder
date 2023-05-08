const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create a readline interface for reading user input from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Create a writable stream to write user input to a text file
const folderPath = '02-write-file';
const fileName = 'input.txt';

const filePath = path.join(folderPath, fileName);
const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

// Display a welcome message
console.log('Welcome! Enter text or type "exit" to quit.\n');

// Handle user input
rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    // Close the stream and exit the program if the user enters "exit"
    fileStream.end();
    console.log('Goodbye!');
    process.exit();
  } else {
    // Write the user's input to the text file and prompt for more input
    fileStream.write(input + '\n');
    console.log('Enter the next line:');
  }
});

// Handle program exit
// process.on('SIGINT', () => {
//   // Close the stream and exit the program if the user presses ctrl + c
//   console.log('\nGoodbye!');
  
//   fileStream.end();
//   process.exit(); 
// });

// does work
process.stdin.on('data', (data) => {
  if (data.toString() === '\u0003') {
    console.log('Goodbye!');
    fileStream.end();
    process.exit();
  }
});
