# Estado del proyecto

Notas de trabajo del refactor de arquitectura (21–22 sep 2026) y de lo que
queda pendiente. Complementa al `README.md`, que explica cómo levantar el
proyecto; esto explica en qué estado está y qué falta.

> Escrito en español para acompañar al README. Los comentarios del código
> siguen en inglés, como estaban.

---

## Estado actual

Todo en verde al cierre del 22/09/2026:

| Chequeo | Comando | Estado |
| --- | --- | --- |
| Tipos frontend | `npx tsc -b frontend` | ✅ |
| Tipos backend | `npm run typecheck -w backend` | ✅ |
| Lint | `npm run lint` | ✅ 0 errores |
| Tests | `npm run test:ci` | ✅ 39 pasando |
| Build frontend | `npm run build -w frontend` | ✅ |
| Build backend | `npm run build -w backend` | ✅ |

311 archivos, ~22.900 líneas. **Ningún archivo supera las 250 líneas** (el más
grande es `DashboardHome.module.scss`, 245).

⚠️ **Nada está commiteado todavía.** Todo vive en el working tree.

---

## Convenciones que dejó el refactor

Si agregás código, seguí esto — es lo que mantiene el repo consistente.

### Tamaño y estructura
- Ningún archivo pasa de 250 líneas. Para partir un componente: `hooks/`,
  `modals/`, `tabs/` y subcomponentes al lado.
- Para partir una hoja de estilos: un `.module.scss` hermano por subcomponente,
  o un `_parcial.scss` que el módulo importe con `@use` (mantiene el mismo
  scope de CSS Modules).
- **Un `_parcial.scss` cargado con `@use` NO recibe el import de mixins que
  inyecta vite**, así que tiene que empezar con
  `@use "@/styles/mixins" as m;` por su cuenta.

### Estilos
- Cero colores, breakpoints, radios, sombras o z-index crudos en componentes.
  Todo sale de `frontend/src/styles/_tokens.scss` y de `respond-to()` en
  `_breakpoints.scss`.
- Los únicos valores literales del proyecto viven en `_tokens.scss`, que es
  donde corresponde.

### Contrato compartido
- Reglas de validación, etiquetas visibles y manejo de tiempo se definen **una
  sola vez** en `@odonto/shared` (`validation.ts`, `enums.ts`, `time.ts`).
- Las opciones de los `<select>` salen de `data/formOptions.ts`, derivadas de
  los sets de `shared`, para que un formulario no pueda ofrecer un valor que la
  API rechace.

### Tiempo (importante)
- La clínica trabaja en `CLINIC_TIME_ZONE`
  (`America/Argentina/Buenos_Aires`, UTC−3).
- **Nunca armes un timestamp de turno a mano.** Usá `clinicTimeToUtc` /
  `utcToClinicTime` de `shared`: en el navegador vía
  `frontend/src/utils/clinicTime.ts`, en el server vía
  `backend/src/lib/dates.ts`.
- Un `` `T${hora}:00.000Z` `` literal en el código **siempre es un bug**.

### Backend
- Las rutas son solo HTTP glue: validar → llamar al service → responder.
  Las reglas de negocio viven en `backend/src/services/`.
- Los esquemas zod están en `backend/src/schemas/`.
- CRUD repetido sale de `lib/repository.ts`; los mapeos de Firestore usan los
  helpers tipados de `lib/firestore.ts` (nada de `Record<string, any>`).

### Formularios
- react-hook-form + zod en todos lados. No hay un segundo sistema de forms.

---

## Lo que se hizo

### Sistema de diseño
Se creó `frontend/src/styles/` con `_tokens.scss`, `_breakpoints.scss`,
`_mixins.scss` y `_reset.scss`, y se normalizaron las 51 hojas de estilo:
**cero colores crudos, cero rgb crudos, cero media queries crudas** en
componentes. ~1.500 literales pasaron a tokens; 105 colores distintos
colapsaron en una paleta; una escala de z-index reemplazó la colisión de `1000`
que compartían 9 componentes. Se arreglaron 3 tokens que se usaban sin estar
definidos (`--border-radius-md`, `--border-radius-full`, `--blue`).

### Arquitectura
- `shared/` partido en `enums` / `api` / `validation` / `time` / `dto/*`.
- Backend re-estratificado: rutas finas, `services/*`, `schemas/*`,
  `lib/repository.ts`, `lib/firestore.ts`. `auth.routes.ts` pasó de 242 a 129
  líneas; `appointments.routes.ts` de 145 a 73.
- Frontend partido: `PatientTreatmentSection` de 808 líneas a 23 archivos
  (máx. 176), `PatientHistorySection` de 609 a 8 (máx. 82), más Register,
  ContactPage, SearchModal, Appointment, MoreInfoModal, DentalGame,
  ServiceInfoModal, AdminStockSection y las secciones de turnos.
- Piezas reutilizables nuevas: `Modal`/`FormModal` (con Escape, scroll-lock y
  foco), `Field` detrás de Input/Textarea/Select, `PasswordInput`,
  `SupportShell`, `DashboardHome`, `DataTable` genérico, y los hooks
  `useApi`, `useRateLimit`, `useResponsiveValue`, `useEditableList`,
  `useIndexedForm`.

### Limpieza
Se eliminaron: la dependencia `react-icons` (se usaba para un solo ícono), el
componente huérfano `ClinicHistory`, 4 imágenes sin usar, 49 directivas
`"use client"` (sobra en Vite), ~12 tipos muertos, el `useForm` propio (había
dos sistemas de formularios), 141 reglas CSS muertas, y `desktop.ini` del
control de versiones.

