export const sampleCodeSnippets = {
  fibonacci: `// Recursive Fibonacci function with debug output
let fibonacci = fn(n) {
  print("Computing fibonacci(", n, ")");
  if (n < 2) {
    print("Base case: fibonacci(", n, ") = ", n);
    return n;
  } else {
    let result = fibonacci(n - 1) + fibonacci(n - 2);
    print("fibonacci(", n, ") = ", result);
    return result;
  }
};

// Calculate the 8th Fibonacci number
print("=== Fibonacci Calculation ===");
let result = fibonacci(8);
print("Final result: fibonacci(8) =", result);
`,

  factorial: `// Factorial function with step-by-step output
let factorial = fn(n) {
  print("Computing factorial(", n, ")");
  if (n <= 1) {
    print("Base case: factorial(", n, ") = 1");
    return 1;
  } else {
    let result = n * factorial(n - 1);
    print("factorial(", n, ") =", n, "* factorial(", n-1, ") =", result);
    return result;
  }
};

// Calculate 5! with debug output
print("=== Factorial Calculation ===");
let result = factorial(5);
print("Final result: 5! =", result);
`,

  bubbleSort: `// Bubble Sort with visualization
let bubbleSort = fn(arr) {
  print("=== Bubble Sort Algorithm ===");
  print("Initial array:", arr);
  
  let n = len(arr);
  
  for (let i = 0; i < n - 1; i = i + 1) {
    print("\\nPass", i + 1, ":");
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j = j + 1) {
      print("Comparing", arr[j], "and", arr[j + 1]);
      
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
        print("  Swapped! Array now:", arr);
      } else {
        print("  No swap needed");
      }
    }
    
    if (!swapped) {
      print("No swaps in this pass - array is sorted!");
      break;
    }
  }
  
  print("\\nFinal sorted array:", arr);
  return arr;
};

let numbers = [64, 34, 25, 12, 22, 11, 90];
bubbleSort(numbers);
`,

  filterAndMap: `// Functional Programming: Filter and Map with debug output
let filter = fn(arr, predicate) {
  print("=== Filtering Array ===");
  print("Input array:", arr);
  
  let result = [];
  for (let i = 0; i < len(arr); i = i + 1) {
    let element = arr[i];
    let passes = predicate(element);
    print("Element", element, "passes filter:", passes);
    
    if (passes) {
      result = push(result, element);
    }
  }
  
  print("Filtered result:", result);
  return result;
};

let map = fn(arr, transform) {
  print("\\n=== Mapping Array ===");
  print("Input array:", arr);
  
  let result = [];
  for (let i = 0; i < len(arr); i = i + 1) {
    let original = arr[i];
    let transformed = transform(original);
    print("Transform", original, "->", transformed);
    result = push(result, transformed);
  }
  
  print("Mapped result:", result);
  return result;
};

let isEven = fn(x) { 
  let result = x % 2 == 0;
  return result;
};
let double = fn(x) { x * 2; };

let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let evenNumbers = filter(numbers, isEven);
let doubledEvens = map(evenNumbers, double);

print("\\n=== Final Result ===");
print("Original:", numbers);
print("Even numbers:", evenNumbers);
print("Doubled evens:", doubledEvens);
`,

  binarySearch: `// Binary Search with step visualization
let binarySearch = fn(arr, target) {
  print("=== Binary Search Algorithm ===");
  print("Searching for", target, "in array:", arr);
  
  let left = 0;
  let right = len(arr) - 1;
  let step = 1;

  while (left <= right) {
    let mid = left + ((right - left) / 2);
    print("\\nStep", step, ":");
    print("  Search range: [", left, ",", right, "]");
    print("  Middle index:", mid, "value:", arr[mid]);

    if (arr[mid] == target) {
      print("  ✓ Found target at index", mid);
      return mid;
    } elif (arr[mid] < target) {
      print("  Target is larger, search right half");
      left = mid + 1;
    } else {
      print("  Target is smaller, search left half");
      right = mid - 1;
    }
    
    step = step + 1;
  }

  print("\\n✗ Target not found");
  return -1;
};

let sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
let target = 7;
let index = binarySearch(sortedArray, target);

if (index != -1) {
  print("\\n=== Result ===");
  print("Found", target, "at index", index);
} else {
  print("Element not found in array");
}
`,

  rpgCharacterSystem: `// RPG Character Combat System with detailed output
let createCharacter = fn(name, className) {
  let baseStats = {
    "warrior": {"hp": 100, "attack": 15, "defense": 10},
    "mage": {"hp": 60, "attack": 20, "defense": 5},
    "rogue": {"hp": 80, "attack": 18, "defense": 7}
  };

  let stats = baseStats[className];
  print("Creating", className, name, "with stats:", stats);

  return {
    "name": name,
    "class": className,
    "hp": stats["hp"],
    "maxHp": stats["hp"],
    "attack": stats["attack"],
    "defense": stats["defense"],
    "level": 1,
    "xp": 0
  };
};

let displayCharacter = fn(char) {
  print(char["name"], "the", char["class"]);
  print("  HP:", char["hp"], "/", char["maxHp"]);
  print("  Attack:", char["attack"], "Defense:", char["defense"]);
};

let calculateDamage = fn(attacker, defender) {
  let baseDamage = attacker["attack"];
  let defense = defender["defense"];
  let damage = baseDamage - defense;
  
  print("\\nDamage calculation:");
  print("  Base damage:", baseDamage);
  print("  Defense:", defense);
  
  if (damage > 0) {
    print("  Final damage:", damage);
    return damage;
  } else {
    print("  Damage reduced to minimum: 1");
    return 1;
  }
};

let attack = fn(attacker, defender) {
  print("\\n" + attacker["name"], "attacks", defender["name"] + "!");
  
  let damage = calculateDamage(attacker, defender);
  let oldHp = defender["hp"];
  defender["hp"] = defender["hp"] - damage;
  
  print(defender["name"], "takes", damage, "damage!");
  print("HP:", oldHp, "->", defender["hp"]);
  
  if (defender["hp"] <= 0) {
    print(defender["name"], "has been defeated!");
  }
  
  return damage;
};

print("=== RPG Combat Simulation ===");

let warrior = createCharacter("Conan", "warrior");
let mage = createCharacter("Gandalf", "mage");

print("\\n=== Initial Stats ===");
displayCharacter(warrior);
print("");
displayCharacter(mage);

print("\\n=== Combat Round 1 ===");
attack(warrior, mage);

print("\\n=== Combat Round 2 ===");
attack(mage, warrior);

print("\\n=== Final Stats ===");
displayCharacter(warrior);
print("");
displayCharacter(mage);
`,

  ticTacToe: `// Tic-Tac-Toe Game with board visualization
let createBoard = fn() {
  return [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
  ];
};

let printBoard = fn(board) {
  print("\\n   0   1   2");
  for (let i = 0; i < 3; i = i + 1) {
    print(i, " ", board[i][0], " | ", board[i][1], " | ", board[i][2]);
    if (i < 2) {
      print("  -----------");
    }
  }
  print("");
};

let makeMove = fn(board, row, col, player) {
  print("Player", player, "moves to position (", row, ",", col, ")");
  
  if (board[row][col] == " ") {
    board[row][col] = player;
    print("Move successful!");
    return true;
  } else {
    print("Position already occupied!");
    return false;
  }
};

let checkWin = fn(board, player) {
  print("Checking win condition for player", player);
  
  // Check rows
  for (let i = 0; i < 3; i = i + 1) {
    if (board[i][0] == player && board[i][1] == player && board[i][2] == player) {
      print("Player", player, "wins with row", i, "!");
      return true;
    }
  }

  // Check columns  
  for (let j = 0; j < 3; j = j + 1) {
    if (board[0][j] == player && board[1][j] == player && board[2][j] == player) {
      print("Player", player, "wins with column", j, "!");
      return true;
    }
  }

  // Check diagonals
  if (board[0][0] == player && board[1][1] == player && board[2][2] == player) {
    print("Player", player, "wins with main diagonal!");
    return true;
  }
  if (board[0][2] == player && board[1][1] == player && board[2][0] == player) {
    print("Player", player, "wins with anti-diagonal!");
    return true;
  }

  return false;
};

print("=== Tic-Tac-Toe Game ===");

let board = createBoard();
print("Starting game with empty board:");
printBoard(board);

// Simulate a game
makeMove(board, 0, 0, "X");
printBoard(board);

makeMove(board, 1, 1, "O");
printBoard(board);

makeMove(board, 0, 1, "X");
printBoard(board);

makeMove(board, 2, 2, "O");
printBoard(board);

makeMove(board, 0, 2, "X");
printBoard(board);

let gameWon = checkWin(board, "X");
if (gameWon) {
  print("🎉 Game Over! Player X wins!");
} else {
  print("Game continues...");
}
`,

  primeNumbers: `// Sieve of Eratosthenes with step-by-step output
let sieveOfEratosthenes = fn(limit) {
  print("=== Sieve of Eratosthenes ===");
  print("Finding all prime numbers up to", limit);
  
  let isPrime = [];

  // Initialize array
  print("\\n1. Initializing array...");
  for (let i = 0; i <= limit; i = i + 1) {
    isPrime = push(isPrime, true);
  }
  
  isPrime[0] = false;
  isPrime[1] = false;
  print("Marked 0 and 1 as non-prime");

  print("\\n2. Sieving process:");
  for (let i = 2; i * i <= limit; i = i + 1) {
    if (isPrime[i]) {
      print("\\nSieving with prime", i);
      print("Marking multiples:", i * i, "to", limit, "step", i);
      
      for (let j = i * i; j <= limit; j = j + i) {
        if (isPrime[j]) {
          print("  Marking", j, "as non-prime");
        }
        isPrime[j] = false;
      }
    }
  }

  print("\\n3. Collecting primes:");
  let primes = [];
  for (let i = 2; i <= limit; i = i + 1) {
    if (isPrime[i]) {
      print("Found prime:", i);
      primes = push(primes, i);
    }
  }

  print("\\n=== Results ===");
  print("Prime numbers up to", limit, ":", primes);
  print("Total count:", len(primes));
  return primes;
};

sieveOfEratosthenes(30);
`,

  matrixMultiplication: `// Matrix Multiplication with detailed computation
let printMatrix = fn(matrix, name) {
  print("\\nMatrix", name, ":");
  for (let i = 0; i < len(matrix); i = i + 1) {
    print("  ", matrix[i]);
  }
};

let multiplyMatrices = fn(a, b) {
  print("=== Matrix Multiplication ===");
  
  let rowsA = len(a);
  let colsA = len(a[0]);
  let rowsB = len(b);
  let colsB = len(b[0]);
  
  print("Matrix A dimensions:", rowsA, "x", colsA);
  print("Matrix B dimensions:", rowsB, "x", colsB);
  
  if (colsA != rowsB) {
    print("Error: Cannot multiply matrices - dimension mismatch!");
    return null;
  }
  
  printMatrix(a, "A");
  printMatrix(b, "B");

  let result = [];
  print("\\nComputation process:");

  for (let i = 0; i < rowsA; i = i + 1) {
    let row = [];
    print("\\nCalculating row", i, ":");
    
    for (let j = 0; j < colsB; j = j + 1) {
      let sum = 0;
      let computation = [];
      
      for (let k = 0; k < colsA; k = k + 1) {
        let product = a[i][k] * b[k][j];
        sum = sum + product;
        computation = push(computation, a[i][k] + "*" + b[k][j]);
      }
      
      print("  element[", i, "][", j, "] =", join(computation, " + "), "=", sum);
      row = push(row, sum);
    }
    result = push(result, row);
  }

  print("\\n=== Result ===");
  printMatrix(result, "C (A × B)");
  return result;
};

let matrixA = [[1, 2, 3], [4, 5, 6]];
let matrixB = [[7, 8], [9, 10], [11, 12]];

multiplyMatrices(matrixA, matrixB);
`,

  bankAccount: `// Object-Oriented Bank Account with transaction history
let createBankAccount = fn(accountHolder, initialBalance) {
  let balance = initialBalance;
  let transactions = [];
  
  let addTransaction = fn(type, amount, newBalance) {
    let transaction = {
      "type": type,
      "amount": amount,
      "balance": newBalance,
      "timestamp": "now"  // In a real system, this would be actual timestamp
    };
    transactions = push(transactions, transaction);
    print("Transaction recorded:", type, amount, "New balance:", newBalance);
  };

  print("=== Creating Bank Account ===");
  print("Account holder:", accountHolder);
  print("Initial balance: $", initialBalance);
  addTransaction("INITIAL_DEPOSIT", initialBalance, balance);

  return {
    "holder": accountHolder,
    "getBalance": fn() { 
      print("Current balance for", accountHolder, ": $", balance);
      return balance; 
    },
    
    "deposit": fn(amount) {
      print("\\n--- Deposit Transaction ---");
      print("Attempting to deposit $", amount);
      
      if (amount > 0) {
        let oldBalance = balance;
        balance = balance + amount;
        print("Deposit successful! $", oldBalance, "-> $", balance);
        addTransaction("DEPOSIT", amount, balance);
        return true;
      } else {
        print("Error: Deposit amount must be positive");
        return false;
      }
    },
    
    "withdraw": fn(amount) {
      print("\\n--- Withdrawal Transaction ---");
      print("Attempting to withdraw $", amount);
      print("Current balance: $", balance);
      
      if (amount <= 0) {
        print("Error: Withdrawal amount must be positive");
        return false;
      }
      
      if (amount > balance) {
        print("Error: Insufficient funds");
        print("Requested: $", amount, "Available: $", balance);
        return false;
      }
      
      let oldBalance = balance;
      balance = balance - amount;
      print("Withdrawal successful! $", oldBalance, "-> $", balance);
      addTransaction("WITHDRAWAL", amount, balance);
      return true;
    },
    
    "getTransactionHistory": fn() {
      print("\\n=== Transaction History for", accountHolder, "===");
      for (let i = 0; i < len(transactions); i = i + 1) {
        let txn = transactions[i];
        print((i + 1) + ".", txn["type"], "- Amount: $" + txn["amount"], "Balance: $" + txn["balance"]);
      }
      return transactions;
    }
  };
};

print("=== Bank Account Demo ===");

let account = createBankAccount("Alice Johnson", 1000);

account["deposit"](250);
account["withdraw"](150);
account["withdraw"](2000);  // This should fail
account["deposit"](500);
account["getBalance"]();
account["getTransactionHistory"]();
`,

  fibonacci_iterative: `// Iterative Fibonacci with comparison to recursive
let fibonacciRecursive = fn(n) {
  if (n < 2) {
    return n;
  }
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
};

let fibonacciIterative = fn(n) {
  print("=== Iterative Fibonacci ===");
  print("Computing fibonacci(", n, ") iteratively");
  
  if (n < 2) {
    print("Base case: fibonacci(", n, ") =", n);
    return n;
  }
  
  let a = 0;
  let b = 1;
  let result = 0;
  
  print("Starting with: a =", a, ", b =", b);
  
  for (let i = 2; i <= n; i = i + 1) {
    result = a + b;
    print("Step", i, ":", a, "+", b, "=", result);
    a = b;
    b = result;
    print("  Update: a =", a, ", b =", b);
  }
  
  print("\\nFinal result: fibonacci(", n, ") =", result);
  return result;
};

let comparePerformance = fn(n) {
  print("\\n=== Performance Comparison ===");
  print("Computing fibonacci(", n, ") with both methods:\\n");
  
  print("Iterative approach:");
  let iterativeResult = fibonacciIterative(n);
  
  print("\\nRecursive approach:");
  let recursiveResult = fibonacciRecursive(n);
  
  print("\\n=== Results ===");
  print("Iterative result:", iterativeResult);
  print("Recursive result:", recursiveResult);
  print("Results match:", iterativeResult == recursiveResult);
};

comparePerformance(10);
`,

  closureCounter: `// Advanced Closure: Counter Factory with multiple instances
let createCounterFactory = fn() {
  let instanceCount = 0;
  
  return fn(name, initialValue) {
    instanceCount = instanceCount + 1;
    let count = initialValue;
    let id = instanceCount;
    
    print("=== Creating Counter Instance ===");
    print("Counter name:", name);
    print("Instance ID:", id);
    print("Initial value:", initialValue);
    
    return {
      "getName": fn() { name; },
      "getId": fn() { id; },
      "getValue": fn() { 
        print("Counter", name, "(#" + id + ") current value:", count);
        return count; 
      },
      "increment": fn() {
        let oldValue = count;
        count = count + 1;
        print("Counter", name, "incremented:", oldValue, "->", count);
        return count;
      },
      "decrement": fn() {
        let oldValue = count;
        count = count - 1;
        print("Counter", name, "decremented:", oldValue, "->", count);
        return count;
      },
      "reset": fn() {
        let oldValue = count;
        count = initialValue;
        print("Counter", name, "reset:", oldValue, "->", count);
        return count;
      },
      "add": fn(value) {
        let oldValue = count;
        count = count + value;
        print("Counter", name, "added", value, ":", oldValue, "->", count);
        return count;
      }
    };
  };
};

print("=== Closure Counter Demo ===");

let counterFactory = createCounterFactory();

print("\\n--- Creating Counters ---");
let scoreCounter = counterFactory("Score", 0);
let livesCounter = counterFactory("Lives", 3);
let levelCounter = counterFactory("Level", 1);

print("\\n--- Testing Counters ---");
scoreCounter["add"](100);
scoreCounter["add"](50);
scoreCounter["getValue"]();

livesCounter["decrement"]();
livesCounter["getValue"]();

levelCounter["increment"]();
levelCounter["increment"]();
levelCounter["getValue"]();

print("\\n--- Counter States ---");
print("Final scores:");
scoreCounter["getValue"]();
livesCounter["getValue"]();
levelCounter["getValue"]();
`,

  simpleBeginnerExample: `// Perfect for beginners: Variables and basic operations
print("=== Welcome to Programming! ===");

// Variables store information
let myName = "Alice";
let myAge = 25;
let isStudent = true;

print("Hello! My name is", myName);
print("I am", myAge, "years old");
print("Am I a student?", isStudent);

// Numbers and math
let apples = 5;
let oranges = 3;
let totalFruit = apples + oranges;

print("\\nI have", apples, "apples and", oranges, "oranges");
print("Total fruit:", totalFruit);

// Simple decisions
if (totalFruit > 5) {
  print("I have lots of fruit!");
} else {
  print("I should buy more fruit");
}

print("\\n=== The End ===");
`,

  basicArithmetic: `// Basic arithmetic operations with explanations
print("=== Basic Math Operations ===");

let a = 15;
let b = 4;

print("Let's work with two numbers:");
print("a =", a);
print("b =", b);

print("\\n--- Addition ---");
let sum = a + b;
print(a, "+", b, "=", sum);

print("\\n--- Subtraction ---");
let difference = a - b;
print(a, "-", b, "=", difference);

print("\\n--- Multiplication ---");
let product = a * b;
print(a, "×", b, "=", product);

print("\\n--- Division ---");
let quotient = a / b;
print(a, "÷", b, "=", quotient);

print("\\n--- Remainder (Modulus) ---");
let remainder = a % b;
print(a, "mod", b, "=", remainder);
print("This means", a, "÷", b, "leaves a remainder of", remainder);

print("\\n=== Summary ===");
print("We performed 5 different math operations!");
`,

  stringOperations: `// String manipulation with detailed examples
print("=== Working with Text (Strings) ===");

let firstName = "John";
let lastName = "Smith";

print("First name:", firstName);
print("Last name:", lastName);

print("\\n--- Combining Strings ---");
let fullName = firstName + " " + lastName;
print("Full name:", fullName);

let greeting = "Hello, " + fullName + "!";
print("Greeting:", greeting);

print("\\n--- String Information ---");
let nameLength = len(fullName);
print("The name", fullName, "has", nameLength, "characters");

let firstNameLength = len(firstName);
let lastNameLength = len(lastName);
print("First name length:", firstNameLength);
print("Last name length:", lastNameLength);

print("\\n--- Fun with Strings ---");
let message = firstName + " has " + firstNameLength + " letters in their first name";
print(message);

if (firstNameLength > lastNameLength) {
  print("First name is longer than last name");
} else {
  print("Last name is longer than (or equal to) first name");
}
`,

  simpleFunction: `// Understanding Functions - Reusable Code Blocks
print("=== Learning About Functions ===");

// A function is like a recipe - it takes ingredients (parameters)
// and produces a result (return value)

let greet = fn(name) {
  print("Inside the greet function with name:", name);
  let message = "Hello, " + name + "!";
  print("Created message:", message);
  return message;
};

print("\\n--- Using Our Function ---");
print("Calling greet with 'Alice':");
let greeting1 = greet("Alice");
print("Function returned:", greeting1);

print("\\nCalling greet with 'Bob':");
let greeting2 = greet("Bob");
print("Function returned:", greeting2);

print("\\n--- Functions Can Do Math Too ---");
let add = fn(x, y) {
  print("Adding", x, "and", y);
  let result = x + y;
  print("Result:", result);
  return result;
};

let sum = add(7, 3);
print("7 + 3 =", sum);

let multiply = fn(a, b) {
  print("Multiplying", a, "and", b);
  return a * b;
};

let product = multiply(4, 5);
print("4 × 5 =", product);

print("\\n=== Functions make code reusable! ===");
`,
};

