## User Preferences Rules for AI Interaction

### 0. **Project Architecture Compliance**

- **Follow Core Development Rules**: ALWAYS adhere to the principles and guidelines defined in `.ai/rules/core-development-rule.md`
- **Follow Technical Architecture**: ALWAYS follow the technical architecture standards and patterns defined in `.ai/rules/technical-architecture-rule.md`
- **Critical Rules Priority**: These architectural documents take precedence over general preferences when conflicts arise
- **Documentation-First**: Follow the documentation-first development approach mandated in core rules
- **Build Validation**: Execute build validation process for all code-related tasks as specified in core rules

**Key Architecture Requirements:**

- This is a Next.js 16.0.1 application with App Router and full-stack capabilities
- Use route groups for separation: `(backend)` for API routes, `(frontend)` for pages
- Follow service layer pattern: `route.ts`, `route.services.ts`, `route.types.ts`
- Apply Atomic Design for components: atoms → molecules → organisms
- Use Tailwind CSS with shadcn/ui for all styling (never plain CSS or other frameworks)
- Implement proper TypeScript typing with Zod validation
- Support English/Vietnamese internationalization via custom i18n system
- Extract reusable utilities to `core/utils` directories (backend and frontend)

### 1. **Language & Clarity**

- **Use English**: Respond exclusively in English to ensure clear communication
- **Be Concise**: Provide straightforward answers, avoiding unnecessary complexity or verbosity in explanations

### 2. **Commenting & Explanation**

- **Detailed Comments**: Include inline comments in any code examples, especially for key functions and complex logic
- **Clarify Key Points**: When discussing technical concepts or providing code snippets, explain the rationale behind specific choices
- **Document Edge Cases**: Highlight potential issues and their solutions

### 3. **Code Standards & Quality**

- **Follow Best Practices**: Adhere strictly to coding standards and refactoring principles, including:
  - Avoiding unnecessary object copying or cloning
  - Limiting nesting and encouraging early returns for better readability
  - Implementing appropriate error handling and validation
- **Code Readability**: Ensure code is easy to read and well-structured, following consistent naming conventions and organization
- **Performance Optimization**: Prioritize efficient algorithms and effective memory use, especially for applications running on Mac systems

### 4. **Interactive Development**

- **Keep It Manageable**: Break large tasks into smaller, manageable steps
- **Request Small Steps**: Encourage breaking tasks into smaller changes, especially for refactoring
- **Iterative Approach**: Encourage incremental changes for easier review and testing

### 5. **Error Identification & Suggestions**

- **Highlight Code Smells**: Identify common code smells and request actionable solutions:
  - **Mysterious Names**: Request descriptive naming suggestions
  - **Duplicate Code**: Seek refactoring suggestions for shared functions
  - **Long Functions**: Propose decomposition into smaller, single-responsibility functions
  - **Large Files**: Propose logical splitting strategies

### 6. **Test Integration**

- **Push for Test-Driven Changes**: Emphasize the importance of a strong test suite; request examples of test cases when making significant code changes or refactoring

### 7. **Documentation Standards**

- **Table of Contents**: Always create or update a Table of Contents at the top of any generated or updated documentation
- **Numeric Headings**: Follow numeric structure for headings and subheadings (e.g., `1. Section Title`, `1.1 Sub-section Title`)
- **Comprehensive Style**: Provide thorough explanations that clarify purpose and usage rather than just descriptions of functionality
- **Code Examples**: Include practical examples with clear context

### 8. **Learning & Improvement**

- **Foster Learning**: Provide references and documentation links for suggested practices
- **Explain "Why"**: Focus on reasoning behind decisions, not just "what"
- **Best Practices**: Share industry-standard approaches and patterns

### 9. **Personalized Assistance**

- **Customized Responses**: Adapt interactions based on individual project needs and context
- **Question Encouragement**: Ask clarifying questions if the request seems ambiguous
- **Proactive Suggestions**: Offer improvements beyond the immediate request
- **Context-Aware**: Adapt responses based on project structure and current task

### 10. **Performance Focus**

- **Efficiency First**: Prioritize performance in algorithm and implementation suggestions
- **Memory Management**: Consider memory implications of proposed solutions
- **Parallelization Suggestions**: Seek opportunities for optimizing code through parallelization
- **Optimization Opportunities**: Identify areas for performance improvements on Mac systems

### 11. **Feedback & Iteration**

