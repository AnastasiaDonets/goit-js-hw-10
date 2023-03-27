import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry() {
  const name = refs.input.value.trim();
  if (!name.trim()) {
    return;
  }
  fetchCountries(name)
    .then(counrties => {
      clearInput();
      checkInput(counrties);
    })
    .catch(() => {
      Notify.failure('Oops, there is no country with that name');
      clearInput();
    });
}

function renderCountriesList(countries) {
  return countries
    .map(({ name, flags }) => {
      return `<li class="country-list-item">
      <img class="country-list-img" src="${flags.svg}" alt="${name.official}" width = 50px height = 40px>
      <h2 class="country-list-name">${name.official}</h2>
      </li>`;
    })
    .join('');
}

function renderCountriesInfo(counrties) {
  return counrties.map(({ capital, population, languages }) => {
    return `<ul class="country-info-list">
      <li class="country-info-list-item">Capital: ${capital}</li>
      <li class="country-info-list-item">Population: ${population}</li>
      <li class="country-info-list-item">Languages: ${Object.values(
        languages
      ).join(', ')}</li>
    </ul>`;
  });
}

function checkInput(counrties) {
  if (counrties.length === 1) {
    refs.countryList.insertAdjacentHTML(
      'beforeend',
      renderCountriesList(counrties)
    );
    refs.countryInfo.insertAdjacentHTML(
      'beforeend',
      renderCountriesInfo(counrties)
    );
  } else if (counrties.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (counrties.length >= 2 && counrties.length <= 10) {
    refs.countryList.insertAdjacentHTML(
      'beforeend',
      renderCountriesList(counrties)
    );
  }
}

function clearInput() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
