/**
 * Main dashboard module for GitHub dashboard
 */
const dashboard = {
  /**
   * Initialize the dashboard and load data
   */
  initDashboard: async function() {
    try {
      document.getElementById('loading').style.display = 'block';
      document.getElementById('dashboard').style.display = 'none';
      document.getElementById('error').style.display = 'none';
      
      const data = await dataProcessor.processData();
      
      document.getElementById('loading').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      
      visualizer.visualizeData(data);
      tableManager.createCommitTable(data.raw.commits);
      tableManager.createPRTable(data.raw.prs);
    } catch (error) {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('error').style.display = 'block';
      document.getElementById('error-message').textContent = `Error: ${error.message}`;
      console.error(error);
    }
  }
};