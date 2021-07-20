// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Routes } from './types';

import accounts from './accounts';
import explorer from './explorer';

export default function create (t: TFunction): Routes {
  return [
    accounts(t),
    explorer(t),
  ];
}
