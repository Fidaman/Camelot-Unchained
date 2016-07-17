/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {events} from 'camelot-unchained';
import faker from './requester_fake';

const assign = require('object-assign');

const CHANGE_MODE = 'building/mode/CHANGE_MODE';

const win: any = window;
const fake: boolean = (win.cuAPI == null);

function setMode(mode: number) {
  return {
    type: CHANGE_MODE,
    mode: mode,
  }
}

export function initializeBuilding(dispatch: any) {
  events.addListener(events.clientEventTopics.handlesBuildingMode, (info: { mode: number }) => {
    dispatch(setMode(info.mode));
  });
}

export interface BuildingState {
  mode?: number;
}

const initialState = {
  mode: 1
}

export default function reducer(state: BuildingState = initialState, action: any = {}) {
  switch (action.type) {
    case CHANGE_MODE:
      return assign({}, state, { mode: action.mode });
    default: return state;
  }
}
