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
      
      // Fetch all commits from all repos
      const commitPromises = config.repos.map(repo => api.fetchCommits(repo));
      const allCommitsArrays = await Promise.all(commitPromises);
      const allCommitsUnfiltered = allCommitsArrays.flat();
      
      // Filter out any commits from user "qaisqq"
      const allCommits = allCommitsUnfiltered.filter(commit => commit.author !== "Qaisqq");
      
      // Fetch all PRs from all repos
      const prPromises = config.repos.map(repo => api.fetchPRs(repo));
      const allPRsArrays = await Promise.all(prPromises);
      const allPRsUnfiltered = allPRsArrays.flat();
      
      // Filter out any PRs from user "qaisqq"
      const allPRs = allPRsUnfiltered.filter(pr => pr.author !== "Qaisqq");
      
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
      
      return {
        commits: {
          total: allCommits.length,
          perPerson: commitsPerPerson,
          perDay: commitsPerDay
        },
        prs: {
          total: allPRs.length,
          perPerson: prsPerPerson,
          states: prStates
        },
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
