"use strict";

(() => {

    // Get JSON for REST API:
    async function getJson(url) {

        try {
            const response = await fetch(url);
            const data = response.json();
            return data;
        }
        catch (err) {
            alert(err);
        }
    }

    // On click (ALL button), go the given url:
    const displayAllButton = document.getElementById("displayAllButton");
    displayAllButton.addEventListener("click", async () => {

        const allCountryContainer = await getJson("https://restcountries.com/v3.1/all");
        displayAllCountries(allCountryContainer);
        displaySumAndAvg(allCountryContainer);
        displayByRegion(allCountryContainer);
    });

    // On click (Search Button), don't  submit and check the search input: 
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", async event => {

        event.preventDefault();
        const searchInput = document.getElementById("searchInput").value;
        if (searchInput.trim() !== "") {
            const searchResults = await searchCountries(searchInput);
            displaySearchResults(searchResults);
        }
    });

    // Search countries by name:
    async function searchCountries(searchTerm) {

        const allCountryContainer = await getJson("https://restcountries.com/v3.1/all");
        const searchResults = allCountryContainer.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm.toLowerCase()));
        return searchResults;
    }

    // Display search results in a table
    function displaySearchResults(searchResults) {

        const citizensTable = document.getElementById("citizensTable");
        let html = "";
        for (const country of searchResults) {
            html += `
      <tr class="table-secondary">
        <td>${country.name.common}</td>
        <td>${country.population}</td>
      </tr>
    `;
        }
        citizensTable.innerHTML = html;
    }

    // Display all the countries in a table:
    function displayAllCountries(allCountryContainer) {

        const citizensTable = document.getElementById("citizensTable");
        let html = "";
        for (const stats of allCountryContainer) {
            html +=
                `
            <tr class="table-secondary">
            <td>${stats.name.common}</td>
            <td>${stats.population}</td>
            </tr>
            `;
        }
        citizensTable.innerHTML = html;
    }

    // Display total population from all countries (sum) and the average population (of all countries):
    function displaySumAndAvg(allCountryContainer) {

        const sumAndAvgCountryPopulation = document.getElementById("sumAndAvgCountryPopulation");
        let sum = 0;

        for (const countries of allCountryContainer) {
            sum += countries.population;
        }

        let avg = sum / allCountryContainer.length;
        let html = `Total countries population: ${sum}
                    <br>Average Population: ${avg.toFixed(0)}
                    <br>Total Number of Countries: ${allCountryContainer.length}`
        sumAndAvgCountryPopulation.innerHTML = html;
    }

    // Display the number of countries on each region (via table):
    function displayByRegion(allCountryContainer) {
        const regionTable = document.getElementById("regionTable");
        let html = "";

        // New object to hold the countries:
        const regionCount = {};

        // Count the number of countries for each region:
        for (const country of allCountryContainer) {
            const region = country.region;
            if (regionCount[region]) {
                regionCount[region]++;
            } else {
                regionCount[region] = 1;
            }
        }

        // Display the results:
        for (const region in regionCount) {
            html += `
            <tr class="table-secondary">
                <td>${region}</td>
                <td>${regionCount[region]}</td>
            </tr>
        `;
        }
        regionTable.innerHTML = html;
    }

})();