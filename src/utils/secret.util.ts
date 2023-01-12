import AWS from 'aws-sdk';

export async function loadSecret(secretName: string): Promise<string> {
  try {
    const secretsManager = new AWS.SecretsManager({ apiVersion: '2017-10-17' });
    const data = await secretsManager
      .getSecretValue({ SecretId: secretName })
      .promise();
    return data.SecretString;
  } catch (error) {
    throw new Error(`Failed to get Secret[${secretName}]`);
  }
}
