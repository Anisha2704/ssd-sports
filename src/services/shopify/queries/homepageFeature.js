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
            __typename
            ... on Video {
              id
              alt
              previewImage {
                url
              }
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
            ... on MediaImage {
              id
              image {
                url
                altText
                width
                height
              }
            }
          }
          references(first: 5) {
            nodes {
              __typename
              ... on Video {
                id
                alt
                previewImage {
                  url
                }
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
              ... on MediaImage {
                id
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`;
