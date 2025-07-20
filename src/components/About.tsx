import React, { useRef, useEffect } from 'react';
import { MapPin, Phone, Mail, Linkedin } from 'lucide-react';
import './About.css';

const About: React.FC = () => {
  const aboutRef = useRef<HTMLElement>(null);

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
              <p>
                I'm an experienced IT specialist with a demonstrated history of working 
                in the computer networking industry. As a creative developer and innovator, 
                I have a passion for designing beautiful and functional systems that make 
                a real impact.
              </p>
              <p>
                Currently serving as Tech Lead at dx u (formerly CIO Africa), I bring 
                expertise in system administration, live streaming technologies, 
                web development, and cybersecurity. My goal is to develop my skills 
                in organizations that offer both challenge and opportunity for personal 
                initiative and career advancement.
              </p>
              <p>
                Based in Butere, Kenya, I'm always excited to work on innovative 
                projects that push the boundaries of technology and create meaningful 
                solutions for users worldwide.
              </p>
            </div>
          </div>

          <div className="about-info">
            <div className="info-card glass">
              <h3>Contact Information</h3>
              <div className="contact-list">
                <div className="contact-item">
                  <MapPin size={18} />
                  <span>Butere, Kenya</span>
                </div>
                <div className="contact-item">
                  <Phone size={18} />
                  <span>+254713974061</span>
                </div>
                <div className="contact-item">
                  <Mail size={18} />
                  <span>odongonmichael@gmail.com</span>
                </div>
                <div className="contact-item">
                  <Linkedin size={18} />
                  <a href="https://www.linkedin.com/in/mikenrazy" target="_blank" rel="noopener noreferrer">
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