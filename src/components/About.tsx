import React, { useRef, useEffect } from 'react';
import { MapPin, Phone, Mail, Linkedin } from 'lucide-react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import './About.css';

const About: React.FC = () => {
  const aboutRef = useRef<HTMLElement>(null);
  const { getContent } = usePortfolioData();

  // Get dynamic content
  const bioContent = getContent('about', 'bio', {
    paragraphs: [
      "I'm an experienced IT specialist with a demonstrated history of working in the computer networking industry.",
      "Currently serving as Tech Lead at dx u (formerly CIO Africa), I bring expertise in system administration.",
      "Based in Butere, Kenya, I'm always excited to work on innovative projects."
    ]
  });

  const contactInfo = getContent('contact', 'info', {
    email: 'odongonmichael@gmail.com',
    phone: '+254713974061',
    location: 'Butere, Kenya',
    linkedin: 'https://www.linkedin.com/in/mikenrazy'
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={aboutRef} id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">About Me</h2>
            <div className="about-description">
              {bioContent.paragraphs.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="about-info">
            <div className="info-card glass">
              <h3>Contact Information</h3>
              <div className="contact-list">
                <div className="contact-item">
                  <MapPin size={18} />
                  <span>{contactInfo.location}</span>
                </div>
                <div className="contact-item">
                  <Phone size={18} />
                  <span>{contactInfo.phone}</span>
                </div>
                <div className="contact-item">
                  <Mail size={18} />
                  <span>{contactInfo.email}</span>
                </div>
                <div className="contact-item">
                  <Linkedin size={18} />
                  <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>

            <div className="education-card glass">
              <h3>Education</h3>
              <div className="education-item">
                <h4>Bachelor of Science in Information Technology</h4>
                <p>Jomo Kenyatta University of Agriculture and Technology</p>
                <span className="year">2014 - 2017</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;