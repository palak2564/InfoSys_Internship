import "./home.css"

const Home = () => {
  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="logo-text">CommUnity</div>
        </div>
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <p className="hero-text">
                Welcome to CommUnity, the ultimate platform designed to streamline housing society management and foster
                community connections. Whether you're a resident, administrator, or non-resident, CommUnity brings
                convenience to your fingertips with a comprehensive set of features tailored for everyone.
              </p>
              <a href="/signup" className="get-started-btn">
                Get Started
              </a>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2 className="about-heading">About CommUnity</h2>
          <p className="about-text">
            Our website is dedicated to providing seamless interaction and management within our community. We strive to
            offer the best services to ensure a cohesive and supportive environment for all members.
          </p>

          <div className="why-community">
            <h3 className="why-heading">Why CommUnity?</h3>
            <p className="why-text">
              CommUnity makes society management simple and efficient with seamless account management, instant access
              to a digital noticeboard, and easy online maintenance payments. Residents can raise and track complaints,
              join clubs, and share personal recommendations. Admins can post commercial updates and conduct polls. Stay
              informed with emergency contacts, security personnel details, and real-time WhatsApp notifications,
              ensuring a connected and engaged community experience.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="footer-logo-text">CommUnity</div>
        </div>
        <div className="tagline">Simplifying Society. Connecting Lives</div>
        <div className="contact-text">Contact us on</div>
        <div className="social-icons">
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="20" x="2" y="2" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="18" cy="6" r="1.5"></circle>
            </svg>
          </a>
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753c0-.249 1.51-2.772 1.818-4.013z"></path>
            </svg>
          </a>
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="20" x="2" y="2" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="18" cy="6" r="1.5"></circle>
            </svg>
          </a>
        </div>
        <div className="contact-info">
          <p className="email">CommUnityMail@gmail.com</p>
          <p className="phone">9898776655</p>
        </div>
      </footer>
    </div>
  )
}

export default Home