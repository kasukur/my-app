import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { Sha256 } from '@aws-crypto/sha256-browser';

const region = 'us-east-1';
const service = 'execute-api';
const apiId = 'zafokk1i96';
const stage = 'prod';

export const API_URL = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`;

const getCredentials = () => {
  const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials not found in environment variables');
  }

  return {
    accessKeyId,
    secretAccessKey
  };
};

export async function signRequest(method, path, body = undefined) {
  try {
    const credentials = getCredentials();
    console.log('Using credentials:', {
      accessKeyId: credentials.accessKeyId.substring(0, 5) + '...',
      hasSecret: !!credentials.secretAccessKey
    });

    const signer = new SignatureV4({
      credentials,
      region,
      service,
      sha256: Sha256
    });

    // Ensure path starts with a slash but doesn't include the stage
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const apiPath = `/${stage}${cleanPath}`;
    
    const request = new HttpRequest({
      hostname: `${apiId}.execute-api.${region}.amazonaws.com`,
      path: apiPath,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined
    });

    console.log('Signing request:', {
      url: `https://${request.hostname}${request.path}`,
      method: request.method,
      body: request.body
    });

    const signedRequest = await signer.sign(request);
    
    // Remove headers that can't be set by the browser
    delete signedRequest.headers.host;
    
    console.log('Signed headers:', signedRequest.headers);

    return signedRequest.headers;
  } catch (error) {
    console.error('Error signing request:', error);
    throw error;
  }
} 