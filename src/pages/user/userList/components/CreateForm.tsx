import {Form, Input, Modal} from 'antd';

import {FormComponentProps} from 'antd/es/form';
import React from 'react';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: { email: string,
    name: string,
    userName: string ,
    password: string,
    password2: string,
    phone: string}) => void;
  handleModalVisible: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const {modalVisible, form, handleAdd, handleModalVisible} = props;
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
      title="新建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="邮箱">
        {form.getFieldDecorator('email', {
          rules: [{required: false}],
        })(<Input placeholder="请输入，后面加上正则校验"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="用户名">
        {form.getFieldDecorator('name', {
          rules: [{required: false}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="账号名">
        {form.getFieldDecorator('userName', {
          rules: [{required: true, message: '请输入至少两个字符的账号名！', min: 2}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="密码">
        {form.getFieldDecorator('password', {
          rules: [{required: true, message: '请输入至少两个字符的密码！后面改成正则匹配', min: 2}],
        })(<Input.Password placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="确认密码">
        {form.getFieldDecorator('password2', {
          rules: [{required: true, message: '请输入至少两个字符的密码！后面改成正则匹配', min: 2}],
        })(<Input.Password placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="手机号码">
        {form.getFieldDecorator('phone', {
          rules: [{required: false}],
        })(<Input placeholder="请输入，暂时不做校验"/>)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
