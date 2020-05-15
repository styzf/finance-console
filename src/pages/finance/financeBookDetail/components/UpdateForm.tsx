import { Form, Input, InputNumber, Modal } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { UpdateData } from '@/pages/finance/financeBookDetail/data';

const FormItem = Form.Item;

interface UpdateFormProps extends FormComponentProps {
  updateModalVisible: boolean;
  handleUpdate: (fieldsValue: UpdateData) => void;
  handleUpdateModalVisible: () => void;
  data: UpdateData;
}
const CreateForm: React.FC<UpdateFormProps> = props => {
  const { updateModalVisible, form, handleUpdate, handleUpdateModalVisible, data } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="修改账单"
      visible={updateModalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名">
        {form.getFieldDecorator('money', {
          rules: [{ required: true, message: '请输入金额！' }],
          initialValue: data.money,
        })(<InputNumber min={0} placeholder="请输入" />)}
      </FormItem>
      {/*<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类关键key">*/}
      {/*{form.getFieldDecorator('createDate', {*/}
      {/*rules: [{ required: true, message: '请选择日期！' }],*/}
      {/*initialValue:data.id,*/}
      {/*})(<DatePicker/>)}*/}
      {/*</FormItem>*/}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注说明">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false }],
          initialValue: data.remark,
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<UpdateFormProps>()(CreateForm);
