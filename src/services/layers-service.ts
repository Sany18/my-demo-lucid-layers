import { Layers } from "consts/Layers";

let signedUrl: string;

const getSignedUrl = async (assetId: number) => {
  const apiUrl = 'https://api.dev.port-ai.de/api';

  return fetch(`${apiUrl}/file-transfer/download-signed-url/${assetId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => data as { signedUrl: string });
}

const signUrl = async (url: string) => {
  if (signedUrl) return signedUrl;

  return getSignedUrl(1)
    .then(data => {
      signedUrl = data.signedUrl;

      const fileUrl = data.signedUrl.replace('*fileName*', encodeURIComponent(url));
      console.log('Signed URL:', fileUrl);
      return signedUrl;
    })
    .catch(error => {
      console.error('Error fetching signed URL:', error);
      throw error;
    });
};

export const getLayers = async (): Promise<any[]> => {
  const signedLayers = [];

  return new Promise(async (resolve) => {
    Object.values(Layers).forEach(async (layerInfo: any) => {

      if (layerInfo.url) {
        layerInfo.url = await signUrl(layerInfo.url);
        console.log(layerInfo.url);
      }

      signedLayers.push(layerInfo);
    });

    resolve(signedLayers);
  });
}
