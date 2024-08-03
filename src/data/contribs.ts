import { graphql } from "@octokit/graphql";
import EmojiConvertor from 'emoji-js';
const emoji = new EmojiConvertor();
emoji.replace_mode = 'unified';
emoji.allow_native = true;
emoji.allow_caps = true;

const repoFilter = [{owner: 'firstcontributions', name: 'first-contributions'}];
const issueFilter = [
  {owner: 'gatsbyjs', name: 'gatsby', number: 36192},
  {owner: 'microsoft', name: 'playwright', number: 18847},
  {owner: 'EddieHubCommunity', name: 'support', number: 5763},
  {owner: 'EddieHubCommunity', name: 'EddieHubLive', number: 64},
  {owner: 'EddieHubCommunity', name: 'LinkFree', number: 1987},
  {owner: 'EddieHubCommunity', name: 'LinkFree', number: 2052},
  {owner: 'AccessibleForAll', name: 'Support', number: 422}
];
const prFilter = [];
const maxContributions = 12;
const userid = "dan-mba";

const cropString = (str: string) => {
  if (str.length > 80) {
    const word = str.substring(80).indexOf(' ');
    if (word < 0) {
      return str;
    }

    return `${str.substring(0, 80+word)}...`;
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

  return prs;
}
