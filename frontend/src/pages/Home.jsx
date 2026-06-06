import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/home.module.css";
import { motion } from "framer-motion";
import { AlertTriangle, Folder, CheckCircle, Users } from "lucide-react";
const statsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const statCardVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      scale: {
        type: "spring",
        bounce: 0.5,
      },
    },
  },
};

function useCountUpOnView(end, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          setStart(true);
        }
      },
      { threshold: 0.4 } // déclenche quand 40% visible
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      current += increment;

      if (current >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [start, end, duration]);

  return { count, ref };
}
const featureContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const featureCardVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      scale: {
        type: "spring",
        bounce: 0.5,
      },
    },
  },
};
function Home() {
  const navbarRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const projects = useCountUpOnView(250);
  const satisfaction = useCountUpOnView(98);
  const tasks = useCountUpOnView(15000);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className={styles.landing}>

      {/* ================= NAVBAR ================= */}
      <header
        ref={navbarRef}
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      >

        <div className={styles.logoSection}>
          <div className={styles.logoOrb}></div>
          <h2 className={styles.logo}>ProjectFlow</h2>
        </div>

        <nav className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#stats">Stats</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className={styles.navButtons}>
          <div className={styles.navButtons}>
            <motion.a
              href="/login"
              className={styles.primaryBtn}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Login
            </motion.a>

            <motion.a
              href="/register"
              className={styles.secondaryBtn}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Register
            </motion.a>
          </div>
        </div>

      </header>

      {/* ================= HERO ================= */}

      <section className={styles.hero}>

        <div className={styles.heroContent}>

          <span className={styles.badge}>
            🚀 Smart Project Management Platform
          </span>

          <h1  align="center">
            Organize Projects,
            <span> Manage Teams </span>
           
            and Deliver Faster.
          </h1>

          <p>
            ProjectFlow helps companies centralize projects,
            track tasks, monitor budgets and improve collaboration
            with a modern and intelligent dashboard.
          </p>

          <div className={styles.heroButtons}>

          <motion.a
            href="/register"
            className={styles.primaryBtn}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Start Free
          </motion.a>

          <motion.a
            href="#features"
            className={styles.secondaryBtn}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            Explore Features
          </motion.a>

          </div>

        </div>

        {/* FLOATING CARDS */}

        <div className={styles.heroCards}>

          <div className={styles.floatingCard}>
            <h3>📁 Active Projects</h3>
            <p>+124 Projects</p>
          </div>

          <div className={styles.floatingCard}>
            <h3>✅ Completed Tasks</h3>
            <p>2,840 Tasks</p>
          </div>

          <div className={styles.floatingCard}>
            <h3>👥 Team Collaboration</h3>
            <p>+320 Members</p>
          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section id="stats" className={styles.statsSection} ref={projects.ref}>

        {/* HEADER */}
        <div className={styles.sectionHeader}>
          <span>OUR IMPACT</span>
          <h2>Real Numbers Behind ProjectFlow</h2>
          <p>We help teams deliver faster, better and smarter.</p>
        </div>

        {/* CARDS WRAPPER */}
        <motion.div
  className={styles.statsGrid}
  variants={statsContainerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.3 }}
>

  <motion.div
    className={styles.statBox}
    variants={statCardVariants}
  >
    <Folder size={22} color="#60a5fa" />
    <h2>{projects.count}+</h2>
    <p>Projects Managed</p>
  </motion.div>

  <motion.div
    className={styles.statBox}
    variants={statCardVariants}
  >
    <CheckCircle size={22} color="#22c55e" />
    <h2>100%</h2>
    <p>Client Satisfaction</p>
  </motion.div>

  <motion.div
    className={styles.statBox}
    variants={statCardVariants}
  >
    <Users size={22} color="#a78bfa" />
    <h2>{tasks.count.toLocaleString()}+</h2>
    <p>Tasks Completed</p>
  </motion.div>

