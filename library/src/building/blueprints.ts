/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {Promise} from 'es6-promise';

import BuildingBlueprint from './classes/BuildingBlueprint';
import client from '../core/client';
import events  from '../events';
import * as restApi from '../restapi/RestAPI';

let blueprintsLoaded: boolean = false;
let blueprintsRequested: boolean = false;
const blueprintsList: BuildingBlueprint[] = [];

function loadBlueprints() {
  client.OnNewBlueprint((index: number, name: string) => {
    //special case, this is not a real blueprint
    if (name == "Small Control Island")
      return;

    const blueprint = new BuildingBlueprint({
      index: index,
      name: name,
    } as BuildingBlueprint);

    blueprintsList.push(blueprint);

    if (blueprintsLoaded)
      events.fire(events.clientEventTopics.handlesBlueprints, { blueprints: blueprintsList })

  });

  client.RequestBlueprints();
}

function requestBlueprintCopy() {
  client.CopyBlueprint();
}

function requestBlueprintPaste() {
  client.PasteBlueprint();
}

function requestBlueprintDelete(blueprint: BuildingBlueprint) {
  //no feedback on this delete, we just call it and cross our fingers
  client.DeleteLocalBlueprint(blueprint.name);

  //there is no client.OnDeleteBlueprint
  //so we will just remove the blueprint and hope the delete really worked
  for (let index = 0; index <= blueprintsList.length; index++) {
    const bp: BuildingBlueprint = blueprintsList[index]
    if (bp.name == blueprint.name) {
      blueprintsList.splice(index, 1);
      events.fire(events.clientEventTopics.handlesBlueprints, { blueprints: blueprintsList })
      return;
    }
  }
}

function requestBlueprintSave(name: string) {
  client.SaveBlueprint(name);
}

function requestBlueprintSelect(blueprint: BuildingBlueprint) {
  client.SelectBlueprint(blueprint.index);
  events.fire(events.clientEventTopics.handlesBlueprintSelect, { blueprint: blueprint })
}

function requestBlueprintIcon(blueprint: BuildingBlueprint) {
  restApi.getBlueprintIcon(blueprint.index).then((icon: string): void => {
    blueprint.icon = icon;
    events.fire(events.clientEventTopics.handlesBlueprints, { blueprints: blueprintsList })
  }, (): void => {
    events.fire(events.clientEventTopics.handlesBlueprints, { blueprints: blueprintsList })
  })
}

function requestBlueprints(): Promise<BuildingBlueprint[]> {
  if (!blueprintsRequested) {
    blueprintsRequested = false;
    loadBlueprints();
  }

  return new Promise<BuildingBlueprint[]>(
    (resolve: (subs: BuildingBlueprint[]) => void, reject: (error: string) => void) => {
      if (blueprintsLoaded) {
        resolve(blueprintsList);
      } else {
        //we have no way of knowing when the blueprints are done loading since 
        //the blueprint load uses the OnNewBlueprint mechanism
        //we are setting this arbitrary timeout to avoid re-rendering the list 100s of times on startup
        setTimeout(() => {
          blueprintsLoaded = true;
          resolve(blueprintsList);
          events.fire(events.clientEventTopics.handlesBlueprints, { blueprints: blueprintsList })
        }, 2000);
      }
    }
  );
}

export {
requestBlueprints, requestBlueprintIcon, requestBlueprintSelect,
requestBlueprintSave, requestBlueprintDelete,
requestBlueprintCopy, requestBlueprintPaste
};
