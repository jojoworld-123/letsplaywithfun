// All learning content, images, quizzes, and game data.
// Images: real photos from Unsplash. CPU = cabinet/tower (NEVER brain/chip).

export const TEACHER = {
  name: "Jyoti Ma'am",
  fullName: "Jyoti Singh",
  photo: "/jyoti.jpg",
};

// ---- Image library (REAL authentic photos) ----
// Critical items are downloaded locally to /img/ for authenticity (real ceiling fan, real mixer, etc.).
// General items use verified Unsplash photo IDs.
const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const IMG = {
  computer: U("photo-1593640408182-31c70c8268f5"),
  cpu: "/img/cputower.png", // Real desktop CPU tower (NEVER brain, NEVER chip)
  monitor: U("photo-1527443224154-c4a3942d3acf"),
  keyboard: U("photo-1587829741301-dc798b83add3"),
  mouse: U("photo-1527814050087-3793815479db"),
  speaker: "/img/speaker.jpg",
  printer: U("photo-1612815154858-60aa4c59eaa6"),
  laptop: U("photo-1496181133206-80ce9b88a853"),
  tablet: U("photo-1561154464-82e9adf32764"),
  smartphone: U("photo-1511707171634-5f897ff02aa9"),
  desktop: U("photo-1593640408182-31c70c8268f5"),
  // Nature
  tree: U("photo-1448375240586-882707db888b"),
  mountain: U("photo-1464822759023-fed622ff2c3b"),
  sun: "/img/sun.jpg",
  river: "/img/river.jpg",
  // Man-made
  car: U("photo-1494976388531-d1058494cdd8"),
  house: U("photo-1568605114967-8130f3a36994"),
  road: U("photo-1502134249126-9f3755a50d78"),
  chair: U("photo-1561677978-583a8c7a4b43"),
  // Machines (REAL photos, no Chinese hand fan!)
  fan: "/img/fan.jpg", // Real ceiling fan
  mixer: "/img/mixer.jpg", // Real table-top mixer-grinder
  washingMachine: "/img/washingmachine.jpg",
  refrigerator: "/img/refrigerator.jpg",
  bicycle: U("photo-1485965120184-e220f721d03e"),
  scissors: "/img/scissors.jpg",
  cooler: "/img/cooler.jpg", // Real evaporative air cooler
  clock: U("photo-1501139083538-0139583c060f"),
  toy: U("photo-1558877385-81a1c7e67d72"),
  electricity: "/img/lightning.jpg",
  // Activities
  music: U("photo-1511671782779-c97d3d27a1d4"),
  draw: U("photo-1513364776144-60967b0f800f"),
  game: U("photo-1542751371-adc38448a05e"),
  video: U("photo-1574375927938-d5a98e8ffe85"),
  book: U("photo-1532012197267-da84d127e765"),
  pen: U("photo-1455390582262-044cdead277a"),
  // Humans/family
  humans: U("photo-1517248135467-4c7edcad34c4"),
  // Concept icons
  speed: "/img/speedometer.jpg",
  storage: U("photo-1597852074816-d933c7d2b988"),
  internet: "/img/router.jpg",
};

