import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyASY0irLF6toyTcCLugM7Mi9NkLMDdlfw",
  authDomain: "book-poll-751a2.firebaseapp.com",
  projectId: "book-poll-751a2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const books = [
  {
    name: "Problem Solving And Programming In C",
    author: "R.S. Salaria",
    group: 1,
    limit: 2,
    price: 275,
    selected: ["AYUSH PAUL", "IFTIKAR ZAMAN"]
  },
  {
    name: "Problem Solving With Programming Using C",
    author: "Jasleen Kaur et al.",
    group: 1,
    limit: 2,
    price: 280,
    selected: ["MD HABIBULLAH HAMMAD", "EYAHIYA ALOM"]
  },
  {
    name: "Fundamentals Of Data Structures",
    author: "Sartaj Sahni",
    group: 2,
    limit: 6,
    price: 550,
    selected: ["PRIYA NARGIS", "MOHIRAN BEGUM"]
  },
  {
    name: "Data Structures Using C",
    author: "Reema Thareja",
    group: 2,
    limit: 6,
    price: 485,
    selected: ["MINTU NATH", "MAHAMMAD YAHYA", "ABDUS SAHIN", "MIRAJUL HOQUE"]
  },
  {
    name: "Computer System Architecture",
    author: "M. Morris Mano",
    group: 2,
    limit: 6,
    price: 654,
    selected: []
  },
  {
    name: "Computer Organization And Design",
    author: "P. Pal Chaudhuri",
    group: 5,
    limit: 10,
    price: 1650,
    selected: []
  },
  {
    name: "Advanced DBMS",
    author: "Sanjeev Sharma et al.",
    group: 1,
    limit: 4,
    price: 270,
    selected: ["HIRIMBA BARO", "DEBASHISH DEKA", "GYANDIP DAS", "DEEP BARUAH"]
  },
  {
    name: "Advanced DBMS (Mahajan)",
    author: "Mahesh Mahajan",
    group: 1,
    limit: 4,
    price: 337,
    selected: []
  },
  {
    name: "Software Engineering & UML",
    author: "Anand Hain",
    group: 1,
    limit: 3,
    price: 220,
    selected: ["RITAKHI RANI SAHA", "NIRMALYA DAS", "HILLAZ AHMED"]
  },
  {
    name: "Software Engineering & UML (Ali)",
    author: "Mohammad Ali",
    group: 1,
    limit: 3,
    price: 356,
    selected: []
  },
  {
    name: "Technical Writing",
    author: "Pooja Subedar",
    group: 3,
    limit: 6,
    price: 795,
    selected: ["SAKIL AHMED", "SADDAM HUSSAIN", "SUHEL AHMED"]
  },
  {
    name: "Technical Communication",
    author: "Meenakshi Raman",
    group: 2,
    limit: 4,
    price: 499,
    selected: ["MIRZAUL HOQUE", "RUPJYOTI DEKA"]
  },
  {
    name: "Research Methodology",
    author: "C R Kothari",
    group: 2,
    limit: 6,
    price: 422,
    selected: ["SNEHA SARKAR", "GITEEKA DAIMARI", "MITHINGA BORO", "ABINASH", "NABIR ALI", "HEMANTA"]
  },
  {
    name: "Research Methodology (Gour)",
    author: "Yashwani Gour",
    group: 1,
    limit: 3,
    price: 324,
    selected: ["YASMINA AKTAR", "NISHITA BARUAH", "URBI DEY"]
  },
  {
    name: "Machine Learning Fundamentals",
    author: "Dr. Sunil Tekale",
    group: 1,
    limit: 3,
    price: 357,
    selected: []
  },
  {
    name: "Fundamentals Of Machine Learning",
    author: "Dr. L. Ashok Kumar",
    group: 2,
    limit: 6,
    price: 595,
    selected: []
  },
  {
    name: "Operating System",
    author: "Charles Crowley",
    group: 2,
    limit: 4,
    price: 685,
    selected: []
  },
  {
    name: "Operating Systems (Stallings)",
    author: "William Stallings",
    group: 3,
    limit: 6,
    price: 909,
    selected: ["MAHMUDUL HASSAN", "FIROZUDDIN AHMED", "RAFIQUL ISLAM"]
  },
  {
    name: "Cryptography",
    author: "Ashok Kumar",
    group: 2,
    limit: 4,
    price: 595,
    selected: ["RUPSEDUR ALI", "MOMINUL HOQUE"]
  },
  {
    name: "Cryptography (Kahate)",
    author: "Atul Kahate",
    group: 2,
    limit: 6,
    price: 670,
    selected: []
  }
];

const table = document.getElementById("tableBody");
const totalBooksEl = document.getElementById("totalBooks");
const availableBooksEl = document.getElementById("availableBooks");
const selectedCountEl = document.getElementById("selectedCount");
const remainingSeatsEl = document.getElementById("remainingSeats");

