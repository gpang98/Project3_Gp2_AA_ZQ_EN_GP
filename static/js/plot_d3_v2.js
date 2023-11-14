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
      const data = await d3.json(url); // Use D3's json method to fetch data
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Function to populate the Industry Group dropdown
  async function populateIndustryGroupDropdown() {
    try {
      const industryGroups = await fetchData(url_industry_gp);

      const industryGroupDropdown = d3.select("#industryGroupDropdown");

      if (industryGroupDropdown.empty()) {
        console.error("Industry Group dropdown element not found");
        return;
      }

      // Clear existing options
      industryGroupDropdown.html("");

      industryGroups.forEach((group) => {
        industryGroupDropdown.append("option")
          .attr("value", group)
          .text(group);
      });

      // Call the function to populate the Ticker dropdown with the selected industry group
      const selectedIndustryGroup = industryGroupDropdown.property("value");
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

      const tickerDropdown = d3.select("#tickerDropdown");

      // Clear existing options
      tickerDropdown.html("");

      filteredTickers.forEach((ticker) => {
        tickerDropdown.append("option")
          .attr("value", ticker.ticker)
          .text(ticker.ticker);
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



  // Function to update the bar charts based on the selected Industry Group using D3 for data fetching and Plotly for plotting
  async function updateBarCharts(selectedIndustryGroup) {
  try {
    // Step 1: Fetch ticker data using D3
    const tickerData = await fetchData(url_ticker);
    console.log("Step 1 - Ticker Data:", tickerData);

    // Step 2: Filter tickers based on the selected industry group
    const filteredTickers = tickerData.filter(ticker => ticker.industry_name === selectedIndustryGroup);
    console.log("Step 2 - Filtered Tickers:", filteredTickers);

    // Step 3: Extract necessary data for bar charts
    const companies = filteredTickers.map(ticker => ticker.ticker);
    console.log("Step 3 - Tickers:", companies);

    // Step 4: Fetch fundamental data for each selected ticker using D3
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

    // Wait for all promises to resolve using Promise.allSettled
    const fundamentalResults = await Promise.allSettled(fundamentalPromises);
    console.log("Step 5 - Fundamental Results:", fundamentalResults);

    // Step 6: Extract necessary data for bar charts
    const marketCapValues = fundamentalResults.map(result => result.value ? parseFloat(result.value.marketCap) : 0);
    const epsValues = fundamentalResults.map(result => result.value ? parseFloat(result.value.eps) : 0);
    const dpsValues = fundamentalResults.map(result => result.value ? parseFloat(result.value.dps) : 0);
    const peValues = fundamentalResults.map(result => result.value ? parseFloat(result.value.pe) : 0);

    // Step 7: Update market cap data for Plotly
    const marketCapChartData = [
      { x: companies, y: marketCapValues, type: 'bar', name: 'Market Cap (in billions USD)' }
    ];

    // Step 8: Update EPS data for Plotly
    const epsChartData = [
      { x: companies, y: epsValues, type: 'bar', name: 'EPS (USD)' }
    ];

    // Step 9: Update DPS data for Plotly
    const dpsChartData = [
      { x: companies, y: dpsValues, type: 'bar', name: 'Dividend PerShare (DPS)' }
    ];

    // Step 10: Update PE data for Plotly
    const peChartData = [
      { x: companies, y: peValues, type: 'bar', name: 'PE Ratio' }
    ];

    // Step 11: Update market cap chart using Plotly
    const marketCapChartLayout = {
      barmode: 'group',
      title: 'Market Cap Comparison',
      xaxis: { title: 'Company' },
      yaxis: { title: 'Market Cap (in billions USD)' }
    };
    Plotly.newPlot('marketCapChart', marketCapChartData, marketCapChartLayout);

    // Step 12: Update EPS chart using Plotly
    const epsChartLayout = {
      barmode: 'group',
      title: 'EPS Comparison',
      xaxis: { title: 'Company' },
      yaxis: { title: 'EPS (USD)' }
    };
    Plotly.newPlot('epsChart', epsChartData, epsChartLayout);

    // Step 13: Update DPS chart using Plotly
    const dpsChartLayout = {
      barmode: 'group',
      title: 'Dividend PerShare',
      xaxis: { title: 'Company' },
      yaxis: { title: 'DPS (USD)' }
    };
    Plotly.newPlot('dpsChart', dpsChartData, dpsChartLayout);

    // Step 14: Update PE chart using Plotly
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

  // Add an event listener to the Industry Group dropdown using D3
  d3.select("#industryGroupDropdown").on("change", function() {
    const selectedIndustryGroup = d3.select(this).property("value");
    populateTickerDropdown(selectedIndustryGroup);
    updateBarCharts(selectedIndustryGroup);
  });

  // Add an event listener to the "ticker" dropdown using D3
  d3.select("#tickerDropdown").on("change", function() {
    const selectedTicker = d3.select(this).property("value");
    updateStockInfo(selectedTicker);
    updateTimeSeriesChart(selectedTicker);
    updateBarCharts(d3.select("#industryGroupDropdown").property("value"));
  });

  // Call your functions to initialize the charts
  document.addEventListener("DOMContentLoaded", async function () {
    // Call functions after defining them for better readability
    await initializePage();
  });

  // Function to initialize the page
  async function initializePage() {
    await populateIndustryGroupDropdown();
    await populateTickerDropdown('Automobiles & Components');

    updateStockInfo('ARB');
    updateTimeSeriesChart('ARB');
    updateBarCharts('Automobiles & Components');
  }

