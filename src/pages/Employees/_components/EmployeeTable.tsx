import { DeleteFilled, EyeFilled, EditFilled } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button, Col, Row, Tooltip } from "antd";
import { Link } from "react-router-dom";

const EmployeeTable = () => {
  const handleViewDetails = () => {};
  const handleEdit = () => {};
  const handleDelete = () => {};

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (text: any) => (
        <img
          src={text as string}
          alt="Product"
          style={{ width: 32, height: 32 }}
        />
      ),
    },
    { dataIndex: "id", title: "ID" },
    { dataIndex: "name", title: "Product" },
    { dataIndex: "phone", title: "phone" },
    { dataIndex: "email", title: "email" },

    {
      title: "Actions",
      valueType: "option",
      render: (_: any, record: any) => (
        <Row gutter={[8, 8]}>
          <Col>
            <Tooltip title="View Details">
              <Link to={`/dashboard/employees/manage/${record.id}`}>
                <Button
                  type="primary"
                  onClick={handleViewDetails}
                  icon={<EyeFilled />}
                />
              </Link>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Edit">
              <Button
                type="primary"
                onClick={handleEdit}
                icon={<EditFilled />}
              />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Delete">
              <Button
                type="primary"
                danger
                onClick={handleDelete}
                icon={<DeleteFilled />}
              />
            </Tooltip>
          </Col>
        </Row>
      ),
    },
  ];
  return (
    <>
      <ProTable
        columns={columns}
        dataSource={[
          {
            id: 1,
            name: "John Doe",
            phone: "123456789",
            email: "john@gmail.com",
            image: "https://via.placeholder.com/150",
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
    </>
  );
};

export default EmployeeTable;
