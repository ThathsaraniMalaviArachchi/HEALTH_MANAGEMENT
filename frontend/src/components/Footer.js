"use client"

import React from "react"

// Regular CSS instead of Tailwind
const footerStyles = {
  footer: {
    background: "linear-gradient(to right, #1a202c, #2a4365)",
    color: "white",
    marginTop: "auto",
    width: "100%",
  },
  container: {
    width: "100%",
    padding: "3rem 1rem",
  },
  contentContainer: {
    width: "100%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "3rem",
  },
  branding: {
    marginBottom: "1rem",
  },
  gradientText: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    background: "linear-gradient(to right, #63b3ed, #4fd1c5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  description: {
    color: "#a0aec0",
    lineHeight: "1.5",
    marginBottom: "1rem",
  },
  socialIcons: {
    display: "flex",
    gap: "1rem",
    marginTop: "0.5rem",
  },
  socialIcon: {
    color: "#a0aec0",
    transition: "color 0.2s",
  },
  heading: {
    fontSize: "1.125rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  linksList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  linkItem: {
    marginBottom: "0.5rem",
  },
  link: {
    color: "#a0aec0",
    textDecoration: "none",
    transition: "color 0.2s",
  },
  divider: {
    borderTop: "1px solid #2d3748",
    marginTop: "3rem",
    paddingTop: "2rem",
    textAlign: "center",
    color: "#a0aec0",
  },
  // Media query handled with JavaScript
  "@media (min-width: 768px)": {
    grid: {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
  },
}

// Apply hover effect programmatically
const applyHoverEffect = (e) => {
  e.target.style.color = "white"
}

const removeHoverEffect = (e) => {
  e.target.style.color = "#a0aec0"
}

export default function Footer() {
  const quickLinks = ["About Us", "Features", "Privacy Policy"]
  const resources = ["Blog", "Support", "FAQ"]
  const legal = ["Terms of Service", "Privacy Policy", "Cookie Policy"]

  // Apply media query with JavaScript
  const [isDesktop, setIsDesktop] = React.useState(false)

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const gridStyle = {
    ...footerStyles.grid,
    gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "repeat(1, 1fr)",
  }

  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.container}>
        <div style={footerStyles.contentContainer}>
          <div style={gridStyle}>
            <div style={footerStyles.branding}>
              <h3 style={footerStyles.gradientText}>🏥 HealthTracker</h3>
              <p style={footerStyles.description}>Empowering you to take control of your health journey.</p>
              <div style={footerStyles.socialIcons}>
                <a
                  href="#"
                  style={footerStyles.socialIcon}
                  onMouseEnter={applyHoverEffect}
                  onMouseLeave={removeHoverEffect}
                >
                  <span
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "1px",
                      padding: "0",
                      margin: "-1px",
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      borderWidth: "0",
                    }}
                  >
                    Twitter
                  </span>
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  style={footerStyles.socialIcon}
                  onMouseEnter={applyHoverEffect}
                  onMouseLeave={removeHoverEffect}
                >
                  <span
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "1px",
                      padding: "0",
                      margin: "-1px",
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      borderWidth: "0",
                    }}
                  >
                    LinkedIn
                  </span>
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="#"
                  style={footerStyles.socialIcon}
                  onMouseEnter={applyHoverEffect}
                  onMouseLeave={removeHoverEffect}
                >
                  <span
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "1px",
                      padding: "0",
                      margin: "-1px",
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      borderWidth: "0",
                    }}
                  >
                    GitHub
                  </span>
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 style={footerStyles.heading}>Quick Links</h3>
              <ul style={footerStyles.linksList}>
                {quickLinks.map((item) => (
                  <li key={item} style={footerStyles.linkItem}>
                    <a
                      href="#"
                      style={footerStyles.link}
                      onMouseEnter={applyHoverEffect}
                      onMouseLeave={removeHoverEffect}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isDesktop ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
                gap: "2rem",
              }}
            >
              <div>
                <h3 style={footerStyles.heading}>Resources</h3>
                <ul style={footerStyles.linksList}>
                  {resources.map((item) => (
                    <li key={item} style={footerStyles.linkItem}>
                      <a
                        href="#"
                        style={footerStyles.link}
                        onMouseEnter={applyHoverEffect}
                        onMouseLeave={removeHoverEffect}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={footerStyles.heading}>Legal</h3>
                <ul style={footerStyles.linksList}>
                  {legal.map((item) => (
                    <li key={item} style={footerStyles.linkItem}>
                      <a
                        href="#"
                        style={footerStyles.link}
                        onMouseEnter={applyHoverEffect}
                        onMouseLeave={removeHoverEffect}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div style={footerStyles.divider}>
            <p>© {new Date().getFullYear()} HealthTracker. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

