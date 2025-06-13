export const Layers = {
  BINGMAPS: {
    "type": "BING_MAP_LAYER",
    "uri": "https://dev.virtualearth.net/REST/v1/Imagery/Metadata/Aerial?key=AugjqbGwtwHP0n0fUtpZqptdgkixBt5NXpfSzxb7q-6ATmbk-Vs4QnqiW6fhaV-i&include=ImageryProviders",
    "layerOptions": {
      "id": "BINGMAP_WMS_LAYER",
      "label": "BingMap"
    },
    "parentId": "WMS_LAYER_GROUP"
  },
  BUILDINGS: {
    "id": "3016",
    "type": "OGC_3D_TILES_LAYER",
    "url": "area_g-31da606b-2278-4161-9b9f-a289e0a7e7b7/tileset.json",
    "modelOptions": {
      "requestParameters": {
        "Policy": "eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMWlwNHMzZWRzcTEyci5jbG91ZGZyb250Lm5ldC9hc3NldHMvMS8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzQ5NzM4Njc2fX19XX0_",
        "Key-Pair-Id": "K1BZY9JFZ3D68K",
        "Signature": "Cwga~FCwV6SScCqK1BOrfbnAxsNdD1rTF5uSyb0l4svdWXvaSw4QyDl0jRrZsbpVVmj1JLRQKRYOCMdb2CZlI6jskLCP8w2wnAoDekF9O8lRCbnWWI2SHo9kA0VeZ2yrLLtk1zQDJVXN45U9NigK0dASjxlnKdEdFMHB~9jx546qnRjw0hVtpRjZq6wOrpRuh3ddvsIX3g~~E5ZwKPTyoq0mYqcsJzoDa9vlNj~pGXtY1l2jLQA44576M2NOo9r57pz7OSUE4GBsXNs5HCY~giEoF7jUUEHx5tCyZgZ9oPEQJoqGMLZD7le8n-JR9I9azwzNXVduIffadC67iJdMug__"
      }
    },
    "layerOptions": {
      "id": "3016",
      "label": "area_g",
      "transparency": false,
      "loadingStrategy": 1,
      "offsetTerrain": false,
      "offsetTransformation": {
        "x": 0,
        "y": 0,
        "z": 0
      }
    },
    "autoZoom": false,
    "parentId": "ASSETS_LAYER_GROUP"
  },
  MOUNTAINS: {
    "id": "3017",
    "type": "OGC_3D_TILES_LAYER",
    "url": "elevation-82ca09e4-7bb6-4be9-9079-d6ce69841091/tileset.json",
    "modelOptions": {
      "requestParameters": {
        "Policy": "eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMWlwNHMzZWRzcTEyci5jbG91ZGZyb250Lm5ldC9hc3NldHMvMS8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzQ5NzM4Njc2fX19XX0_",
        "Key-Pair-Id": "K1BZY9JFZ3D68K",
        "Signature": "Cwga~FCwV6SScCqK1BOrfbnAxsNdD1rTF5uSyb0l4svdWXvaSw4QyDl0jRrZsbpVVmj1JLRQKRYOCMdb2CZlI6jskLCP8w2wnAoDekF9O8lRCbnWWI2SHo9kA0VeZ2yrLLtk1zQDJVXN45U9NigK0dASjxlnKdEdFMHB~9jx546qnRjw0hVtpRjZq6wOrpRuh3ddvsIX3g~~E5ZwKPTyoq0mYqcsJzoDa9vlNj~pGXtY1l2jLQA44576M2NOo9r57pz7OSUE4GBsXNs5HCY~giEoF7jUUEHx5tCyZgZ9oPEQJoqGMLZD7le8n-JR9I9azwzNXVduIffadC67iJdMug__"
      }
    },
    "layerOptions": {
      "id": "3017",
      "label": "elevation",
      "transparency": false,
      "loadingStrategy": 1,
      "offsetTerrain": false,
      "offsetTransformation": {
        "x": 0,
        "y": 0,
        "z": 0
      }
    },
    "autoZoom": false,
    "parentId": "ASSETS_LAYER_GROUP"
  },
  UNDERWATER_POINTCLOUD: {
    "id": "3018",
    "type": "OGC_3D_TILES_LAYER",
    "url": "ground-3e9d655a-fc78-4799-bfaf-0dd816bffa32/tileset.json",
    "modelOptions": {
      "requestParameters": {
        "Policy": "eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMWlwNHMzZWRzcTEyci5jbG91ZGZyb250Lm5ldC9hc3NldHMvMS8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzQ5NzM4Njc2fX19XX0_",
        "Key-Pair-Id": "K1BZY9JFZ3D68K",
        "Signature": "Cwga~FCwV6SScCqK1BOrfbnAxsNdD1rTF5uSyb0l4svdWXvaSw4QyDl0jRrZsbpVVmj1JLRQKRYOCMdb2CZlI6jskLCP8w2wnAoDekF9O8lRCbnWWI2SHo9kA0VeZ2yrLLtk1zQDJVXN45U9NigK0dASjxlnKdEdFMHB~9jx546qnRjw0hVtpRjZq6wOrpRuh3ddvsIX3g~~E5ZwKPTyoq0mYqcsJzoDa9vlNj~pGXtY1l2jLQA44576M2NOo9r57pz7OSUE4GBsXNs5HCY~giEoF7jUUEHx5tCyZgZ9oPEQJoqGMLZD7le8n-JR9I9azwzNXVduIffadC67iJdMug__"
      }
    },
    "layerOptions": {
      "id": "3018",
      "label": "ground",
      "transparency": false,
      "loadingStrategy": 1,
      "offsetTerrain": false,
      "offsetTransformation": {
        "x": 0,
        "y": 0,
        "z": 0
      }
    },
    "autoZoom": false,
  },
  OVERWATER_POINTCLOUD: {
    "id": "3019",
    "type": "OGC_3D_TILES_LAYER",
    "url": "Area_G-05aadad9-feba-4540-873f-a238fe5147d3/tileset.json",
    "modelOptions": {
      "requestParameters": {
        "Policy": "eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMWlwNHMzZWRzcTEyci5jbG91ZGZyb250Lm5ldC9hc3NldHMvMS8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzQ5NzM4Njc2fX19XX0_",
        "Key-Pair-Id": "K1BZY9JFZ3D68K",
        "Signature": "Cwga~FCwV6SScCqK1BOrfbnAxsNdD1rTF5uSyb0l4svdWXvaSw4QyDl0jRrZsbpVVmj1JLRQKRYOCMdb2CZlI6jskLCP8w2wnAoDekF9O8lRCbnWWI2SHo9kA0VeZ2yrLLtk1zQDJVXN45U9NigK0dASjxlnKdEdFMHB~9jx546qnRjw0hVtpRjZq6wOrpRuh3ddvsIX3g~~E5ZwKPTyoq0mYqcsJzoDa9vlNj~pGXtY1l2jLQA44576M2NOo9r57pz7OSUE4GBsXNs5HCY~giEoF7jUUEHx5tCyZgZ9oPEQJoqGMLZD7le8n-JR9I9azwzNXVduIffadC67iJdMug__"
      }
    },
    "layerOptions": {
      "id": "3019",
      "label": "Area_G",
      "transparency": false,
      "loadingStrategy": 1,
      "offsetTerrain": false,
      "offsetTransformation": {
        "x": 0,
        "y": 0,
        "z": 0
      }
    },
    "autoZoom": false,
  }
}
