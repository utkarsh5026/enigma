export const sampleCodeSnippets = {
  fibonacci: `# Recursive Fibonacci function with debug output
let fibonacci = fn(n) {
  print(f"Computing fibonacci({n})");
  if (n < 2) {
    print(f"Base case: fibonacci({n}) = {n}");
    return n;
  } else {
    let result = fibonacci(n - 1) + fibonacci(n - 2);
    print(f"fibonacci({n}) = {result}");
    return result;
  }
};

# Calculate the 4th Fibonacci number
print("=== Fibonacci Calculation ===");
let result = fibonacci(4);
print(f"Final result: fibonacci(4) = {result}");
`,

  factorial: `# Factorial function with step-by-step output
let factorial = fn(n) {
  print(f"Computing factorial({n})");
  if (n <= 1) {
    print(f"Base case: factorial({n}) = 1");
    return 1;
  } else {
    let result = n * factorial(n - 1);
    print(f"factorial({n}) = {n} * factorial({n-1}) = {result}");
    return result;
  }
};

# Calculate 5! with debug output
print("=== Factorial Calculation ===");
let result = factorial(5);
print(f"Final result: 5! = {result}");
`,

  bubbleSort: `# Bubble Sort with visualization
let bubbleSort = fn(arr) {
  print("=== Bubble Sort Algorithm ===");
  print(f"Initial array: {arr}");
  
  let n = len(arr);
  
  for (let i = 0; i < n - 1; i = i + 1) {
    print(f"\\nPass {i + 1}:");
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j = j + 1) {
      print(f"Comparing {arr[j]} and {arr[j + 1]}");
      
      if (arr[j] > arr[j + 1]) {
        # Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
        print(f"  Swapped! Array now: {arr}");
      } else {
        print("  No swap needed");
      }
    }
    
    if (!swapped) {
      print("No swaps in this pass - array is sorted!");
      break;
    }
  }
  
  print(f"\\nFinal sorted array: {arr}");
  return arr;
};

let numbers = [64, 34, 25, 12, 22, 11, 90];
bubbleSort(numbers);
`,

  filterAndMap: `# Functional Programming: Filter and Map with debug output
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

  binarySearch: `# Binary Search with step visualization
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

  rpgCharacterSystem: `# RPG Character Combat System with detailed output
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

  ticTacToe: `# Tic-Tac-Toe Game with board visualization
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
  
  # Check rows
  for (let i = 0; i < 3; i = i + 1) {
    if (board[i][0] == player && board[i][1] == player && board[i][2] == player) {
      print("Player", player, "wins with row", i, "!");
      return true;
    }
  }

  # Check columns  
  for (let j = 0; j < 3; j = j + 1) {
    if (board[0][j] == player && board[1][j] == player && board[2][j] == player) {
      print("Player", player, "wins with column", j, "!");
      return true;
    }
  }

  # Check diagonals
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

# Simulate a game
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

  primeNumbers: `# Sieve of Eratosthenes with step-by-step output
let sieveOfEratosthenes = fn(limit) {
  print("=== Sieve of Eratosthenes ===");
  print("Finding all prime numbers up to", limit);
  
  let isPrime = [];

  # Initialize array
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

  matrixMultiplication: `# Matrix Multiplication with detailed computation
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

  bankAccount: `# Object-Oriented Bank Account with transaction history
let createBankAccount = fn(accountHolder, initialBalance) {
  let balance = initialBalance;
  let transactions = [];
  
  let addTransaction = fn(type, amount, newBalance) {
    let transaction = {
      "type": type,
      "amount": amount,
      "balance": newBalance,
      "timestamp": "now"  # In a real system, this would be actual timestamp
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
account["withdraw"](2000);  # This should fail
account["deposit"](500);
account["getBalance"]();
account["getTransactionHistory"]();
`,

  fibonacci_iterative: `# Iterative Fibonacci with comparison to recursive
let fibonacciRecursive = fn(n) {
  if (n < 2) {
    return n;
  }
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
};

let fibonacciIterative = fn(n) {
  print("=== Iterative Fibonacci ===");
  print(f"Computing fibonacci({n}) iteratively");
  
  if (n < 2) {
    print(f"Base case: fibonacci({n}) = {n}");
    return n;
  }
  
  let a = 0;
  let b = 1;
  let result = 0;
  
  print(f"Starting with: a = {a}, b = {b}");
  
  for (let i = 2; i <= n; i = i + 1) {
    result = a + b;
    print(f"Step {i}: {a} + {b} = {result}");
    a = b;
    b = result;
    print(f"  Update: a = {a}, b = {b}");
  }
  
  print(f"\\nFinal result: fibonacci({n}) = {result}");
  return result;
};

let comparePerformance = fn(n) {
  print("\\n=== Performance Comparison ===");
  print(f"Computing fibonacci({n}) with both methods:\\n");
  
  print("Iterative approach:");
  let iterativeResult = fibonacciIterative(n);
  
  print("\\nRecursive approach:");
  let recursiveResult = fibonacciRecursive(n);
  
  print("\\n=== Results ===");
  print(f"Iterative result: {iterativeResult}");
  print(f"Recursive result: {recursiveResult}");
  print(f"Results match: {iterativeResult == recursiveResult}");
};

comparePerformance(10);
`,

  simpleBeginnerExample: `# Perfect for beginners: Variables and basic operations
print("=== Welcome to Programming! ===");

# Variables store information
let myName = "Alice";
let myAge = 25;
let isStudent = true;

print(f"Hello! My name is {myName}");
print(f"I am {myAge} years old");
print(f"Am I a student? {isStudent}");

# Numbers and math
let apples = 5;
let oranges = 3;
let totalFruit = apples + oranges;

print(f"\\nI have {apples} apples and {oranges} oranges");
print(f"Total fruit: {totalFruit}");

# Simple decisions
if (totalFruit > 5) {
  print("I have lots of fruit!");
} else {
  print("I should buy more fruit");
}

print("\\n=== The End ===");
`,

  basicArithmetic: `# Basic arithmetic operations with explanations
print("=== Basic Math Operations ===");

let a = 15;
let b = 4;

print("Let's work with two numbers:");
print(f"a = {a}");
print(f"b = {b}");

print("\\n--- Addition ---");
let sum = a + b;
print(f"{a} + {b} = {sum}");

print("\\n--- Subtraction ---");
let difference = a - b;
print(f"{a} - {b} = {difference}");

print("\\n--- Multiplication ---");
let product = a * b;
print(f"{a} × {b} = {product}");

print("\\n--- Division ---");
let quotient = a / b;
print(f"{a} ÷ {b} = {quotient}");

print("\\n--- Remainder (Modulus) ---");
let remainder = a % b;
print(f"{a} mod {b} = {remainder}");
print(f"This means {a} ÷ {b} leaves a remainder of {remainder}");

print("\\n=== Summary ===");
print("We performed 5 different math operations!");
`,

  stringOperations: `# String manipulation with detailed examples
print("=== Working with Text (Strings) ===");

let firstName = "John";
let lastName = "Smith";

print(f"First name: {firstName}");
print(f"Last name: {lastName}");

print("\\n--- Combining Strings ---");
let fullName = firstName + " " + lastName;
print(f"Full name: {fullName}");

let greeting = "Hello, " + fullName + "!";
print(f"Greeting: {greeting}");

print("\\n--- String Information ---");
let nameLength = len(fullName);
print(f"The name {fullName} has {nameLength} characters");

let firstNameLength = len(firstName);
let lastNameLength = len(lastName);
print(f"First name length: {firstNameLength}");
print(f"Last name length: {lastNameLength}");

print("\\n--- Fun with Strings ---");
let message = f"{firstName} has {firstNameLength} letters in their first name";
print(f"Message: {message}");

if (firstNameLength > lastNameLength) {
  print("First name is longer than last name");
} else {
  print("Last name is longer than (or equal to) first name");
}
`,

  simpleFunction: `# Understanding Functions - Reusable Code Blocks
print("=== Learning About Functions ===");

# A function is like a recipe - it takes ingredients (parameters)
# and produces a result (return value)

let greet = fn(name) {
  print(f"Inside the greet function with name: {name}");
  let message = "Hello, " + name + "!";
  print(f"Created message: {message}");
  return message;
};

print("\\n--- Using Our Function ---");
print("Calling greet with 'Alice':");
let greeting1 = greet("Alice");
print(f"Function returned: {greeting1}");

print("\\nCalling greet with 'Bob':");
let greeting2 = greet("Bob");
print(f"Function returned: {greeting2}");

print("\\n--- Functions Can Do Math Too ---");
let add = fn(x, y) {
  print(f"Adding {x} and {y}");
  let result = x + y;
  print(f"Result: {result}");
  return result;
};

let sum = add(7, 3);
print(f"7 + 3 = {sum}");

let multiply = fn(a, b) {
  print(f"Multiplying {a} and {b}");
  return a * b;
};

let product = multiply(4, 5);
print(f"4 × 5 = {product}");

print("\\n=== Functions make code reusable! ===");
`,

  // NEW CLASS EXAMPLES START HERE

  basicClass: `# Introduction to Classes - Your First Class!
print("=== Welcome to Object-Oriented Programming! ===");

# A class is like a blueprint for creating objects
# Think of it as a cookie cutter - it defines the shape,
# but you can make many cookies (objects) from it!

class Person {
  init(name, age) {
    print(f"Creating a new Person: {name}, age {age}");
    this.name = name;
    this.age = age;
    this.energy = 100;
    print(f"  Initialized {this.name} with {this.energy} energy");
  }

  greet() {
    print(f"Hello! My name is {this.name} and I'm {this.age} years old.");
    return f"Hi, I'm {this.name}!";
  }

  haveBirthday() {
    let oldAge = this.age;
    this.age = this.age + 1;
    print(f"🎂 Happy birthday {this.name}!");
    print(f"   Age: {oldAge} -> {this.age}");
    print(f"   Getting wiser!");
  }

  exercise() {
    if (this.energy >= 20) {
      this.energy = this.energy - 20;
      print(f"{this.name} exercises! Energy: {this.energy + 20} -> {this.energy}");
      print("  Feeling healthy!");
    } else {
      print(f"{this.name} is too tired to exercise (energy: {this.energy})");
    }
  }

  rest() {
    let oldEnergy = this.energy;
    this.energy = this.energy + 30;
    if (this.energy > 100) {
      this.energy = 100;
    }
    print(f"{this.name} rests and recovers energy: {oldEnergy} -> {this.energy}");
  }

  getInfo() {
    print(f"\\n=== {this.name}'s Status ===");
    print(f"  Age: {this.age}");
    print(f"  Energy: {this.energy}/100");
    print(f"  Status: {this.getStatus()}");
  }

  getStatus() {
    if (this.energy >= 80) {
      return "Energetic!";
    } elif (this.energy >= 50) {
      return "Doing fine";
    } elif (this.energy >= 20) {
      return "Getting tired";
    } else {
      return "Exhausted";
    }
  }
}

print("\\n--- Creating People ---");
let alice = new Person("Alice", 25);
let bob = new Person("Bob", 30);

print("\\n--- Initial Greetings ---");
alice.greet();
bob.greet();

print("\\n--- Life Activities ---");
alice.exercise();
alice.exercise();
alice.getInfo();

bob.haveBirthday();
bob.rest();
bob.getInfo();

print("\\n--- More Activities ---");
alice.rest();
alice.getInfo();

print("\\n=== Classes let us create multiple objects with the same behavior! ===");
`,

  classInheritance: `# Class Inheritance - Building on Existing Classes
print("=== Understanding Inheritance ===");

# Inheritance lets us create new classes based on existing ones
# The new class gets all the methods from the parent class,
# plus it can add its own methods or override existing ones!

class Animal {
  init(name, species) {
    print(f"Creating animal: {name} ({species})");
    this.name = name;
    this.species = species;
    this.energy = 100;
    this.hunger = 0;
  }

  speak() {
    print(f"{this.name} makes a sound!");
    return "Some generic animal sound";
  }

  eat() {
    if (this.hunger >= 20) {
      this.hunger = this.hunger - 30;
      this.energy = this.energy + 20;
      if (this.energy > 100) { this.energy = 100; }
      if (this.hunger < 0) { this.hunger = 0; }
      print(f"{this.name} eats and feels better!");
      print(f"  Hunger: {this.hunger + 30} -> {this.hunger}");
      print(f"  Energy: {this.energy - 20} -> {this.energy}");
    } else {
      print(f"{this.name} is not hungry right now");
    }
  }

  sleep() {
    let oldEnergy = this.energy;
    this.energy = this.energy + 40;
    this.hunger = this.hunger + 10;
    if (this.energy > 100) { this.energy = 100; }
    print(f"{this.name} sleeps peacefully...");
    print(f"  Energy restored: {oldEnergy} -> {this.energy}");
    print(f"  Getting hungrier: {this.hunger - 10} -> {this.hunger}");
  }

  getStatus() {
    print(f"\\n=== {this.name} the {this.species} ===");
    print(f"  Energy: {this.energy}/100");
    print(f"  Hunger: {this.hunger}/100");
  }
}

# Dog inherits from Animal - it gets ALL of Animal's methods
# but can add its own special methods!
class Dog extends Animal {
  init(name, breed) {
    print(f"Creating dog with breed: {breed}");
    super(name, "Dog");  # Call parent init
    this.breed = breed;
    this.loyalty = 100;
    print(f"  {name} is a {breed} with {this.loyalty} loyalty");
  }

  speak() {
    print(f"{this.name} barks: Woof! Woof!");
    return "Woof!";
  }

  wagTail() {
    if (this.energy >= 10) {
      this.energy = this.energy - 5;
      print(f"{this.name} wags tail excitedly! 🐕");
      print(f"  Energy: {this.energy + 5} -> {this.energy}");
      print("  Such a good dog!");
    } else {
      print(f"{this.name} is too tired to wag tail");
    }
  }

  fetch() {
    if (this.energy >= 25) {
      this.energy = this.energy - 25;
      this.hunger = this.hunger + 15;
      print(f"{this.name} fetches the ball! Great exercise!");
      print(f"  Energy: {this.energy + 25} -> {this.energy}");
      print(f"  Hunger: {this.hunger - 15} -> {this.hunger}");
    } else {
      print(f"{this.name} is too tired to fetch");
    }
  }
}

# Cat also inherits from Animal but behaves differently
class Cat extends Animal {
  init(name, color) {
    print(f"Creating cat with color: {color}");
    super(name, "Cat");  # Call parent init
    this.color = color;
    this.independence = 80;
    print(f"  {name} is a {color} cat with {this.independence} independence");
  }

  speak() {
    print(f"{this.name} meows: Meow! Purr...");
    return "Meow";
  }

  climb() {
    if (this.energy >= 20) {
      this.energy = this.energy - 20;
      print(f"{this.name} climbs up high! 🐱");
      print(f"  Energy: {this.energy + 20} -> {this.energy}");
      print("  Great view from up here!");
    } else {
      print(f"{this.name} is too tired to climb");
    }
  }

  purr() {
    print(f"{this.name} purrs contentedly: Purr purr purr...");
    this.energy = this.energy + 5;
    print(f"  Feeling relaxed! Energy: {this.energy - 5} -> {this.energy}");
  }
}

print("\\n--- Creating Our Pet Family ---");
let dog = new Dog("Buddy", "Golden Retriever");
let cat = new Cat("Whiskers", "Orange");

print("\\n--- Animal Sounds ---");
dog.speak();
cat.speak();

print("\\n--- Dog Activities ---");
dog.wagTail();
dog.fetch();
dog.getStatus();

print("\\n--- Cat Activities ---");
cat.climb();
cat.purr();
cat.getStatus();

print("\\n--- Both Animals Can Eat and Sleep (Inherited Methods) ---");
dog.eat();
cat.sleep();

dog.getStatus();
cat.getStatus();

print("\\n=== Inheritance allows us to share common behavior! ===");
`,

  gameCharacterClasses: `# Advanced Game Character System with Class Hierarchy
print("=== Epic Fantasy Game Character System ===");

# Base Character class - foundation for all game characters
class Character {
  init(name, level) {
    print(f"⚔️  Creating character: {name} (Level {level})");
    this.name = name;
    this.level = level;
    this.hp = 50 + (level * 10);
    this.maxHp = this.hp;
    this.mp = 20 + (level * 5);
    this.maxMp = this.mp;
    this.xp = 0;
    this.isAlive = true;
    print(f"   HP: {this.hp}, MP: {this.mp}");
  }

  displayStats() {
    print(f"\\n📊 {this.name} (Level {this.level}) Stats:");
    print(f"   HP: {this.hp}/{this.maxHp}");
    print(f"   MP: {this.mp}/{this.maxMp}");
    print(f"   XP: {this.xp}");
    print(f"   Status: {this.getStatus()}");
  }

  getStatus() {
    if (!this.isAlive) {
      return "💀 Defeated";
    } elif (this.hp >= this.maxHp * 0.8) {
      return "💪 Excellent";
    } elif (this.hp >= this.maxHp * 0.5) {
      return "😐 Fair";
    } elif (this.hp >= this.maxHp * 0.2) {
      return "😰 Poor";
    } else {
      return "💀 Critical";
    }
  }

  takeDamage(damage) {
    if (!this.isAlive) {
      print(f"{this.name} is already defeated!");
      return;
    }

    let oldHp = this.hp;
    this.hp = this.hp - damage;
    if (this.hp < 0) { this.hp = 0; }

    print(f"💥 {this.name} takes {damage} damage! ({oldHp} -> {this.hp})");
    
    if (this.hp == 0) {
      this.isAlive = false;
      print(f"💀 {this.name} has been defeated!");
    }
  }

  heal(amount) {
    if (!this.isAlive) {
      print(f"{this.name} cannot be healed while defeated!");
      return;
    }

    let oldHp = this.hp;
    this.hp = this.hp + amount;
    if (this.hp > this.maxHp) { this.hp = this.maxHp; }
    
    print(f"💚 {this.name} heals for {amount}! ({oldHp} -> {this.hp})");
  }

  gainXP(amount) {
    this.xp = this.xp + amount;
    print(f"✨ {this.name} gains {amount} XP! (Total: {this.xp})");
    
    let xpNeeded = this.level * 100;
    if (this.xp >= xpNeeded) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level = this.level + 1;
    this.xp = 0;
    
    let hpGain = 15;
    let mpGain = 8;
    
    this.maxHp = this.maxHp + hpGain;
    this.maxMp = this.maxMp + mpGain;
    this.hp = this.maxHp;  # Full heal on level up
    this.mp = this.maxMp;
    
    print(f"🎉 {this.name} levels up to {this.level}!");
    print(f"   HP increased by {hpGain} to {this.maxHp}");
    print(f"   MP increased by {mpGain} to {this.maxMp}");
    print("   Fully restored!");
  }
}

# Warrior class - tanky melee fighter
class Warrior extends Character {
  init(name, level) {
    super(name, level);
    this.strength = 15 + level * 2;
    this.defense = 12 + level * 2;
    this.rage = 0;
    print(f"   ⚔️  Warrior stats - STR: {this.strength}, DEF: {this.defense}");
  }

  attack(target) {
    if (!this.isAlive) {
      print(f"{this.name} cannot attack while defeated!");
      return;
    }

    let damage = this.strength + (this.rage * 2);
    print(f"⚔️  {this.name} attacks {target.name} with sword!");
    print(f"   Base damage: {this.strength} + Rage bonus: {this.rage * 2} = {damage}");
    
    target.takeDamage(damage);
    this.buildRage();
  }

  buildRage() {
    this.rage = this.rage + 1;
    if (this.rage > 5) { this.rage = 5; }
    print(f"🔥 {this.name}'s rage builds! (Rage: {this.rage}/5)");
  }

  shieldBlock() {
    if (this.mp >= 10) {
      this.mp = this.mp - 10;
      print(f"🛡️  {this.name} raises shield! Next attack will be reduced!");
      print(f"   MP: {this.mp + 10} -> {this.mp}");
      return true;
    } else {
      print(f"{this.name} doesn't have enough MP to block!");
      return false;
    }
  }

  berserkerRage() {
    if (this.mp >= 25) {
      this.mp = this.mp - 25;
      this.rage = 5;
      print(f"😡 {this.name} enters BERSERKER RAGE!");
      print(f"   MP: {this.mp + 25} -> {this.mp}");
      print(f"   Rage maximized: {this.rage}/5");
    } else {
      print(f"{this.name} needs 25 MP for Berserker Rage!");
    }
  }
}

# Mage class - magical ranged attacker
class Mage extends Character {
  init(name, level) {
    super(name, level);
    this.intelligence = 18 + level * 3;
    this.magicPower = 10 + level * 2;
    this.spellsKnown = ["Fireball", "Heal", "Lightning"];
    print(f"   🔮 Mage stats - INT: {this.intelligence}, Magic: {this.magicPower}");
    print(f"   Spells: {this.spellsKnown}");
  }

  castFireball(target) {
    if (!this.isAlive) {
      print(f"{this.name} cannot cast while defeated!");
      return;
    }

    if (this.mp >= 15) {
      this.mp = this.mp - 15;
      let damage = this.magicPower + 8;
      print(f"🔥 {this.name} casts Fireball at {target.name}!");
      print(f"   MP: {this.mp + 15} -> {this.mp}");
      print(f"   Spell damage: {damage}");
      target.takeDamage(damage);
    } else {
      print(f"{this.name} needs 15 MP for Fireball!");
    }
  }

  castHeal(target) {
    if (this.mp >= 12) {
      this.mp = this.mp - 12;
      let healing = this.magicPower + 5;
      print(f"💚 {this.name} casts Heal on {target.name}!");
      print(f"   MP: {this.mp + 12} -> {this.mp}");
      target.heal(healing);
    } else {
      print(f"{this.name} needs 12 MP for Heal!");
    }
  }

  castLightning(target) {
    if (this.mp >= 20) {
      this.mp = this.mp - 20;
      let damage = this.magicPower + 12;
      print(f"⚡ {this.name} casts Lightning Bolt at {target.name}!");
      print(f"   MP: {this.mp + 20} -> {this.mp}");
      print(f"   Electric damage: {damage}");
      target.takeDamage(damage);
    } else {
      print(f"{this.name} needs 20 MP for Lightning!");
    }
  }

  meditation() {
    let mpRecovered = 15;
    this.mp = this.mp + mpRecovered;
    if (this.mp > this.maxMp) { this.mp = this.maxMp; }
    print(f"🧘 {this.name} meditates and recovers {mpRecovered} MP");
    print(f"   MP: {this.mp - mpRecovered} -> {this.mp}");
  }
}

# Rogue class - fast, sneaky attacker
class Rogue extends Character {
  init(name, level) {
    super(name, level);
    this.agility = 20 + level * 3;
    this.stealth = 15 + level * 2;
    this.isHidden = false;
    print(f"   🗡️  Rogue stats - AGI: {this.agility}, Stealth: {this.stealth}");
  }

  sneak() {
    if (this.mp >= 10) {
      this.mp = this.mp - 10;
      this.isHidden = true;
      print(f"👤 {this.name} disappears into the shadows!");
      print(f"   MP: {this.mp + 10} -> {this.mp}");
      print("   Next attack will be a critical hit!");
    } else {
      print(f"{this.name} needs 10 MP to sneak!");
    }
  }

  backstab(target) {
    if (!this.isAlive) {
      print(f"{this.name} cannot attack while defeated!");
      return;
    }

    let baseDamage = this.agility;
    let damage = baseDamage;
    
    if (this.isHidden) {
      damage = damage * 2;
      print(f"🗡️  {this.name} strikes from the shadows!");
      print(f"   CRITICAL HIT! {baseDamage} x 2 = {damage} damage!");
      this.isHidden = false;
    } else {
      print(f"🗡️  {this.name} attacks {target.name} with daggers!");
      print(f"   Damage: {damage}");
    }
    
    target.takeDamage(damage);
  }

  poisonBlade() {
    if (this.mp >= 15) {
      this.mp = this.mp - 15;
      print(f"☠️  {this.name} coats blades with poison!");
      print(f"   MP: {this.mp + 15} -> {this.mp}");
      print("   Next 3 attacks will cause poison damage!");
    } else {
      print(f"{this.name} needs 15 MP for Poison Blade!");
    }
  }
}

print("\\n=== Creating Adventure Party ===");
let warrior = new Warrior("Sir Galahad", 3);
let mage = new Mage("Merlin", 3);
let rogue = new Rogue("Shadow", 3);

print("\\n=== Party Status ===");
warrior.displayStats();
mage.displayStats();
rogue.displayStats();

print("\\n=== Epic Battle Simulation ===");
print("A wild monster appears!");

print("\\n--- Round 1: Warriors Charge ---");
warrior.attack(mage);  # Simulating battle
mage.castHeal(mage);   # Heal self

print("\\n--- Round 2: Magic and Stealth ---");
rogue.sneak();
mage.castFireball(warrior);
rogue.backstab(warrior);

print("\\n--- Round 3: Special Abilities ---");
warrior.berserkerRage();
mage.meditation();
rogue.poisonBlade();

print("\\n=== Final Party Status ===");
warrior.displayStats();
mage.displayStats();
rogue.displayStats();

print("\\n--- Gaining Experience ---");
warrior.gainXP(250);
mage.gainXP(300);
rogue.gainXP(275);

print("\\n=== Classes enable complex game systems! ===");
`,

  vehicleHierarchy: `# Multi-Level Inheritance: Vehicle System
print("=== Advanced Inheritance: Vehicle Factory ===");

# Base Vehicle class - common to all vehicles
class Vehicle {
  init(brand, model, year) {
    print(f"🏭 Manufacturing vehicle: {year} {brand} {model}");
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.speed = 0;
    this.fuel = 100;
    this.isRunning = false;
    this.mileage = 0;
    print(f"   Fuel tank: {this.fuel}%");
  }

  start() {
    if (this.isRunning) {
      print(f"{this.brand} {this.model} is already running!");
      return;
    }
    
    if (this.fuel > 0) {
      this.isRunning = true;
      print(f"🔑 Starting {this.brand} {this.model}... Engine on!");
      this.getStartSound();
    } else {
      print(f"⛽ Cannot start {this.brand} {this.model} - no fuel!");
    }
  }

  stop() {
    if (!this.isRunning) {
      print(f"{this.brand} {this.model} is already stopped!");
      return;
    }
    
    this.isRunning = false;
    this.speed = 0;
    print(f"🛑 Stopping {this.brand} {this.model}... Engine off!");
  }

  accelerate(amount) {
    if (!this.isRunning) {
      print(f"Cannot accelerate - {this.brand} {this.model} is not running!");
      return;
    }
    
    if (this.fuel <= 0) {
      print(f"⛽ Out of fuel! {this.brand} {this.model} cannot accelerate!");
      return;
    }
    
    let oldSpeed = this.speed;
    this.speed = this.speed + amount;
    this.fuel = this.fuel - (amount * 0.5);
    this.mileage = this.mileage + 1;
    
    if (this.fuel < 0) { this.fuel = 0; }
    
    print(f"🚗 {this.brand} {this.model} accelerates!");
    print(f"   Speed: {oldSpeed} -> {this.speed} mph");
    print(f"   Fuel: {this.fuel}%");
  }

  brake(amount) {
    if (this.speed == 0) {
      print(f"{this.brand} {this.model} is already stopped!");
      return;
    }
    
    let oldSpeed = this.speed;
    this.speed = this.speed - amount;
    if (this.speed < 0) { this.speed = 0; }
    
    print(f"🛑 {this.brand} {this.model} applies brakes!");
    print(f"   Speed: {oldSpeed} -> {this.speed} mph");
  }

  refuel() {
    let oldFuel = this.fuel;
    this.fuel = 100;
    print(f"⛽ Refueling {this.brand} {this.model}!");
    print(f"   Fuel: {oldFuel}% -> {this.fuel}%");
  }

  getStartSound() {
    print("   🔊 Vroom vroom!");
  }

  getStatus() {
    print(f"\\n📋 {this.year} {this.brand} {this.model} Status:");
    print(f"   Engine: {this.isRunning ? "Running" : "Off"}");
    print(f"   Speed: {this.speed} mph");
    print(f"   Fuel: {this.fuel}%");
    print(f"   Mileage: {this.mileage} miles");
  }
}

# Car inherits from Vehicle
class Car extends Vehicle {
  init(brand, model, year, doors) {
    super(brand, model, year);
    this.doors = doors;
    this.passengers = 0;
    this.maxPassengers = doors;
    print(f"   🚗 Car features: {doors} doors, seats {this.maxPassengers}");
  }

  getStartSound() {
    print("   🔊 *Click* Purrrr... (smooth car engine)");
  }

  loadPassenger() {
    if (this.passengers < this.maxPassengers) {
      this.passengers = this.passengers + 1;
      print(f"👥 Passenger boards! ({this.passengers}/{this.maxPassengers})");
    } else {
      print(f"🚫 Car is full! ({this.passengers}/{this.maxPassengers})");
    }
  }

  honkHorn() {
    print(f"📯 {this.brand} {this.model}: BEEP BEEP!");
  }

  openTrunk() {
    print(f"📦 {this.brand} {this.model} trunk opened - loading cargo!");
  }
}

# SportsCar extends Car with performance features
class SportsCar extends Car {
  init(brand, model, year) {
    super(brand, model, year, 2);  # Sports cars typically have 2 doors
    this.turboMode = false;
    this.topSpeed = 180;
    print(f"   🏁 Sports car - Top speed: {this.topSpeed} mph");
  }

  getStartSound() {
    print("   🔊 ROAAARRR! (powerful sports car engine)");
  }

  turboBoost() {
    if (!this.isRunning) {
      print("Cannot engage turbo - engine not running!");
      return;
    }
    
    if (this.fuel < 20) {
      print("⛽ Not enough fuel for turbo boost!");
      return;
    }
    
    this.turboMode = true;
    this.fuel = this.fuel - 10;
    let boost = 30;
    let oldSpeed = this.speed;
    this.speed = this.speed + boost;
    
    if (this.speed > this.topSpeed) {
      this.speed = this.topSpeed;
    }
    
    print(f"🚀 TURBO BOOST ACTIVATED!");
    print(f"   Speed: {oldSpeed} -> {this.speed} mph");
    print(f"   Fuel: {this.fuel + 10}% -> {this.fuel}%");
  }

  launchControl() {
    if (this.speed == 0 && this.isRunning) {
      print(f"🏁 {this.brand} {this.model} - LAUNCH CONTROL ENGAGED!");
      this.accelerate(60);
      print("   Perfect launch!");
    } else {
      print("Launch control only works from a standstill!");
    }
  }
}

# Truck inherits from Vehicle with cargo features
class Truck extends Vehicle {
  init(brand, model, year, cargoCapacity) {
    super(brand, model, year);
    this.cargoCapacity = cargoCapacity;
    this.currentCargo = 0;
    print(f"   🚛 Truck features: {cargoCapacity} tons cargo capacity");
  }

  getStartSound() {
    print("   🔊 VROOOOM VROOOM! (heavy diesel engine)");
  }

  loadCargo(weight) {
    if (this.currentCargo + weight <= this.cargoCapacity) {
      this.currentCargo = this.currentCargo + weight;
      print(f"📦 Loading {weight} tons of cargo!");
      print(f"   Cargo: {this.currentCargo - weight} -> {this.currentCargo} tons");
      print(f"   Capacity: {this.currentCargo}/{this.cargoCapacity} tons");
    } else {
      print(f"🚫 Cannot load {weight} tons - would exceed capacity!");
      print(f"   Available space: {this.cargoCapacity - this.currentCargo} tons");
    }
  }

  unloadCargo() {
    if (this.currentCargo > 0) {
      print(f"📤 Unloading all cargo ({this.currentCargo} tons)");
      this.currentCargo = 0;
      print("   Truck is now empty!");
    } else {
      print("No cargo to unload!");
    }
  }

  honkAirHorn() {
    print(f"📯 {this.brand} {this.model}: HOOOOOONK! (loud air horn)");
  }
}

# Motorcycle inherits from Vehicle - lightweight and fast
class Motorcycle extends Vehicle {
  init(brand, model, year, engineSize) {
    super(brand, model, year);
    this.engineSize = engineSize;
    this.hasSidecar = false;
    print(f"   🏍️  Motorcycle features: {engineSize}cc engine");
  }

  getStartSound() {
    print("   🔊 *Kick* BRAAP BRAAP BRAAP! (motorcycle engine)");
  }

  wheelie() {
    if (this.isRunning && this.speed > 20) {
      print(f"🤸 {this.brand} {this.model} pulls a WHEELIE!");
      print("   🎪 Awesome stunt!");
    } else {
      print("Need more speed for a wheelie!");
    }
  }

  addSidecar() {
    if (!this.hasSidecar) {
      this.hasSidecar = true;
      print(f"🛵 Sidecar attached to {this.brand} {this.model}!");
      print("   Now seats 2 people!");
    } else {
      print("Sidecar already attached!");
    }
  }
}

print("\\n=== Vehicle Dealership Demo ===");

# Create different types of vehicles
let sedan = new Car("Toyota", "Camry", 2023, 4);
let sports = new SportsCar("Ferrari", "488", 2023);
let truck = new Truck("Ford", "F-150", 2023, 2.5);
let bike = new Motorcycle("Harley", "Sportster", 2023, 883);

print("\\n=== Vehicle Operations ===");

print("\\n--- Sedan Demo ---");
sedan.start();
sedan.loadPassenger();
sedan.loadPassenger();
sedan.accelerate(40);
sedan.honkHorn();
sedan.getStatus();

print("\\n--- Sports Car Demo ---");
sports.start();
sports.launchControl();
sports.turboBoost();
sports.getStatus();

print("\\n--- Truck Demo ---");
truck.start();
truck.loadCargo(1.5);
truck.loadCargo(1.2);
truck.accelerate(30);
truck.honkAirHorn();
truck.getStatus();

print("\\n--- Motorcycle Demo ---");
bike.start();
bike.accelerate(35);
bike.wheelie();
bike.addSidecar();
bike.getStatus();

print("\\n=== Multi-level inheritance creates rich object hierarchies! ===");
`,

  // ========== DATA STRUCTURES ==========
  linkedListImplementation: `# Linked List Implementation - Dynamic Data Storage
print("=== Linked List Data Structure ===");

class ListNode {
  init(data) {
    this.data = data;
    this.next = null;
    print(f"Created node with data: {data}");
  }
}

class LinkedList {
  init() {
    this.head = null;
    this.size = 0;
    print("Created empty linked list");
  }

  append(data) {
    print(f"\\nAppending {data} to list");
    let newNode = new ListNode(data);
    
    if (this.head == null) {
      this.head = newNode;
      print("Added as first node (head)");
    } else {
      let current = this.head;
      let position = 0;
      
      while (current.next != null) {
        current = current.next;
        position = position + 1;
      }
      
      current.next = newNode;
      print(f"Added at position {position + 1}");
    }
    
    this.size = this.size + 1;
    print(f"List size is now: {this.size}");
  }

  prepend(data) {
    print(f"\\nPrepending {data} to list");
    let newNode = new ListNode(data);
    newNode.next = this.head;
    this.head = newNode;
    this.size = this.size + 1;
    print(f"Added as new head. List size: {this.size}");
  }

  find(data) {
    print(f"\\nSearching for {data}");
    let current = this.head;
    let position = 0;
    
    while (current != null) {
      print(f"Checking position {position}: {current.data}");
      if (current.data == data) {
        print(f"Found {data} at position {position}");
        return position;
      }
      current = current.next;
      position = position + 1;
    }
    
    print(f"{data} not found in list");
    return -1;
  }

  removeAt(index) {
    print(f"\\nRemoving element at index {index}");
    
    if (index < 0 || index >= this.size) {
      print(f"Invalid index {index}. List size is {this.size}");
      return null;
    }
    
    if (index == 0) {
      let data = this.head.data;
      this.head = this.head.next;
      this.size = this.size - 1;
      print(f"Removed head node with data: {data}");
      return data;
    }
    
    let current = this.head;
    for (let i = 0; i < index - 1; i = i + 1) {
      current = current.next;
    }
    
    let nodeToRemove = current.next;
    let data = nodeToRemove.data;
    current.next = nodeToRemove.next;
    this.size = this.size - 1;
    
    print(f"Removed node with data: {data}");
    return data;
  }

  display() {
    print("\\nCurrent list contents:");
    if (this.head == null) {
      print("List is empty");
      return;
    }
    
    let current = this.head;
    let position = 0;
    let elements = [];
    
    while (current != null) {
      elements = push(elements, current.data);
      print(f"Position {position}: {current.data}");
      current = current.next;
      position = position + 1;
    }
    
    print(f"List: {elements} (size: {this.size})");
  }

  reverse() {
    print("\\nReversing the linked list");
    let prev = null;
    let current = this.head;
    let next = null;
    
    while (current != null) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    
    this.head = prev;
    print("List reversed successfully");
  }
}

print("\\n--- Building a Linked List ---");
let list = new LinkedList();

list.append(10);
list.append(20);
list.append(30);
list.display();

list.prepend(5);
list.display();

print("\\n--- Search Operations ---");
list.find(20);
list.find(99);

print("\\n--- Removal Operations ---");
list.removeAt(1);
list.display();

print("\\n--- List Reversal ---");
list.reverse();
list.display();

print("\\n=== Linked Lists provide dynamic, efficient insertion! ===");
`,

  stackImplementation: `# Stack Implementation - Last In, First Out (LIFO)
print("=== Stack Data Structure ===");

class Stack {
  init() {
    this.items = [];
    this.top = -1;
    print("Created empty stack");
  }

  push(element) {
    this.items = push(this.items, element);
    this.top = this.top + 1;
    print(f"Pushed {element}. Stack size: {this.top + 1}");
    this.display();
  }

  pop() {
    if (this.isEmpty()) {
      print("Cannot pop - stack is empty!");
      return null;
    }
    
    let element = this.items[this.top];
    # Remove last element (since we don't have built-in pop)
    let newItems = [];
    for (let i = 0; i < this.top; i = i + 1) {
      newItems = push(newItems, this.items[i]);
    }
    this.items = newItems;
    this.top = this.top - 1;
    
    print(f"Popped {element}. Stack size: {this.top + 1}");
    this.display();
    return element;
  }

  peek() {
    if (this.isEmpty()) {
      print("Cannot peek - stack is empty!");
      return null;
    }
    
    let topElement = this.items[this.top];
    print(f"Top element: {topElement}");
    return topElement;
  }

  isEmpty() {
    let empty = this.top == -1;
    return empty;
  }

  size() {
    return this.top + 1;
  }

  display() {
    if (this.isEmpty()) {
      print("Stack: [] (empty)");
      return;
    }
    
    print("Stack (bottom to top):");
    for (let i = 0; i <= this.top; i = i + 1) {
      let marker = "";
      if (i == this.top) {
        marker = " <- TOP";
      }
      print(f"  [{i}] {this.items[i]}{marker}");
    }
  }

  clear() {
    this.items = [];
    this.top = -1;
    print("Stack cleared");
  }
}

# Demonstrate stack with balanced parentheses checker
let checkBalancedParentheses = fn(expression) {
  print(f"\\n=== Checking Balanced Parentheses ===");
  print(f"Expression: {expression}");
  
  let stack = new Stack();
  let balanced = true;
  
  for (let i = 0; i < len(expression); i = i + 1) {
    let char = expression[i];  # Note: This is conceptual - we'd need char access
    
    # For demonstration, let's assume we have parentheses as separate elements
    if (char == "(") {
      print(f"Found opening parenthesis at position {i}");
      stack.push(i);
    } elif (char == ")") {
      print(f"Found closing parenthesis at position {i}");
      if (stack.isEmpty()) {
        print("Error: Closing parenthesis without matching opening");
        balanced = false;
        break;
      } else {
        let openPos = stack.pop();
        print(f"Matched with opening parenthesis at position {openPos}");
      }
    }
  }
  
  if (balanced && !stack.isEmpty()) {
    print("Error: Unmatched opening parentheses remain");
    balanced = false;
  }
  
  if (balanced) {
    print("✓ Expression is balanced!");
  } else {
    print("✗ Expression is NOT balanced!");
  }
  
  return balanced;
};

print("\\n--- Basic Stack Operations ---");
let stack = new Stack();

stack.push(10);
stack.push(20);
stack.push(30);

stack.peek();

stack.pop();
stack.pop();

stack.push(40);
stack.peek();

# For parentheses demo, we'll manually push/pop
print("\\n--- Parentheses Checking Demo ---");
let parenStack = new Stack();
print("Simulating: ((())())");
print("Processing opening parentheses:");
parenStack.push("(");
parenStack.push("(");
parenStack.push("(");

print("\\nProcessing closing parentheses:");
parenStack.pop();  # matches (((
parenStack.pop();  # matches ((
parenStack.push("(");  # new opening
parenStack.pop();  # matches new (
parenStack.pop();  # matches remaining (

print("\\nAll parentheses matched - expression is balanced!");

print("\\n=== Stacks are perfect for LIFO operations! ===");
`,

  queueImplementation: `# Queue Implementation - First In, First Out (FIFO)
print("=== Queue Data Structure ===");

class Queue {
  init() {
    this.items = [];
    this.front = 0;
    this.rear = -1;
    this.count = 0;
    print("Created empty queue");
  }

  enqueue(element) {
    this.items = push(this.items, element);
    this.rear = this.rear + 1;
    this.count = this.count + 1;
    print(f"Enqueued {element}. Queue size: {this.count}");
    this.display();
  }

  dequeue() {
    if (this.isEmpty()) {
      print("Cannot dequeue - queue is empty!");
      return null;
    }
    
    let element = this.items[this.front];
    this.front = this.front + 1;
    this.count = this.count - 1;
    
    print(f"Dequeued {element}. Queue size: {this.count}");
    this.display();
    return element;
  }

  peek() {
    if (this.isEmpty()) {
      print("Cannot peek - queue is empty!");
      return null;
    }
    
    let frontElement = this.items[this.front];
    print(f"Front element: {frontElement}");
    return frontElement;
  }

  isEmpty() {
    return this.count == 0;
  }

  size() {
    return this.count;
  }

  display() {
    if (this.isEmpty()) {
      print("Queue: [] (empty)");
      return;
    }
    
    print("Queue (front to rear):");
    let queueElements = [];
    for (let i = this.front; i <= this.rear; i = i + 1) {
      queueElements = push(queueElements, this.items[i]);
    }
    print(f"  {queueElements}");
    print(f"  Front index: {this.front}, Rear index: {this.rear} \n");
  }

  clear() {
    this.items = [];
    this.front = 0;
    this.rear = -1;
    this.count = 0;
    print("Queue cleared");
  }
}

# Simulate a customer service queue
let simulateCustomerService = fn() {
  print("\\n=== Customer Service Queue Simulation ===");
  
  let serviceQueue = new Queue();
  let customers = ["Alice", "Bob", "Carol", "David", "Eve"];
  
  print("Customers arriving:");
  for (let i = 0; i < len(customers); i = i + 1) {
    print(f"Customer {customers[i]} joins the queue");
    serviceQueue.enqueue(customers[i]);
  }
  
  print("\\nServicing customers (FIFO order):");
  while (!serviceQueue.isEmpty()) {
    let customer = serviceQueue.dequeue();
    print(f"Now serving: {customer}");
    print(f"Customers waiting: {serviceQueue.size()}");
    
    if (!serviceQueue.isEmpty()) {
      print(f"Next customer: {serviceQueue.peek()}");
    }
    print("---");
  }
  
  print("All customers served!");
};

# Breadth-First Search simulation using queue
let simulateBFS = fn() {
  print("\\n=== BFS Traversal Simulation ===");
  print("Simulating breadth-first search on a tree");
  
  let bfsQueue = new Queue();
  
  # Simulate tree nodes (normally these would be objects)
  print("Starting BFS from root node 'A'");
  bfsQueue.enqueue("A");
  
  let visited = [];
  
  while (!bfsQueue.isEmpty()) {
    let currentNode = bfsQueue.dequeue();
    visited = push(visited, currentNode);
    print(f"Visiting node: {currentNode}");
    
    # Simulate adding children to queue
    if (currentNode == "A") {
      print("Adding children of A: B, C");
      bfsQueue.enqueue("B");
      bfsQueue.enqueue("C");
    } elif (currentNode == "B") {
      print("Adding children of B: D, E");
      bfsQueue.enqueue("D");
      bfsQueue.enqueue("E");
    } elif (currentNode == "C") {
      print("Adding children of C: F");
      bfsQueue.enqueue("F");
    }
    # D, E, F are leaf nodes - no children
    
    print(f"Visited so far: {visited}");
    print("---");
  }
  
  print(f"BFS traversal complete: {visited}");
};

print("\\n--- Basic Queue Operations ---");
let queue = new Queue();

queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);

queue.peek();

queue.dequeue();
queue.dequeue();

queue.enqueue(40);
queue.enqueue(50);

simulateCustomerService();
simulateBFS();

print("\\n=== Queues ensure fair, first-come-first-served processing! ===");
`,

  binaryTreeImplementation: `# Binary Tree Implementation - Hierarchical Data Structure
print("=== Binary Tree Data Structure ===");

class TreeNode {
  init(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    print(f"Created tree node with data: {data}");
  }
}

class BinaryTree {
  init() {
    this.root = null;
    print("Created empty binary tree");
  }

  insert(data) {
    print(f"\\nInserting {data} into tree");
    if (this.root == null) {
      this.root = new TreeNode(data);
      print(f"{data} inserted as root");
    } else {
      this.insertNode(this.root, data);
    }
  }

  insertNode(node, data) {
    if (data < node.data) {
      print(f"{data} < {node.data}, going left");
      if (node.left == null) {
        node.left = new TreeNode(data);
        print(f"{data} inserted as left child of {node.data}");
      } else {
        this.insertNode(node.left, data);
      }
    } else {
      print(f"{data} >= {node.data}, going right");
      if (node.right == null) {
        node.right = new TreeNode(data);
        print(f"{data} inserted as right child of {node.data}");
      } else {
        this.insertNode(node.right, data);
      }
    }
  }

  search(data) {
    print(f"\\nSearching for {data}");
    return this.searchNode(this.root, data);
  }

  searchNode(node, data) {
    if (node == null) {
      print(f"{data} not found");
      return false;
    }
    
    print(f"Checking node: {node.data}");
    
    if (data == node.data) {
      print(f"Found {data}!");
      return true;
    } elif (data < node.data) {
      print(f"{data} < {node.data}, searching left subtree");
      return this.searchNode(node.left, data);
    } else {
      print(f"{data} > {node.data}, searching right subtree");
      return this.searchNode(node.right, data);
    }
  }

  inorderTraversal() {
    print("\\nInorder traversal (Left -> Root -> Right):");
    let result = [];
    this.inorderHelper(this.root, result);
    print(f"Inorder result: {result}");
    return result;
  }

  inorderHelper(node, result) {
    if (node != null) {
      this.inorderHelper(node.left, result);
      print(f"Visiting: {node.data}");
      result = push(result, node.data);
      this.inorderHelper(node.right, result);
    }
  }

  preorderTraversal() {
    print("\\nPreorder traversal (Root -> Left -> Right):");
    let result = [];
    this.preorderHelper(this.root, result);
    print(f"Preorder result: {result}");
    return result;
  }

  preorderHelper(node, result) {
    if (node != null) {
      print(f"Visiting: {node.data}");
      result = push(result, node.data);
      this.preorderHelper(node.left, result);
      this.preorderHelper(node.right, result);
    }
  }

  postorderTraversal() {
    print("\\nPostorder traversal (Left -> Right -> Root):");
    let result = [];
    this.postorderHelper(this.root, result);
    print(f"Postorder result: {result}");
    return result;
  }

  postorderHelper(node, result) {
    if (node != null) {
      this.postorderHelper(node.left, result);
      this.postorderHelper(node.right, result);
      print(f"Visiting: {node.data}");
      result = push(result, node.data);
    }
  }

  height() {
    print("\\nCalculating tree height");
    let h = this.heightHelper(this.root);
    print(f"Tree height: {h}");
    return h;
  }

  heightHelper(node) {
    if (node == null) {
      return 0;
    }
    
    let leftHeight = this.heightHelper(node.left);
    let rightHeight = this.heightHelper(node.right);
    
    let maxHeight = leftHeight;
    if (rightHeight > leftHeight) {
      maxHeight = rightHeight;
    }
    
    return maxHeight + 1;
  }

  levelOrder() {
    print("\\nLevel-order traversal (breadth-first):");
    if (this.root == null) {
      print("Tree is empty");
      return [];
    }
    
    # Simulate queue with array (manual queue implementation)
    let queue = [this.root];
    let result = [];
    let front = 0;
    
    while (front < len(queue)) {
      let current = queue[front];
      front = front + 1;
      
      print(f"Visiting: {current.data}");
      result = push(result, current.data);
      
      if (current.left != null) {
        queue = push(queue, current.left);
      }
      if (current.right != null) {
        queue = push(queue, current.right);
      }
    }
    
    print(f"Level-order result: {result}");
    return result;
  }
}

print("\\n--- Building a Binary Search Tree ---");
let bst = new BinaryTree();

# Insert values to create a balanced tree
let values = [50, 30, 70, 20, 40, 60, 80];
print(f"Inserting values: {values}");

for (let i = 0; i < len(values); i = i + 1) {
  bst.insert(values[i]);
}

print("\\n--- Tree Traversals ---");
bst.inorderTraversal();    # Should print sorted order for BST
bst.preorderTraversal();
bst.postorderTraversal();
bst.levelOrder();

print("\\n--- Search Operations ---");
bst.search(40);
bst.search(25);
bst.search(80);

print("\\n--- Tree Properties ---");
bst.height();

print("\\n=== Binary trees enable efficient searching and sorting! ===");
`,

  hashTableImplementation: `
  # Hash Table Implementation - Fast Key-Value Storage
print("=== Hash Table Data Structure ===");

class HashTable {
  init(size) {
    this.size = size;
    this.buckets = [];
    this.count = 0;
    
    # Initialize all buckets as empty arrays
    for (let i = 0; i < size; i = i + 1) {
      this.buckets = push(this.buckets, []);
    }
    
    print(f"Created hash table with {size} buckets");
  }

  hash(key) {
    # Simple hash function: sum of character codes mod table size
    # In a real implementation, this would be more sophisticated
    let hash = 0;
    
    if (lower(type(key)) == "string") {
      # Simulate character code sum
      hash = len(key) * 31;  # Simple approximation
    } else {
      hash = key;
    }
    
    let index = hash % this.size;
    print(f"Hash({key}) = {hash} -> bucket {index}");
    return index;
  }

  put(key, value) {
    print(f"\nInserting key: {key}, value: {value}");
    let index = this.hash(key);
    let bucket = this.buckets[index];
    
    # Check if key already exists
    let found = false;
    for (let i = 0; i < len(bucket); i = i + 1) {
      let pair = bucket[i];
      if (pair[0] == key) {
        print(f"Key {key} already exists, updating value");
        pair[1] = value;
        found = true;
        break;
      }
    }
    
    if (!found) {
      let newPair = [key, value];
      bucket = push(bucket, newPair);
      this.buckets[index] = bucket;
      this.count = this.count + 1;
      print(f"Added new key-value pair to bucket {index}");
    }
    
    print(f"Total entries: {this.count}");
    if (len(bucket) > 1) {
      print(f"Collision detected! Bucket {index} has {len(bucket)} entries");
    }
  }

  get(key) {
    print(f"\nLooking up key: {key}");
    let index = this.hash(key);
    let bucket = this.buckets[index];
    
    print(f"Searching in bucket {index}");
    for (let i = 0; i < len(bucket); i = i + 1) {
      let pair = bucket[i];
      if (pair[0] == key) {
        print(f"Found {key} -> {pair[1]}");
        return pair[1];
      }
    }
    
    print(f"Key {key} not found");
    return null;
  }

  remove(key) {
    print(f"\nRemoving key: {key}");
    let index = this.hash(key);
    let bucket = this.buckets[index];
    
    let newBucket = [];
    let found = false;
    
    for (let i = 0; i < len(bucket); i = i + 1) {
      let pair = bucket[i];
      if (pair[0] != key) {
        newBucket = push(newBucket, pair);
      } else {
        found = true;
        print(f"Removed {key} -> {pair[1]}");
      }
    }
    
    if (found) {
      this.buckets[index] = newBucket;
      this.count = this.count - 1;
      print(f"Total entries: {this.count}");
    } else {
      print(f"Key {key} not found for removal");
    }
    
    return found;
  }

  display() {
    print("\nHash Table Contents:");
    print(f"Size: {this.size}, Entries: {this.count}");
    
    for (let i = 0; i < this.size; i = i + 1) {
      let bucket = this.buckets[i];
      if (len(bucket) > 0) {
        print(f"Bucket {i}:");
        for (let j = 0; j < len(bucket); j = j + 1) {
          let pair = bucket[j];
          print(f"  {pair[0]} -> {pair[1]}");
        }
      }
    }
  }

  loadFactor() {
    let factor = this.count / this.size;
    print(f"\nLoad factor: {this.count}/{this.size} = {factor}");
    if (factor > 0.75) {
      print("Warning: High load factor - consider resizing");
    }
    return factor;
  }

  getKeys() {
    print("\nAll keys in hash table:");
    let keys = [];
    
    for (let i = 0; i < this.size; i = i + 1) {
      let bucket = this.buckets[i];
      for (let j = 0; j < len(bucket); j = j + 1) {
        let pair = bucket[j];
        keys = push(keys, pair[0]);
      }
    }
    
    print(f"Keys: {keys}");
    return keys;
  }
}

print("\n--- Creating Hash Table ---");
let hashTable = new HashTable(7);  # Prime number for better distribution

print("\n--- Basic Operations ---");
hashTable.put("name", "Alice");
hashTable.put("age", 25);
hashTable.put("city", "New York");
hashTable.put("job", "Engineer");

hashTable.display();

print("\n--- Lookup Operations ---");
hashTable.get("name");
hashTable.get("age");
hashTable.get("nonexistent");

print("\n--- Collision Demonstration ---");
# These might cause collisions depending on hash function
hashTable.put("abc", "value1");
hashTable.put("bca", "value2");  # Might hash to same bucket
hashTable.put("cab", "value3");

hashTable.display();
hashTable.loadFactor();

print("\n--- Update and Remove ---");
hashTable.put("age", 26);  # Update existing key
hashTable.remove("city");
hashTable.display();

hashTable.getKeys();

print("\n--- Performance Analysis ---");
print("Hash tables provide O(1) average case for:");
print("- Insert: put(key, value)");
print("- Search: get(key)");  
print("- Delete: remove(key)");
print("\nWorst case is O(n) when all keys hash to same bucket");

print("\n=== Hash tables enable lightning-fast key-value lookups! ===");
`,

  graphRepresentation: `
  # Graph Data Structure - Adjacency List Representation
print("=== Graph Data Structure ===");

class Graph {
  init(directed) {
    this.adjacencyList = {};
    this.directed = directed;
    this.vertexCount = 0;
    this.edgeCount = 0;
  }

  addVertex(vertex) {
    if (this.adjacencyList[vertex] == null) {
      this.adjacencyList[vertex] = [];
      this.vertexCount = this.vertexCount + 1;
      print(f"Added vertex: {vertex}");
    } else {
      print(f"Vertex {vertex} already exists");
    }
  }

  addEdge(vertex1, vertex2, weight) {
    if (weight == null) {
      weight = 1;
    }
    
    print(f"Adding edge: {vertex1} -> {vertex2} (weight: {weight})");
    
    # Ensure vertices exist
    if (this.adjacencyList[vertex1] == null) {
      this.addVertex(vertex1);
    }
    if (this.adjacencyList[vertex2] == null) {
      this.addVertex(vertex2);
    }
    
    # Add edge from vertex1 to vertex2
    let edge1 = {"vertex": vertex2, "weight": weight};
    this.adjacencyList[vertex1] = push(this.adjacencyList[vertex1], edge1);
    
    # If undirected, add reverse edge
    if (!this.directed) {
      let edge2 = {"vertex": vertex1, "weight": weight};
      this.adjacencyList[vertex2] = push(this.adjacencyList[vertex2], edge2);
    }
    
    this.edgeCount = this.edgeCount + 1;
  }

  display() {
    print("\n=== Graph Structure ===");
    print(f"Type: {this.graphType()}");
    print(f"Vertices: {this.vertexCount}, Edges: {this.edgeCount}");
    
    let vertices = keys(this.adjacencyList);
    for (let i = 0; i < len(vertices); i = i + 1) {
      let vertex = vertices[i];
      let edges = this.adjacencyList[vertex];
      
      if (len(edges) == 0) {
        print(f"{vertex}: (no connections)");
      } else {
        let connections = [];
        for (let j = 0; j < len(edges); j = j + 1) {
          let edge = edges[j];
          connections = push(connections, f"{edge['vertex']}({edge['weight']})");
        }
        print(f"{vertex}: {join(connections, ', ')}");
      }
    }
  }

  graphType() {
    if (this.directed) {
      return "Directed";
    }
    return "Undirected";
    }

  bfs(startVertex) {
    print(f"\\n=== Breadth-First Search from {startVertex} ===");
    
    if (this.adjacencyList[startVertex] == null) {
      print(f"Vertex {startVertex} not found in graph");
      return [];
    }
    
    let visited = {};
    let queue = [startVertex];
    let result = [];
    let front = 0;
    
    visited[startVertex] = true;
    print(f"Starting BFS from {startVertex}");
    
    while (front < len(queue)) {
      let currentVertex = queue[front];
      front = front + 1;
      
      result = push(result, currentVertex);
      print(f"Visiting: {currentVertex}");
      
      let neighbors = this.adjacencyList[currentVertex];
      for (let i = 0; i < len(neighbors); i = i + 1) {
        let neighbor = neighbors[i]["vertex"];
        
        if (visited[neighbor] == null) {
          visited[neighbor] = true;
          queue = push(queue, neighbor);
          print(f"  Added {neighbor} to queue");
        }
      }
    }
    
    print(f"BFS traversal order: {result}");
    return result;
  }


  dfs(startVertex) {
    print(f"\\n=== Depth-First Search from {startVertex} ===");
    
    if (this.adjacencyList[startVertex] == null) {
      print(f"Vertex {startVertex} not found in graph");
      return [];
    }
    
    let visited = {};
    let result = [];
    
    this.dfsHelper(startVertex, visited, result);
    
    print(f"DFS traversal order: {result}");
    return result;
  }

  dfsHelper(vertex, visited, result) {
    visited[vertex] = true;
    result = push(result, vertex);
    print(f"Visiting: {vertex}");
    
    let neighbors = this.adjacencyList[vertex];
    for (let i = 0; i < len(neighbors); i = i + 1) {
      let neighbor = neighbors[i]["vertex"];
      
      if (visited[neighbor] == null) {
        print(f"  Exploring {neighbor} from {vertex}");
        this.dfsHelper(neighbor, visited, result);
      }
    }
  }

  hasPath(start, end) {
    print(f"\\n=== Checking if path exists: {start} -> {end} ===");
    
    if (start == end) {
      print("Start and end are the same vertex");
      return true;
    }
    
    let visited = {};
    let queue = [start];
    let front = 0;
    
    visited[start] = true;
    
    while (front < len(queue)) {
      let current = queue[front];
      front = front + 1;
      
      let neighbors = this.adjacencyList[current];
      for (let i = 0; i < len(neighbors); i = i + 1) {
        let neighbor = neighbors[i]["vertex"];
        
        if (neighbor == end) {
          print(f"Path found: {start} -> ... -> {current} -> {end}");
          return true;
        }
        
        if (visited[neighbor] == null) {
          visited[neighbor] = true;
          queue = push(queue, neighbor);
        }
      }
    }
    
    print(f"No path exists from {start} to {end}");
    return false;
  }
}

print("\n--- Creating and Building Graph ---");
let graph = new Graph(false);  # Undirected graph

# Add vertices
let vertices = ["A", "B", "C", "D", "E", "F"];
for (let i = 0; i < len(vertices); i = i + 1) {
  graph.addVertex(vertices[i]);
}

# Add edges to create a connected graph
graph.addEdge("A", "B", 4);
graph.addEdge("A", "C", 2);
graph.addEdge("B", "D", 3);
graph.addEdge("C", "D", 1);
graph.addEdge("C", "E", 5);
graph.addEdge("D", "E", 2);
graph.addEdge("D", "F", 6);
graph.addEdge("E", "F", 1);

graph.display();

print("\n--- Graph Traversals ---");
graph.bfs("A");
graph.dfs("A");

print("\n--- Path Finding ---");
graph.hasPath("A", "F");
graph.hasPath("B", "E");
graph.hasPath("A", "X");  # Non-existent vertex

print("\n=== Graphs model relationships and enable pathfinding! ===");

  `,
};

