// imports
import { main } from "../index.js";
import display1 from "./display1.js";

export default function display15(countries) {
  main.innerHTML = "";

  // HTML za umanjeni prikaz drzava
  countries.forEach((country) => {
    const divCountry = document.createElement("div");

    const p1 = document.createElement("p");
    p1.textContent = country.name;

    const img = document.createElement("img");
    img.src = country.flag;
    img.alt = `Flag of ${country.name}`;

    const p2 = document.createElement("p");
    p2.textContent = `Capital:  ${
      country.capital ? country.capital : "Unspecified"
    }`;

    divCountry.append(p1, img, p2, document.createElement("hr"));
    main.append(divCountry);

    // listener za zastave
    img.addEventListener("click", function () {
      let index = countries.indexOf(country);

      // zovemo funkciju za ispis jedne zemlje sa dodatnim informacijama
      display1(index, countries);
    });
  });
}
