import {Form, Input, Modal, TreeSelect} from 'antd';

import {FormComponentProps} from 'antd/es/form';
import React from 'react';
import {TreeNode} from "antd/es/tree-select";

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: { menuName: string, code: string, pId: string}) => void;
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
      title="新建角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="权限名">
        {form.getFieldDecorator('menuName', {
          rules: [{required: false}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="权限代码">
        {form.getFieldDecorator('code', {
          rules: [{required: false}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="分类父id">
        {form.getFieldDecorator('pId', {
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
