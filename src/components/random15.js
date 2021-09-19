// imports
import { selectDiv } from "../index.js";
import display15 from "./display15.js";

export function random15(currentCountries) {
  // random button HTML
  const randBtn = document.createElement("button");
  randBtn.classList.add("randBtn");
  randBtn.textContent = "Randomize!";
  selectDiv.append(randBtn);

  // random button eventListener
  randBtn.addEventListener("click", function (e) {
    // niz za nasumicno izabrane zemlje
    let randomCountries = [];

    // 15 nasumicnih zemalja
    for (let i = 1; i <= 15; i++) {
      randomCountries.push(
        currentCountries[Math.floor(Math.random() * currentCountries.length)]
      );
    }
    // funkcija koja ispisuje 15 nasumicno odabranih zemalja
    display15(randomCountries);
  });
}
