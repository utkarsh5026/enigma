export const sampleCodeSnippets = {
  fibonacci: `// Recursive Fibonacci function
let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

// Calculate the 8th Fibonacci number
let result = fibonacci(3);
`,

  factorial: `// Factorial function using recursion
let factorial = fn(n) {
  if (n <= 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
};

// Calculate 5!
let result = factorial(5);
`,

  loopExample: `// While loop example
let sum = 0;
let i = 1;

while (i <= 10) {
  sum = sum + i;
  i = i + 1;
}

// sum now contains the sum of numbers 1 to 10
`,

  conditionalExample: `// Conditional logic example
let max = fn(a, b) {
  if (a > b) {
    return a;
  } else {
    return b;
  }
};

let x = 42;
let y = 7;
let larger = max(x, y);
`,

  arrayExample: `// Array manipulation example
let numbers = [1, 2, 3, 4, 5];
let sum = 0;
let i = 0;

while (i < len(numbers)) {
  sum = sum + numbers[i];
  i = i + 1;
}

// Calculate average
let average = sum / len(numbers);
`,

  closureExample: `// Closure example
let makeCounter = fn() {
  let count = 0;
  
  return fn() {
    count = count + 1;
    return count;
  };
};

let counter = makeCounter();
let a = counter(); // 1
let b = counter(); // 2
let c = counter(); // 3
`,
};

export const getRandomSampleCode = (): string => {
  const snippets = Object.values(sampleCodeSnippets);
  const randomIndex = Math.floor(Math.random() * snippets.length);
  return snippets[randomIndex];
};
