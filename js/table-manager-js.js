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
    
    commits.slice(0, 100).forEach(commit => {
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
      messageCell.textContent = commit.message.split('\n')[0]; // First line of commit message
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
    
    prs.forEach(pr => {
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
      titleCell.textContent = pr.title;
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