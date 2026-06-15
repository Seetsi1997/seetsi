window.addEventListener('partialsLoaded', function () {
    const SKILL_DATA = {
        "Java": {
            category: "Languages",
            desc: "A class-based, object-oriented language built for portability and scalability. Java powers backend services through frameworks like Spring Boot and is widely used in enterprise systems, Android development, and APIs.",
            tags: ["OOP", "JVM", "Spring Boot", "Backend"]
        },
        "C#": {
            category: "Languages",
            desc: "A statically typed, multi-paradigm language developed by Microsoft. C# is the backbone of .NET applications — from REST APIs to Blazor web UIs, ASP.NET Core services, and desktop software.",
            tags: [".NET", "ASP.NET Core", "Blazor", "OOP", "Microsoft"]
        },
        "Dart": {
            category: "Languages",
            desc: "A modern, strongly typed language optimised for client-side development. Dart is primarily used with Flutter to build cross-platform mobile and web apps from a single codebase.",
            tags: ["Flutter", "Cross-platform", "Mobile", "Google"]
        },
        "HTML": {
            category: "Languages",
            desc: "The standard markup language for structuring web content. HTML defines the skeleton of every web page — headings, sections, links, forms, and media — and is the starting point for all front-end work.",
            tags: ["Markup", "Web", "Frontend", "Semantic HTML"]
        },
        "CSS": {
            category: "Languages",
            icon: "🎨",
            desc: "The styling language of the web. CSS controls layout, typography, colours, animations, and responsiveness — turning raw HTML into polished, visually consistent user interfaces.",
            tags: ["Styling", "Flexbox", "Grid", "Responsive", "Animations"]
        },
        "SQL": {
            category: "Languages",
            desc: "Structured Query Language — the standard for managing and querying relational databases. SQL is used to create, read, update, and delete data, as well as define schemas and manage table relationships.",
            tags: ["PostgreSQL", "Queries", "Relational DB", "Joins", "Migrations"]
        },
        "Spring Boot": {
            category: "Frameworks & Libraries",
            desc: "An opinionated Java framework for building production-grade REST APIs and microservices. Spring Boot handles configuration, dependency injection, and request routing, letting you focus on business logic.",
            tags: ["Java", "REST API", "Microservices", "Backend", "Maven"]
        },
        "RESTful APIs": {
            category: "Frameworks & Libraries",
            desc: "An architectural style for designing web services. RESTful APIs communicate over HTTP using standard verbs (GET, POST, PUT, DELETE) and return structured data — typically JSON — consumed by frontends or other services.",
            tags: ["HTTP", "JSON", "API Design", "Endpoints", "Stateless"]
        },
        "Angular": {
            category: "Frameworks & Libraries",
            desc: "A TypeScript-based front-end framework by Google. Angular provides a complete solution for building scalable SPAs, with built-in routing, forms handling, dependency injection, and reactive state via RxJS.",
            tags: ["TypeScript", "SPA", "RxJS", "Components", "Google"]
        },
        "Blazor": {
            category: "Frameworks & Libraries",
            desc: "A .NET framework for building interactive web UIs in C# instead of JavaScript. Blazor Server renders components server-side with real-time SignalR connections, while Blazor WebAssembly runs directly in the browser.",
            tags: ["C#", ".NET", "WebAssembly", "Server-side", "Components"]
        },
        "Flutter": {
            category: "Frameworks & Libraries",
            desc: "Google's UI toolkit for building natively compiled apps for mobile, web, and desktop from a single Dart codebase. Flutter uses its own rendering engine for pixel-perfect, fast UIs across all platforms.",
            tags: ["Dart", "Mobile", "Cross-platform", "Widgets", "Google"]
        },
        "Git": {
            category: "Developer Tools",
            desc: "The industry-standard distributed version control system. Git tracks changes across a codebase, enables branching and merging workflows, and is the foundation for collaboration on any software project.",
            tags: ["Version Control", "Branching", "Merging", "Commits"]
        },
        "Github": {
            category: "Developer Tools",
            desc: "A cloud-based hosting platform for Git repositories. GitHub enables team collaboration through pull requests, code reviews, issue tracking, and CI/CD pipelines — and serves as a public portfolio for open-source work.",
            tags: ["Repositories", "Pull Requests", "Collaboration", "Open Source"]
        },
        "Postman": {
            category: "Developer Tools",
            desc: "An API testing and development platform. Postman lets you send HTTP requests, inspect responses, organise endpoints into collections, and automate API testing — essential for backend development and debugging.",
            tags: ["API Testing", "HTTP", "Collections", "Debugging"]
        },
        "Swagger": {
            category: "Developer Tools",
            desc: "A toolset for designing, documenting, and testing REST APIs using the OpenAPI specification. Swagger UI generates interactive API documentation directly from your code annotations, making endpoints explorable in the browser.",
            tags: ["OpenAPI", "Documentation", "API Design", "REST"]
        },
        "VS Code": {
            category: "Developer Tools",
            desc: "A lightweight but powerful source code editor by Microsoft. VS Code supports virtually every language and framework through its extensive extension marketplace, with built-in Git integration, debugging, and IntelliSense.",
            tags: ["Editor", "Extensions", "IntelliSense", "Debugging", "Microsoft"]
        },
        "IntelliJ": {
            category: "Developer Tools",
            desc: "A powerful IDE by JetBrains, primarily designed for Java and Kotlin development. IntelliJ offers deep code analysis, smart refactoring, integrated build tools, and robust framework support for Spring and other backends.",
            tags: ["IDE", "Java", "JetBrains", "Refactoring", "Spring"]
        },
        "Problem-Solving": {
            category: "Professional",
            desc: "The ability to break down complex technical challenges into manageable parts and work through them methodically. This spans debugging production issues, designing system architecture, and finding pragmatic solutions under constraints.",
            tags: ["Analytical Thinking", "Debugging", "Architecture", "Critical Thinking"]
        },
        "Technical Communication": {
            category: "Professional",
            desc: "The skill of clearly conveying technical concepts to both technical peers and non-technical stakeholders. This includes writing clean code documentation, presenting solutions, and translating requirements into implementation plans.",
            tags: ["Documentation", "Presentations", "Clarity", "Stakeholders"]
        },
        "Team Collaboration": {
            category: "Professional",
            desc: "Working effectively within a development team — participating in code reviews, communicating blockers, aligning on architecture decisions, and contributing to a shared codebase while respecting team conventions and processes.",
            tags: ["Code Reviews", "Agile", "Communication", "Pair Programming"]
        }
    };

    function openSkillDrawer(skillName) {
        const data = SKILL_DATA[skillName];
        if (!data) return;

        document.getElementById("skillDrawerName").textContent = skillName;
        document.getElementById("skillDrawerCategory").textContent = data.category;
        document.getElementById("skillDrawerDesc").textContent = data.desc;

        const tagsContainer = document.getElementById("skillDrawerTags");
        tagsContainer.innerHTML = data.tags
            .map(t => `<span class="skill-drawer-tag">${t}</span>`)
            .join("");

        document.getElementById("skillDrawer").classList.add("active");
        document.getElementById("skillOverlay").classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeSkillDrawer() {
        document.getElementById("skillDrawer").classList.remove("active");
        document.getElementById("skillOverlay").classList.remove("active");
        document.body.style.overflow = "";
    }

    // Wire close buttons here — NOT via onclick in HTML
    document.getElementById("skillOverlay").addEventListener("click", closeSkillDrawer);
    document.getElementById("skillDrawerClose").addEventListener("click", closeSkillDrawer);

    // Escape key support
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeSkillDrawer();
    });

    document.querySelectorAll(".skill-tag").forEach(tag => {
        tag.addEventListener("click", () => openSkillDrawer(tag.textContent.trim()));
    });
});