/**
 * API module for interacting with GitHub API
 */
const api = {
  /**
   * Helper to handle API response
   * @param {Response} response - Fetch API response object
   * @returns {Promise} - Promise that resolves with JSON data or rejects with error
   */
  handleResponse: async function(response) {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error (${response.status}): ${errorText}`);
    }
    return response.json();
  },
  
  /**
   * Fetch all commits from a repository
   * @param {string} repo - Repository name
   * @returns {Promise<Array>} - Array of commit objects
   */
  fetchCommits: async function(repo) {
    const since = new Date();
    since.setDate(since.getDate() - config.timeRange);
    
    console.log(`Fetching commits for ${repo} since ${since.toISOString()} (${config.timeRange} days)`);
    
    let page = 1;
    let allCommits = [];
    let hasMoreCommits = true;
    
    while (hasMoreCommits) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${config.orgName}/${repo}/commits?since=${since.toISOString()}&page=${page}&per_page=100`,
          {
            headers: {
              'Authorization': `token ${config.token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );
        
        const commits = await this.handleResponse(response);
        
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
          console.log(`Loaded ${allCommits.length} commits from ${repo} (page ${page-1})`);
        }
      } catch (error) {
        console.error(`Error fetching commits from ${repo} (page ${page}):`, error);
        hasMoreCommits = false;
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
    
    console.log(`Fetching PRs for ${repo} since ${since.toISOString()} (${config.timeRange} days)`);
    
    let page = 1;
    let allPRs = [];
    let hasMorePRs = true;
    
    while (hasMorePRs) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${config.orgName}/${repo}/pulls?state=all&page=${page}&per_page=100`,
          {
            headers: {
              'Authorization': `token ${config.token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );
        
        const prs = await this.handleResponse(response);
        
        if (prs.length === 0 || !Array.isArray(prs)) {
          hasMorePRs = false;
        } else {
          // Filter PRs by date
          const filteredPRs = prs.filter(pr => {
            const createdDate = new Date(pr.created_at);
            return createdDate >= since;
          });
          
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
          
          // Stop pagination if we've gone past the time window
          const oldestPR = prs[prs.length - 1];
          const oldestDate = new Date(oldestPR.created_at);
          
          if (oldestDate < since || filteredPRs.length === 0) {
            hasMorePRs = false;
          } else {
            page++;
            console.log(`Loaded ${allPRs.length} PRs from ${repo} (page ${page-1})`);
          }
        }
      } catch (error) {
        console.error(`Error fetching PRs from ${repo} (page ${page}):`, error);
        hasMorePRs = false;
      }
    }
    
    return allPRs;
  }
};
