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
            ... on Video {
              id
              alt
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