export const getRandomSampleCode = (): string => {
  const snippets = Object.values(sampleCodeSnippets);
  const randomIndex = Math.floor(Math.random() * snippets.length);
  return snippets[randomIndex];
};

// Updated category-based snippet access with new class categories
export const snippetCategories = {
  beginner: [
    "simpleBeginnerExample",
    "basicArithmetic",
    "stringOperations",
    "simpleFunction",
    "basicClass",
  ],

  algorithms: [
    "bubbleSort",
    "binarySearch",
    "primeNumbers",
    "matrixMultiplication",
  ],

  games: ["ticTacToe", "rpgCharacterSystem", "gameCharacterClasses"],

  mathematics: [
    "fibonacci",
    "fibonacci_iterative",
    "factorial",
    "primeNumbers",
  ],

  // NEW CLASS CATEGORIES
  objectOriented: [
    "basicClass",
    "classInheritance",
    "gameCharacterClasses",
    "vehicleHierarchy",
  ],

  realWorld: ["bankAccount", "vehicleHierarchy", "gameCharacterClasses"],

  dataStructures: [
    "linkedListImplementation",
    "stackImplementation",
    "queueImplementation",
    "binaryTreeImplementation",
    "hashTableImplementation",
    "graphRepresentation",
  ],

  inheritance: ["classInheritance", "gameCharacterClasses", "vehicleHierarchy"],
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

const createCategorizedExamples = () => {
  const categoryConfig = {
    beginner: {
      emoji: "🌱",
      name: "Beginner Friendly",
      description: "Start your coding journey",
    },
    algorithms: {
      emoji: "⚡",
      name: "Algorithms",
      description: "Sorting and searching",
    },
    dataStructures: {
      emoji: "🏗️",
      name: "Data Structures",
      description: "Arrays, objects, and more",
    },
    games: {
      emoji: "🎮",
      name: "Games & Fun",
      description: "Interactive programs",
    },
    mathematics: {
      emoji: "🧮",
      name: "Mathematics",
      description: "Number theory and calculations",
    },
    advanced: {
      emoji: "🚀",
      name: "Advanced",
      description: "Complex programming concepts",
    },
    objectOriented: {
      emoji: "🏛️",
      name: "Object-Oriented",
      description: "Classes and inheritance",
    },
    realWorld: {
      emoji: "🌍",
      name: "Real World",
      description: "Practical applications",
    },
    inheritance: {
      emoji: "🧬",
      name: "Inheritance",
      description: "Advanced OOP concepts",
    },
  };

  return Object.entries(snippetCategories).map(([categoryKey, examples]) => ({
    key: categoryKey,
    ...categoryConfig[categoryKey as keyof typeof categoryConfig],
    examples: examples.map((exampleKey) => ({
      key: exampleKey,
      name: formatExampleName(exampleKey),
    })),
  }));
};

// Helper function to format example names nicely
const formatExampleName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
};

export const categorizedExamples = createCategorizedExamples();
