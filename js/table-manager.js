/**
 * Table management module for GitHub dashboard
 */
const tableManager = {
  /**
   * Create commit table with detailed data
   * @param {Array} commits - Array of commit objects
   */
  createCommitTable: function(commits) {
    const tableBody = document.getElementById('commit-table-body');
    tableBody.innerHTML = '';
    
    // Sort commits by date (newest first)
    const sortedCommits = [...commits].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    // Only show the 50 most recent commits for performance
    sortedCommits.slice(0, 50).forEach(commit => {
      const row = document.createElement('tr');
      
      const dateCell = document.createElement('td');
      dateCell.textContent = new Date(commit.date).toLocaleDateString();
      row.appendChild(dateCell);
      
      const authorCell = document.createElement('td');
      authorCell.textContent = commit.author;
      row.appendChild(authorCell);
      
      const repoCell = document.createElement('td');
      repoCell.textContent = commit.repo;
      row.appendChild(repoCell);
      
      const messageCell = document.createElement('td');
      // Get first line of commit message and truncate if too long
      const firstLine = commit.message.split('\n')[0];
      messageCell.textContent = firstLine.length > 100 ? 
        firstLine.substring(0, 100) + '...' : firstLine;
      row.appendChild(messageCell);
      
      tableBody.appendChild(row);
    });
  },
  
  /**
   * Create PR table with detailed data
   * @param {Array} prs - Array of PR objects
   */
  createPRTable: function(prs) {
    const tableBody = document.getElementById('pr-table-body');
    tableBody.innerHTML = '';
    
    // Sort PRs by creation date (newest first)
    const sortedPRs = [...prs].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
    
    // Only show the 50 most recent PRs for performance
    sortedPRs.slice(0, 50).forEach(pr => {
      const row = document.createElement('tr');
      
      const dateCell = document.createElement('td');
      dateCell.textContent = new Date(pr.created_at).toLocaleDateString();
      row.appendChild(dateCell);
      
      const authorCell = document.createElement('td');
      authorCell.textContent = pr.author;
      row.appendChild(authorCell);
      
      const repoCell = document.createElement('td');
      repoCell.textContent = pr.repo;
      row.appendChild(repoCell);
      
      const titleCell = document.createElement('td');
      // Truncate PR title if too long
      titleCell.textContent = pr.title.length > 100 ? 
        pr.title.substring(0, 100) + '...' : pr.title;
      row.appendChild(titleCell);
      
      const stateCell = document.createElement('td');
      if (pr.merged_at) {
        stateCell.textContent = 'Merged';
        stateCell.className = 'merged';
      } else if (pr.state === 'closed') {
        stateCell.textContent = 'Closed';
        stateCell.className = 'closed';
      } else {
        stateCell.textContent = 'Open';
        stateCell.className = 'open';
      }
      row.appendChild(stateCell);
      
      tableBody.appendChild(row);
    });
  }
};