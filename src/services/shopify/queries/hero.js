/**
 * GraphQL Query for Shopify Homepage Hero Section Metaobject
 */

export const GET_HOMEPAGE_HERO_QUERY = `
  query GetHomepageHeroSection {
    metaobjects(type: "homepage_hero_section", first: 1) {
      nodes {
        id
        handle
        type
        fields {
          key
          value
          type
          reference {
            ... on MediaImage {
              id
              image {
                url
                altText
                width
                height
              }
            }
            ... on GenericFile {
              id
              url
            }
          }
          references(first: 20) {
            nodes {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                  width
                  height
                }
              }
              ... on GenericFile {
                id
                url
              }
            }
          }
        }
      }
    }
  }
`;
