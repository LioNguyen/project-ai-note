# Cách Hoạt Động của Notes và Chatbot Khi Không Đăng Nhập (Trial Mode)

## 📋 Table of Contents

1. [Tổng Quan](#1-tổng-quan)
2. [Kiến Trúc Toàn Bộ](#2-kiến-trúc-toàn-bộ)
3. [Cách Hoạt Động Notes](#3-cách-hoạt-động-notes)
4. [Cách Hoạt Động Chatbot](#4-cách-hoạt-động-chatbot)
5. [Luồng Dữ Liệu](#5-luồng-dữ-liệu)
6. [So Sánh Trial Mode vs Authenticated Mode](#6-so-sánh-trial-mode-vs-authenticated-mode)

---

## 1. Tổng Quan

Khi bạn **không đăng nhập**, ứng dụng hoạt động ở **Trial Mode**:

```
Truy cập http://localhost:3000/notes
    ↓
Không có session (không đăng nhập)
    ↓
Tải Trial Mode thay vì yêu cầu đăng nhập
    ↓
Dữ liệu lưu trữ trong localStorage (bộ nhớ trình duyệt)
    ↓
Tối đa 5 notes có thể tạo
```

---

## 2. Kiến Trúc Toàn Bộ

### 2.1 Luồng Xác Thực (Authentication Flow)

```typescript
[Trang Home] → redirect("/notes")
                    ↓
            [Notes Page]
                    ↓
    getOptionalUserId() - Kiểm tra xem có session không
                    ↓
         ┌──────────────────────────┐
         ↓                          ↓
    Có userId         Không có userId
  (Đã đăng nhập)      (Chưa đăng nhập)
         ↓                          ↓
   Hiển thị            Hiển thị Trial Mode
   NotesGrid          (NotesGridClient)
   (Database)         (localStorage)
```

### 2.2 Middleware - Cho Phép Truy Cập

```typescript
// middleware.ts
middleware(request) {
  const publicRoutes = ["/", "/notes", "/sign-in", "/sign-up"];

  // Nếu là route công khai → cho phép truy cập
  if (isPublicRoute) return NextResponse.next();

  // Không phải route công khai → yêu cầu đăng nhập
  return NextResponse.redirect("/notes");
}
```

---

## 3. Cách Hoạt Động Notes

### 3.1 Tạo Note Mới (Không Đăng Nhập)

```
Người dùng nhấn nút "+ Add Note"
    ↓
[AddEditNoteDialog Component] (client-side)
    ↓
useSession() hook → session.data?.user = null
    ↓
NOT Authenticated → Sử dụng Trial Mode
    ↓
trialStore.createNote(title, content)
    ↓
Kiểm tra: Đã tạo 5 notes chưa?
    ├─ Nếu YES → Hiển thị "Trial Limit Dialog"
    ├─ Nếu NO → Tiếp tục
    ↓
createTrialNote() → trialMode.ts
    ↓
Tạo object mới:
{
  id: "trial-1731410000000-abc123",  // ID unique
  title: "My Note",
  content: "Content here",
  createdAt: "2024-11-13T10:00:00Z",
  updatedAt: "2024-11-13T10:00:00Z"
}
    ↓
Lưu vào localStorage:
localStorage.setItem("trial-notes", JSON.stringify([...]))
    ↓
Cập nhật Zustand Store
    ↓
trialStore.loadNotes() → Làm mới danh sách
    ↓
router.refresh() → Render lại component
    ↓
Hiển thị toast: "Successfully created"
```

### 3.2 Lưu Trữ Dữ Liệu

**localStorage Structure:**

```javascript
// Trong browser, key: "trial-notes"
localStorage.getItem("trial-notes")[
  // Kết quả:
  ({
    id: "trial-1731410000000-abc123",
    title: "Note 1",
    content: "Content",
    createdAt: "2024-11-13T10:00:00Z",
    updatedAt: "2024-11-13T10:00:00Z",
  },
  {
    id: "trial-1731410000001-def456",
    title: "Note 2",
    content: "Content 2",
    createdAt: "2024-11-13T10:05:00Z",
    updatedAt: "2024-11-13T10:05:00Z",
  })
  // ...tối đa 5 notes
];
```

### 3.3 Hiển Thị Danh Sách Notes

```
[NotesGridClient] component
    ↓
useTrialModeStore() → Lấy notes từ store
    ↓
trialNotes.map(note => {
  convertTrialNoteToNote(note) → Chuyển sang format Prisma
})
    ↓
Lọc (Filter) dựa trên search query
    ↓
Sắp xếp (Sort) dựa trên lựa chọn người dùng
    ↓
Hiển thị trong Grid (4 cột trên desktop)
```

### 3.4 Sửa/Xóa Notes

**Sửa:**

```typescript
trialStore.updateNote(id, newTitle, newContent)
  ↓
updateTrialNote(id, title, content)
  ↓
Tìm note trong mảng
  ↓
Cập nhật title, content, updatedAt
  ↓
Lưu lại vào localStorage
  ↓
Refresh store → Render lại UI
```

**Xóa:**

```typescript
trialStore.deleteNote(id)
  ↓
deleteTrialNote(id)
  ↓
Lọc bỏ note với id đó
  ↓
Lưu mảng còn lại vào localStorage
  ↓
Refresh store
```

---

## 4. Cách Hoạt Động Chatbot

### 4.1 Gửi Tin Nhắn Chat (Không Đăng Nhập)

```
Người dùng nhập tin nhắn
    ↓
[AIChatBox] Component
    ↓
useSession() → session.data?.user = null → NOT authenticated
    ↓
useTrialModeStore() → Lấy { notes: trialNotes }
    ↓
useChat({
  body: {
    trialNotes: trialNotes  // ← Gửi trial notes theo body
  }
})
    ↓
Gửi POST /api/chat với:
{
  "messages": [
    { "role": "user", "content": "Hello" }
  ],
  "trialNotes": [
    { "id": "...", "title": "...", "content": "..." }
  ]
}
```

### 4.2 Xử Lý Chat Trên Server

```
[POST /api/chat] - route.ts
    ↓
getOptionalUserId() → userId = null (không đăng nhập)
    ↓
!userId === true → Trial Mode
    ↓
processChatRequestTrial(messages, trialNotes)
    ↓
Chiết xuất keyword từ tin nhắn cuối cùng
    ↓
Tìm kiếm trong trialNotes:
  - Tìm notes có title khớp keyword
  - Hoặc content khớp keyword
  - Tối đa 3 notes phù hợp nhất
    ↓
Nếu không tìm được → Lấy 3 notes đầu tiên
    ↓
Xây dựng System Prompt:
"Đây là tổng quan notes của user:
- Total: 5 notes
- Titles: ['Note 1', 'Note 2', ...]
- Relevant Notes:
  * Note 1: Content here
  * Note 2: Content here"
    ↓
Gửi system prompt + user message tới Gemini API
    ↓
Nhận response stream
    ↓
Truyền stream trở lại client
    ↓
Hiển thị response trong chatbox
```

### 4.3 So Sánh: Trial vs Authenticated

| Tiêu Chí           | Trial Mode                 | Authenticated              |
| ------------------ | -------------------------- | -------------------------- |
| **Tìm kiếm notes** | Keyword matching (từ khóa) | Semantic search (Pinecone) |
| **Tốc độ**         | Nhanh (local)              | Chậm hơn (API + DB)        |
| **Độ chính xác**   | Thấp hơn                   | Cao hơn                    |
| **Max notes**      | 3 notes                    | Không giới hạn             |
| **Storage**        | localStorage               | PostgreSQL + Pinecone      |

---

## 5. Luồng Dữ Liệu (Data Flow)

### 5.1 Khi Tạo Note

```
┌─────────────────────────────────────┐
│  AddEditNoteDialog (Client)         │
│  - nhập title, content              │
│  - nhấn "Submit"                    │
└──────────────┬──────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  onSubmit() function                 │
│  - Check: session?.user?             │
└──────────────┬───────────────────────┘
               ↓
         (Không có session)
               ↓
┌──────────────────────────────────────┐
│  useTrialModeStore                   │
│  - createNote(title, content)        │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  trialMode.ts                        │
│  - createTrialNote()                 │
│  - Check limit: 5?                   │
│  - Tạo unique ID                     │
│  - Add timestamp                     │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  localStorage                        │
│  - setItem("trial-notes", JSON)      │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  Zustand Store                       │
│  - setState({ notes: [...new] })     │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  UI Update                           │
│  - NotesGridClient re-render         │
│  - Toast: "Successfully created"     │
│  - Close dialog                      │
└──────────────────────────────────────┘
```

### 5.2 Khi Chat

```
┌──────────────────────────────────────┐
│  AIChatBox (Client)                  │
│  - Người dùng gõ tin nhắn            │
│  - Nhấn Send                         │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  useChat() hook                      │
│  - Gủi POST /api/chat                │
│  - Gửi trialNotes trong body         │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  Backend: POST /api/chat             │
│  - Nhận messages + trialNotes        │
│  - Kiểm tra: có userId?              │
│  - NO → processChatRequestTrial()    │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  processChatRequestTrial()           │
│  - Keyword matching                  │
│  - Tìm relevant notes                │
│  - Build system prompt               │
│  - Call Gemini API                   │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  Gemini API                          │
│  - Process request                   │
│  - Stream response                   │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  Backend: Stream Response            │
│  - ReadableStream<Uint8Array>        │
│  - Gửi từng chunk về client          │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  Client: useChat hook                │
│  - Nhận stream                       │
│  - Cập nhật messages state           │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│  ChatBox UI                          │
│  - Re-render messages                │
│  - Hiển thị response từng chút       │
└──────────────────────────────────────┘
```

---

## 6. So Sánh Trial Mode vs Authenticated Mode

### 6.1 Notes

```
┌─────────────────────────────────────────────────────────┐
│                    TRIAL MODE                          │
├─────────────────────────────────────────────────────────┤
│ • Storage: localStorage (browser cache)                 │
│ • Data: Client-side only                               │
│ • Limit: 5 notes maximum                               │
│ • Persistence: Lost when clearing browser data         │
│ • Sync: No sync across devices                         │
│ • Speed: Very fast (no server call)                    │
│ • Database: None                                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                AUTHENTICATED MODE                       │
├─────────────────────────────────────────────────────────┤
│ • Storage: PostgreSQL Database                         │
│ • Data: Server-side (more secure)                      │
│ • Limit: Unlimited                                     │
│ • Persistence: Permanent until user deletes            │
│ • Sync: Synced across all devices                      │
│ • Speed: Slightly slower (API + DB query)             │
│ • Database: Prisma ORM                                 │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Chatbot

```
┌──────────────────────────────────────────────────────────┐
│            TRIAL MODE - Keyword Search                  │
├──────────────────────────────────────────────────────────┤
│ Ví dụ:                                                  │
│ User: "Show me notes about Python"                      │
│ → Tìm title/content có "Python"                        │
│ → Lấy 3 notes phù hợp nhất                             │
│ Ưu điểm: Nhanh, không cần API                          │
│ Nhược điểm: Kém chính xác, không hiểu ngữ pháp        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│        AUTHENTICATED MODE - Semantic Search             │
├──────────────────────────────────────────────────────────┤
│ Ví dụ:                                                  │
│ User: "Show me notes about Python"                      │
│ → Chuyển thành vector (embedding)                      │
│ → So sánh với toàn bộ notes trong Pinecone             │
│ → Lấy notes giống nhất về ngữ nghĩa                    │
│ Ưu điểm: Chính xác cao, hiểu ngữ pháp                 │
│ Nhược điểm: Chậm hơn, cần API                          │
└──────────────────────────────────────────────────────────┘
```

---

## 7. Quy Trình Thực Tế - Step by Step

### 7.1 Bạn Tạo Note Đầu Tiên

```
1. Bạn truy cập http://localhost:3000/notes
   → Không có session
   → Hiển thị Trial Mode

2. Bạn nhấn "+ Add Note"
   → Dialog mở

3. Bạn nhập:
   Title: "Learn JavaScript"
   Content: "JavaScript is awesome"

4. Bạn nhấn "Submit"
   → Server nhận: session = null
   → Sử dụng trialStore.createNote()

5. createTrialNote() tạo object:
   {
     id: "trial-1731410000000-xyz789",
     title: "Learn JavaScript",
     content: "JavaScript is awesome",
     createdAt: "2024-11-13T10:00:00.000Z",
     updatedAt: "2024-11-13T10:00:00.000Z"
   }

6. Lưu vào localStorage:
   localStorage["trial-notes"] = [
     {id: "trial-...", title: "Learn JavaScript", ...}
   ]

7. Store được cập nhật:
   useTrialModeStore.setState({
     notes: [1 note],
     noteCount: 1,
     remainingNotes: 4,
     hasReachedLimit: false
   })

8. UI cập nhật:
   - Banner hiển thị: "4 / 5 notes remaining"
   - Note mới xuất hiện trong grid
   - Dialog đóng
   - Toast: "Note created successfully"

9. Khi bạn load lại trang (F5):
   → localStorage vẫn có note đó
   → Note vẫn hiển thị
   → Data không bị mất
```

### 7.2 Bạn Chat Về Note

```
1. Bạn mở Chatbot (góc dưới phải)

2. Bạn gõ: "What's in my notes about JavaScript?"

3. Chatbot gửi đến server:
   {
     "messages": [
       {
         "role": "user",
         "content": "What's in my notes about JavaScript?"
       }
     ],
     "trialNotes": [
       {
         "id": "trial-...",
         "title": "Learn JavaScript",
         "content": "JavaScript is awesome",
         ...
       }
     ]
   }

4. Server nhận request:
   → Kiểm tra: userId = null
   → Sử dụng: processChatRequestTrial()

5. processChatRequestTrial() thực thi:
   a) Chiết xuất keyword: ["JavaScript"]
   b) Tìm trong trialNotes:
      → "Learn JavaScript" title khớp!
      → Lấy note này
   c) Build prompt:
      System: "User có 1 note:
               - Learn JavaScript: 'JavaScript is awesome'"
      User: "What's in my notes about JavaScript?"
   d) Gọi Gemini API:
      → Stream response

6. Gemini trả về:
   "Based on your notes, you have a note about
    learning JavaScript. The note mentions that
    'JavaScript is awesome'..."

7. Chatbot hiển thị response từng chút một
```

---

## 8. Kỹ Thuật Chi Tiết

### 8.1 ID Generation cho Trial Notes

```typescript
// Tạo unique ID cho trial note
id: `trial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Ví dụ:
// trial-1731410000000-xyz789abc
// trial-1731410050123-def456ghi
```

### 8.2 Zustand Store Flow

```typescript
// Lấy store instance
const store = useTrialModeStore()

// State ban đầu
{
  notes: [],
  isTrialMode: false,
  noteCount: 0,
  remainingNotes: 5,
  hasReachedLimit: false
}

// Sau khi createNote()
{
  notes: [1 new note],
  isTrialMode: true,
  noteCount: 1,
  remainingNotes: 4,
  hasReachedLimit: false
}

// Sau khi tạo 5 notes
{
  notes: [5 notes],
  isTrialMode: true,
  noteCount: 5,
  remainingNotes: 0,
  hasReachedLimit: true  ← Show dialog!
}
```

### 8.3 Chat Message Format

```typescript
// Client gửi
interface ChatRequest {
  messages: ChatMessage[]; // Conversation history
  trialNotes?: TrialNoteForChat[]; // Trial notes nếu trial mode
}

// Server xử lý
if (!userId && trialNotes) {
  processChatRequestTrial(messages, trialNotes);
} else {
  processChatRequest(userId, messages);
}
```

---

## 9. Tóm Tắt

| Thành Phần  | Trial Mode     | Cách Hoạt Động           |
| ----------- | -------------- | ------------------------ |
| **Storage** | localStorage   | Browser cache            |
| **Notes**   | Max 5          | Trong `/trial-notes` key |
| **Chat**    | Keyword search | Tìm trong title/content  |
| **Speed**   | Rất nhanh      | Không API call           |
| **Sync**    | Không          | Chỉ cục bộ               |
| **Limit**   | 5 notes        | Xác thực khi tạo         |

---

Tất cả diễn ra **hoàn toàn trên browser** của bạn, không cần đăng nhập hay gọi API! 🎉
