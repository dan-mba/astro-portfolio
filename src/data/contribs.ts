import { graphql } from "@octokit/graphql";
import { emojify } from "node-emoji";

type filterType = {
  owner: string;
  name: string;
  number: number;
}

const repoFilter = [
  {owner: 'firstcontributions', name: 'first-contributions'},
  {owner: 'uBlockOrigin', name: 'uAssets'}
];
const issueFilter = [
  {owner: 'gatsbyjs', name: 'gatsby', number: 36192},
  {owner: 'microsoft', name: 'playwright', number: 18847},
  {owner: 'EddieHubCommunity', name: 'support', number: 5763},
  {owner: 'EddieHubCommunity', name: 'EddieHubLive', number: 64},
  {owner: 'EddieHubCommunity', name: 'BioDrop', number: 1987},
  {owner: 'EddieHubCommunity', name: 'BioDrop', number: 2052},
  {owner: 'AccessibleForAll', name: 'Support', number: 422}
];
const prFilter: filterType[] = [];
const maxContributions = 12;
const userid = "dan-mba";

const cropString = (str: string) => {
  const cropLength = 100;
  if (str.length > cropLength) {
    const word = str.substring(cropLength).indexOf(' ');
    if (word < 0) {
      return str;
    }

    return `${str.substring(0, cropLength+word)}...`;
  }
  return str;
}

const query = `
  query getContribData($login: String!, $startDateTime: DateTime!, $endDateTime: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $startDateTime, to: $endDateTime) {
        pullRequestContributionsByRepository {
          repository {
            description
            name
            owner {
              login
            }
            stargazerCount
            url
          }
          contributions(first: 15) {
            edges {
              node {
                pullRequest {
                  merged
                  mergedAt
                  number
                  title
                  url
                }
              }
            }
          }
        }
        issueContributionsByRepository {
          repository {
            description
            name
            owner {
              login
            }
            stargazerCount
            url
          }
          contributions(first: 15) {
            edges {
              node {
                issue {
                  closed
                  closedAt
                  number
                  title
                  url
                  viewerDidAuthor
                }
              }
            }
          }
        }
      }
    }
  }
`;

type repoData = {
  description: string;
  name: string;
  owner: {
    login: string;
  }
  stargazerCount: number;
  url: string;
}


type prData = {
  merged: boolean
  mergedAt: string;
  number: number;
  title: string;
  url: string;
}

type prContribution = {
  repository: repoData;
  contributions: {
    edges: {
      node: {
        pullRequest: prData;
      }
    }[]
  }
}

type issueData = {
  closed: boolean;
  closedAt: string;
  number: number;
  title: string;
  url: string;
  viewerDidAuthor: boolean;
}

type issueContribution = {
  repository: repoData
  contributions: {
    edges: {
      node: {
        issue: issueData;
      }
    }[]
  }
}

type contributionQuery = {
  user: {
    contributionsCollection: {
      pullRequestContributionsByRepository: prContribution []
      issueContributionsByRepository: issueContribution []
    }
  }
};

export type flatContribution = {
  description: string;
  name: string;
  owner: string;
  stargazerCount: number;
  stargazerPrint?: string;
  url: string;
  prs: prData[];
  issues: issueData[];
  totalContributions: number;
}

