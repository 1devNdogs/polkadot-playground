// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';
import { createProductionRelays } from './productionRelays';
import { createTesting } from './testing';

 
export { CUSTOM_ENDPOINT_KEY } from './development';

export function createWsEndpoints (t: TFunction): LinkOption[] {
  return [
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.live.relay', 'Live relays & parachains', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createProductionRelays(t),
    {
      isDevelopment: true,
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.dev', 'Development', { ns: 'apps-config-acala' }),
      textBy: '',
      value: ''
    },
    ...createTesting(t)
  ].filter(({ isDisabled }) => !isDisabled);
}
