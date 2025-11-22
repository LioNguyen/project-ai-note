# AI Copilot Instructions for Project AI Note

## 0. Critical Rules Reference

**ALWAYS follow these foundational rules:**

- **Refer to `.ai/rules/technical-architecture-rule.md`** for all technical specifications, project structure, technology stack, and implementation patterns
- **Follow core development principles:**
  - **Build Validation**: Execute `bun run type-check` → `bun run lint` → `bun run build` before completing code tasks
  - **Documentation-First**: Always scan `.ai/documents/` and `.ai/rules/` before starting work
  - **Code Quality**: Maintain strict TypeScript, proper error handling, and end-to-end type safety
  - **Full-Stack Thinking**: Consider impacts across frontend, backend, and database layers
- **Architecture Priority**: Technical architecture rules take precedence over general preferences

## 1. Development Workflow Standards

### 1.1 Task Initialization

**Before starting ANY task:**

1. Check `.ai/documents/` for relevant existing documentation
2. Review `.ai/rules/technical-architecture-rule.md` for applicable patterns and specifications
3. Create or update documentation before coding
4. Identify which layers (frontend/backend/both) are affected
5. Plan API contracts and data flows if backend is involved
6. Ask clarifying questions if requirements are ambiguous

### 1.2 Build Validation (Code Tasks Only)

**For ALL code-related tasks:**

1. Run `bun run type-check` to verify TypeScript compilation
2. Run `bun run lint` to ensure code quality
3. Run `bun run build` to verify production compilation
4. If any step fails, resolve errors immediately before completing the task
5. Never commit code that fails build validation

**Documentation-only tasks do NOT require build validation.**

## 2. Code Communication Standards

### 2.1 Language & Clarity

- **Use English**: Respond exclusively in English to ensure clear communication
- **Be Concise**: Provide straightforward answers, avoiding unnecessary complexity in explanations
- **Avoid Verbosity**: Keep responses focused and direct

### 2.2 Code Comments & Explanation

- **Detailed Comments**: Include inline comments for key functions and complex logic
- **Clarify Rationale**: Explain the "why" behind specific code choices
- **Document Edge Cases**: Highlight potential issues and their solutions
- **Explain Trade-offs**: Discuss performance vs. readability trade-offs when relevant

### 2.3 Code Quality Principles

- **Follow Best Practices**: Adhere to coding standards and refactoring principles:
  - Avoid unnecessary object copying or cloning
  - Limit nesting and encourage early returns
  - Implement proper error handling and validation
- **Code Readability**: Ensure code is easy to read with consistent naming and organization
- **Performance Optimization**: Prioritize efficient algorithms and effective memory use
- **Type Safety**: Maintain strict TypeScript usage (no implicit `any` types)

## 3. Development Approach

### 3.1 Code Smells & Refactoring

**Identify and suggest fixes for:**

- **Mysterious Names**: Propose descriptive naming improvements
- **Duplicate Code**: Recommend extraction into shared utilities or functions
- **Long Functions**: Suggest decomposition into focused, single-responsibility functions
- **Large Files**: Propose logical splitting strategies
- **Over-Engineering**: Minimize unnecessary complexity and large class hierarchies

### 3.2 Interactive & Iterative Development

- **Keep It Manageable**: Break large tasks into smaller, manageable steps
- **Encourage Small Changes**: Recommend smaller, focused changes rather than large refactors
- **Iterative Approach**: Suggest incremental changes for easier review and testing
- **Consolidate When Needed**: If generated code exceeds 20 lines, suggest consolidating for clarity

### 3.3 Test-Driven Development

- **Push for Testing**: Emphasize the importance of a strong test suite
- **Test Examples**: Request examples of test cases when making significant changes
- **Coverage Focus**: Encourage testing of critical components and services
- **Refactoring Tests**: Ensure tests accompany refactoring changes

## 4. Interaction & Learning

### 4.1 Personalized Assistance

- **Customized Responses**: Adapt interactions based on project context and needs
- **Ask Clarifying Questions**: Seek clarification when requests are ambiguous
- **Proactive Suggestions**: Offer improvements beyond the immediate request
- **Context-Aware**: Adapt responses based on project structure and current task

### 4.2 Learning & Knowledge Sharing

- **Foster Learning**: Provide references and documentation links
- **Explain "Why"**: Focus on reasoning behind decisions, not just "what"
- **Best Practices**: Share industry-standard approaches and patterns
- **Continuous Education**: Help build understanding of architectural decisions

### 4.3 Performance & Optimization

- **Efficiency First**: Prioritize performance in algorithm suggestions
- **Memory Management**: Consider memory implications of proposed solutions
- **Parallelization**: Seek opportunities for optimizing through parallelization
- **Mac-Specific**: Account for performance considerations on Mac systems

### 4.4 Feedback & Continuous Improvement

- **Iterative Learning**: Adjust suggestions based on feedback and coding style
- **Context Adjustment**: Align behavior with current tech stack and patterns
- **Continuous Improvement**: Refine approaches based on project evolution
- **Pattern Recognition**: Learn and adapt to established project patterns

## 5. Quality Assurance

### 5.1 Code Review Standards

1. Ensure code passes all build validation steps
2. Verify TypeScript types are correct
3. Check for proper error handling
4. Confirm documentation is updated
5. Validate performance implications
6. Review for code smells and refactoring opportunities

---

**Remember**: These instructions prioritize build validation and code quality. Always refer to `.ai/rules/technical-architecture-rule.md` for specific technical patterns and specifications. Make every decision with full-stack thinking in mind.
