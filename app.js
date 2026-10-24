// DSA Basics Quiz
// Built with React (via CDN). No JSX, so there is no build step:
// React.createElement is shortened to `h`, and the file runs by double-click.

const { useState, useEffect } = React;
const h = React.createElement;

const TIME_PER_QUESTION = 20; // seconds
const BEST_KEY = "dsa-quiz-best";
const LETTERS = ["A", "B", "C", "D"];
const TOPICS = ["Arrays", "Stacks", "Queues", "Linked lists", "Searching", "Sorting", "Trees", "Hashing", "Graphs", "Complexity"];

/* ---------- Questions (edit or add more here) ---------- */
const QUESTIONS = [
  {
    id: 1,
    question: "What is the time complexity of accessing an array element by its index?",
    options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
    answer: 1,
    explanation: "Address = base + index × element size, so the CPU jumps straight to it. arr[5] takes one step, however large the array is."
  },
  {
    id: 2,
    question: "Which principle does a stack follow?",
    options: ["FIFO", "Random access", "LIFO", "Priority based"],
    answer: 2,
    explanation: "Last In, First Out. Think of a pile of plates: the last plate you put on top is the first one you pick up."
  },
  {
    id: 3,
    question: "In a queue, where are elements inserted and removed?",
    options: [
      "Inserted at the rear, removed from the front",
      "Inserted at the front, removed from the rear",
      "Both at the same end",
      "Anywhere in the middle"
    ],
    answer: 0,
    explanation: "A queue is FIFO, like a ticket line: you join at the back, and the person at the front is served first."
  },
  {
    id: 4,
    question: "What is the worst-case time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(1)", "O(n log n)", "O(log n)"],
    answer: 3,
    explanation: "The search space halves at every step. 1000 elements need only about 10 comparisons."
  },
  {
    id: 5,
    question: "What is the most important requirement for using binary search?",
    options: [
      "The array must be sorted",
      "The array must have no duplicates",
      "The array size must be even",
      "The array must hold only positive numbers"
    ],
    answer: 0,
    explanation: "Sorted order is what tells you whether the target lies in the left half or the right half."
  },
  {
    id: 6,
    question: "What is the time complexity of inserting a node at the head of a singly linked list?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    answer: 2,
    explanation: "Create the node, point its next to the old head, and update head. No traversal is needed."
  },
  {
    id: 7,
    question: "What is the main advantage of a linked list over an array?",
    options: [
      "O(1) access by index",
      "Less memory per element",
      "Better cache performance",
      "Insertion and deletion need no shifting of elements"
    ],
    answer: 3,
    explanation: "Inserting in the middle of an array shifts everything after it. In a linked list you only change a couple of pointers."
  },
  {
    id: 8,
    question: "What is the worst-case time complexity of bubble sort?",
    options: ["O(n)", "O(n²)", "O(n log n)", "O(log n)"],
    answer: 1,
    explanation: "Two nested loops: on a reverse-sorted array it makes roughly n × n comparisons."
  },
  {
    id: 9,
    question: "Which stack operation returns the top element without removing it?",
    options: ["push", "pop", "peek", "enqueue"],
    answer: 2,
    explanation: "peek (or top) only looks at the top element. pop returns it and removes it too."
  },
  {
    id: 10,
    question: "Which data structure is best for checking balanced parentheses like ( { [ ] } )?",
    options: ["Stack", "Queue", "Binary tree", "Hash table"],
    answer: 0,
    explanation: "Push every opening bracket; on a closing bracket, pop and compare. The last bracket opened must be the first one closed."
  },
  {
    id: 11,
    question: "What is the maximum number of children a node can have in a binary tree?",
    options: ["1", "3", "n", "2"],
    answer: 3,
    explanation: "Binary means two: a left child and a right child. A node can have fewer (0 or 1), never more."
  },
  {
    id: 12,
    question: "What is the average-case time complexity of searching in a hash table?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    answer: 2,
    explanation: "The hash function turns the key into an index directly. Worst case degrades to O(n) when many keys collide."
  },
  {
    id: 13,
    question: "Which data structure does BFS (breadth-first search) use?",
    options: ["Stack", "Queue", "Heap", "Sorted array"],
    answer: 1,
    explanation: "BFS explores level by level, so it needs a FIFO queue. DFS uses a stack (or recursion)."
  }
];

/* ---------- Helpers ---------- */
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function loadBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch (e) { return 0; }
}
function saveBest(score) {
  try { localStorage.setItem(BEST_KEY, String(score)); } catch (e) { /* ignore */ }
}