export async function getContributions() {
  const token = import.meta.env.GITHUB_TOKEN;
  if(!token) {
    throw new Error('GitHub token not set');
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });

  let end = new Date(Date.now());
  let start = new Date(end);
  let prs: prContribution[] = [];
  let issues: issueContribution[] = [];
  
  for(;;) {
    start.setFullYear(start.getFullYear() - 1);
    start = new Date(start.getTime() + 1);

    const data = await graphqlWithAuth<contributionQuery>(query,
      {
        login: userid,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString()
      }
    );
    if(data.user.contributionsCollection.pullRequestContributionsByRepository.length === 0 && 
      data.user.contributionsCollection.issueContributionsByRepository.length === 0) {
        break;
      }
    if(prs.length === 0) {
      prs = [...data.user.contributionsCollection.pullRequestContributionsByRepository
        .filter(r => {
          if (r.repository.owner.login === userid) return false;
          if (repoFilter.length > 0) {
            if (repoFilter.some(repo => (
              repo.owner === r.repository.owner.login && repo.name === r.repository.name
            ))) return false;
          }
          return true;
        })
      ];
    } else {
      let newPrs = data.user.contributionsCollection.pullRequestContributionsByRepository;
      newPrs.forEach(newPr => {
        if (newPr.repository.owner.login === userid) return;
        if (repoFilter.length > 0) {
          if (repoFilter.some(repo => (
            repo.owner === newPr.repository.owner.login && repo.name === newPr.repository.name
          ))) return;
        }
        const foundPr = prs.find(pr => (
          pr.repository.name === newPr.repository.name &&
          pr.repository.owner.login === newPr.repository.owner.login
        ));
        if (foundPr) {
          newPr.contributions.edges.forEach(pr => {
            const inList = foundPr.contributions.edges.findIndex(p => pr.node.pullRequest.number === p.node.pullRequest.number);
            if(inList < 0) {
              foundPr.contributions.edges.push(pr);
            }
          });
        } else {
          prs.push(newPr);
        }
      });
    }
    if(issues.length === 0) {
      issues = [...data.user.contributionsCollection.issueContributionsByRepository
        .filter(r => {
          if (r.repository.owner.login === userid) return false;
          if (repoFilter.length > 0) {
            if (repoFilter.some(repo => (
              repo.owner === r.repository.owner.login && repo.name === r.repository.name
            ))) return false;
          }
          return true;
        })
      ];
    } else {
      const newIssues = data.user.contributionsCollection.issueContributionsByRepository;
      newIssues.forEach(newIssue => {
        if (newIssue.repository.owner.login === userid) return;
        if (repoFilter.length > 0) {
          if (repoFilter.some(repo => (
            repo.owner === newIssue.repository.owner.login && repo.name === newIssue.repository.name
          ))) return;
        }
        const foundIssue = issues.find(issue => (
          issue.repository.name === newIssue.repository.name &&
          issue.repository.owner.login === newIssue.repository.owner.login
        ));
        if (foundIssue) {
          newIssue.contributions.edges.forEach(issue => {
            const inList = foundIssue.contributions.edges.findIndex(i => issue.node.issue.number === i.node.issue.number);
            if(inList < 0) {
              foundIssue.contributions.edges.push(issue);
            }
          });
        } else {
          issues.push(newIssue);
        }
      });
    }

    end = new Date(start.getTime() - 1);
  }

  let repos: flatContribution[] = [];

  repos = prs.map(r => {
    let repo = structuredClone(r);
    let contribs = repo.contributions.edges.map(e => e.node.pullRequest);

    // filter out PRs that are not merged
    contribs = contribs.filter(c => c.merged);

    return {
      ...repo.repository,
      owner: repo.repository.owner.login,
      prs: contribs,
      issues: [],
      totalContributions: contribs.length
    };
  });
  
  repos = repos.filter(r => r.totalContributions !== 0);
  if (prFilter.length > 0) {
    prFilter.forEach(r => {
      const index = repos.findIndex(rp => (rp.name === r.name) && (rp.owner === r.owner));
      if (index >= 0) {
        const prIndex = repos[index].prs.findIndex(pr => pr.number === r.number);
        if (prIndex >= 0) {
          repos[index].prs.splice(prIndex, 1);
          repos[index].totalContributions--;
        }
        if (repos[index].totalContributions === 0) {
          repos.splice(index, 1);
        }
      }
    })
  }

  let issueRepos: flatContribution[] = [];

  issueRepos = issues.map(r => {
    let repo = structuredClone(r)
    let contribs = repo.contributions.edges.map(e => e.node.issue);

    // filter out issues that are not closed and the userid did not author
    contribs = contribs.filter(c => c.closed && c.viewerDidAuthor);
    return {
      ...repo.repository,
      owner: repo.repository.owner.login,
      prs: [],
      issues: contribs,
      totalContributions: contribs.length
    };


  });

  issueRepos = issueRepos.filter(r => r.totalContributions !== 0);
  if (issueFilter.length > 0) {
    issueFilter.forEach(r => {
      const index = issueRepos.findIndex(repo => (repo.name === r.name) && (repo.owner === r.owner));
      if (index >= 0) {
        const issueIndex = issueRepos[index].issues.findIndex(issue => issue.number === r.number);
        if (issueIndex >= 0) {
          issueRepos[index].issues.splice(issueIndex, 1);
          issueRepos[index].totalContributions--;
        }
        if (issueRepos[index].totalContributions === 0) {
          issueRepos.splice(index, 1);
        }
      }
    })
  }

  // if repo already in the array, add issues to it otherwise push it to the array
  issueRepos.forEach(r => {
    const exists = repos.findIndex(repo => {
      return (repo.name === r.name) && (repo.owner === r.owner);
    });

    if (exists < 0) {
      repos.push(r);
      return;
    }
    repos[exists].issues = r.issues;
    repos[exists].totalContributions += r.totalContributions;
  });

  repos.forEach(r => {
    r.description = cropString(emojify(r.description));
    r.stargazerPrint = r.stargazerCount < 1000 ? `${r.stargazerCount}` :
      Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(r.stargazerCount);
  })

  repos.sort((a, b) => {
    if (a.totalContributions === b. totalContributions) {
      //compare while ignoring case
      return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
    }
    return b.totalContributions - a.totalContributions;
  })

  repos.forEach(r => {
    if (r.totalContributions <= maxContributions) return;
    const dates = [
      ...r.issues.map(i => i.closedAt), ...r.prs.map(p => p.mergedAt)
    ];
    dates.sort((a,b) => Date.parse(b) - Date.parse(a));
    const cutoff = Date.parse(dates[maxContributions])
    r.issues = r.issues.filter(i => Date.parse(i.closedAt) > cutoff)
    r.prs = r.prs.filter(p => Date.parse(p.mergedAt) > cutoff)
    r.totalContributions = r.issues.length + r.prs.length;
  })

  return repos;
}
