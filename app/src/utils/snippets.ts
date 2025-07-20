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

  closureCounter: `# Advanced Closure: Counter Factory with multiple instances
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
        print(f"Counter {name} (#{id}) current value: {count}");
        return count; 
      },
      "increment": fn() {
        let oldValue = count;
        count = count + 1;
        print(f"Counter {name} incremented: {oldValue} -> {count}");
        return count;
      },
      "decrement": fn() {
        let oldValue = count;
        count = count - 1;
        print(f"Counter {name} decremented: {oldValue} -> {count}");
        return count;
      },
      "reset": fn() {
        let oldValue = count;
        count = initialValue;
        print(f"Counter {name} reset: {oldValue} -> {count}");
        return count;
      },
      "add": fn(value) {
        let oldValue = count;
        count = count + value;
        print(f"Counter {name} added {value}: {oldValue} -> {count}");
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

  libraryManagement: `# Library Management System with Classes
print("=== Digital Library Management System ===");

# Base Item class for all library items
class LibraryItem {
  init(title, author, itemId) {
    print(f"📚 Adding to library: {title} by {author}");
    this.title = title;
    this.author = author;
    this.itemId = itemId;
    this.isCheckedOut = false;
    this.borrower = null;
    this.borrowDate = null;
    this.dueDate = null;
    print(f"   ID: {this.itemId}, Status: Available");
  }

  checkOut(memberName, borrowDays) {
    if (this.isCheckedOut) {
      print(f"❌ {this.title} is already checked out by {this.borrower}");
      return false;
    }

    this.isCheckedOut = true;
    this.borrower = memberName;
    this.borrowDate = "Today";  # In real system, would be actual date
    this.dueDate = f"Today + {borrowDays} days";
    
    print(f"✅ {this.title} checked out to {memberName}");
    print(f"   Due date: {this.dueDate}");
    return true;
  }

  checkIn() {
    if (!this.isCheckedOut) {
      print(f"❌ {this.title} is not currently checked out");
      return false;
    }

    let previousBorrower = this.borrower;
    this.isCheckedOut = false;
    this.borrower = null;
    this.borrowDate = null;
    this.dueDate = null;
    
    print(f"📚 {this.title} returned by {previousBorrower}");
    print("   Status: Available");
    return true;
  }

  getStatus() {
    print(f"\\n📋 {this.getItemType()}: {this.title}");
    print(f"   Author: {this.author}");
    print(f"   ID: {this.itemId}");
    if (this.isCheckedOut) {
      print(f"   Status: Checked out to {this.borrower}");
      print(f"   Due: {this.dueDate}");
    } else {
      print("   Status: Available");
    }
    this.getSpecificInfo();
  }

  getItemType() {
    return "Library Item";
  }

  getSpecificInfo() {
    # Override in child classes
  }
}

# Book class extends LibraryItem
class Book extends LibraryItem {
  init(title, author, itemId, pages, genre) {
    super(title, author, itemId);
    this.pages = pages;
    this.genre = genre;
    this.bookmark = 0;
    print(f"   📖 Book details: {pages} pages, Genre: {genre}");
  }

  getItemType() {
    return "Book";
  }

  getSpecificInfo() {
    print(f"   Pages: {this.pages}");
    print(f"   Genre: {this.genre}");
    if (this.bookmark > 0) {
      print(f"   Bookmark: Page {this.bookmark}");
    }
  }

  setBookmark(page) {
    if (page >= 0 && page <= this.pages) {
      this.bookmark = page;
      print(f"🔖 Bookmark set to page {page} in {this.title}");
    } else {
      print(f"❌ Invalid page number: {page} (Book has {this.pages} pages)");
    }
  }

  getReadingProgress() {
    if (this.bookmark == 0) {
      return 0;
    }
    let progress = (this.bookmark / this.pages) * 100;
    print(f"📊 Reading progress for {this.title}: {progress}%");
    return progress;
  }
}

# DVD class extends LibraryItem
class DVD extends LibraryItem {
  init(title, director, itemId, duration, rating) {
    super(title, director, itemId);
    this.director = director;  # Override author for DVDs
    this.duration = duration;
    this.rating = rating;
    this.watchCount = 0;
    print(f"   🎬 DVD details: {duration} minutes, Rated {rating}");
  }

  getItemType() {
    return "DVD";
  }

  getSpecificInfo() {
    print(f"   Director: {this.director}");
    print(f"   Duration: {this.duration} minutes");
    print(f"   Rating: {this.rating}");
    print(f"   Times watched: {this.watchCount}");
  }

  watchMovie() {
    if (this.isCheckedOut) {
      this.watchCount = this.watchCount + 1;
      print(f"🎬 Watching {this.title}!");
      print(f"   Watch count: {this.watchCount}");
      print(f"   Enjoy the {this.duration}-minute film!");
    } else {
      print(f"❌ {this.title} must be checked out to watch");
    }
  }
}

# Magazine class extends LibraryItem
class Magazine extends LibraryItem {
  init(title, publisher, itemId, issue, month, year) {
    super(title, publisher, itemId);
    this.publisher = publisher;  # Override author for magazines
    this.issue = issue;
    this.month = month;
    this.year = year;
    this.articlesRead = [];
    print(f"   📰 Magazine details: Issue {issue}, {month} {year}");
  }

  getItemType() {
    return "Magazine";
  }

  getSpecificInfo() {
    print(f"   Publisher: {this.publisher}");
    print(f"   Issue: {this.issue} ({this.month} {this.year})");
    print(f"   Articles read: {len(this.articlesRead)}");
  }

