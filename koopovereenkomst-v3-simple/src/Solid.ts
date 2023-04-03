import { fetch, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import {
  createContainerAt,
  deleteFile as deleteFileSolid,
  deleteSolidDataset,
  getContainedResourceUrlAll,
  getFile as getFileSolid,
  getSolidDataset,
  getSourceUrl,
  saveFileInContainer,
  overwriteFile,
  WithResourceInfo,
  WithServerResourceInfo,
} from "@inrupt/solid-client";


export interface SolidPerson {
  name: string | null;
  bday: Date | null;
}

export interface SolidAddress {
  streetAddress: string | null;
  locality: string | null;
  region: string | null;
  postalCode: string | null;
  countryName: string | null;
}

export function getWebId() {
  const session = getDefaultSession();
  return session.info.webId;
}

export function getRootContainerURL() {
  const webId = getWebId();
  let rootUrl = webId?.split("profile/card#me")[0];
  if (rootUrl && rootUrl.endsWith("/")) {
    rootUrl = rootUrl.slice(0, -1);
  }
  return rootUrl;
}

export async function deleteRecursively(dataset) {
  console.log(dataset);
  const containedResourceUrls = getContainedResourceUrlAll(dataset);
  const containedDatasets = await Promise.all(
    containedResourceUrls.map(async (resourceUrl) => {
      try {
        return await getSolidDataset(resourceUrl, { fetch });
      } catch (e) {
        // The Resource might not have been a SolidDataset;
        // we can delete it directly:
        await deleteFileSolid(resourceUrl, { fetch });
        return null;
      }
    })
  );
  await Promise.all(
    containedDatasets.map(async (containedDataset) => {
      if (containedDataset === null) {
        return;
      }
      return await deleteRecursively(containedDataset);
    })
  );
  return await deleteSolidDataset(dataset, { fetch });
}

export async function getFile(url: string): Promise<any> {
  return getFileSolid(url, { fetch })
}

/**
 * Wait until the file is accessible. This is needed because the file is not
 * immediately available after saving. Even though saveFile was succesful, it
 * might take several seconds before the file can be found. I'm not sure why
 * this is the case. Another option would be to return the savedFile content
 * and process that. But that would require more changes to the code.
 */
async function watchFileAccessible(savedFileUrl: string): Promise<void> {

  let fileFound = false;
  let maxTries = 60;

  const container = savedFileUrl.split('/').slice(0, -1).join('/') + '/';

  while (!fileFound && maxTries > 0) {
    await getSolidDataset(container, { fetch })
      .then((dataset) => {
        const containedResourceUrls = getContainedResourceUrlAll(dataset);

        containedResourceUrls.findIndex((resourceUrl) => {
          if (resourceUrl === savedFileUrl) {
            fileFound = true;
          }
        });
      })

    maxTries--;
    if (!fileFound) {
      console.log("File not available yet, waiting a bit...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

async function saveFile(filepath: string, blob: Blob, contentType: string, waitUntilAvailable = false): Promise<string> {
  await createContainerIfNotExistsForFile(filepath);

  let savedFile: WithResourceInfo;
  try {
    savedFile = await overwriteFile(filepath, blob, { contentType, fetch });
    console.log(`File saved at ${getSourceUrl(savedFile)}`);
  } catch (error) {
    console.error(error);
  }

  return getSourceUrl(savedFile);
}

export async function saveJson(filepath: string, json: any, waitUntilAvailable = false): Promise<string> {
  console.log("json stringify credential", json);
  const blob = new Blob([JSON.stringify(json, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  const savedFile = await saveFile(filepath, blob, "application/ld+json", waitUntilAvailable);
  if (savedFile && waitUntilAvailable) {
    await watchFileAccessible(savedFile);
  }

  return savedFile;
};

export async function saveTurtle(filepath: string, text: string, waitUntilAvailable = true): Promise<string> {
  console.log("turtle file", text);
  const blob = new Blob([text], { type: "text/turtle" });

  const savedFile = await saveFile(filepath, blob, "text/turtle", waitUntilAvailable);
  if (savedFile && waitUntilAvailable) {
    await watchFileAccessible(savedFile);
  }

  return savedFile;
};

export async function deleteFile(url: string): Promise<void> {
  return deleteFileSolid(url, { fetch })
}

export async function getAllFileUrls(containerUrl: string): Promise<string[]> {
  if (!containerUrl.endsWith("/")) {
    containerUrl = containerUrl + "/";
  }

  let things: string[] = [];
  try {
    const container = await getSolidDataset(containerUrl, { fetch });
    things = getContainedResourceUrlAll(container);
  } catch (error) {
    // getSolidDataset throws an error if the container does not exist
    return [];
  }

  return things;
}

async function createContainerIfNotExistsForFile(filepath: string): Promise<void> {
  const containerUrl = filepath.split('/').slice(0, -1).join('/') + '/';
  try {
    await getSolidDataset(containerUrl, { fetch });
  } catch (error) {
    await createContainerAt(containerUrl, { fetch });
  }
}