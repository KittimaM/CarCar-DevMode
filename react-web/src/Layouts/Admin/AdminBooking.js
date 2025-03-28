import React, { useState, useEffect } from "react";
import { FetchBooking, DefaultTimeOptions, TimeFormat } from "../Module";
import {
  GetAllCarSize,
  PostAddAdminBooking,
  GetAllService,
  GetAllPaymentType,
} from "../Api";


const AdminBooking = ({ data }) => {
  const { labelValue, permission } = data;
  const defaultTime = new Date();
  const [service, setService] = useState();
  const [booking, setBooking] = useState([]);
  const [carSize, setCarSize] = useState();
  const [defaultTimeOptions, setDefaultTimeOptions] = useState([]);
  const [serviceUseTime, setServiceUseTime] = useState(0);
  const [bookedDateTimeOptions, setBookedDateTimeOptions] = useState(null);
  const [timeOptions, setTimeOptions] = useState([]);
  const [paymentType, setPaymentType] = useState();
  

  useEffect(() => {
    GetAllPaymentType().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setPaymentType(msg);
      } else {
        console.log(data);
      }
    });
    GetAllCarSize().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setCarSize(msg);
      } else {
        console.log(data);
      }
    });
    FetchBooking().then((data) => setBookedDateTimeOptions(data));

    let defaultTimeOptions = DefaultTimeOptions();
    const newTimeOptions = defaultTimeOptions.filter(
      (item) => item > TimeFormat(defaultTime)
    );
    newTimeOptions.length > 0
      ? setDefaultTimeOptions(newTimeOptions)
      : setDefaultTimeOptions(DefaultTimeOptions());
  }, []);

  const handleSubmitCar = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const [car_size_id, car_size] = data.get("car_size").split(",");
    const jsonData = {
      car_no: data.get("car_no"),
      car_size_id: car_size_id,
      car_size: car_size,
      car_color: data.get("car_color"),
      customer_name: data.get("customer_name"),
      customer_phone: data.get("customer_phone"),
    };

    GetAllService().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        const availableService = msg.filter(
          (item) =>
            item.is_available == 1 && jsonData.car_size_id == item.car_size_id
        );
        let serviceOptions = [];
        availableService.map((item) => {
          serviceOptions.push({ ...item, isSelected: false });
        });
        setService(serviceOptions);
        setBooking(jsonData);
      } else {
        setService(null);
        console.log(data);
      }
    });
  };

  const handleSelectedService = (event) => {
    event.preventDefault();
    service.map((item) => {
      if (item.id == event.target.value) item.isSelected = event.target.checked;
    });
    setService(service);
  };

  const handleSubmitSelectedService = (event) => {
    event.preventDefault();
    let serviceDetail = [];
    let servcieUseTime = 0;
    let servicePrice = 0;
    service.map((item) => {
      if (item.isSelected == true) {
        serviceDetail.push(item.id);
        servcieUseTime += parseInt(item.used_time);
        servicePrice += parseInt(item.price);
      }
    });
    const jsonData = {
      ...booking,
      service: serviceDetail,
      service_usetime: servcieUseTime,
      service_price: servicePrice,
    };
    setBooking(jsonData);
    setServiceUseTime(servcieUseTime);

    const tempDate = new Date();
    const [date, time] = tempDate.toISOString().split("T");
    if (bookedDateTimeOptions && bookedDateTimeOptions[date]) {
      let bookedTime = [];
      bookedDateTimeOptions[date].map((item) => {
        const { start_service_time, service_usetime } = item;
        let initialTime = service_usetime;
        let newTimeOptions = new Date();
        const [hour, mins] = start_service_time.split(":");
        bookedTime.push(`${hour}:${mins}`);

        if (service_usetime > 30) {
          newTimeOptions.setHours(hour, mins, 0);
          while (initialTime > 30) {
            newTimeOptions.setMinutes(newTimeOptions.getMinutes() + 30);
            bookedTime.push(TimeFormat(newTimeOptions));
            initialTime = initialTime - 30;
          }
        }
      });
      const newTimeOptions = defaultTimeOptions.filter(
        (item) => !bookedTime.includes(item)
      );
      setTimeOptions(newTimeOptions);
    } else {
      setTimeOptions(defaultTimeOptions);
    }
  };

  const handleSubmitSelectedTime = (event) => {
    event.preventDefault();
    const [date, time] = defaultTime.toISOString().split("T");
    let service_time = event.target.value;
    let [hour, mins] = service_time.split(":");
    let endTime = new Date();
    endTime.setHours(hour, mins, 0);
    endTime.setMinutes(endTime.getMinutes() + serviceUseTime);
    endTime = TimeFormat(endTime);

    let closeTime = new Date();
    closeTime.setHours(18, 0, 0);
    closeTime = TimeFormat(closeTime);
    if (endTime <= closeTime) {
      if (bookedDateTimeOptions && bookedDateTimeOptions[date]) {
        let result = bookedDateTimeOptions[date]
          .map((item) => {
            const { start_service_time, end_service_time } = item;
            let booked_start_time = new Date();
            booked_start_time = start_service_time;
            let booked_end_time = new Date();
            booked_end_time = end_service_time;

            if (booked_start_time < endTime && endTime < booked_end_time) {
              return false;
            }
            if (
              service_time < booked_start_time &&
              booked_end_time <= endTime
            ) {
              return false;
            }
            return true;
          })
          .every((value) => value);

        if (result) {
          const jsonData = {
            ...booking,
            start_service_datetime: date + "T" + service_time,
            end_service_datetime: date + "T" + endTime,
          };
          setBooking(jsonData);
        } else {
          alert("please select other time");
        }
      } else {
        const jsonData = {
          ...booking,
          start_service_datetime: date + "T" + service_time,
          end_service_datetime: date + "T" + endTime,
        };
        setBooking(jsonData);
      }
    } else {
      alert("please select other time");
    }
  };

  const handleSubmitPaymentType = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      ...booking,
      payment_type_id: data.get("payment_type"),
    };
    setBooking(jsonData);
  };

  const handleSubmitBooking = (event) => {
    event.preventDefault();
    PostAddAdminBooking(booking).then((data) => console.log(data));
  };

  return (
    <>
      <div className="flex flex-col bg-[#ffffff] mx-auto p-5 rounded-lg shadow-xl h-full overflow-y-auto">
        <div className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">
          {labelValue}
        </div>
        <div className="flex flex-col justify-center items-center p-5">
          <form onSubmit={handleSubmitCar} className="grid grid-cols-6 gap-4 ">
            <div className="col-span-3 w-full">
              <label name="customer_name" className="fieldset-legend text-lg">
                Customer Name
              </label>
              <input
                type="text"
                name="customer_name"
                className="rounded-md border-1 border-[#b1b1b1] w-full"
                placeholder="name"
              />
            </div>
            <div className="col-span-3 w-full">
              <label name="customer_phone" className="fieldset-legend text-lg">
                Phone
              </label>
              <input
                type="text"
                name="customer_phone"
                className="rounded-md border-1 border-[#b1b1b1] w-full"
                placeholder="phone"
              />
            </div>
            <div className="col-span-2 w-full">
              <label name="car_no" className="fieldset-legend text-lg">
                Car no
              </label>
              <input
                type="text"
                name="car_no"
                className="rounded-md border-1 border-[#b1b1b1] w-full"
                placeholder="car number"
              />
            </div>

            <div className="col-span-2 w-full">
              <label name="car_color" className="fieldset-legend text-lg">
                Car color
              </label>
              <input
                type="text"
                name="car_color"
                className="rounded-md border-1 border-[#b1b1b1] w-full"
                placeholder="car color"
              />
            </div>
            <div className="col-span-2 w-full">
              {carSize && (
                <div className="flex flex-col">
                  <label name="car_size" className="fieldset-legend text-lg">
                    Car size
                  </label>
                  <select
                    name="car_size"
                    className="rounded-md border-1 border-[#b1b1b1]"
                  >
                    {carSize.map(
                      (item) =>
                        item.is_available == 1 && (
                          <option key={item.id} value={[item.id, item.size]}>
                            {item.size}
                          </option>
                        )
                    )}
                  </select>
                </div>
              )}
            </div>

            <button type="submit" className="btn my-3 col-span-6">
              Selected Car
            </button>
          </form>

          {service && (
            <form
              onSubmit={handleSubmitSelectedService}
              className="flex flex-col justify-center items-start p-5 w-full"
            >
              <label className="text-xl uppercase font-semibold">Service</label>
              <div className="grid grid-cols-2 w-full  max-w-md items-center justify-center p-5">
                {service.map((item) => (
                  <div className="">
                    <button
                      type="submit"
                      name={item.id}
                      value={item.id}
                      onChange={handleSelectedService}
                      className="btn "
                    >
                      {item.service}
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn " type="submit">
                Submit Service
              </button>
            </form>
          )}
          {timeOptions && (
            <div className="flex flex-wrap gap-2">
              {" "}
              {/* Flex container */}
              {timeOptions.map((item) => (
                <button
                  onClick={handleSubmitSelectedTime}
                  key={item}
                  value={item}
                  className="btn m-2"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
          {paymentType && (
            <form onSubmit={handleSubmitPaymentType} className="flex flex-col p-4"> 
              <label name="payment_type">Payment Type</label>
              <select name="payment_type">
                {paymentType.map(
                  (item) =>
                    item.is_available == 1 && (
                      <option key={item.id} value={item.id}>
                        {item.payment_type}
                      </option>
                    )
                )}
              </select>
              <button type="submit" className="btn mt-2">
                Select Payment Type
              </button>
            </form>
          )}
          <div className="flex justify-end items-end  w-full">
            <button onClick={handleSubmitBooking} className="btn ">
            Submit Booking
          </button>
          </div>

          <div>

          </div>
          
        </div>

        
      </div>





    </>
  );
};

export default AdminBooking;
