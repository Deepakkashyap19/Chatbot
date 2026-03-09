import User from "../models/user.model.js";
import Bot from "../models/bot.model.js";

// Cache for faster responses
const responseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Optimized bot responses with faster lookup
const BOT_RESPONSES = {
  // GREETINGS - Most common responses first for faster matching
  "hello": "Hello! How can I help you today?",
  "hi": "Hi there! What can I do for you?",
  "hey": "Hey! How are you doing?",
  "bye": "Goodbye! Best of luck with your interview!",
  "thank you": "You're welcome! Feel free to ask anything anytime.",
  "thanks": "Happy to help! Is there anything else you need?",
  "good morning": "Good morning! Hope you have a great day ahead.",
  "good afternoon": "Good afternoon! How can I assist you?",
  "good evening": "Good evening! What can I help you with?",
  "good night": "Good night! Take care and rest well.",
  "how are you": "I'm doing great, thank you for asking! How about you?",
  "what's up": "All good here! What can I help you with today?",

  // INTERVIEW BASICS
  "tell me an interview question": "Tell me about yourself.",
  "common hr question": "Why should we hire you?",
  "what is strength and weakness": "Strength is your positive trait, weakness is what you are improving.",
  "what is teamwork": "Teamwork is working together to achieve a common goal.",
  "what is leadership": "Leadership is guiding and motivating a team towards success.",
  "what is communication skill": "The ability to convey ideas clearly and effectively.",
  "what is problem solving": "The ability to analyze a problem and find effective solutions.",
  "what is critical thinking": "Critical thinking is analyzing facts logically to form a judgment.",
  "what is time management": "The ability to use time efficiently to complete tasks.",
  "what is coding interview": "A coding interview tests problem-solving and programming skills.",
  "what is behavioral interview": "Behavioral interviews assess how you handled past situations.",
  "how to introduce yourself": "Start with your name, background, skills, and goals.",
  "what is resume": "A resume is a summary of your education, experience, and skills.",
  "what is cover letter": "A cover letter is a personalized letter sent with a resume.",
  "what is aptitude test": "An aptitude test measures logical reasoning and problem-solving ability.",
  "what is technical round": "A technical round tests your subject knowledge and coding skills.",
  "what is hr round": "HR round checks personality, communication, and cultural fit.",
  "how to crack interview": "Prepare well, practice questions, and stay confident.",
  "what is group discussion": "Group discussion tests communication, knowledge, and teamwork.",

  // HR INTERVIEW QUESTIONS
  "where do you see yourself in 5 years": "I see myself growing with this company, taking on more responsibilities and contributing to its success.",
  "what are your career goals": "My goal is to continuously learn, grow professionally, and make meaningful contributions to my field.",
  "why do you want to work here": "I admire this company's values, culture, and the impact it creates. I believe I can contribute and grow here.",
  "what motivates you": "I am motivated by challenges, learning new things, and achieving results that make a real difference.",
  "what is your biggest achievement": "My biggest achievement was successfully completing a major project under tight deadlines while leading a small team.",
  "what is your biggest failure": "I once missed a deadline due to poor planning. I learned from it and now I prioritize time management.",
  "how do you handle pressure": "I stay calm, prioritize tasks, and focus on solutions rather than stressing about the problem.",
  "are you a team player": "Yes, I strongly believe that collaboration and communication are key to any team's success.",
  "do you have any questions for us": "Yes! What does a typical day look like for this role? What are the growth opportunities?",
  "what is your expected salary": "I am open to a competitive salary based on industry standards and the responsibilities of the role.",
  "are you willing to relocate": "Yes, I am open to relocation if the opportunity requires it.",
  "how do you handle conflict": "I address conflicts calmly by listening to all sides and finding a respectful, solution-focused resolution.",
  "describe yourself in one word": "I would describe myself as 'adaptable' – I embrace change and learn quickly.",
  "what makes you unique": "My combination of technical skills, strong communication, and problem-solving mindset makes me stand out.",
  "why should we not hire you": "I sometimes focus too much on details, but I am learning to balance perfectionism with efficiency.",
  "what are your hobbies": "I enjoy coding, reading tech blogs, and participating in online hackathons in my free time.",

      // TECHNICAL
      "what is react": "React is a JavaScript library for building fast and interactive user interfaces.",
      "what is nodejs": "Node.js is a JavaScript runtime that allows running JS on the server side.",
      "what is mongodb": "MongoDB is a NoSQL database that stores data in flexible JSON-like documents.",
      "what is javascript": "JavaScript is a programming language used to make web pages interactive.",
      "react": "React is a JavaScript library for building fast and interactive user interfaces.",
      "nodejs": "Node.js is a JavaScript runtime that allows running JS on the server side.",
      "mongodb": "MongoDB is a NoSQL database that stores data in flexible JSON-like documents.",
      "javascript": "JavaScript is a programming language used to make web pages interactive.",
      "what is react?": "React is a JavaScript library for building fast and interactive user interfaces.",
      "what is nodejs?": "Node.js is a JavaScript runtime that allows running JS on the server side.",
      "what is mongodb?": "MongoDB is a NoSQL database that stores data in flexible JSON-like documents.",
      "what is javascript?": "JavaScript is a programming language used to make web pages interactive.",
      "what is react ?": "React is a JavaScript library for building fast and interactive user interfaces.",
      "what is nodejs ?": "Node.js is a JavaScript runtime that allows running JS on the server side.",
      "what is mongodb ?": "MongoDB is a NoSQL database that stores data in flexible JSON-like documents.",
      "what is javascript ?": "JavaScript is a programming language used to make web pages interactive.",

  // DEFAULT
  "default": "I'm not sure I understand. Could you please rephrase your question? I can help you with:\n- Technical interview questions\n- HR interview preparation\n- Programming concepts\n- Resume tips\n- Interview strategies\n- System design basics\n- Coding best practices\n- Career guidance"
};

const Message = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { text } = req.body;

    // Input validation with early return for faster response
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text cannot be empty" });
    }

    const normalizedText = text.toLowerCase().trim();
    
    // Check cache first for faster response
    const cacheKey = `response:${normalizedText}`;
    if (responseCache.has(cacheKey)) {
      const cached = responseCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return res.status(200).json({
          userMessage: text.trim(),
          botMessage: cached.response,
          cached: true,
          responseTime: Date.now() - startTime
        });
      }
    }

    // Fast response lookup
    const botResponse = BOT_RESPONSES[normalizedText] || BOT_RESPONSES["default"];

    // Cache the response for future use
    responseCache.set(cacheKey, {
      response: botResponse,
      timestamp: Date.now()
    });

    // Skip database operations entirely for maximum performance
    // Database operations were causing 10+ second timeouts
    const responseTime = Date.now() - startTime;

    return res.status(200).json({
      userMessage: text.trim(),
      botMessage: botResponse,
      responseTime: responseTime,
      cached: false
    });

  } catch (error) {
    console.log("Error in message controller:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
};

export default Message;
