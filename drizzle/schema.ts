import {
  mysqlTable,
  varchar,
  text,
  int,
  timestamp,
  boolean,
  decimal,
  primaryKey,
  foreignKey,
  index,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ==========================================
// Courses Table
// ==========================================
export const courses = mysqlTable(
  'courses',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    duration: int('duration'), // بالساعات
    level: mysqlEnum('level', ['beginner', 'intermediate', 'advanced']),
    category: varchar('category', { length: 100 }),
    instructor: varchar('instructor', { length: 255 }),
    price: decimal('price', { precision: 10, scale: 2 }),
    isFree: boolean('is_free').default(false),
    isPublished: boolean('is_published').default(false),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    categoryIdx: index('idx_category').on(table.category),
    levelIdx: index('idx_level').on(table.level),
  })
);

// ==========================================
// Course Modules
// ==========================================
export const modules = mysqlTable(
  'modules',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    courseId: varchar('course_id', { length: 36 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    order: int('order'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    courseIdFk: foreignKey({
      columns: [table.courseId],
      foreignColumns: [courses.id],
    }),
    courseIdIdx: index('idx_module_course_id').on(table.courseId),
  })
);

// ==========================================
// Lessons
// ==========================================
export const lessons = mysqlTable(
  'lessons',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    moduleId: varchar('module_id', { length: 36 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content'),
    videoUrl: text('video_url'),
    duration: int('duration'), // بالدقائق
    order: int('order'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    moduleIdFk: foreignKey({
      columns: [table.moduleId],
      foreignColumns: [modules.id],
    }),
    moduleIdIdx: index('idx_lesson_module_id').on(table.moduleId),
  })
);

// ==========================================
// Enrollments
// ==========================================
export const enrollments = mysqlTable(
  'enrollments',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    courseId: varchar('course_id', { length: 36 }).notNull(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    status: mysqlEnum('status', ['active', 'completed', 'dropped']).default('active'),
    progress: int('progress').default(0), // نسبة مئوية
    enrolledAt: timestamp('enrolled_at').defaultNow(),
    completedAt: timestamp('completed_at'),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    courseIdFk: foreignKey({
      columns: [table.courseId],
      foreignColumns: [courses.id],
    }),
    courseIdIdx: index('idx_enrollment_course_id').on(table.courseId),
    userIdIdx: index('idx_enrollment_user_id').on(table.userId),
    uniqueEnrollment: primaryKey({
      columns: [table.courseId, table.userId],
    }),
  })
);

// ==========================================
// Assessments
// ==========================================
export const assessments = mysqlTable(
  'assessments',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    courseId: varchar('course_id', { length: 36 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    type: mysqlEnum('type', ['quiz', 'assignment', 'exam']),
    totalPoints: int('total_points').default(100),
    passingScore: int('passing_score').default(60),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    courseIdFk: foreignKey({
      columns: [table.courseId],
      foreignColumns: [courses.id],
    }),
    courseIdIdx: index('idx_assessment_course_id').on(table.courseId),
  })
);

// ==========================================
// Assessment Questions
// ==========================================
export const assessmentQuestions = mysqlTable(
  'assessment_questions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    assessmentId: varchar('assessment_id', { length: 36 }).notNull(),
    question: text('question').notNull(),
    type: mysqlEnum('type', ['multiple_choice', 'short_answer', 'essay']),
    points: int('points').default(1),
    order: int('order'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    assessmentIdFk: foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [assessments.id],
    }),
    assessmentIdIdx: index('idx_question_assessment_id').on(table.assessmentId),
  })
);

// ==========================================
// Assessment Answers
// ==========================================
export const assessmentAnswers = mysqlTable(
  'assessment_answers',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    questionId: varchar('question_id', { length: 36 }).notNull(),
    answer: text('answer').notNull(),
    isCorrect: boolean('is_correct').default(false),
    order: int('order'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    questionIdFk: foreignKey({
      columns: [table.questionId],
      foreignColumns: [assessmentQuestions.id],
    }),
    questionIdIdx: index('idx_answer_question_id').on(table.questionId),
  })
);

// ==========================================
// User Submissions
// ==========================================
export const submissions = mysqlTable(
  'submissions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    assessmentId: varchar('assessment_id', { length: 36 }).notNull(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    score: int('score'),
    passed: boolean('passed'),
    submittedAt: timestamp('submitted_at').defaultNow(),
    gradedAt: timestamp('graded_at'),
    feedback: text('feedback'),
  },
  (table) => ({
    assessmentIdFk: foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [assessments.id],
    }),
    assessmentIdIdx: index('idx_submission_assessment_id').on(table.assessmentId),
    userIdIdx: index('idx_submission_user_id').on(table.userId),
  })
);

// ==========================================
// Certificates
// ==========================================
export const certificates = mysqlTable(
  'certificates',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    courseId: varchar('course_id', { length: 36 }).notNull(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    certificateNumber: varchar('certificate_number', { length: 100 }).unique(),
    issuedAt: timestamp('issued_at').defaultNow(),
    expiresAt: timestamp('expires_at'),
    pdfUrl: text('pdf_url'),
  },
  (table) => ({
    courseIdFk: foreignKey({
      columns: [table.courseId],
      foreignColumns: [courses.id],
    }),
    courseIdIdx: index('idx_certificate_course_id').on(table.courseId),
    userIdIdx: index('idx_certificate_user_id').on(table.userId),
  })
);

// ==========================================
// Relations
// ==========================================
export const coursesRelations = relations(courses, ({ many }) => ({
  modules: many(modules),
  enrollments: many(enrollments),
  assessments: many(assessments),
  certificates: many(certificates),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assessments.courseId],
    references: [courses.id],
  }),
  questions: many(assessmentQuestions),
}));

export const assessmentQuestionsRelations = relations(assessmentQuestions, ({ one, many }) => ({
  assessment: one(assessments, {
    fields: [assessmentQuestions.assessmentId],
    references: [assessments.id],
  }),
  answers: many(assessmentAnswers),
}));

export const assessmentAnswersRelations = relations(assessmentAnswers, ({ one }) => ({
  question: one(assessmentQuestions, {
    fields: [assessmentAnswers.questionId],
    references: [assessmentQuestions.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  assessment: one(assessments, {
    fields: [submissions.assessmentId],
    references: [assessments.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  course: one(courses, {
    fields: [certificates.courseId],
    references: [courses.id],
  }),
}));
