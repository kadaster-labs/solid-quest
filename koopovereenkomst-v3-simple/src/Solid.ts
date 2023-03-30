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

export function getTargetContainerURL() {
  const session = getDefaultSession();
  const webId = session.info.webId;
  const SELECTED_POD = webId?.split("profile/card#me")[0];
  return `${SELECTED_POD}`;
}

// Hier komt de overige Solid functionaliteit
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

export async function getFile(url) {
  return getFileSolid(url, { fetch })
}

export async function saveJson(filename: string, json: any, waitUntilAvailable = false) {
  await createContainerIfNotExists();

  // Upload file into the targetContainer.
  console.log("json stringify credential", json);
  const blob = new Blob([JSON.stringify(json, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  let savedFile: WithResourceInfo;
  try {
    savedFile = await overwriteFile(
      `${getTargetContainerURL()}${filename}`, // Container URL
      blob, // File
      { contentType: "application/ld+json", fetch }
    );
    console.log(`File saved at ${getSourceUrl(savedFile)}`);
  } catch (error) {
    console.error(error);
  }

  if (savedFile && waitUntilAvailable) {
    let available = false;
    let maxTries = 20;
    while (!available && maxTries > 0) {
      try {
        await getFileSolid(getSourceUrl(savedFile), { fetch });
        available = true;
        maxTries--;
      } catch (error) {
        console.log("File not available yet");

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  return savedFile;
};

export async function saveText(filename: string, text: string, waitUntilAvailable = false) {
  await createContainerIfNotExists();

  // Upload file into the targetContainer.
  console.log("json stringify credential", text);
  const blob = new Blob([text], { type: "plain/turtle" });

  let savedFile: WithResourceInfo;
  try {
    savedFile = await overwriteFile(
      `${getTargetContainerURL()}${filename}`, // Container URL
      blob, // File
      { contentType: "text/turtle", fetch }
    );
    console.log(`File saved at ${getSourceUrl(savedFile)}`);
  } catch (error) {
    console.error(error);
  }

  if (savedFile && waitUntilAvailable) {
    let available = false;
    let maxTries = 20;
    while (!available && maxTries > 0) {
      try {
        await getFileSolid(getSourceUrl(savedFile), { fetch });
        available = true;
        maxTries--;
      } catch (error) {
        console.log("File not available yet");

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  return savedFile;
};

export async function deleteFile(url) {
  return deleteFileSolid(url, { fetch })
}

export async function getAllFileUrls(containerUrl) {
  const url = `${getTargetContainerURL()}${containerUrl}/`;
  console.log("url", url);
  const container = await getSolidDataset(url, { fetch });
  const things = getContainedResourceUrlAll(container);
  return things;
}

async function createContainerIfNotExists() {
  // Create Container to place Things in
  try {
    await getSolidDataset(getTargetContainerURL(), { fetch });
  } catch (error) {
    await createContainerAt(getTargetContainerURL(), { fetch });
  }
}