// ---- Learn Mode topics ----
export const LEARN_TOPICS = [
  {
    id: "what-is-computer",
    title: "What is a Computer?",
    text: "A computer is an electronic machine. It helps us write, draw, play, and learn.",
    image: IMG.computer,
    speak: "A computer is an electronic machine. It helps us write, draw, play and learn.",
  },
  {
    id: "features",
    title: "Features of Computer",
    text: "Speed, Accuracy, Multitasking, Storage and Connectivity.",
    image: IMG.speed,
    speak: "A computer has five features. Speed, Accuracy, Multitasking, Storage, and Connectivity.",
    bullets: [
      { word: "Speed", img: IMG.speed, desc: "Computer is fast like a rocket." },
      { word: "Accuracy", img: IMG.computer, desc: "It gives correct answers." },
      { word: "Multitasking", img: IMG.music, desc: "It can do many works together." },
      { word: "Storage", img: IMG.storage, desc: "It can save your work." },
      { word: "Connectivity", img: IMG.internet, desc: "It connects with people." },
    ],
  },
  {
    id: "parts",
    title: "Parts of Computer",
    text: "A computer has Monitor, CPU, Keyboard and Mouse.",
    image: IMG.desktop,
    speak: "A computer has four main parts. Monitor, CPU, Keyboard, and Mouse.",
    bullets: [
      { word: "Monitor", img: IMG.monitor, desc: "It is the screen." },
      { word: "CPU", img: IMG.cpu, desc: "CPU is the cabinet box. It is the brain." },
      { word: "Keyboard", img: IMG.keyboard, desc: "We use it to type letters." },
      { word: "Mouse", img: IMG.mouse, desc: "We use it to point and click." },
    ],
  },
  {
    id: "input",
    title: "Input Devices",
    text: "Input devices give information to the computer. Keyboard and Mouse are input devices.",
    image: IMG.keyboard,
    speak: "Input devices give information to the computer. Keyboard and Mouse are input devices.",
    bullets: [
      { word: "Keyboard", img: IMG.keyboard, desc: "Type letters and numbers." },
      { word: "Mouse", img: IMG.mouse, desc: "Click and point on screen." },
    ],
  },
  {
    id: "output",
    title: "Output Devices",
    text: "Output devices show us results. Monitor and Speaker are output devices.",
    image: IMG.monitor,
    speak: "Output devices show us results. Monitor and Speaker are output devices.",
    bullets: [
      { word: "Monitor", img: IMG.monitor, desc: "Shows pictures and words." },
      { word: "Speaker", img: IMG.speaker, desc: "Plays sound and music." },
    ],
  },
  {
    id: "uses",
    title: "Uses of Computer",
    text: "We can write, draw, play, watch, listen and learn.",
    image: IMG.draw,
    speak: "On a computer we can write, draw, play games, watch videos, listen to music and learn.",
    bullets: [
      { word: "Write", img: IMG.pen, desc: "Write stories and notes." },
      { word: "Draw", img: IMG.draw, desc: "Make colourful pictures." },
      { word: "Play", img: IMG.game, desc: "Play fun games." },
      { word: "Watch", img: IMG.video, desc: "Watch videos." },
      { word: "Listen", img: IMG.music, desc: "Listen to music." },
      { word: "Learn", img: IMG.book, desc: "Learn new things." },
    ],
  },
  {
    id: "natural",
    title: "Natural Things",
    text: "Things made by nature are called natural things.",
    image: IMG.tree,
    speak: "Things made by nature are called natural things. Like tree, mountain, sun and river.",
    bullets: [
      { word: "Tree", img: IMG.tree, desc: "" },
      { word: "Mountain", img: IMG.mountain, desc: "" },
      { word: "Sun", img: IMG.sun, desc: "" },
      { word: "River", img: IMG.river, desc: "" },
    ],
  },
  {
    id: "manmade",
    title: "Man-made Things",
    text: "Things made by humans are called man-made things.",
    image: IMG.car,
    speak: "Things made by humans are called man-made things. Like car, house, road and chair.",
    bullets: [
      { word: "Car", img: IMG.car, desc: "" },
      { word: "House", img: IMG.house, desc: "" },
      { word: "Road", img: IMG.road, desc: "" },
      { word: "Chair", img: IMG.chair, desc: "" },
    ],
  },
  {
    id: "machine",
    title: "Machine",
    text: "A machine helps us do work easily and faster.",
    image: IMG.fan,
    speak: "A machine helps us do work easily and faster. Like fan, mixer and washing machine.",
    bullets: [
      { word: "Fan", img: IMG.fan, desc: "" },
      { word: "Mixer", img: IMG.mixer, desc: "" },
      { word: "Washing Machine", img: IMG.washingMachine, desc: "" },
      { word: "Bicycle", img: IMG.bicycle, desc: "Manual machine." },
      { word: "Scissors", img: IMG.scissors, desc: "Manual machine." },
    ],
  },
  {
    id: "types",
    title: "Types of Computers",
    text: "Desktop, Laptop, Tablet and Smartphone.",
    image: IMG.laptop,
    speak: "There are four main types of computers. Desktop, Laptop, Tablet and Smartphone.",
    bullets: [
      { word: "Desktop", img: IMG.desktop, desc: "" },
      { word: "Laptop", img: IMG.laptop, desc: "" },
      { word: "Tablet", img: IMG.tablet, desc: "" },
      { word: "Smartphone", img: IMG.smartphone, desc: "" },
    ],
  },
];

