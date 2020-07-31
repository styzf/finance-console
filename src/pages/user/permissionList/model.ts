import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {addPermission, queryPermission, removePermission, updatePermission, queryPermissionTree} from './service';

import {MenuTreeData, TableListData} from './data.d';
import {TreeNode} from "antd/es/tree-select";
import {TreeDataList} from "@/pages/category/categoryList/model";

export interface PermissionStateType {
  data: TableListData;
  tree: TreeNode[];
}

export interface PermissionStateData {
  data: TableListData;
}

export interface TreeDataList {
  tree: TreeNode[];
}

export type PermissionEffect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: PermissionStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: {data:TableListData};
  effects: {
    fetch: PermissionEffect;
    add: PermissionEffect;
    remove: PermissionEffect;
    update: PermissionEffect;
    tree: PermissionEffect;
  };
  reducers: {
    save: Reducer<PermissionStateData>;
    saveTree: Reducer<TreeDataList>;
  };
}

/**
 * 递归树查询
 * @param children
 */
function getChildren(children:Array<MenuTreeData>){
  let tree = new Array<TreeNode>();
  for (let treeData of children) {
    let childList = treeData.childList;
    let childrenTree = new Array<TreeNode>();
    if (childList) {
      childrenTree = getChildren(childList);
    }
    let treeNode:TreeNode = {
      value: treeData.id,
      key: treeData.id,
      title: treeData.menuName,
      children: childrenTree,
    };
    tree.push(treeNode);
  }
  return tree;
}

const PermissionModel: ModelType = {
  namespace: 'PermissionListTableList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPermission, payload);
      yield put({
        type: 'save',
        payload: {
          list:response.data.content,
          pagination: {
            total: Number.parseFloat(response.data.totalElements),
            current: response.data.page,
          },
        },
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield call(addPermission, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removePermission, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updatePermission, payload);
      if (callback) callback();
    },
    *tree({ payload, callback }, { call, put }) {
      const response = yield call(queryPermissionTree, payload);
      if (! response.data) {
        return;
      }
      let treeDataList = response.data.childList;

      let tree = getChildren(treeDataList);

      yield put({
        type: 'saveTree',
        payload: tree,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveTree(state, action) {
      return {
        ...state,
        tree: action.payload,
      };
    },
  },
};

export default PermissionModel;
