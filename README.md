# DSA Basics Quiz

A frontend-only quiz app built with React, JavaScript and CSS. It has 13 multiple-choice questions on DSA fundamentals. No backend or database is used.

## Features

- 13 MCQs on arrays, stacks, queues, linked lists, searching, sorting, trees, hashing, graphs and complexity
- Instant feedback with an explanation after every answer
- 20-second countdown timer per question
- Progress shown as an array of cells (green for correct, red for wrong)
- Questions shuffled on every attempt
- Result screen with score and full answer review
- Best score saved in the browser (`localStorage`)
- Keyboard support: `A`-`D` or `1`-`4` to answer, `Enter` for next
- Responsive layout for mobile and desktop

## Tech

- React 18 (loaded from a CDN)
- JavaScript (no JSX, no build step)
- CSS

## Run

1. Keep `index.html`, `style.css` and `app.js` in the same folder.
2. Open `index.html` in a browser. An internet connection is needed for React and the fonts.

## Project structure

```
index.html   Page shell, loads React, fonts, style.css and app.js
style.css    All styling
app.js       Questions, components and app logic
```

## Components

| Component | Purpose |
|---|---|
| `App` | Root. Holds the current screen, shuffled questions, answers and best score |
| `StartScreen` | Intro, topics and Start button |
| `Quiz` | Handles current question, answers, timer and keyboard input |
| `QuestionCard` | Shows the question, its options and the feedback |
| `Option` | A single answer button |
| `ProgressStrip` | Array-style progress indicator |
| `Timer` | Circular countdown |
| `Result` | Score, summary and review toggle |
| `ReviewItem` | One row in the answer review |
| `Header` | Logo and title |

## React concepts used

`useState`, `useEffect`, props, event handling (`onClick`, `keydown`), conditional rendering, list rendering with `key`, and component composition.

## Customise

**Add or edit questions:** change the `QUESTIONS` array at the top of `app.js`.

```js
{
  id: 14,
  question: "Your question here?",
  options: ["A", "B", "C", "D"],
  answer: 2,            // index of the correct option (0 = first)
  explanation: "Why this answer is correct."
}
```
