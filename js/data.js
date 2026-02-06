//* ---------- 2) BOOK DATA (stored in JS object array) ---------- */
const books = [
  {
    id: "fourth-wing",
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    genre: "Fantasy",
    cover: "images/BookCovers/FourthWing.jpg",
    synopsis:
      "Violet enters a brutal war college for dragon riders where survival is never guaranteed. She must outthink rivals, build alliances, and prove she belongs.",
    series: ["Prequel: None", "Sequel: Iron Flame"],
    reviews: [
      { source: "Readers", rating: "4.6/5", text: "Fast-paced and addictive." },
      { source: "Book Club", rating: "4.4/5", text: "Great world-building and tension." },
      { source: "Critics", rating: "4.0/5", text: "A fun fantasy ride." }
    ]
  },
  {
    id: "the-secret-history",
    title: "The Secret History",
    author: "Donna Tartt",
    genre: "Literary",
    cover: "images/BookCovers/SecretHistory.jpg",
    synopsis:
      "A group of elite students become involved in a dark secret that changes everything. A slow-burn story about obsession, guilt, and consequences.",
    series: ["Standalone"],
    reviews: [
      { source: "Readers", rating: "4.2/5", text: "Atmospheric and intense." },
      { source: "Book Club", rating: "4.1/5", text: "Deep characters and sharp writing." },
      { source: "Critics", rating: "4.0/5", text: "A modern classic." }
    ]
  },
  {
    id: "silent-patient",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Thriller",
    cover: "images/BookCovers/SilentPatient.jpg",
    synopsis:
      "A woman stops speaking after a shocking incident. A psychotherapist becomes obsessed with discovering the truth—and uncovers twists along the way.",
    series: ["Standalone"],
    reviews: [
      { source: "Readers", rating: "4.1/5", text: "Twisty and gripping." },
      { source: "Book Club", rating: "4.0/5", text: "Hard to put down." },
      { source: "Critics", rating: "3.8/5", text: "Clever mystery structure." }
    ]
  },
  {
    id: "tender-is-the-flesh",
    title: "Tender Is the Flesh",
    author: "Agustina Bazterrica",
    genre: "Dystopian",
    cover: "images/BookCovers/Tenderistheflesh.jpg",
    synopsis:
      "In a world where animal meat is forbidden, society takes a terrifying turn. A disturbing dystopian story that challenges morality and humanity.",
    series: ["Standalone"],
    reviews: [
      { source: "Readers", rating: "4.0/5", text: "Shocking and unforgettable." },
      { source: "Book Club", rating: "3.9/5", text: "Dark, thought-provoking." },
      { source: "Critics", rating: "4.1/5", text: "Brutal but brilliant." }
    ]
  },
  {
    id: "midnight-library",
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    cover: "images/BookCovers/MidnightLibrary.jpg",
    synopsis:
      "Nora discovers a library between life and death where every book is a different version of her life. She explores choices, regrets, and what makes life meaningful.",
    series: ["Standalone"],
    reviews: [
      { source: "Readers", rating: "4.3/5", text: "Hopeful and emotional." },
      { source: "Book Club", rating: "4.1/5", text: "Easy to read, big message." },
      { source: "Critics", rating: "4.0/5", text: "Warm and reflective." }
    ]
  },
  {
    id: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    cover: "images/BookCovers/cover 1.jpg",
    synopsis: 
       "Set in the Roaring Twenties, The Great Gatsby follows Jay Gatsby’s obsession with wealth, love, and the American Dream, revealing the emptiness behind glamour and excess.",
    series:  ["Standalone"],
    reviews: [
        {source: "Readers", rating: "4.4/5", text: "A timeless story about ambition and illusion."},
        {source: "Book Club", rating: "5/5", text: "A devastating critique of the American Dream disguised as a love story."},
        {source: "Critics", rating: "4.6/5", text: "One of the greatest American novels ever written."}
    ]
  },
  {
    id: "notes-from-underground",
    title: "Notes from Underground",
    author: "Fyodor Dostoevsky",
    genre: "Classic",
    cover: "images/BookCovers/notesfromunderground.jpg",
    synopsis:
       "A philosophical novel told through the thoughts of an unnamed narrator who challenges rationalism, free will, and society. It explores human contradiction, isolation, and inner conflict.",
    series: ["Standalone"],
    reviews: [
       {source: "Readers", rating: "4.5/5", text: "Deep, unsettling, and thought provoking."},
       {source: "Book Club", rating: "4.3/5", text: "A terrifyingly accurate portrait of social anxiety and self-sabotage."},
       {source: "Critics", rating: "5/5", text: "A foundational work of existential literature."}
    ]
  },
  {
    id: "the-night-circus",
    title: "The Night Circus",
    author: "Erin Morgenstern",
    genre: "Fantasy",
    cover: "images/BookCovers/nightcircus.jpg",
    synopsis:
      "A magical competition between two illusionists unfolds within a mysterious black-and-white circus that only appears at night. A story of wonder, love, and destiny.",
    series: ["Standalone"],
    reviews: [
      {source: "Readers", rating: "4.2/5", text: "Beautifully written and magical."},
    {source: "Critics", rating: "4.4/5", text: "Atmospheric and enchanting storytelling."}
    ]  
  },
  {
    id: "enigma",
    title: "Enigma",
    author: "Runyx",
    genre: "Fantasy",
    cover: "images/BookCovers/enigma.jpg",
    synopsis:
      "Enigma is a dark fantasy romance set in a secret society where power, mystery, and forbidden attraction collide. The story explores loyalty, identity, and dangerous secrets.",
    series: ["Part of a series"],
    reviews: [
      {source: "Readers", rating: "4.4/5", text: "Dark, addictive, and emotionally intense."},
      {source: "Book Community", rating: "4.3/5", text: "A gripping mix of mystery and romance."}
   ]
  },
  {
    id: "if-we-were-villains",
    title: "If We Were Villains",
    author: "M. L. Rio",
    genre: "Literary",
    cover: "images/BookCovers/villains.jpg",
    synopsis:
      "Set among a group of elite Shakespeare-obsessed students, the novel explores friendship, ambition, jealousy, and betrayal after a mysterious death shakes their world.",
    series: ["Standalone"],
    reviews: [
    {source: "Readers", rating: "4.2/5", text: "Moody, immersive, and beautifully written."},
    {source: "Critics",rating: "4.1/5",text: "A compelling dark academia novel with rich atmosphere."}
     ]
}

];

window.books = books;


