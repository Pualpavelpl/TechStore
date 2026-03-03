import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Row } from "react-bootstrap";
import DeviceItem from "./DeviceItem";

const DeviceList = observer(() => {
  const { device } = useContext(Context);

  return (
    <Row className="d-flex">
      {device.filteredDevices.map((dev, index) => (
        <DeviceItem key={dev.id} device={dev} index={index} />
      ))}
    </Row>
  );
});

export default DeviceList;
