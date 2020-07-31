import {Button, Card, Col, Form, Input, Row, message, Modal} from 'antd';
import React, {Component, Fragment} from 'react';

import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {SorterResult} from 'antd/es/table';
import {connect} from 'dva';
import {PermissionStateType} from './model';
import CreateForm from './components/CreateForm';
// import UpdateForm from './components/UpdateForm';
// import PermissionStandardTable, {
//   PermissionStandardTableColumnProps,
// } from './components/PermissionTable';

import {PermissionListItem, TableListPagination, TableListParams, UpdateData} from './data.d';

import StandardTable, {
  StandardTableColumnProps,
} from '../../components/StandardTable';

import styles from './style.less';
import {CategoryStateType} from "@/pages/category/categoryList/model";

const namespace = 'PermissionListTableList';
const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface PermissionTableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  PermissionListTableList: PermissionStateType;
  categoryListTableList: CategoryStateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  deleteModalVisible: boolean;
  selectedRows: PermissionListItem[];
  formValues: { [key: string]: string };
  deleteId: string;
  updateId: string;
  updateData: UpdateData;
}

@connect(
  ({
     PermissionListTableList,
     categoryListTableList,
     loading,
   }: {
    PermissionListTableList: PermissionStateType;
    categoryListTableList: CategoryStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    PermissionListTableList,
    categoryListTableList,
    loading: loading.models.PermissionListTableList,
  }),
)
class TableList extends Component<PermissionTableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    deleteModalVisible: false,
    selectedRows: [],
    formValues: {},
    deleteId: '',
    updateId: '',
    updateData: {id: '', name: '', Permissionname: ''},
  };

  /**
   * 列的定义
   */
    // columns: PermissionStandardTableColumnProps[] = [
  columns: StandardTableColumnProps<PermissionListItem>[] = [
    {
      title: '权限名称',
      dataIndex: 'menuName',
    },
    {
      title: '权限代码',
      dataIndex: 'code',
    },
    {
      title: '按钮级别',
      render: text => (
        <div>
          {text.isMenu === '1' ? '是' : '否'}
        </div>
      )
    },
    {
      title: '状态',
      render: text => (
        <div>
          {text.status === '1' ? '启用' : '禁用'}
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: text => (
        <Fragment>
          {/* <Col span={12}>
            <a onClick={() => this.handleUpdateModalVisible(true, text)}>修改</a>
          </Col>*/}
          <Col span={12}>
            <a onClick={() => this.handleDeleteModalVisible(true, text.id)}>删除</a>
          </Col>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.handleInit();
  }

  handleInit() {
    const {dispatch} = this.props;
    dispatch({
      type: namespace + '/tree',
    });
    dispatch({
      type: namespace + '/fetch',
    });
  }

  handlePermissionStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Partial<Record<keyof PermissionListItem, string[]>>,
    sorter: SorterResult<PermissionListItem>,
  ) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      page: pagination.current,
      size: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: namespace + '/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: namespace + '/fetch',
      payload: {},
    });
  };

  handRemove = () => {
    const {selectedRows} = this.state;
    this.handRemoveByIdOrSelected(selectedRows, '');
  };

  handRemoveById = () => {
    const {deleteId} = this.state;
    this.handRemoveByIdOrSelected([], deleteId);
  };

  handRemoveByIdOrSelected = (selectedRows: PermissionListItem[], deleteId: string) => {
    const {dispatch} = this.props;

    let PermissionIds;
    if (deleteId) {
      PermissionIds = [deleteId];
    } else {
      PermissionIds = selectedRows.map(row => row.id);
    }

    dispatch({
      type: namespace + '/remove',
      payload: {
        PermissionIds: PermissionIds,
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        this.handleInit();
      },
    });

    message.success('删除成功');
    this.handleHideDeleteModal();
  };

  handleSelectRows = (rows: PermissionListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: namespace + '/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  // handleUpdateModalVisible = (flag?: boolean, data?: PermissionListItem) => {
  //   if (flag) {
  //     const {dispatch} = this.props;
  //     dispatch({
  //       type: namespace + '/getTree',
  //     });
  //   }
  //
  //   let updateData = {id: '', name: '', parentId: '', PermissionKey: ''};
  //   let updateId = '';
  //   if (data) {
  //     const {name, id, parentId, PermissionKey} = data;
  //     updateData = {id: id, name: name, parentId: parentId, PermissionKey: PermissionKey};
  //     updateId = id;
  //   }
  //   this.setState({
  //     updateModalVisible: !!flag,
  //     updateId: updateId,
  //     updateData: updateData,
  //   });
  // };
  //
  handleHideDeleteModal = () => {
    this.handleDeleteModalVisible(false, '');
  };

  handleDeleteModalVisible = (flag?: boolean, id?: string) => {
    this.setState({
      deleteModalVisible: !!flag,
      deleteId: id || '',
    });
  };

  handleAdd = (fields: {menuName: string,
    code: string, pId: string}) => {
    const {dispatch} = this.props;
    dispatch({
      type: namespace + '/add',
      payload: {
        menuName: fields.menuName,
        code: fields.code,
        status: 1,
        pid: fields.pId
      },
      callback: () => {
        this.handleInit();
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  // handleUpdate = (fields: { name: string; parentId: number; PermissionKey: string }) => {
  //   const {dispatch} = this.props;
  //   const {updateId} = this.state;
  //   if (!updateId) {
  //     alert('更新失败');
  //   }
  //
  //   dispatch({
  //     type: namespace + '/update',
  //     payload: {
  //       name: fields.name,
  //       parentId: fields.parentId,
  //       PermissionKey: fields.PermissionKey,
  //       id: updateId,
  //     },
  //     callback: () => {
  //       this.handleInit();
  //     },
  //   });
  //
  //   message.success('修改成功');
  //   this.handleUpdateModalVisible();
  // };

  renderSimpleForm() {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={4} sm={24}>
            <FormItem label="权限名称">
              {getFieldDecorator('menuName')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="权限代码">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      PermissionListTableList: {data, tree},
      loading,
    } = this.props;

    // const {selectedRows, modalVisible, updateModalVisible, updateData} = this.state;
    const {modalVisible, selectedRows} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    // const updateMethods = {
    //   handleUpdate: this.handleUpdate,
    //   handleUpdateModalVisible: this.handleUpdateModalVisible,
    // };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handRemove}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handlePermissionStandardTableChange}
            />
            {/*<PermissionStandardTable*/}
            {/*selectedRows={selectedRows}*/}
            {/*loading={loading}*/}
            {/*data={data}*/}
            {/*columns={this.columns}*/}
            {/*onSelectRow={this.handleSelectRows}*/}
            {/*onChange={this.handlePermissionStandardTableChange}*/}
            {/*/>*/}
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} treeData={tree}/>
       {/* <UpdateForm
          {...updateMethods}
          updateModalVisible={updateModalVisible}
          data={updateData}
          treeData={tree}
        />*/}
        <Modal
          title="确认框"
          visible={this.state.deleteModalVisible}
          onOk={this.handRemoveById}
          onCancel={this.handleHideDeleteModal}
        >
          确认要删除吗？
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<PermissionTableListProps>()(TableList);