// ---- Quiz Questions (5 EXACT + many more) ----
export const QUIZ_QUESTIONS = [
  // EXACT user questions
  {
    q: "What is a computer?",
    img: IMG.computer,
    options: ["An electronic machine", "A toy car", "A fruit"],
    answer: 0,
    speak: "What is a computer?",
  },
  {
    q: "Why is accuracy important in a computer?",
    img: IMG.computer,
    options: [
      "Because it gives correct answers only when we give correct input",
      "Because it is colourful",
      "Because it is heavy",
    ],
    answer: 0,
    speak: "Why is accuracy important in a computer?",
  },
  {
    q: "Name two things a computer can do.",
    img: IMG.draw,
    options: ["Write and draw", "Eat and sleep", "Run and jump"],
    answer: 0,
    speak: "Name two things a computer can do.",
  },
  {
    q: "Give an example of multitasking on a computer.",
    img: IMG.music,
    options: [
      "Listening to music while typing on a computer",
      "Switching off the computer",
      "Cleaning the screen",
    ],
    answer: 0,
    speak: "Give an example of multitasking on a computer.",
  },
  {
    q: "Name any two features of a computer.",
    img: IMG.speed,
    options: ["Speed and accuracy", "Heavy and noisy", "Soft and small"],
    answer: 0,
    speak: "Name any two features of a computer.",
  },
  // Additional 50+
  { q: "Which one is the CPU?", img: IMG.cpu, options: ["Cabinet box", "Banana", "Cloud"], answer: 0 },
  { q: "Which one is a monitor?", img: IMG.monitor, options: ["Screen", "Mouse", "Keyboard"], answer: 0 },
  { q: "Which one is a keyboard?", img: IMG.keyboard, options: ["Has many keys", "Has wheels", "Has wings"], answer: 0 },
  { q: "Which one is a mouse?", img: IMG.mouse, options: ["Click and point device", "Animal in jungle", "A snack"], answer: 0 },
  { q: "Is the speaker an output device?", img: IMG.speaker, options: ["Yes", "No"], answer: 0 },
  { q: "Is the keyboard an input device?", img: IMG.keyboard, options: ["Yes", "No"], answer: 0 },
  { q: "Tree is a ___ thing.", img: IMG.tree, options: ["Natural", "Man-made"], answer: 0 },
  { q: "Car is a ___ thing.", img: IMG.car, options: ["Natural", "Man-made"], answer: 1 },
  { q: "Sun is a ___ thing.", img: IMG.sun, options: ["Natural", "Man-made"], answer: 0 },
  { q: "House is a ___ thing.", img: IMG.house, options: ["Natural", "Man-made"], answer: 1 },
  { q: "Mountain is a ___ thing.", img: IMG.mountain, options: ["Natural", "Man-made"], answer: 0 },
  { q: "Chair is a ___ thing.", img: IMG.chair, options: ["Natural", "Man-made"], answer: 1 },
  { q: "What is a machine?", img: IMG.mixer, options: ["Helps us work easily and faster", "A fruit", "A bird"], answer: 0 },
  { q: "Which is a manual machine?", img: IMG.bicycle, options: ["Bicycle", "Fan", "Mixer"], answer: 0 },
  { q: "Which is a manual machine?", img: IMG.scissors, options: ["Scissors", "Washing Machine", "Refrigerator"], answer: 0 },
  { q: "Laptop is a type of ___?", img: IMG.laptop, options: ["Computer", "Toy", "Animal"], answer: 0 },
  { q: "Tablet is a type of ___?", img: IMG.tablet, options: ["Computer", "Plate", "Bottle"], answer: 0 },
  { q: "Smartphone is a type of ___?", img: IMG.smartphone, options: ["Computer", "Watch", "Pen"], answer: 0 },
  { q: "Desktop computer has a ___?", img: IMG.desktop, options: ["Cabinet/CPU box", "Wheels", "Tail"], answer: 0 },
  { q: "Speed means a computer is ___?", img: IMG.speed, options: ["Fast", "Slow", "Soft"], answer: 0 },
  { q: "Storage means we can ___ our work.", img: IMG.storage, options: ["Save", "Throw", "Eat"], answer: 0 },
  { q: "Internet helps us ___ with people.", img: IMG.internet, options: ["Connect", "Fight", "Run"], answer: 0 },
  { q: "Where do we draw on a computer?", img: IMG.draw, options: ["On screen", "On floor", "On road"], answer: 0 },
  { q: "Which device shows pictures?", img: IMG.monitor, options: ["Monitor", "Mouse", "Keyboard"], answer: 0 },
  { q: "Which device makes sound?", img: IMG.speaker, options: ["Speaker", "Mouse", "Keyboard"], answer: 0 },
  { q: "Which device prints on paper?", img: IMG.printer, options: ["Printer", "Monitor", "Mouse"], answer: 0 },
  { q: "Refrigerator is a ___ ?", img: IMG.refrigerator, options: ["Machine", "Tree", "River"], answer: 0 },
  { q: "Washing machine helps us wash ___ ?", img: IMG.washingMachine, options: ["Clothes", "Cars", "Food"], answer: 0 },
  { q: "A clock tells us the ___?", img: IMG.clock, options: ["Time", "Weather", "Food"], answer: 0 },
  { q: "Children play with ___?", img: IMG.toy, options: ["Toys", "Stones", "Soap"], answer: 0 },
  { q: "Who uses a computer at school?", img: IMG.book, options: ["Teacher and students", "Only animals", "Only birds"], answer: 0 },
  { q: "True or False: A computer can write.", img: IMG.pen, options: ["True", "False"], answer: 0 },
  { q: "True or False: A computer can eat food.", img: IMG.computer, options: ["True", "False"], answer: 1 },
  { q: "True or False: A mouse is an input device.", img: IMG.mouse, options: ["True", "False"], answer: 0 },
  { q: "True or False: CPU looks like a brain.", img: IMG.cpu, options: ["True", "False"], answer: 1 },
  { q: "True or False: Monitor shows pictures.", img: IMG.monitor, options: ["True", "False"], answer: 0 },
  { q: "Fill: A com___ter is an electronic machine.", img: IMG.computer, options: ["pu", "ma", "to"], answer: 0 },
  { q: "Fill: We type using a key___.", img: IMG.keyboard, options: ["board", "ring", "set"], answer: 0 },
  { q: "Fill: The screen of a computer is called ___?", img: IMG.monitor, options: ["Monitor", "Mixer", "Mountain"], answer: 0 },
  { q: "Which one is faster than humans?", img: IMG.speed, options: ["Computer", "Bicycle", "Tree"], answer: 0 },
  { q: "Pick the natural thing.", img: IMG.river, options: ["River", "Road", "Chair"], answer: 0 },
  { q: "Pick the man-made thing.", img: IMG.road, options: ["Road", "Sun", "Tree"], answer: 0 },
  { q: "Pick the input device.", img: IMG.mouse, options: ["Mouse", "Speaker", "Monitor"], answer: 0 },
  { q: "Pick the output device.", img: IMG.speaker, options: ["Speaker", "Keyboard", "Mouse"], answer: 0 },
  { q: "Pick the smallest computer.", img: IMG.smartphone, options: ["Smartphone", "Desktop", "Laptop"], answer: 0 },
  { q: "Pick the computer with a lid.", img: IMG.laptop, options: ["Laptop", "Desktop", "Refrigerator"], answer: 0 },
  { q: "What helps us connect with friends online?", img: IMG.internet, options: ["Internet", "Fan", "Chair"], answer: 0 },
  { q: "Where do we save files?", img: IMG.storage, options: ["Storage", "Sky", "Pen"], answer: 0 },
  { q: "Music + Typing together is called ___?", img: IMG.music, options: ["Multitasking", "Sleeping", "Eating"], answer: 0 },
  { q: "True or False: We need correct input to get correct answer.", img: IMG.computer, options: ["True", "False"], answer: 0 },
];

