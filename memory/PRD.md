# Computer Champ — Class 1 & 2 Educational Game

## Original Problem Statement
Build a colorful, interactive, kid-friendly educational game website for Class 1 & 2 students teaching computer basics. NO LOGIN. Real images (CPU = cabinet, NEVER brain). Teacher Jyoti Singh introduces. 8 game levels with stars, badges, confetti rewards. FREE downloadable PNG certificate at end (no payment).

## Architecture
- Frontend: React (CRA + craco), Tailwind, react-router, lucide-react, html2canvas, canvas-confetti, Web Speech API
- Backend: FastAPI + MongoDB (motor) for student progress, scores, certificate issuance
- TTS: Browser Web Speech API (female voice preference)
- No auth — student registers via name + class on welcome screen, persisted via localStorage + backend

## User Personas
- Class 1 / Class 2 students (age 5-7)
- Parents who download the free certificate

## Core Requirements
- 8 game modes: Learn, Picture, Quiz, Match, Spell, Multitasking, Speed, Jumble
- 100+ Jumble words including 26 user-provided EXACT words
- 5 EXACT user quiz questions (What is computer? Accuracy importance? Two things? Multitasking? Two features?) + 50+ more
- Teacher mascot: Jyoti Singh photo + "Jyoti Ma'am" intro
- Real Unsplash photos (CPU = tower/cabinet)
- Stars, badges (Starter/Explorer/Champ), confetti rewards, voice TTS
- FREE certificate PNG download with student name, class, teacher signature

## Implemented (Date: Feb 2026)
- Welcome screen with Jyoti Ma'am intro + name/class entry
- Level Map with 8 levels + badges + total stars
- Learn Mode (10 topics with images, TTS, bullets)
- Picture Game (8 random items, MCQ)
- Quiz Game (5 EXACT + 7 random questions)
- Match Game (6 word↔picture pairs)
- Spell Game (8 simple words, drag/tap letters, hint, phonics)
- Multitasking Game (4 yes/no scenarios incl. "music + typing")
- Speed Game (10 questions, 45s timer)
- Jumble Master (12 from 100+ words list, phonics)
- FREE Certificate page with html2canvas PNG download
- Teacher photo hosted locally at /jyoti.jpg (CORS-safe)
- Backend: /api/students, /api/scores, /api/certificate/issue
- Tested: 100% backend (10/10), 100% frontend (11/11)

## Backlog (P1/P2)
- P2: Add bilingual Hindi audio support
- P2: Add 24 more Jolly Phonics letter-sound recordings (currently uses TTS letter names)
- P2: PWA / offline support
- P3: Validate student_class to '1'/'2' on backend (defense in depth)
- P3: 404 on /api/certificate/issue when student missing
