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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventList, setEventList] = useState<CalandarEvent[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const moonDataFetch = async () => {
    await fetch(
      "https://craigchamberlain.github.io/moon-data/api/moon-phase-data/2023/"
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
    const data: CalandarEvent = {
      title: formData.title,
      description: formData.description,
      startTime: startDate,
      endTime: endDate,
    };
    setEventList(
      [...eventList, data].sort(
        (a, b) =>
          -(
            Date.parse(b.startTime.toString()) -
            Date.parse(a.startTime.toString())
          )
      )
    );
  };

  return (
    <div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <label htmlFor="description">Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label htmlFor="startTime">Start Time:</label>
          <DatePicker
            selected={startDate}
            showTimeSelect
            onChange={(date: Date) => setStartDate(date)}
          />

          <label htmlFor="endTime">End Time:</label>
          <DatePicker
            selected={endDate}
            showTimeSelect
            onChange={(date: Date) => setEndDate(date)}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="list">
        <ul>
          {eventList.map((calandarEvent, index) => (
            <div>
              <li key={index}>
                <p>{calandarEvent.title}</p>
                <p>{new Date(calandarEvent.startTime).toDateString()}</p>
                <button>Edit</button>
                <button>Delete</button>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
