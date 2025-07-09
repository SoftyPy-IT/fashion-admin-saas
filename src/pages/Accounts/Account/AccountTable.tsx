import { ProTable } from "@ant-design/pro-components";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Tooltip, Row, Col } from "antd";
import { useState } from "react";
import CreateAccountForm from "./CreateAccountForm";

const AccountTable = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleView = (record: any) => {
    console.log("View:", record);
  };

  const columns = [
    { dataIndex: "id", title: "ID" },
    { dataIndex: "Account", title: "Account" },
    { dataIndex: "Account Type", title: "Account Type" },

    {
      title: "Actions",
      valueType: "option",
      render: (_: any, record: any) => (
        <Row gutter={[8, 8]}>
          <Col>
            <Tooltip title="View">
              <Button
                type="primary"
                onClick={() => handleView(record)}
                icon={<EyeOutlined />}
              />
            </Tooltip>
          </Col>
        </Row>
      ),
    },
  ];

  const handleCreate = () => {
    setModalVisible(true);
  };

  return (
    <>
      <ProTable
        columns={columns}
        dataSource={[
          {
            id: 1,
            Account: "Cash",
            "Account Type": "Cash",
          },
        ]}
        cardBordered
        loading={false}
        bordered
        revalidateOnFocus
        rowKey="Invoice No."
        toolbar={{
          search: {
            onSearch: (value) => {
              alert(value);
            },
          },
          actions: [
            <Button
              key="primary"
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Create Account
            </Button>,
          ],
        }}
        search={false}
        options={{
          setting: { listsHeight: 400 },
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="Sells"
      />

      {modalVisible && (
        <CreateAccountForm
          open={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
};

export default AccountTable;
