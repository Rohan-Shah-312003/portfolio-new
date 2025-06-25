"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Code,
  Github,
  Linkedin,
  Mail,
  MousePointer,
  Terminal,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useFrame } from "@react-three/fiber";

export default function Portfolio() {
  const isMobile = useMobile();
  const [activeSection, setActiveSection] = useState("about");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState("default");
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Form handling
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        });
        // Reset form
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast({
          title: "Error",
          description:
            data.error || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = ["about", "projects", "skills", "contact"];
  const sectionRefs = {
    about: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    contact: useRef(null),
  };

  // Handle mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = sectionRefs[section].current;
        if (!element) continue;

        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Optimize mouse tracking with throttling
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    let lastUpdate = 0;
    const throttleMs = 10; // Update at most every 10ms

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdate > throttleMs) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        lastUpdate = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion, isMobile]);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      mixBlendMode: "difference",
    },
    text: {
      x: mousePosition.x - 75,
      y: mousePosition.y - 75,
      height: 150,
      width: 150,
      backgroundColor: "rgba(255, 100, 255, 0.15)",
      mixBlendMode: "difference",
    },
    project: {
      x: mousePosition.x - 75,
      y: mousePosition.y - 75,
      height: 150,
      width: 150,
      backgroundColor: "rgba(100, 255, 255, 0.15)",
      mixBlendMode: "difference",
    },
  };

  const spring = {
    type: "spring",
    stiffness: 500,
    damping: 28,
  };

  const enterButton = (text) => {
    if (prefersReducedMotion || isMobile) return;
    setCursorText(text);
    setCursorVariant("text");
  };

  const enterProject = (text) => {
    if (prefersReducedMotion || isMobile) return;
    setCursorText(text);
    setCursorVariant("project");
  };

  const leaveButton = () => {
    if (prefersReducedMotion || isMobile) return;
    setCursorText("");
    setCursorVariant("default");
  };

  const projects = [
    {
      title: "AI Study Buddy",
      description:
        "An AI-powered study assistant that helps students prepare for exams with personalized quizzes.",
      tags: ["React", "Python", "TensorFlow", "NLP"],
      color: "from-pink-500 to-purple-500",
      link: "https://github.com/Rohan-Shah-312003/ai-study-buddy",
    },
    {
      title: "TUI-GPT",
      description:
        "An AI chatbot but instead of opening a browser and taking up your precious computer resources - it opens up in a terminal",
      tags: ["Golang", "tview", "tcell", "GroqAI"],
      color: "from-blue-500 to-cyan-500",
      link: "https://github.com/Rohan-Shah-312003/tui-gpt",
    },
    {
      title: "Audio Manipulator with Augmented Reality",
      description:
        "Change the pitch and tempo of an audio with the tip of your fingers without touching the device.",
      tags: ["Mediapipe", "Pyrubberband", "Node.js", "NextJS"],
      color: "from-green-500 to-emerald-500",
      link: "https://github.com/Rohan-Shah-312003/pitch-shifter",
    },
    {
      title: "Whiteboard For Code",
      description:
        "A .vsix extension which opens a whiteboard natively in your editor (VSCode/Windsurf/Cursor) for brainstorming while coding without needing for unnecessary context switching.",
      tags: ["NextJS", "Node.js", "Tailwind CSS"],
      color: "from-orange-500 to-amber-500",
      link: "https://github.com/Rohan-Shah-312003/whiteboard-for-code",
    },
  ];

  const skills = [
    { name: "Java", icon: <Code className="h-6 w-6" />, level: 98 },
    { name: "JavaScript", icon: <Code className="h-6 w-6" />, level: 90 },
    { name: "React", icon: <Zap className="h-6 w-6" />, level: 90 },
    { name: "Python", icon: <Terminal className="h-6 w-6" />, level: 80 },
    { name: "Node.js", icon: <Code className="h-6 w-6" />, level: 75 },
    { name: "TypeScript", icon: <Code className="h-6 w-6" />, level: 70 },
    { name: "Machine Learning", icon: <Zap className="h-6 w-6" />, level: 65 },
    { name: "Golang", icon: <Zap className="h-6 w-6" />, level: 65 },
  ];

  if (!mounted) {
    return null; // Avoid rendering until client-side to prevent hydration issues
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white overflow-hidden">
      {!isMobile && !prefersReducedMotion && (
        <motion.div
          className="fixed top-0 left-0 z-50 rounded-full pointer-events-none flex items-center justify-center text-center font-bold text-sm dark:mix-blend-difference"
          variants={variants}
          animate={cursorVariant}
          transition={spring}
        >
          {cursorText && <span>{cursorText}</span>}
        </motion.div>
      )}

      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/30 via-white to-white dark:from-purple-900/20 dark:via-black dark:to-black pointer-events-none z-0"></div>
      <nav className="fixed top-0 left-0 w-full z-40 bg-white/50 dark:bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            <a href="#">Rohan Shah</a>
          </div>
          <div className="flex space-x-6 items-center">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => {
                  sectionRefs[section].current.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeSection === section
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
                onMouseEnter={() => enterButton(section)}
                onMouseLeave={leaveButton}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <section
        ref={sectionRefs.about}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20"
      >
        {!isMobile && !prefersReducedMotion && <AboutBackground />}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] [mask-image:radial-gradient(white,transparent_85%)] dark:bg-grid-white/[0.02] dark:bg-[size:50px_50px] dark:[mask-image:radial-gradient(white,transparent_85%)]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Hello, I'm Rohan Shah
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
              Final year Computer Science student passionate about building
              innovative solutions that make a difference.
            </p>
          </motion.div>

          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onMouseEnter={() => enterButton("View Projects")}
              onMouseLeave={leaveButton}
              onClick={() =>
                sectionRefs.projects.current.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              View Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onMouseEnter={() => enterButton("Download CV")}
              onMouseLeave={leaveButton}
              onClick={() => {
                window.open("/resume.pdf", "_blank");
              }}
            >
              Download CV
            </Button>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <MousePointer className="h-6 w-6 text-zinc-500" />
          </div>
        </div>
      </section>

      <section
        ref={sectionRefs.projects}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-white dark:bg-black"
      >
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              My{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Projects
              </span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Here are some of the projects I've worked on during my academic
              journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={prefersReducedMotion ? {} : { y: -5 }}
                onMouseEnter={() => enterProject(project.title)}
                onMouseLeave={leaveButton}
              >
                <Card className="overflow-hidden bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
                  <div
                    className={`h-2 w-full bg-gradient-to-r ${project.color}`}
                  ></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a href={project.link} target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        View Project <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={sectionRefs.skills}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-white dark:bg-black"
      >
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              My{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                Skills
              </span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Technologies and skills I've mastered throughout my academic
              journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                onMouseEnter={() => enterButton(skill.name)}
                onMouseLeave={leaveButton}
              >
                <Card className="overflow-hidden bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="mr-3 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        {skill.icon}
                      </div>
                      <h3 className="text-xl font-bold">{skill.name}</h3>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 mb-4">
                      <motion.div
                        initial={
                          prefersReducedMotion
                            ? { width: `${skill.level}%` }
                            : { width: 0 }
                        }
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                      ></motion.div>
                    </div>
                    <p className="text-right text-sm text-zinc-600 dark:text-zinc-400">
                      {skill.level}%
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <h3 className="text-xl font-bold mb-6">
              Other Technologies I Work With
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Git",
                "AWS",
                "MongoDB",
                "GraphQL",
                "Express",
                "Supabase",
                "TensorFlow",
                "Spring Boot",
                "Flask",
                "FastAPI",
                "SQL",
              ].map((tech, index) => (
                <motion.span
                  key={index}
                  whileHover={prefersReducedMotion ? {} : { y: -5 }}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        ref={sectionRefs.contact}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-white dark:bg-black"
      >
        <div className="container mx-auto relative z-10 max-w-4xl">
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Get In{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                Touch
              </span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              I'm currently looking for new opportunities. Whether you have a
              question or just want to say hi, I'll get back to you!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -20 }
              }
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 h-full">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-zinc-400" />
                      <a
                        href="mailto:rohan312003@gmail.com"
                        className="hover:text-purple-400 transition-colors"
                      >
                        rohan312003@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Github className="h-5 w-5 mr-3 text-zinc-400" />
                      <a
                        href="https://github.com/Rohan-Shah-312003"
                        target="_blank"
                        className="hover:text-purple-400 transition-colors"
                      >
                        github.com/Rohan-Shah-312003
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Linkedin className="h-5 w-5 mr-3 text-zinc-400" />
                      <a
                        href="https://www.linkedin.com/in/aokira31/"
                        target="_blank"
                        className="hover:text-purple-400 transition-colors"
                      >
                        linkedin.com/in/aokira31
                      </a>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Location</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Kolkata, West Bengal, India
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: 20 }
              }
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-6">Send Me a Message</h3>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      ></textarea>
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onMouseEnter={() => enterButton("Send Message")}
                      onMouseLeave={leaveButton}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-zinc-100 dark:bg-zinc-950 py-8 border-t border-zinc-200 dark:border-zinc-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-zinc-500">
            © {new Date().getFullYear()} rohan shah. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link
              href="https://github.com/Rohan-Shah-312003"
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="#"
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="#"
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

function AboutBackground() {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // Skip rendering 3D elements if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene isDarkMode={theme === "dark"} />
      </Canvas>
    </div>
  );
}

function Scene({ isDarkMode }) {
  const groupRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (groupRef.current && !prefersReducedMotion) {
      // Reduce rotation speed for better performance
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x += delta * 0.025;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[-3, -1, -2]}>
          <torusKnotGeometry args={[0.5, 0.2, 64, 16]} />
          <meshStandardMaterial
            color={isDarkMode ? "#9333ea" : "#a855f7"}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
      </Float>

      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[3, 1, -3]}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color={isDarkMode ? "#ec4899" : "#db2777"}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </Float>

      <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, -2, -1]}>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color={isDarkMode ? "#3b82f6" : "#2563eb"}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </Float>

      <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[2, -3, -2]}>
          <icosahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color={isDarkMode ? "#f97316" : "#ea580c"}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </Float>
    </group>
  );
}
