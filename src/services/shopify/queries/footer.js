/**
 * GraphQL Query for Shopify Footer Metaobject
 * Queries both 'footer' and 'footer_settings' metaobject types for maximum compatibility.
 */

export const GET_FOOTER_SETTINGS_QUERY = `
  query GetFooterSettings {
    footerMetaobjects: metaobjects(type: "footer", first: 1) {
      nodes {
        id
        handle
        type
        fields {
          key
          value
          type
        }
      }
    }
    footerSettingsMetaobjects: metaobjects(type: "footer_settings", first: 1) {
      nodes {
        id
        handle
        type
        fields {
          key
          value
          type
        }
      }
    }
  }
`;
