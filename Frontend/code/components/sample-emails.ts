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

  // 51 – registration_deadline
  {
    student_name: "Nora Feldman",
    uni: "nf2431",
    subject: "When does registration officially close?",
    body: "Hi, I don’t want to miss the deadline—when does registration officially close for this term, and is the cut-off time at midnight?",
  },
  // 52 – registration_deadline
  {
    student_name: "Leo Martinez",
    uni: "lm2214",
    subject: "Deadline to change my schedule",
    body: "Hello, what’s the last day I can adjust my schedule in the portal without submitting extra paperwork?",
  },

  // 53 – appointment_scheduling
  {
    student_name: "Samantha Brooks",
    uni: "sb2902",
    subject: "How do I book an advising session?",
    body: "Hi, I need to meet with an advisor about my academic plan. Where do I go to book a session and how far in advance should I schedule?",
  },
  // 54 – appointment_scheduling
  {
    student_name: "Owen Li",
    uni: "ol2840",
    subject: "No open advising times",
    body: "Hello, I checked the Navigate app and there are no open advising times for the next two weeks. What should I do if none of the slots work for me?",
  },

  // 55 – course_withdrawal
  {
    student_name: "Jasmine Patel",
    uni: "jp2731",
    subject: "Withdrawing after the deadline",
    body: "Hi, I need to withdraw from a course but the deadline on the calendar has passed. Is there a late withdrawal process I can follow?",
  },
  // 56 – course_withdrawal
  {
    student_name: "Evan Rogers",
    uni: "er2870",
    subject: "Will a W affect my record?",
    body: "Hello, if I withdraw from a class and get a W, how will that appear on my transcript and could it affect graduate school applications?",
  },

  // 57 – change_major
  {
    student_name: "Lily Anderson",
    uni: "la2315",
    subject: "Switching from another major into IEOR",
    body: "Hi, I’m currently declared in a different engineering major but want to switch into IEOR. Who do I need to talk to and which form should I fill out?",
  },
  // 58 – change_major
  {
    student_name: "Carlos Ruiz",
    uni: "cr2961",
    subject: "Changing my major before junior year",
    body: "Hello, I’m thinking of changing my major before junior year. Are there any deadlines or GPA requirements I should know about?",
  },

  // 59 – change_minor
  {
    student_name: "Mia Johnson",
    uni: "mj2158",
    subject: "Adding a new minor mid-semester",
    body: "Hi, is it possible to add a new minor in the middle of the semester, and if so, where do I submit the declaration form?",
  },
  // 60 – change_minor
  {
    student_name: "Arjun Mehta",
    uni: "am2774",
    subject: "Switching from one minor to another",
    body: "Hello, I’m currently declared in one minor but I’d like to switch to a different one. What’s the process to change my minor officially?",
  },

  // 61 – major_requirements
  {
    student_name: "Yara Suleiman",
    uni: "ys2820",
    subject: "Clarifying IEOR core vs electives",
    body: "Hi, I’m confused about which classes count toward the IEOR core and which count as technical electives. Is there a page that breaks this down?",
  },
  // 62 – major_requirements
  {
    student_name: "Patrick O’Neill",
    uni: "po2603",
    subject: "Using a course toward IEOR major",
    body: "Hello, I’m taking an economics course that seems related to IEOR. How can I check whether it can be applied to my major requirements instead of just as a free elective?",
  },

  // 63 – minor_requirements
  {
    student_name: "Isabel Flores",
    uni: "if2498",
    subject: "Finding official minor requirements",
    body: "Hi, I declared a minor last term but I can’t find the official list of requirements. Where should I look to make sure I’m taking the right courses?",
  },
  // 64 – minor_requirements
  {
    student_name: "Ryan Kim",
    uni: "rk2920",
    subject: "Can my minor classes double count?",
    body: "Hello, I want to know if some of my minor classes can double count with my major or if they have to be completely separate.",
  },

  // 65 – requirements_changed
  {
    student_name: "Fatima Ali",
    uni: "fa2719",
    subject: "Old vs new major requirements",
    body: "Hi, I started my major under a previous set of requirements. Am I allowed to keep using the old requirements or do I have to follow the updated ones?",
  },
  // 66 – requirements_changed
  {
    student_name: "George Brown",
    uni: "gb2433",
    subject: "Requirement changes for my minor",
    body: "Hello, I saw that the requirements for my minor were updated this year. How do I know which catalog year I’m following?",
  },

  // 67 – substitute_databases_datastructures
  {
    student_name: "Emily Wong",
    uni: "ew2309",
    subject: "Using COMS courses for IEOR CS core",
    body: "Hi, if I complete COMS W3134 and COMS W4111, can those substitute for the IEOR CS core requirements, or do I still need IEOR E2000?",
  },
  // 68 – substitute_databases_datastructures
  {
    student_name: "Ahmed Hassan",
    uni: "ah2867",
    subject: "Old CS core vs new IEOR core",
    body: "Hello, I saw older IEOR curriculum pages that mention Java, Data Structures, and Databases. Can I follow that older CS path instead of the current ENGI E1006 plus IEOR E2000 sequence?",
  },

  // 69 – elective_requirements
  {
    student_name: "Natalie Green",
    uni: "ng2584",
    subject: "Choosing between two technical electives",
    body: "Hi, I’m trying to decide between two upper-level courses. Both seem relevant, but I’m not sure if they count as technical electives for my major. How can I confirm?",
  },
  // 70 – elective_requirements
  {
    student_name: "Dylan Ross",
    uni: "dr2411",
    subject: "Management vs technical elective labeling",
    body: "Hello, one course I’m interested in looks half technical and half business. How do I know whether it will count as a management elective or a technical elective?",
  },

  // 71 – petition_electives
  {
    student_name: "Jade Park",
    uni: "jp2917",
    subject: "Petitioning a course outside the approved list",
    body: "Hi, I found a course in another department that fits my interests but it’s not on the approved elective list. Is there a way to petition for it to count?",
  },
  // 72 – petition_electives
  {
    student_name: "Hugo Rivera",
    uni: "hr2540",
    subject: "Course approval request for technical elective",
    body: "Hello, I’d like to get a specific course approved as a technical elective because it aligns closely with IEOR topics. What form do I need to submit?",
  },

  // 73 – double_counting_courses
  {
    student_name: "Olivia Brown",
    uni: "ob2772",
    subject: "Double counting core and elective",
    body: "Hi, is it possible for one class to count both toward an engineering non-technical requirement and as an IEOR management elective?",
  },
  // 74 – double_counting_courses
  {
    student_name: "Samuel Carter",
    uni: "sc2634",
    subject: "Using one course for major and pathway",
    body: "Hello, can the same course count toward both my IEOR major requirements and a special program or pathway requirement?",
  },

  // 75 – graduation_application
  {
    student_name: "Rachel Lee",
    uni: "rl2505",
    subject: "Steps to confirm I can graduate",
    body: "Hi, I’m planning to graduate next spring. What steps do I need to take to confirm I’ve met all of my requirements before submitting the degree application?",
  },
  // 76 – graduation_application
  {
    student_name: "Tom Baker",
    uni: "tb2388",
    subject: "Program plan and graduation form order",
    body: "Hello, should I get my program plan signed before I submit the graduation application, or can those happen at the same time?",
  },

  // 77 – ms_express
  {
    student_name: "Priyanka Shah",
    uni: "ps2944",
    subject: "Timeline for MS Express application",
    body: "Hi, I’m interested in MS Express but I’m not sure when I should apply. Is there a recommended term or deadline for IEOR students?",
  },
  // 78 – ms_express
  {
    student_name: "Jacob Stein",
    uni: "js2109",
    subject: "References for MS Express",
    body: "Hello, for MS Express, do I need formal letters of recommendation, or just contact information for references?",
  },

  // 79 – advanced_track
  {
    student_name: "Helen Zhou",
    uni: "hz2250",
    subject: "Eligibility for IEOR advanced track",
    body: "Hi, I’m considering the Undergraduate Advanced Track. Is there a minimum GPA and when in my degree should I apply?",
  },
  // 80 – advanced_track
  {
    student_name: "Noah Green",
    uni: "ng2320",
    subject: "Required courses for advanced track",
    body: "Hello, which specific courses are required for the advanced track and where can I see the full list of advanced electives?",
  },

  // 81 – major_declaration
  {
    student_name: "Julia Park",
    uni: "jp2440",
    subject: "Timeline for declaring IEOR major",
    body: "Hi, I’m a sophomore in SEAS. When exactly does major declaration open and close, and how do I indicate that I want an IEOR major?",
  },
  // 82 – major_declaration
  {
    student_name: "Michael Stone",
    uni: "ms2873",
    subject: "Comparing IEOR vs OR:FE",
    body: "Hello, I’m trying to choose between IEOR and Operations Research: Financial Engineering. Is there a resource that compares the requirements and career paths?",
  },

  // 83 – research_opportunities
  {
    student_name: "Laura Kim",
    uni: "lk2931",
    subject: "Finding IEOR research projects",
    body: "Hi, I’d like to join a research project in IEOR. Is there a list of ongoing projects or should I email faculty directly?",
  },
  // 84 – research_opportunities
  {
    student_name: "Adrian Torres",
    uni: "at2804",
    subject: "Registering for research credits",
    body: "Hello, if I work with a professor on research, how do I register to receive academic credit and which course number should I use?",
  },

  // 85 – study_abroad
  {
    student_name: "Sofia Rossi",
    uni: "sr2556",
    subject: "Studying abroad as an IEOR junior",
    body: "Hi, I’m an IEOR student and I want to study abroad junior year. Is spring of sophomore year the only recommended time, or are there other options?",
  },
  // 86 – study_abroad
  {
    student_name: "Jason Wu",
    uni: "jw2601",
    subject: "Counting study abroad classes toward IEOR",
    body: "Hello, if I take math or statistics classes abroad, can those count toward my IEOR requirements, or will they just transfer as general credit?",
  },

  // 87 – struggling_in_classes
  {
    student_name: "Nina Alvarez",
    uni: "na2742",
    subject: "Worried about grades this term",
    body: "Hi, my grades this term are lower than usual and I’m worried about my GPA. Can I meet with someone to talk through options like tutoring or dropping a class?",
  },
  // 88 – struggling_in_classes
  {
    student_name: "Kevin Hill",
    uni: "kh2126",
    subject: "Balancing coursework and health",
    body: "Hello, I’m having trouble keeping up with coursework due to personal and health issues. Are there campus resources you recommend, and can I talk with an advisor about my situation?",
  },

  // 89 – barnard_four_plus_one
  {
    student_name: "Chloe Bernstein",
    uni: "cb2981",
    subject: "Barnard 4+1 prerequisites",
    body: "Hi, I’m a Barnard student interested in the IEOR 4+1 pathway. Which prerequisites should I complete by junior year to be a strong applicant?",
  },
  // 90 – barnard_four_plus_one
  {
    student_name: "Rachel Cohen",
    uni: "rc2833",
    subject: "GPA expectations for Barnard 4+1",
    body: "Hello, is there a minimum GPA for the Barnard 4+1 program in IEOR, and how competitive is the application process?",
  },

  // 91 – three_plus_two_program
  {
    student_name: "Elias Morgan",
    uni: "em2908",
    subject: "3+2 program application process",
    body: "Hi, I’m at a partner liberal arts college and considering the 3+2 program with Columbia Engineering. Where can I find information about how to apply and how credits will transfer?",
  },
  // 92 – three_plus_two_program
  {
    student_name: "Sophie Daniels",
    uni: "sd2462",
    subject: "Requirements for 3+2 admission",
    body: "Hello, what GPA and prerequisite courses are typically required for students applying to the 3+2 program in IEOR?",
  },

  // 93 – registrar_transcript_portal
  {
    student_name: "Brian Lee",
    uni: "bl2175",
    subject: "Sending transcript to an external program",
    body: "Hi, I need to send an official transcript to a summer program. Do I do that through the transcript portal, and how long does it usually take to process?",
  },
  // 94 – registrar_transcript_portal
  {
    student_name: "Emma Watson",
    uni: "ew2995",
    subject: "Accessing unofficial academic record",
    body: "Hello, I just need an unofficial record of my classes and grades. Where in the student system can I download that quickly?",
  },

  // 95 – financial_aid_overview
  {
    student_name: "Luis Garcia",
    uni: "lg2329",
    subject: "Questions about financial aid checklist",
    body: "Hi, my financial aid checklist shows a few outstanding items but I’m not sure what they mean. Where can I see detailed explanations and who should I contact for help?",
  },
  // 96 – financial_aid_overview
  {
    student_name: "Hannah Smith",
    uni: "hs2863",
    subject: "When will my aid disburse?",
    body: "Hello, I’m trying to plan my budget for the start of the term. On which date does financial aid typically disburse to my account each semester?",
  },

  // 97 – registration_deadline
  {
    student_name: "Connor James",
    uni: "cj2954",
    subject: "Late registration and penalties",
    body: "Hi, if I miss the main registration deadline, is there a late registration period and are there any fees or penalties associated with that?",
  },
  // 98 – appointment_scheduling
  {
    student_name: "Alicia Ramos",
    uni: "ar2187",
    subject: "Rescheduling my advising appointment",
    body: "Hello, I booked an advising appointment but now have a conflict. How do I reschedule it, and is there a penalty if I cancel same day?",
  },

  // 99 – elective_requirements
  {
    student_name: "Peter Zhang",
    uni: "pz2212",
    subject: "Total elective credits needed",
    body: "Hi, I’m planning out my last three semesters and want to check how many technical and management elective credits I still need to graduate in IEOR.",
  },
  // 100 – graduation_application
  {
    student_name: "Lena Novak",
    uni: "ln2940",
    subject: "Confirming graduation term",
    body: "Hello, I’m deciding whether to graduate in fall or spring. Is it okay to submit a degree application now and change my graduation term later if needed?",
  },
];