/// <reference lib="webworker" />

import { CatUtils, catUtils } from '../utils';

interface Message {
  strategy: CatUtils;
  params: never[];
}

addEventListener('message', (event: MessageEvent<Message>) => {
  const { strategy, params } = event.data;

  if (typeof catUtils[strategy] !== 'function') {
    return;
  }

  const output: unknown[] = catUtils[strategy].apply(null, params as []);
  postMessage(output);
});
