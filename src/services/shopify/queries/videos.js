/**
 * GraphQL Query for Shopify Homepage Video Section Metaobject
 */

export const GET_HOMEPAGE_VIDEOS_QUERY = `
  query GetHomepageVideoSection {
    metaobjects(type: "homepage_video_section", first: 20) {
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
