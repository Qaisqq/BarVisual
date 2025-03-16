/**
 * Configuration module for GitHub dashboard
 */
const config = {
  orgName: "",
  token: "",
  repos: [],
  timeRange: 30, // Default time range
  
  // Method to update configuration from form inputs
  updateConfig: function() {
    this.orgName = document.getElementById('org-name').value.trim();
    this.token = document.getElementById('token').value.trim();
    
    // Time range is now updated directly from the dashboard module
    // but we ensure it's an integer
    this.timeRange = parseInt(document.getElementById('time-range').value);
    
    console.log("Config updated, time range:", this.timeRange, "days");
    
    // For simplicity, fetch repos based on org name
    return fetch(`https://api.github.com/orgs/${this.orgName}/repos?per_page=100`, {
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        this.repos = data.map(repo => repo.name);
        console.log(`Found ${this.repos.length} repositories`);
      } else {
        throw new Error("Invalid response format from GitHub API");
      }
      return this.repos;
    })
    .catch(error => {
      console.error("Error fetching repos:", error);
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    });
  },
  
  // Method to validate configuration
  validateConfig: function() {
    if (!this.orgName) {
      throw new Error("Please enter an organization name");
    }
    
    if (!this.token) {
      throw new Error("Please enter a GitHub token");
    }
    
    if (this.repos.length === 0) {
      throw new Error("No repositories found for this organization");
    }
    
    return true;
  }
};
