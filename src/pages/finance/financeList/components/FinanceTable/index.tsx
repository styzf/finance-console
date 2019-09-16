import {Table, DatePicker, Tooltip, Icon, Button} from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import React, {Component} from 'react';

import {FinanceTableListItem, UpdateFinanceParams, UpdateFinanceRemarkParams} from '../../data.d';
import styles from './index.less';
import {Moment} from "moment";
import FinanceForm from '../FinanceForm';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface FinanceTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  data: {
    list: FinanceTableListItem[];
  };
  initData: (year: number,month: number) => void;
  // 每个单元格按下确认后的回调函数
  onPressEnterCallBack: (params:UpdateFinanceParams) => void;
  updateRemarkModalVisible: (flag?: boolean, params?: UpdateFinanceRemarkParams) => void;
}

export interface FinanceTableColumnProps extends ColumnProps<FinanceTableListItem>{}

interface FinanceTableState {
  selectedRowKeys: string[];
  columns: FinanceTableColumnProps[];
}

class FinanceTable extends Component<FinanceTableProps<FinanceTableListItem>, FinanceTableState> {

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
    fixed: 'left',
  },
  {
    title: '财务子分类',
    width: 100,
    dataIndex: 'childCategoryName',
    fixed: 'left',
  }];

  rightColumn :FinanceTableColumnProps[] = [{
    title: '涨幅汇总数据',
    fixed: 'right',
    width: 100,
    dataIndex: 'sum',
    render: (text, record, index) => {
      if (text) {
        return text.money.toFixed(2);
      }
      return "";
    }
  }];

  /**
   * 初始化列
   * 每次选择时间改变也会执行该方法
   * @param year
   * @param month
   */
  initColumns = (year:number , month:number) => {
    const {onPressEnterCallBack, updateRemarkModalVisible} = this.props;
    let lastDay = new Date(year, month, 0).getDate();
    let colList =  new Array<FinanceTableColumnProps>();
    colList.push(...this.leftColumn);

    for (let i = 0 ;i < lastDay; i++) {
      colList.push({
        title: year + '年' + month + '月' + (i + 1) +'日',
        dataIndex: i + 1 + '',
        key: i + 1 + '' ,
        width: 200,
        /**
         * 返回一个输入框
         * @param text 值
         * @param record 一行的对象
         * @param index 第几行
         */
        render: (text, record, index) => {
          let x = 0;
          let y = 0;
          let money = 0;
          let remark = '';
          if (record[i+1] && record[i+1].money) {
            x = record[i+1].money;
          }
          if (record[i] && record[i].money) {
            y = record[i].money;
          }
          if (text) {
            money = text.money;
            remark = text.remark;
          }
          if (record.disabled) {
            return (<div style={{width:'250px'}}>
                <div style={{width:'150px',float:'left'}}>
                  <FinanceForm year={year}
                               month={month}
                               day={i + 1}
                               categoryId={record.categoryId}
                               text={money.toFixed(2)}
                               onPressEnterCallBack={onPressEnterCallBack}
                               disabled={record.disabled}
                  />
                </div>
              </div>
              );
          }

          const params:UpdateFinanceRemarkParams = {year: year,
            month:month, day: i+1 ,categoryId: record.categoryId, remark: remark};

          return (<div style={{width:'250px'}}>
                    <div style={{width:'150px',float:'left'}}>
                      <FinanceForm year={year}
                                   month={month}
                                   day={i + 1}
                                   categoryId={record.categoryId}
                                   text={money.toFixed(2)}
                                   onPressEnterCallBack={onPressEnterCallBack}
                                   disabled={record.disabled}
                      />
                    </div>

                    <div className={styles.iconDiv}>
                        <Tooltip title={(x - y).toFixed(2)} >
                          <Icon type="info-circle" style={{margin : '0px 0px 0px 10px'}}/>
                        </Tooltip>
                        <Tooltip title={remark}>
                          <Button icon={'plus-circle'} shape="circle" type={"link"} size={"small"}
                                  onClick={() => updateRemarkModalVisible(true, params)}/>
                        </Tooltip>
                    </div>
                  </div>);
          }
        });
    }

    colList.push(...this.rightColumn);
    return colList;
  };

  onClickUpdateRemark = () => {
    const {
      updateRemarkModalVisible,
    } = this.props;
    updateRemarkModalVisible(true, {});
  }

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
