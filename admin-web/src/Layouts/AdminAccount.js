import React, { useEffect, useState } from "react";
import {
  DeleteAccount,
  GetAllAccount,
  PostAddAccount,
  UpdateAccount,
} from "../Api";

const AdminAccount = ({ data }) => {
  const { labelValue, permission } = data;
  const [list, setList] = useState([]);
  const [totalSummary, setTotalSummary] = useState(0);
  const [openAddIncomeForm, setOpenAddIncomeForm] = useState(false);
  const [openAddExpenseForm, setOpenAddExpneseForm] = useState(false);
  const [editItem, setEditItem] = useState();

  const fetchAccount = () => {
    GetAllAccount().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        let total = 0;
        msg.map((item) => {
          if (item.is_income === 1) {
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
      if (status === "SUCCESS") {
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
      if (status === "SUCCESS") {
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
    if (account_type === "is_income") {
      jsonData["is_income"] = 1;
      jsonData["income"] = data.get("price");
      jsonData["is_expense"] = 0;
      jsonData["expense"] = 0;
      jsonData["date"] =
        data.get("date").length === 0
          ? editItem.date.split("T")[0]
          : data.get("date");
    } else {
      jsonData["is_income"] = 0;
      jsonData["income"] = 0;
      jsonData["is_expense"] = 1;
      jsonData["expense"] = data.get("price");
      jsonData["date"] =
        data.get("date").length === 0
          ? editItem.date.split("T")[0]
          : data.get("date");
    }
    UpdateAccount(jsonData).then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
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
      if (status === "SUCCESS") {
        fetchAccount();
      } else {
        console.log(data);
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col bg-[#ffffff] mx-auto p-5 rounded-lg shadow-lg h-full overflow-y-auto">
        <div className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">
          {labelValue}
        </div>

        {permission && permission["add"] === 1 && (
          <div>
            <button className="btn" onClick={() => setOpenAddIncomeForm(true)}>
              Add Income
            </button>
            <button className="btn" onClick={() => setOpenAddExpneseForm(true)}>
              Add Expnese
            </button>
          </div>
        )}

        <table className="table table-lg">
          <thead>
            <tr>
              <td>label</td>
              <td>income</td>
              <td>expense</td>
              <td>date</td>
              {permission && permission["edit"] === 1 && <td>Edit</td>}
              {permission && permission["delete"] === 1 && <td>Delete</td>}
            </tr>
          </thead>
          <tbody>
            {list &&
              list.map((item) => (
                <tr>
                  <td>{item.label}</td>
                  <td>{item.is_income === 1 && item.income}</td>
                  <td>{item.is_expense === 1 && item.expense}</td>
                  <td>{item.date}</td>
                  {permission && permission["edit"] === 1 && (
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
                  {permission && permission["delete"] === 1 && (
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
        {openAddIncomeForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl mb-4">Add Income</h2>
              <form onSubmit={handleAddIncome}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Income
                  </label>
                  <input
                    type="text"
                    name="label"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Price
                  </label>
                  <input
                    min="0"
                    type="number"
                    name="price"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {
                      setOpenAddIncomeForm(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {openAddExpenseForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl mb-4">Add Expense</h2>
              <form onSubmit={handleAddExpense}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Expnese
                  </label>
                  <input
                    type="text"
                    name="label"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Price
                  </label>
                  <input
                    min="0"
                    type="number"
                    name="price"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {
                      setOpenAddExpneseForm(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {editItem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl mb-4">Edit</h2>
              <form onSubmit={handleEditAccount}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Income/Expense
                  </label>
                  <select
                    name="account_type"
                    defaultValue={
                      editItem.is_income === 1 ? "is_income" : "is_expense"
                    }
                  >
                    <option value="is_income">is_income</option>
                    <option value="is_expense">is_expense</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    label
                  </label>
                  <input
                    defaultValue={editItem.label}
                    type="text"
                    name="label"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Price
                  </label>
                  <input
                    defaultValue={editItem.price}
                    min="0"
                    type="number"
                    name="price"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date
                  </label>
                  <input
                    defaultValue={editItem.date}
                    type="date"
                    name="date"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {
                      setEditItem();
                    }}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccount;
