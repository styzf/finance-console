import {Form, Input} from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, {KeyboardEvent} from 'react';
import {UpdateFinanceParams} from "@/pages/finance/financeList/data";

interface FinanceFormProps extends FormComponentProps {
  text : number;
  year : number;
  month : number;
  day : number;
  categoryId : string;
  onPressEnterCallBack: (params:UpdateFinanceParams) => void;
  disabled ?: boolean;
}

const FinanceForm: React.FC<FinanceFormProps> = props => {
  const { form, text , year , month , day, categoryId, onPressEnterCallBack, disabled} = props;

  const onPressEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    let money = form.getFieldValue('value');
    onPressEnterCallBack({year, month, day, categoryId, money});
    form.resetFields(['value']);
  };

  return (<div>{form.getFieldDecorator('value', {
      initialValue: text ? text : '',
    })(<Input placeholder="请输入"
              type={'number'}
              onPressEnter={onPressEnter}
              disabled={disabled}
       />)}</div>);
};

export default Form.create<FinanceFormProps>()(FinanceForm);
