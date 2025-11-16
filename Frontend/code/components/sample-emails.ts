// Frontend/code/data/sample-emails.ts

export type SampleEmail = {
  student_name: string;
  uni: string;
  subject: string;
  body: string;
};

export const SAMPLE_EMAILS: SampleEmail[] = [
  // 1 – registration_deadline
  {
    student_name: "Aisha Khan",
    uni: "ak3124",
    subject: "When is the deadline to register for classes?",
    body: "Hi, I’m trying to finalize my fall schedule. When is the deadline to register for classes, and is there a different deadline to make changes?",
  },
  // 2 – registration_deadline
  {
    student_name: "Michael Chen",
    uni: "mc2841",
    subject: "Last day to enroll / add course",
    body: "Hello, how late can I add a course to my schedule? Is there a specific last day to enroll before I need advisor approval?",
  },
  // 3 – registration_deadline
  {
    student_name: "Sara Ahmed",
    uni: "sa2550",
    subject: "Add/drop deadline clarification",
    body: "Hi, I saw something about the add/drop deadline on the academic calendar, but I'm a bit confused. Is the add drop deadline the same as the registration window closing?",
  },

  // 4 – appointment_scheduling
  {
    student_name: "Jordan Lee",
    uni: "jl2197",
    subject: "Schedule advising appointment",
    body: "Hi, I’d like to schedule an advising appointment to talk about my course plan. How do I book a meeting and what options are there for Zoom vs in person?",
  },
  // 5 – appointment_scheduling
  {
    student_name: "Priya Patel",
    uni: "pp3012",
    subject: "Finding a time to meet with advisor",
    body: "Hello, I’m trying to find a time to meet with my academic advisor this month. Where do I go to book appointments and what if none of the times work for me?",
  },

  // 6 – course_withdrawal
  {
    student_name: "Daniel Kim",
    uni: "dk2780",
    subject: "Withdraw from a course after add/drop",
    body: "Hi, I might need to withdraw from a course due to personal reasons. How do I drop a class after the add/drop deadline, and will it show as a W on my transcript?",
  },
  // 7 – course_withdrawal
  {
    student_name: "Maria Gonzalez",
    uni: "mg2331",
    subject: "Late withdrawal options",
    body: "Hello, I’m struggling in one of my classes and I’m past the regular drop deadline. What are my late withdrawal options and is there any paperwork I need?",
  },

  // 8 – change_major
  {
    student_name: "Alex Brown",
    uni: "ab2910",
    subject: "How can I change my major?",
    body: "Hi, I’m currently in another engineering major but I’d like to switch to IEOR. What’s the process to switch my program and where can I find the major change form?",
  },
  // 9 – change_major
  {
    student_name: "Leah Cohen",
    uni: "lc2478",
    subject: "Adding a second major",
    body: "Hello, I’m thinking about adding a second major alongside IEOR. How do I declare a second major and who needs to approve it?",
  },

  // 10 – change_minor
  {
    student_name: "Jason Park",
    uni: "jp2604",
    subject: "Declare a minor",
    body: "Hi, I want to add a minor but I’m not sure how to declare it. Is there a form to declare or change minors and who do I send it to?",
  },
  // 11 – change_minor
  {
    student_name: "Emily Rivera",
    uni: "er2159",
    subject: "Dropping my current minor",
    body: "Hello, I’d like to drop my current minor because I don’t think I can finish the requirements. What’s the process to remove a minor from my record?",
  },

  // 12 – major_requirements
  {
    student_name: "Hassan Ali",
    uni: "ha2713",
    subject: "Where can I find my major requirements?",
    body: "Hi, where can I find the most up-to-date requirements for the IEOR major, and is there a page that lists the IEOR core and electives?",
  },
  // 13 – major_requirements
  {
    student_name: "Chloe Martin",
    uni: "cm2987",
    subject: "Does this class count toward my major?",
    body: "Hi, there is a course in another department that I really want to take. How can I check if it counts toward my IEOR major requirements instead of just as a free elective?",
  },

  // 14 – minor_requirements
  {
    student_name: "Thomas Nguyen",
    uni: "tn2432",
    subject: "Minor requirement information",
    body: "Hello, I’m doing a minor outside of IEOR. Where can I find the official requirements for my minor and whether classes can double count?",
  },
  // 15 – minor_requirements
  {
    student_name: "Grace Lee",
    uni: "gl2765",
    subject: "Double counting courses for minor",
    body: "Hi, can I double count one of my classes toward both my major and my minor, or are there restrictions on double counting?",
  },

  // 16 – requirements_changed
  {
    student_name: "Noah Williams",
    uni: "nw2140",
    subject: "My major requirements changed",
    body: "Hi, I noticed that the major requirements listed online have changed since I first enrolled. Can I still use the old requirements I started with?",
  },
  // 17 – requirements_changed
  {
    student_name: "Isabella Rossi",
    uni: "ir2291",
    subject: "Minor requirements updated",
    body: "Hello, it looks like the requirements for my minor just changed. Am I allowed to stick with the old requirements, and how do I confirm which set applies to me?",
  },

  // 18 – substitute_databases_datastructures
  {
    student_name: "Liam O’Connor",
    uni: "lo2387",
    subject: "Substituting IEOR CS core requirements",
    body: "Hi, can I take Java, Data Structures, and Databases instead of Intro to Computing and Data Engineering? I saw some older IEOR CS core requirements and I’m wondering if I can use those.",
  },
  // 19 – substitute_databases_datastructures
  {
    student_name: "Mei Zhang",
    uni: "mz2558",
    subject: "Using COMS courses instead of IEOR E2000",
    body: "Hello, I want to take COMS W3134 and COMS W4111 instead of IEOR E2000. Is this substitution allowed for the IEOR core?",
  },

  // 20 – elective_requirements
  {
    student_name: "Robert Davis",
    uni: "rd2045",
    subject: "Does this class count as a technical elective?",
    body: "Hi, I found an upper-level course that seems very relevant to IEOR. How can I confirm if it counts toward my technical elective requirements?",
  },
  // 21 – elective_requirements
  {
    student_name: "Sophia Patel",
    uni: "sp2974",
    subject: "Technical vs management elective options",
    body: "Hello, I’m confused about which courses count as technical electives versus management electives for my major. Where can I see an approved list of elective options?",
  },
  // 22 – elective_requirements
  {
    student_name: "Diego Morales",
    uni: "dm2360",
    subject: "How many technical and management electives do I need?",
    body: "Hi, how many technical electives and management electives do I need to take for my IEOR program, and is there a page that summarizes this?",
  },

  // 23 – petition_electives
  {
    student_name: "Hannah Wilson",
    uni: "hw2103",
    subject: "Petition for elective approval",
    body: "Hi, I want to take a course that’s not on the approved elective list, but it clearly aligns with IEOR themes. Can I petition for this class to count as a technical elective?",
  },
  // 24 – petition_electives
  {
    student_name: "Yusuf El-Sayed",
    uni: "ye2810",
    subject: "Course approval request for management elective",
    body: "Hello, there’s a management course in another department I’d like to count as a management elective. What is the process to get this course approved?",
  },

  // 25 – double_counting_courses
  {
    student_name: "Megan Scott",
    uni: "ms2951",
    subject: "Double counting between major and minor",
    body: "Hi, can I double count a class toward both my IEOR major and a minor, or does it have to be exclusive to one program?",
  },
  // 26 – double_counting_courses
  {
    student_name: "Kevin Chang",
    uni: "kc2228",
    subject: "Double counting non-tech and management elective",
    body: "Hello, is it possible to double count one course as both a non-technical requirement and a management elective?",
  },

  // 27 – graduation_application
  {
    student_name: "Olivia Martinez",
    uni: "om2446",
    subject: "How do I apply for graduation?",
    body: "Hi, I’m a senior and I want to make sure I follow the correct steps to apply for graduation. Where do I submit my degree application and by when?",
  },
  // 28 – graduation_application
  {
    student_name: "Ethan Walker",
    uni: "ew2099",
    subject: "Graduation application deadline",
    body: "Hello, when is the graduation application deadline for this term, and do I need my program plan approved first?",
  },
  // 29 – graduation_application
  {
    student_name: "Natalia Petrova",
    uni: "np2734",
    subject: "Am I on track to graduate?",
    body: "Hi, I’d like someone to review my program plan and Stellic audit to confirm I’m on track to graduate next term. What’s the best way to do that?",
  },

  // 30 – ms_express
  {
    student_name: "James Robinson",
    uni: "jr2307",
    subject: "Information about MS Express",
    body: "Hi, I heard about the MS Express option for Columbia Engineering students. Where can I find information about the application requirements and deadlines?",
  },
  // 31 – ms_express
  {
    student_name: "Linda Nguyen",
    uni: "ln2193",
    subject: "Which of my classes might count toward MS Express?",
    body: "Hello, I’m considering applying through MS Express. How can I tell which of my undergraduate courses might count toward an MS degree?",
  },
  // 32 – ms_express
  {
    student_name: "Omar Hassan",
    uni: "oh2842",
    subject: "MS Express GPA and application details",
    body: "Hi, what GPA do I need for MS Express, and do I have to submit recommendation letters or test scores as part of the application?",
  },

  // 33 – advanced_track
  {
    student_name: "Rachel Kim",
    uni: "rk2588",
    subject: "Undergraduate Advanced Track (UAT) questions",
    body: "Hi, I’m curious about the IEOR Undergraduate Advanced Track. What is the difference between the regular IEOR core and the advanced track, and who is eligible?",
  },
  // 34 – advanced_track
  {
    student_name: "Marcus Allen",
    uni: "ma2677",
    subject: "How to apply for the advanced track",
    body: "Hello, how can I apply for the IEOR advanced track, and where can I find the list of required advanced courses?",
  },

  // 35 – major_declaration
  {
    student_name: "Julia Santos",
    uni: "js2921",
    subject: "When do I declare my major?",
    body: "Hi, I’m a second-year student and I’m wondering when major declaration happens for Columbia Engineering, and how the process works.",
  },
  // 36 – major_declaration
  {
    student_name: "Ben Friedman",
    uni: "bf2149",
    subject: "Choosing which IEOR major to declare",
    body: "Hello, I’m trying to choose between the different IEOR majors. Is there a resource that explains the differences between IEOR, OR:EMS, and OR:FE?",
  },
  // 37 – major_declaration
  {
    student_name: "Tara Singh",
    uni: "ts2761",
    subject: "Help deciding on an IEOR major",
    body: "Hi, I’d like to meet with someone to discuss which IEOR major best fits my interests before I declare. Who should I talk to?",
  },

  // 38 – research_opportunities
  {
    student_name: "David Lopez",
    uni: "dl2389",
    subject: "I want to get involved in IEOR research",
    body: "Hi, I want to get involved in research in IEOR. Where can I find information about research opportunities and how to contact faculty?",
  },
  // 39 – research_opportunities
  {
    student_name: "Anna Becker",
    uni: "ab2074",
    subject: "Completing research for credit",
    body: "Hello, how can I complete research for credit in IEOR, and are there specific course numbers I should register for?",
  },

  // 40 – study_abroad
  {
    student_name: "Lucas Pereira",
    uni: "lp2950",
    subject: "I want to study abroad",
    body: "Hi, I’m interested in studying abroad as an IEOR student. When am I allowed to study abroad and which requirements can I complete at an outside institution?",
  },
  // 41 – study_abroad
  {
    student_name: "Maya Thompson",
    uni: "mt2333",
    subject: "Which classes can I take abroad?",
    body: "Hello, if I study abroad, which classes can I take that will still count toward my IEOR or core requirements?",
  },

  // 42 – struggling_in_classes
  {
    student_name: "Chris Johnson",
    uni: "cj2210",
    subject: "I am struggling in my classes",
    body: "Hi, I am having a hard time in my classes this semester and I’m worried about my GPA. What resources are available and can I talk to someone about my situation?",
  },
  // 43 – struggling_in_classes
  {
    student_name: "Elena Garcia",
    uni: "eg2795",
    subject: "Need help in my classes",
    body: "Hello, I need help in my classes and I’m not sure where to start. Could you point me to tutoring or academic support options?",
  },

  // 44 – barnard_four_plus_one
  {
    student_name: "Hannah Gold",
    uni: "hg2482",
    subject: "Barnard 4+1 Pathway in IEOR",
    body: "Hi, I’m a Barnard student interested in the 4+1 Pathway in IEOR. What are the requirements and when is the application due?",
  },
  // 45 – barnard_four_plus_one
  {
    student_name: "Zoe Carter",
    uni: "zc2664",
    subject: "Which classes count for Barnard 4+1?",
    body: "Hello, which of my current classes might count toward an MS degree if I pursue the Barnard 4+1 program in IEOR?",
  },

  // 46 – three_plus_two_program
  {
    student_name: "Ian Murphy",
    uni: "im2316",
    subject: "Information about 3+2 Program",
    body: "Hi, I’ve heard about a 3+2 program with Columbia Engineering. Where can I learn more about the requirements and how credits transfer?",
  },

  // 47 – registrar_transcript_portal
  {
    student_name: "Olivia Chen",
    uni: "oc2843",
    subject: "Ordering official transcripts",
    body: "Hello, I need to order an official transcript for an application. How do I use the transcript portal and how long does processing usually take?",
  },
  // 48 – registrar_transcript_portal
  {
    student_name: "Mark Davis",
    uni: "md2177",
    subject: "Unofficial vs official transcript",
    body: "Hi, what is the difference between unofficial and official transcripts, and where can I quickly download an unofficial copy?",
  },

  // 49 – financial_aid_overview
  {
    student_name: "Sonia Patel",
    uni: "sp2439",
    subject: "Financial aid status questions",
    body: "Hi, I’m confused about some items on my financial aid checklist. Where can I review outstanding items and who should I contact if something looks wrong?",
  },
  // 50 – financial_aid_overview
  {
    student_name: "Jacob White",
    uni: "jw2522",
    subject: "Disbursement dates for financial aid",
    body: "Hello, can you explain when my financial aid will actually disburse and where I can see the disbursement dates?",
  },
];