import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {addCategory, queryCategory, removeCategory, updateCategory,getCategoryTree} from './service';

import { TableListData, TreeData} from './data.d';
import {TreeNode} from "antd/es/tree-select";

export interface CategoryStateType {
  data: TableListData;
  tree: TreeNode[];
}

export interface CategoryStateData {
  data: TableListData;
}

export interface TreeDataList {
  tree: TreeNode[];
}

export type CategoryEffect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: CategoryStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: {data:TableListData,tree:TreeNode[]};
  effects: {
    fetch: CategoryEffect;
    getTree: CategoryEffect;
    add: CategoryEffect;
    remove: CategoryEffect;
    update: CategoryEffect;
  };
  reducers: {
    save: Reducer<CategoryStateData>;
    saveTree: Reducer<TreeDataList>;
  };
}

/**
 * 递归树查询
 * @param children
 */
function getChildren(children:Array<TreeData>){
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
      title: treeData.name,
      children: childrenTree,
    };
    tree.push(treeNode);
  }
  return tree;
}

const CategoryModel: ModelType = {
  namespace: 'categoryListTableList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    tree:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCategory, payload);
      // if (payload.name && response.data.content) {
      //   let list = response.data.content;
      //   list.forEach((data:CategoryListItem) => {
      //     const searchValue = payload.name;
      //     let name = data.name;
      //     const index = name.indexOf(searchValue);
      //     const beforeStr = name.substr(0, index);
      //     const afterStr = name.substr(index + searchValue.length);
      //     data.name = beforeStr + '<span style="color:#f50;">' + searchValue + '</span>' + afterStr;
      //   })
      // }
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
    *getTree({ payload }, { call, put }) {
      const response = yield call(getCategoryTree, payload);
      let treeDataList = response.data.childList;

      let tree = getChildren(treeDataList);

      yield put({
        type: 'saveTree',
        payload: tree,
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield call(addCategory, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeCategory, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateCategory, payload);
      if (callback) callback();
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

export default CategoryModel;