// "good" | "bad" | "" for every question (empty = not answered yet)
function getResults(questions, answers) {
  return questions.map((q, i) => {
    if (answers[i] === undefined) return "";
    return answers[i] === q.answer ? "good" : "bad";
  });
}

/* ---------- Reusable components ---------- */

function Header() {
  return h("header", { className: "top" },
    h("span", { className: "logo", "aria-hidden": "true" }, h("i"), h("i"), h("i")),
    h("span", { className: "brand" }, "DSA Basics Quiz")
  );
}

// Progress shown as an array: one cell per question, with its index underneath
function ProgressStrip({ results, current }) {
  return h("div", { className: "strip", role: "img", "aria-label": "Quiz progress" },
    results.map((state, i) =>
      h("div", { key: i, className: "cell " + state + (i === current ? " current" : "") },
        h("div", { className: "cell-box" }, state === "good" ? "✓" : state === "bad" ? "✗" : ""),
        h("div", { className: "cell-idx" }, i)
      )
    )
  );
}

// Circular countdown
function Timer({ timeLeft, total, stopped }) {
  const r = 18;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - timeLeft / total);
  const cls = "timer" + (timeLeft <= 5 ? " low" : "") + (stopped ? " stopped" : "");
  return h("div", { className: cls, role: "timer", "aria-label": timeLeft + " seconds left" },
    h("svg", { viewBox: "0 0 44 44", "aria-hidden": "true" },
      h("circle", { className: "ring-bg", cx: 22, cy: 22, r: r }),
      h("circle", {
        className: "ring-fg", cx: 22, cy: 22, r: r,
        strokeDasharray: circumference, strokeDashoffset: offset
      })
    ),
    h("span", null, timeLeft)
  );
}

// One answer button. `status` is "", "correct", "wrong" or "dim"
function Option({ letter, text, status, disabled, onSelect }) {
  return h("button", {
    className: "option " + status,
    disabled: disabled,
    onClick: onSelect
  },
    h("span", { className: "badge" }, letter),
    h("span", { className: "text" }, text),
    status === "correct" && h("span", { className: "mark", "aria-label": "Correct answer" }, "✓"),
    status === "wrong" && h("span", { className: "mark", "aria-label": "Your answer" }, "✗")
  );
}

// Question text + its options + feedback
function QuestionCard({ data, selected, onSelect }) {
  const answered = selected !== undefined;
  const isRight = selected === data.answer;

  function statusOf(index) {
    if (!answered) return "";
    if (index === data.answer) return "correct";
    if (index === selected) return "wrong";
    return "dim";
  }

  return h("div", null,
    h("h2", { className: "question" }, data.question),
    h("div", { className: "options" },
      data.options.map((text, i) =>
        h(Option, {
          key: i,
          letter: LETTERS[i],
          text: text,
          status: statusOf(i),
          disabled: answered,
          onSelect: () => onSelect(i)
        })
      )
    ),
    answered && h("div", { className: "feedback " + (isRight ? "ok" : "no"), role: "status" },
      h("strong", null, isRight ? "Correct" : selected === -1 ? "Time is up" : "Not quite"),
      data.explanation
    )
  );
}

/* ---------- Screens ---------- */

function StartScreen({ total, best, onStart }) {
  return h("div", { className: "start" },
    h("h1", null, "Test your DSA basics."),
    h("p", { className: "lead" },
      "Quick multiple-choice questions on the fundamentals every placement round starts with."),
    h("div", { className: "chips" },
      TOPICS.map(t => h("span", { key: t, className: "chip" }, t))
    ),
    h("div", { className: "facts" },
      h("div", { className: "fact" }, h("b", null, total), h("span", null, "questions")),
      h("div", { className: "fact" }, h("b", null, TIME_PER_QUESTION + "s"), h("span", null, "per question")),
      h("div", { className: "fact" }, h("b", null, "Instant"), h("span", null, "explanations"))
    ),
    best > 0 && h("p", { className: "best" }, "Your best score: " + best + " / " + total),
    h("button", { className: "btn", onClick: onStart }, "Start quiz")
  );
}

