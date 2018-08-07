'use strict';

import { createDbTable } from './model/book';
import { startServer } from './lib/server';

createDbTable()
  .then(() => {
    startServer();
  });
