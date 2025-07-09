import React from "react";
import { Tabs } from "antd";
import { useState } from "react";
import {
  AiOutlineUser,
  AiOutlineClockCircle,
  AiOutlineCalendar,
  AiOutlineSchedule,
} from "react-icons/ai";
import { BsGear } from "react-icons/bs";
import EmployeeAccount from "./EmployeeAccount";
import AttendanceTab from "./AttendanceTab";

const { TabPane } = Tabs;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("1");

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Tabs
      defaultActiveKey="1"
      activeKey={activeTab}
      onChange={onChange}
      tabBarStyle={{
        background: "#F0F2F5",
        padding: "0 20px",
        borderBottom: "1px solid #ddd",
      }}
      className="block w-full mt-10 border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
    >
      <TabPane
        tab={
          <span className="flex items-center">
            <AiOutlineUser style={{ marginRight: "4px" }} />
            <span>Account</span>
          </span>
        }
        key="1"
      >
        <div className="p-4 bg-white">
          <EmployeeAccount />
        </div>
      </TabPane>
      <TabPane
        tab={
          <span className="flex items-center">
            <AiOutlineClockCircle style={{ marginRight: "4px" }} />
            <span>Attendance</span>
          </span>
        }
        key="2"
      >
        <div className="p-4 bg-white">
          <AttendanceTab />
        </div>
      </TabPane>
      <TabPane
        tab={
          <span className="flex items-center">
            <AiOutlineCalendar style={{ marginRight: "4px" }} />
            <span>Leave</span>
          </span>
        }
        key="3"
      >
        <div className="p-4 bg-white">Content of Leave Tab</div>
      </TabPane>
      <TabPane
        tab={
          <span className="flex items-center">
            <BsGear style={{ marginRight: "4px" }} />
            <span>Holiday</span>
          </span>
        }
        key="4"
      >
        <div className="p-4 bg-white">Content of Holiday Tab</div>
      </TabPane>
      <TabPane
        tab={
          <span className="flex items-center">
            <AiOutlineSchedule style={{ marginRight: "4px" }} />
            <span>Shift</span>
          </span>
        }
        key="5"
      >
        <div className="p-4 bg-white">Content of Shift Tab</div>
      </TabPane>
      <TabPane
        tab={
          <span className="flex items-center">
            <AiOutlineClockCircle style={{ marginRight: "4px" }} />
            <span>Schedule</span>
          </span>
        }
        key="6"
      >
        <div className="p-4 bg-white">Content of Schedule Tab</div>
      </TabPane>
      <TabPane
        tab={
          <span className="flex items-center">
            <BsGear style={{ marginRight: "4px" }} />
            <span>Overtime</span>
          </span>
        }
        key="7"
      >
        <div className="p-4 bg-white">Content of Overtime Tab</div>
      </TabPane>
    </Tabs>
  );
};

export default App;
