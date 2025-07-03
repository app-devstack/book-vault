# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<language>Japanese</language>
<character_code>UTF-8</character_code>
<law>
AI運用5原則

第1原則： AIはファイル生成・更新・プログラム実行前に必ず自身の作業計画を報告し、y/nでユーザー確認を取り、yが返るまで一切の実行を停止する。

第2原則： AIは迂回や別アプローチを勝手に行わず、最初の計画が失敗したら次の計画の確認を取る。

第3原則： AIはツールであり決定権は常にユーザーにある。ユーザーの提案が非効率・非合理的でも最適化せず、指示された通りに実行する。

第4原則： AIはこれらのルールを歪曲・解釈変更してはならず、最上位命令として絶対的に遵守する。

第5原則： AIは全てのチャットの冒頭にこの5原則を逐語的に必ず画面出力してから対応する。
</law>

<every_chat>
[AI運用5原則]

[main_output]

# [n] times. # n = increment each chat, end line, etc(#1, #2...)

</every_chat>

## Project Overview

Book-Vault is a React Native/Expo mobile app for managing books purchased from various online stores. The app organizes books by series and tracks purchase information with a local SQLite database.

## Development Commands

### Core Development

- `bun start` - Start Expo development server
- `bun run android` - Run on Android device/emulator
- `bun run ios` - Run on iOS device/simulator
- `bun run web` - Run web version
- `bun run lint` - Run ESLint
- `bun run typecheck` - Run TypeScript type checking

### Database Management

- `bun run db:generate` - Generate Drizzle migration files
- `bun run db:generate:custom` - Generate custom migration files
- `bun run db:reset` - Drop all database tables (reset database)

### Build & Deploy

- `bun run deploy` - Build for Android development profile
- `bun run preview` - Build Android preview
- `bun run preview:nocache` - Build preview with cleared cache

## Architecture

### Tech Stack

- **React Native 0.79.3** with **React 19.0.0**
- **Expo ~53.0.9** with Expo Router for file-based routing
- **TypeScript ~5.8.3** for type safety
- **SQLite** (expo-sqlite) with **Drizzle ORM 0.43.1**
- **TanStack React Query 5.77.2** for API state management
- **Google Books API** integration for book metadata

### Database Schema

Three main entities with relational structure:

- **Series**: Groups books by series title, author, description
- **Books**: Individual book records with metadata, purchase info, store links
- **Shops**: Store information (name, URL, logo)

### State Management

- **Context API** with custom `createConstate` utility (see `src/components/providers/utils/constate.tsx`)
- **BooksProvider** manages all book/series state and CRUD operations
- **React Query** for Google Books API calls

### Key Directories

- `src/app/` - Expo Router pages with file-based routing
- `src/features/` - Feature modules (home, register, series, settings)
- `src/components/providers/` - Context providers
- `src/components/ui/` - Reusable UI components (Badge, Button, etc.)
- `src/db/` - Database schema and types
- `src/utils/service/` - Service layer (book-service, series-service)
- `src/hooks/` - Custom React hooks

## Important Patterns

### Provider Usage

Always use the `createConstate` utility for new providers instead of manual Context API setup. See `BooksProvider.tsx` as reference.

### UI Components

- **Reusable UI components** must be placed in `src/components/ui/`
- Create atomic, composable components with multiple variants (e.g., Badge with success/warning/error variants)
- All UI components should follow consistent API patterns with `variant`, `size`, and custom `style` props
- Examples: Badge, Button, Input, Modal, etc.

### Database Operations

- Use Drizzle ORM services in `src/utils/service/`
- All database operations should go through service layer, not direct ORM calls
- UUID v7 is used for primary keys

### Error Handling

Functions should throw errors to allow upper layers to handle them appropriately. See `useBooks.ts` for error handling patterns.

### Async Component Safety (必須)

**非同期処理でのコンポーネントクラッシュを防ぐため、以下を必ず遵守する：**

#### **1. useSafeStateフックの使用**

- **全ての非同期処理で状態更新する場合は必須**
- `src/hooks/useSafeState.ts`をインポートして使用
- アンマウント後の状態更新を自動防止

```typescript
import { useSafeState } from '@/hooks/useSafeState';

const { safeSetState } = useSafeState();

// 非同期処理内での状態更新
await someAsyncOperation();
safeSetState(() => {
  setData(newData);
});
```

