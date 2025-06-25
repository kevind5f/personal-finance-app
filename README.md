# Personal Finance App

Una aplicación de finanzas personales construida con Nuxt 3, Vue 3 y TypeScript.

## 🚀 Preparación para Producción

### 1. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Variables de entorno para producción
NODE_ENV=production
JWT_SECRET=tu-clave-secreta-super-segura-aqui
API_BASE=https://tu-dominio.com
PORT=3000

# Configuración de base de datos (para futuras migraciones)
DATABASE_URL=mongodb://localhost:27017/personal-finance
```

### 2. Scripts de Producción

El proyecto incluye los siguientes scripts:

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de producción
npm run preview

# Generación estática (SSG)
npm run generate
```

### 3. Despliegue

#### Opción A: Despliegue en Vercel (Recomendado)

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Despliega:
```bash
vercel --prod
```

#### Opción B: Despliegue en Netlify

1. Construye el proyecto:
```bash
npm run build
```

2. Sube la carpeta `.output` a Netlify

#### Opción C: Despliegue en servidor propio

1. Construye el proyecto:
```bash
npm run build
```

2. Inicia el servidor:
```bash
node .output/server/index.mjs
```

### 4. Configuración de Base de Datos

**⚠️ IMPORTANTE**: Actualmente el proyecto usa JSON como base de datos. Para producción, se recomienda migrar a una base de datos real como MongoDB o PostgreSQL.

#### Migración a MongoDB (Recomendado)

1. Instala MongoDB:
```bash
npm install mongodb
```

2. Actualiza las variables de entorno:
```bash
DATABASE_URL=mongodb://localhost:27017/personal-finance
```

3. Crea un servicio de base de datos MongoDB (ver `server/database/mongodb.ts`)

### 5. Seguridad

- [ ] Cambia `JWT_SECRET` por una clave segura
- [ ] Configura HTTPS en producción
- [ ] Implementa rate limiting
- [ ] Configura CORS apropiadamente
- [ ] Valida todas las entradas de usuario

### 6. Monitoreo y Logs

- [ ] Configura logging (Winston o similar)
- [ ] Implementa monitoreo de errores (Sentry)
- [ ] Configura métricas de rendimiento

### 7. Backup y Recuperación

- [ ] Configura backups automáticos de la base de datos
- [ ] Implementa estrategia de recuperación de desastres

## 🛠️ Desarrollo

### Instalación

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

### Estructura del Proyecto

```
personal-finance-app/
├── components/          # Componentes Vue
├── pages/              # Páginas de la aplicación
├── server/             # Backend API
│   ├── api/           # Endpoints de la API
│   ├── database/      # Servicios de base de datos
│   └── middleware/    # Middleware del servidor
├── store/             # Estado global (Pinia)
├── assets/            # Recursos estáticos
└── public/            # Archivos públicos
```

## 📝 Notas de Producción

- La aplicación actualmente usa JSON como base de datos
- Se recomienda migrar a MongoDB o PostgreSQL para producción
- Configura variables de entorno apropiadas
- Implementa autenticación robusta
- Configura backups regulares

## 🔧 Troubleshooting

### Problemas comunes:

1. **Error de CORS**: Verifica la configuración en `nuxt.config.ts`
2. **Base de datos no encontrada**: Asegúrate de que `db.json` existe
3. **Errores de JWT**: Verifica que `JWT_SECRET` esté configurado

## 📄 Licencia

MIT
