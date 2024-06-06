import React, { useEffect, useState } from "react";
import { GetChannel } from "../Api";
import URLList from "../Url/URLList";

const AdminFirstPage = () => {
  const [channel, setChannel] = useState();
  useEffect(() => {
    GetChannel(URLList.AdminChannel).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setChannel(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  return (
    <div className="ml-72 mt-16">
      <div className="container ">
        {/* --------stat-------- */}
        <div className="w-full mt-10 tabs tabs-lifted  stats stats-vertical lg:stats-horizontal shadow bg-yellow-100 shadow-mda">
          <div className="stat bg-red-200">
            <div className="stat-title">Now</div>
            <div className="stat-value">A015</div>
            <div className="stat-desc">Queue Number</div>
          </div>

          <div className="stat">
            <div className="stat-title">Waiting</div>
            <div className="stat-value">4</div>
            <div className="stat-desc">Queue</div>
          </div>

          <div className="stat bg-green-200">
            <div className="stat-title">Total amount</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">Jan 1st </div>
          </div>
        </div>

        {/* -------tab------- */}

        <div role="tablist" className="grid tabs tabs-lifted mt-10">
          {channel &&
            channel.map(
              (item) =>
                item.is_available == 1 && (
                  <>
                    <input
                      type="radio"
                      name="my_tabs_2"
                      role="tab"
                      className="tab "
                      aria-label={item.name}
                    />
                    <div
                      role="tabpanel"
                      className="tab-content  bg-base-200 border-base-300 rounded-box p-6"
                    >
                      Waiting (Queue) {item.name}
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr>
                            <th>Queue Number</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Time</th>
                            <th>Car Number</th>
                            <th>Size</th>
                            <th>Status</th>
                            <th></th>
                            <th>Edit</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* row 1 */}
                          <tr>
                            <td>
                              <div className="flex items-center gap-3">
                                <div>
                                  <div className="font-bold">A016</div>
                                </div>
                              </div>
                            </td>
                            <td>Daniel</td>
                            <td>0898765432</td>
                            <td>14.00 pm</td>
                            <td>6กด5310</td>
                            <td>M</td>
                            <td>Waiting</td>

                            <th>
                              <button className="btn bg-green-300 btn-md">
                                Start
                              </button>
                            </th>
                            <th>
                              <button className="btn bg-blue-300 btn-md">
                                Edit
                              </button>
                            </th>
                            <th>
                              <button className="btn bg-red-300 btn-md">
                                Delete
                              </button>
                            </th>
                          </tr>

                          {/* row 2 */}
                          <tr>
                            <td>
                              <div className="flex items-center gap-3">
                                <div>
                                  <div className="font-bold">A016</div>
                                </div>
                              </div>
                            </td>
                            <td>John</td>
                            <td>0898765424</td>
                            <td>13.00 pm</td>
                            <td>1ก6365</td>
                            <td>S</td>
                            <td>Waiting</td>

                            <th>
                              <button className="btn bg-green-300 btn-md">
                                Start
                              </button>
                            </th>
                            <th>
                              <button className="btn bg-blue-300 btn-md">
                                Edit
                              </button>
                            </th>
                            <th>
                              <button className="btn bg-red-300 btn-md">
                                Delete
                              </button>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminFirstPage;
