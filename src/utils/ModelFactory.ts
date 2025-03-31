import { CreateOGC3DTilesModelOptions } from '@luciad/ria/model/tileset/OGC3DTilesModel';
import { BingMapsTileSetModel } from '@luciad/ria/model/tileset/BingMapsTileSetModel';

interface CreateOGC3DTilesModelOptionsBingmaps extends CreateOGC3DTilesModelOptions {
  imagerySet?: string;
  token?: string;
  useproxy?: unknown;
}

class ModelFactory {
  public static createBingmapsModel(command: CreateOGC3DTilesModelOptionsBingmaps) {
    return new Promise<BingMapsTileSetModel>((resolve, reject) => {
      let options = { ...command };
      if (typeof options === 'undefined') {
        options = {
          imagerySet: '',
          token: '',
        };
      }
      let template =
        'https://dev.virtualearth.net/REST/v1/Imagery/Metadata/%MAPID%?key=%TOKEN%&include=ImageryProviders';
      if (options.useproxy) {
        const proxyURL = 'Enter Bingmaps proxy here';
        template = proxyURL + '/%MAPID%';
      }
      let requestStr = template.replace('%MAPID%', options.imagerySet);
      requestStr = requestStr.replace('%TOKEN%', options.token);

      ModelFactory.GET_JSON(requestStr).then(
        (response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              let resource;
              if (data.resourceSets[0] && data.resourceSets[0].resources[0]) {
                resource = data.resourceSets[0].resources[0];
                // Serve tiles over https://
                if (resource.imageUrl.indexOf('http://ecn.') > -1) {
                  resource.imageUrl = resource.imageUrl.replace('http:', 'https:');
                }
                if (resource.imageUrl.indexOf('http://ak.dynamic.') > -1) {
                  resource.imageUrl = resource.imageUrl.replace('{subdomain}.', '');
                  resource.imageUrl = resource.imageUrl.replace('http://', 'https://{subdomain}.ssl.');
                }
                resource.brandLogoUri = data.brandLogoUri;
              } else {
                resource = data;
              }
              const model = new BingMapsTileSetModel(resource);
              resolve(model);
            });
          } else {
            const reason = {
              type: 'error',
              message: 'Failed to create layer. Bing Maps service unreachable',
            };
            reject(reason);
          }
        },
        () => {
          const reason = { type: 'error', message: 'Failed to create layer. Bing Maps service unreachable' };
          reject(reason);
        },
      );
    });
  }

  private static GET_JSON(url: string) {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    } as unknown;
    return fetch(url, requestOptions);
  }
}

export { ModelFactory };
