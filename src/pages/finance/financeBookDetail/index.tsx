import { Button, Card, Col, Form, Input, Row, message, Modal } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { FinanceStateType } from './model';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import FinanceStandardTable, {
  FinanceStandardTableColumnProps,
} from './components/FinanceStandardTable';
import { FinanceBookItem, TableListPagination, TableListParams, UpdateData } from './data.d';

import styles from './style.less';
import { Moment } from 'moment';

const namespace = 'financeBook';
const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface FinanceTableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  financeBook: FinanceStateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  deleteModalVisible: boolean;
  selectedRows: FinanceBookItem[];
  formValues: { [key: string]: string };
  deleteId: string;
  updateId: string;
  updateData: UpdateData;
  categoryId: string;
}

@connect(
  ({
    financeBook,
    loading,
  }: {
    financeBook: FinanceStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    financeBook,
    loading: loading.models.financeList,
  }),
)
class TableList extends Component<FinanceTableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    deleteModalVisible: false,
    selectedRows: [],
    formValues: {},
    deleteId: '',
    updateId: '',
    updateData: { id: '' },
    categoryId: '',
  };

  /**
   * 列的定义
   */
  columns: FinanceStandardTableColumnProps[] = [
    {
      title: '金额',
      dataIndex: 'money',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
    },
    {
      title: '说明',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: text => (
        <Fragment>
          <Col span={12}>
            <a onClick={() => this.handleUpdateModalVisible(true, text)}>修改</a>
          </Col>
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
    const { dispatch } = this.props;
    // @ts-ignore
    this.state.categoryId = this.props.match.params.id;
    dispatch({
      type: namespace + '/fetch',
      payload: { categoryId: this.state.categoryId },
    });
  }

  handleFinanceStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Partial<Record<keyof FinanceBookItem, string[]>>,
    sorter: SorterResult<FinanceBookItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues, categoryId } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      page: pagination.current,
      size: pagination.pageSize,
      categoryId: categoryId,
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
    const { form, dispatch } = this.props;
    const { categoryId } = this.state;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: namespace + '/fetch',
      payload: { categoryId: categoryId },
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

  handRemoveByIdOrSelected = (selectedRows: FinanceBookItem[], deleteId: string) => {
    const { dispatch } = this.props;

    let ids;
    if (deleteId) {
      ids = [deleteId];
    } else {
      ids = selectedRows.map(row => row.id);
    }

    dispatch({
      type: namespace + '/remove',
      payload: {
        ids: ids,
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

  handleSelectRows = (rows: FinanceBookItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    const { categoryId } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        categoryId: categoryId,
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

  handleUpdateModalVisible = (flag?: boolean, data?: FinanceBookItem) => {
    let updateData: UpdateData = { id: '' };
    let updateId = '';
    if (data) {
      const { id, year, month, day, remark, money } = data;
      updateData = { id: id, year: year, month: month, day: day, remark: remark, money: money };
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

  handleAdd = (fields: { money: number; remark: string; createTime: Moment }) => {
    const { dispatch } = this.props;
    const { categoryId } = this.state;
    dispatch({
      type: namespace + '/add',
      payload: {
        money: fields.money,
        remark: fields.remark,
        year: fields.createTime.year(),
        month: fields.createTime.month() + 1,
        day: fields.createTime.date(),
        categoryId: categoryId,
      },
      callback: () => {
        this.handleInit();
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = (fields: UpdateData) => {
    const { dispatch } = this.props;
    const { updateId } = this.state;
    if (!updateId) {
      alert('更新失败');
    }

    dispatch({
      type: namespace + '/update',
      payload: {
        ...fields,
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
            <FormItem label="备注">
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
      financeBook: { data },
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
            <FinanceStandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleFinanceStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <UpdateForm {...updateMethods} updateModalVisible={updateModalVisible} data={updateData} />
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

export default Form.create<FinanceTableListProps>()(TableList);
