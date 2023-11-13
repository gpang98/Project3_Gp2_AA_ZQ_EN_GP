// Define the URLs
const url_ticker = "http://127.0.0.1:5000/api/v1.0/ticker";
const url_industry_gp = "http://127.0.0.1:5000/api/v1.0/industry_groups";
const url_topten_historic = "http://127.0.0.1:5000/api/v1.0/top_ten_historic";

const stockInformationOrder = [
  'company_name',
  'industry_gp',
  'lastPrice',
  'Change',
  'volumePerDay',
  'volume4wAvg',
  'Open',
  'dayRange',
  'prevClose',
  'lastTrade',
  'oneWeek',
  'oneMonth',
  'YTD2023',
  'vsSectorOneYr',
  'vsASX200OneYr',
  'marketCap',
  'ASXRank',
  'sectorRank',
  'sharesIssued',
  'Sector',
  'similarCompanies',
  'EPS',
  'DPS',
  'bookValuePerShare',
  'Breakdown',
  'Recommendation',
  'lastUpdated',
  'PE',
];

// Function to fetch data from a URL and work with the JSON response
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to populate the Industry Group dropdown
async function populateIndustryGroupDropdown() {
  try {
    const industryGroups = await fetchData(url_industry_gp);

    const industryGroupDropdown = document.getElementById("industryGroupDropdown");

    if (!industryGroupDropdown) {
      console.error("Industry Group dropdown element not found");
      return;
    }

    // Clear existing options
    industryGroupDropdown.innerHTML = "";

    industryGroups.forEach((group) => {
      const option = document.createElement("option");
      option.value = group;
      option.textContent = group;
      industryGroupDropdown.appendChild(option);
    });

    // Call the function to populate the Ticker dropdown with the selected industry group
    const selectedIndustryGroup = industryGroupDropdown.value;
    populateTickerDropdown(selectedIndustryGroup);
  } catch (error) {
    console.error("Error populating Industry Group dropdown:", error);
  }
}

// Call the function to populate the dropdown when the page loads
populateIndustryGroupDropdown();

