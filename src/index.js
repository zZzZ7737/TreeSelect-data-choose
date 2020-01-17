import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { TreeSelect, Button } from "antd";
import allUnitData from "./data";
import chooseData from "/data2";

const { SHOW_PARENT } = TreeSelect;

const valueMap = {};
function dataDeep(data, parent) {
  const obj = data.map(({ companyId, name, children = [] }) => {
    const node = (valueMap[companyId] = {
      parent,
      value: companyId,
      title: name,
      key: companyId
    });
    node.children = dataDeep(children, node);
    return node;
  });
  return obj;
}

function getPath(value) {
  const path = [];
  let current = valueMap[value];
  while (current) {
    path.unshift(current.value);
    current = current.parent;
  }
  if (valueMap[value]) {
    let child = valueMap[value].children;
    return path.concat(getChildrenPath(child));
  }
  return path;
}

function getChildrenPath(value) {
  let path = [];
  if (value) {
    for (let i = 0; i < value.length; i++) {
      path.push(value[i].value);
      path = path.concat(getChildrenPath(value[i].children));
    }
  }
  return path;
}

function isRoot(list, target) {
  for (let i = 0, len = list.length; i < len; i += 1) {
    const { value } = list[i];
    if (target === value) {
      return true;
    } else {
    }
  }
  return false;
}

function deepChildren(list) {
  let path = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].children && list[i].children.length) {
      path = path.concat(deepChildren(list[i].children));
    } else {
      path.push(list[i].companyId);
    }
  }
  return path;
}

class Demo extends React.Component {
  state = {
    value: []
  };

  componentDidMount() {
    this.setState({
      value: deepChildren(chooseData.children)
    });
  }

  onChange = (value, label, extra) => {
    // console.log("value, label, extra..", value, label, extra);
    this.setState({ value });
  };
  ok = () => {
    const { value } = this.state;
    let path = [];
    for (let i = 0; i < value.length; i++) {
      if (isRoot(dataDeep(allUnitData), value[i])) {
        path.push(value[i]);
        path = path.concat(getChildrenPath(valueMap[value[i]].children));
      } else {
        path = path.concat(getPath(value[i]));
      }
    }
    console.log("path..", path);
    this.setState({ value: path });
  };

  render() {
    const tProps = {
      treeData: dataDeep(allUnitData),
      treeDefaultExpandAll: true,
      value: this.state.value,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: "+ 选择",
      style: {
        width: "100%"
      },
      dropdownStyle: {
        maxHeight: "400px"
      }
    };
    return (
      <React.Fragment>
        <TreeSelect {...tProps} />
        <Button onClick={this.ok}>点击</Button>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById("container"));
