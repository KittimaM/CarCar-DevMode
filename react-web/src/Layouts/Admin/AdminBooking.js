import React, { useState, useEffect } from "react";
import { FetchBooking, DefaultTimeOptions, TimeFormat } from "../Module";
import {
  GetAllCarSize,
  PostAddAdminBooking,
  GetAllService,
  GetAllPaymentType,
} from "../Api";
import URLList from "../Url/URLList";

const AdminBooking = () => {
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
    GetAllPaymentType(URLList.AdminPaymentType).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setPaymentType(msg);
      } else {
        console.log(data);
      }
    });
    GetAllCarSize(URLList.AdminCarSizeURL).then((data) => {
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

    GetAllService(URLList.AdminService).then((data) => {
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
      <div className="ml-80 mt-16">
        <div className="text-lg bg-yellow-100 mb-5 "> Booking page</div>

        <form onSubmit={handleSubmitCar}>
          <label name="customer_name">Customer_name</label>
          <input type="text" name="customer_name" />
          <label name="customer_phone">Customer_phone</label>
          <input type="text" name="customer_phone" />
          <label name="car_no">car_no</label>
          <input type="text" name="car_no" />
          <label name="car_color">car_color</label>
          <input type="text" name="car_color" />
          {carSize && (
            <div>
              <label name="car_size">car_size</label>
              <select name="car_size">
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
          <button type="submit" className="btn">
            Selected Car
          </button>
        </form>

        {service && (
          <form onSubmit={handleSubmitSelectedService}>
            <label>Service</label>
            {service.map((item) => (
              <div>
                <input
                  type="checkbox"
                  name={item.id}
                  value={item.id}
                  onChange={handleSelectedService}
                />
                <label>{item.service}</label>
              </div>
            ))}
            <button className="btn" type="submit">
              Submit Service
            </button>
          </form>
        )}
        {timeOptions &&
          timeOptions.map((item) => (
            <button
              onClick={handleSubmitSelectedTime}
              key={item}
              value={item}
              className="btn"
            >
              {item}
            </button>
          ))}
        {paymentType && (
          <form onSubmit={handleSubmitPaymentType}>
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
            <button type="submit" className="btn">
              Select Payment Type
            </button>
          </form>
        )}
        <button onClick={handleSubmitBooking} className="btn">
          Submit Booking
        </button>
      </div>
    </>
  );
};

export default AdminBooking;
