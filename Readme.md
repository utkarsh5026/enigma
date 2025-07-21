# 🚀 Enigma Language Explorer

Welcome to the Enigma Language Explorer! ✨ This is an interactive playground where you can write code in Enigma (a programming language I created from scratch) and see how it's processed behind the scenes. It's my way of sharing the fascinating world of programming language design!

![Profile Header](./images/home.png)

## 🧩 What is Enigma?

* Enigma is a fun, expressive programming language I designed to combine my favorite features from several languages. Think JavaScript meets Ruby with a dash of functional programming goodness!

### ✨ Language Features

- 🔄 **Dynamic typing** with variables and constants (`let` and `const`)
- 🎯 **First-class functions** and powerful closures
- 🔀 **Rich control flow** (if/elif/else, while loops, for loops)
- 📦 **Built-in data structures** (arrays and hash maps)
- 🧠 **Higher-order functions** for functional programming patterns
- 🔧 **Clean, readable syntax** that feels natural to write

### 🌟 Code Examples

#### ⭐ Fibonacci Sequence

```
// Fibonacci function in Enigma
let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

// Calculate 10th Fibonacci number
let result = fibonacci(10);  // 55
```

#### 🔄 Higher-Order Functions

```
// Map implementation
let map = fn(arr, f) {
  let result = [];
  let i = 0;
  
  while (i < len(arr)) {
    result[i] = f(arr[i]);
    i = i + 1;
  }
  
  return result;
};

// Use our map function
let numbers = [1, 2, 3, 4, 5];
let doubled = map(numbers, fn(x) { return x * 2; });
// doubled is now [2, 4, 6, 8, 10]
```

#### 🧠 Closures

```
// Counter factory using closures
let makeCounter = fn() {
  let count = 0;  // This variable is captured in the closure
  
  return fn() {
    count = count + 1;
    return count;
  };
};

let counter = makeCounter();
counter();  // returns 1
counter();  // returns 2
counter();  // returns 3
```

#### 📦 Data Structures

```
// Working with arrays and hashes
let person = {
  "name": "Alice",
  "age": 30,
  "skills": ["programming", "design", "communication"]
};

// Access nested data
let skills = person["skills"];
let firstSkill = skills[0];  // "programming"

// Add new skill
person["skills"][3] = "leadership";
```

## 🛠️ Interactive Explorer Features

The Enigma Language Explorer includes:

- 🔍 **Token Analyzer**: Watch how your code gets broken down into tokens
- 🌳 **AST Visualizer**: See the beautiful tree structure of your code
- 📚 **Language Guide**: Learn all about Enigma's syntax and features
- 🌙 **Tokyo Night Theme**: Because coding is better with style!

## 💭 Language Design Philosophy

I designed Enigma with some specific principles in mind:

### 🧠 Simplicity and Expressiveness

I wanted a language that's easy to learn but still powerful enough to express complex ideas. I believe that code should be readable and reflect how we think about problems.

```
// The elegance of while loops with simple syntax
let countdown = fn(n) {
  while (n > 0) {
    puts(n);
    n = n - 1;
  }
  puts("Liftoff! 🚀");
};

countdown(5);
```

### 🧩 First-Class Functions

Functions are values that can be passed around, returned, and assigned - just like any other data type. This enables powerful composition patterns:

```
// Function composition
let compose = fn(f, g) {
  return fn(x) {
    return f(g(x));
  };
};

let addOne = fn(x) { return x + 1; };
let double = fn(x) { return x * 2; };

// Create a new function that doubles then adds one
let doubleThenAddOne = compose(addOne, double);
doubleThenAddOne(5);  // Returns 11
```

### 🏗️ Flexible Data Structures

Enigma has convenient syntax for working with collections of data:

```
// Working with arrays
let fibonacci = [0, 1, 1, 2, 3, 5, 8, 13, 21];
let first3 = fibonacci[0:3];  // Slicing

// Hash map with nested structures
let classroom = {
  "students": [
    {"name": "Alex", "grade": 92},
    {"name": "Jordan", "grade": 88},
    {"name": "Taylor", "grade": 95}
  ],
  "subject": "Computer Science",
  "average": fn(students) {
    // Calculate average grade
    let sum = 0;
    let count = len(students);
  
    let i = 0;
    while (i < count) {
      sum = sum + students[i]["grade"];
      i = i + 1;
    }
  
    return sum / count;
  }
};

// Call the function stored in the hash
let avgGrade = classroom["average"](classroom["students"]);
```

