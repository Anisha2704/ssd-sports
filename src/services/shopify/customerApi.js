import { getCustomerAccountConfig } from './customerConfig.js';

/**
 * Execute a GraphQL query or mutation against Shopify Customer Account API
 */
export async function customerAccountFetch({ query, variables = {}, accessToken }) {
  if (!accessToken) {
    throw new Error('Customer access token is required for Customer Account API requests.');
  }

  const config = await getCustomerAccountConfig();

  const response = await fetch(config.graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Note: Shopify Customer Account API expects the raw token value without 'Bearer' prefix
      Authorization: accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Customer Account API HTTP error (${response.status}): ${errorText}`);
  }

  const json = await response.json();

  if (json.errors && json.errors.length > 0) {
    const messages = json.errors.map((e) => e.message).join(' | ');
    throw new Error(`Customer Account GraphQL Error: ${messages}`);
  }

  return json.data;
}

export const GET_CUSTOMER_PROFILE_QUERY = `
  query GetCustomerProfile {
    customer {
      id
      firstName
      lastName
      displayName
      phoneNumber {
        phoneNumber
      }
      emailAddress {
        emailAddress
      }
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        zip
        phoneNumber
      }
      addresses(first: 10) {
        nodes {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          zip
          phoneNumber
        }
      }
    }
  }
`;

export const GET_CUSTOMER_ORDERS_QUERY = `
  query GetCustomerOrders($first: Int = 10, $after: String) {
    customer {
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          name
          processedAt
          fulfillmentStatus
          financialStatus
          totalPrice {
            amount
            currencyCode
          }
          subtotal {
            amount
            currencyCode
          }
          totalTax {
            amount
            currencyCode
          }
          totalShipping {
            amount
            currencyCode
          }
          lineItems(first: 50) {
            nodes {
              id
              title
              quantity
              totalPrice {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
            }
          }
          shippingAddress {
            firstName
            lastName
            address1
            address2
            city
            province
            zip
            phone
          }
        }
      }
    }
  }
`;

export const UPDATE_CUSTOMER_PROFILE_MUTATION = `
  mutation UpdateCustomerProfile($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer {
        firstName
        lastName
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CREATE_CUSTOMER_ADDRESS_MUTATION = `
  mutation CreateCustomerAddress($address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CUSTOMER_ADDRESS_MUTATION = `
  mutation UpdateCustomerAddress($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const DELETE_CUSTOMER_ADDRESS_MUTATION = `
  mutation DeleteCustomerAddress($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Fetch customer profile
 */
export async function fetchCustomerProfile(accessToken) {
  const data = await customerAccountFetch({
    query: GET_CUSTOMER_PROFILE_QUERY,
    accessToken,
  });
  return data?.customer || null;
}

/**
 * Fetch customer orders
 */
export async function fetchCustomerOrders(accessToken, { first = 10, after = null } = {}) {
  const data = await customerAccountFetch({
    query: GET_CUSTOMER_ORDERS_QUERY,
    variables: { first, after },
    accessToken,
  });
  return data?.customer?.orders || { nodes: [], pageInfo: {} };
}

/**
 * Update customer profile
 */
export async function updateCustomerProfile(accessToken, input) {
  const data = await customerAccountFetch({
    query: UPDATE_CUSTOMER_PROFILE_MUTATION,
    variables: { input },
    accessToken,
  });

  const errors = data?.customerUpdate?.userErrors;
  if (errors && errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(' | '));
  }
  return data?.customerUpdate?.customer;
}

/**
 * Create customer address
 */
export async function createCustomerAddress(accessToken, address, defaultAddress = false) {
  const data = await customerAccountFetch({
    query: CREATE_CUSTOMER_ADDRESS_MUTATION,
    variables: { address, defaultAddress },
    accessToken,
  });

  const errors = data?.customerAddressCreate?.userErrors;
  if (errors && errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(' | '));
  }
  return data?.customerAddressCreate?.customerAddress;
}

/**
 * Update customer address
 */
export async function updateCustomerAddress(accessToken, addressId, address, defaultAddress = false) {
  const data = await customerAccountFetch({
    query: UPDATE_CUSTOMER_ADDRESS_MUTATION,
    variables: { addressId, address, defaultAddress },
    accessToken,
  });

  const errors = data?.customerAddressUpdate?.userErrors;
  if (errors && errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(' | '));
  }
  return data?.customerAddressUpdate?.customerAddress;
}

/**
 * Delete customer address
 */
export async function deleteCustomerAddress(accessToken, addressId) {
  const data = await customerAccountFetch({
    query: DELETE_CUSTOMER_ADDRESS_MUTATION,
    variables: { addressId },
    accessToken,
  });

  const errors = data?.customerAddressDelete?.userErrors;
  if (errors && errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(' | '));
  }
  return data?.customerAddressDelete?.deletedAddressId;
}