function Quiz({ questions, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]); // answers[i] = chosen option index (-1 = timed out)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const data = questions[current];
  const selected = answers[current];
  const answered = selected !== undefined;
  const isLast = current === questions.length - 1;

  function handleSelect(index) {
    if (answered) return;
    const next = [...answers];
    next[current] = index;
    setAnswers(next);
  }

  function handleNext() {
    if (!answered) return;
    if (isLast) {
      onFinish(answers);
    } else {
      setCurrent(current + 1);
      setTimeLeft(TIME_PER_QUESTION);
    }
  }

  // Countdown: 1 second at a time; at 0 the question locks as "timed out"
  useEffect(() => {
    if (answered) return;
    if (timeLeft <= 0) {
      handleSelect(-1);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, answered, current]);

  // Keyboard: A-D or 1-4 to answer, Enter for next
  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (!answered) {
        let i = "abcd".indexOf(key);
        if (i === -1) i = ["1", "2", "3", "4"].indexOf(key);
        if (i > -1 && i < data.options.length) handleSelect(i);
      } else if (key === "enter") {
        e.preventDefault(); // stops the focused button from also firing a click
        handleNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return h("div", null,
    h(ProgressStrip, { results: getResults(questions, answers), current: current }),
    h("div", { className: "quiz-head" },
      h("span", { className: "qcount" },
        "Question ", h("b", null, current + 1), " of " + questions.length),
      h(Timer, { timeLeft: timeLeft, total: TIME_PER_QUESTION, stopped: answered })
    ),
    h(QuestionCard, { key: current, data: data, selected: selected, onSelect: handleSelect }),
    h("div", { className: "actions" },
      h("button", { className: "btn", disabled: !answered, onClick: handleNext },
        isLast ? "See result" : "Next question")
    )
  );
}

// One row in the answer review
function ReviewItem({ data, picked }) {
  const correct = picked === data.answer;
  const pickedText = picked === -1 ? "No answer (time ran out)" : data.options[picked];
  return h("li", { className: "review-item " + (correct ? "right" : "miss") },
    h("p", { className: "q" }, data.question),
    h("p", { className: "line" }, "Your answer: ", h("b", null, pickedText)),
    !correct && h("p", { className: "line" }, "Correct answer: ", h("b", null, data.options[data.answer]))
  );
}

function Result({ questions, answers, best, isNewBest, onRestart }) {
  const [showReview, setShowReview] = useState(false);
  const results = getResults(questions, answers);
  const score = results.filter(r => r === "good").length;
  const percent = Math.round((score / questions.length) * 100);

  let title = "Keep practising";
  let note = "Revisit the questions you missed and try again.";
  if (percent >= 80) { title = "Strong fundamentals"; note = "You know your basics well. Time to move on to harder problems."; }
  else if (percent >= 50) { title = "Good attempt"; note = "A few gaps left. Review the missed ones below."; }

  return h("div", { className: "result" },
    h("h1", null, title),
    h("div", { className: "score" }, h("b", null, score), h("span", null, "/ " + questions.length)),
    h("p", { className: "sub" },
      note + " " + (isNewBest ? "New best score!" : "Best so far: " + best + " / " + questions.length)),
    h(ProgressStrip, { results: results, current: -1 }),
    h("div", { className: "result-actions" },
      h("button", { className: "btn", onClick: onRestart }, "Try again"),
      h("button", { className: "btn btn-ghost", onClick: () => setShowReview(!showReview) },
        showReview ? "Hide review" : "Review answers")
    ),
    showReview && h("ul", { className: "review" },
      questions.map((q, i) => h(ReviewItem, { key: q.id, data: q, picked: answers[i] }))
    )
  );
}

/* ---------- App (root) ---------- */
function App() {
  const [screen, setScreen] = useState("start"); // start | quiz | result
  const [questions, setQuestions] = useState(QUESTIONS);
  const [answers, setAnswers] = useState([]);
  const [best, setBest] = useState(loadBest());
  const [isNewBest, setIsNewBest] = useState(false);

  function startQuiz() {
    setQuestions(shuffle(QUESTIONS)); // new order every attempt
    setAnswers([]);
    setScreen("quiz");
  }

  function finishQuiz(finalAnswers) {
    const score = questions.filter((q, i) => finalAnswers[i] === q.answer).length;
    const improved = score > best;
    if (improved) {
      saveBest(score);
      setBest(score);
    }
    setIsNewBest(improved);
    setAnswers(finalAnswers);
    setScreen("result");
  }

  return h("div", { className: "shell" },
    h(Header),
    h("main", { className: "card" },
      screen === "start" && h(StartScreen, { total: QUESTIONS.length, best: best, onStart: startQuiz }),
      screen === "quiz" && h(Quiz, { questions: questions, onFinish: finishQuiz }),
      screen === "result" && h(Result, {
        questions: questions,
        answers: answers,
        best: best,
        isNewBest: isNewBest,
        onRestart: startQuiz
      })
    ),
    screen === "quiz" && h("p", { className: "hint" }, "Tip: press A–D to answer and Enter for the next question.")
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