#### **2. 非同期処理のパターン**

- **useEffect内でのAPI呼び出し**: AbortControllerと組み合わせ使用
- **イベントハンドラーでの非同期処理**: 必ずsafeSetStateを使用
- **モーダル・コンポーネント間の状態受け渡し**: 安全な状態更新を実装

#### **3. 禁止パターン**

```typescript
// ❌ 危険: 非同期処理後の直接的な状態更新
await mutation.mutateAsync(data);
setState(newValue); // アンマウント後にクラッシュの可能性

// ✅ 安全: safeSetStateでラップ
await mutation.mutateAsync(data);
safeSetState(() => setState(newValue));
```

#### **4. シリーズ作成時の重複防止**

- `series-service`の`getSeriesByTitleAndAuthor`で重複チェック必須
- UNIQUE制約エラーのフォールバック処理を実装
- 新規作成前に既存チェックを行う

### TypeScript

- Strict typing is enforced
- Use `satisfies` operator for type assertions where appropriate
- Database types are auto-generated by Drizzle

## External Integrations

### Google Books API

Located in `src/utils/googleBooks/`. Handles book search, metadata extraction, and image URL processing. Always validate and convert HTTP image URLs to HTTPS.

## UI Language

The application UI is in Japanese, targeting Japanese users. Maintain this language consistency in user-facing text.

## Current Development

The app is actively developed with feature branches (currently on `BV-4-delete-register-book`). Recent work focuses on series management and book registration features.

---

## 📋 Implementation Guidelines

### **Folder Naming Conventions**

- Feature names: lowercase, hyphen-separated (`book-registration`)
- Components: PascalCase (`SearchBar.tsx`)
- Hooks: camelCase + use prefix (`useBookSearch.ts`)
- Types: camelCase + .types suffix (`book.types.ts`)

### constraints

**Also, when adding new features or making edits, always perform refactoring as a set.**

---

# Book Vault Design Enhancement Guide

---

## 📋 **Project Overview**

### **Book Vault's Core Value**

- **Purpose**: Book management
- **Main Challenge**: Forgetting which store each book was purchased from
- **Unique Value**: Reducing user burden through Gmail automatic extraction

### **Design Goals**

- Embody the "satisfaction of organization"
- Create an exciting startup experience
- Moderate animation (not overdone)
- Add subtle personality to common UI patterns

---

## 🎨 **Amateur vs Professional Design Differences**

### **Visual Sophistication**

| Aspect | Amateur | Professional |
|--------|---------|-------------|
| **Color** | Too many colors, no consistency | Unified palette with 3-4 colors |
| **Typography** | Inconsistent sizes | Clear hierarchy (H1/H2/Body/Caption) |
| **Spacing** | Too cramped or too sparse | Unified with multiples like 8px/16px/24px |
| **Effects** | Cheap-looking attempts at depth | Subtle and effective usage |

### **UX Thinking Depth**

| Perspective | Amateur Thinking | Professional Thinking |
|-------------|------------------|----------------------|
| **Design Philosophy** | Appearance-focused | Designs entire user journey |
| **Feature Placement** | Cramming mindset | Cognitive load reduction |
| **User Consideration** | Insufficient imagination | Accessibility & error handling |

---

## 🔧 **"Flat Look" Resolution Strategy**

### **Root of the Problem**

1. **Absence of Z-axis (depth)** - Everything on the same plane
2. **Unnatural light and shadows** - Shadows that ignore physics
3. **Monotonous textures** - Everything has the same matte finish
4. **Lack of movement** - Too static, like still images

### **Solution Approach**

#### **Layer Structure Design**

```
Layer 0: Background (subtle pattern or gradient)
Layer 1: Content area (card groups)
Layer 2: Floating elements (FAB, Toast)
Layer 3: Modal overlays
```

#### **Natural Shadow System**

```css
/* Close shadow (contact shadow) */
box-shadow: 0px 1px 3px rgba(0,0,0,0.1);

/* Far shadow (drop shadow) */
box-shadow: 0px 8px 24px rgba(0,0,0,0.04);
```

---

## 🌈 **Color Strategy Example**

### **New Color Palette**