### Bugs arreglados
- **Zona horaria**: `CLINIC_TIMEZONE` estaba declarada y nunca se usaba; todo
  corría en UTC. Un turno de las 09:00 se guardaba como 09:00Z = 06:00 real, el
  filtro de "horario ya pasado" escondía el turno de las 9 a las 7 de la
  mañana, y "turnos hoy" contaba una ventana corrida 3 horas. Verificado con
  las 1460 combinaciones slot/día de 2026.
- **`env.ts`**: `.replace(/\n/g, "\n")` era un no-op; debía ser `/\\n/g`.
- **"Turnos este mes"** no tenía cota superior: contaba también los futuros.
- **Reprogramar no chequeaba colisiones** — dos turnos podían caer en el mismo
  horario.
- **Las reservas no se validaban contra la grilla** — se podía reservar 03:17.
- **`isValidIsoDate("2026-02-31")`** devolvía `true`.
- **Contador de mensajes sin leer**: era read-then-write fuera de transacción;
  ahora usa `FieldValue.increment`.
- **Obra social `jersal`** aparecía en el alta pero no es un valor válido: ese
  registro siempre fallaba la validación.
- **Diálogos de edición inertes** (`onChange={() => {}}`) en ambas pantallas de
  turnos; ahora guardan de verdad.
- **Rutas del admin declaradas dos veces** (en `App.tsx` y en
  `AdminDashboard.tsx`), lo que anulaba el lazy loading: el chunk de
  `AdminDashboard` pasó de traer las 10 secciones a 444 bytes.
- **`AdminPatientHistory` no pasaba `isAdmin`**, así que el admin veía su
  propia historia (vacía) en lugar de la del paciente.
- **`AdminDashboard` tenía el nombre "Paula Cavaglia" hardcodeado.**

### Seguridad
La service-account key estaba en la raíz del repo **sin ignorar** (un
`git add .` la hubiera commiteado). Ahora vive fuera del repo en
`C:\Users\aleja\.secrets\firebase\odonto-lavalle-adminsdk.json`, cargada en
`backend/.env` (que sí está ignorado), y `.gitignore` cubre
`*serviceAccount*.json`, `*-adminsdk-*.json`, `*.pem` y `*.p12`.
La key vieja del proyecto equivocado (`vision-nocturna-api`) se borró.

---

## Lo que falta

### 1. Desplegar los índices de Firestore — BLOQUEANTE
Sin esto, **reservar un turno falla** con `FAILED_PRECONDITION`. Las
definiciones ya están en `firestore.indexes.json` (6 índices).

La key de service-account no tiene permiso `datastore.indexAdmin`, así que
`npm run indexes -w backend` y `firebase deploy` dan 403. Opciones:

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:indexes --project odonto-lavalle
```

o darle a esa service account el rol **Cloud Datastore Index Admin** en IAM y
correr `npm run indexes -w backend`.

Después, verificar:
```bash
curl "http://localhost:4000/api/appointments/availability?date=2026-10-15"
```

### 2. Desplegar las reglas de Firestore
`firestore.rules` está escrito (deny-all: todo pasa por el Admin SDK, que
saltea las reglas, así que una web API key filtrada no llega a los datos de
pacientes). **No lo desplegué** — revisalo primero y después agregá
`firestore:rules` al deploy.

### 3. Decisiones de producto pendientes
- **Obras sociales**: "Jerárquicos Salud" y "SADAIC" aparecen en la página
  pública pero no son valores válidos de `INSURANCES` en `shared`. ¿Se agregan
  o se sacan los logos?
- **Notificaciones del dashboard**: los feeds de actividad en
  `frontend/src/data/dashboardHome.ts` son placeholders fijos. Un paciente ve
  "Próximo turno confirmado 16/12/2025" sea cual sea su turno real. No hay
  endpoint. ¿Se sacan hasta que exista?
- **Header y Footer públicos** se renderizan también en los dashboards
  (`App.tsx`). Venía así; ¿debería ser distinto?

### 4. Features a medio hacer (documentadas, no rotas)
- **Subida de avatar**: solo preview, no hay endpoint de Storage.
- **Odontograma, línea de tiempo y tarjetas de turnos** en
  `PatientTreatmentSection`: viven en estado local con datos semilla de
  `data/treatmentSeed.ts`. No hay API detrás; los cambios se pierden al
  recargar.
- Se eliminaron 3 modales de `PatientHistorySection` que no hacían nada (el
  botón de guardar solo cerraba el diálogo) y la sección de "Tratamientos",
  que estaba fija en `[]` y nunca podía mostrar nada. Están en el historial de
  git si se quieren recuperar.

### 5. Escalabilidad (no urgente)
- `listPatients` y `listAppointments` paginan en memoria después de traer la
  colección entera. Está bien a escala de consultorio; si crece, mover el
  filtrado a Firestore o a un buscador externo.

---

## Trampa conocida de la herramienta

La Bash tool **se come los backslashes**, incluso dentro de heredocs citados y
de `node -e`. Cualquier edición que contenga `\\` (escapes de regex, un `\n` en
un reemplazo) tiene que hacerse con las tools de archivo, no por shell. Esto
corrompió `env.ts` dos veces antes de detectarse.

---

## Arranque rápido

```bash
npm install
npm run dev          # frontend en :5173
npm run dev:api      # backend en :4000
npm run test:ci      # 39 tests
npm run lint
```

La key de Firebase ya está cargada en `backend/.env` (proyecto
`odonto-lavalle`). Si hay que regenerarla: Firebase Console → Configuración del
proyecto → Cuentas de servicio → Generar nueva clave privada, y pegar
`client_email` y `private_key` en el `.env` (la private key va entre comillas
dobles, con los `\n` escapados).
