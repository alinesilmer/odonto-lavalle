# Odonto Lavalle

Sitio y sistema de gestión para Lavalle Odontología Integral: sitio público,
reserva de turnos, panel del paciente y panel administrativo.

## Estructura (monorepo con npm workspaces)

```
odonto-lavalle/
├── shared/     Tipos compartidos (el contrato de la API). Sin build propio.
├── frontend/   React 19 + Vite + TypeScript + SCSS modules
└── backend/    Express 5 + firebase-admin (Auth + Firestore)
```

`shared/` se consume desde el código fuente (`@odonto/shared`), así que no hace
falta compilarlo antes de levantar nada.

> Estado del refactor, convenciones vigentes y pendientes:
> [`PROJECT_STATUS.md`](./PROJECT_STATUS.md).

## Requisitos

- Node.js 20 o superior
- Un proyecto de Firebase con Authentication (email/contraseña) y Firestore

## Puesta en marcha

```bash
npm install                 # instala los tres workspaces de una vez
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Completá `backend/.env` con las credenciales de una **service account**
(Firebase console → Configuración del proyecto → Cuentas de servicio → Generar
nueva clave privada). Los tres valores que necesitás del JSON descargado son
`project_id`, `client_email` y `private_key`.

También necesitás `FIREBASE_WEB_API_KEY` (Configuración del proyecto → General →
tu app web → `apiKey`): el Admin SDK no puede verificar contraseñas, así que el
login pasa por la API REST de Identity Toolkit.

Después:

```bash
npm run dev        # frontend en http://localhost:5173
npm run dev:api    # backend  en http://localhost:4000
```

Los dos comandos corren en terminales separadas.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Vite dev server (frontend) |
| `npm run dev:api` | API con recarga en caliente (backend) |
| `npm run build` | Compila frontend y backend |
| `npm run lint` | ESLint sobre el frontend |
| `npm run test:ci` | Tests del frontend |
| `npm run firebase:cleanup` | Vacía Firestore (ver abajo) |

## Mantenimiento de Firebase

**Vaciar Firestore sin tocar los usuarios.** Borra todos los documentos y
subcolecciones; las cuentas de Firebase Authentication quedan intactas.

```bash
npm run cleanup -w backend -- --dry-run   # muestra qué borraría, no borra nada
npm run cleanup -w backend -- --yes       # borra de verdad (irreversible)
```

**Reconstruir los perfiles después de vaciar.** Como el cleanup conserva los
usuarios pero borra su documento `patients/{uid}`, hay que regenerarlos o
`/auth/me` devuelve 404 y nadie puede entrar:

```bash
npm run seed -w backend -- --admin=tu-email@ejemplo.com
```

El flag `--admin=` marca esa cuenta con el claim `role: "admin"`. Se puede pasar
más de una vez. El resto de los usuarios quedan como pacientes.

## API

Todo cuelga de `/api`. Las rutas protegidas esperan
`Authorization: Bearer <ID token>`; el rol vive en un custom claim de Firebase,
así que el cliente no puede falsificarlo.

| Recurso | Rutas |
|---|---|
| Auth | `POST /auth/register` `/auth/login` `/auth/refresh` `/auth/logout` `/auth/forgot-password` `/auth/change-password`, `GET|PATCH /auth/me` |
| Turnos | `GET /appointments` `GET /appointments/availability?date=` `POST /appointments` `PATCH /appointments/:id` `DELETE /appointments/:id` |
| Pacientes | `GET /patients` `GET|PATCH /patients/:id` |
| Historia clínica | `GET|POST /patients/:id/history` `DELETE /patients/:id/history/:recordId` |
| Tratamiento | `GET|PUT /patients/:id/treatment` |
| Mensajes | `GET /conversations` `GET|POST /conversations/:id/messages` |
| Soporte | `GET|POST /support` `PATCH /support/:id` |
| Stock | `GET|POST /stock` `PUT|DELETE /stock/:id` |
| Recordatorios | `GET|POST /reminders` `PATCH|DELETE /reminders/:id` |
| Estadísticas | `GET /stats/summary` `GET /stats/charts` |
| Público | `POST /public/contact` `/public/newsletter` `/public/message` |

Los errores siempre vuelven como
`{ error: { code, message, details? } }`, donde `details` mapea campo → mensaje
para pintarlo directo en el formulario.

## Notas

- Las reservas se hacen dentro de una transacción de Firestore, así que dos
  pacientes no pueden quedarse con el mismo horario.
- Los pacientes no se borran: se marcan como `inactive`, para no perder sus
  turnos ni su historia clínica.
- `frontend/src/data/` guarda solo contenido estático del sitio (servicios,
  FAQs, testimonios, datos de contacto), no datos de usuarios.

## Pendientes

- Subida de archivos (avatares y documentos clínicos) — falta el endpoint de
  Cloud Storage; hoy la UI solo muestra una vista previa local.
- Bloqueo de franjas horarias en el panel de turnos.
- Planes de tratamiento anidados (tratamiento → archivo → entrada) en la
  historia clínica: la UI existe, el endpoint no.
- Odontograma y línea de tiempo del tratamiento: solo estado local.
