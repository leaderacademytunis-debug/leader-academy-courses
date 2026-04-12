# 🎓 Leader Academy Courses Service

Microservice مسؤول عن إدارة الدورات التدريبية والتسجيل والتقييمات والشهادات.

## 📋 الميزات

✅ **إدارة الدورات** - إنشاء وتعديل وحذف الدورات  
✅ **الوحدات والدروس** - تنظيم محتوى الدورات  
✅ **التسجيل** - إدارة تسجيل المستخدمين  
✅ **التقييمات** - إنشاء الاختبارات والمهام  
✅ **الشهادات** - إصدار الشهادات  
✅ **التتبع** - تتبع تقدم المستخدمين  

## 🏗️ البنية المعمارية

```
Courses Service (Port 3001)
├── Courses
├── Modules
├── Lessons
├── Enrollments
├── Assessments
├── Certificates
└── Submissions
```

## 🚀 البدء السريع

### التثبيت

```bash
npm install
```

### التطوير

```bash
npm run dev
```

### البناء

```bash
npm run build
```

### الإنتاج

```bash
npm start
```

## 🔧 الإعدادات

### ملف .env

```env
SERVICE_PORT=3001
SERVICE_NAME=courses
DATABASE_URL=mysql://user:password@localhost:3306/leader_academy_courses
NODE_ENV=development
```

## 📚 API Endpoints

### Courses
```bash
GET /api/courses
POST /api/courses
GET /api/courses/:id
PUT /api/courses/:id
DELETE /api/courses/:id
```

### Enrollments
```bash
POST /api/courses/:id/enroll
GET /api/courses/:id/enrollments
GET /api/users/:userId/enrollments
```

### Assessments
```bash
GET /api/courses/:id/assessments
POST /api/courses/:id/assessments
GET /api/assessments/:id/submit
```

### Certificates
```bash
GET /api/users/:userId/certificates
GET /api/certificates/:id
```

## 💾 قاعدة البيانات

### الجداول الرئيسية

- **courses** - الدورات التدريبية
- **modules** - وحدات الدورات
- **lessons** - الدروس
- **enrollments** - تسجيل المستخدمين
- **assessments** - التقييمات
- **assessment_questions** - أسئلة التقييمات
- **assessment_answers** - إجابات الأسئلة
- **submissions** - تقديمات المستخدمين
- **certificates** - الشهادات

## 🛠️ المتطلبات

- Node.js >= 16
- npm >= 8
- MySQL >= 5.7

## 📝 الترخيص

MIT

## 👨‍💼 المؤلف

Leader Academy Team

---

**Made with ❤️ for Education**
