import AWS from 'aws-sdk';

export async function loadCredential(): Promise<void> {
  const awsConfigOptions = {
    region: 'ap-northeast-2',
  };

  AWS.config.update(awsConfigOptions);

  if (AWS.config.credentials) {
    console.log('credentials loaded');
    return;
  }

  AWS.config.credentials = new AWS.TokenFileWebIdentityCredentials(
    awsConfigOptions,
  );

  return new Promise((resolve, reject) => {
    AWS.config.getCredentials((err) => {
      if (err) {
        console.error(`Failed to configure AWS credential.`, err);
        reject();
      } else {
        console.log('credentials loaded from token');
        resolve();
      }
    });
  });
}
