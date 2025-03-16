/**
 * Export utilities module for GitHub dashboard
 */
const exportUtils = {
  /**
   * Export commits table data as CSV
   */
  exportCommitsCSV: function() {
    // Get the commits table data
    const table = document.getElementById('commit-table-body');
    const rows = Array.from(table.getElementsByTagName('tr'));
    
    // Format as CSV
    let csv = 'Date,Author,Repository,Message\n';
    rows.forEach(row => {
      const cells = Array.from(row.getElementsByTagName('td'));
      const rowData = cells.map(cell => `"${cell.textContent.replace(/"/g, '""')}"`);
      csv += rowData.join(',') + '\n';
    });
    
    // Create download link
    this.downloadCSV(csv, 'commits.csv');
  },
  
  /**
   * Export PRs table data as CSV
   */
  exportPRsCSV: function() {
    // Get the PRs table data
    const table = document.getElementById('pr-table-body');
    const rows = Array.from(table.getElementsByTagName('tr'));
    
    // Format as CSV
    let csv = 'Date,Author,Repository,Title,Status\n';
    rows.forEach(row => {
      const cells = Array.from(row.getElementsByTagName('td'));
      const rowData = cells.map(cell => `"${cell.textContent.replace(/"/g, '""')}"`);
      csv += rowData.join(',') + '\n';
    });
    
    // Create download link
    this.downloadCSV(csv, 'pull_requests.csv');
  },
  
  /**
   * Helper method to download CSV data
   * @param {string} csvContent - CSV content as string
   * @param {string} filename - Name for the downloaded file
   */
  downloadCSV: function(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};