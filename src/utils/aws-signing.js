import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { Sha256 } from '@aws-crypto/sha256-browser';

const region = 'us-east-1';
const service = 'execute-api';

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

    const url = new URL(path, 'https://zafokk1i96.execute-api.us-east-1.amazonaws.com');
    console.log('Signing request for URL:', url.toString());
    
    const request = new HttpRequest({
      hostname: url.hostname,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        host: url.hostname
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const signedRequest = await signer.sign(request);
    console.log('Signed headers:', signedRequest.headers);
    return signedRequest.headers;
  } catch (error) {
    console.error('Error signing request:', error);
    throw error;
  }
} 