- **Iterative Learning**: Adjust suggestions based on feedback to align with personal coding style
- **Context Adjustment**: Adjust behavior based on coding context (TypeScript patterns in TypeScript projects)
- **Continuous Improvement**: Refine approaches based on project evolution

### 4. **Interactive Development**

- **Keep It Manageable**: If generated code exceeds 20 lines, proactively suggest consolidating the code to maintain clarity while ensuring functionality.

- **Keep It Manageable**: Break large tasks into smaller, manageable steps- **Request Small Steps**: Encourage the AI to break tasks into smaller, manageable changes, especially for refactoring processes.

- **Iterative Approach**: Encourage incremental changes for easier review and testing

- **Request Small Steps**: Split refactoring into focused, testable changes### 5. **Error Identification & Suggestions**

### 5. **Error Identification & Solutions**- **Highlight Code Smells**: Identify common code smells and request actionable solutions:

- **Mysterious Names**: Request descriptive naming suggestions.

- **Highlight Code Smells**: Identify and suggest fixes for: - **Duplicate Code**: Seek refactoring suggestions for shared functions.

  - **Mysterious Names**: Propose descriptive naming improvements - **Long Functions**: Propose decomposition into smaller, single-responsibility functions.

  - **Duplicate Code**: Recommend extraction into shared utilities - Ensure aggressive suggestions on minimizing large classes and nested structures.

  - **Long Functions**: Suggest decomposition into focused functions

  - **Large Files**: Propose logical splitting strategies### 6. **Test Integration**

### 6. **Documentation Standards**- **Push for Test-Driven Changes**: Emphasize the importance of a strong test suite; request examples of test cases when making significant code changes or refactoring.

- **Table of Contents**: Always include TOC at the top of documentation### 7. **Documentation Standards**

- **Numeric Headings**: Follow numeric structure (e.g., `1. Title`, `1.1 Subtitle`)

- **Comprehensive Style**: Provide thorough explanations of purpose and usage- **Table of Contents**: Always create or update a Table of Contents at the top of any generated or updated documentation.

- **Code Examples**: Include practical examples with clear context- **Numeric Headings**: Any documentation generated must follow a numeric structure for headings and subheadings (e.g., `1. Section Title`, `1.1 Sub-section Title`).

- **Comprehensive Style**: Ensure documentation provides thorough explanations that clarify purpose and usage rather than just descriptions of functionality.

### 7. **Learning & Improvement**

### 8. **Learning & Improvement**

- **Foster Learning**: Provide references and documentation links

- **Explain "Why"**: Focus on reasoning behind decisions, not just "what"- **Foster Learning**: Encourage the AI to provide references or documentation links for suggested practices, enabling further learning and understanding.

- **Best Practices**: Share industry-standard approaches and patterns- **Suggest Documentation Styles**: Ask for clear explanations of code with a focus on "why" decisions are made.

### 8. **Personalized Assistance**### 9. **Personalized Assistance**

- **Context-Aware**: Adapt responses based on project structure and current task- **Customized Responses**: Adapt interactions based on individual project needs and context, not relying on generic responses.

- **Ask Questions**: Seek clarification when requests are ambiguous- **Question Encouragement**: Prompt the AI to ask clarifying questions if the request seems ambiguous or could be interpreted in multiple ways.

- **Proactive Suggestions**: Offer improvements beyond the immediate request

### 10. **Performance Optimization Insights**

### 9. **Performance Focus**

- **Focus on Efficiency**: When discussing algorithms or functionalities, prioritize suggestions that enhance performance and memory use, particularly on Mac systems.

- **Efficiency First**: Prioritize performance in algorithm and implementation suggestions- **Parallelization Suggestions**: Actively seek opportunities for optimizing code through parallelization without compromising clarity.

- **Memory Management**: Consider memory implications of proposed solutions

- **Optimization Opportunities**: Identify areas for performance improvements### 11. **Feedback & Iteration**

### 10. **Feedback & Iteration**- **Iterative Learning**: Provide feedback on suggestions to refine future AI behavior and ensure it aligns with personal coding style and effectiveness.

- **Behavior Adjustment**: Adjust the AI’s behavior based on coding context (e.g., prioritize Python tips when working in Python projects and TypeScript tips when in TypeScript).

- **Iterative Learning**: Adjust suggestions based on feedback
- **Context Adjustment**: Align behavior with current tech stack and patterns
- **Continuous Improvement**: Refine approaches based on project evolution
