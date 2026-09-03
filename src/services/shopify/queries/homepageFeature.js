/**
 * GraphQL Query for Shopify Homepage Feature Section Metaobject
 */

export const GET_HOMEPAGE_FEATURE_QUERY = `
  query GetHomepageFeatureSection {
    metaobjects(type: "homepage_feature_section", first: 1) {
      nodes {
        id
        handle
        type
        fields {
          key
          value
          type
          reference {
            ... on Video {
              id
              sources {
                url
                mimeType
                format
                height
                width
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
`;
