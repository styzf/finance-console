import { Form, Input, Modal, InputNumber, DatePicker } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { Moment } from 'moment';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: { money: number; remark: string; createTime: Moment }) => void;
  handleModalVisible: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新建分类"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="金额">
        {form.getFieldDecorator('money', {
          rules: [{ required: true, message: '请输入金额！' }],
        })(<InputNumber min={0} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="时间">
        {form.getFieldDecorator('createTime', {
          rules: [{ required: true, message: '请选择日期' }],
        })(<DatePicker />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注说明">
        {form.getFieldDecorator('remark', {})(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
