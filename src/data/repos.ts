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

const repoLanguages = ['JavaScript','Vue','Python','TypeScript'];

function flattenRepo (
  {description,homepageUrl, languages, name, openGraphImageUrl, pushedAt, repositoryTopics, url }: RepoData,
  pins: string[]
): FlatRepo {
  const topics = repositoryTopics.nodes.map(t => t.topic.name).sort();
  const langs = languages.edges.map(lang => {
    return {
      name: lang.node.name,
      size: Math.round((lang.size / languages.totalSize) * 10000) / 100
    };
  });
  const isPinned = pins.includes(name)

  return {
    description, homepageUrl, isPinned, name, openGraphImageUrl, pushedAt, topics, url,
    languages: langs
  }
}

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
  const flatRepos = repos.map(p => flattenRepo(p, pins))
    .sort((a, b) => {
      if (a.isPinned === b.isPinned) {
        return Date.parse(b.pushedAt) - Date.parse(a.pushedAt);
      }
      if (a.isPinned) return -1; // Place pinned items first in sort
      return 1;
    });

  return flatRepos;
}