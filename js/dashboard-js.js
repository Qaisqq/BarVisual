/**
 * Main dashboard module for GitHub dashboard
 */
const dashboard = {
  // Flag to prevent multiple simultaneous data loads
  isLoading: false,
  
  /**
   * Initialize the dashboard and load data
   */
  initDashboard: async function() {
    // Prevent multiple simultaneous calls
    if (this.isLoading) {
      console.log("Data loading already in progress. Please wait...");
      return;
    }
    
    try {
      this.isLoading = true;
      const loadButton = document.querySelector('.config-panel button');
      
      // Disable the button and show loading indicator
      if (loadButton) {
        loadButton.disabled = true;
        loadButton.textContent = 'Loading...';
      }
      
      document.getElementById('loading').style.display = 'block';
      document.getElementById('dashboard').style.display = 'none';
      document.getElementById('error').style.display = 'none';
      
      // Clear any existing chart instances
      visualizer.clearCharts();
      
      // Get the time range from select dropdown
      const timeRangeSelect = document.getElementById('time-range');
      config.timeRange = parseInt(timeRangeSelect.value);
      
      console.log("Loading data for time range:", config.timeRange, "days");
      
      const data = await dataProcessor.processData();
      
      document.getElementById('loading').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      
      visualizer.visualizeData(data);
      tableManager.createCommitTable(data.raw.commits);
      tableManager.createPRTable(data.raw.prs);
      
      console.log("Data loaded successfully");
    } catch (error) {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('error').style.display = 'block';
      document.getElementById('error-message').textContent = `Error: ${error.message}`;
      console.error("Dashboard initialization error:", error);
    } finally {
      // Re-enable the button regardless of success or failure
      this.isLoading = false;
      const loadButton = document.querySelector('.config-panel button');
      if (loadButton) {
        loadButton.disabled = false;
        loadButton.textContent = 'Load Data';
      }
    }
  }
};
