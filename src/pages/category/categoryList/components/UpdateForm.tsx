import {Form, Input, Modal, TreeSelect} from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import {UpdateData} from "@/pages/category/categoryList/data";
import {TreeNode} from "antd/es/tree-select";

const FormItem = Form.Item;

interface UpdateFormProps extends FormComponentProps {
  updateModalVisible: boolean;
  handleUpdate: (fieldsValue: { name: string, parentId: number, categoryKey:string, }) => void;
  handleUpdateModalVisible: () => void;
  data: UpdateData;
  treeData: TreeNode[];
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

  let {treeData} = props;

  const onChange = (value:string) => {
    form.setFieldsValue(value);
  };
  if (! treeData || treeData.length === 0) {
    treeData = [{title:'root', value:'0',key:'0'}];
  }

  return (
    <Modal
      destroyOnClose
      title="修改分类"
      visible={updateModalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少两个字符的规则描述！', min: 2 }],
          initialValue:data.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类关键key">
        {form.getFieldDecorator('categoryKey', {
          rules: [{ required: true, message: '请输入至少两个字符的关键key描述！', min: 2 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类父id">
        {form.getFieldDecorator('parentId', {
          initialValue:data.parentId,
        })
        (<TreeSelect
          style={{ width: 300 }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="Please select"
          treeDefaultExpandAll
          onChange={onChange}
        />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<UpdateFormProps>()(CreateForm);
