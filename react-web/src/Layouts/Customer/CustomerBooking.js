import React, { useState, useEffect } from "react";
import {
  Button,
  FetchBooking,
  TimeFormat,
  DefaultTimeOptions,
} from "../Module";
import {
  GetAllService,
  GetCustomerCar,
  PostAddCustomerBooking,
  GetAllPaymentType,
} from "../Api";
import URLList from "../Url/URLList";

const CustomerBooking = () => {
  const [car, setCar] = useState();
  const [isSelectedCar, setIsSelectedCar] = useState(false);
  const [service, setService] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [booking, setBooking] = useState([]);
  const [dateOptions, setDateOptions] = useState([]);
  const [bookedDateTimeOptions, setBookedDateTimeOptions] = useState(null);
  const [timeOptions, setTimeOptions] = useState([]);
  const [defaultTimeOptions, setDefaultTimeOptions] = useState([]);
  const [serviceUseTime, setServiceUseTime] = useState(0);
  const [paymentType, setPaymentType] = useState();
  const [isReadyToBook, setIsReadyToBook] = useState(false);
  const [isSelectedService, setIsSelectedService] = useState(false);
  const [selectedService, setSelectedService] = useState([]);
  const [isSelectedTime, setIsSelectedTime] = useState(false);
  const [isSelectedPaymentType, setIsSelectedPaymentType] = useState(false);

  useEffect(() => {
    GetAllPaymentType().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setPaymentType(msg);
      } else {
        console.log(data);
      }
    });
    GetCustomerCar().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setCar(msg);
      } else {
        console.log(data);
      }
    });
    FetchBooking().then((data) => {
      setBookedDateTimeOptions(data);
    });

    let tempDateOptions = [];
    let newDateOptions = new Date();
    let maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    maxDate = maxDate.toISOString().split("T")[0];
    do {
      newDateOptions.setDate(newDateOptions.getDate() + 1);
      let dataToInput = newDateOptions.toISOString().split("T")[0];
      tempDateOptions.push(dataToInput);
    } while (!tempDateOptions.includes(maxDate));
    setDateOptions(tempDateOptions);

    setTimeOptions(DefaultTimeOptions());
    setDefaultTimeOptions(DefaultTimeOptions());
  }, []);

  const handleSubmitSelectedCar = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const [plate_no, size_id, size, color] = data.get("plate_no").split(",");
    const jsonData = {
      ...booking,
      plate_no: plate_no,
      size_id: size_id,
      size: size,
      color: color,
    };
    GetAllService(URLList.AdminService).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        const availableService = msg.filter(
          (item) =>
            item.is_available == 1 && jsonData.size_id == item.car_size_id
        );
        setService(availableService);
        setBooking(jsonData);
        setIsSelectedCar(true);
      } else {
        setService(null);
        setIsSelectedCar(false);
        setBooking([]);
        console.log(data);
      }
    });
  };

  const handleSelectedService = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedService((item) => [...item, value]);
    } else {
      setSelectedService((item) => item.filter((item) => item !== value));
    }
  };

  const handleSubmitSelectedService = (event) => {
    event.preventDefault();
    if (selectedService.length == 0) {
      alert("please select service");
    } else {
      let serviceId = [];
      let servcieUseTime = 0;
      let servicePrice = 0;
      service.map((item) => {
        selectedService.map((selected_service_item) => {
          if (item.id == selected_service_item) {
            serviceId.push(item.id);
            servcieUseTime += parseInt(item.used_time);
            servicePrice += parseFloat(item.price);
          }
        });
      });
      const jsonData = {
        ...booking,
        service: serviceId,
        service_usetime: servcieUseTime,
        service_price: servicePrice,
      };
      setBooking(jsonData);
      setServiceUseTime(servcieUseTime);
      setIsSelectedService(true);
    }
  };

  const handleSubmitSelectedDate = (event) => {
    event.preventDefault();
    let dateSelected = event.target.value;
    setSelectedDate(dateSelected);

    if (bookedDateTimeOptions && bookedDateTimeOptions[dateSelected]) {
      let bookedTime = [];
      bookedDateTimeOptions[dateSelected].map((item) => {
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
    setIsSelectedTime(true);
  };

  const handleSubmitSelectedTime = (event) => {
    event.preventDefault();
    let service_date = new Date();
    service_date = selectedDate;
    let service_time = new Date();
    service_time = event.target.value;
    let [hour, mins] = service_time.split(":");
    let endTime = new Date();
    endTime.setHours(hour, mins, 0);
    endTime.setMinutes(endTime.getMinutes() + serviceUseTime);
    endTime = TimeFormat(endTime);

    let closeTime = new Date();
    closeTime.setHours(18, 0, 0);
    closeTime = TimeFormat(closeTime);
    if (endTime <= closeTime) {
      if (bookedDateTimeOptions && bookedDateTimeOptions[service_date]) {
        let result = bookedDateTimeOptions[service_date]
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
            start_service_datetime: service_date + "T" + service_time,
            end_service_datetime: service_date + "T" + endTime,
          };
          setBooking(jsonData);
          setIsSelectedPaymentType(true);
        } else {
          alert("please select other time");
        }
      } else {
        const jsonData = {
          ...booking,
          start_service_datetime: service_date + "T" + service_time,
          end_service_datetime: service_date + "T" + endTime,
        };
        setBooking(jsonData);
        setIsSelectedPaymentType(true);
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
    setIsReadyToBook(true);
  };

  const handleSubmitBooking = (event) => {
    event.preventDefault();
    PostAddCustomerBooking(booking).then((data) => console.log(data));
  };

  const serviceContent = () => {
    return (
      service && (
        <form onSubmit={handleSubmitSelectedService}>
          <label>Service</label>
          {service.map((item) => (
            <div>
              <input
                type="checkbox"
                name={item.id}
                value={item.id}
                onChange={handleSelectedService}
                disabled={isSelectedService}
              />
              <label>{item.service}</label>
            </div>
          ))}
          {!isSelectedService && (
            <button className="btn" type="submit">
              Submit Service
            </button>
          )}
        </form>
      )
    );
  };

  const dateContent = () => {
    return (
      dateOptions &&
      dateOptions.map((item) => (
        <button
          onClick={handleSubmitSelectedDate}
          value={item}
          key={item}
          className="btn"
        >
          {item}
        </button>
      ))
    );
  };

  const timeContent = () => {
    return (
      timeOptions &&
      timeOptions.map((item) => (
        <button
          onClick={handleSubmitSelectedTime}
          key={item}
          value={item}
          className="btn"
        >
          {item}
        </button>
      ))
    );
  };

  const paymentContent = () => {
    return (
      paymentType && (
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
      )
    );
  };

  const handleCancelBooking = (event) => {
    event.preventDefault();
    setIsSelectedCar(false);
    setSelectedService([]);
    setIsSelectedService(false);
    setIsSelectedTime(false);
    setIsSelectedPaymentType(false);
    setIsReadyToBook(false);
    setBooking([]);
  };

  return (
    <>
      <div className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Carcare</a>
        </div>
        <div className="flex-none gap-2">
          {/* <div className="form-control">
                  <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div> */}
          <div>
            <Button to="/customer/car" name="Customer Car" />
          </div>
          <div>
            <Button to="/customer/profile" name="Profile" />
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <div className="badge m-2">Phattraporn Bunjongket</div>
              {/* <li>
                      <a className="justify-between">
                        Profile
                      </a>
                    </li> */}
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <label name="plate_no">plate_no</label>
      {car ? (
        <form onSubmit={handleSubmitSelectedCar}>
          {isSelectedCar ? (
            <p>{booking.plate_no}</p>
          ) : (
            <select name="plate_no">
              {car.map((item) => (
                <option
                  key={item.id}
                  value={[item.plate_no, item.size_id, item.size, item.color]}
                >
                  {item.plate_no}
                </option>
              ))}
            </select>
          )}
          {!isSelectedCar && (
            <button type="submit" className="btn">
              Select Car
            </button>
          )}
        </form>
      ) : (
        <Button to="/customer/car" name="add car" />
      )}
      {isSelectedCar && serviceContent()}
      {isSelectedService && dateContent()}
      {isSelectedTime && timeContent()}
      {isSelectedPaymentType && paymentContent()}
      {isReadyToBook && (
        <button onClick={handleSubmitBooking} className="btn">
          Submit Booking
        </button>
      )}
      {booking.length != 0 && (
        <button onClick={handleCancelBooking} className="btn">
          Cancel Booking
        </button>
      )}
    </>
  );
};

export default CustomerBooking;
