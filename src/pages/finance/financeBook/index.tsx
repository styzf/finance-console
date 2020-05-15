import { Button, Card, Col, Form, Input, Row, message, Modal } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { CategoryStateType } from '../../category/categoryList/model';
import CreateForm from '../../category/categoryList/components/CreateForm';
import UpdateForm from '../../category/categoryList/components/UpdateForm';
import CategoryStandardTable, {
  CategoryStandardTableColumnProps,
} from '../../category/categoryList/components/CategoryStandardTable';
import {
  CategoryListItem,
  TableListPagination,
  TableListParams,
  UpdateData,
} from '../../category/categoryList/data.d';

import styles from '../../category/categoryList/style.less';
import Link from 'umi/link';

const categoryNamespace = 'categoryListTableList';
const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface CategoryTableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  categoryListTableList: CategoryStateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  deleteModalVisible: boolean;
  selectedRows: CategoryListItem[];
  formValues: { [key: string]: string };
  deleteId: string;
  updateId: string;
  updateData: UpdateData;
}

@connect(
  ({
    categoryListTableList,
    loading,
  }: {
    categoryListTableList: CategoryStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    categoryListTableList,
    loading: loading.models.categoryListTableList,
  }),
)
class TableList extends Component<CategoryTableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    deleteModalVisible: false,
    selectedRows: [],
    formValues: {},
    deleteId: '',
    updateId: '',
    updateData: { id: '', name: '', parentId: '', categoryKey: '' },
  };

  /**
   * 列的定义
   */
  columns: CategoryStandardTableColumnProps[] = [
    {
      title: '分类名',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: text => (
        <Fragment>
          <Col span={8}>
            <Link to={`/finance/book/detail/${text.id}`}>详情</Link>
          </Col>
          <Col span={8}>
            <a onClick={() => this.handleUpdateModalVisible(true, text)}>修改</a>
          </Col>
          <Col span={8}>
            <a onClick={() => this.handleDeleteModalVisible(true, text.id)}>删除</a>
          </Col>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.handleInit();
  }

  /**
   * 传参要改成父类key比较好
   */
  handleInit() {
    const { dispatch } = this.props;
    dispatch({
      type: categoryNamespace + '/fetch',
      payload: { parentId: '11' },
    });
  }

  /**
   * 分类列表改变
   * @param pagination
   * @param filtersArg
   * @param sorter
   */
  handleCategoryStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof CategoryListItem, string[]>,
    sorter: SorterResult<CategoryListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
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
      type: categoryNamespace + '/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: categoryNamespace + '/fetch',
      payload: {},
    });
  };

  handRemove = () => {
    const { selectedRows } = this.state;
    this.handRemoveByIdOrSelected(selectedRows, '');
  };

  handRemoveById = () => {
    const { deleteId } = this.state;
    this.handRemoveByIdOrSelected([], deleteId);
  };

  handRemoveByIdOrSelected = (selectedRows: CategoryListItem[], deleteId: string) => {
    const { dispatch } = this.props;

    let categoryIds;
    if (deleteId) {
      categoryIds = [deleteId];
    } else {
      categoryIds = selectedRows.map(row => row.id);
    }

    dispatch({
      type: categoryNamespace + '/remove',
      payload: {
        categoryIds: categoryIds,
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

  handleSelectRows = (rows: CategoryListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

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
        type: categoryNamespace + '/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    if (flag) {
      const { dispatch } = this.props;
      dispatch({
        type: categoryNamespace + '/getTree',
      });
    }

    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, data?: CategoryListItem) => {
    let updateData = { id: '', name: '', parentId: '', categoryKey: '' };
    let updateId = '';
    if (data) {
      const { name, id, parentId, categoryKey } = data;
      updateData = { id: id, name: name, parentId: parentId, categoryKey: categoryKey };
      updateId = id;
    }
    this.setState({
      updateModalVisible: !!flag,
      updateId: updateId,
      updateData: updateData,
    });
  };

  handleHideDeleteModal = () => {
    this.handleDeleteModalVisible(false, '');
  };

  handleDeleteModalVisible = (flag?: boolean, id?: string) => {
    this.setState({
      deleteModalVisible: !!flag,
      deleteId: id || '',
    });
  };

  handleAdd = (fields: { name: string; parentId: number; categoryKey: string }) => {
    const { dispatch } = this.props;
    dispatch({
      type: categoryNamespace + '/add',
      payload: {
        name: fields.name,
        parentId: fields.parentId,
        categoryKey: fields.categoryKey,
      },
      callback: () => {
        this.handleInit();
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = (fields: { name: string; parentId: number; categoryKey: string }) => {
    const { dispatch } = this.props;
    const { updateId } = this.state;
    if (!updateId) {
      alert('更新失败');
    }

    dispatch({
      type: categoryNamespace + '/update',
      payload: {
        name: fields.name,
        parentId: 11,
        categoryKey: fields.categoryKey,
        id: updateId,
      },
      callback: () => {
        this.handleInit();
      },
    });

    message.success('修改成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="分类名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
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
      categoryListTableList: { data, tree },
      loading,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, updateData } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const updateMethods = {
      handleUpdate: this.handleUpdate,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };

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
            <CategoryStandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleCategoryStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} treeData={tree} />
        <UpdateForm
          {...updateMethods}
          updateModalVisible={updateModalVisible}
          data={updateData}
          treeData={tree}
        />
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

export default Form.create<CategoryTableListProps>()(TableList);
