/**
 * Configuration module for GitHub dashboard
 */
const config = {
  orgName: "",
  token: "",
  repos: [],
  timeRange: 30,
  
  // Method to update configuration from form inputs
  updateConfig: function() {
    this.orgName = document.getElementById('org-name').value;
    this.token = document.getElementById('token').value;
    this.timeRange = parseInt(document.getElementById('time-range').value);
    
    // For simplicity, fetch repos based on org name
    return fetch(`https://api.github.com/orgs/${this.orgName}/repos`, {
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        this.repos = data.map(repo => repo.name);
      }
      return this.repos;
    })
    .catch(error => {
      console.error("Error fetching repos:", error);
      throw new Error("Failed to fetch repositories");
    });
  },
  
  // Method to validate configuration
  validateConfig: function() {
    if (!this.orgName || !this.token || this.repos.length === 0) {
      throw new Error("Please enter organization name and GitHub token");
    }
    return true;
  }
};