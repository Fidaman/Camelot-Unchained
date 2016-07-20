/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {events, BuildingBlock, BuildingMaterial} from 'camelot-unchained';

import MaterialsByType from '../../lib/MaterialsByType';
import {selectFromMaterial, selectToMaterial} from './materials-replace';
import requester from './requester';

const assign = require('object-assign');

const SELECT_MATERIAL = 'buildpanel/panes/SELECT_MATERIAL';
const SELECT_BLOCK = 'buildpanel/panes/SELECT_BLOCK';

const SET_MATERIALS = 'buildpanel/panes/SET_MATERIALS';

const DEFAULT_MATERIAL: BuildingMaterial = {
  id: -1,
  icon: '',
  tags: ['default'],
  blocks: []
} as BuildingMaterial;

export function loadMaterials(dispatch: (action: any) => void) {
  
  requester.loadMaterials();

  events.addListener(events.clientEventTopics.handlesBlocks, (info: { materials: BuildingMaterial[] }) => {
    const mats: BuildingMaterial[] = info.materials;
    dispatch(setMaterials(mats))
    dispatch(selectFromMaterial(mats[0]))
    dispatch(selectToMaterial(mats[0]))
  });

  events.addListener(events.clientEventTopics.handlesBlockSelect, (info: { material: BuildingMaterial, block: BuildingBlock }) => {
    dispatch(selectBlock(info.block));
    dispatch(selectFromMaterial(info.material));
  });

}

export function requestBlockChange(block: BuildingBlock) {
  requester.changeBlockSelection(block);
}

export function requestMaterialChange(material: BuildingMaterial, shapeId: number) {
  const block: BuildingBlock = getBlockForShapeId(shapeId, material.blocks);
  requester.changeBlockSelection(block);
}


function selectBlock(block: BuildingBlock) {
  return {
    type: SELECT_BLOCK,
    selectedBlock: block
  }
}

function selectMaterial(material: BuildingMaterial) {
  return {
    type: SELECT_MATERIAL,
    selectedMaterial: material
  }
}

function setMaterials(materials: BuildingMaterial[]) {
  return {
    type: SET_MATERIALS,
    materials: materials
  }
}

function getMaterialById(matId: number, materials: BuildingMaterial[]) {
  for (let m in materials) {
    if (materials[m].id === matId) {
      return materials[m];
    }
  }
  return materials[0] || DEFAULT_MATERIAL;
}

function getBlockForShapeId(shapeId: number, blocks: BuildingBlock[]) {
  for (let i in blocks) {
    const block = blocks[i];
    if (block.shapeId === shapeId) {
      return block;
    }
  }
  return blocks[0];
}

export interface MaterialsState {
  materials?: BuildingMaterial[];
  selectedMaterial?: BuildingMaterial;
  selectedBlock: BuildingBlock;
  materialsByType: MaterialsByType;
}

const initialState: MaterialsState = {
  materials: [],
  selectedMaterial: DEFAULT_MATERIAL,
  selectedBlock: {} as BuildingBlock,
  materialsByType: new MaterialsByType([])
}

export default function reducer(state: MaterialsState = initialState, action: any = {}) {
  switch (action.type) {
    case SET_MATERIALS:
      return assign({}, state, {
        materials: action.materials,
        materialsByType: new MaterialsByType(action.materials),
        selectedMaterial: action.materials[0],
        selectedBlock: action.materials[0].blocks[0]
      });
    case SELECT_MATERIAL:
      return assign({}, state, {
        selectedMaterial: action.selectedMaterial,
      });
    case SELECT_BLOCK:
      const block: BuildingBlock = action.selectedBlock;
      const newState: MaterialsState = { selectedBlock: block } as MaterialsState
      if (state.selectedMaterial.id != block.materialId)
        newState.selectedMaterial = getMaterialById(block.materialId, state.materials);
      return assign({}, state, newState);
    default: return state;
  }
}