const bookState = new Map(
  books.map((book) => [
    book.name,
    {
      count: book.selected.length,
      limit: book.limit,
      selectedNames: [...book.selected]
    }
  ])
);

function uniqueNames(names) {
  return [...new Set(names.filter(Boolean).map((name) => String(name).trim()).filter(Boolean))];
}

function formatPrice(price) {
  return `Rs. ${price.toLocaleString("en-IN")}`;
}

function getStatus(available, limit) {
  if (available <= 0) {
    return { label: "Full", className: "status-full" };
  }

  if (available <= Math.max(1, Math.ceil(limit * 0.3))) {
    return { label: "Limited", className: "status-limited" };
  }

  return { label: "Available", className: "status-available" };
}

function renderSummary() {
  let availableBooks = 0;
  let totalSelected = 0;
  let totalRemaining = 0;

  books.forEach((book) => {
    const state = bookState.get(book.name);
    const available = Math.max(0, state.limit - state.count);

    if (available > 0) {
      availableBooks += 1;
    }

    totalSelected += state.count;
    totalRemaining += available;
  });

  totalBooksEl.textContent = String(books.length);
  availableBooksEl.textContent = String(availableBooks);
  selectedCountEl.textContent = String(totalSelected);
  remainingSeatsEl.textContent = String(totalRemaining);
}

function renderTable() {
  table.innerHTML = "";

  books.forEach((book) => {
    const state = bookState.get(book.name);
    const available = Math.max(0, state.limit - state.count);
    const status = getStatus(available, state.limit);
    const row = document.createElement("tr");

    const selectedMarkup = state.selectedNames.length
      ? `<div class="students">${state.selectedNames
          .map((name) => `<span class="student-chip">${name}</span>`)
          .join("")}</div>`
      : '<span class="student-empty">No students selected yet</span>';

    row.innerHTML = `
      <td>
        <p class="book-title">${book.name}</p>
        <p class="book-meta">Core allocation title</p>
      </td>
      <td>
        <p class="book-title">${book.author}</p>
        <p class="book-meta">Author</p>
      </td>
      <td class="mono">${book.group} student${book.group > 1 ? "s" : ""}</td>
      <td class="mono">${formatPrice(book.price)}</td>
      <td>${selectedMarkup}</td>
      <td>
        <div class="seat-stack">
          <span class="seat-value">${available}</span>
          <span class="seat-meta">${state.count} selected of ${state.limit} total seats</span>
        </div>
      </td>
      <td><span class="status-badge ${status.className}">${status.label}</span></td>
      <td>
        <button
          class="select-btn"
          ${available <= 0 ? "disabled" : ""}
          onclick='selectBook(${JSON.stringify(book.name)}, ${book.group})'
        >
          ${available <= 0 ? "Unavailable" : "Select Book"}
        </button>
      </td>
    `;

    table.appendChild(row);
  });

  renderSummary();
}

function syncSelectionData(snapshot) {
  const liveSelections = new Map();
  const liveCounts = new Map();

  snapshot.forEach((selectionDoc) => {
    const data = selectionDoc.data();
    const bookName = data.book;
    const names = Array.isArray(data.team) ? data.team.map((member) => member.name) : [];

    if (!liveSelections.has(bookName)) {
      liveSelections.set(bookName, []);
    }

    liveSelections.get(bookName).push(...names);
    liveCounts.set(bookName, (liveCounts.get(bookName) || 0) + names.length);
  });

  books.forEach((book) => {
    const state = bookState.get(book.name);
    const mergedNames = uniqueNames([...book.selected, ...(liveSelections.get(book.name) || [])]);
    const seededCount = book.selected.length + (liveCounts.get(book.name) || 0);

    state.selectedNames = mergedNames;
    state.count = Math.max(state.count, seededCount);
  });

  renderTable();
}

books.forEach((book) => {
  const ref = doc(db, "books", book.name);

  onSnapshot(ref, async (snap) => {
    if (!snap.exists()) {
      await setDoc(ref, { count: book.selected.length, limit: book.limit });
      return;
    }

    const data = snap.data();
    const state = bookState.get(book.name);
    const correctedCount = Math.max(Number(data.count) || 0, book.selected.length);

    if (data.count !== correctedCount || data.limit !== book.limit) {
      await setDoc(ref, { count: correctedCount, limit: book.limit }, { merge: true });
    }

    state.count = correctedCount;
    state.limit = book.limit;

    renderTable();
  });
});

onSnapshot(collection(db, "selections"), syncSelectionData);

window.selectBook = function(name, group) {
  localStorage.setItem("book", name);
  localStorage.setItem("group", group);
  window.location.href = "form.html";
};
