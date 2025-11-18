// Frontend/code/data/sample-emails.ts

export type SampleEmail = {
  student_name: string;
  uni: string;
  email: string;
  subject: string;
  body: string;
};

export const SAMPLE_EMAILS: SampleEmail[] = [
  // 1 – course_withdrawal
  {
    student_name: "Ava Thompson",
    uni: "at2438",
    email: "at2438@columbia.edu",
    subject: "Steps for withdrawing from a course",
    body:
      "Hello, I’m considering withdrawing from a class now that add/drop has closed. Where can I find the Course Withdrawal form, and do I need both my instructor and advisor to sign it before submitting it?",
  },

  // 2 – elective_requirements
  {
    student_name: "Layla Shah",
    uni: "ls2804",
    email: "ls2804@columbia.edu",
    subject: "Which electives count for my degree?",
    body:
      "Hello, I’m choosing courses for next semester and unsure which ones qualify as technical or management electives. Where can I find the official elective list?",
  },

  // 3 – study_abroad
  {
    student_name: "Isabella Wu",
    uni: "iw2990",
    email: "iw2990@columbia.edu",
    subject: "Studying abroad and fulfilling requirements",
    body:
      "Hi, I’m interested in studying abroad during my time here. Which types of requirements can typically be completed abroad, and where can I find more details about approved programs?",
  },

  // 4 – registration_deadline
  {
    student_name: "Nora Bennett",
    uni: "nb2714",
    email: "nb2714@columbia.edu",
    subject: "Clarifying the registration deadline",
    body:
      "Hello, I’m trying to finalize my schedule but I’m unsure when registration officially closes. Is the deadline the same as the one posted on the academic calendar, and does it close at 11:59 p.m.?",
  },

  // 5 – appointment_scheduling (NO Navigate)
  {
    student_name: "Leo Ramirez",
    uni: "lr2901",
    email: "lr2901@columbia.edu",
    subject: "How to schedule an advising appointment",
    body:
      "Hi, I’d like to meet with an advisor to talk about my academic plan. How do I schedule an advising appointment, and is there an option to request a virtual meeting?",
  },
];