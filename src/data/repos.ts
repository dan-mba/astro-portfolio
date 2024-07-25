import { graphql } from "@octokit/graphql";

type RepoData = {
  description: string,
  homepageUrl: string,
  languages: {
    edges: {
      node: {
        name: string
      },
      size: number
    }[],
    totalSize: number
  },
  name: string,
  openGraphImageUrl: string,
  pushedAt: string,
  repositoryTopics: {
    nodes: {
      topic: {
        name: string
      }
    }[]
  }
  stargazerCount: number,
  url: string
};

type FlatRepo = {
  description: string,
  homepageUrl: string,
  isPinned: boolean,
  languages: {
    name: string,
    size: number
  }[],
  name: string,
  openGraphImageUrl: string,
  pushedAt: string,
  topics: string[],
  stargazerCount: number,
  url: string
};

type UserQuery = {
  user: {
    repositories: {
      nodes: RepoData[],
    },
    pinnedItems: {
      nodes: {
        name: string
      }[]
    }
  }
};

const repoLanguages = ['JavaScript','Vue','Python','TypeScript']

export async function getRepos() {
  const token = import.meta.env.GITHUB_TOKEN;
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
  repos = repos.filter(repo => {
    if (repo.repositoryTopics.nodes.length == 0) return false;
    if (repo.languages.edges.some(l => repoLanguages.includes(l.node.name))) return true;
    return false;
  })
  const pins = user.pinnedItems.nodes.map(p => p.name);

  return {
    repos,
    pins
  };
}