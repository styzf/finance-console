import {Button, Card, Col, Form, Input, Row, message, Modal} from 'antd';
import React, {Component, Fragment} from 'react';

import {Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {SorterResult} from 'antd/es/table';
import {connect} from 'dva';
import {RoleStateType} from './model';
// import CreateForm from './components/CreateForm';
// import UpdateForm from './components/UpdateForm';
// import RoleStandardTable, {
//   RoleStandardTableColumnProps,
// } from './components/RoleTable';

import {RoleListItem, TableListPagination, TableListParams, UpdateData} from './data.d';

import StandardTable, {
  StandardTableColumnProps,
} from '../../components/StandardTable';

import styles from './style.less';
import {CategoryStateType} from "@/pages/category/categoryList/model";

const namespace = 'RoleListTableList';
const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface RoleTableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  RoleListTableList: RoleStateType;
  categoryListTableList: CategoryStateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  deleteModalVisible: boolean;
  selectedRows: RoleListItem[];
  formValues: { [key: string]: string };
  deleteId: string;
  updateId: string;
  updateData: UpdateData;
}

@connect(
  ({
     RoleListTableList,
     categoryListTableList,
     loading,
   }: {
    RoleListTableList: RoleStateType;
    categoryListTableList: CategoryStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    RoleListTableList,
    categoryListTableList,
    loading: loading.models.RoleListTableList,
  }),
)
class TableList extends Component<RoleTableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    deleteModalVisible: false,
    selectedRows: [],
    formValues: {},
    deleteId: '',
    updateId: '',
    updateData: {id: '', name: '', Rolename: ''},
  };

  /**
   * 列的定义
   */
    // columns: RoleStandardTableColumnProps[] = [
  columns: StandardTableColumnProps<RoleListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '账户名',
      dataIndex: 'Rolename',
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

  handleRoleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Partial<Record<keyof RoleListItem, string[]>>,
    sorter: SorterResult<RoleListItem>,
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

  handRemoveByIdOrSelected = (selectedRows: RoleListItem[], deleteId: string) => {
    const {dispatch} = this.props;

    let RoleIds;
    if (deleteId) {
      RoleIds = [deleteId];
    } else {
      RoleIds = selectedRows.map(row => row.id);
    }

    dispatch({
      type: namespace + '/remove',
      payload: {
        RoleIds: RoleIds,
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

  handleSelectRows = (rows: RoleListItem[]) => {
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

  // handleUpdateModalVisible = (flag?: boolean, data?: RoleListItem) => {
  //   if (flag) {
  //     const {dispatch} = this.props;
  //     dispatch({
  //       type: namespace + '/getTree',
  //     });
  //   }
  //
  //   let updateData = {id: '', name: '', parentId: '', RoleKey: ''};
  //   let updateId = '';
  //   if (data) {
  //     const {name, id, parentId, RoleKey} = data;
  //     updateData = {id: id, name: name, parentId: parentId, RoleKey: RoleKey};
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

  // handleAdd = (fields: { email: string,
  //   name: string,
  //   RoleName: string ,
  //   password: string,
  //   password2: string,
  //   phone: string }) => {
  //   const {dispatch} = this.props;
  //   dispatch({
  //     type: namespace + '/add',
  //     payload: {
  //       name: fields.name,
  //       email: fields.email,
  //       RoleName: fields.RoleName,
  //       password: fields.password,
  //       password2: fields.password2,
  //       phone: fields.phone,
  //     },
  //     callback: () => {
  //       this.handleInit();
  //     },
  //   });
  //
  //   message.success('添加成功');
  //   this.handleModalVisible();
  // };

  // handleUpdate = (fields: { name: string; parentId: number; RoleKey: string }) => {
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
  //       RoleKey: fields.RoleKey,
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
              {getFieldDecorator('Rolename')(<Input placeholder="请输入"/>)}
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
      RoleListTableList: {data},
      loading,
    } = this.props;

    // const {selectedRows, modalVisible, updateModalVisible, updateData} = this.state;
    const { selectedRows} = this.state;

    // const parentMethods = {
    //   handleAdd: this.handleAdd,
    //   handleModalVisible: this.handleModalVisible,
    // };

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
              onChange={this.handleRoleStandardTableChange}
            />
            {/*<RoleStandardTable*/}
            {/*selectedRows={selectedRows}*/}
            {/*loading={loading}*/}
            {/*data={data}*/}
            {/*columns={this.columns}*/}
            {/*onSelectRow={this.handleSelectRows}*/}
            {/*onChange={this.handleRoleStandardTableChange}*/}
            {/*/>*/}
          </div>
        </Card>
       {/* <CreateForm {...parentMethods} modalVisible={modalVisible}/>*/}
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

export default Form.create<RoleTableListProps>()(TableList);
