import { createContext, useContext } from 'react';

import { checkIfWebIDIsReady } from './mosService';
import { Signing } from './verifiable/signing';

class Verkoper {
  private _webId: string;
  public signing?: Signing;

  constructor(webId: string) {
    this._webId = webId;
    this.signing = new Signing();
  }

  public async isReadyForDemo(): Promise<boolean> {
    return await checkIfWebIDIsReady(this._webId);
  }
}

// Create a context to hold the shared object
const VerkoperContext = createContext(null as Verkoper);

// Custom hook to access the shared object
const useVerkoper = () => useContext(VerkoperContext);

// Wrapper component to provide the shared object
const VerkoperProvider = ({ children, verkoper }) => (
  <VerkoperContext.Provider value={verkoper}>
    {children}
  </VerkoperContext.Provider>
);

export { Verkoper, useVerkoper, VerkoperProvider };