## 🧰 Behind the Scenes: How Enigma Works

Enigma follows the classic language implementation pipeline:

### 📝 Lexical Analysis (Lexing)

The lexer breaks your code into tokens - the smallest meaningful units of the language:

```
let x = 5 + 10;

// Gets tokenized as:
// [LET, IDENTIFIER("x"), ASSIGN, INT(5), PLUS, INT(10), SEMICOLON]
```

### 🌳 Syntax Analysis (Parsing)

The parser converts tokens into an Abstract Syntax Tree (AST) that represents the structure of your program:

```
// The expression 5 + (10 * 2) becomes:
//        +
//       / \
//      5  *
//        / \
//       10  2
```

### 🔄 Evaluation

The evaluator walks through the AST and executes your program according to the language rules.

## 🌟 More Enigma Language Examples

### 🔁 Loop Control Flow

```
// For loop with break and continue
let findPrimes = fn(max) {
  let primes = [];
  
  for (let i = 2; i <= max; i = i + 1) {
    let isPrime = true;
  
    for (let j = 2; j * j <= i; j = j + 1) {
      if (i % j == 0) {
        isPrime = false;
        break;  // Skip remaining factors
      }
    }
  
    if (isPrime) {
      primes[len(primes)] = i;
    }
  }
  
  return primes;
};

let primeList = findPrimes(50);
```

### 🧮 Recursive Problem Solving

```
// Calculate factorial recursively
let factorial = fn(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
};

// Quick sort implementation
let quickSort = fn(arr) {
  if (len(arr) < 2) {
    return arr;
  }
  
  let pivot = arr[0];
  let less = [];
  let greater = [];
  
  let i = 1;
  while (i < len(arr)) {
    if (arr[i] <= pivot) {
      less[len(less)] = arr[i];
    } else {
      greater[len(greater)] = arr[i];
    }
    i = i + 1;
  }
  
  return concat(quickSort(less), [pivot], quickSort(greater));
};
```

### 📊 Data Processing

```
// Working with structured data
let students = [
  {"name": "Alice", "scores": [88, 92, 95]},
  {"name": "Bob", "scores": [75, 80, 85]},
  {"name": "Charlie", "scores": [90, 92, 98]}
];

// Calculate average scores
let calculateAverages = fn(studentList) {
  let results = {};
  
  let i = 0;
  while (i < len(studentList)) {
    let student = studentList[i];
    let scores = student["scores"];
    let sum = 0;
  
    let j = 0;
    while (j < len(scores)) {
      sum = sum + scores[j];
      j = j + 1;
    }
  
    let avg = sum / len(scores);
    results[student["name"]] = avg;
    i = i + 1;
  }
  
  return results;
};

let averages = calculateAverages(students);
```

## 🚀 Future Language Features

I'm constantly evolving Enigma with new features. Here are some I'm excited about:

- 🧵 **String interpolation**: `f"Hello, {name}!"`
- 🧪 **Pattern matching**: For elegant data destructuring
- 📦 **Module system**: For better code organization
- 🔄 **Async/await**: For handling asynchronous operations
- 🧠 **Type inference**: Adding optional type hints

## 🌈 Language Design Insights

Creating a programming language has been an incredible learning journey. Some insights I've gained:

- 🧩 Small syntax decisions have big implications for readability and expressiveness
- 🔍 Error messages are as important as the language features themselves
- 🌉 The space between parser and evaluator is where most of the magic happens
- 🧠 Closures are surprisingly tricky to implement correctly, but so powerful once working

## 📚 Learning Resources

If you're curious about building your own language, these resources helped me immensely:

- 📘 "Writing An Interpreter In Go" by Thorsten Ball
- 📗 "Crafting Interpreters" by Robert Nystrom
- 🧪 The "Let's Build A Simple Interpreter" blog series

## 🙏 Acknowledgments

This project wouldn't exist without the amazing work of those who've shared their knowledge about language design. Special thanks to the programming language design community for inspiration!

## 📜 License

This project is available under the MIT License. Feel free to use, explore, and build upon it.

---

Enjoy exploring Enigma! If you create something cool with it or have ideas for improvement, I'd love to hear from you. Happy coding! 💻✨