  readArticle(articleTitle) {
    this.articlesRead = push(this.articlesRead, articleTitle);
    print(f"📰 Reading article: {articleTitle}");
    print(f"   Articles read in this issue: {len(this.articlesRead)}");
  }

  listArticlesRead() {
    if (len(this.articlesRead) == 0) {
      print(f"No articles read yet in {this.title}");
    } else {
      print(f"📰 Articles read in {this.title}:");
      for (let i = 0; i < len(this.articlesRead); i = i + 1) {
        print(f"   {i + 1}. {this.articlesRead[i]}");
      }
    }
  }
}

# Library class to manage all items
class Library {
  init(name) {
    print(f"🏛️  Initializing {name}");
    this.name = name;
    this.items = [];
    this.members = [];
    this.totalCheckouts = 0;
    print("   Library system ready!");
  }

  addItem(item) {
    this.items = push(this.items, item);
    print(f"➕ Added {item.getItemType()}: {item.title} to library");
    print(f"   Total items: {len(this.items)}");
  }

  findItem(itemId) {
    for (let i = 0; i < len(this.items); i = i + 1) {
      if (this.items[i].itemId == itemId) {
        return this.items[i];
      }
    }
    return null;
  }

  checkOutItem(itemId, memberName, days) {
    let item = this.findItem(itemId);
    if (item == null) {
      print(f"❌ Item with ID {itemId} not found");
      return false;
    }

    if (item.checkOut(memberName, days)) {
      this.totalCheckouts = this.totalCheckouts + 1;
      print(f"📊 Total library checkouts: {this.totalCheckouts}");
      return true;
    }
    return false;
  }

  checkInItem(itemId) {
    let item = this.findItem(itemId);
    if (item == null) {
      print(f"❌ Item with ID {itemId} not found");
      return false;
    }

    return item.checkIn();
  }

  showLibraryStatus() {
    print(f"\\n🏛️  {this.name} Status Report");
    print(f"   Total items: {len(this.items)}");
    print(f"   Total checkouts: {this.totalCheckouts}");

    let available = 0;
    let checkedOut = 0;

    for (let i = 0; i < len(this.items); i = i + 1) {
      if (this.items[i].isCheckedOut) {
        checkedOut = checkedOut + 1;
      } else {
        available = available + 1;
      }
    }

    print(f"   Available: {available}");
    print(f"   Checked out: {checkedOut}");
  }

  listAllItems() {
    print(f"\\n📚 All items in {this.name}:");
    for (let i = 0; i < len(this.items); i = i + 1) {
      let item = this.items[i];
      let status = item.isCheckedOut ? f"(Checked out to {item.borrower})" : "(Available)";
      print(f"   {item.itemId}: {item.title} {status}");
    }
  }
}

print("\\n=== Setting Up Central Library ===");
let library = new Library("Central City Library");

print("\\n=== Adding Books ===");
let book1 = new Book("The Great Gatsby", "F. Scott Fitzgerald", "B001", 180, "Classic");
let book2 = new Book("To Kill a Mockingbird", "Harper Lee", "B002", 376, "Fiction");
let book3 = new Book("1984", "George Orwell", "B003", 328, "Dystopian");

library.addItem(book1);
library.addItem(book2);
library.addItem(book3);

print("\\n=== Adding DVDs ===");
let dvd1 = new DVD("The Matrix", "Wachowski Sisters", "D001", 136, "R");
let dvd2 = new DVD("Finding Nemo", "Andrew Stanton", "D002", 100, "G");

library.addItem(dvd1);
library.addItem(dvd2);

print("\\n=== Adding Magazines ===");
let mag1 = new Magazine("National Geographic", "National Geographic Society", "M001", 45, "October", 2023);
let mag2 = new Magazine("Scientific American", "Springer Nature", "M002", 312, "November", 2023);

library.addItem(mag1);
library.addItem(mag2);

print("\\n=== Library Operations ===");
library.showLibraryStatus();
library.listAllItems();

print("\\n=== Member Activity ===");
library.checkOutItem("B001", "Alice Johnson", 14);
library.checkOutItem("D001", "Bob Smith", 7);
library.checkOutItem("M001", "Carol Davis", 3);

print("\\n=== Using Checked Out Items ===");
book1.setBookmark(45);
book1.getReadingProgress();

dvd1.watchMovie();

mag1.readArticle("Climate Change Impact");
mag1.readArticle("Ocean Conservation");
mag1.listArticlesRead();

print("\\n=== Item Status Check ===");
book1.getStatus();
dvd1.getStatus();
mag1.getStatus();

print("\\n=== Returning Items ===");
library.checkInItem("B001");
library.checkInItem("D001");

library.showLibraryStatus();

print("\\n=== Classes enable complex real-world systems! ===");
`,

  // Add to categories at the end of the object
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

  dataStructures: ["filterAndMap", "closureCounter", "bankAccount"],

  games: ["ticTacToe", "rpgCharacterSystem", "gameCharacterClasses"],

  mathematics: [
    "fibonacci",
    "fibonacci_iterative",
    "factorial",
    "primeNumbers",
  ],

  advanced: ["closureCounter", "bankAccount", "matrixMultiplication"],

  // NEW CLASS CATEGORIES
  objectOriented: [
    "basicClass",
    "classInheritance",
    "gameCharacterClasses",
    "vehicleHierarchy",
    "libraryManagement",
  ],

  realWorld: [
    "bankAccount",
    "libraryManagement",
    "vehicleHierarchy",
    "gameCharacterClasses",
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
