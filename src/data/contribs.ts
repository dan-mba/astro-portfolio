import { graphql } from "@octokit/graphql";
import { number, string } from "astro/zod";

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

export type prContributions = {
  repository: {
    description: string;
    name: string;
    owner: {
      login: string;
    }
    stargazerCount: number;
    url: string;
  }
  contributions: {
    edges: {
      node: {
        pullRequest: {
          merged: boolean
          mergedAt: string;
          number: number;
          title: string;
          url: string;
        }
      }
    }[]
  }
}

type contributionQuery = {
  user: {
    contributionsCollection: {
      pullRequestContributionsByRepository: prContributions []
      issueContributionsByRepository: {
        repository: {
          description: string;
          name: string;
          owner: {
            login: string;
          }
          stargazerCount: number;
          url: string;
        }
        contributions: {
          edges: {
            node: {
              issue: {
                closed: boolean;
                closedAt: string;
                number: number;
                title: string;
                url: string;
                viewerDidAuthor: boolean;
              }
            }
          }[]
        }
      }[]
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
  start.setFullYear(start.getFullYear() - 1);
  start = new Date(start.getTime() + 1);

  const data = await graphqlWithAuth<contributionQuery>(query,
    {
      login: "dan-mba",
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString()
    }
  );

  return data.user.contributionsCollection.pullRequestContributionsByRepository;
}
