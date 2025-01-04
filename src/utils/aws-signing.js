import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { Sha256 } from '@aws-crypto/sha256-browser';

const region = 'us-east-1';
const service = 'execute-api';

// Use environment variables or AWS Cognito credentials in production
const credentials = {
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
};

export async function signRequest(method, path, body = undefined) {
  const signer = new SignatureV4({
    credentials,
    region,
    service,
    sha256: Sha256
  });

  const url = new URL(path, 'https://zafokk1i96.execute-api.us-east-1.amazonaws.com');
  
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
  return signedRequest.headers;
} 