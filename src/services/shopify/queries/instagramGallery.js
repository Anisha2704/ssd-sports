/**
 * GraphQL Query for Shopify Homepage Instagram Gallery Metaobject
 */

export const GET_INSTAGRAM_GALLERY_QUERY = `
  query GetInstagramGallery {
    metaobjects(type: "homepage_instagram_gallery", first: 1) {
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
          references(first: 50) {
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
