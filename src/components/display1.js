// imports
import { main } from "../index.js";
import display15 from "./display15.js";

// funkcija za ispis jedne zemlje sa dodatnim informacijama
export default function display1(index, countries) {
  main.innerHTML = "";

  // HTML za jednu zemlju
  const singleP1 = document.createElement("p");
  singleP1.classList.add("singleP1");
  singleP1.textContent = countries[index].name;

  const singleImg = document.createElement("img");
  singleImg.classList.add("singleImg");
  singleImg.alt = `This is the flag of ${countries[index].name}`;
  singleImg.src = countries[index].flag;

  const singleP2 = document.createElement("p");
  singleP2.classList.add("singleP2");
  singleP2.textContent = `Capital:  ${
    countries[index].capital ? countries[index].capital : "Unspecified"
  }`;

  const singleP3 = document.createElement("p");
  singleP3.classList.add("singleP3");
  singleP3.textContent = `Languages: ${countries[index].languages
    .map((language) => (language = language.name))
    .join(", ")}`;

  const singleP4 = document.createElement("p");
  singleP4.classList.add("singleP4");
  singleP4.textContent = `Time Zones: ${countries[index].timezones
    .map(function (zone) {
      return zone;
    })
    .join(", ")}`;

  const singleP5 = document.createElement("p");
  singleP5.classList.add("singleP5");
  singleP5.textContent = `Population: ${countries[index].population}`;

  //prev, back, next dugmici
  const singleP6 = document.createElement("p");
  singleP6.classList.add("singleP6");

  const prev = document.createElement("button");
  prev.classList.add("prev");
  prev.textContent = "previous";

  const back = document.createElement("button");
  back.classList.add("back");
  back.textContent = "back";

  const next = document.createElement("button");
  next.classList.add("next");
  next.textContent = "next";

  singleP6.append(prev, back, next);

  main.append(
    singleP1,
    singleImg,
    singleP2,
    singleP3,
    singleP4,
    singleP5,
    singleP6
  );

  // listener za prev
  prev.addEventListener("click", function () {
    index = index - 1;
    if (index < 0) {
      index = countries.length - 1;
      display1(index, countries);
    }
    display1(index, countries);
  });

  //listener za back
  back.addEventListener("click", function () {
    display15(countries);
  });

  // listener za next
  next.addEventListener("click", function () {
    index = index + 1;
    if (index > countries.length - 1) {
      index = 0;
      display1(index, countries);
    }
    display1(index, countries);
  });
}
