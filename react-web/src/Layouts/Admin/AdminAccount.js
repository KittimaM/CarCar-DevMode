import React, { useEffect, useState } from "react";
import {
  DeleteAccount,
  GetAllAccount,
  PostAddAccount,
  UpdateAccount,
} from "../Api";

const AdminAccount = ({ permission }) => {
  const [list, setList] = useState([]);
  const [totalSummary, setTotalSummary] = useState(0);
  const [editItem, setEditItem] = useState(null);

  const fetchAccount = () => {
    GetAllAccount().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        let total = 0;
        msg.map((item) => {
          if (item.is_income == 1) {
            total += parseInt(item.income);
          } else {
            total -= parseInt(item.expense);
          }
        });
        setList(msg);
        setTotalSummary(total);
      } else {
        console.log(data);
      }
    });
  };
  useEffect(() => {
    fetchAccount();
  }, []);

  const handleAddIncome = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      label: data.get("label"),
      income: data.get("price"),
      expense: 0,
      is_income: 1,
      is_expense: 0,
      date: data.get("date"),
    };
    PostAddAccount(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchAccount();
      } else {
        console.log(data);
      }
    });
  };

  const handleAddExpense = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      label: data.get("label"),
      income: 0,
      expense: data.get("price"),
      is_income: 0,
      is_expense: 1,
      date: data.get("date"),
    };
    PostAddAccount(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchAccount();
      } else {
        console.log(data);
      }
    });
  };

  const handleSelectEditId = (selectedItem) => {
    setEditItem(selectedItem);
  };

  const handleEditAccount = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      id: editItem.id,
      label: data.get("label"),
    };
    const account_type = data.get("account_type");
    if (account_type == "is_income") {
      jsonData["is_income"] = 1;
      jsonData["income"] = data.get("price");
      jsonData["is_expense"] = 0;
      jsonData["expense"] = 0;
      jsonData["date"] =
        data.get("date").length == 0
          ? editItem.date.split("T")[0]
          : data.get("date");
    } else {
      jsonData["is_income"] = 0;
      jsonData["income"] = 0;
      jsonData["is_expense"] = 1;
      jsonData["expense"] = data.get("price");
      jsonData["date"] =
        data.get("date").length == 0
          ? editItem.date.split("T")[0]
          : data.get("date");
    }
    UpdateAccount(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setEditItem(null);
        fetchAccount();
      } else {
        console.log(data);
      }
    });
  };

  const handleDeleteUser = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteAccount(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchAccount();
      } else {
        console.log(data);
      }
    });
  };

  return (
    <>
      <div className="ml-80 mt-16">
        <div className="text-lg bg-yellow-100 mb-5 "> Account page</div>

        {permission && permission.includes("2") && (
          <div>
            <form onSubmit={handleAddIncome}>
              <label>Income</label>
              <input type="text" name="label" />
              <label>Price</label>
              <input type="number" name="price" />
              <label>date</label>
              <input type="date" name="date" />
              <button className="btn" type="submit">
                Add Income
              </button>
            </form>
            <form onSubmit={handleAddExpense}>
              <label>Expense</label>
              <input type="text" name="label" />
              <label>Price</label>
              <input type="number" name="price" />
              <label>date</label>
              <input type="date" name="date" />
              <button className="btn" type="submit">
                Add Expense
              </button>
            </form>
          </div>
        )}

        <table className="table table-lg">
          <thead>
            <tr>
              <td>label</td>
              <td>income</td>
              <td>expense</td>
              <td>date</td>
              {permission && permission.includes("3") && <td>Edit</td>}
              {permission && permission.includes("4") && <td>Delete</td>}
            </tr>
          </thead>
          <tbody>
            {list &&
              list.map((item) => (
                <tr>
                  <td>{item.label}</td>
                  <td>{item.is_income == 1 && item.income}</td>
                  <td>{item.is_expense == 1 && item.expense}</td>
                  <td>{item.date.split("T")[0]}</td>
                  {permission && permission.includes("3") && (
                    <td>
                      <button
                        className="btn"
                        onClick={() => handleSelectEditId(item)}
                        value={item.id}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                  {permission && permission.includes("4") && (
                    <td>
                      <button
                        className="btn"
                        onClick={handleDeleteUser}
                        value={item.id}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
        <p>total : {totalSummary && totalSummary}</p>
        {permission && permission.includes("3") && editItem && (
          <form onSubmit={handleEditAccount}>
            <label>label</label>
            <input type="text" name="label" defaultValue={editItem.label} />
            <label>Price</label>
            <input
              type="number"
              name="price"
              defaultValue={
                editItem.is_income == 1 ? editItem.income : editItem.expense
              }
            />
            <label>date</label>
            <input type="date" name="date" placeholder={editItem.date} />
            <select
              name="account_type"
              defaultValue={
                editItem.is_income == 1 ? "is_income" : "is_expense"
              }
            >
              <option value="is_income">is_income</option>
              <option value="is_expense">is_expense</option>
            </select>
            <button className="btn" type="submit">
              Submit Edit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default AdminAccount;
