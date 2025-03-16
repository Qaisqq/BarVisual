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
      const loadButton = document.getElementById('load-data-btn');
      
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
      
      // Check for empty fields before proceeding
      const orgName = document.getElementById('org-name').value.trim();
      const token = document.getElementById('token').value.trim();
      
      if (!orgName) {
        throw new Error("Please enter an organization name");
      }
      
      if (!token) {
        throw new Error("Please enter a GitHub token");
      }
      
      // Get the time range from select dropdown
      const timeRangeSelect = document.getElementById('time-range');
      config.timeRange = parseInt(timeRangeSelect.value);
      
      console.log("Loading data for time range:", config.timeRange, "days");
      
      // Process data
      const data = await dataProcessor.processData();
      
      // Hide loading and show dashboard with data
      document.getElementById('loading').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      
      // Update UI with data
      visualizer.visualizeData(data);
      tableManager.createCommitTable(data.raw.commits);
      tableManager.createPRTable(data.raw.prs);
      tableManager.createRepoActivityTable(data.repositories);
      
      console.log("Data loaded successfully");
    } catch (error) {
      // Show error message
      document.getElementById('loading').style.display = 'none';
      document.getElementById('error').style.display = 'block';
      document.getElementById('error-message').textContent = `Error: ${error.message}`;
      console.error("Dashboard initialization error:", error);
    } finally {
      // Re-enable the button regardless of success or failure
      this.isLoading = false;
      const loadButton = document.getElementById('load-data-btn');
      if (loadButton) {
        loadButton.disabled = false;
        loadButton.textContent = 'Load Data';
      }
    }
  }
};