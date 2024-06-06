import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const Button = ({ to, name }) => {
  return (
    <Link to={to}>
      <button className="btn m-2">{name}</button>
    </Link>
  );
};

export const TimeFormat = (time) => {
  const [hour, mins] = time
    .toLocaleTimeString("th-TH", { hour12: false })
    .split(":");
  return `${hour}:${mins}`;
};

export const DefaultTimeOptions = () => {
  let timeOptions = [];
  let newTimeOptions = new Date();
  newTimeOptions.setHours(8, 0, 0);
  let tempMaxTime = new Date();
  tempMaxTime.setHours(17, 30, 0);
  let maxTime = TimeFormat(tempMaxTime);

  do {
    const dateToInput = TimeFormat(newTimeOptions);
    timeOptions.push(dateToInput);
    newTimeOptions.setMinutes(newTimeOptions.getMinutes() + 30);
  } while (!timeOptions.includes(maxTime));

  return timeOptions;
};

export const FetchBooking = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/admin/booking");
    const { status, msg } = response.data;
    if (status == "SUCCESS") {
      let bookedDateTime = {};
      msg.map((item) => {
        const {
          id,
          start_service_datetime,
          end_service_datetime,
          service_usetime,
        } = item;
        const [startDate, startTime] = start_service_datetime.split("T");
        const [startHour, startMins] = startTime.split(".")[0].split(":");
        const start_service_time = startHour + ":" + startMins;
        const [endDate, endTime] = end_service_datetime.split("T");
        const [endHour, endMins] = endTime.split(".")[0].split(":");
        const end_service_time = endHour + ":" + endMins;
        if (bookedDateTime[startDate]) {
          bookedDateTime[startDate].push({
            id: id,
            start_service_time: start_service_time,
            end_service_time: end_service_time,
            service_usetime: service_usetime,
          });
        } else {
          bookedDateTime[startDate] = [
            {
              id: id,
              start_service_time: start_service_time,
              end_service_time: end_service_time,
              service_usetime: service_usetime,
            },
          ];
        }
      });
      return bookedDateTime;
    } else {
      console.log(msg);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const FetchCarSize = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/admin/carsize");
    const { status, msg } = response.data;
    if (status == "SUCCESS") {
      return msg;
    } else {
      console.log(msg);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getDatesForCurrentWeek = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - currentDay);

  let weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    weekDates.push(date.toISOString().split("T")[0]);
  }

  return weekDates;
};