// ---- Match Game pairs ----
export const MATCH_PAIRS = [
  { word: "Monitor", img: IMG.monitor },
  { word: "CPU", img: IMG.cpu },
  { word: "Keyboard", img: IMG.keyboard },
  { word: "Mouse", img: IMG.mouse },
  { word: "Speaker", img: IMG.speaker },
  { word: "Printer", img: IMG.printer },
  { word: "Laptop", img: IMG.laptop },
  { word: "Tablet", img: IMG.tablet },
  { word: "Smartphone", img: IMG.smartphone },
  { word: "Tree", img: IMG.tree },
  { word: "Car", img: IMG.car },
  { word: "Fan", img: IMG.fan },
];

// ---- Picture Identify items ----
export const PICTURE_ITEMS = [
  { img: IMG.cpu, options: ["CPU", "Monitor", "Keyboard"], answer: 0, hint: "It is the cabinet box. The brain of computer." },
  { img: IMG.monitor, options: ["Monitor", "Mouse", "Speaker"], answer: 0, hint: "It is like a TV screen." },
  { img: IMG.keyboard, options: ["Keyboard", "Printer", "Tablet"], answer: 0, hint: "It has many keys to type." },
  { img: IMG.mouse, options: ["Mouse", "Speaker", "CPU"], answer: 0, hint: "We click with it." },
  { img: IMG.tree, options: ["Tree", "Car", "Chair"], answer: 0, hint: "Natural thing." },
  { img: IMG.car, options: ["Car", "Sun", "Mountain"], answer: 0, hint: "Man-made thing with wheels." },
  { img: IMG.fan, options: ["Fan", "Mountain", "River"], answer: 0, hint: "Helps us in summer." },
  { img: IMG.washingMachine, options: ["Washing Machine", "Mixer", "Cooler"], answer: 0, hint: "Cleans clothes." },
  { img: IMG.bicycle, options: ["Bicycle", "Car", "Truck"], answer: 0, hint: "Manual machine with two wheels." },
  { img: IMG.smartphone, options: ["Smartphone", "Refrigerator", "Speaker"], answer: 0, hint: "Small computer in your pocket." },
];

// ---- Multitasking Game ----
export const MULTITASKING_PAIRS = [
  { a: { label: "Listen Music", img: IMG.music }, b: { label: "Type", img: IMG.keyboard }, ok: true,
    say: "Listening to music while typing on a computer is multitasking." },
  { a: { label: "Watch Video", img: IMG.video }, b: { label: "Draw", img: IMG.draw }, ok: true,
    say: "Watching a video while drawing is multitasking." },
  { a: { label: "Sleep", img: IMG.house }, b: { label: "Type", img: IMG.keyboard }, ok: false,
    say: "We cannot type while sleeping." },
  { a: { label: "Listen Music", img: IMG.music }, b: { label: "Read Book", img: IMG.book }, ok: true,
    say: "Listening to music while reading a book is multitasking." },
];
