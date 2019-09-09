import { Table,DatePicker } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import React, {Component} from 'react';

import {FinanceTableListItem, UpdateFinanceParams} from '../../data.d';
import styles from './index.less';
import {Moment} from "moment";
import FinanceForm from '../FinanceForm';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface FinanceTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  data: {
    list: FinanceTableListItem[];
  };
  selectedRows: FinanceTableListItem[];
  onSelectRow: (rows: any) => void;
  initData: (year: number,month: number) => void;
  // 每个单元格按下确认后的回调函数
  onPressEnterCallBack: (params:UpdateFinanceParams) => void;
}

export interface FinanceTableColumnProps extends ColumnProps<FinanceTableListItem>{}

interface FinanceTableState {
  selectedRowKeys: string[];
  columns: FinanceTableColumnProps[];
}

class FinanceTable extends Component<FinanceTableProps<FinanceTableListItem>, FinanceTableState> {
  static getDerivedStateFromProps(nextProps: FinanceTableProps<FinanceTableListItem>) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      return {
        selectedRowKeys: [],
      };
    }
    return null;
  }

  // 构建的时候就要把columns给创建出来
  constructor(props: FinanceTableProps<FinanceTableListItem>) {
    super(props);
    let today = new Date();
    this.state = {
      selectedRowKeys: [],
      columns: this.initColumns(today.getFullYear(), today.getMonth() + 1)
    };
  }

  leftColumn :FinanceTableColumnProps[] = [{
    title: '财务分类',
    width: 100,
    dataIndex: 'categoryName',
    key: 'categoryName',
    fixed: 'left',
  },
  {
    title: '财务子分类',
    width: 100,
    dataIndex: 'childCategoryName',
    key: 'childCategoryName',
    fixed: 'left',
  }];

  rightColumn :FinanceTableColumnProps[] = [{
    title: 'Action',
    key: 'categoryId',
    fixed: 'right',
    width: 100,
    render: () => <a>action</a>,
  }];

  /**
   * 初始化列
   * 每次选择时间改变也会执行该方法
   * @param year
   * @param month
   */
  initColumns = (year:number , month:number) => {
    const {onPressEnterCallBack} = this.props;
    let lastDay = new Date(year, month, 0).getDate();
    let colList =  new Array<FinanceTableColumnProps>();
    colList.push(...this.leftColumn);

    for (let i = 0 ;i < lastDay; i++) {
      colList.push({
        title: year + '年' + month + '月' + (i + 1) +'日',
        dataIndex: i + 1 + '',
        key: i + 1 + '' ,
        width: 150,
        /**
         * 返回一个输入框
         * @param text 值
         * @param record 一行的对象
         * @param index 第几行
         */
        render: (text, record, index) => {
          return (<FinanceForm year={year}
                               month={month}
                               day={i + 1}
                               categoryId={record.categoryId}
                               text={text}
                               onPressEnterCallBack={onPressEnterCallBack}
                               disabled={record.disabled}
                      />);
          }
        });
    }

    colList.push(...this.rightColumn);
    return colList;
  };

  onChange = (date:Moment | null, dateString:string) => {
    if (!date) {
      return;
    }
    const {initData} = this.props;
    initData(date.year(), date.month() + 1);
    this.setState({
      selectedRowKeys: [],
      columns: this.initColumns(date.year(), date.month() + 1)
    })
  };

  render() {
    const { data } = this.props;
    const { columns } = this.state;
    const { list = []} = data || {};
    const { MonthPicker} = DatePicker;
    let today = new Date();
    return (
      <div className={styles.financeTable}>
        <MonthPicker onChange={this.onChange}
                     placeholder={today.getFullYear() + '-' + (today.getMonth() + 1)}
                     allowClear={true} />
        <Table columns={columns}
               dataSource={list}
               scroll={{ x: 1500, y: 400 }}
               pagination={false}
               size={"small"}
               rowKey={'categoryId'}
        />
      </div>
    );
  }
}

export default FinanceTable;
