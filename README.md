# CineFlix 📽️🍿  

Aplicación web para explorar películas y series consumiendo la API de TMDB.  
Incluye autenticación local, sugerencias de búsqueda, vista detallada con tráiler y reparto, y navegación entre secciones.

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación y uso](#instalación-y-uso)
- [Autenticación](#autenticación)
- [Qué puedes hacer dentro de la página](#qué-puedes-hacer-dentro-de-la-página)

---

## Descripción

**CineFlix** muestra cartelera de películas y series en tiempo real gracias a la API pública de TMDB.  
Permite registrarse o iniciar sesión, buscar títulos, ver información detallada (sinopsis, reparto principal, tráiler) y alternar rápidamente entre las secciones de *Películas* y *Series*.

---

## Tecnologías

- **HTML5**  
- **CSS3**  
- **JavaScript (Vanilla)**  
- **API** de [The Movie Database](https://www.themoviedb.org/)  
- **localStorage / sessionStorage** para la autenticación local

---

## Características

- **Registro & Login** con validación básica y sesión en `sessionStorage`.  
- **Usuario demo** pre‑cargado (`demo / 1234`).  
- Barra de **búsqueda** con sugerencias instantáneas (autocompletado).  
- Pestañas de navegación: **Inicio / Películas / Series**.  
- Carruseles “Populares”, “Mejor calificadas”, “Próximamente / En emisión”.  
- **Modal** con:
  - Información general y sinopsis.  
  - **Reparto principal** (fotos y nombres).  
  - Botón para ver **tráiler** de YouTube (cuando existe).  
- Diseño responsivo y ligero.

---

## Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari).  
- Conexión a Internet (para la API y los pósteres).  
- *No* requiere backend: todo corre como sitio estático.

---

## Instalación y uso

1. **Clona o descarga** el repositorio  
   ```bash
   git clone https://github.com/tu-usuario/cineflix.git
   cd cineflix

---

## Autenticación

| Tipo de acceso | Usuario | Contraseña |
| -------------- | ------- | ---------- |
| Demo           | `demo`  | `1234`     |

  * También puedes registrar una cuenta nueva desde la pestaña Regístrate.
  * Los usuarios se guardan dentro de tu propio navegador mediante localStorage.

---

## Qué puedes hacer dentro de la página

1. Iniciar sesión como demo o registrar tu propia cuenta.
2. Explorar la sección Películas (por defecto) o cambiar a Series con un clic en la barra superior.
3. Usar la barra de búsqueda para encontrar títulos; las sugerencias se actualizan mientras escribes.
4. Hacer clic en cualquier póster para abrir un modal con:
  * Imagen grande, sinopsis y metadatos (año, duración, géneros, puntuación).
  * Reparto principal con fotos y nombres.
  * Botón para ver el tráiler (video incrustado de YouTube).
5. Desplazarte por los carruseles mediante los botones laterales “‹ / ›”.
6. Cerrar sesión desde el enlace en la esquina superior derecha; volverás a la pantalla de login.
