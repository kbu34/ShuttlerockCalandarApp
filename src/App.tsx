import { useEffect, useState } from "react";
import "./App.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type CalandarEvent = {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
};

type MoonPhases = {
  Date: Date;
  Phase: number;
};

function moonToEvents(moonData: MoonPhases) {
  const moonEvent: CalandarEvent = {
    title: "Moon Phase: " + moonData.Phase,
    description: "Moon Phase: " + moonData.Phase,
    startTime: moonData.Date,
    endTime: moonData.Date,
  };
  return moonEvent;
}

function App() {
  const [eventList, setEventList] = useState<CalandarEvent[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    repeat: "none",
  });

  const moonDataFetch = async () => {
    await fetch(
      "https://craigchamberlain.github.io/moon-data/api/moon-phase-data/2024/"
    )
      .then((res) => res.json())
      .then((data) => {
        const moonList = [];
        for (let i = 0; i < data.length; i++) {
          const moonEvent = moonToEvents(data[i]);
          moonList.push(moonEvent);
        }
        setEventList([...eventList, ...moonList]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    moonDataFetch();
  }, []);

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const newEvents = [];
    const data: CalandarEvent = {
      title: formData.title,
      description: formData.description,
      startTime: startDate,
      endTime: endDate,
    };
    newEvents.push(data);

    if (formData.repeat === "weekly") {
      for (let i = 1; i < 100; i++) {
        const repeatStart = new Date(startDate);
        repeatStart.setDate(startDate.getDate() + 7 * i);
        const repeatEnd = new Date(endDate);
        repeatEnd.setDate(endDate.getDate() + 7 * i);

        const repeatData: CalandarEvent = {
          title: formData.title,
          description: formData.description,
          startTime: repeatStart,
          endTime: repeatEnd,
        };
        newEvents.push(repeatData);
      }
    } else if (formData.repeat === "monthly") {
      for (let i = 1; i < 100; i++) {
        const repeatStart = new Date(startDate);
        repeatStart.setMonth(startDate.getMonth() + i);
        const repeatEnd = new Date(endDate);
        repeatEnd.setMonth(endDate.getMonth() + i);

        const repeatData: CalandarEvent = {
          title: formData.title,
          description: formData.description,
          startTime: repeatStart,
          endTime: repeatEnd,
        };
        newEvents.push(repeatData);
      }
    } else if (formData.repeat === "annually") {
      for (let i = 1; i < 100; i++) {
        const repeatStart = new Date(startDate);
        repeatStart.setFullYear(startDate.getFullYear() + i);
        const repeatEnd = new Date(endDate);
        repeatEnd.setFullYear(endDate.getFullYear() + i);

        const repeatData: CalandarEvent = {
          title: formData.title,
          description: formData.description,
          startTime: repeatStart,
          endTime: repeatEnd,
        };
        newEvents.push(repeatData);
      }
    }

    setEventList(
      [...eventList, ...newEvents].sort(
        (a, b) =>
          -(
            Date.parse(b.startTime.toString()) -
            Date.parse(a.startTime.toString())
          )
      )
    );
    setFormData({
      title: "",
      description: "",
      repeat: "none",
    });
    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <div>
      <h1 className="flex justify-center mt-2 text-5xl">Calandar React App</h1>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="m-2">
            <label htmlFor="title">Title:</label>
            <input
              className="border-solid border-2"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="m-2">
            <label htmlFor="description">Description:</label>
            <input
              className="border-solid border-2"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="m-2">
            <label htmlFor="startTime">Start Time:</label>
            <DatePicker
              className="border-solid border-2"
              selected={startDate}
              showTimeSelect
              onChange={(date: Date) => setStartDate(date)}
            />
          </div>

          <div className="m-2">
            <label htmlFor="endTime">End Time:</label>
            <DatePicker
              className="border-solid border-2"
              selected={endDate}
              showTimeSelect
              onChange={(date: Date) => setEndDate(date)}
            />
          </div>

          <div className="radio">
            <label>Repeat:</label>
            <label>
              <input
                className="border-dashed"
                type="radio"
                value="none"
                name="repeat"
                checked={formData.repeat === "none"}
                onChange={handleChange}
              />
              None
            </label>

            <label>
              <input
                type="radio"
                value="weekly"
                name="repeat"
                checked={formData.repeat === "weekly"}
                onChange={handleChange}
              />
              Weekly
            </label>

            <label>
              <input
                type="radio"
                value="monthly"
                name="repeat"
                checked={formData.repeat === "monthly"}
                onChange={handleChange}
              />
              Monthly
            </label>

            <label>
              <input
                type="radio"
                value="annually"
                name="repeat"
                checked={formData.repeat === "annually"}
                onChange={handleChange}
              />
              Annually
            </label>
          </div>

          <button className="rounded-md w-14 mt-2" type="submit">
            Submit
          </button>
        </form>
      </div>
      <div className="list">
        <ul>
          {eventList.map((calandarEvent, index) => (
            <div key={index} className="bg-gray-200 rounded-md m-4 w-full">
              <li className="event">
                <p>{calandarEvent.title}</p>
                <p>Start: {new Date(calandarEvent.startTime).toString()}</p>
                <p>End: {new Date(calandarEvent.endTime).toString()}</p>
                <p>Description: {calandarEvent.description}</p>
                <button className="w-14 rounded-md">Edit</button>
                <button className="w-20 rounded-md">Delete</button>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
