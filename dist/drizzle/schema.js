"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificatesRelations = exports.submissionsRelations = exports.assessmentAnswersRelations = exports.assessmentQuestionsRelations = exports.assessmentsRelations = exports.enrollmentsRelations = exports.lessonsRelations = exports.modulesRelations = exports.coursesRelations = exports.certificates = exports.submissions = exports.assessmentAnswers = exports.assessmentQuestions = exports.assessments = exports.enrollments = exports.lessons = exports.modules = exports.courses = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
// ==========================================
// Courses Table
// ==========================================
exports.courses = (0, mysql_core_1.mysqlTable)('courses', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    title: (0, mysql_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)('description'),
    duration: (0, mysql_core_1.int)('duration'), // بالساعات
    level: (0, mysql_core_1.mysqlEnum)('level', ['beginner', 'intermediate', 'advanced']),
    category: (0, mysql_core_1.varchar)('category', { length: 100 }),
    instructor: (0, mysql_core_1.varchar)('instructor', { length: 255 }),
    price: (0, mysql_core_1.decimal)('price', { precision: 10, scale: 2 }),
    isFree: (0, mysql_core_1.boolean)('is_free').default(false),
    isPublished: (0, mysql_core_1.boolean)('is_published').default(false),
    imageUrl: (0, mysql_core_1.text)('image_url'),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    categoryIdx: (0, mysql_core_1.index)('idx_category').on(table.category),
    levelIdx: (0, mysql_core_1.index)('idx_level').on(table.level),
}));
// ==========================================
// Course Modules
// ==========================================
exports.modules = (0, mysql_core_1.mysqlTable)('modules', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    courseId: (0, mysql_core_1.varchar)('course_id', { length: 36 }).notNull(),
    title: (0, mysql_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)('description'),
    order: (0, mysql_core_1.int)('order'),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    courseIdFk: (0, mysql_core_1.foreignKey)({
        columns: [table.courseId],
        foreignColumns: [exports.courses.id],
    }),
    courseIdIdx: (0, mysql_core_1.index)('idx_module_course_id').on(table.courseId),
}));
// ==========================================
// Lessons
// ==========================================
exports.lessons = (0, mysql_core_1.mysqlTable)('lessons', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    moduleId: (0, mysql_core_1.varchar)('module_id', { length: 36 }).notNull(),
    title: (0, mysql_core_1.varchar)('title', { length: 255 }).notNull(),
    content: (0, mysql_core_1.text)('content'),
    videoUrl: (0, mysql_core_1.text)('video_url'),
    duration: (0, mysql_core_1.int)('duration'), // بالدقائق
    order: (0, mysql_core_1.int)('order'),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    moduleIdFk: (0, mysql_core_1.foreignKey)({
        columns: [table.moduleId],
        foreignColumns: [exports.modules.id],
    }),
    moduleIdIdx: (0, mysql_core_1.index)('idx_lesson_module_id').on(table.moduleId),
}));
// ==========================================
// Enrollments
// ==========================================
exports.enrollments = (0, mysql_core_1.mysqlTable)('enrollments', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    courseId: (0, mysql_core_1.varchar)('course_id', { length: 36 }).notNull(),
    userId: (0, mysql_core_1.varchar)('user_id', { length: 36 }).notNull(),
    status: (0, mysql_core_1.mysqlEnum)('status', ['active', 'completed', 'dropped']).default('active'),
    progress: (0, mysql_core_1.int)('progress').default(0), // نسبة مئوية
    enrolledAt: (0, mysql_core_1.timestamp)('enrolled_at').defaultNow(),
    completedAt: (0, mysql_core_1.timestamp)('completed_at'),
    updatedAt: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    courseIdFk: (0, mysql_core_1.foreignKey)({
        columns: [table.courseId],
        foreignColumns: [exports.courses.id],
    }),
    courseIdIdx: (0, mysql_core_1.index)('idx_enrollment_course_id').on(table.courseId),
    userIdIdx: (0, mysql_core_1.index)('idx_enrollment_user_id').on(table.userId),
    uniqueEnrollment: (0, mysql_core_1.primaryKey)({
        columns: [table.courseId, table.userId],
    }),
}));
// ==========================================
// Assessments
// ==========================================
exports.assessments = (0, mysql_core_1.mysqlTable)('assessments', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    courseId: (0, mysql_core_1.varchar)('course_id', { length: 36 }).notNull(),
    title: (0, mysql_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)('description'),
    type: (0, mysql_core_1.mysqlEnum)('type', ['quiz', 'assignment', 'exam']),
    totalPoints: (0, mysql_core_1.int)('total_points').default(100),
    passingScore: (0, mysql_core_1.int)('passing_score').default(60),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    courseIdFk: (0, mysql_core_1.foreignKey)({
        columns: [table.courseId],
        foreignColumns: [exports.courses.id],
    }),
    courseIdIdx: (0, mysql_core_1.index)('idx_assessment_course_id').on(table.courseId),
}));
// ==========================================
// Assessment Questions
// ==========================================
exports.assessmentQuestions = (0, mysql_core_1.mysqlTable)('assessment_questions', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    assessmentId: (0, mysql_core_1.varchar)('assessment_id', { length: 36 }).notNull(),
    question: (0, mysql_core_1.text)('question').notNull(),
    type: (0, mysql_core_1.mysqlEnum)('type', ['multiple_choice', 'short_answer', 'essay']),
    points: (0, mysql_core_1.int)('points').default(1),
    order: (0, mysql_core_1.int)('order'),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
}, (table) => ({
    assessmentIdFk: (0, mysql_core_1.foreignKey)({
        columns: [table.assessmentId],
        foreignColumns: [exports.assessments.id],
    }),
    assessmentIdIdx: (0, mysql_core_1.index)('idx_question_assessment_id').on(table.assessmentId),
}));
// ==========================================
// Assessment Answers
// ==========================================
exports.assessmentAnswers = (0, mysql_core_1.mysqlTable)('assessment_answers', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    questionId: (0, mysql_core_1.varchar)('question_id', { length: 36 }).notNull(),
    answer: (0, mysql_core_1.text)('answer').notNull(),
    isCorrect: (0, mysql_core_1.boolean)('is_correct').default(false),
    order: (0, mysql_core_1.int)('order'),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow(),
}, (table) => ({
    questionIdFk: (0, mysql_core_1.foreignKey)({
        columns: [table.questionId],
        foreignColumns: [exports.assessmentQuestions.id],
    }),
    questionIdIdx: (0, mysql_core_1.index)('idx_answer_question_id').on(table.questionId),
}));
// ==========================================
// User Submissions
// ==========================================
exports.submissions = (0, mysql_core_1.mysqlTable)('submissions', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    assessmentId: (0, mysql_core_1.varchar)('assessment_id', { length: 36 }).notNull(),
    userId: (0, mysql_core_1.varchar)('user_id', { length: 36 }).notNull(),
    score: (0, mysql_core_1.int)('score'),
    passed: (0, mysql_core_1.boolean)('passed'),
    submittedAt: (0, mysql_core_1.timestamp)('submitted_at').defaultNow(),
    gradedAt: (0, mysql_core_1.timestamp)('graded_at'),
    feedback: (0, mysql_core_1.text)('feedback'),
}, (table) => ({
    assessmentIdFk: (0, mysql_core_1.foreignKey)({
        columns: [table.assessmentId],
        foreignColumns: [exports.assessments.id],
    }),
    assessmentIdIdx: (0, mysql_core_1.index)('idx_submission_assessment_id').on(table.assessmentId),
    userIdIdx: (0, mysql_core_1.index)('idx_submission_user_id').on(table.userId),
}));
// ==========================================
// Certificates
// ==========================================
exports.certificates = (0, mysql_core_1.mysqlTable)('certificates', {
    id: (0, mysql_core_1.varchar)('id', { length: 36 }).primaryKey(),
    courseId: (0, mysql_core_1.varchar)('course_id', { length: 36 }).notNull(),
    userId: (0, mysql_core_1.varchar)('user_id', { length: 36 }).notNull(),
    certificateNumber: (0, mysql_core_1.varchar)('certificate_number', { length: 100 }).unique(),
    issuedAt: (0, mysql_core_1.timestamp)('issued_at').defaultNow(),
    expiresAt: (0, mysql_core_1.timestamp)('expires_at'),
    pdfUrl: (0, mysql_core_1.text)('pdf_url'),
}, (table) => ({
    courseIdFk: (0, mysql_core_1.foreignKey)({
        columns: [table.courseId],
        foreignColumns: [exports.courses.id],
    }),
    courseIdIdx: (0, mysql_core_1.index)('idx_certificate_course_id').on(table.courseId),
    userIdIdx: (0, mysql_core_1.index)('idx_certificate_user_id').on(table.userId),
}));
// ==========================================
// Relations
// ==========================================
exports.coursesRelations = (0, drizzle_orm_1.relations)(exports.courses, ({ many }) => ({
    modules: many(exports.modules),
    enrollments: many(exports.enrollments),
    assessments: many(exports.assessments),
    certificates: many(exports.certificates),
}));
exports.modulesRelations = (0, drizzle_orm_1.relations)(exports.modules, ({ one, many }) => ({
    course: one(exports.courses, {
        fields: [exports.modules.courseId],
        references: [exports.courses.id],
    }),
    lessons: many(exports.lessons),
}));
exports.lessonsRelations = (0, drizzle_orm_1.relations)(exports.lessons, ({ one }) => ({
    module: one(exports.modules, {
        fields: [exports.lessons.moduleId],
        references: [exports.modules.id],
    }),
}));
exports.enrollmentsRelations = (0, drizzle_orm_1.relations)(exports.enrollments, ({ one }) => ({
    course: one(exports.courses, {
        fields: [exports.enrollments.courseId],
        references: [exports.courses.id],
    }),
}));
exports.assessmentsRelations = (0, drizzle_orm_1.relations)(exports.assessments, ({ one, many }) => ({
    course: one(exports.courses, {
        fields: [exports.assessments.courseId],
        references: [exports.courses.id],
    }),
    questions: many(exports.assessmentQuestions),
}));
exports.assessmentQuestionsRelations = (0, drizzle_orm_1.relations)(exports.assessmentQuestions, ({ one, many }) => ({
    assessment: one(exports.assessments, {
        fields: [exports.assessmentQuestions.assessmentId],
        references: [exports.assessments.id],
    }),
    answers: many(exports.assessmentAnswers),
}));
exports.assessmentAnswersRelations = (0, drizzle_orm_1.relations)(exports.assessmentAnswers, ({ one }) => ({
    question: one(exports.assessmentQuestions, {
        fields: [exports.assessmentAnswers.questionId],
        references: [exports.assessmentQuestions.id],
    }),
}));
exports.submissionsRelations = (0, drizzle_orm_1.relations)(exports.submissions, ({ one }) => ({
    assessment: one(exports.assessments, {
        fields: [exports.submissions.assessmentId],
        references: [exports.assessments.id],
    }),
}));
exports.certificatesRelations = (0, drizzle_orm_1.relations)(exports.certificates, ({ one }) => ({
    course: one(exports.courses, {
        fields: [exports.certificates.courseId],
        references: [exports.courses.id],
    }),
}));
//# sourceMappingURL=schema.js.map