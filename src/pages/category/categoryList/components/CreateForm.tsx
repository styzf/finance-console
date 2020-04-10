import {Form, Input, Modal, TreeSelect} from 'antd';

import {FormComponentProps} from 'antd/es/form';
import React from 'react';
import {TreeNode} from "antd/es/tree-select";

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: { name: string, parentId: number, categoryKey: string }) => void;
  handleModalVisible: () => void;
  treeData: TreeNode[];
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const {modalVisible, form, handleAdd, handleModalVisible} = props;
  let {treeData} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const onChange = (value: string) => {
    form.setFieldsValue(value);
  };
  if (!treeData || treeData.length === 0) {
    treeData = [{title: 'root', value: '0', key: '0'}];
  }

  return (
    <Modal
      destroyOnClose
      title="新建分类"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="分类名">
        {form.getFieldDecorator('name', {
          rules: [{required: true, message: '请输入至少两个个字符的规则描述！', min: 2}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="分类关键key">
        {form.getFieldDecorator('categoryKey', {
          rules: [{required: true, message: '请输入至少两个个字符的关键key描述！', min: 2}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="分类父id">
        {form.getFieldDecorator('parentId', {
          initialValue: treeData[0].value,
        })
        (<TreeSelect
          style={{width: 300}}
          dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
          treeData={treeData}
          placeholder="Please select"
          treeDefaultExpandAll
          onChange={onChange}
        />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
