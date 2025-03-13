/**
 * API module for interacting with GitHub API
 */
const api = {
  /**
   * Fetch all commits from a repository
   * @param {string} repo - Repository name
   * @returns {Promise<Array>} - Array of commit objects
   */
  fetchCommits: async function(repo) {
    const since = new Date();
    since.setDate(since.getDate() - config.timeRange);
    
    let page = 1;
    let allCommits = [];
    let hasMoreCommits = true;
    
    while (hasMoreCommits) {
      const response = await fetch(
        `https://api.github.com/repos/${config.orgName}/${repo}/commits?since=${since.toISOString()}&page=${page}&per_page=100`,
        {
          headers: {
            'Authorization': `token ${config.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      const commits = await response.json();
      
      if (commits.length === 0 || !Array.isArray(commits)) {
        hasMoreCommits = false;
      } else {
        allCommits = allCommits.concat(commits.map(commit => ({
          sha: commit.sha,
          author: commit.author ? commit.author.login : (commit.commit.author ? commit.commit.author.name : 'Unknown'),
          date: commit.commit.author.date,
          message: commit.commit.message,
          repo: repo
        })));
        page++;
      }
    }
    
    return allCommits;
  },
  
  /**
   * Fetch all pull requests from a repository
   * @param {string} repo - Repository name
   * @returns {Promise<Array>} - Array of PR objects
   */
  fetchPRs: async function(repo) {
    const since = new Date();
    since.setDate(since.getDate() - config.timeRange);
    
    let page = 1;
    let allPRs = [];
    let hasMorePRs = true;
    
    while (hasMorePRs) {
      const response = await fetch(
        `https://api.github.com/repos/${config.orgName}/${repo}/pulls?state=all&page=${page}&per_page=100`,
        {
          headers: {
            'Authorization': `token ${config.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      const prs = await response.json();
      
      if (prs.length === 0 || !Array.isArray(prs)) {
        hasMorePRs = false;
      } else {
        // Filter PRs by date
        const filteredPRs = prs.filter(pr => {
          const createdDate = new Date(pr.created_at);
          return createdDate >= since;
        });
        
        if (filteredPRs.length === 0) {
          hasMorePRs = false;
        } else {
          allPRs = allPRs.concat(filteredPRs.map(pr => ({
            number: pr.number,
            title: pr.title,
            state: pr.state,
            author: pr.user.login,
            created_at: pr.created_at,
            closed_at: pr.closed_at,
            merged_at: pr.merged_at,
            repo: repo
          })));
          page++;
        }
      }
    }
    
    return allPRs;
  }
};