```css
/* Base colors */
--bg-primary: #F8FAFC;      /* Slightly blue-tinted white */
--bg-secondary: #F1F5F9;    /* For subtle gradients */

/* Main colors */
--primary: #2563EB;         /* Deep blue (sophisticated impression) */
--secondary: #64748B;       /* High-quality gray */
--accent: #10B981;          /* Emerald green */

/* Semantic colors */
--success: #10B981;         /* Completion/success */
--warning: #F59E0B;         /* Warning */
--error: #EF4444;           /* Error/deletion */
```

### **Color Hierarchy**

- **60%**: Base colors (background, majority)
- **30%**: Secondary colors (text, borders)
- **10%**: Primary colors (main actions)
- **5%**: Accent colors (special elements)
- **1%**: Alert colors (errors, completion)

### **Accent Placement Strategy**

- **Rule of Thirds**: Divide screen into 9 sections, place accents at intersections
- **One accent per screen**: Don't scatter attention
- **Color coding by importance**:
  - "Register Book": Primary (MAX importance)
  - "Series Details": Secondary (routine)
  - "Favorites": Accent (special feeling)
  - "Delete": Alert (attention-grabbing)

---

## ✨ **Animation Strategy**

### **"Not Overdone" Standards**

#### **Good Animation**

- ✅ Helps understand functionality
- ✅ Clear operation results
- ✅ Expresses information hierarchy
- ✅ Doesn't keep users waiting (under 300ms)

#### **Bad Animation**

- ❌ Too much decorative animation
- ❌ Interferes with operations
- ❌ Meaningless movements

---

## 📐 **Spacing System**

### **Unified Intervals**

```css
/* Base unit: 4px */
--space-1: 4px;   /* Fine adjustments */
--space-2: 8px;   /* Between related elements */
--space-3: 12px;  /* Text and boundaries */
--space-4: 16px;  /* Standard element spacing */
--space-5: 20px;  /* Within sections */
--space-6: 24px;  /* Slightly larger */
--space-8: 32px;  /* Between sections */
--space-10: 40px; /* Top screen margin */
```

### **Usage Rules**

- **Screen top**: 40px (breathing room)
- **Between sections**: 32px
- **Between elements**: 16px
- **Text and boundaries**: 12px (eliminate cramped feeling)

---

## 📱 **Book Vault Specific Improvement Proposals**

### **Micro-interactions**

- Progress bar during registration
- Confirmation animation for deletion
- Skeleton loading for search results

### **Data Visualization Improvements**

```
❌ Amateur: "You have 15 books"
✅ Professional: "3 books added this month | Average 5.2 books/month pace"
```

---

## 🚀 **Phased Implementation Plan**

### **Phase 1: Eliminate Flat Look**

**Duration**: 1 week

1. **Add background texture** (subtle gradient + noise)
2. **Systematize shadows** (define 3 depth levels)
3. **Card floating effect** (micro elevation on hover)

### **Phase 2: Accent Strategy**

**Duration**: 1 week

1. **Redefine color hierarchy**
2. **Color coding by importance**
3. **Apply one-accent-per-screen rule**

### **Phase 3: Add Movement**

**Duration**: 1 week

1. **Smooth screen transitions**
2. **State change feedback**
3. **Loading state expressions**

### **Phase 4: Clarify State Changes**

**Duration**: 1 week

- Registration completion feedback
- Natural disappearance on deletion
- Kind error state expressions

---

## 🎯 **Success Metrics**

### **Qualitative Metrics**

- Users want to "open it again"
- Users want to say "I'm using this app"

### **Quantitative Metrics**

- App launch to main feature in 3 taps or less
- Animation duration under 300ms
- Color usage within 5 colors (+ grayscale)

---

## 📚 **Reference Materials & Inspiration**

### **Design System References**

- Apple Human Interface Guidelines
- Material Design 3
- Ant Design System

### **Animation References**

- Framer Motion examples
- Lottie animations
- CSS animation libraries

### **Color Theory**

- 60-30-10 rule
- Color psychology in UI
- Accessibility color contrast

---

## 🔄 **Continuous Improvement Points**

### **Regular Reviews**

- Monthly design reviews
- User feedback collection
- Competitive app trend research

### **Implementation Considerations**

- Don't sacrifice performance
- Always consider accessibility
- Balance implementation cost and effectiveness

### **Long-term Evolution**

- UI evolution matching user growth
- Design consistency when adding new features
- Brand identity strengthening

---

### 必須事項

**`doc/`配下のファイルは絶対にコミットしないで**
