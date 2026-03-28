import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyASY0irLF6toyTcCLugM7Mi9NkLMDdlfw",
  authDomain: "book-poll-751a2.firebaseapp.com",
  projectId: "book-poll-751a2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const book = localStorage.getItem("book");
const group = Number.parseInt(localStorage.getItem("group"), 10);

const teamDiv = document.getElementById("team");
const selectedBookEl = document.getElementById("selectedBook");
const selectedGroupEl = document.getElementById("selectedGroup");

window.goBack = function() {
  window.location.href = "../index.html";
};

if (!book || !group) {
  window.location.href = "../index.html";
} else {
  selectedBookEl.textContent = book;
  selectedGroupEl.textContent = `${group} student${group > 1 ? "s" : ""}`;

  for (let i = 1; i < group; i += 1) {
    const memberIndex = i + 1;

    teamDiv.innerHTML += `
      <section class="member-card">
        <h3 class="member-title">Team Member ${memberIndex}</h3>
        <div class="field-grid">
          <div class="field">
            <label for="member-name-${memberIndex}">Student Name</label>
            <input id="member-name-${memberIndex}" placeholder="Enter full name" class="mName">
          </div>
          <div class="field">
            <label for="member-roll-${memberIndex}">Roll Number</label>
            <input id="member-roll-${memberIndex}" placeholder="Enter roll number" class="mRoll">
          </div>
        </div>
      </section>
    `;
  }

  window.submitData = async function() {
    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();

    if (!name || !roll) {
      alert("Please fill in your name and roll number.");
      return;
    }

    const team = [{ name, roll }];
    const names = document.querySelectorAll(".mName");
    const rolls = document.querySelectorAll(".mRoll");

    for (let i = 0; i < names.length; i += 1) {
      const memberName = names[i].value.trim();
      const memberRoll = rolls[i].value.trim();

      if (!memberName || !memberRoll) {
        alert("Please fill in all team member details.");
        return;
      }

      team.push({ name: memberName, roll: memberRoll });
    }

    const allSelections = await getDocs(collection(db, "selections"));

    for (const selection of allSelections.docs) {
      const existingTeam = Array.isArray(selection.data().team) ? selection.data().team : [];

      for (const existingMember of existingTeam) {
        for (const currentMember of team) {
          if (existingMember.roll === currentMember.roll) {
            alert(`Roll number ${currentMember.roll} is already used.`);
            return;
          }
        }
      }
    }

    const ref = doc(db, "books", book);
    const snap = await getDoc(ref);
    const data = snap.data();

    if (!data) {
      alert("Book details could not be loaded. Please try again.");
      return;
    }

    if (data.count + group > data.limit) {
      alert("This book does not have enough seats left.");
      return;
    }

    await addDoc(collection(db, "selections"), {
      book,
      team,
      time: new Date()
    });

    await updateDoc(ref, {
      count: data.count + group
    });

    alert("Allocation submitted successfully.");
    window.location.href = "../index.html";
  };
}
