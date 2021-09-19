import Countries from "./components/Countries";
import { getAllCountries } from "./service";
import { random15 } from "./components/random15.js";

export const selectDiv = document.querySelector("#select");
export const main = document.querySelector("main");

// izabrao sam da sve funkcije ostavim u index.js-u da ne bih dodeljivao let-ovima (currentCountries i filteredCountries) nove vrednosti preko razlicitih modula.

// referentni niz zemalja
// prikazuje selekciju zemalja (ili sve (difoltno stanje) ili zemlje izabranog regiona)
let currentCountries = [];

// filtrirane zemlje
// nad ovim nizom cemo sortirati (nad njim bismo i paginaciju vrsili)
// inicijalno sadrzi svih 250 zemalja, isto kao i currentCountries
// kad se izabere region, preuzima sve zemlje tog regiona
// tek kroz filtriranje postaje manji od currentCountries-a
// sortiranje ne utice na ovaj niz
let filteredCountries = [];

// funkcija za selekciju regiona
function select(countries) {
  // lista regiona
  let tmp = countries.map((country) => country.region);
  let myOptions = [...new Set(tmp)];

  // za neke zemlje region = ""
  // menjamo prazno polje sa "Other/Unspecified"
  let options = myOptions.filter((option) => option.length > 0);
  options.push("Other/Unspecified");

  // pravimo selectMenu
  const selectMenu = document.createElement("select");
  selectDiv.append(selectMenu);

  const defaultOption = document.createElement("option");
  defaultOption.value = "-1";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  defaultOption.hidden = true;
  defaultOption.textContent = "Choose region";

  selectMenu.append(defaultOption);

  // ubacujemo opcije
  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    selectMenu.appendChild(opt);
  });

  // u noRegion niz ubacujemo zemlje koje nemaju region
  let noRegion = countries.filter((country) => country.region === "");

  // listener
  selectMenu.addEventListener("change", function (e) {
    // pomocni niz regionalDisplay
    let regionalDisplay = [];
    main.innerHTML = "";

    // forEach-ujemo zemlje za vrednost inputa
    countries.forEach(function (country) {
      if (selectMenu.value === country.region) {
        regionalDisplay.push(country);
      } else if (selectMenu.value === "Other/Unspecified") {
        // ako je izabrana vrednost "Other/Unspecified"
        // noRegion niz guramo u regionalDisplay
        regionalDisplay = [...noRegion];
      }
    });

    // pozivamo Countries funkciju i prosledjujemo regionalDisplay niz
    main.append(...Countries(regionalDisplay));

    // za slucaj da regionalDisplay niz ima samo jednu zemlju:
    singleCountryDisplay(regionalDisplay);

    // stavljamo da je currentCountries = regionalDisplay-u
    currentCountries = regionalDisplay;
    // i filteredCountries preuzima currentCountries zbog filtriranja i sortiranja
    filteredCountries = [...currentCountries];
  });
}

function singleCountryDisplay(array) {
  // singleCountryDisplay prima niz
  if (array.length === 1) {
    // ako niz ima samo jednog clana, pravimo custom HTML prikaz
    main.innerHTML = "";
    const singleCountry = document.createElement("div");

    const countryName = document.createElement("p");
    countryName.textContent = `Country Name: ${array[0].name}`;

    const nativeName = document.createElement("p");
    nativeName.textContent = `Country's Native Name: ${array[0].nativeName}`;

    const image = document.createElement("img");
    image.src = array[0].flag;
    image.alt = `Flag of ${array[0].name}`;

    // neke zemlje nemaju navedenu prestonicu
    const capital = document.createElement("p");
    if (array[0].capital === "") {
      capital.textContent = "Capital: Unspecified";
    } else {
      capital.textContent = `Capital: ${array[0].capital}`;
    }

    const population = document.createElement("p");
    population.textContent = `Population: ${array[0].population}`;

    const topLevelDomain = document.createElement("p");
    topLevelDomain.textContent = `Top Level Domain: ${array[0].topLevelDomain[0]}`;

    singleCountry.append(
      countryName,
      nativeName,
      image,
      capital,
      population,
      topLevelDomain,
      document.createElement("hr")
    );
    // apendujemo na main jednu custom napravljenu zemlju
    main.append(singleCountry);
  }
}

