"use client"

import { useState, useEffect } from "react"
import "./Events.css"
import { MessageCircle, Star } from "lucide-react"

const Events = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newFeedback, setNewFeedback] = useState({
    rating: 0,
    comment: "",
    eventId: null,
  })

  // API Base URLs
  const EVENTS_API_URL = "http://localhost:8080/events"
  const FEEDBACK_API_URL = "http://localhost:8080/feedback"

  // Fetch events from Spring Boot backend
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(EVENTS_API_URL)
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

  const fetchFeedbacks = async (eventId) => {
    try {
      const response = await fetch(`${FEEDBACK_API_URL}/event/${eventId}`)
      if (response.ok) {
        const data = await response.json()
        setFeedbacks(data)
      } else {
        console.error('Failed to fetch feedbacks')
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
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

  const isPastEvent = (dateString) => {
    const eventDate = parseDate(dateString)
    const today = new Date()
    return eventDate < today
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

  const handleSubmitFeedback = async () => {
    try {
      const feedback = {
        rating: newFeedback.rating,
        comment: newFeedback.comment,
        eventId: selectedEvent.id
      }

      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      })

      if (response.ok) {
        // Refresh feedback list after successful addition
        fetchFeedbacks(selectedEvent.id)
        setNewFeedback({ rating: 0, comment: "", eventId: null })
      } else {
        console.error('Failed to add feedback')
      }
    } catch (error) {
      console.error('Error adding feedback:', error)
    }
  }

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target
    setNewFeedback({
      ...newFeedback,
      [name]: value,
    })
  }

  const handleRatingChange = (rating) => {
    setNewFeedback({
      ...newFeedback,
      rating: rating,
    })
  }

  const openFeedbackModal = (event) => {
    setSelectedEvent(event)
    setNewFeedback({
      rating: 0,
      comment: "",
      eventId: event.id
    })
    setIsFeedbackOpen(true)
    fetchFeedbacks(event.id)
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
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      )
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayEvents = getEventsForDay(date)
      const isCurrentDay = isToday(date)

      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isCurrentDay ? 'today' : ''}`}
        >
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.map((event) => (
              <div 
                key={event.id} 
                className={`event-item ${isPastEvent(event.date) ? 'past-event' : ''}`}
                onClick={() => isPastEvent(event.date) && openFeedbackModal(event)}
              >
                <span className="event-time">{event.time}</span>
                <span className="event-title">{event.title}</span>
                {isPastEvent(event.date) && (
                  <span className="feedback-icon">
                    <MessageCircle size={14} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }

    return days
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          size={24} 
          fill={i <= newFeedback.rating ? "#ffb400" : "none"} 
          color={i <= newFeedback.rating ? "#ffb400" : "#ddd"}
          onClick={() => handleRatingChange(i)}
          className="star-icon"
        />
      )
    }
    return stars
  }

  const formatFeedbackDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")} ${date.getHours() >= 12 ? 'PM' : 'AM'}`
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
      {/* Hero Section */}
      <div className="event-hero-section">
        <div className="hero-content">
          <h1>Community Events</h1>
          <p>Stay updated with all the upcoming events in your society</p>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="calendar-section">
        <div className="calendar-navigation">
          <div>
            <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
          </div>
          <div className="calendar-controls">
            <button className="nav-btn" onClick={prevMonth}>
              &lt;
            </button>
            <button className="today-btn" onClick={goToToday}>
              Today
            </button>
            <button className="nav-btn" onClick={nextMonth}>
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
              <div className="calendar-loading">
                Loading events...
              </div>
            ) : (
              renderCalendar()
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {isFeedbackOpen && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content feedback-modal">
            <div className="modal-header">
              <h3>Feedback - {selectedEvent.title}</h3>
              <button className="close-btn" onClick={() => setIsFeedbackOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="event-details">
                <h4>{selectedEvent.title}</h4>
                <p>{selectedEvent.description}</p>
                <div className="event-date">
                  {selectedEvent.date} at {selectedEvent.time}
                </div>
              </div>

              <div className="feedback-section">
                <h4>Give Feedback</h4>
                <div className="rating-stars">
                  {renderStars(newFeedback.rating)}
                </div>
                <textarea
                  name="comment"
                  value={newFeedback.comment}
                  onChange={handleFeedbackChange}
                  placeholder="Share your experience with this event..."
                  className="feedback-textarea"
                ></textarea>
                <button 
                  className="give-feedback-btn"
                  onClick={handleSubmitFeedback}
                >
                  Give Feedback
                </button>
              </div>

              <div className="feedback-list">
                <h4>Feedbacks by the Residents</h4>
                <div>
                  {feedbacks.length === 0 ? (
                    <div className="no-feedback">
                      No feedbacks yet.
                    </div>
                  ) : (
                    feedbacks.map((feedback, index) => (
                      <div key={index} className="feedback-item">
                        <div className="feedback-header">
                          <div className="feedback-stars">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                fill={i < feedback.rating ? "#ffb400" : "none"}
                                color={i < feedback.rating ? "#ffb400" : "#ddd"}
                              />
                            ))}
                          </div>
                          <div className="feedback-date">
                            {formatFeedbackDate(feedback.createdAt)}
                          </div>
                        </div>
                        <div className="feedback-comment">
                          {feedback.comment}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Events