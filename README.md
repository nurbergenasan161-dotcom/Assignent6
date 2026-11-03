# Assignment 6 — jQuery (Selectors, Effects, Animations)

## Contents

- `Task1/index.html` — complete 20-case selector detective (also includes extra interactive features).
- `Task2/index.html` — full interactive party, spotlight, expandable guest details, flight between rooms and animated sorting.
- `jquery.min.js` is included in each folder so the jQuery logic works without a CDN.
- `Assignment6_YourName.docx` — editable report with selectors, expected results, explanations and screenshot slots.

## Run

1. Extract this ZIP.
2. Double-click **Task2/index.html** to open it in Chrome, Edge or Firefox.
3. Click each of the 20 case buttons. Press Clear to reset the spotlight.
4. Click any guest to open the details panel; Escape/click outside closes it.
5. Move a guest through a room button and try any case again.
6. Press Sort by time twice in the living room to check both orders.
7. Press Reset party to restore the original 21 guests and their initial rooms.

Locally generated SVG avatar illustrations are included in each folder, so the page works offline. You can replace them with DiceBear Open Peeps avatars if desired.

## Submission requirements (as given in the assignment PDF)

- It is **individual** work; review and personalize the code and explanations.
- Add your **real name, group and own GitHub repository link** to the report.
- The report already contains browser-captured screenshots of every case. Verify them against your own run and replace them if your instructor requires personal screenshots.
- Push all source files to GitHub. Submit the final DOCX or PDF report before the deadline and prepare to explain the code and do live coding independently.

## Data notes

The 21 guests and their positions, colors, times, AITU indicators and belongings are transcribed from the source diagram on page 2. The thief is found dynamically as Zarina by the DOM query for Case 20. Moving guests changes the data model for subsequent cases.

## Technical design

- jQuery selectors, filter, traversal, attribute selectors, :has, :not, :nth-child, :last-child.
- Effects: fadeIn, fadeOut, fadeTo, animate, stop.
- FLIP-style position animations are implemented with jQuery animate and temporary clones; no CSS animations or transitions.
"# Assignent6" 
