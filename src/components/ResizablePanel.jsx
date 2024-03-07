import React, { useEffect, useState } from "react";
import SplitPane from "react-split-pane";
import "./resizable.css"

const ResizablePanel = () => {
  const [counts, setCounts] = useState({
    addCount: 0,
    updateCount: 0
  })
  const [data, setData] = useState(null);
  const [input, setInput] = useState("");
  const [updateInput, setUpdateInput] = useState("")

  const getData = async () => {
    try {
      const res = await fetch("http://localhost:1973/api/v1/data", {headers: {
        "Content-Type": "application/json"
      }});
      const data = await res.json();
      setData(data?.data?.data[0] || null);
      setCounts(data?.data?.count || {
        addCount: 0,
        updateCount: 0
      });
      setUpdateInput(data?.data?.data[0]?.text)
    } catch (error) {
      console.log(error);
    }
  }


  const updateData = async (e, id) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:1973/api/v1/data/update-data/${id}`, { method: "PATCH", body: JSON.stringify({text: updateInput}), headers: {
        "Content-Type": "application/json"
      }});
      const data = await res.json();
      setCounts(data?.data?.count)
      setData(data?.data?.data)
      setUpdateInput(data?.data?.data?.text)
      alert(data?.message);
    } catch (error) {
      alert("Something went wrong!");
      console.log(error);
    }
  }

  const addData = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:1973/api/v1/data/add-data`, { method: "POST", body: JSON.stringify({text: input}), headers: {
        "Content-Type": "application/json"
      }});
      const data = await res.json();
      setCounts(data?.data?.count)
      setData(data?.data?.data)
      setUpdateInput(data?.data?.data?.text)
      setInput("")
      alert(data?.message);
    } catch (error) {
      alert("Something went wrong!");
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, [])
  return (
    <>
      <SplitPane split="horizonatal" minSize={"50%"} defaultSize={200}>
        <div className="pane" style={{ height: "100%" }}>
          <SplitPane split="vertical" minSize={"50%"} defaultSize={100}>
            <div className="inner-pane">
              <h1 className="count_heading">Count</h1>
              <h6 className="count"><span>Add: </span> {counts?.addCount}</h6>
              <h6 className="count"><span>Update: </span> {counts?.updateCount}</h6>
            </div>
            <div className="inner-pane">
              <form onSubmit={addData}>
                <input value={input} onChange={(e) => setInput(e.target.value)} required type="text" placeholder="Enter some text" />
                <button type="submit">Add</button>
              </form>
            </div>
          </SplitPane>
        </div>
        <div className="inner-pane">
          <div className="update_container">
            {
              data ? (
                <form className="update_form" onSubmit={(e) => updateData(e, data?._id)}>
                <label>1: </label>
                <input value={updateInput} onChange={(e) => setUpdateInput(e.target.value)} required className="update_input" type="text" placeholder="Update" />
                <button type="submit">Update</button>
              </form>
              ) : (
                <p>No data available to update</p>
              )
            }

          </div>
        </div>
      </SplitPane>
    </>
  );
};

export default ResizablePanel;
