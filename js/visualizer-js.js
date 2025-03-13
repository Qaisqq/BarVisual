/**
 * Visualization module for GitHub dashboard
 */
const visualizer = {
  /**
   * Create all charts and update summary stats
   * @param {Object} data - Processed data object
   */
  visualizeData: function(data) {
    // Commits per person chart
    const commitsPerPersonCtx = document.getElementById('commits-per-person').getContext('2d');
    const commitsPerPersonLabels = Object.keys(data.commits.perPerson);
    const commitsPerPersonValues = commitsPerPersonLabels.map(person => data.commits.perPerson[person]);
    
    new Chart(commitsPerPersonCtx, {
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
    const commitsPerDayLabels = Object.keys(data.commits.perDay).sort();
    const commitsPerDayValues = commitsPerDayLabels.map(day => data.commits.perDay[day]);
    
    new Chart(commitsPerDayCtx, {
      type: 'line',
      data: {
        labels: commitsPerDayLabels,
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
    
    // PRs per person chart
    const prsPerPersonCtx = document.getElementById('prs-per-person').getContext('2d');
    const prsPerPersonLabels = Object.keys(data.prs.perPerson);
    const prsPerPersonValues = prsPerPersonLabels.map(person => data.prs.perPerson[person]);
    
    new Chart(prsPerPersonCtx, {
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
    
    new Chart(prStatesCtx, {
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
    
    // Update summary stats
    document.getElementById('total-commits').textContent = data.commits.total;
    document.getElementById('total-prs').textContent = data.prs.total;
  }
};