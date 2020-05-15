import { Card, Form } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { FinanceStateType } from './model';
import FinanceTable from './components/FinanceTable';
import {
  FinanceTableListItem,
  TableListPagination,
  TableListParams,
  UpdateFinanceParams,
  UpdateFinanceRemarkParams,
} from './data.d';

import styles from './style.less';
import FinanceUpdateForm from '@/pages/finance/financeList/components/FinanceUpdateForm';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  financeTableList: FinanceStateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  selectedRows: FinanceTableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<FinanceTableListItem>;
  updateRemarkParams: UpdateFinanceRemarkParams;
}

@connect(
  ({
    financeTableList,
    loading,
  }: {
    financeTableList: FinanceStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    financeTableList,
    loading: loading.models.category,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    updateRemarkParams: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'financeTableList/fetch',
    });
  }

  handleFinanceTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Partial<Record<keyof FinanceTableListItem, string[]>>,
    sorter: SorterResult<FinanceTableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'financeTableList/fetch',
      payload: params,
    });
  };

  initData = (year: number, month: number) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'financeTableList/fetch',
      payload: { year, month },
    });
  };

  onPressEnterCallBack = (params: UpdateFinanceParams) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'financeTableList/update',
      payload: params,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, params: UpdateFinanceRemarkParams = {}) => {
    this.setState({
      updateModalVisible: !!flag,
      updateRemarkParams: params,
    });
  };

  /**
   * 更新备注
   * @param remark
   */
  handleUpdateRemark = (remark: string) => {
    const { dispatch } = this.props;
    let { updateRemarkParams } = this.state;
    updateRemarkParams.remark = remark;
    dispatch({
      type: 'financeTableList/addRemark',
      payload: updateRemarkParams,
    });
    this.handleUpdateModalVisible;
  };

  render() {
    const {
      financeTableList: { data },
      loading,
    } = this.props;

    const { updateModalVisible, updateRemarkParams } = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <FinanceTable
              loading={loading}
              data={data}
              onChange={this.handleFinanceTableChange}
              initData={this.initData}
              onPressEnterCallBack={this.onPressEnterCallBack}
              updateRemarkModalVisible={this.handleUpdateModalVisible}
            />
            <FinanceUpdateForm
              updateModalVisible={updateModalVisible}
              handleUpdate={this.handleUpdateRemark}
              handleUpdateModalVisible={this.handleUpdateModalVisible}
              data={updateRemarkParams}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
