import {Button, Card, Col, Form, Input, Row, message, Modal} from 'antd';
import React, {Component, Fragment} from 'react';

import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {SorterResult} from 'antd/es/table';
import {connect} from 'dva';
import {UserStateType} from './model';
import CreateForm from './components/CreateForm';
// import UpdateForm from './components/UpdateForm';
// import UserStandardTable, {
//   UserStandardTableColumnProps,
// } from './components/UserTable';

import {UserListItem, TableListPagination, TableListParams, UpdateData} from './data.d';

import StandardTable, {
  StandardTableColumnProps,
} from '../../components/StandardTable';

import styles from './style.less';
import {CategoryStateType} from "@/pages/category/categoryList/model";

const namespace = 'userListTableList';
const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface UserTableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  userListTableList: UserStateType;
  categoryListTableList: CategoryStateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  deleteModalVisible: boolean;
  selectedRows: UserListItem[];
  formValues: { [key: string]: string };
  deleteId: string;
  updateId: string;
  updateData: UpdateData;
}

@connect(
  ({
     userListTableList,
     categoryListTableList,
     loading,
   }: {
    userListTableList: UserStateType;
    categoryListTableList: CategoryStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userListTableList,
    categoryListTableList,
    loading: loading.models.userListTableList,
  }),
)
class TableList extends Component<UserTableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    deleteModalVisible: false,
    selectedRows: [],
    formValues: {},
    deleteId: '',
    updateId: '',
    updateData: {id: '', name: '', username: ''},
  };

  /**
   * 列的定义
   */
    // columns: UserStandardTableColumnProps[] = [
  columns: StandardTableColumnProps<UserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '账户名',
      dataIndex: 'userName',
    },
    {
      title: '性别',
      render: text => (
        <div>
          {text.sex === '1' ? '男' : '女'}
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
      type: namespace + '/fetch',
    });
  }

  handleUserStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Partial<Record<keyof UserListItem, string[]>>,
    sorter: SorterResult<UserListItem>,
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

  handRemoveByIdOrSelected = (selectedRows: UserListItem[], deleteId: string) => {
    const {dispatch} = this.props;

    let userIds;
    if (deleteId) {
      userIds = [deleteId];
    } else {
      userIds = selectedRows.map(row => row.id);
    }

    dispatch({
      type: namespace + '/remove',
      payload: {
        userIds: userIds,
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

  handleSelectRows = (rows: UserListItem[]) => {
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
    if (flag) {
      const {dispatch} = this.props;
      dispatch({
        type: 'categoryListTableList/getTree',
        payload: {parentId : 12}
      });
    }

    this.setState({
      modalVisible: !!flag,
    });
  };

  // handleUpdateModalVisible = (flag?: boolean, data?: UserListItem) => {
  //   if (flag) {
  //     const {dispatch} = this.props;
  //     dispatch({
  //       type: namespace + '/getTree',
  //     });
  //   }
  //
  //   let updateData = {id: '', name: '', parentId: '', userKey: ''};
  //   let updateId = '';
  //   if (data) {
  //     const {name, id, parentId, userKey} = data;
  //     updateData = {id: id, name: name, parentId: parentId, userKey: userKey};
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

  handleAdd = (fields: { email: string,
    name: string,
    userName: string ,
    password: string,
    password2: string,
    phone: string }) => {
    const {dispatch} = this.props;
    dispatch({
      type: namespace + '/add',
      payload: {
        name: fields.name,
        email: fields.email,
        userName: fields.userName,
        password: fields.password,
        password2: fields.password2,
        phone: fields.phone,
      },
      callback: () => {
        this.handleInit();
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  // handleUpdate = (fields: { name: string; parentId: number; userKey: string }) => {
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
  //       userKey: fields.userKey,
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
            <FormItem label="用户名">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="账户名">
              {getFieldDecorator('username')(<Input placeholder="请输入"/>)}
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
      userListTableList: {data},
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
              onChange={this.handleUserStandardTableChange}
            />
            {/*<UserStandardTable*/}
            {/*selectedRows={selectedRows}*/}
            {/*loading={loading}*/}
            {/*data={data}*/}
            {/*columns={this.columns}*/}
            {/*onSelectRow={this.handleSelectRows}*/}
            {/*onChange={this.handleUserStandardTableChange}*/}
            {/*/>*/}
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
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

export default Form.create<UserTableListProps>()(TableList);
