export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Method check
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Unable to submit bulk order enquiry.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    
    const {
      name,
      companyName = '',
      mobileNumber,
      email,
      address,
      productName,
      quantity,
      message = ''
    } = body;

    // Validate required fields
    const missingFields = [];
    if (!name || typeof name !== 'string' || !name.trim()) missingFields.push('name');
    if (!mobileNumber || typeof mobileNumber !== 'string' || !mobileNumber.trim()) missingFields.push('mobileNumber');
    if (!email || typeof email !== 'string' || !email.trim()) missingFields.push('email');
    if (!address || typeof address !== 'string' || !address.trim()) missingFields.push('address');
    if (!productName || typeof productName !== 'string' || !productName.trim()) missingFields.push('productName');
    if (quantity === undefined || quantity === null || String(quantity).trim() === '') missingFields.push('quantity');

    if (missingFields.length > 0) {
      console.warn('[Bulk Enquiry API] Validation failed. Missing fields:', missingFields.join(', '));
      return res.status(400).json({
        success: false,
        message: 'Unable to submit bulk order enquiry.'
      });
    }

    // Read server-only environment variables
    if (!process.env.SHOPIFY_CLIENT_ID || !process.env.SHOPIFY_CLIENT_SECRET) {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf8');
          for (const line of envContent.split('\n')) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
              const [key, ...valParts] = trimmed.split('=');
              const val = valParts.join('=').trim().replace(/^["']|["']$/g, '');
              if (key.trim() && !process.env[key.trim()]) {
                process.env[key.trim()] = val;
              }
            }
          }
        }
      } catch (e) {
        // ignore error in non-Node environment
      }
    }

    const rawShop = process.env.SHOPIFY_SHOP || 'ssdsports';
    const shop = rawShop.replace(/\.myshopify\.com$/i, '').trim();
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('[Bulk Enquiry API] Server configuration error: Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET.');
      return res.status(500).json({
        success: false,
        message: 'Unable to submit bulk order enquiry.'
      });
    }

    const shopDomain = `${shop}.myshopify.com`;
    const tokenUrl = `https://${shopDomain}/admin/oauth/access_token`;

    // Request Admin access token via Client Credentials grant
    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'client_credentials');
    tokenParams.append('client_id', clientId);
    tokenParams.append('client_secret', clientSecret);

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: tokenParams.toString()
    });

    if (!tokenResponse.ok) {
      console.error('[Bulk Enquiry API] OAuth token fetch failed with HTTP status:', tokenResponse.status);
      return res.status(500).json({
        success: false,
        message: 'Unable to submit bulk order enquiry.'
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('[Bulk Enquiry API] OAuth token fetch succeeded but access_token is missing.');
      return res.status(500).json({
        success: false,
        message: 'Unable to submit bulk order enquiry.'
      });
    }

    const graphqlUrl = `https://${shopDomain}/admin/api/2026-07/graphql.json`;
    const graphqlHeaders = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    };

    // Query metaobject definition to inspect actual field keys
    const metaobjectDefQuery = `
      query GetMetaobjectDefinition($type: String!) {
        metaobjectDefinitionByType(type: $type) {
          id
          type
          fieldDefinitions {
            key
            name
            type {
              name
            }
            required
          }
        }
      }
    `;

    const defResponse = await fetch(graphqlUrl, {
      method: 'POST',
      headers: graphqlHeaders,
      body: JSON.stringify({
        query: metaobjectDefQuery,
        variables: { type: 'bulk_order_enquiries' }
      })
    });

    let fieldDefs = [];
    if (defResponse.ok) {
      const defData = await defResponse.json();
      fieldDefs = defData?.data?.metaobjectDefinitionByType?.fieldDefinitions || [];
    } else {
      console.warn('[Bulk Enquiry API] Metaobject definition query returned status:', defResponse.status);
    }

    const formValues = {
      name: name.trim(),
      companyName: String(companyName).trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      address: address.trim(),
      productName: productName.trim(),
      quantity: String(quantity).trim(),
      message: String(message).trim()
    };

    const fieldMappingGuide = {
      name: ['name', 'full_name', 'customer_name'],
      companyName: ['company_name', 'companyname', 'company'],
      mobileNumber: ['mobile_number', 'mobilenumber', 'phone', 'phone_number', 'mobile'],
      email: ['email', 'email_address'],
      address: ['address', 'full_address', 'shipping_address'],
      productName: ['product_name', 'productname', 'product'],
      quantity: ['quantity', 'qty'],
      message: ['message', 'requirement_details', 'enquiry_message', 'notes', 'details']
    };

    const normalize = (str) => String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    const fieldsToSubmit = [];

    if (fieldDefs.length > 0) {
      for (const def of fieldDefs) {
        const defKeyNorm = normalize(def.key);
        const defNameNorm = normalize(def.name);

        let matchedValue = null;
        let matched = false;

        for (const [formKey, candidates] of Object.entries(fieldMappingGuide)) {
          const normCandidates = candidates.map(normalize);
          const normFormKey = normalize(formKey);

          if (
            normCandidates.includes(defKeyNorm) ||
            normCandidates.includes(defNameNorm) ||
            defKeyNorm === normFormKey ||
            defNameNorm === normFormKey
          ) {
            matchedValue = formValues[formKey];
            matched = true;
            break;
          }
        }

        if (matched) {
          fieldsToSubmit.push({
            key: def.key,
            value: matchedValue
          });
        }
      }
    }

    // Fallback: If definition query returned empty or unmatched, construct standard field keys
    if (fieldsToSubmit.length === 0) {
      fieldsToSubmit.push(
        { key: 'name', value: formValues.name },
        { key: 'company_name', value: formValues.companyName },
        { key: 'mobile_number', value: formValues.mobileNumber },
        { key: 'email', value: formValues.email },
        { key: 'address', value: formValues.address },
        { key: 'product_name', value: formValues.productName },
        { key: 'quantity', value: formValues.quantity },
        { key: 'message', value: formValues.message }
      );
    }

    // Create metaobject entry using Shopify Admin GraphQL
    const createMetaobjectMutation = `
      mutation CreateBulkOrderEnquiry($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject {
            id
            handle
            type
            fields {
              key
              value
            }
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `;

    const createResponse = await fetch(graphqlUrl, {
      method: 'POST',
      headers: graphqlHeaders,
      body: JSON.stringify({
        query: createMetaobjectMutation,
        variables: {
          metaobject: {
            type: 'bulk_order_enquiries',
            fields: fieldsToSubmit
          }
        }
      })
    });

    if (!createResponse.ok) {
      console.error('[Bulk Enquiry API] GraphQL metaobjectCreate call failed with status:', createResponse.status);
      return res.status(500).json({
        success: false,
        message: 'Unable to submit bulk order enquiry.'
      });
    }

    const createData = await createResponse.json();
    const userErrors = createData?.data?.metaobjectCreate?.userErrors || [];

    if (userErrors.length > 0) {
      console.error('[Bulk Enquiry API] Metaobject creation returned user errors:', JSON.stringify(userErrors));
      return res.status(400).json({
        success: false,
        message: 'Unable to submit bulk order enquiry.'
      });
    }

    const createdObject = createData?.data?.metaobjectCreate?.metaobject;
    if (!createdObject?.id) {
      console.error('[Bulk Enquiry API] Metaobject creation failed to return valid metaobject object.');
      return res.status(500).json({
        success: false,
        message: 'Unable to submit bulk order enquiry.'
      });
    }

    console.log('[Bulk Enquiry API] Bulk order enquiry metaobject created successfully:', createdObject.id);

    return res.status(200).json({
      success: true,
      message: 'Bulk order enquiry submitted successfully.'
    });

  } catch (err) {
    console.error('[Bulk Enquiry API] Unexpected error handling bulk order enquiry:', err.message || err);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit bulk order enquiry.'
    });
  }
}
