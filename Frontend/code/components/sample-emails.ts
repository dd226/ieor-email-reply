// Frontend/code/components/sample-emails.ts

export type SampleEmail = {
  student_name: string;
  uni: string;
  email: string;
  subject: string;
  body: string;
};

export const SAMPLE_EMAILS: SampleEmail[] = [
  // ==================== REGISTRATION DEADLINE (>90% confidence) ====================
  {
    student_name: "Emre Baser 1",
    uni: "eb3514",
    email: "eb3514@columbia.edu",
    subject: "Registration Deadline Question",
    body:
      "When is the deadline to register for classes?",
  },

  // ==================== COURSE WITHDRAWAL (>90% confidence) ====================
  {
    student_name: "Emre Baser 2",
    uni: "eb3514",
    email: "eb3514@columbia.edu",
    subject: "Course Withdrawal Question",
    body:
      "How do I drop a class after the deadline?",
  },

  // ==================== APPOINTMENT SCHEDULING (>90% confidence) ====================
  {
    student_name: "Emre Baser 3",
    uni: "eb3514",
    email: "eb3514@columbia.edu",
    subject: "Appointment Scheduling Question",
    body:
      "How to schedule meeting with advisor?",
  },

  // ==================== ELECTIVE REQUIREMENTS (>90% confidence) ====================
  {
    student_name: "Emre Baser 4",
    uni: "eb3514",
    email: "eb3514@columbia.edu",
    subject: "Elective Requirements Question",
    body:
      "Which courses count as technical electives?",
  },

  // ==================== CHANGE MAJOR (>90% confidence) ====================
  {
    student_name: "Emre Baser 5",
    uni: "eb3514",
    email: "eb3514@columbia.edu",
    subject: "Change Major Question",
    body:
      "I want to switch majors. How can I change my major?",
  },
];