"use client"

import { useState, useEffect } from "react"
import "./EventManagement.css"
import { PlusCircle } from "lucide-react"

const EventManagement = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState([])
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "12:00",
    description: "",
  })

  const API_BASE_URL = "http://localhost:8080/events"

  // Fetch events from Spring Boot backend
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_BASE_URL)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        console.error('Failed to fetch events')
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calendar date functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
  }

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const isToday = (date) => {
    const today = new Date()
    return isSameDay(date, today)
  }

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const eventDate = parseDate(event.date)
      return isSameDay(eventDate, day)
    })
  }

  // Navigation functions
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  // Event handling
  const handleAddEvent = async () => {
    try {
      const event = {
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        description: newEvent.description,
      }

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })

      if (response.ok) {
        // Refresh event list after successful addition
        fetchEvents()
        setNewEvent({ title: "", date: "", time: "12:00", description: "" })
        setIsAddEventOpen(false)
      } else {
        console.error('Failed to add event')
      }
    } catch (error) {
      console.error('Error adding event:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewEvent({
      ...newEvent,
      [name]: value,
    })
  }

  // Render calendar
  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayEvents = getEventsForDay(date)
      const isCurrentDay = isToday(date)

      days.push(
        <div key={`day-${day}`} className={`calendar-day ${isCurrentDay ? "today" : ""}`}>
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.map((event) => (
              <div key={event.id} className="event-item">
                <span className="event-time">{event.time}</span>
                <span className="event-title">{event.title}</span>
              </div>
            ))}
          </div>
        </div>,
      )
    }

    return days
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="events-container">
      {/* Big Add Event Hero Section */}
      <div className="event-hero-section">
        <div className="hero-content">
          <h1>Community Events</h1>
          <p>Stay updated with all the upcoming events in your society</p>
          <button className="hero-add-event-btn" onClick={() => setIsAddEventOpen(true)}>
            <PlusCircle size={24} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="calendar-section">
        <div className="calendar-navigation">
          <h3>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="calendar-controls">
            <button onClick={prevMonth} className="nav-btn prev-btn">
              &lt;
            </button>
            <button onClick={goToToday} className="today-btn">
              today
            </button>
            <button onClick={nextMonth} className="nav-btn next-btn">
              &gt;
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="calendar">
          <div className="calendar-header">
            {dayNames.map((day) => (
              <div key={day} className="calendar-day-name">
                {day}
              </div>
            ))}
          </div>
          <div className="calendar-body">
            {isLoading ? (
              <div className="calendar-loading">Loading events...</div>
            ) : (
              renderCalendar()
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Event</h3>
              <button className="close-btn" onClick={() => setIsAddEventOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="image-upload">
                <div className="upload-placeholder">
                  <span>Add image</span>
                </div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter the event name here..."
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={newEvent.date} 
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time" 
                  name="time" 
                  value={newEvent.time} 
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <textarea
                  name="description"
                  placeholder="Enter the description here..."
                  value={newEvent.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="add-event-submit" onClick={handleAddEvent}>
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventManagement