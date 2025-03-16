/**
 * Visualization module for GitHub dashboard
 */
const visualizer = {
  // Store chart instances so they can be destroyed before recreating
  chartInstances: {
    commitsPerPerson: null,
    commitsPerDay: null,
    prsPerPerson: null,
    prStates: null,
    commitsPerRepo: null,
    prsPerRepo: null
  },

  /**
   * Clear all existing chart instances to prevent "Canvas is already in use" errors
   */
  clearCharts: function() {
    // Destroy all existing chart instances
    Object.keys(this.chartInstances).forEach(key => {
      if (this.chartInstances[key]) {
        this.chartInstances[key].destroy();
        this.chartInstances[key] = null;
      }
    });
  },

  /**
   * Create all charts and update summary stats
   * @param {Object} data - Processed data object
   */
  visualizeData: function(data) {
    // Clear existing charts first
    this.clearCharts();
    
    // Update summary stats
    document.getElementById('total-commits').textContent = data.commits.total;
    document.getElementById('total-prs').textContent = data.prs.total;
    
    // Commits per person chart (limit to top 10 for readability)
    const commitsPerPersonCtx = document.getElementById('commits-per-person').getContext('2d');
    
    // Sort authors by commit count and take top 10
    let sortedAuthors = Object.entries(data.commits.perPerson)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    const commitsPerPersonLabels = sortedAuthors.map(entry => entry[0]);
    const commitsPerPersonValues = sortedAuthors.map(entry => entry[1]);
    
    this.chartInstances.commitsPerPerson = new Chart(commitsPerPersonCtx, {
      type: 'bar',
      data: {
        labels: commitsPerPersonLabels,
        datasets: [{
          label: 'Commits per Person',
          data: commitsPerPersonValues,
          backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    // Commits per day chart
    const commitsPerDayCtx = document.getElementById('commits-per-day').getContext('2d');
    
    // Sort dates chronologically
    const commitsPerDayLabels = Object.keys(data.commits.perDay).sort();
    const commitsPerDayValues = commitsPerDayLabels.map(day => data.commits.perDay[day]);
    
    this.chartInstances.commitsPerDay = new Chart(commitsPerDayCtx, {
      type: 'line',
      data: {
        labels: commitsPerDayLabels.map(date => new Date(date).toLocaleDateString()),
        datasets: [{
          label: 'Commits per Day',
          data: commitsPerDayValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        responsive: true
      }
    });
    
    // PRs per person chart (limit to top 10 for readability)
    const prsPerPersonCtx = document.getElementById('prs-per-person').getContext('2d');
    
    // Sort authors by PR count and take top 10
    let sortedPRAuthors = Object.entries(data.prs.perPerson)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    const prsPerPersonLabels = sortedPRAuthors.map(entry => entry[0]);
    const prsPerPersonValues = sortedPRAuthors.map(entry => entry[1]);
    
    this.chartInstances.prsPerPerson = new Chart(prsPerPersonCtx, {
      type: 'bar',
      data: {
        labels: prsPerPersonLabels,
        datasets: [{
          label: 'PRs per Person',
          data: prsPerPersonValues,
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    // PR states chart
    const prStatesCtx = document.getElementById('pr-states').getContext('2d');
    
    this.chartInstances.prStates = new Chart(prStatesCtx, {
      type: 'pie',
      data: {
        labels: ['Open', 'Closed', 'Merged'],
        datasets: [{
          data: [data.prs.states.open, data.prs.states.closed, data.prs.states.merged],
          backgroundColor: [
            'rgba(255, 206, 86, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(75, 192, 192, 0.5)'
          ]
        }]
      },
      options: {
        responsive: true
      }
    });
    
    // Commits per repository chart (top 10 repos by commit count)
    const commitsPerRepoCtx = document.getElementById('commits-per-repo').getContext('2d');
    
    // Sort repos by commit count and take top 10
    let sortedReposByCommits = Object.entries(data.commits.perRepo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    const commitsPerRepoLabels = sortedReposByCommits.map(entry => entry[0]);
    const commitsPerRepoValues = sortedReposByCommits.map(entry => entry[1]);
    
    this.chartInstances.commitsPerRepo = new Chart(commitsPerRepoCtx, {
      type: 'bar',
      data: {
        labels: commitsPerRepoLabels,
        datasets: [{
          label: 'Commits per Repository',
          data: commitsPerRepoValues,
          backgroundColor: 'rgba(153, 102, 255, 0.5)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    // PRs per repository chart (top 10 repos by PR count)
    const prsPerRepoCtx = document.getElementById('prs-per-repo').getContext('2d');
    
    // Sort repos by PR count and take top 10
    let sortedReposByPRs = Object.entries(data.prs.perRepo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    const prsPerRepoLabels = sortedReposByPRs.map(entry => entry[0]);
    const prsPerRepoValues = sortedReposByPRs.map(entry => entry[1]);
    
    this.chartInstances.prsPerRepo = new Chart(prsPerRepoCtx, {
      type: 'bar',
      data: {
        labels: prsPerRepoLabels,
        datasets: [{
          label: 'PRs per Repository',
          data: prsPerRepoValues,
          backgroundColor: 'rgba(255, 159, 64, 0.5)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};