# 프로젝트 생성

1. npm create-vite todo-app --template react


# 의존성 설치
## 핵심 라이브러리 설치

npm install react-router-dom @tanstack/react-query @tanstack/react-query-devtools
npm install axios react-hook-form sweetalert2 lucide-react dayjs
npm install @ckeditor/ckeditor5-build-classic @ckeditor/ckeditor5-react

## tailwind 설치

npm install -D tailwindcss @tailwindcss/vite    

- vite.config.js

```
import tailwindcss from '@tailwindcss/vite'
plugins : [react(), tailwindcss()],
```
/* src/index.css */
@import "tailwindcss";