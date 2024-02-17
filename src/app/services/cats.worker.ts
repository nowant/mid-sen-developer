/// <reference lib="webworker" />

import { CatUtils, catGetParamsUtils, catUtils } from '../utils';

interface WebWorkerMessage {
  strategies: CatUtils[];
  params: any;
}

addEventListener('message', (event: MessageEvent<WebWorkerMessage>) => {
  const { strategies, params } = event.data;

  if (!Array.isArray(strategies)) {
    return;
  }

  const hasArrayParams = Array.isArray(params);
  let output!: unknown;

  for (const strategy of strategies) {
    if (hasArrayParams) {
      output = catUtils[strategy].apply(null, params as []);
      break;
    }

    const { filter } = params;
    const entities = output || params.entities;
    const invokeParams = [
      entities,
      ...(catGetParamsUtils[strategy]?.call(null, filter as never) || []),
    ];

    output = catUtils[strategy].apply(null, invokeParams as []);
  }

  postMessage(output);
});
