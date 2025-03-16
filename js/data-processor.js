/**
 * Data processing module for GitHub dashboard
 */
const dataProcessor = {
  /**
   * Process all data and calculate statistics
   * @returns {Promise<Object>} - Processed data object
   */
  processData: async function() {
    try {
      await config.updateConfig();
      config.validateConfig();
      
      console.log(`Processing data for ${config.repos.length} repositories over ${config.timeRange} days`);
      
      // Fetch all commits from all repos
      const commitPromises = config.repos.map(repo => api.fetchCommits(repo));
      const allCommitsArrays = await Promise.all(commitPromises);
      let allCommits = allCommitsArrays.flat();
      
      // Filter out excluded users
      if (config.excludedUsers.length > 0) {
        const originalCount = allCommits.length;
        allCommits = allCommits.filter(commit => !config.isUserExcluded(commit.author));
        console.log(`Filtered out ${originalCount - allCommits.length} commits from excluded users`);
      }
      
      console.log(`Total commits loaded: ${allCommits.length}`);
      
      // Fetch all PRs from all repos
      const prPromises = config.repos.map(repo => api.fetchPRs(repo));
      const allPRsArrays = await Promise.all(prPromises);
      let allPRs = allPRsArrays.flat();
      
      // Filter out excluded users
      if (config.excludedUsers.length > 0) {
        const originalCount = allPRs.length;
        allPRs = allPRs.filter(pr => !config.isUserExcluded(pr.author));
        console.log(`Filtered out ${originalCount - allPRs.length} PRs from excluded users`);
      }
      
      console.log(`Total PRs loaded: ${allPRs.length}`);
      
      // Calculate commits per person
      const commitsPerPerson = {};
      allCommits.forEach(commit => {
        if (!commitsPerPerson[commit.author]) {
          commitsPerPerson[commit.author] = 0;
        }
        commitsPerPerson[commit.author]++;
      });
      
      // Calculate commits per day
      const commitsPerDay = {};
      allCommits.forEach(commit => {
        const date = commit.date.split('T')[0]; // Extract YYYY-MM-DD
        if (!commitsPerDay[date]) {
          commitsPerDay[date] = 0;
        }
        commitsPerDay[date]++;
      });
      
      // Calculate PRs per person
      const prsPerPerson = {};
      allPRs.forEach(pr => {
        if (!prsPerPerson[pr.author]) {
          prsPerPerson[pr.author] = 0;
        }
        prsPerPerson[pr.author]++;
      });
      
      // Calculate PR states
      const prStates = {
        open: 0,
        closed: 0,
        merged: 0
      };
      
      allPRs.forEach(pr => {
        if (pr.merged_at) {
          prStates.merged++;
        } else if (pr.state === 'closed') {
          prStates.closed++;
        } else {
          prStates.open++;
        }
      });
      
      // Calculate commits per repository
      const commitsPerRepo = {};
      allCommits.forEach(commit => {
        if (!commitsPerRepo[commit.repo]) {
          commitsPerRepo[commit.repo] = 0;
        }
        commitsPerRepo[commit.repo]++;
      });
      
      // Calculate PRs per repository
      const prsPerRepo = {};
      allPRs.forEach(pr => {
        if (!prsPerRepo[pr.repo]) {
          prsPerRepo[pr.repo] = 0;
        }
        prsPerRepo[pr.repo]++;
      });
      
      // Calculate detailed repository statistics
      const repoStats = {};
      config.repos.forEach(repo => {
        repoStats[repo] = {
          commits: 0,
          prs: 0,
          contributors: new Set(),
          commitsByAuthor: {},
          prsByAuthor: {}
        };
      });
      
      allCommits.forEach(commit => {
        const repo = commit.repo;
        const author = commit.author;
        
        if (!repoStats[repo]) {
          repoStats[repo] = {
            commits: 0,
            prs: 0,
            contributors: new Set(),
            commitsByAuthor: {},
            prsByAuthor: {}
          };
        }
        
        repoStats[repo].commits++;
        repoStats[repo].contributors.add(author);
        
        if (!repoStats[repo].commitsByAuthor[author]) {
          repoStats[repo].commitsByAuthor[author] = 0;
        }
        repoStats[repo].commitsByAuthor[author]++;
      });
      
      allPRs.forEach(pr => {
        const repo = pr.repo;
        const author = pr.author;
        
        if (!repoStats[repo]) {
          repoStats[repo] = {
            commits: 0,
            prs: 0,
            contributors: new Set(),
            commitsByAuthor: {},
            prsByAuthor: {}
          };
        }
        
        repoStats[repo].prs++;
        repoStats[repo].contributors.add(author);
        
        if (!repoStats[repo].prsByAuthor[author]) {
          repoStats[repo].prsByAuthor[author] = 0;
        }
        repoStats[repo].prsByAuthor[author]++;
      });
      
      // Convert Sets to arrays for JSON serialization
      Object.keys(repoStats).forEach(repo => {
        repoStats[repo].contributors = [...repoStats[repo].contributors];
      });
      
      return {
        commits: {
          total: allCommits.length,
          perPerson: commitsPerPerson,
          perDay: commitsPerDay,
          perRepo: commitsPerRepo
        },
        prs: {
          total: allPRs.length,
          perPerson: prsPerPerson,
          states: prStates,
          perRepo: prsPerRepo
        },
        repositories: repoStats,
        raw: {
          commits: allCommits,
          prs: allPRs
        }
      };
    } catch (error) {
      console.error("Error processing data:", error);
      throw error;
    }
  }
};