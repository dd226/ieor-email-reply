// Frontend/code/data/sample-emails.ts

export type SampleEmail = {
  student_name: string;
  uni: string;
  email: string;
  subject: string;
  body: string;
};

export const SAMPLE_EMAILS: SampleEmail[] = [
  // ==================== COURSE WITHDRAWAL ====================
  {
    student_name: "Ava Thompson",
    uni: "at2438",
    email: "at2438@columbia.edu",
    subject: "Steps for withdrawing from a course",
    body:
      "Hello, I'm considering withdrawing from a class now that add/drop has closed. Where can I find the Course Withdrawal form, and do I need both my instructor and advisor to sign it before submitting it?",
  },
  {
    student_name: "Marcus Chen",
    uni: "mc3847",
    email: "mc3847@columbia.edu",
    subject: "Late withdrawal request",
    body:
      "Hi, I'm dealing with some personal issues and need to withdraw from COMS 4111 after the deadline. Is there a process for late withdrawal? Will it affect my transcript?",
  },
  {
    student_name: "Priya Patel",
    uni: "pp2156",
    email: "pp2156@columbia.edu",
    subject: "Withdrawal impact on financial aid",
    body:
      "Hello, if I withdraw from one of my courses, will it affect my financial aid status? I'm currently enrolled in 15 credits and thinking of dropping down to 12.",
  },

  // ==================== ELECTIVE REQUIREMENTS ====================
  {
    student_name: "Layla Shah",
    uni: "ls2804",
    email: "ls2804@columbia.edu",
    subject: "Which electives count for my degree?",
    body:
      "Hello, I'm choosing courses for next semester and unsure which ones qualify as technical or management electives. Where can I find the official elective list?",
  },
  {
    student_name: "Jordan Kim",
    uni: "jk4521",
    email: "jk4521@columbia.edu",
    subject: "Can I count a Barnard course as an elective?",
    body:
      "Hi, I want to take a psychology course at Barnard. Can this count toward my technical elective requirement for the CS major?",
  },
  {
    student_name: "Aisha Mohammed",
    uni: "am3892",
    email: "am3892@columbia.edu",
    subject: "Elective substitution request",
    body:
      "Hello, I took an online course through Coursera that covers similar material to IEOR 4150. Is there any way to petition for this to count as an elective?",
  },
  {
    student_name: "Tyler Rodriguez",
    uni: "tr2847",
    email: "tr2847@columbia.edu",
    subject: "Double counting electives",
    body:
      "Hi, I'm double majoring in CS and Economics. Can I use the same elective course to fulfill requirements for both majors?",
  },

  // ==================== STUDY ABROAD ====================
  {
    student_name: "Isabella Wu",
    uni: "iw2990",
    email: "iw2990@columbia.edu",
    subject: "Studying abroad and fulfilling requirements",
    body:
      "Hi, I'm interested in studying abroad during my time here. Which types of requirements can typically be completed abroad, and where can I find more details about approved programs?",
  },
  {
    student_name: "Emma Johnson",
    uni: "ej3156",
    email: "ej3156@columbia.edu",
    subject: "Study abroad in junior year - CS major",
    body:
      "Hello, I'm a CS major planning to study abroad in Copenhagen next fall. Will I be able to take courses that count toward my major requirements? Who should I talk to about course approval?",
  },
  {
    student_name: "David Park",
    uni: "dp4723",
    email: "dp4723@columbia.edu",
    subject: "Study abroad application deadline",
    body:
      "Hi, when is the deadline to apply for study abroad programs for next spring? I'm interested in the Oxford program.",
  },

  // ==================== REGISTRATION ====================
  {
    student_name: "Nora Bennett",
    uni: "nb2714",
    email: "nb2714@columbia.edu",
    subject: "Clarifying the registration deadline",
    body:
      "Hello, I'm trying to finalize my schedule but I'm unsure when registration officially closes. Is the deadline the same as the one posted on the academic calendar, and does it close at 11:59 p.m.?",
  },
  {
    student_name: "Ryan O'Connor",
    uni: "ro2934",
    email: "ro2934@columbia.edu",
    subject: "Registration hold on my account",
    body:
      "Hi, I have a hold on my account that's preventing me from registering for classes. It says 'advising hold' but I'm not sure what I need to do to clear it.",
  },
  {
    student_name: "Sophia Martinez",
    uni: "sm4521",
    email: "sm4521@columbia.edu",
    subject: "Waitlist question",
    body:
      "Hello, I'm #3 on the waitlist for COMS 4170. What are my chances of getting in? Should I register for a backup course?",
  },
  {
    student_name: "Michael Lee",
    uni: "ml3847",
    email: "ml3847@columbia.edu",
    subject: "Permission code needed for course",
    body:
      "Hi, I'm trying to register for a graduate-level course as an undergrad. The system says I need a permission code. How do I request one?",
  },
  {
    student_name: "Grace Zhang",
    uni: "gz2156",
    email: "gz2156@columbia.edu",
    subject: "Registering for more than 18 credits",
    body:
      "Hello, I want to take 21 credits next semester. What's the process for getting approval to exceed the credit limit?",
  },

  // ==================== ADVISING APPOINTMENTS ====================
  {
    student_name: "Leo Ramirez",
    uni: "lr2901",
    email: "lr2901@columbia.edu",
    subject: "How to schedule an advising appointment",
    body:
      "Hi, I'd like to meet with an advisor to talk about my academic plan. How do I schedule an advising appointment, and is there an option to request a virtual meeting?",
  },
  {
    student_name: "Hannah Brown",
    uni: "hb3892",
    email: "hb3892@columbia.edu",
    subject: "Urgent advising needed",
    body:
      "Hi, I'm having a crisis with my course schedule and need to speak with an advisor ASAP. Are there any walk-in hours or emergency appointments available?",
  },
  {
    student_name: "Kevin Nguyen",
    uni: "kn4127",
    email: "kn4127@columbia.edu",
    subject: "Meeting with specific advisor",
    body:
      "Hello, I met with Dr. Johnson last semester and would like to continue working with her. How can I schedule an appointment specifically with her?",
  },

  // ==================== CHANGING MAJORS ====================
  {
    student_name: "Test Student",
    uni: "ts1000",
    email: "ts1000@columbia.edu",
    subject: "Guidance on Changing Majors",
    body:
      "Hello, I want to switch major. How can I change my major and where can I find the major change form?",
  },
  {
    student_name: "Olivia Davis",
    uni: "od2847",
    email: "od2847@columbia.edu",
    subject: "Switching from pre-med to CS",
    body:
      "Hi, I'm currently on the pre-med track but want to switch to Computer Science. I'm a sophomore - is it too late to make this change and still graduate on time?",
  },
  {
    student_name: "Ethan Wilson",
    uni: "ew3156",
    email: "ew3156@columbia.edu",
    subject: "Adding a second major",
    body:
      "Hello, I'm an Economics major interested in adding a second major in Statistics. What's the process, and will my credits from STAT 1201 count?",
  },
  {
    student_name: "Mia Anderson",
    uni: "ma4723",
    email: "ma4723@columbia.edu",
    subject: "Declaring a minor",
    body:
      "Hi, I want to declare a minor in Music. Where do I find the form and who needs to approve it?",
  },

  // ==================== GRADES & TRANSCRIPTS ====================
  {
    student_name: "Noah Taylor",
    uni: "nt2934",
    email: "nt2934@columbia.edu",
    subject: "Grade appeal process",
    body:
      "Hello, I believe my final grade in MATH 2500 doesn't reflect my performance. What's the process for appealing a grade?",
  },
  {
    student_name: "Chloe Garcia",
    uni: "cg4521",
    email: "cg4521@columbia.edu",
    subject: "Incomplete grade extension",
    body:
      "Hi, I received an incomplete in one of my fall courses. I need more time to finish the work due to ongoing health issues. How can I request an extension?",
  },
  {
    student_name: "Benjamin Clark",
    uni: "bc3847",
    email: "bc3847@columbia.edu",
    subject: "Ordering official transcript",
    body:
      "Hello, I need to send an official transcript to a potential employer. How do I order one, and how long does it take?",
  },
  {
    student_name: "Zoe Robinson",
    uni: "zr2156",
    email: "zr2156@columbia.edu",
    subject: "Pass/fail deadline",
    body:
      "Hi, when is the deadline to change a course to pass/fail? And can I do this for a course in my major?",
  },

  // ==================== FINANCIAL AID ====================
  {
    student_name: "Lucas White",
    uni: "lw3892",
    email: "lw3892@columbia.edu",
    subject: "Financial aid for summer courses",
    body:
      "Hello, I want to take summer courses to get ahead. Is financial aid available for summer sessions?",
  },
  {
    student_name: "Ella Thompson",
    uni: "et4127",
    email: "et4127@columbia.edu",
    subject: "Work-study job opportunities",
    body:
      "Hi, I have work-study as part of my financial aid package but haven't found a job yet. Where can I find available positions?",
  },
  {
    student_name: "Jack Harris",
    uni: "jh2847",
    email: "jh2847@columbia.edu",
    subject: "Financial aid appeal",
    body:
      "Hello, my family's financial situation has changed significantly since I submitted my FAFSA. How can I appeal for more aid?",
  },

  // ==================== GRADUATION ====================
  {
    student_name: "Lily Martin",
    uni: "lm3156",
    email: "lm3156@columbia.edu",
    subject: "Graduation requirements check",
    body:
      "Hi, I'm planning to graduate next May. How can I verify that I'm on track to meet all my requirements? Is there a graduation audit I can request?",
  },
  {
    student_name: "James Lee",
    uni: "jl4723",
    email: "jl4723@columbia.edu",
    subject: "Walking in graduation early",
    body:
      "Hello, I'll be finishing my degree requirements in the summer but want to walk in the May ceremony with my friends. Is this allowed?",
  },
  {
    student_name: "Sofia Hernandez",
    uni: "sh2934",
    email: "sh2934@columbia.edu",
    subject: "Applying for graduation",
    body:
      "Hi, when do I need to apply for graduation, and where do I submit the application? I'm expecting to graduate in December.",
  },
  {
    student_name: "Alexander Wright",
    uni: "aw4521",
    email: "aw4521@columbia.edu",
    subject: "Latin honors requirements",
    body:
      "Hello, what GPA do I need to graduate with honors? Is it based on cumulative GPA or just major GPA?",
  },

  // ==================== ACADEMIC SUPPORT ====================
  {
    student_name: "Charlotte King",
    uni: "ck3847",
    email: "ck3847@columbia.edu",
    subject: "Tutoring services",
    body:
      "Hi, I'm struggling in Organic Chemistry and need some extra help. Are there free tutoring services available?",
  },
  {
    student_name: "Daniel Scott",
    uni: "ds2156",
    email: "ds2156@columbia.edu",
    subject: "Writing center appointment",
    body:
      "Hello, I have a major research paper due and would like help with my writing. How do I schedule an appointment at the Writing Center?",
  },
  {
    student_name: "Victoria Green",
    uni: "vg3892",
    email: "vg3892@columbia.edu",
    subject: "Academic probation - what now?",
    body:
      "Hi, I just found out I'm on academic probation. What does this mean and what steps do I need to take? I'm really worried about this.",
  },

  // ==================== DISABILITY SERVICES ====================
  {
    student_name: "Samuel Adams",
    uni: "sa4127",
    email: "sa4127@columbia.edu",
    subject: "Registering with disability services",
    body:
      "Hello, I have ADHD and want to register with disability services for accommodations. What documentation do I need and how do I start the process?",
  },
  {
    student_name: "Natalie Baker",
    uni: "nb2847",
    email: "nb2847@columbia.edu",
    subject: "Extended time on exams",
    body:
      "Hi, I'm already registered with ODS but my professors haven't received my accommodation letters for this semester. Can you help?",
  },

  // ==================== INTERNSHIPS & CAREER ====================
  {
    student_name: "Christopher Young",
    uni: "cy3156",
    email: "cy3156@columbia.edu",
    subject: "Getting credit for internship",
    body:
      "Hello, I have a summer internship at Google and want to get academic credit for it. What's the process for registering an internship for credit?",
  },
  {
    student_name: "Madison Hall",
    uni: "mh4723",
    email: "mh4723@columbia.edu",
    subject: "CPT authorization for internship",
    body:
      "Hi, I'm an international student and need CPT authorization for my upcoming internship. When should I start this process and what documents do I need?",
  },
  {
    student_name: "Andrew Allen",
    uni: "aa2934",
    email: "aa2934@columbia.edu",
    subject: "Career center resume review",
    body:
      "Hello, I'm applying for summer internships and would like someone to review my resume. Does the career center offer this service?",
  },

  // ==================== HOUSING ====================
  {
    student_name: "Elizabeth Turner",
    uni: "et4521",
    email: "et4521@columbia.edu",
    subject: "Room change request",
    body:
      "Hi, I'm having issues with my current roommate and would like to request a room change. What's the process for this?",
  },
  {
    student_name: "William Phillips",
    uni: "wp3847",
    email: "wp3847@columbia.edu",
    subject: "Housing for summer session",
    body:
      "Hello, I'm staying for summer courses. How do I apply for summer housing and when is the deadline?",
  },

  // ==================== LEAVE OF ABSENCE ====================
  {
    student_name: "Abigail Campbell",
    uni: "ac2156",
    email: "ac2156@columbia.edu",
    subject: "Taking a leave of absence",
    body:
      "Hi, I'm considering taking a leave of absence next semester for personal reasons. What's the process, and how will it affect my financial aid when I return?",
  },
  {
    student_name: "Joseph Mitchell",
    uni: "jm3892",
    email: "jm3892@columbia.edu",
    subject: "Medical leave documentation",
    body:
      "Hello, I need to take a medical leave of absence. What documentation do I need from my doctor, and who do I submit it to?",
  },

  // ==================== RESEARCH OPPORTUNITIES ====================
  {
    student_name: "Emily Roberts",
    uni: "er4127",
    email: "er4127@columbia.edu",
    subject: "Finding undergraduate research",
    body:
      "Hi, I'm a sophomore interested in getting involved in research. How do I find professors looking for undergraduate research assistants?",
  },
  {
    student_name: "Matthew Carter",
    uni: "mc2847",
    email: "mc2847@columbia.edu",
    subject: "Senior thesis advisor",
    body:
      "Hello, I want to write a senior thesis but I'm not sure how to find an advisor. Do I approach professors directly or is there a matching process?",
  },

  // ==================== MISCELLANEOUS ====================
  {
    student_name: "Samantha Evans",
    uni: "se3156",
    email: "se3156@columbia.edu",
    subject: "Lost Columbia ID",
    body:
      "Hi, I lost my Columbia ID card. How do I get a replacement, and is there a fee?",
  },
  {
    student_name: "Christopher Moore",
    uni: "cm4723",
    email: "cm4723@columbia.edu",
    subject: "Gym membership question",
    body:
      "Hello, is the gym included in our student fees or do we need to pay separately? Where do I sign up?",
  },
  {
    student_name: "Jennifer Taylor",
    uni: "jt2934",
    email: "jt2934@columbia.edu",
    subject: "Student organization funding",
    body:
      "Hi, I'm the treasurer of a student club and we need funding for an event. What's the process for requesting money from the student activities board?",
  },
  {
    student_name: "Robert Jackson",
    uni: "rj4521",
    email: "rj4521@columbia.edu",
    subject: "Parking permit",
    body:
      "Hello, I commute to campus and need a parking permit. How do I apply for one, and how much does it cost?",
  },
  {
    student_name: "Amanda White",
    uni: "aw3847",
    email: "aw3847@columbia.edu",
    subject: "Health insurance waiver",
    body:
      "Hi, I have health insurance through my parents and want to waive the Columbia health insurance. When is the deadline and how do I submit the waiver?",
  },
];