// filtriranje
function filterCountries() {
  // HTML
  const countryFilter = document.createElement("input");
  countryFilter.type = "text";
  countryFilter.id = "countryFilter";
  countryFilter.placeholder = "Filter by name/alt name";
  selectDiv.append(countryFilter);

  // listener
  countryFilter.addEventListener("input", function (e) {
    filteredCountries = [];
    currentCountries.forEach(function (country) {
      if (
        // ovde sam pretrazivao po imenu i alternativeSpellings zbog zemalja kao sto su Kurasao, Alandska Ostrva, Obala Slonovace, itd
        // Ne znam da ubacim regex koji ce prihvatiti c sa donjom kvacicom kad kucam Curacao
        country.name
          .toLowerCase()
          .startsWith(countryFilter.value.toLowerCase()) ||
        country.altSpellings.some((element) =>
          element.toLowerCase().startsWith(countryFilter.value.toLowerCase())
        )
      ) {
        filteredCountries.push(country);
      }
    });
    // praznimo HTML, zovemo Countries i prosledjujemo filteredCountries niz
    main.innerHTML = "";
    main.append(...Countries(filteredCountries));
    // zovemo i singleCountryDisplay za slucaj da niz ima samo jednog clana
    singleCountryDisplay(filteredCountries);
  });
}

// sortiranje po imenu, regionu, prestonici
function sort() {
  // HTML
  const sortMenu = document.createElement("select");
  sortMenu.id = "sortMenu";
  sortMenu.name = "sortMenu";
  selectDiv.append(sortMenu);

  const defOpt = document.createElement("option");
  defOpt.value = "-1";
  defOpt.selected = true;
  defOpt.disabled = true;
  defOpt.hidden = true;
  defOpt.textContent = "Sort countries by...";
  sortMenu.append(defOpt);

  // opcije
  const sortOptions = ["capital", "name", "region"];
  sortOptions.forEach(function (option) {
    const sortOpt = document.createElement("option");
    sortOpt.value = option;
    sortOpt.textContent = option;
    sortMenu.appendChild(sortOpt);
  });

  // listener
  sortMenu.addEventListener("change", function (e) {
    // za svaku opciju sortiramo niz filteredCountries i pozivamo Countries funkciju
    if (sortMenu.value === "capital") {
      filteredCountries.sort((a, b) =>
        a.capital > b.capital ? 1 : b.capital > a.capital ? -1 : 0
      );
      main.innerHTML = "";
      main.append(...Countries(filteredCountries));
    } else if (sortMenu.value === "name") {
      filteredCountries.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      main.innerHTML = "";
      main.append(...Countries(filteredCountries));
    } else if (sortMenu.value === "region") {
      // ovde sam izabrao da poredjam zemlje po sub-regionu, jer je region najverovatnije vec izabran
      // ako nije, redosled ce ici abecedno subregioni i u svakom zemlje po abecednom redu
      filteredCountries.sort((a, b) =>
        a.subregion > b.subregion ? 1 : b.subregion > a.subregion ? -1 : 0
      );
      main.innerHTML = "";
      main.append(...Countries(filteredCountries));
    }
  });
}

getAllCountries().then((res) => {
  let countries = res.data;
  currentCountries = countries;
  filteredCountries = currentCountries;
  main.innerHTML = "";
  main.append(...Countries(countries));

  // pozivamo select funkciju i prosledjujemo joj currentCountries niz
  select(currentCountries);
  filterCountries();
  sort();
  random15(currentCountries);
  // select i filterCountries ce pozivati singleCountryDisplay
  // nema potrebe da ga ovde pozivam, jer inicijalno stanje je prikaz 250 zemalja
});

// Paginaciju nisam uradio jer bi mi sigurno trebalo jos dosta vremena, a vec sam probio standardni rok. 19h-00 bi ipak trebalo da bude slobodna traka za kolege koje rade.