async function populateTickerDropdown(selectedIndustryGroup) {
  try {
    // Use the new URL for fetching ticker data
    const tickerData = await fetchData(url_ticker);

    console.log("Ticker Data:", tickerData);  // Log the fetched data

    const filteredTickers = tickerData.filter(ticker => ticker.industry_name === selectedIndustryGroup);

    console.log("Filtered Tickers:", filteredTickers);  // Log the filtered data

    const tickerDropdown = document.getElementById("tickerDropdown");

    // Clear existing options
    tickerDropdown.innerHTML = "";

    filteredTickers.forEach((ticker) => {
      const option = document.createElement("option");
      option.value = ticker.ticker;
      option.textContent = ticker.ticker;
      tickerDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error populating Ticker dropdown:", error);
  }
}

// Call the function to populate the dropdown when the page loads
populateTickerDropdown('Automobiles & Components'); // Replace with a default value if needed



// Function to update stock information based on the selected Ticker
async function updateStockInfo(selectedTicker) {
  try {
    // Use the dynamic URL for fetching fundamental data
    const fundamentalUrl = `http://127.0.0.1:5000/api/v1.0/fundamental/${selectedTicker}`;
    const stockData = await fetchData(fundamentalUrl);
    
    // Assuming the response structure remains the same, adjust these properties accordingly
    const [
      id,
      ticker,
      company_name,
      industry_gp,
      lastPrice,
      Change,
      volumePerDay,
      volume4wAvg,
      Open,
      dayRange,
      prevClose,
      lastTrade,
      oneWeek,
      oneMonth,
      YTD2023,
      vsSectorOneYr,
      vsASX200OneYr,
      marketCap,
      ASXRank,
      sectorRank,
      sharesIssued,
      Sector,
      similarCompanies,
      EPS,
      DPS,
      bookValuePerShare,
      Breakdown,
      Recommendation,
      lastUpdated,
      PE
    ] = stockData;

    // Update each column with the corresponding information
    document.getElementById('column1').textContent = `Companyy Name: ${company_name}`;
    document.getElementById('column2').textContent = `Industry Group: ${industry_gp}`;
    document.getElementById('column3').textContent = `Last Price: ${lastPrice}`;
    document.getElementById('column4').textContent = `Change: ${Change}`;
    document.getElementById('column6').textContent = `Volume Per Day: ${volumePerDay}`;
    document.getElementById('column7').textContent = `Volume 4wk Avg: ${volume4wAvg}`;
    document.getElementById('column8').textContent = `Open: ${Open}`;
    document.getElementById('column9').textContent = `Day Range: ${dayRange}`;
    document.getElementById('column10').textContent = `Previous Close: ${prevClose}`;
    document.getElementById('column11').textContent = `Last Trade: ${lastTrade}`;
    document.getElementById('column12').textContent = `One Week: ${oneWeek}`;
    document.getElementById('column13').textContent = `One Month: ${oneMonth}`;
    document.getElementById('column14').textContent = `2023 YTD: ${YTD2023}`;
    document.getElementById('column15').textContent = `vs Sector (1 Year): ${vsSectorOneYr}`;
    document.getElementById('column16').textContent = `vs ASX200 (1 Year): ${vsASX200OneYr}`;
    document.getElementById('column17').textContent = `Market Cap: ${marketCap}`;
    document.getElementById('column18').textContent = `ASX Rank: ${ASXRank}`;
    document.getElementById('column19').textContent = `Sector Rank: ${sectorRank}`;
    document.getElementById('column20').textContent = `Shares Issued: ${sharesIssued}`;
    document.getElementById('column21').textContent = `Sector: ${Sector}`;
    document.getElementById('column22').textContent = `Similar Companies: ${similarCompanies}`;
    document.getElementById('column23').textContent = `EPS: ${EPS}`;
    document.getElementById('column24').textContent = `DPS: ${DPS}`;
    document.getElementById('column25').textContent = `Book Value PerShare: ${bookValuePerShare}`;
    document.getElementById('column26').textContent = `Breakdown: ${Breakdown}`;
    document.getElementById('column27').textContent = `Recommendation: ${Recommendation}`;
    document.getElementById('column28').textContent = `Last Updated: ${lastUpdated}`;
    document.getElementById('column29').textContent = `PE: ${PE}`;
    
      
    // Continue updating other columns as needed
  } catch (error) {
    console.error("Error updating stock information:", error);
  }
}

 
// Declare lineChart variable outside the function to store the Chart instance
let lineChart;

async function updateTimeSeriesChart(selectedTicker) {
  try {
    const ticker = selectedTicker;
    console.log("ticker:", selectedTicker);

    // Fetch data for the time series chart from the URL
    const historicData = await fetchData(url_topten_historic);
    console.log("historicData:", historicData);

    // Filter the data for the selected ticker
    const selectedTickerData = historicData.filter(entry => entry.Ticker === selectedTicker);
    console.log("TickerData:", selectedTickerData);

    // Parse date and sort the data by date
    selectedTickerData.forEach(entry => {
      const [day, month, year] = entry.Date.split(" ");
      entry.Date = luxon.DateTime.fromFormat(`${year}-${month}-${day}`, 'yyyy-MM-dd');
    });

    // Sort the data by date
    selectedTickerData.sort((a, b) => a.Date - b.Date);

    // Arrays to store xData and yData
    const xDataList = selectedTickerData.map(entry => entry.Date);
    const yDataList = selectedTickerData.map(entry => entry.Close);

    console.log("xData:", xDataList);
    console.log("yData:", yDataList);

    // If the chart instance doesn't exist, create a new one
    if (!lineChart || lineChart.data.labels.length === 0) {
      // Create a new chart instance if it doesn't exist or has no data
      const lineChartCanvas = document.getElementById("tickerChart");

      // Create Chart.js line chart
      lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: {
          labels: xDataList.map(date => date.toFormat('dd LLL yyyy')),
          datasets: [{
            label: selectedTicker,
            data: yDataList,
            borderColor: 'red', // Change the line color to red
            // borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
            pointRadius: 0, // Set pointRadius to 0 to remove dots
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero : true,
              title: {
                display: true,
                text: 'AUD'
              }
            }
          }
        }
      });
    } else {
      // Update the existing chart with new data
      lineChart.data.labels = xDataList.map(date => date.toFormat('dd LLL yyyy'));
      lineChart.data.datasets[0].data = yDataList;
      lineChart.data.datasets[0].label = selectedTicker;
      lineChart.update(); // Update the chart
    }
  } catch (error) {
    console.error('Error updating time series chart:', error);
  }
}



