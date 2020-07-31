import { Tree } from 'antd';
import React, { Component} from 'react';

// import { MenuListItem } from '../../data.d';
import {AntTreeNodeExpandedEvent, AntTreeNodeSelectedEvent} from "antd/lib/tree";
import {TreeNode} from "antd/es/tree-select";

const { TreeNode } = Tree;

export interface MenuTreeProp {
  categoryTreeData : Array<TreeNode>;
  /**
   * 展开或收回几点时候触发
   * @param expandedKeys 分类id
   * @param info
   */
  handleOnExpand: (expandedKeys: string[], info?: AntTreeNodeExpandedEvent) => void | PromiseLike<void>;
  /**
   * 选中节点的时候触发
    * @param selectedKeys
   * @param e
   */
  handleOnSelect: (selectedKeys: string[], e: AntTreeNodeSelectedEvent) => void;
}

interface MenuTreeState {
  expandedKeys: string[],
  searchValue: string,
  autoExpandParent: boolean,
  dataList:Array<TreeNode>;
}

class MenuTree extends Component<MenuTreeProp, MenuTreeState> {


  constructor(props: MenuTreeProp) {
    super(props);

    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      dataList:[],
    };
  }

  onExpand = (expandedKeys:string[]) => {
    const { handleOnExpand } = this.props;
    handleOnExpand(expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const { categoryTreeData, handleOnSelect } = this.props;
    const loop = (data:Array<TreeNode>) =>
      data.map(item => {
        // @ts-ignore
        const index = item.title.indexOf(searchValue);
        // @ts-ignore
        const beforeStr = item.title.substr(0, index);
        // @ts-ignore
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return (
            // @ts-ignore
            <TreeNode key={item.key} title={title} >
              {
                // @ts-ignore
                loop(item.children)
              }
            </TreeNode>
          );
        }
        // @ts-ignore
        return <TreeNode key={item.key} title={title} />;
      });
    return (
      <div>
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={handleOnSelect}
        >
          {loop(categoryTreeData)}
        </Tree>
      </div>
    );
  }
}

export default MenuTree;
