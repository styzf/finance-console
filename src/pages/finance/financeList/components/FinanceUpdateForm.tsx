import {Form, Input, Modal,} from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import {UpdateFinanceRemarkParams} from "@/pages/finance/financeList/data";

const FormItem = Form.Item;

interface FinanceUpdateFormProps extends FormComponentProps {
  updateModalVisible: boolean;
  handleUpdate: (remark: string) => void;
  handleUpdateModalVisible: (flag?: boolean, params?: UpdateFinanceRemarkParams) => void;
  data: UpdateFinanceRemarkParams;
}
const CreateForm: React.FC<FinanceUpdateFormProps> = props => {
  const { updateModalVisible, form, handleUpdate, handleUpdateModalVisible, data } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue.remark);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="添加备注"
      visible={updateModalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remark', {
          rules: [{ required: true, message: '备注最多不可以超过20个字符！', max: 20 }],
          initialValue:data.remark,
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<FinanceUpdateFormProps>()(CreateForm);