export const getRandomSampleCode = (): string => {
  const snippets = Object.values(sampleCodeSnippets);
  const randomIndex = Math.floor(Math.random() * snippets.length);
  return snippets[randomIndex];
};

// Category-based snippet access
export const snippetCategories = {
  beginner: [
    "simpleBeginnerExample",
    "basicArithmetic",
    "stringOperations",
    "simpleFunction",
  ],

  algorithms: [
    "bubbleSort",
    "binarySearch",
    "primeNumbers",
    "matrixMultiplication",
  ],

  dataStructures: ["filterAndMap", "closureCounter", "bankAccount"],

  games: ["ticTacToe", "rpgCharacterSystem"],

  mathematics: [
    "fibonacci",
    "fibonacci_iterative",
    "factorial",
    "primeNumbers",
  ],

  advanced: ["closureCounter", "bankAccount", "matrixMultiplication"],
};

export const getSnippetsByCategory = (
  category: keyof typeof snippetCategories
): string[] => {
  const snippetNames = snippetCategories[category] || [];
  return snippetNames.map(
    (name) => sampleCodeSnippets[name as keyof typeof sampleCodeSnippets]
  );
};

export const getSnippetByName = (
  name: keyof typeof sampleCodeSnippets
): string => {
  return sampleCodeSnippets[name];
};
