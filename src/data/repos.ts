import { graphql } from "@octokit/graphql";

type RepoData = {
  description: String,
  homepageUrl: String,
  languages: {
    edges: {
      node: {
        name: String
      },
      size: Number
    }[],
    totalSize: Number
  },
  name: String,
  openGraphImageUrl: String,
  pushedAt: String,
  repositoryTopics: {
    nodes: {
      topic: {
        name: String
      }
    }[]
  }
  stargazerCount: Number,
  url: String
};

type UserQuery = {
  user: {
    repositories: {
      nodes: RepoData[],
    },
    pinnedItems: {
      nodes: {
        name: String
      }[]
    }
  }
}

export async function getRepos() {
  const token = process.env.GITHUB_TOKEN;
  if(!token) {
    throw new Error('GitHub token not set');
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });

  const {user} = await graphqlWithAuth<UserQuery>(`
    query getRepoData($login: String!) {
      user(login: $login) {
        repositories(first: 100, privacy: PUBLIC,isFork: false, isArchived: false) {
          nodes {
            description
            homepageUrl
            languages(orderBy: {field: SIZE, direction: DESC}, first: 3) {
              edges {
                node {
                  name
                }
                size
              }
              totalSize
            }
            name
            openGraphImageUrl
            pushedAt
            repositoryTopics(first: 50) {
              nodes {
                topic {
                  name
                }
              }
            }
            stargazerCount
            url
          }
        }
        pinnedItems(first: 10) {
          nodes {
            ... on Repository {
              name
            }
          }
        }
      }
    }`,
    {
      login: "dan-mba"
    }
  );

  let repos = user.repositories.nodes;
  const pins = user.pinnedItems.nodes.map(p => p.name);

  return {
    repos,
    pins
  };
}