</motion.div>

      </section>

      {/* ================= AUTO SLIDER ================= */}

      <section className={styles.sliderSection}>

        <h2>
          Trusted by Modern Teams
        </h2>

        <div className={styles.sliderContainer}>

          <div className={styles.sliderTrack}>

            <div className={styles.slide}>Project Analytics</div>
            <div className={styles.slide}>Task Monitoring</div>
            <div className={styles.slide}>Budget Tracking</div>
            <div className={styles.slide}>Smart Reports</div>
            <div className={styles.slide}>Team Management</div>
            <div className={styles.slide}>Cloud Collaboration</div>

            <div className={styles.slide}>Project Analytics</div>
            <div className={styles.slide}>Task Monitoring</div>
            <div className={styles.slide}>Budget Tracking</div>
            <div className={styles.slide}>Smart Reports</div>
            <div className={styles.slide}>Team Management</div>
            <div className={styles.slide}>Cloud Collaboration</div>

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section
        id="features"
        className={styles.features}
      >

        <div className={styles.sectionHeader}>
          <span>POWERFUL FEATURES</span>
          <h2>
            Everything You Need
            to Manage Projects Efficiently
          </h2>
        </div>

        <motion.div
  className={styles.featureGrid}
  variants={featureContainerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  <motion.div
    className={styles.featureCard}
    variants={featureCardVariants}
  >
    <div className={styles.icon}>📊</div>
    <h3>Advanced Dashboard</h3>
    <p>
      Monitor projects, finances and tasks
      in real-time with interactive analytics.
    </p>
  </motion.div>

  <motion.div
    className={styles.featureCard}
    variants={featureCardVariants}
  >
    <div className={styles.icon}>📅</div>
    <h3>Task Scheduling</h3>
    <p>
      Organize deadlines and priorities
      using smart task management.
    </p>
  </motion.div>

  <motion.div
    className={styles.featureCard}
    variants={featureCardVariants}
  >
    <div className={styles.icon}>💰</div>
    <h3>Budget Tracking</h3>
    <p>
      Track expenses and monitor project
      budgets with visual reports.
    </p>
  </motion.div>

  <motion.div
    className={styles.featureCard}
    variants={featureCardVariants}
  >
    <div className={styles.icon}>👥</div>
    <h3>Team Collaboration</h3>
    <p>
      Improve communication and productivity
      through centralized teamwork.
    </p>
  </motion.div>
        </motion.div>

      </section>

      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className={styles.about}
      >

        <div className={styles.aboutContent}>

          <div>
            <span>ABOUT PROJECTFLOW</span>

            <h2>
              Modern Management Platform
              Designed For Productive Teams
            </h2>

            <p>
              ProjectFlow is a modern MERN Stack platform
              built to simplify project management,
              improve collaboration and optimize workflow
              for startups, companies and development teams.
            </p>

            <motion.button
              href="/login"
              className={styles.primaryBtn}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Learn More
            </motion.button>
          </div>

          <div className={styles.aboutCard}>
            <h3>⚡ Faster Workflow</h3>
            <p>
              Centralize all your tasks,
              projects and reports in one platform.
            </p>
          </div>

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section
        id="contact"
        className={styles.contact}
      >

        <div className={styles.contactCard}>

          <span>CONTACT US</span>

          <h2>
            Ready To Transform
            Your Project Management?
          </h2>

          <p>
            Join ProjectFlow today and boost
            productivity, collaboration and project success.
          </p>

          <div className={styles.contactButtons}>

            <button className={styles.primaryBtn}>
              Contact Support
            </button>

            <button className={styles.secondaryBtn}>
              Request Demo
            </button>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className={styles.footer}>

        <div className={styles.footerContainer}>

          {/* LEFT */}
          <div className={styles.footerBrand}>
            <h2>ProjectFlow</h2>
            <p>Smart Project Management Platform for modern teams.</p>
          </div>

          {/* LINKS */}
          <div className={styles.footerLinks}>
            <h4>Product</h4>
            <a href="#features">FEATURES</a>
            <a href="#stats">STATS</a>
            <a href="#about">ABOUT</a>
          </div>

          <div className={styles.footerLinks}>
            <h4>Support</h4>
            <a href="#contact">CONTACT</a>
            <a href="#">Help Center</a>
            <a href="#">Privacy</a>
          </div>

          {/* CTA / SOCIAL */}
          <div className={styles.footerCTA}>
            <h4>Get Started</h4>
            <p>Start using ProjectFlow today.</p>
            <button>Start Free</button>
          </div>

        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 ProjectFlow. All rights reserved.</p>
        </div>

      </footer>
    </div>
  );
}

export default Home;