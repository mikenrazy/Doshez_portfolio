import React, { useRef, useEffect } from 'react';
import { Github, Linkedin, Mail, Download, ChevronDown } from 'lucide-react';
import ThreeScene from './ThreeScene';
import './Hero.css';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);

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

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="hero">
      <ThreeScene />
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <div className="hero-subtitle">
              <span className="typing-indicator"></span>
              Hello, I'm
            </div>
            <h1 className="hero-title">
              Michael Odongo
            </h1>
            <div className="hero-roles">
              <span className="role-text">IT Specialist</span>
              <span className="role-separator">•</span>
              <span className="role-text">Tech Lead</span>
              <span className="role-separator">•</span>
              <span className="role-text">Full-Stack Developer</span>
            </div>
            <p className="hero-description">
              Experienced IT specialist with a passion for designing beautiful and functional systems. 
              Creative developer and innovator from Kenya, specializing in live streaming, 
              system administration, and cutting-edge web technologies.
            </p>
            
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">
                View My Work
              </a>
              <a href="#contact" className="btn btn-outline">
                Get In Touch
              </a>
            </div>

            <div className="hero-social">
              <a 
                href="https://github.com/mikenrazy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/mikenrazy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:odongonmichael@gmail.com"
                className="social-link"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <ChevronDown size={24} />
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;