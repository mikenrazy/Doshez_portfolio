import React, { useRef, useEffect } from 'react';
import { Github, Linkedin, Mail, Download, ChevronDown } from 'lucide-react';
import ThreeScene from './ThreeScene';
import { usePortfolioData } from '../hooks/usePortfolioData';
import './Hero.css';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { getContent } = usePortfolioData();

  // Get dynamic content
  const personalInfo = getContent('hero', 'personal_info', {
    name: 'Michael Odongo',
    title: 'IT Specialist',
    roles: ['IT Specialist', 'Tech Lead', 'Full-Stack Developer'],
    description: 'Experienced IT specialist with a passion for designing beautiful and functional systems.',
    profile_image: '/api/placeholder/400/400'
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
              {personalInfo.name}
            </h1>
            <div className="hero-roles">
              {personalInfo.roles.map((role: string, index: number) => (
                <React.Fragment key={role}>
                  <span className="role-text">{role}</span>
                  {index < personalInfo.roles.length - 1 && (
                    <span className="role-separator">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="hero-description">
              {personalInfo.description}
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