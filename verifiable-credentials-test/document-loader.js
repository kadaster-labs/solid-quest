/*
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
*/
'use strict';

import axios, * as others from 'axios';

export const documentLoader = async url => {
  const {data: document} = await axios.get(url);
  return {
    contextUrl: null,
    document,
    documentUrl: url,
  };
};