// Function to update the bar charts based on the selected Industry Group
async function updateBarCharts(selectedIndustryGroup) {
  try {
    // Step 1: Fetch ticker data
    const tickerData = await fetchData(url_ticker);
    console.log("Step 1 - Ticker Data:", tickerData);

    // Step 2: Filter tickers based on the selected industry group
    const filteredTickers = tickerData.filter(ticker => ticker.industry_name === selectedIndustryGroup);
    console.log("Step 2 - Filtered Tickers:", filteredTickers);

    // Step 3: Extract necessary data for bar charts
    const companies = filteredTickers.map(ticker => ticker.ticker);
    console.log("Step 3 - Tickers:", companies);

    // Step 4: Fetch fundamental data for each selected ticker
    const fundamentalPromises = filteredTickers.map(async (selectedTicker) => {
      const fundamentalUrl = `http://127.0.0.1:5000/api/v1.0/fundamental/${selectedTicker.ticker}`;
      const fundamentalData = await fetchData(fundamentalUrl);
      console.log(`Step 4 - Fundamental Data for ${selectedTicker.ticker}:`, fundamentalData);

      // Return the data
      return {
        ticker: selectedTicker.ticker,
        marketCap: fundamentalData[17], // Adjust the index based on your data structure
        eps: fundamentalData[23], // Adjust the index based on your data structure
        dps: fundamentalData[24], // Adjust the index based on your data structure
        pe: fundamentalData[29], // Adjust the index based on your data structure
      };
    });

    // Wait for all promises to resolve
    const fundamentalResults = await Promise.all(fundamentalPromises);
    console.log("Step 5 - Fundamental Results:", fundamentalResults);

    // Step 6: Extract necessary data for bar charts
    const marketCapValues = fundamentalResults.map(company => parseFloat(company.marketCap));
    const epsValues = fundamentalResults.map(company => parseFloat(company.eps));
    const dpsValues = fundamentalResults.map(company => parseFloat(company.dps));
    const peValues = fundamentalResults.map(company => parseFloat(company.pe));

    // Step 7: Update market cap data
    const marketCapChartData = [
      { x: companies, y: marketCapValues, type: 'bar', name: 'Market Cap (in billions USD)' }
    ];

    // Step 8: Update EPS data
    const epsChartData = [
      { x: companies, y: epsValues, type: 'bar', name: 'EPS (USD)' }
    ];

     // Step 9: Update PE data
     const dpsChartData = [
      { x: companies, y: dpsValues, type: 'bar', name: 'Dividend PerShare (DPS)' }
    ];

    // Step 10: Update PE data
    const peChartData = [
      { x: companies, y: peValues, type: 'bar', name: 'PE Ratio' }
    ];

    // Update market cap chart
    const marketCapChartLayout = {
      barmode: 'group',
      title: 'Market Cap Comparison',
      xaxis: { title: 'Company' },
      yaxis: { title: 'Market Cap (in billions USD)' }
    };
    Plotly.newPlot('marketCapChart', marketCapChartData, marketCapChartLayout);

    // Update EPS chart
    const epsChartLayout = {
      barmode: 'group',
      title: 'EPS Comparison',
      xaxis: { title: 'Company' },
      yaxis: { title: 'EPS (USD)' }
    };
    Plotly.newPlot('epsChart', epsChartData, epsChartLayout);

    // Update DPS chart
    const dpsChartLayout = {
      barmode: 'group',
      title: 'Dividend PerShare',
      xaxis: { title: 'Company' },
      yaxis: { title: 'DPS (USD)' }
    };

    Plotly.newPlot('dpsChart', dpsChartData, dpsChartLayout);

    // Update PE chart
    const peChartLayout = {
      barmode: 'group',
      title: 'PE Ratio Comparison',
      xaxis: { title: 'Company' },
      yaxis: { title: 'PE Ratio' }
    };

    Plotly.newPlot('peChart', peChartData, peChartLayout);
  } catch (error) {
    console.error("Error updating bar charts:", error);
  }
}

// Function to handle the change in dropdown value
function optionChanged(value) {
  // Handle the change, you can use the 'value' parameter
  console.log('Selected value:', value);
  // You may want to call other functions or perform actions here
}

// Add an event listener to the Industry Group dropdown
document.getElementById("industryGroupDropdown").addEventListener("change", (event) => {
  selectedIndustryGroup = event.target.value;
  populateTickerDropdown(selectedIndustryGroup);
  updateBarCharts(selectedIndustryGroup);
});

// Add an event listener to the "ticker" dropdown
document.getElementById("tickerDropdown").addEventListener("change", (event) => {
  const selectedTicker = event.target.value;
  updateStockInfo(selectedTicker);
  updateTimeSeriesChart(selectedTicker);
  updateBarCharts(selectedIndustryGroup);
});

// Call your functions to initialize the charts
document.addEventListener("DOMContentLoaded", function () {
  // Call functions after defining them for better readability
  initializePage();
});

// Function to initialize the page
async function initializePage() {
  await populateIndustryGroupDropdown();
  await populateTickerDropdown('Automobiles & Components');

  updateStockInfo('ARB');
  updateTimeSeriesChart('ARB');
  updateBarCharts('Automobiles & Components');
}

